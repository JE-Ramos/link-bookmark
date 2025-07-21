"use client";

import { ExternalLink, Heart } from "lucide-react";
import { type Id } from "@/convex/_generated/dataModel";

interface ProductLinkCardProps {
  id: Id<"links">;
  title: string;
  url: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  currency?: string;
  bookmarkCount: number;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export function ProductLinkCard({
  title,
  url,
  image,
  price,
  originalPrice,
  currency = "$",
  bookmarkCount,
  isBookmarked = false,
  onBookmark,
}: ProductLinkCardProps) {
  const PlatformIcon = () => (
    <ExternalLink className="w-4 h-4" />
  );

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ExternalLink className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 mb-2 text-gray-900 dark:text-gray-100">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            {price && (
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {currency}{price}
              </p>
            )}
            {originalPrice && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {currency}{originalPrice}
              </p>
            )}
          </div>

          {/* Platform */}
          <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400">
            <PlatformIcon />
            <span className="text-xs">{new URL(url).hostname.replace('www.', '')}</span>
          </div>
        </div>
      </a>

      {/* Bookmark button */}
      {onBookmark && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onBookmark();
          }}
          className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isBookmarked
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      )}

      {/* Bookmark count */}
      {bookmarkCount > 0 && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 dark:bg-white/70 backdrop-blur-sm rounded text-white dark:text-black text-xs flex items-center gap-1">
          <Heart className="w-3 h-3 fill-current" />
          {bookmarkCount}
        </div>
      )}
    </div>
  );
} 