"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ExternalLink,
  Bookmark,
  Star,
  Link2,
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  Loader2,
  Plus,
  LayoutGrid,
  List,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

export function TopicFeed() {
  const topics = useQuery(api.topics.getPublicTopics, { limit: 20 });

  if (topics === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">No topics to explore yet.</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create First Topic
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <TopicSquareCard key={topic._id} topic={topic} />
      ))}
    </div>
  );
}

// Square Card with Image Overlay
function TopicSquareCard({ topic }: { topic: NonNullable<ReturnType<typeof useQuery<typeof api.topics.getPublicTopics>>>[0] }) {
  const toggleBookmark = useMutation(api.topics.toggleBookmark);
  
  // Use topic's image, fallback to first primary link's image, or use a placeholder
  const topicImage = topic.image || topic.primaryLinks[0]?.image || getTopicPlaceholderImage(topic.title);
  
  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleBookmark({ topicId: topic._id });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <Link href={`/topics/${topic._id}`}>
      <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl bg-muted">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `url(${topicImage})`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top Section - Title with Official Badge */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-md">
                {topic.title}
              </h3>
              {topic.isTrending && (
                <Badge 
                  variant="secondary" 
                  className="bg-white/90 text-black border-0 gap-1 px-2 py-0.5 flex-shrink-0"
                >
                  <BadgeCheck className="h-3 w-3" />
                  Official
                </Badge>
              )}
            </div>
            <p className="text-white/80 text-sm line-clamp-2 drop-shadow-md">
              {topic.description}
            </p>
          </div>
          
          {/* Bottom Section - Links and Stats */}
          <div className="space-y-3">
            {/* Primary Links Preview */}
            <div className="flex items-center gap-2">
              {topic.primaryLinks.slice(0, 3).map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white"
                >
                  {link.favicon ? (
                    <img src={link.favicon} alt="" className="h-3 w-3" />
                  ) : (
                    <Link2 className="h-3 w-3" />
                  )}
                  <span className="truncate max-w-[80px]">
                    {link.platform || new URL(link.url).hostname.replace('www.', '')}
                  </span>
                </div>
              ))}
              {topic.supportingLinkCount > 0 && (
                <span className="text-white/60 text-xs">
                  +{topic.supportingLinkCount}
                </span>
              )}
            </div>
            
            {/* Stats and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/80 text-xs">
                <span className="flex items-center gap-1">
                  <Heart className={cn("h-3.5 w-3.5", topic.isLiked && "fill-red-500 text-red-500")} />
                  {topic.likeCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {topic.commentCount}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  {topic.primaryLinks.length}/3
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                onClick={handleToggleBookmark}
              >
                <Bookmark className={cn("h-4 w-4", topic.isBookmarked && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Helper function to generate placeholder images based on topic title
function getTopicPlaceholderImage(title: string): string {
  const images = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", // Tech
    "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=600&h=600&fit=crop", // Shopping
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop", // Design
    "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=600&h=600&fit=crop", // Productivity
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=600&fit=crop", // Office
  ];
  
  // Use title hash to consistently pick same image for same topic
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
}