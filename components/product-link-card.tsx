"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Bookmark, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ProductLinkCardProps {
  id: string;
  title: string;
  url: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  currency?: string;
  platform?: string;
  reminderDate?: number;
  bookmarkCount?: number;
  isBookmarked?: boolean;
  isOwner?: boolean;
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
  amazon: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.887 5.942-1.095v-.41c0-.753.058-1.642-.385-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.58l-3.061-.333c-.259-.058-.548-.266-.472-.663.704-3.716 4.06-4.838 7.066-4.838 1.537 0 3.547.41 4.758 1.574 1.538 1.436 1.392 3.352 1.392 5.438v4.923c0 1.481.616 2.13 1.192 2.929.204.287.249.63-.01.839-.647.541-1.794 1.537-2.423 2.099l-.008-.003z"/>
    </svg>
  ),
};

export function ProductLinkCard({
  id,
  title,
  url,
  image,
  price,
  originalPrice,
  currency = "$",
  platform,
  reminderDate,
  bookmarkCount = 0,
  isBookmarked = false,
  isOwner = false,
  onBookmark,
  onSetReminder,
  onVisit,
}: ProductLinkCardProps) {
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

  const handleVisit = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onVisit?.();
  };

  return (
    <Card className="overflow-hidden border border-gray-300 bg-white hover:border-black transition-colors">
      {/* Image */}
      {image && (
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {reminderDate && reminderDate > Date.now() && (
            <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-medium rounded">
              <Clock className="w-3 h-3 inline mr-1" />
              {formatReminder(reminderDate)}
            </div>
          )}
        </div>
      )}

      <CardContent className="p-3">
        {/* Platform icon and title */}
        <div className="flex items-start gap-2 mb-2">
          {PlatformIcon && (
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <PlatformIcon className="w-full h-full" />
            </div>
          )}
          <h3 className="font-medium text-sm line-clamp-2 flex-1">{title}</h3>
        </div>

        {/* Price */}
        {price && (
          <div className="mb-3">
            <span className="text-lg font-bold">{currency}{price}</span>
            {originalPrice && (
              <span className="text-xs text-gray-500 line-through ml-2">
                {currency}{originalPrice}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={onBookmark}
              className="h-7 px-2 text-xs border-gray-300"
            >
              <Bookmark className={`w-3 h-3 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="ml-1">{bookmarkCount}</span>
            </Button>
            
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSetReminder}
                className="h-7 px-2 text-xs border-gray-300"
              >
                <Clock className="w-3 h-3" />
              </Button>
            )}
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={handleVisit}
            className="h-7 px-2 text-xs bg-black text-white hover:bg-gray-800"
          >
            Visit
            <ExternalLink className="w-2.5 h-2.5 ml-1" />
          </Button>
        </div>

        {/* Source */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-500">{domain}</p>
        </div>
      </CardContent>
    </Card>
  );
} 