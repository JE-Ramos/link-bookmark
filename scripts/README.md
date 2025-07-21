# PopMart Image Downloader Scripts

This folder contains scripts to download product images from PopMart JSON data files.

## Prerequisites

- Python 3.7 or higher
- Install required packages:
  ```bash
  pip install -r requirements.txt
  ```

## Scripts

### 1. Basic Downloader (`download_popmart_images.py`)

A simple script that downloads images sequentially with basic progress tracking.

**Usage:**
```bash
python download_popmart_images.py
```

**Features:**
- Downloads images one by one
- Shows progress for each product
- Skips already downloaded images
- Creates organized folder structure

### 2. Advanced Downloader (`download_popmart_images_advanced.py`)

A more sophisticated script with concurrent downloads and progress bars.

**Usage:**
```bash
# Basic usage
python download_popmart_images_advanced.py

# With custom settings
python download_popmart_images_advanced.py --workers 20 --output my_images
```

**Options:**
- `--workers`: Number of concurrent download threads (default: 10)
- `--output`: Output directory name (default: popmart_images)

**Features:**
- Concurrent downloads for faster performance
- Visual progress bar with tqdm
- Download speed statistics
- Customizable worker threads
- Failed download reporting

## Output Structure

Images are organized in folders by product:
```
popmart_images/
├── 1898_THE MONSTERS FALL IN WILD SERIES-Vinyl Plush Doll Pendant/
│   ├── 1898_01.jpg
│   ├── 1898_02.jpg
│   └── ...
├── 1883_We are Twinkle Twinkle Series-Plush Pendant Blind Box/
│   ├── 1883_01.png
│   └── ...
└── ...
```

**Folder naming:** `{product_id}_{sanitized_product_title}`
**Image naming:** `{product_id}_{image_number}.{extension}`

## JSON Files

The scripts expect these JSON files in the `popmart_pages/` subdirectory:
- `popmart_plush_page_1.json`
- `popmart_plush_page_2.json`
- `page_3.json`

## Notes

- The scripts automatically skip already downloaded images
- Invalid filename characters are replaced with underscores
- A small delay is added between downloads to be respectful to the server
- The advanced script can handle large batches more efficiently

## Troubleshooting

If downloads fail:
1. Check your internet connection
2. Try reducing the number of workers: `--workers 5`
3. Check if the image URLs are still valid
4. Look for specific error messages in the output 