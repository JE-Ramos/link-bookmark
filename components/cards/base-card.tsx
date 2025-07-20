"use client";

import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useState } from "react";

interface BaseCardProps {
  children: React.ReactNode;
  source?: string;
  contentType?: "article" | "product" | "video" | "event" | "recipe" | "profile" | "book" | "music" | "flight" | "hotel";
  className?: string;
}

export function BaseCard({ children, source, contentType, className = "" }: BaseCardProps) {
  const [faviconError, setFaviconError] = useState(false);
  
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      // Using Google's favicon service as it's reliable
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getContentTypeStyle = () => {
    switch (contentType) {
      case "video":
        return {
          bg: "bg-red-500",
          text: "text-white",
          label: "VIDEO"
        };
      case "article":
        return {
          bg: "bg-black dark:bg-white",
          text: "text-white dark:text-black",
          label: "ARTICLE"
        };
      case "product":
        return {
          bg: "bg-orange-500",
          text: "text-white",
          label: "PRODUCT"
        };
      case "event":
        return {
          bg: "bg-purple-500",
          text: "text-white",
          label: "EVENT"
        };
      case "recipe":
        return {
          bg: "bg-green-500",
          text: "text-white",
          label: "RECIPE"
        };
      case "profile":
        return {
          bg: "bg-pink-500",
          text: "text-white",
          label: "PROFILE"
        };
      case "book":
        return {
          bg: "bg-indigo-500",
          text: "text-white",
          label: "BOOK"
        };
      case "music":
        return {
          bg: "bg-teal-500",
          text: "text-white",
          label: "MUSIC"
        };
      case "flight":
        return {
          bg: "bg-sky-500",
          text: "text-white",
          label: "FLIGHT"
        };
      case "hotel":
        return {
          bg: "bg-emerald-500",
          text: "text-white",
          label: "HOTEL"
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-white",
          label: "LINK"
        };
    }
  };

  const style = getContentTypeStyle();
  const domain = source ? getDomainFromUrl(source) : null;
  const faviconUrl = source && !faviconError ? getFaviconUrl(source) : null;

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${className}`}>
      {/* Source Header */}
      {source && (
        <div className={`${style.bg} ${style.text} px-4 py-2 flex items-center justify-between`}>
          <div className="flex items-center gap-2 min-w-0">
            {faviconUrl && !faviconError ? (
              <img
                src={faviconUrl}
                alt={`${domain} favicon`}
                className="w-4 h-4 rounded-sm bg-white p-0.5"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span className="text-sm font-medium truncate">{domain}</span>
          </div>
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">{style.label}</span>
        </div>
      )}
      
      {/* Card Content */}
      <div className="flex flex-col">
        {children}
      </div>
    </Card>
  );
} 