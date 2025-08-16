"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Share2, Bookmark } from "lucide-react";
import { LinkType, LinkMetadata } from "@/lib/link-type-detector";
import { ProductCard } from "@/components/cards/product-card";
import { ArticleCard } from "@/components/cards/article-card";
import { VideoCard } from "@/components/cards/video-card";
import { EventCard } from "@/components/cards/event-card";
import { RecipeCard } from "@/components/cards/recipe-card";

interface LinkPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkType: LinkType;
  metadata?: LinkMetadata;
  // Card-specific props
  price?: string | number;
  rating?: number;
  reviewCount?: number;
  author?: string;
  duration?: string;
  date?: string;
  location?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
  virtualLocation?: string;
  // Actions
  onBookmark?: () => void;
  onShare?: () => void;
}

export function LinkPreviewModal({
  open,
  onOpenChange,
  url,
  title,
  description,
  imageUrl,
  linkType,
  metadata,
  price,
  rating,
  reviewCount,
  author,
  duration,
  date,
  location,
  virtualLocation,
  onBookmark,
  onShare,
}: LinkPreviewModalProps) {
  // Generate structured data for SEO
  const structuredData = generateStructuredData({
    linkType,
    title,
    description,
    url,
    imageUrl,
    price,
    rating,
    reviewCount,
    author,
    date,
    location,
    metadata,
  });

  const handleOpenExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(url);
    }
  };

  // Render the appropriate expanded card based on type
  const renderExpandedContent = () => {
    const commonProps = {
      title,
      description,
      image: imageUrl,
      url,
    };

    switch (linkType) {
      case "product":
        return (
          <div className="space-y-4">
            <ProductCard
              {...commonProps}
              price={typeof price === 'number' ? price.toString() : price}
              rating={rating}
              reviewCount={reviewCount}
            />
            {metadata?.features && (
              <div className="space-y-2">
                <h3 className="font-semibold">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {(metadata.features as string[]).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "article":
        return (
          <div className="space-y-4">
            <ArticleCard
              {...commonProps}
              author={author}
              publishedTime={date}
              readingTime={metadata?.readTime as string}
            />
            {metadata?.keywords && (
              <div className="flex flex-wrap gap-2">
                {(metadata.keywords as string[]).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-secondary rounded-md"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <VideoCard
              {...commonProps}
              thumbnailUrl={imageUrl}
              duration={duration}
              views={metadata?.viewCount as number}
              channelName={author}
            />
            {metadata?.embedUrl && (
              <div className="aspect-video w-full">
                <iframe
                  src={metadata.embedUrl as string}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case "event":
        return (
          <div className="space-y-4">
            <EventCard
              {...commonProps}
              startDate={date || ""}
              location={location}
              virtualLocation={virtualLocation}
              price={typeof price === 'number' ? price.toString() : price}
              eventType={metadata?.eventType as "online" | "offline" | "hybrid" | undefined}
            />
            {metadata?.agenda && (
              <div className="space-y-2">
                <h3 className="font-semibold">Agenda</h3>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {metadata.agenda as ReactNode}
                </div>
              </div>
            )}
          </div>
        );

      case "recipe":
        return (
          <div className="space-y-4">
            <RecipeCard
              {...commonProps}
              cookTime={metadata?.cookTime as string}
              prepTime={metadata?.prepTime as string}
              servings={metadata?.servings as number}
              rating={rating}
            />
            {metadata?.ingredients && (
              <div className="space-y-2">
                <h3 className="font-semibold">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {(metadata.ingredients as string[]).map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
            {metadata?.instructions && (
              <div className="space-y-2">
                <h3 className="font-semibold">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {(metadata.instructions as string[]).map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ExternalLink className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                <DialogDescription className="mt-1">
                  {new URL(url).hostname}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBookmark}
                  className="h-8 w-8"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="h-8 w-8"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenExternal}
                  className="h-8 w-8"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-6">
            {renderExpandedContent()}
          </div>

          <div className="mt-6 pt-6 border-t flex justify-between items-center">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleOpenExternal}>
              Open in New Tab
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inject structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

// Generate Schema.org structured data based on link type
function generateStructuredData(props: {
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
  location?: { name: string; address?: string; city?: string; country?: string };
  metadata?: LinkMetadata;
}) {
  const { linkType, title, description, url, imageUrl, price, rating, reviewCount, author, date, location, metadata } = props;

  const baseData = {
    "@context": "https://schema.org",
    name: title,
    url,
    description,
    image: imageUrl,
  };

  switch (linkType) {
    case "product":
      return {
        ...baseData,
        "@type": "Product",
        offers: {
          "@type": "Offer",
          price: price || "0",
          priceCurrency: metadata?.currency || "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: rating ? {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount: reviewCount || 0,
        } : undefined,
      };

    case "article":
      return {
        ...baseData,
        "@type": "Article",
        author: {
          "@type": "Person",
          name: author,
        },
        datePublished: date,
        keywords: metadata?.keywords,
      };

    case "video":
      return {
        ...baseData,
        "@type": "VideoObject",
        duration: metadata?.duration,
        uploadDate: date,
        embedUrl: metadata?.embedUrl,
      };

          case "event":
        const eventData: any = {
          ...baseData,
          "@type": "Event",
          startDate: date,
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
        } else if (props.metadata?.virtualLocation) {
          eventData.location = {
            "@type": "VirtualLocation",
            url: props.metadata.virtualLocation,
          };
        }
        
        if (price) {
          eventData.offers = {
            "@type": "Offer",
            price,
            priceCurrency: metadata?.currency || "USD",
          };
        }
        
        return eventData;

    case "recipe":
      return {
        ...baseData,
        "@type": "Recipe",
        prepTime: `PT${metadata?.prepTime}`,
        cookTime: `PT${metadata?.cookTime}`,
        recipeYield: metadata?.servings,
        recipeIngredient: metadata?.ingredients,
        recipeInstructions: metadata?.instructions?.map((instruction: string) => ({
          "@type": "HowToStep",
          text: instruction,
        })),
        aggregateRating: rating ? {
          "@type": "AggregateRating",
          ratingValue: rating,
        } : undefined,
      };

    default:
      return {
        ...baseData,
        "@type": "WebPage",
      };
  }
} 