"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Heart, Globe, Lock, Star, Clock, User } from "lucide-react";

interface LinkCardProps {
  link: Doc<"links"> & { username?: string };
  onToggleFavorite?: (id: string) => void;
  onTogglePublic?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
  isPublicView?: boolean;
}

// Generate placeholder images based on category
const getPlaceholderImage = (category?: string) => {
  const placeholders = {
    product: "https://placehold.co/600x400/F3F4F6/6B7280?text=Product",
    blog: "https://placehold.co/600x400/EFF6FF/3B82F6?text=Blog+Post",
    video: "https://placehold.co/600x400/FEF3C7/F59E0B?text=Video",
    recipe: "https://placehold.co/600x400/FEF2F2/EF4444?text=Recipe",
    flight: "https://placehold.co/600x400/E0E7FF/6366F1?text=Flight",
    other: "https://placehold.co/600x400/F9FAFB/6B7280?text=Link",
  };
  return placeholders[category as keyof typeof placeholders] || placeholders.other;
};

export function LinkCard({
  link,
  onToggleFavorite,
  onTogglePublic,
  onDelete,
  isOwner = false,
  isPublicView = false,
}: LinkCardProps) {
  const imageUrl = link.imageUrl || getPlaceholderImage(link.category);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={link.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {/* Category Badge */}
        {link.category && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {link.category.charAt(0).toUpperCase() + link.category.slice(1)}
            </span>
          </div>
        )}
        {/* Public/Private Badge */}
        {isOwner && (
          <div className="absolute top-3 right-3">
            {link.isPublic ? (
              <Globe className="h-5 w-5 text-white drop-shadow-lg" />
            ) : (
              <Lock className="h-5 w-5 text-white drop-shadow-lg" />
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold line-clamp-2">{link.title}</h3>
        
        {link.description && (
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{link.description}</p>
        )}

        {/* Metadata based on category */}
        {link.metadata && (
          <div className="mb-3 flex flex-wrap gap-2 text-sm text-gray-500">
            {link.category === "product" && link.metadata.price && (
              <span className="font-medium text-green-600">{link.metadata.price}</span>
            )}
            {link.category === "blog" && link.metadata.author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {link.metadata.author}
              </span>
            )}
            {link.category === "video" && link.metadata.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {link.metadata.duration}
              </span>
            )}
            {link.category === "recipe" && link.metadata.ingredients && (
              <span>{link.metadata.ingredients.length} ingredients</span>
            )}
            {link.category === "flight" && link.metadata.airline && (
              <span>{link.metadata.airline} {link.metadata.flightNumber}</span>
            )}
            {link.metadata.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {link.metadata.rating}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {link.tags && link.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {link.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* URL and User Info */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
                            className="truncate hover:text-black dark:hover:text-white hover:underline"
            style={{ maxWidth: "60%" }}
          >
            {new URL(link.url).hostname}
          </a>
          {isPublicView && link.username && (
            <span className="text-gray-400">by {link.username}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              Visit Link
            </Button>
          </a>
          
          {isOwner && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite?.(link._id)}
                className={link.isFavorite ? "text-yellow-500" : "text-gray-400"}
              >
                <Heart className={`h-4 w-4 ${link.isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onTogglePublic?.(link._id)}
                className={link.isPublic ? "text-green-500" : "text-gray-400"}
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(link._id)}
                className="text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 