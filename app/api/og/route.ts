import { NextResponse } from 'next/server';

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

    // Fetch the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkBookmark/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
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
    } else {
      // Default favicon path
      favicon = validUrl.origin + '/favicon.ico';
    }
    
    // Extract the most important OG tags
    const metadata = {
      title: ogTags['og:title'] || ogTags['twitter:title'] || '',
      description: ogTags['og:description'] || ogTags['twitter:description'] || '',
      image: ogTags['og:image'] || ogTags['twitter:image'] || '',
      favicon: favicon,
      siteName: ogTags['og:site_name'] || '',
      type: ogTags['og:type'] || 'website',
      url: ogTags['og:url'] || url,
      platform: validUrl.hostname.replace('www.', ''),
    };
    
    // Make image URL absolute if it's relative
    if (metadata.image && !metadata.image.startsWith('http')) {
      if (metadata.image.startsWith('//')) {
        metadata.image = validUrl.protocol + metadata.image;
      } else if (metadata.image.startsWith('/')) {
        metadata.image = validUrl.origin + metadata.image;
      } else {
        metadata.image = validUrl.origin + '/' + metadata.image;
      }
    }
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching OG tags:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
} 