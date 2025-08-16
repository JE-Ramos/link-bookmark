#!/usr/bin/env python3
"""
Advanced PopMart image downloader with progress bars and concurrent downloads.
"""

import json
import os
import re
import requests
from pathlib import Path
import time
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
import argparse

def sanitize_filename(filename):
    """Remove or replace characters that are invalid in filenames."""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    filename = ' '.join(filename.split())
    return filename[:200]

def download_image(args):
    """Download an image from URL to filepath."""
    url, filepath, img_idx, product_title = args
    try:
        if filepath.exists():
            return (True, f"{filepath.name} (exists)", img_idx)
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        # Download with progress
        total_size = int(response.headers.get('content-length', 0))
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        return (True, f"{filepath.name} ✓", img_idx)
    except Exception as e:
        return (False, f"{filepath.name} ✗ ({str(e)})", img_idx)

def process_product(product, output_dir, max_workers=5):
    """Process a single product and download its images."""
    product_id = product.get('id', 'unknown')
    product_title = product.get('title', 'untitled')
    banner_images = product.get('bannerImages', [])
    
    folder_name = f"{product_id}_{sanitize_filename(product_title)}"
    product_dir = output_dir / folder_name
    product_dir.mkdir(parents=True, exist_ok=True)
    
    download_tasks = []
    for img_idx, img_url in enumerate(banner_images, 1):
        if not img_url:
            continue
            
        parsed_url = urlparse(img_url)
        path_parts = parsed_url.path.split('/')
        original_filename = path_parts[-1] if path_parts else ''
        ext = '.jpg'
        if '.' in original_filename:
            ext = '.' + original_filename.split('.')[-1]
        
        filename = f"{product_id}_{img_idx:02d}{ext}"
        filepath = product_dir / filename
        
        download_tasks.append((img_url, filepath, img_idx, product_title))
    
    return product_title, folder_name, download_tasks

def download_all_images(all_tasks, max_workers=10):
    """Download all images using concurrent workers."""
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all download tasks
        future_to_task = {executor.submit(download_image, task): task 
                         for task in all_tasks}
        
        # Process completed downloads with progress bar
        with tqdm(total=len(all_tasks), desc="Downloading images") as pbar:
            for future in as_completed(future_to_task):
                result = future.result()
                results.append(result)
                pbar.update(1)
                pbar.set_postfix_str(result[1])
    
    return results

def main():
    """Main function to process all JSON files."""
    parser = argparse.ArgumentParser(description='Download PopMart product images')
    parser.add_argument('--workers', type=int, default=10, 
                       help='Number of concurrent download workers (default: 10)')
    parser.add_argument('--output', type=str, default='popmart_images',
                       help='Output directory name (default: popmart_images)')
    args = parser.parse_args()
    
    script_dir = Path(__file__).parent
    json_files = [
        script_dir / 'popmart_pages' / 'popmart_plush_page_1.json',
        script_dir / 'popmart_pages' / 'popmart_plush_page_2.json',
        script_dir / 'popmart_pages' / 'page_3.json'
    ]
    
    output_dir = script_dir / args.output
    output_dir.mkdir(exist_ok=True)
    
    print("PopMart Image Downloader (Advanced)")
    print("===================================")
    print(f"Output directory: {output_dir}")
    print(f"Workers: {args.workers}")
    
    # Check JSON files
    missing_files = [f for f in json_files if not f.exists()]
    if missing_files:
        print("\nError: Missing JSON files:")
        for f in missing_files:
            print(f"  - {f}")
        return
    
    # Collect all products and prepare download tasks
    all_products = []
    all_download_tasks = []
    
    print("\nAnalyzing products...")
    for json_file in json_files:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        products = data.get('productData', [])
        print(f"  {json_file.name}: {len(products)} products")
        
        for product in products:
            title, folder, tasks = process_product(product, output_dir, args.workers)
            all_products.append((title, folder, len(tasks)))
            all_download_tasks.extend(tasks)
    
    print(f"\nTotal products: {len(all_products)}")
    print(f"Total images: {len(all_download_tasks)}")
    
    # Download all images
    if all_download_tasks:
        print(f"\nStarting downloads with {args.workers} workers...")
        total_start = time.time()
        results = download_all_images(all_download_tasks, args.workers)
        
        # Summary
        successful = sum(1 for r in results if r[0])
        failed = len(results) - successful
        total_time = time.time() - total_start
        
        print(f"\n\nDownload Summary")
        print(f"================")
        print(f"Total time: {total_time:.1f} seconds")
        print(f"Successful: {successful}")
        print(f"Failed: {failed}")
        print(f"Average speed: {len(results)/total_time:.1f} images/second")
        
        # Show failed downloads if any
        if failed > 0:
            print("\nFailed downloads:")
            for success, msg, _ in results:
                if not success:
                    print(f"  - {msg}")
    else:
        print("\nNo images to download.")
    
    print(f"\nImages saved to: {output_dir}")

if __name__ == "__main__":
    main() 