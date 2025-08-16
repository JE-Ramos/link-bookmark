"use client";

import React from "react";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ShoppingCart, Heart, Truck, Shield, ExternalLink, Clock, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

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
  features?: string[];
  freeShipping?: boolean;
  warranty?: string;
  reminderDate?: number;
  bookmarkCount?: number;
  isBookmarked?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onBookmark?: () => void;
  onSetReminder?: () => void;
  onVisit?: () => void;
}

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
  features,
  freeShipping,
  warranty,
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
    
    // Map currency symbols to proper ISO codes
    const currencyMap: { [key: string]: string } = {
      '$': 'USD',
      '€': 'EUR',
      '£': 'GBP',
      '¥': 'JPY',
      '₹': 'INR',
      '₽': 'RUB',
      '₩': 'KRW',
      '¢': 'USD', // cents
      '₱': 'PHP',
    };
    
    // Use mapped currency or original if it's already a valid ISO code
    const validCurrency = currencyMap[currency] || currency;
    
    // Fallback to USD if currency is still invalid
    let finalCurrency = validCurrency;
    try {
      new Intl.NumberFormat('en-US', { style: 'currency', currency: validCurrency });
    } catch {
      finalCurrency = 'USD';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: finalCurrency,
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
          <img
            src={image}
            alt={title}
            className="object-contain w-full h-full p-4"
            loading="lazy"
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
        <div className="w-6 h-6 flex-shrink-0">
          <ExternalLink className="w-full h-full" />
        </div>
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