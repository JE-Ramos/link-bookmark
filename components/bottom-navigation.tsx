"use client";

import { Home, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "explore" | "collection" | "profile";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: "explore" as Tab,
      label: "Explore",
      icon: Home,
    },
    {
      id: "collection" as Tab,
      label: "Collection",
      icon: Bookmark,
    },
    {
      id: "profile" as Tab,
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-effect-strong border-t border-white/10 dark:border-white/10">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-3 h-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "inline-flex flex-col items-center justify-center gap-1 transition-all duration-300",
                  "hover:bg-black/5 dark:hover:bg-white/5",
                  "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black/20 dark:focus:ring-white/20",
                  "relative group rounded-lg mx-2 my-1"
                )}
              >
                {/* Active indicator with glass morphism */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-black/10 dark:bg-white/10 backdrop-blur-sm" />
                )}
                
                {/* Active top indicator */}
                <div
                  className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-black dark:bg-white transition-all duration-300 rounded-full",
                    isActive ? "w-8 opacity-100" : "w-0 opacity-0"
                  )}
                />
                
                {/* Icon with improved animation */}
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300 relative z-10",
                    isActive
                      ? "text-black dark:text-white transform scale-110"
                      : "text-black/60 dark:text-white/60 group-hover:text-black/80 dark:group-hover:text-white/80"
                  )}
                />
                
                {/* Label with improved styling */}
                <span
                  className={cn(
                    "text-xs font-medium transition-all duration-300 relative z-10",
                    isActive
                      ? "text-black dark:text-white font-semibold"
                      : "text-black/60 dark:text-white/60 group-hover:text-black/80 dark:group-hover:text-white/80"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Safe area for iOS devices with glass effect */}
      <div className="h-safe-area-bottom glass-effect-strong" />
    </nav>
  );
} 