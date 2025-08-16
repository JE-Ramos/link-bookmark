#!/usr/bin/env python3
"""
PopMart Image Tagger (Simplified)
Renames images and adds EXIF metadata tags based on product information from JSON files.
Metadata will be searchable in iOS Photos.
"""

import os
import json
import shutil
import argparse
import re
from pathlib import Path
from datetime import datetime
from PIL import Image
import piexif
from tqdm import tqdm
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class PopMartImageTagger:
    def __init__(self, json_dir='popmart_pages', images_dir='popmart_images', 
                 output_dir='popmart_images_tagged', dry_run=False):
        self.json_dir = Path(json_dir)
        self.images_dir = Path(images_dir)
        self.output_dir = Path(output_dir)
        self.dry_run = dry_run
        self.products = {}
        self.stats = {
            'total_images': 0,
            'processed': 0,
            'errors': 0,
            'skipped': 0
        }
        
    def load_product_data(self):
        """Load all product data from JSON files"""
        logger.info("Loading product data from JSON files...")
        
        json_files = list(self.json_dir.glob('*.json'))
        logger.info(f"Found {len(json_files)} JSON files")
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                if 'productData' in data:
                    for product in data['productData']:
                        product_id = product.get('id', '')
                        self.products[product_id] = {
                            'title': product.get('title', ''),
                            'subTitle': product.get('subTitle', 'POP MART'),
                            'type': product.get('type', 'normal'),
                            'isNew': product.get('isNew', False),
                            'isHot': product.get('isHot', False),
                            'price': self._get_price(product),
                            'currency': self._get_currency(product),
                            'bannerImages': product.get('bannerImages', [])
                        }
                        
            except Exception as e:
                logger.error(f"Error loading {json_file}: {e}")
                
        logger.info(f"Loaded {len(self.products)} products")
        
    def _get_price(self, product):
        """Extract price from product data"""
        if 'skus' in product and product['skus']:
            return product['skus'][0].get('price', 0)
        return 0
        
    def _get_currency(self, product):
        """Extract currency from product data"""
        if 'skus' in product and product['skus']:
            return product['skus'][0].get('currency', 'PHP')
        return 'PHP'
        
    def clean_filename(self, text):
        """Clean text for use in filename"""
        # Remove special characters and replace spaces
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)
        return text.strip('-')
        
    def extract_product_id(self, folder_name):
        """Extract product ID from folder name"""
        match = re.match(r'^(\d+)_', folder_name)
        if match:
            return match.group(1)
        return None
        
    def generate_new_filename(self, product_id, image_num, ext, product_data):
        """Generate descriptive filename"""
        # Extract key parts from title
        title = product_data['title']
        
        # Try to extract brand/character name
        brand_match = re.search(r'^([A-Z][A-Za-z\s]+?)(?:\s+×|\s+-|\s+[A-Z])', title)
        if brand_match:
            brand = self.clean_filename(brand_match.group(1))
        else:
            brand = "PopMart"
            
        # Extract series name
        series_match = re.search(r'(?:Series|series)(?:-|\s+)([^-]+)', title)
        if series_match:
            series = self.clean_filename(series_match.group(1))
        else:
            series = self.clean_filename(title.split('-')[0] if '-' in title else title)
            
        # Create filename
        filename = f"{brand}_{series}_IMG{image_num:02d}{ext}"
        return filename
        
    def create_keywords_string(self, product_data, product_id):
        """Create a keywords string for EXIF metadata"""
        title = product_data['title']
        keywords = []
        
        # Basic keywords
        keywords.extend(["PopMart", product_data['subTitle'], f"ID:{product_id}", "Collectible"])
        
        # Extract series name
        series_parts = title.split('-')
        if series_parts:
            keywords.append(series_parts[0].strip())
            
        # Add type-specific keywords
        if product_data['type'] == 'secret':
            keywords.append("Secret")
        if product_data['type'] == 'extra':
            keywords.append("Extra")
        if product_data['isNew']:
            keywords.append("New")
        if product_data['isHot']:
            keywords.append("Hot")
            
        # Add product type keywords
        type_keywords = ["Blind Box", "Pendant", "Plush", "Vinyl", "Cotton Doll", "Keychain", "Doll"]
        for keyword in type_keywords:
            if keyword in title:
                keywords.append(keyword)
                
        # Add character/brand specific keywords
        brands = ["PUCKY", "DIMOO", "LABUBU", "CRYBABY", "SKULLPANDA", "THE MONSTERS", 
                 "HACIPUPU", "Baby Molly", "Hirono", "INSTINCTOY", "Mickey", "Pingu", 
                 "Harry Potter", "SPY×FAMILY"]
        for brand in brands:
            if brand in title or brand.upper() in title.upper():
                keywords.append(brand)
                
        # Remove duplicates and join
        keywords = list(dict.fromkeys(keywords))  # Preserves order while removing duplicates
        return ", ".join(keywords)
        
    def add_metadata_to_image(self, image_path, output_path, product_data, product_id):
        """Add metadata tags to image"""
        try:
            # Copy image first
            shutil.copy2(image_path, output_path)
            
            # Open image with Pillow
            img = Image.open(output_path)
            
            # Prepare metadata
            title = product_data['title']
            price = product_data['price'] / 100  # Convert from cents
            currency = product_data['currency']
            
            # Create keywords string
            keywords_str = self.create_keywords_string(product_data, product_id)
            
            # Load existing EXIF data or create new
            try:
                exif_dict = piexif.load(str(output_path))
            except:
                exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}}
            
            # Add metadata to EXIF
            # ImageDescription (0x010e) - Main title
            exif_dict['0th'][piexif.ImageIFD.ImageDescription] = title.encode('utf-8')
            
            # XPTitle (0x9c9b) - Windows title, also read by iOS
            exif_dict['0th'][0x9c9b] = title.encode('utf-16le') + b'\x00\x00'
            
            # XPKeywords (0x9c9e) - Windows keywords, also read by iOS
            exif_dict['0th'][0x9c9e] = keywords_str.encode('utf-16le') + b'\x00\x00'
            
            # XPSubject (0x9c9f) - Subject/Description
            subject = f"{title} - {product_data['type'].title()} - {currency} {price:.2f}"
            exif_dict['0th'][0x9c9f] = subject.encode('utf-16le') + b'\x00\x00'
            
            # Artist (0x013b)
            exif_dict['0th'][piexif.ImageIFD.Artist] = "PopMart Collection".encode('utf-8')
            
            # Copyright (0x8298)
            exif_dict['0th'][piexif.ImageIFD.Copyright] = f"© PopMart - ID: {product_id}".encode('utf-8')
            
            # UserComment in EXIF
            user_comment = f"Product: {title} | ID: {product_id} | Type: {product_data['type']} | Price: {currency} {price:.2f}"
            # UserComment needs to be encoded with a character code prefix
            user_comment_bytes = b"UNICODE\x00" + user_comment.encode('utf-16le')
            exif_dict['Exif'][piexif.ExifIFD.UserComment] = user_comment_bytes
            
            # Software
            exif_dict['0th'][piexif.ImageIFD.Software] = "PopMart Image Tagger v1.0".encode('utf-8')
            
            # DateTime
            exif_dict['0th'][piexif.ImageIFD.DateTime] = datetime.now().strftime("%Y:%m:%d %H:%M:%S").encode('utf-8')
            
            # Save with EXIF data
            exif_bytes = piexif.dump(exif_dict)
            img.save(output_path, exif=exif_bytes, quality=95)
            img.close()
            
            return True
            
        except Exception as e:
            logger.error(f"Error adding metadata to {image_path}: {e}")
            return False
            
    def process_images(self):
        """Process all images in the directory"""
        if not self.dry_run:
            self.output_dir.mkdir(parents=True, exist_ok=True)
            
        # Get all subdirectories
        subdirs = [d for d in self.images_dir.iterdir() if d.is_dir()]
        
        logger.info(f"Found {len(subdirs)} product folders to process")
        
        # Process each product folder
        for subdir in tqdm(subdirs, desc="Processing folders"):
            folder_name = subdir.name
            product_id = self.extract_product_id(folder_name)
            
            if not product_id or product_id not in self.products:
                logger.warning(f"No product data found for folder: {folder_name}")
                self.stats['skipped'] += 1
                continue
                
            product_data = self.products[product_id]
            
            # Create output subdirectory
            output_subdir = self.output_dir / folder_name
            if not self.dry_run:
                output_subdir.mkdir(parents=True, exist_ok=True)
                
            # Process images in folder
            image_files = list(subdir.glob('*.jpg')) + list(subdir.glob('*.png'))
            
            for img_file in image_files:
                self.stats['total_images'] += 1
                
                # Extract image number
                match = re.search(r'_(\d+)\.(jpg|png)$', img_file.name, re.IGNORECASE)
                if match:
                    image_num = int(match.group(1))
                    ext = img_file.suffix
                else:
                    image_num = 1
                    ext = img_file.suffix
                    
                # Generate new filename
                new_filename = self.generate_new_filename(product_id, image_num, ext, product_data)
                output_path = output_subdir / new_filename
                
                if self.dry_run:
                    logger.info(f"Would process: {folder_name}/{img_file.name}")
                    logger.info(f"  New name: {new_filename}")
                    logger.info(f"  Title: {product_data['title']}")
                    logger.info(f"  Keywords: {self.create_keywords_string(product_data, product_id)}")
                    logger.info("")
                    self.stats['processed'] += 1
                else:
                    # Add metadata and save
                    if self.add_metadata_to_image(img_file, output_path, product_data, product_id):
                        self.stats['processed'] += 1
                        logger.debug(f"Processed: {img_file.name} -> {new_filename}")
                    else:
                        self.stats['errors'] += 1
                        
    def print_summary(self):
        """Print processing summary"""
        logger.info("\n" + "="*60)
        logger.info("PROCESSING SUMMARY")
        logger.info("="*60)
        logger.info(f"Total images found: {self.stats['total_images']}")
        logger.info(f"Successfully processed: {self.stats['processed']}")
        logger.info(f"Errors: {self.stats['errors']}")
        logger.info(f"Skipped folders: {self.stats['skipped']}")
        
        if not self.dry_run:
            logger.info(f"\nProcessed images saved to: {self.output_dir}")
            logger.info("\nThe images now have:")
            logger.info("  ✓ Descriptive filenames")
            logger.info("  ✓ Searchable keywords in iOS Photos")
            logger.info("  ✓ Product titles and descriptions")
            logger.info("  ✓ Price and type information")
            

def main():
    parser = argparse.ArgumentParser(description='Tag PopMart images with metadata')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without processing')
    parser.add_argument('--output-dir', default='popmart_images_tagged', help='Output directory')
    parser.add_argument('--verbose', action='store_true', help='Show detailed processing info')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Create tagger instance
    tagger = PopMartImageTagger(
        output_dir=args.output_dir,
        dry_run=args.dry_run
    )
    
    # Load product data
    tagger.load_product_data()
    
    # Process images
    tagger.process_images()
    
    # Print summary
    tagger.print_summary()
    

if __name__ == "__main__":
    main() 