"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Link2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface GenericCardProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  siteName?: string;
  error?: boolean;
  onOpen?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export function GenericCard({
  title,
  description,
  url,
  image,
  siteName,
  error = false,
  onOpen,
  onBookmark,
  isBookmarked,
}: GenericCardProps) {
  const hostname = new URL(url).hostname;
  
  return (
    <BaseCard 
      source={url}
      className="group cursor-pointer"
    >
      <CardContent className="p-0 relative">
        {/* Image or Placeholder */}
        <div className="relative aspect-video bg-muted">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
              {error ? (
                <>
                  <AlertCircle className="h-12 w-12 mb-2" />
                  <p className="text-sm text-center">
                    Unable to load preview
                  </p>
                </>
              ) : (
                <>
                  <Link2 className="h-12 w-12 mb-2" />
                  <p className="text-sm text-center">
                    {hostname}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Link2 className="h-3 w-3" />
            <span className="truncate">{siteName || hostname}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpen) {
              onOpen();
            } else {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Link
        </Button>
      </CardFooter>
    </BaseCard>
  );
} 