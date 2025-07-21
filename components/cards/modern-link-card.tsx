"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink, Heart, Clock, Tag, Globe, Sparkles } from "lucide-react";
import { cn, getDomainColor, getPlaceholderImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModernLinkCardProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  favicon?: string;
  platform?: string;
  price?: string;
  originalPrice?: string;
  currency?: string;
  tags?: string[];
  isNew?: boolean;
  bookmarkCount?: number;
  isBookmarked?: boolean;
  reminderDate?: number;
  onBookmark?: () => void;
  onSetReminder?: () => void;
  onClick?: () => void;
}

export function ModernLinkCard({
  title,
  description,
  url,
  image,
  favicon,
  platform,
  price,
  originalPrice,
  currency = "$",
  tags,
  isNew,
  bookmarkCount = 0,
  isBookmarked = false,
  reminderDate,
  onBookmark,
  onSetReminder,
  onClick,
}: ModernLinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const domain = platform || new URL(url).hostname.replace('www.', '');
  const accentColor = getDomainColor(domain);
  const displayImage = !imageError && image ? image : getPlaceholderImage(url, title);
  
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

  const formatReminder = (date: number) => {
    const diff = date - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `${days} days`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-xl border-0 bg-gradient-to-br from-background to-muted/20",
        isHovered && "scale-[1.01]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Accent stripe */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative">
        {/* Image section with overlay effects */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <img
            src={displayImage}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isHovered && "scale-105 brightness-110"
            )}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isNew && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                New
              </span>
            )}
            {discount && (
              <span className="px-2 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold">
                -{discount}%
              </span>
            )}
            {reminderDate && reminderDate > Date.now() && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/90 backdrop-blur-sm text-white text-xs font-medium">
                <Clock className="w-3 h-3" />
                {formatReminder(reminderDate)}
              </span>
            )}
          </div>

          {/* Price badge (bottom right) */}
          {price && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-lg">
                    {formatPrice(price)}
                  </span>
                  {originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 space-y-3">
          {/* Platform info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {favicon ? (
              <img 
                src={favicon} 
                alt="" 
                className="w-4 h-4 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span>{domain}</span>
            {bookmarkCount > 0 && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {bookmarkCount}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-muted-foreground px-1">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              {onBookmark && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark();
                  }}
                  className={cn(
                    "h-8 px-2",
                    isBookmarked && "text-red-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                </Button>
              )}
              {onSetReminder && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetReminder();
                  }}
                  className="h-8 px-2"
                >
                  <Clock className="w-4 h-4" />
                </Button>
              )}
            </div>

            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "inline-flex items-center gap-1 text-sm text-muted-foreground",
                "hover:text-primary transition-colors"
              )}
            >
              View
              <ExternalLink className={cn(
                "w-3 h-3 transition-transform",
                isHovered && "translate-x-0.5 -translate-y-0.5"
              )} />
            </a>
          </div>
        </div>
      </div>

      {/* Hover effect - subtle glow */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100"
        )}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}10, transparent 70%)`,
        }}
      />
    </Card>
  );
} 