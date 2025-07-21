"use client";

import { useRouter } from "next/navigation";
import { startTransition, useCallback, ReactNode } from "react";

interface SharedViewTransitionProps {
  children: ReactNode;
  href?: string;
  viewTransitionName?: string;
  onClick?: () => void;
  className?: string;
}

export function SharedViewTransition({
  children,
  href,
  viewTransitionName,
  onClick,
  className,
}: SharedViewTransitionProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      
      // Call custom onClick handler if provided
      if (onClick) {
        onClick();
      }

      // Handle navigation with view transition
      if (href) {
        // Check if the browser supports view transitions
        if ('startViewTransition' in document) {
          const doc = document as Document & {
            startViewTransition: (callback: () => void) => {
              finished: Promise<void>;
            };
          };
          const transition = doc.startViewTransition(() => {
            startTransition(() => {
              router.push(href);
            });
          });
          
          // You can handle the transition states here if needed
          transition?.finished.catch(() => {
            // Handle failed transitions silently
          });
        } else {
          // Fallback to regular navigation
          router.push(href);
        }
      }
    },
    [href, onClick, router]
  );

  return (
    <div
      className={className}
      style={{ viewTransitionName }}
      onClick={handleClick}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      onKeyDown={(e) => {
        if (href && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {children}
    </div>
  );
}

// CSS for view transitions (to be added to global styles)
export const viewTransitionStyles = `
  /* Default view transition styles */
  ::view-transition-old(card),
  ::view-transition-new(card) {
    animation-duration: 0.3s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  ::view-transition-old(card) {
    animation-name: fade-out;
  }
  
  ::view-transition-new(card) {
    animation-name: fade-in;
  }
  
  @keyframes fade-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Specific transitions for different card types */
  ::view-transition-old(product-card),
  ::view-transition-new(product-card) {
    animation-duration: 0.4s;
  }
  
  ::view-transition-old(video-card),
  ::view-transition-new(video-card) {
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
`; 