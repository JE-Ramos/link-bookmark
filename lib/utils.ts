import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL parsing utilities
export function extractDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

export function humanizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      // Get the last meaningful part of the path
      const lastPart = pathParts[pathParts.length - 1];
      // Remove common file extensions
      const cleanPart = lastPart.replace(/\.(html?|php|aspx?|jsp)$/i, '');
      // Replace hyphens and underscores with spaces
      const humanized = cleanPart.replace(/[-_]/g, ' ');
      // Capitalize first letter of each word
      return humanized.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Fallback to domain name
    const domain = urlObj.hostname.replace('www.', '');
    const domainParts = domain.split('.');
    return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
  } catch {
    return 'Untitled Link';
  }
}

// Generate a color based on domain for consistency
export function getDomainColor(domain: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#48DBFB', '#0ABDE3', '#006BA6', '#6C5CE7', '#A29BFE',
    '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894', '#00CEC9'
  ];
  
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Generate placeholder image URL
export function getPlaceholderImage(url: string, title?: string): string {
  const domain = extractDomainFromUrl(url);
  const letter = title?.[0] || domain[0] || '?';
  const color = getDomainColor(domain).replace('#', '');
  
  // Using a placeholder service that generates letter avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=${color}&color=fff&size=400&font-size=0.5&bold=true`;
}

// Get generic description based on domain patterns
export function getGenericDescription(domain: string): string {
  const patterns: Record<string, string> = {
    'github.com': 'Repository on GitHub',
    'youtube.com': 'Video content',
    'twitter.com': 'Post on Twitter',
    'x.com': 'Post on X',
    'linkedin.com': 'Professional content on LinkedIn',
    'medium.com': 'Article on Medium',
    'stackoverflow.com': 'Question or answer on Stack Overflow',
    'reddit.com': 'Discussion on Reddit',
    'wikipedia.org': 'Encyclopedia article',
    'amazon.com': 'Product listing',
    'etsy.com': 'Handmade or vintage item',
    'spotify.com': 'Music or podcast',
    'netflix.com': 'Movie or TV show',
    'imdb.com': 'Movie or TV information',
  };
  
  // Check for patterns
  for (const [pattern, description] of Object.entries(patterns)) {
    if (domain.includes(pattern)) {
      return description;
    }
  }
  
  // Generic patterns
  if (domain.includes('shop') || domain.includes('store')) {
    return 'Online shopping';
  }
  if (domain.includes('blog')) {
    return 'Blog post';
  }
  if (domain.includes('news')) {
    return 'News article';
  }
  
  return '';
}

// Sanitize and validate metadata
export interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  platform: string;
}

export function sanitizeLinkMetadata(
  url: string,
  rawMetadata: Partial<LinkMetadata>
): LinkMetadata {
  const domain = extractDomainFromUrl(url);
  
  return {
    title: rawMetadata.title?.trim() || humanizeUrl(url),
    description: rawMetadata.description?.trim() || getGenericDescription(domain),
    image: rawMetadata.image?.trim() || getPlaceholderImage(url, rawMetadata.title),
    favicon: rawMetadata.favicon?.trim() || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    platform: rawMetadata.platform?.trim() || domain,
  };
}
