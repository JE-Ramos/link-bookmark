"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink, Sparkles, Zap, Globe, Code2, Palette, Cpu, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowcaseCardProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  emoji?: string;
  category?: string;
  tags?: string[];
  gradient?: string;
  accentColor?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  onClick?: () => void;
}

const categoryIcons = {
  "api": <Code2 className="w-5 h-5" />,
  "design": <Palette className="w-5 h-5" />,
  "performance": <Zap className="w-5 h-5" />,
  "ai": <Cpu className="w-5 h-5" />,
  "connectivity": <Wifi className="w-5 h-5" />,
  "web": <Globe className="w-5 h-5" />,
};

const defaultGradients = [
  "from-violet-600 to-indigo-600",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-600",
  "from-orange-600 to-red-600",
  "from-pink-600 to-rose-600",
  "from-purple-600 to-pink-600",
  "from-amber-600 to-orange-600",
  "from-green-600 to-emerald-600",
];

export function ShowcaseCard({
  title,
  description,
  url,
  emoji,
  category,
  tags,
  gradient,
  isNew,
  isFeatured,
  onClick,
}: ShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate consistent gradient based on title if not provided
  const getGradient = () => {
    if (gradient) return gradient;
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return defaultGradients[Math.abs(hash) % defaultGradients.length];
  };

  const selectedGradient = getGradient();
  const CategoryIcon = category && categoryIcons[category as keyof typeof categoryIcons] 
    ? categoryIcons[category as keyof typeof categoryIcons] 
    : <Globe className="w-5 h-5" />;

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-white/10",
        "border-0",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background with gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-90",
        selectedGradient,
        "transition-opacity duration-300",
        isHovered && "opacity-100"
      )} />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[280px]">
        {/* Header */}
        <div className="space-y-4">
          {/* Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isNew && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  New
                </span>
              )}
              {isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400/20 backdrop-blur-sm text-yellow-100 text-xs font-medium">
                  <Zap className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
            <div className="text-white/80">
              {CategoryIcon}
            </div>
          </div>

          {/* Title with emoji */}
          <div className="space-y-2">
            {emoji && (
              <div className="text-4xl filter drop-shadow-lg">
                {emoji}
              </div>
            )}
            <h3 className="text-2xl font-bold text-white leading-tight">
              {title}
            </h3>
          </div>

          {/* Description */}
          {description && (
            <p className="text-white/80 text-sm line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-3">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-white/80 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action */}
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              {new URL(url).hostname.replace('www.', '')}
            </div>
            <div className={cn(
              "p-2 rounded-full bg-white/10 backdrop-blur-sm",
              "transition-all duration-300",
              isHovered && "bg-white/20 transform translate-x-1"
            )}>
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect - subtle glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        "bg-gradient-to-t from-transparent via-transparent to-white/10",
        isHovered && "opacity-100"
      )} />
    </Card>
  );
} 