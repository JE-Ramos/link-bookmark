"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, User, Eye, MessageSquare, Bookmark, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface ArticleCardProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  readingTime?: string;
  siteName?: string;
  section?: string;
  tags?: string[];
  viewCount?: number;
  commentCount?: number;
  onBookmark?: () => void;
  onShare?: () => void;
}

export function ArticleCard({
  title,
  description,
  url,
  image,
  author,
  publishedTime,
  readingTime,
  siteName,
  section,
  tags,
  viewCount,
  commentCount,
  onBookmark,
  onShare,
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <BaseCard source={url} contentType="article">
      {/* Article Image */}
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          {section && (
            <div className="absolute top-3 left-3">
              <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                {section}
              </span>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg leading-tight">{title}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-2 text-sm mt-2">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Author and Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
          )}
          {publishedTime && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(publishedTime)}</span>
            </div>
          )}
          {readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readingTime}</span>
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        {(viewCount || commentCount) && (
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            {viewCount && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatCount(viewCount)} views</span>
              </div>
            )}
            {commentCount && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{formatCount(commentCount)}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-muted text-muted-foreground px-2 py-0.5 rounded-md text-xs"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground px-1">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="default" size="sm" className="w-full gap-1">
            <ExternalLink className="h-3 w-3" />
            Read Article
          </Button>
        </a>
        <div className="flex gap-1">
          {onBookmark && (
            <Button variant="ghost" size="icon" onClick={onBookmark} className="h-8 w-8">
              <Bookmark className="h-3 w-3" />
            </Button>
          )}
          {onShare && (
            <Button variant="ghost" size="icon" onClick={onShare} className="h-8 w-8">
              <Share2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardFooter>
    </BaseCard>
  );
} 