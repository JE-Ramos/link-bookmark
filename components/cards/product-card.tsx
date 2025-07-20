"use client";

import React from "react";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ShoppingCart, Heart, Truck, Shield, ExternalLink, Clock, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";
import Image from "next/image";

interface ProductCardProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  currency?: string;
  availability?: "in stock" | "out of stock" | "pre-order";
  brand?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  features?: string[];
  freeShipping?: boolean;
  warranty?: string;
  platform?: string;
  reminderDate?: number;
  bookmarkCount?: number;
  isBookmarked?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onBookmark?: () => void;
  onSetReminder?: () => void;
  onVisit?: () => void;
}

// Platform icons as SVG components
const PlatformIcons: Record<string, React.FC<{ className?: string }>> = {
  shopee: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM12 3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>
    </svg>
  ),
  lazada: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
    </svg>
  ),
  tiktok: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
    </svg>
  ),
};

export function ProductCard({
  title,
  description,
  url,
  image,
  price,
  originalPrice,
  currency = "USD",
  availability = "in stock",
  brand,
  rating,
  reviewCount,
  category,
  features,
  freeShipping,
  warranty,
  platform,
  reminderDate,
  bookmarkCount = 0,
  isBookmarked = false,
  onAddToCart,
  onAddToWishlist,
  onBookmark,
  onSetReminder,
  onVisit,
}: ProductCardProps) {
  const formatPrice = (priceValue: string) => {
    const num = parseFloat(priceValue);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };

  const discount = originalPrice && price
    ? Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)
    : null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const domain = new URL(url).hostname.replace("www.", "");
  const PlatformIcon = platform && PlatformIcons[platform];
  
  // Format reminder date
  const formatReminder = (date: number) => {
    const diff = date - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `${days} days`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <BaseCard source={url} contentType="product">
      {/* Product Image */}
      {image && (
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain w-full h-full p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discount && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                -{discount}%
              </span>
            </div>
          )}
          {availability === "out of stock" && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-sm font-semibold">Out of Stock</span>
            </div>
          )}
          {onAddToWishlist && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
              onClick={onAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
          {reminderDate && reminderDate > Date.now() && (
            <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-medium">
              <Clock className="w-3 h-3 inline mr-1" />
              {formatReminder(reminderDate)}
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        {brand && (
          <p className="text-xs text-muted-foreground font-medium">{brand}</p>
        )}
        <CardTitle className="line-clamp-2 text-lg leading-tight">{title}</CardTitle>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mt-2">
            {renderStars(rating)}
            <span className="text-xs text-muted-foreground">
              {rating.toFixed(1)} {reviewCount && `(${reviewCount.toLocaleString()})`}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {price && (
            <span className="text-2xl font-bold">{formatPrice(price)}</span>
          )}
          {originalPrice && price !== originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {description && (
          <CardDescription className="line-clamp-2 text-sm mb-3">{description}</CardDescription>
        )}

        {/* Features */}
        {features && features.length > 0 && (
          <ul className="space-y-1 mb-3">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-primary mt-0.5">•</span>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {freeShipping && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <Truck className="h-3 w-3" />
              <span>Free Shipping</span>
            </div>
          )}
          {warranty && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <Shield className="h-3 w-3" />
              <span>{warranty}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-1">
            <ExternalLink className="h-3 w-3" />
            View Details
          </Button>
        </a>
        {onAddToCart && availability === "in stock" && (
          <Button size="sm" onClick={onAddToCart} className="flex-1 gap-1">
            <ShoppingCart className="h-3 w-3" />
            Add to Cart
          </Button>
        )}
      </CardFooter>

      {/* Platform icon and title */}
      <div className="flex items-start gap-2 mt-3">
        {PlatformIcon && (
          <div className="w-6 h-6 flex-shrink-0">
            <PlatformIcon className="w-full h-full" />
          </div>
        )}
        <h3 className="font-semibold text-sm line-clamp-2 flex-1">{title}</h3>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={onBookmark}
            className="h-8 px-3 border-black"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
            <span className="ml-1 text-xs">{bookmarkCount}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSetReminder}
            className="h-8 px-3 border-black"
          >
            <Clock className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={onVisit}
          className="h-8 px-3 bg-black text-white hover:bg-gray-800"
        >
          Visit
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {/* Source */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">{domain}</p>
      </div>
    </BaseCard>
  );
} 