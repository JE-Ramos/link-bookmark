"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Play, Clock, Eye, ThumbsUp, User, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface VideoCardProps {
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string; // ISO 8601 duration format or human readable
  uploadDate?: string;
  views?: number;
  likes?: number;
  channelName?: string;
  channelUrl?: string;
  channelAvatar?: string;
  embedUrl?: string;
  genre?: string;
  keywords?: string[];
  isLive?: boolean;
  isPremium?: boolean;
  seriesName?: string;
  episodeNumber?: number;
  onWatch?: () => void;
  onSave?: () => void;
}

export function VideoCard({
  title,
  description,
  url,
  thumbnailUrl,
  duration,
  uploadDate,
  views,
  likes,
  channelName,
  channelUrl,
  channelAvatar,
  embedUrl,
  genre,
  keywords,
  isLive,
  isPremium,
  seriesName,
  episodeNumber,
  onWatch,
  onSave,
}: VideoCardProps) {
  const formatDuration = (duration: string) => {
    // If already in human readable format (e.g., "10:30")
    if (duration.includes(':')) return duration;
    
    // Parse ISO 8601 duration (PT10M30S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <BaseCard source={url} contentType="video">
      {/* Video Thumbnail */}
      {thumbnailUrl && (
        <div className="relative aspect-video overflow-hidden bg-black">
          <img
            src={thumbnailUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
          
          {/* Duration Badge */}
          {duration && !isLive && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-xs font-medium">
              {formatDuration(duration)}
            </div>
          )}
          
          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}
          
          {/* Play Overlay */}
          {onWatch && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={onWatch}
                className="bg-black/50 hover:bg-black/70 rounded-full h-14 w-14"
              >
                <Play className="h-7 w-7 text-white fill-white ml-0.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        {/* Channel Info */}
        {channelName && (
          <div className="flex items-center gap-2 mb-2">
            {channelAvatar ? (
              <img
                src={channelAvatar}
                alt={channelName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <p className="text-sm font-medium">{channelName}</p>
          </div>
        )}
        
        <CardTitle className="line-clamp-2 text-lg leading-tight">{title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Video Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {views && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{formatViews(views)}</span>
            </div>
          )}
          {uploadDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(uploadDate)}</span>
            </div>
          )}
          {likes && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{likes.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        {description && (
          <CardDescription className="line-clamp-2 text-sm mt-3">{description}</CardDescription>
        )}
        
        {/* Keywords/Tags */}
        {keywords && keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="bg-muted text-muted-foreground px-2 py-0.5 rounded-md text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="default" size="sm" className="w-full gap-1">
            <Play className="h-3 w-3" />
            Watch Video
          </Button>
        </a>
        {onSave && (
          <Button variant="ghost" size="icon" onClick={onSave} className="h-8 w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </Button>
        )}
      </CardFooter>
    </BaseCard>
  );
} 