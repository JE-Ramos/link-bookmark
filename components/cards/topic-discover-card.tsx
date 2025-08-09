"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  ExternalLink, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin,
  Link2,
  ArrowRight,
  Bookmark,
  Heart,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface TopicDiscoverCardProps {
  topic: NonNullable<ReturnType<typeof useQuery<typeof api.topics.getPublicTopics>>>[0];
  className?: string;
}

export function TopicDiscoverCard({ topic, className }: TopicDiscoverCardProps) {
  const toggleBookmark = useMutation(api.topics.toggleBookmark);
  const toggleLike = useMutation(api.topics.toggleLike);
  
  // Use topic's image, fallback to first primary link's image, or use a placeholder
  const topicImage = topic.image || topic.primaryLinks[0]?.image || getTopicPlaceholderImage(topic.title);
  
  // Get up to 2 primary links as official links
  const officialLinks = topic.primaryLinks.slice(0, 2);
  
  // Get remaining links as social/supporting links
  const supportingLinks = [
    ...topic.primaryLinks.slice(2),
    // Could add supporting links here if they were included
  ];

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleBookmark({ topicId: topic._id });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleLike({ topicId: topic._id });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-card", className)}>
      {/* Image Container - Square Aspect Ratio */}
      <div className="relative aspect-square">
        <img 
          src={topicImage} 
          alt={topic.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        {/* Tags Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          {topic.tags.slice(0, 2).map((tag, idx) => (
            <Badge 
              key={idx}
              variant="secondary" 
              className="bg-black/90 text-white border-0 px-3 py-1 capitalize"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
          onClick={handleToggleBookmark}
        >
          <Bookmark className={cn("h-4 w-4", topic.isBookmarked && "fill-current")} />
        </Button>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-bold tracking-tight">{topic.title}</h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {topic.description}
        </p>

        {/* Official Links - Primary Links (Max 2) */}
        {officialLinks.length > 0 && (
          <div className="space-y-2 py-2">
            {officialLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-2 text-primary font-medium hover:opacity-80 transition-opacity"
              >
                <span className="flex items-center gap-2">
                  {link.favicon && (
                    <img src={link.favicon} alt="" className="h-4 w-4" />
                  )}
                  {link.title}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        )}

        {/* Stats and Supporting Links */}
        <div className="flex items-center justify-between pt-4 border-t">
          {/* Engagement Stats */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleLike}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Heart className={cn("h-4 w-4", topic.isLiked && "fill-red-500 text-red-500")} />
              <span className="text-sm">{topic.likeCount}</span>
            </button>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{topic.commentCount}</span>
            </span>
          </div>

          {/* Supporting Links as Icons */}
          {supportingLinks.length > 0 && (
            <div className="flex gap-2">
              {supportingLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {link.favicon ? (
                    <img src={link.favicon} alt="" className="h-4 w-4" />
                  ) : (
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </a>
              ))}
              {topic.supportingLinkCount > 0 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{topic.supportingLinkCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
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