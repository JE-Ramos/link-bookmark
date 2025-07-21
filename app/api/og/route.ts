import { NextResponse } from 'next/server';
import { sanitizeLinkMetadata } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    try {
      // Fetch the webpage with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(validUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkBookmark/1.0)',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        // If fetch fails, return sanitized fallback data
        const fallbackMetadata = sanitizeLinkMetadata(url, {});
        return NextResponse.json(fallbackMetadata);
      }

      const html = await response.text();
      
      // Parse OG tags using regex (more reliable than DOM parsing in Node.js)
      const ogTags: Record<string, string> = {};
      
      // Match all meta tags with property or name attributes
      const metaTagRegex = /<meta\s+(?:property|name)=["']([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/gi;
      let match;
      
      while ((match = metaTagRegex.exec(html)) !== null) {
        const property = match[1];
        const content = match[2];
        
        // Check if it's an OG tag or Twitter card
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          ogTags[property] = content;
        }
      }
      
      // Also try to get the title tag if og:title is missing
      if (!ogTags['og:title']) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
          ogTags['og:title'] = titleMatch[1].trim();
        }
      }
      
      // Try to get favicon
      let favicon = '';
      const faviconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["'][^>]*>/i);
      if (faviconMatch) {
        favicon = faviconMatch[1];
        // Make favicon URL absolute
        if (favicon.startsWith('//')) {
          favicon = validUrl.protocol + favicon;
        } else if (favicon.startsWith('/')) {
          favicon = validUrl.origin + favicon;
        } else if (!favicon.startsWith('http')) {
          favicon = validUrl.origin + '/' + favicon;
        }
      }
      
      // Extract raw metadata
      const rawMetadata = {
        title: ogTags['og:title'] || ogTags['twitter:title'] || '',
        description: ogTags['og:description'] || ogTags['twitter:description'] || '',
        image: ogTags['og:image'] || ogTags['twitter:image'] || '',
        favicon: favicon,
        platform: validUrl.hostname.replace('www.', ''),
      };
      
      // Make image URL absolute if it's relative
      if (rawMetadata.image && !rawMetadata.image.startsWith('http')) {
        if (rawMetadata.image.startsWith('//')) {
          rawMetadata.image = validUrl.protocol + rawMetadata.image;
        } else if (rawMetadata.image.startsWith('/')) {
          rawMetadata.image = validUrl.origin + rawMetadata.image;
        } else {
          rawMetadata.image = validUrl.origin + '/' + rawMetadata.image;
        }
      }
      
      // Sanitize and provide fallbacks for missing data
      const metadata = sanitizeLinkMetadata(url, rawMetadata);
      
      return NextResponse.json(metadata);
    } catch (error) {
      console.error('Error fetching OG tags:', error);
      
      // If it's an abort error, it's a timeout
      if (error instanceof Error && error.name === 'AbortError') {
        const fallbackMetadata = sanitizeLinkMetadata(url, {});
        return NextResponse.json(fallbackMetadata);
      }
      
      // For any other error, return sanitized fallback data
      const fallbackMetadata = sanitizeLinkMetadata(url, {});
      return NextResponse.json(fallbackMetadata);
    }
  } catch (error) {
    console.error('Error in OG route:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 