import { useEffect, useRef } from "react";
import { createRipple, prefersReducedMotion } from "@/lib/animations";

interface UseRealtimeAnimationsProps {
  elementId: string;
  value: number | string;
  enabled?: boolean;
}

export function useRealtimeAnimations({ 
  elementId, 
  value, 
  enabled = true 
}: UseRealtimeAnimationsProps) {
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;

    // Check if value changed
    if (prevValueRef.current !== value) {
      const element = document.querySelector(`[data-card-id="${elementId}"]`) as HTMLElement;
      
      if (element) {
        // Create ripple effect at center of card
        const rect = element.getBoundingClientRect();
        createRipple(element, rect.width / 2, rect.height / 2);
        
        // Add a subtle scale animation
        element.style.transform = "scale(1.02)";
        setTimeout(() => {
          element.style.transform = "";
        }, 300);
      }
      
      prevValueRef.current = value;
    }
  }, [elementId, value, enabled]);
} 