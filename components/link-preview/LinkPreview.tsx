"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/cards/product-card";
import { ArticleCard } from "@/components/cards/article-card";
import { VideoCard } from "@/components/cards/video-card";
import { EventCard } from "@/components/cards/event-card";
import { RecipeCard } from "@/components/cards/recipe-card";
import { BookCard } from "@/components/cards/book-card";
import { MusicCard } from "@/components/cards/music-card";
import { ProfileCard } from "@/components/cards/profile-card";
import { FlightCard } from "@/components/cards/flight-card";
import { HotelCard } from "@/components/cards/hotel-card";
import { GenericCard } from "@/components/cards/generic-card";
import { detectLinkType, LinkType, LinkMetadata } from "@/lib/link-type-detector";

export interface LinkPreviewData {
  url: string;
  type?: LinkType;
  title: string;
  description?: string;
  image?: string;
  
  // Common fields
  author?: string;
  publishedTime?: string;
  siteName?: string;
  favicon?: string;
  
  // Product specific
  price?: string;
  originalPrice?: string;
  currency?: string;
  availability?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  
  // Video specific
  duration?: string;
  views?: number;
  channelName?: string;
  isLive?: boolean;
  
  // Event specific
  startDate?: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
  virtualLocation?: string;
  
  // Recipe specific
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: number;
  ingredients?: string[];
  
  // Additional metadata
  metadata?: LinkMetadata;
}

interface LinkPreviewProps {
  data: LinkPreviewData;
  onClick?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  className?: string;
  variant?: "card" | "compact" | "expanded";
}

export function LinkPreview({
  data,
  onClick,
  onBookmark,
  isBookmarked,
  className,
  variant = "card"
}: LinkPreviewProps) {
  // Detect link type based on URL and metadata
  const linkType = useMemo(() => {
    return data.type || detectLinkType(data.url, data.metadata);
  }, [data.url, data.type, data.metadata]);

  // Render appropriate card based on link type
  const renderCard = () => {
    const commonProps = {
      title: data.title,
      description: data.description,
      url: data.url,
      image: data.image,
    };

    switch (linkType) {
      case "product":
        return (
          <ProductCard
            {...commonProps}
            price={data.price}
            originalPrice={data.originalPrice}
            currency={data.currency}
            availability={data.availability as any}
            brand={data.brand}
            rating={data.rating}
            reviewCount={data.reviewCount}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked}
          />
        );

      case "article":
        return (
          <ArticleCard
            {...commonProps}
            author={data.author}
            publishedTime={data.publishedTime}
            siteName={data.siteName}
            onBookmark={onBookmark}
          />
        );

      case "video":
        return (
          <VideoCard
            {...commonProps}
            duration={data.duration}
            views={data.views}
            channelName={data.channelName}
            isLive={data.isLive}
            uploadDate={data.publishedTime}
          />
        );

      case "event":
        return (
          <EventCard
            {...commonProps}
            startDate={data.startDate!}
            endDate={data.endDate}
            location={data.location}
            virtualLocation={data.virtualLocation}
            organizer={data.author}
          />
        );

      case "recipe":
        return (
          <RecipeCard
            {...commonProps}
            author={data.author}
            prepTime={data.prepTime}
            cookTime={data.cookTime}
            totalTime={data.totalTime}
            servings={data.servings}
            ingredients={data.ingredients}
          />
        );

      // Add more cases for other types...
      
      default:
        // Fallback to a generic card
        return (
          <GenericCard
            title={data.title}
            description={data.description}
            url={data.url}
            image={data.image}
            siteName={data.siteName}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked}
          />
        );
    }
  };

  return (
    <div 
      className={className}
      onClick={onClick}
      style={{ viewTransitionName: `link-preview-${data.url}` }}
    >
      {renderCard()}
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchemaOrg(linkType, data))
        }}
      />
    </div>
  );
}

// Generate Schema.org structured data based on link type
function generateSchemaOrg(type: LinkType, data: LinkPreviewData): any {
  const baseSchema = {
    "@context": "https://schema.org",
    "url": data.url,
    "name": data.title,
    "description": data.description,
    "image": data.image,
  };

  switch (type) {
    case "product":
      return {
        ...baseSchema,
        "@type": "Product",
        "brand": {
          "@type": "Brand",
          "name": data.brand
        },
        "offers": {
          "@type": "Offer",
          "price": data.price,
          "priceCurrency": data.currency || "USD",
          "availability": `https://schema.org/${data.availability === "in stock" ? "InStock" : "OutOfStock"}`
        },
        "aggregateRating": data.rating ? {
          "@type": "AggregateRating",
          "ratingValue": data.rating,
          "reviewCount": data.reviewCount
        } : undefined
      };

    case "article":
      return {
        ...baseSchema,
        "@type": "Article",
        "author": {
          "@type": "Person",
          "name": data.author
        },
        "datePublished": data.publishedTime,
        "publisher": {
          "@type": "Organization",
          "name": data.siteName
        }
      };

    case "video":
      return {
        ...baseSchema,
        "@type": "VideoObject",
        "duration": data.duration,
        "uploadDate": data.publishedTime,
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/WatchAction",
          "userInteractionCount": data.views
        }
      };

    case "event":
      return {
        ...baseSchema,
        "@type": "Event",
        "startDate": data.startDate,
        "endDate": data.endDate,
        "location": data.location ? {
          "@type": "Place",
          "name": data.location.name,
          "address": data.location.address
        } : undefined,
        "organizer": {
          "@type": "Organization",
          "name": data.author
        }
      };

    case "recipe":
      return {
        ...baseSchema,
        "@type": "Recipe",
        "author": {
          "@type": "Person",
          "name": data.author
        },
        "prepTime": data.prepTime,
        "cookTime": data.cookTime,
        "totalTime": data.totalTime,
        "recipeYield": data.servings,
        "recipeIngredient": data.ingredients
      };

    default:
      return {
        ...baseSchema,
        "@type": "WebPage"
      };
  }
} 