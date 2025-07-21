// Link type detector utility

export type LinkType = 
  | "product"
  | "article"
  | "video"
  | "event"
  | "recipe"
  | "book"
  | "music"
  | "profile"
  | "flight"
  | "hotel"
  | "generic";

// Common e-commerce domains
const ECOMMERCE_DOMAINS = [
  "amazon.com",
  "ebay.com",
  "etsy.com",
  "shopify.com",
  "walmart.com",
  "target.com",
  "bestbuy.com",
  "aliexpress.com",
  "alibaba.com",
  "flipkart.com",
];

// Video platforms
const VIDEO_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "dailymotion.com",
  "twitch.tv",
  "tiktok.com",
  "instagram.com/reel",
  "facebook.com/watch",
];

// Article/News domains
const ARTICLE_DOMAINS = [
  "medium.com",
  "dev.to",
  "hashnode.dev",
  "substack.com",
  "nytimes.com",
  "theguardian.com",
  "bbc.com",
  "cnn.com",
  "techcrunch.com",
  "theverge.com",
];

// Recipe domains
const RECIPE_DOMAINS = [
  "allrecipes.com",
  "foodnetwork.com",
  "epicurious.com",
  "seriouseats.com",
  "bonappetit.com",
  "tasty.co",
  "delish.com",
];

// Music platforms
const MUSIC_DOMAINS = [
  "spotify.com",
  "music.apple.com",
  "soundcloud.com",
  "bandcamp.com",
  "music.youtube.com",
  "deezer.com",
  "tidal.com",
];

// Social/Profile domains
const PROFILE_DOMAINS = [
  "twitter.com",
  "x.com",
  "linkedin.com",
  "github.com",
  "facebook.com",
  "instagram.com",
  "behance.net",
  "dribbble.com",
];

// Travel domains
const TRAVEL_DOMAINS = [
  "booking.com",
  "airbnb.com",
  "expedia.com",
  "hotels.com",
  "tripadvisor.com",
  "kayak.com",
  "skyscanner.com",
];

// Event domains
const EVENT_DOMAINS = [
  "eventbrite.com",
  "meetup.com",
  "ticketmaster.com",
  "stubhub.com",
  "seatgeek.com",
];

// Book domains
const BOOK_DOMAINS = [
  "goodreads.com",
  "amazon.com/dp",
  "barnesandnoble.com",
  "bookdepository.com",
  "audible.com",
];

export interface LinkMetadata {
  type?: string;
  "og:type"?: string;
  price?: string | number;
  "product:price:amount"?: string | number;
  duration?: string | number;
  "video:duration"?: string | number;
  "recipe:prep_time"?: string;
  "recipe:cook_time"?: string;
  "event:start_time"?: string;
  schemaType?: string;
  [key: string]: unknown;
}

export function detectLinkType(url: string, metadata?: LinkMetadata): LinkType {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    const pathname = urlObj.pathname.toLowerCase();

    // Check metadata first for more accurate detection
    if (metadata) {
      if (metadata.type) {
        return metadata.type as LinkType;
      }
      
      // Check OpenGraph type
      if (metadata["og:type"]) {
        const ogType = metadata["og:type"];
        if (ogType.includes("product")) return "product";
        if (ogType.includes("article") || ogType.includes("blog")) return "article";
        if (ogType.includes("video")) return "video";
        if (ogType.includes("music")) return "music";
        if (ogType.includes("book")) return "book";
        if (ogType.includes("profile")) return "profile";
        if (ogType.includes("event")) return "event";
      }

      // Check for specific metadata fields
      if (metadata.price || metadata["product:price:amount"]) return "product";
      if (metadata.duration || metadata["video:duration"]) return "video";
      if (metadata["recipe:prep_time"] || metadata["recipe:cook_time"]) return "recipe";
      if (metadata["event:start_time"]) return "event";
    }

    // URL pattern matching
    if (pathname.includes("/product/") || pathname.includes("/item/") || pathname.includes("/listing/")) {
      return "product";
    }
    
    if (pathname.includes("/article/") || pathname.includes("/blog/") || pathname.includes("/post/") || pathname.includes("/news/")) {
      return "article";
    }
    
    if (pathname.includes("/video/") || pathname.includes("/watch") || pathname.includes("/v/")) {
      return "video";
    }
    
    if (pathname.includes("/recipe/") || pathname.includes("/recipes/")) {
      return "recipe";
    }
    
    if (pathname.includes("/event/") || pathname.includes("/events/")) {
      return "event";
    }
    
    if (pathname.includes("/book/") || pathname.includes("/books/")) {
      return "book";
    }
    
    if (pathname.includes("/track/") || pathname.includes("/album/") || pathname.includes("/playlist/")) {
      return "music";
    }
    
    if (pathname.includes("/flight/") || pathname.includes("/flights/")) {
      return "flight";
    }
    
    if (pathname.includes("/hotel/") || pathname.includes("/hotels/") || pathname.includes("/property/")) {
      return "hotel";
    }
    
    if (pathname.includes("/profile/") || pathname.includes("/user/") || pathname.match(/^\/[a-zA-Z0-9_]+$/)) {
      return "profile";
    }

    // Domain-based detection
    if (ECOMMERCE_DOMAINS.some(d => domain.includes(d))) return "product";
    if (VIDEO_DOMAINS.some(d => domain.includes(d))) return "video";
    if (ARTICLE_DOMAINS.some(d => domain.includes(d))) return "article";
    if (RECIPE_DOMAINS.some(d => domain.includes(d))) return "recipe";
    if (MUSIC_DOMAINS.some(d => domain.includes(d))) return "music";
    if (PROFILE_DOMAINS.some(d => domain.includes(d))) return "profile";
    if (EVENT_DOMAINS.some(d => domain.includes(d))) return "event";
    if (BOOK_DOMAINS.some(d => domain.includes(d))) return "book";
    if (TRAVEL_DOMAINS.some(d => domain.includes(d))) {
      return pathname.includes("flight") ? "flight" : "hotel";
    }

    // Default fallback
    return "generic";
  } catch {
    return "generic";
  }
}

// Extract metadata from HTML meta tags
export function extractMetadata(html: string): LinkMetadata {
  const metadata: LinkMetadata = {};
  
  // Extract OpenGraph tags
  const ogRegex = /<meta\s+property="og:([^"]+)"\s+content="([^"]+)"/gi;
  let match;
  while ((match = ogRegex.exec(html)) !== null) {
    metadata[`og:${match[1]}`] = match[2];
  }
  
  // Extract Twitter Card tags
  const twitterRegex = /<meta\s+name="twitter:([^"]+)"\s+content="([^"]+)"/gi;
  while ((match = twitterRegex.exec(html)) !== null) {
    metadata[`twitter:${match[1]}`] = match[2];
  }
  
  // Extract Schema.org JSON-LD
  const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(match[1]);
      if (jsonData["@type"]) {
        metadata.schemaType = jsonData["@type"];
        Object.assign(metadata, jsonData);
      }
    } catch {
      // Ignore invalid JSON
    }
  }
  
  // Extract standard meta tags
  const metaRegex = /<meta\s+name="([^"]+)"\s+content="([^"]+)"/gi;
  while ((match = metaRegex.exec(html)) !== null) {
    metadata[match[1]] = match[2];
  }
  
  return metadata;
} 