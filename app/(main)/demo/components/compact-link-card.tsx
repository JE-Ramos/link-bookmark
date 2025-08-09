"use client";

import { ExternalLink, Share, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CompactLinkCardProps {
  image?: string;
  title: string;
  description?: string;
  url: string;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
}

export function CompactLinkCard({
  image,
  title,
  description,
  url,
  isBookmarked = false,
  onBookmark,
  onShare,
}: CompactLinkCardProps) {
  const handleOpenLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      {/* Main content row */}
      <div className="flex gap-3 mb-3">
        {/* Image on left */}
        <div className="flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={title}
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Title and description on right */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-1 mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Icon links row */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={handleOpenLink}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          <span className="text-xs">Open</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onBookmark}
        >
          <Bookmark className={`w-3 h-3 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
          <span className="text-xs">{isBookmarked ? 'Saved' : 'Save'}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onShare}
        >
          <Share className="w-3 h-3 mr-1" />
          <span className="text-xs">Share</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 ml-auto"
        >
          <Heart className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
} 