import { LinkType, LinkMetadata } from "@/lib/link-type-detector";

export interface SchemaOrgData {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

export interface SchemaOrgGeneratorProps {
  linkType: LinkType;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  price?: string | number;
  rating?: number;
  reviewCount?: number;
  author?: string;
  date?: string;
  location?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
  metadata?: LinkMetadata;
}

export function generateSchemaOrg(props: SchemaOrgGeneratorProps): SchemaOrgData {
  const { linkType, title, description, url, imageUrl } = props;

  const baseData = {
    "@context": "https://schema.org",
    name: title,
    url,
    description,
    image: imageUrl,
  };

  switch (linkType) {
    case "product":
      return generateProductSchema({ ...props, baseData });
    
    case "article":
      return generateArticleSchema({ ...props, baseData });
    
    case "video":
      return generateVideoSchema({ ...props, baseData });
    
    case "event":
      return generateEventSchema({ ...props, baseData });
    
    case "recipe":
      return generateRecipeSchema({ ...props, baseData });
    
    case "book":
      return generateBookSchema({ ...props, baseData });
    
    case "music":
      return generateMusicSchema({ ...props, baseData });
    
    case "profile":
      return generateProfileSchema({ ...props, baseData });
    
    case "flight":
      return generateFlightSchema({ ...props, baseData });
    
    case "hotel":
      return generateHotelSchema({ ...props, baseData });
    
    default:
      return {
        ...baseData,
        "@type": "WebPage",
      };
  }
}

function generateProductSchema({ baseData, price, rating, reviewCount, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  return {
    ...baseData,
    "@type": "Product",
    brand: metadata?.brand ? {
      "@type": "Brand",
      name: metadata.brand,
    } : undefined,
    offers: {
      "@type": "Offer",
      price: price || "0",
      priceCurrency: metadata?.currency || "USD",
      availability: metadata?.availability || "https://schema.org/InStock",
      priceValidUntil: metadata?.priceValidUntil,
    },
    aggregateRating: rating ? {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviewCount || 0,
    } : undefined,
  };
}

function generateArticleSchema({ baseData, author, date, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  return {
    ...baseData,
    "@type": "Article",
    headline: baseData.name,
    author: author ? {
      "@type": "Person",
      name: author,
    } : undefined,
    datePublished: date,
    dateModified: metadata?.dateModified || date,
    publisher: metadata?.publisher ? {
      "@type": "Organization",
      name: metadata.publisher,
      logo: metadata?.publisherLogo ? {
        "@type": "ImageObject",
        url: metadata.publisherLogo,
      } : undefined,
    } : undefined,
    keywords: metadata?.keywords,
    articleSection: metadata?.section,
  };
}

function generateVideoSchema({ baseData, author, date, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  return {
    ...baseData,
    "@type": "VideoObject",
    thumbnailUrl: baseData.image,
    uploadDate: date,
    duration: metadata?.duration,
    embedUrl: metadata?.embedUrl,
    contentUrl: baseData.url,
    interactionStatistic: metadata?.viewCount ? {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WatchAction",
      userInteractionCount: metadata.viewCount,
    } : undefined,
    creator: author ? {
      "@type": "Person",
      name: author,
    } : undefined,
  };
}

function generateEventSchema({ baseData, date, location, price, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  const eventData: any = {
    ...baseData,
    "@type": "Event",
    startDate: date,
    endDate: metadata?.endDate,
    eventStatus: metadata?.eventStatus || "https://schema.org/EventScheduled",
    eventAttendanceMode: metadata?.eventType === "online" 
      ? "https://schema.org/OnlineEventAttendanceMode"
      : metadata?.eventType === "offline"
      ? "https://schema.org/OfflineEventAttendanceMode"
      : "https://schema.org/MixedEventAttendanceMode",
  };

  if (location) {
    eventData.location = {
      "@type": "Place",
      name: location.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: location.address,
        addressLocality: location.city,
        addressCountry: location.country,
      },
    };
  } else if (metadata?.virtualLocation) {
    eventData.location = {
      "@type": "VirtualLocation",
      url: metadata.virtualLocation,
    };
  }

  if (price) {
    eventData.offers = {
      "@type": "Offer",
      price,
      priceCurrency: metadata?.currency || "USD",
      availability: metadata?.availability || "https://schema.org/InStock",
      validFrom: metadata?.validFrom,
    };
  }

  if (metadata?.organizer) {
    eventData.organizer = {
      "@type": "Organization",
      name: metadata.organizer,
    };
  }

  return eventData;
}

function generateRecipeSchema({ baseData, rating, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  return {
    ...baseData,
    "@type": "Recipe",
    recipeCategory: metadata?.category,
    recipeCuisine: metadata?.cuisine,
    prepTime: metadata?.prepTime ? `PT${metadata.prepTime}` : undefined,
    cookTime: metadata?.cookTime ? `PT${metadata.cookTime}` : undefined,
    totalTime: metadata?.totalTime ? `PT${metadata.totalTime}` : undefined,
    recipeYield: metadata?.servings,
    recipeIngredient: metadata?.ingredients,
    recipeInstructions: Array.isArray(metadata?.instructions) 
      ? metadata.instructions.map((instruction: string, index: number) => ({
          "@type": "HowToStep",
          text: instruction,
          position: index + 1,
        }))
      : undefined,
    nutrition: metadata?.nutrition ? {
      "@type": "NutritionInformation",
      ...(metadata.nutrition as Record<string, unknown>),
    } : undefined,
    aggregateRating: rating ? {
      "@type": "AggregateRating",
      ratingValue: rating,
    } : undefined,
  };
}

function generateBookSchema({ baseData, author, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  return {
    ...baseData,
    "@type": "Book",
    author: author ? {
      "@type": "Person",
      name: author,
    } : undefined,
    isbn: metadata?.isbn,
    numberOfPages: metadata?.pageCount,
    bookFormat: metadata?.format || "https://schema.org/Hardcover",
    inLanguage: metadata?.language || "en",
    publisher: metadata?.publisher ? {
      "@type": "Organization",
      name: metadata.publisher,
    } : undefined,
    datePublished: metadata?.publishDate,
    aggregateRating: metadata?.rating ? {
      "@type": "AggregateRating",
      ratingValue: metadata.rating,
      reviewCount: metadata?.reviewCount,
    } : undefined,
  };
}

function generateMusicSchema({ baseData, author, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  const musicType = metadata?.musicType || "MusicRecording";
  
  return {
    ...baseData,
    "@type": musicType,
    byArtist: author ? {
      "@type": metadata?.artistType || "Person",
      name: author,
    } : undefined,
    duration: metadata?.duration,
    genre: metadata?.genre,
    inAlbum: metadata?.albumName ? {
      "@type": "MusicAlbum",
      name: metadata.albumName,
    } : undefined,
    recordingOf: metadata?.songName ? {
      "@type": "MusicComposition",
      name: metadata.songName,
    } : undefined,
    datePublished: metadata?.releaseDate,
  };
}

function generateProfileSchema({ baseData, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  const profileType = metadata?.profileType || "Person";
  
  return {
    ...baseData,
    "@type": profileType,
    jobTitle: metadata?.jobTitle,
    worksFor: metadata?.organization ? {
      "@type": "Organization",
      name: metadata.organization,
    } : undefined,
    sameAs: metadata?.socialLinks || [],
    knowsAbout: metadata?.skills || [],
    alumniOf: metadata?.education ? {
      "@type": "EducationalOrganization",
      name: metadata.education,
    } : undefined,
  };
}

function generateFlightSchema({ baseData, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  return {
    ...baseData,
    "@type": "Flight",
    flightNumber: metadata?.flightNumber,
    provider: metadata?.airline ? {
      "@type": "Airline",
      name: metadata.airline,
    } : undefined,
    departureAirport: metadata?.departureAirport ? {
      "@type": "Airport",
      name: metadata.departureAirport,
      iataCode: metadata?.departureIata,
    } : undefined,
    arrivalAirport: metadata?.arrivalAirport ? {
      "@type": "Airport",
      name: metadata.arrivalAirport,
      iataCode: metadata?.arrivalIata,
    } : undefined,
    departureTime: metadata?.departureTime,
    arrivalTime: metadata?.arrivalTime,
    flightDistance: metadata?.distance,
    aircraft: metadata?.aircraft,
  };
}

function generateHotelSchema({ baseData, location, rating, metadata }: SchemaOrgGeneratorProps & { baseData: any }): SchemaOrgData {
  return {
    ...baseData,
    "@type": "Hotel",
    address: location ? {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressCountry: location.country,
    } : undefined,
    starRating: {
      "@type": "Rating",
      ratingValue: metadata?.starRating || rating,
    },
    aggregateRating: rating ? {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: metadata?.reviewCount,
    } : undefined,
    priceRange: metadata?.priceRange,
    amenityFeature: Array.isArray(metadata?.amenities) 
      ? metadata.amenities.map((amenity: string) => ({
          "@type": "LocationFeatureSpecification",
          name: amenity,
        }))
      : undefined,
    checkinTime: metadata?.checkinTime,
    checkoutTime: metadata?.checkoutTime,
  };
}

// Helper function to inject Schema.org JSON-LD into the page
export function injectSchemaOrg(schemaData: SchemaOrgData): void {
  if (typeof window === 'undefined') return;
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
} 