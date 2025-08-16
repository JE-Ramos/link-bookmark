#!/usr/bin/env python3
"""
Download all product images from PopMart JSON files.
Organizes images into folders by product ID and name.
"""

import json
import os
import re
import requests
from pathlib import Path
import time
from urllib.parse import urlparse

def sanitize_filename(filename):
    """Remove or replace characters that are invalid in filenames."""
    # Replace invalid characters with underscores
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    # Remove extra whitespace and trim
    filename = ' '.join(filename.split())
    # Limit length to avoid filesystem issues
    return filename[:200]

def download_image(url, filepath):
    """Download an image from URL to filepath."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"Failed to download {url}: {str(e)}")
        return False

def process_json_file(json_path, output_dir):
    """Process a single JSON file and download all images."""
    print(f"\nProcessing: {json_path}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('productData', [])
    total_products = len(products)
    print(f"Found {total_products} products")
    
    for idx, product in enumerate(products, 1):
        product_id = product.get('id', 'unknown')
        product_title = product.get('title', 'untitled')
        banner_images = product.get('bannerImages', [])
        
        # Create folder name: ID_Title
        folder_name = f"{product_id}_{sanitize_filename(product_title)}"
        product_dir = output_dir / folder_name
        product_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[{idx}/{total_products}] {product_title}")
        print(f"  Folder: {folder_name}")
        print(f"  Images: {len(banner_images)}")
        
        # Download each image
        for img_idx, img_url in enumerate(banner_images, 1):
            if not img_url:
                continue
                
            # Extract file extension from URL
            parsed_url = urlparse(img_url)
            path_parts = parsed_url.path.split('/')
            original_filename = path_parts[-1] if path_parts else ''
            ext = '.jpg'  # Default extension
            if '.' in original_filename:
                ext = '.' + original_filename.split('.')[-1]
            
            # Create filename: productID_imageNumber.extension
            filename = f"{product_id}_{img_idx:02d}{ext}"
            filepath = product_dir / filename
            
            # Skip if already exists
            if filepath.exists():
                print(f"  ✓ {filename} (already exists)")
                continue
            
            # Download the image
            print(f"  ↓ Downloading {filename}...", end='', flush=True)
            if download_image(img_url, filepath):
                print(" ✓")
            else:
                print(" ✗")
            
            # Small delay to be polite to the server
            time.sleep(0.1)

def main():
    """Main function to process all JSON files."""
    # Define paths
    script_dir = Path(__file__).parent
    json_files = [
        script_dir / 'popmart_pages' / 'popmart_plush_page_1.json',
        script_dir / 'popmart_pages' / 'popmart_plush_page_2.json',
        script_dir / 'popmart_pages' / 'page_3.json'
    ]
    
    # Create output directory
    output_dir = script_dir / 'popmart_images'
    output_dir.mkdir(exist_ok=True)
    
    print("PopMart Image Downloader")
    print("========================")
    print(f"Output directory: {output_dir}")
    
    # Check if all JSON files exist
    missing_files = [f for f in json_files if not f.exists()]
    if missing_files:
        print("\nError: Missing JSON files:")
        for f in missing_files:
            print(f"  - {f}")
        return
    
    # Process each JSON file
    total_start = time.time()
    for json_file in json_files:
        process_json_file(json_file, output_dir)
    
    total_time = time.time() - total_start
    print(f"\n\nCompleted in {total_time:.1f} seconds")
    print(f"Images saved to: {output_dir}")

if __name__ == "__main__":
    main() 