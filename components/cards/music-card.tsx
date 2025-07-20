"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Play, Pause, Music, Clock, Disc, User, Calendar, Heart, Share2, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface MusicCardProps {
  title: string;
  artist: string;
  album?: string;
  url: string;
  coverImage?: string;
  duration?: string; // in seconds or ISO 8601 format
  releaseDate?: string;
  genre?: string[];
  trackNumber?: number;
  totalTracks?: number;
  isExplicit?: boolean;
  previewUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  plays?: number;
  likes?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

export function MusicCard({
  title,
  artist,
  album,
  url,
  coverImage,
  duration,
  releaseDate,
  genre,
  trackNumber,
  totalTracks,
  isExplicit,
  previewUrl,
  spotifyUrl,
  appleMusicUrl,
  youtubeUrl,
  plays,
  likes,
  isPlaying = false,
  onPlay,
  onLike,
  onShare,
}: MusicCardProps) {
  const formatDuration = (duration?: string) => {
    if (!duration) return null;
    
    // If already in MM:SS format
    if (duration.includes(':')) return duration;
    
    // Convert seconds to MM:SS
    const totalSeconds = parseInt(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  return (
    <BaseCard source={url}>
      <div className="flex h-full">
        {/* Album Cover - Fixed size */}
        <div className="relative w-32 h-32 flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`${album || title} cover`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center rounded-lg">
              <Disc className="h-10 w-10 text-muted-foreground animate-spin-slow" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          {onPlay && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPlay}
                className="bg-black/50 hover:bg-black/70 rounded-full h-10 w-10"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white fill-white" />
                ) : (
                  <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                )}
              </Button>
            </div>
          )}
          
          {/* Explicit Badge */}
          {isExplicit && (
            <div className="absolute bottom-1 left-1">
              <span className="bg-black/80 text-white px-1 py-0.5 rounded text-xs font-bold">
                E
              </span>
            </div>
          )}
        </div>

        {/* Track Details */}
        <div className="flex-1 flex flex-col pl-3">
          <CardHeader className="p-0 pb-2">
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="font-medium line-clamp-1">{artist}</span>
                  </div>
                  {album && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Disc className="h-3 w-3" />
                      <span className="line-clamp-1">{album}</span>
                    </div>
                  )}
                </div>
                
                {/* Track Info */}
                {duration && (
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(duration)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 pb-2">
            {/* Genres */}
            {genre && genre.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {genre.slice(0, 2).map((g, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {plays && (
                <div className="flex items-center gap-1">
                  <ListMusic className="h-3 w-3" />
                  <span>{formatPlays(plays)} plays</span>
                </div>
              )}
              {likes && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{likes.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Release Date */}
            {releaseDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(releaseDate)}</span>
              </div>
            )}

            {/* Platform Links */}
            {(spotifyUrl || appleMusicUrl || youtubeUrl) && (
              <div className="flex items-center gap-2 mt-2">
                {spotifyUrl && (
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#1DB954] transition-colors"
                    title="Listen on Spotify"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                )}
                {appleMusicUrl && (
                  <a
                    href={appleMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#FA243C] transition-colors"
                    title="Listen on Apple Music"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.078 1.597-.31 2.299-.752a4.71 4.71 0 001.878-2.226c.21-.473.344-.973.42-1.485.055-.376.079-.754.092-1.133v-.117-12.094-.06zm-1.865 12.35c-.013.293-.032.586-.06.877-.047.484-.154.951-.388 1.375-.36.648-.909 1.074-1.63 1.323-.385.133-.79.2-1.202.236-.48.04-.96.052-1.44.054H6.577c-.413 0-.825-.01-1.236-.049a4.589 4.589 0 01-1.337-.297 2.578 2.578 0 01-1.664-1.827 4.445 4.445 0 01-.224-1.137c-.025-.347-.036-.694-.038-1.041V5.937c0-.274.01-.548.028-.821.03-.44.084-.875.21-1.293.318-1.049 1.033-1.747 2.113-2.048.455-.127.928-.182 1.404-.207.392-.021.785-.026 1.178-.026h11.881c.448 0 .896.019 1.343.058.405.036.805.096 1.192.233 1.006.354 1.68 1.063 1.97 2.09.113.398.16.812.19 1.228.016.226.023.452.023.678v11.642c0 .337-.01.674-.023 1.01z"/>
                      <path d="M11.999 3.285c-.882 0-1.591.71-1.591 1.591v9.257c0 .225-.102.432-.28.567a4.134 4.134 0 00-1.357 1.126 2.577 2.577 0 00.962 3.938 2.577 2.577 0 002.638-.515 2.577 2.577 0 00.876-2.315 2.577 2.577 0 00-1.248-1.802V4.876c0-.225.183-.408.408-.408h.974c.225 0 .408.183.408.408v6.221c0 .225.183.408.408.408h3.274c.882 0 1.591-.71 1.591-1.591V4.876c0-.882-.71-1.591-1.591-1.591h-5.472z"/>
                    </svg>
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#FF0000] transition-colors"
                    title="Watch on YouTube"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="p-0 pb-4 gap-2">
            <Button variant="default" size="sm" className="flex-1 gap-1">
              <Music className="h-3 w-3" />
              Listen
            </Button>
            {onLike && (
              <Button variant="ghost" size="icon" onClick={onLike} className="h-8 w-8">
                <Heart className="h-3 w-3" />
              </Button>
            )}
            {onShare && (
              <Button variant="ghost" size="icon" onClick={onShare} className="h-8 w-8">
                <Share2 className="h-3 w-3" />
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </BaseCard>
  );
} 