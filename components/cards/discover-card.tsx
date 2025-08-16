"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin,
  Link2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface OfficialLink {
  title: string;
  url: string;
}

interface SocialLink {
  platform: "facebook" | "twitter" | "youtube" | "linkedin" | "other";
  url: string;
}

interface DiscoverCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  officialLinks: OfficialLink[]; // Max 2
  socialLinks?: SocialLink[];
  className?: string;
}

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  other: Link2,
};

export function DiscoverCard({
  title,
  description,
  image,
  tags,
  officialLinks,
  socialLinks = [],
  className,
}: DiscoverCardProps) {
  // Ensure max 2 official links
  const displayOfficialLinks = officialLinks.slice(0, 2);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow", className)}>
      {/* Image Container - 16:10 Aspect Ratio (more reasonable height) */}
      <div className="relative aspect-[16/10]">
        <img 
          src={image} 
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        {/* Tags Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          {tags.map((tag, idx) => (
            <Badge 
              key={idx}
              variant="secondary" 
              className="bg-black/90 text-white border-0 px-3 py-1"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        {/* Official Links - Prominent */}
        <div className="space-y-2 py-2">
          {displayOfficialLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.url}
              className="group flex items-center justify-between py-2 text-primary font-medium hover:opacity-80 transition-opacity"
            >
              <span>{link.title}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        {/* Social Links - Less Prominent */}
        {socialLinks.length > 0 && (
          <div className="flex gap-3 pt-4 border-t">
            {socialLinks.map((link, idx) => {
              const Icon = socialIcons[link.platform] || socialIcons.other;
              return (
                <Link
                  key={idx}
                  href={link.url}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}