"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode | string;
  url: string;
}

interface PromotionCardProps {
  // Badge/Availability
  badge: "NOW AVAILABLE" | "NEW SEASON" | "COMING SOON" | "LIMITED TIME" | "EXCLUSIVE" | "EARLY ACCESS" | string; // Allow custom strings for drop times
  
  // Content
  label?: string; // e.g., "MAJOR UPDATE", "SPECIAL EVENT"
  title: string;
  description?: string;
  backgroundImage?: string; // Character/artwork overlay
  
  // Footer - Main Row
  icon?: string;
  name: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  
  // Footer - Platform Row
  platforms?: Platform[];
  onMorePlatforms?: () => void;
  
  // Styling
  colorTheme?: "purple" | "red" | "blue" | "teal" | "orange" | "green";
  className?: string;
}

export function PromotionCard({
  badge,
  label,
  title,
  description,
  backgroundImage,
  icon,
  name,
  subtitle,
  primaryAction,
  platforms = [],
  onMorePlatforms,
  colorTheme = "purple",
  className,
}: PromotionCardProps) {
  // Color theme configurations
  const themes = {
    purple: "from-purple-600 to-purple-800",
    red: "from-red-600 to-red-800",
    blue: "from-blue-600 to-blue-800",
    teal: "from-teal-600 to-teal-800",
    orange: "from-orange-600 to-orange-800",
    green: "from-green-600 to-green-800",
  };

  const gradientClass = themes[colorTheme];
  
  // Determine if we need to show "+X more"
  const visiblePlatforms = platforms.slice(0, 3);
  const remainingCount = platforms.length - 3;
  const showMore = platforms.length > 3;

  return (
    <Card className={cn("overflow-hidden relative min-h-[280px] p-0", className)}>
      {/* Square Image Container with Overlay */}
      <div className="relative aspect-square">
        {/* Background Gradient */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradientClass)} />
        
        {/* Background Image/Artwork (if provided) */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          {label && (
            <p className="text-xs uppercase tracking-widest opacity-90 mb-2">
              {label}
            </p>
          )}
          
          <h3 className="text-xl font-bold mb-2 leading-tight">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm opacity-90 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Badge - edge to edge on upper left */}
      <div className="bg-white text-black px-4 py-1.5 rounded-br-lg font-semibold text-xs uppercase tracking-wide absolute top-0 left-0 z-50">
        {badge}
      </div>
      
      {/* Footer Rows */}
      <div className="bg-black/20 backdrop-blur-sm">
        {/* Main Row */}
        <div className="flex items-center gap-3 px-4 py-4 pb-2">
          {/* Icon */}
          {icon && (
            <img
              src={icon}
              alt={name}
              className="w-10 h-10 rounded-lg shadow-lg"
            />
          )}
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {name}
            </p>
            {subtitle && (
              <p className="text-xs text-white/80 truncate">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Primary Action */}
          {primaryAction && (
            <Button
              size="sm"
              variant="secondary"
              onClick={primaryAction.onClick}
              className="bg-white text-black hover:bg-white/90 font-semibold"
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
        
        {/* Platform Row */}
        {platforms.length > 0 && (
          <div className="flex items-center gap-2 px-4 pb-4">
            {visiblePlatforms.map((platform) => (
              <Button
                key={platform.id}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full"
                onClick={() => window.open(platform.url, '_blank')}
                title={platform.name}
              >
                {typeof platform.icon === 'string' ? (
                  <img src={platform.icon} alt={platform.name} className="h-4 w-4" />
                ) : (
                  platform.icon
                )}
              </Button>
            ))}
            
            {showMore && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-medium"
                onClick={onMorePlatforms}
              >
                +{remainingCount} more
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 