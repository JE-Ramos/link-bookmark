// Animation utilities
import { clsx } from "clsx";

// Spring animation configurations
export const SPRING_CONFIGS = {
  default: { tension: 200, friction: 20 },
  bouncy: { tension: 300, friction: 10 },
  smooth: { tension: 150, friction: 25 },
  stiff: { tension: 400, friction: 30 },
} as const;

// Animation durations
export const DURATIONS = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

// Easing functions
export const EASINGS = {
  easeOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

// Card size configurations based on state
export const CARD_SIZES = {
  hero: "col-span-2 row-span-2", // New items
  large: "col-span-2", // Trending items
  medium: "col-span-1", // Normal items
  small: "col-span-1 opacity-75 scale-95", // Stale items
} as const;

// Card state types
export type CardState = "new" | "trending" | "bookmarked" | "normal" | "stale" | "hero";

// Determine card state based on link data
export function getCardState(link: {
  _creationTime: number;
  bookmarkCount: number;
  lastBookmarkedAt?: number;
}, isBookmarked: boolean): CardState {
  const now = Date.now();
  const age = now - link._creationTime;
  const oneHour = 60 * 60 * 1000;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  if (isBookmarked) return "bookmarked";
  if (age < oneHour) return "new";
  if (age > thirtyDays) return "stale";
  
  // Calculate bookmark velocity (bookmarks per day since creation)
  const daysOld = Math.max(1, age / (24 * 60 * 60 * 1000));
  const velocity = link.bookmarkCount / daysOld;
  
  if (velocity > 5) return "trending";
  return "normal";
}

// Get card size class based on state
export function getCardSizeClass(state: CardState): string {
  switch (state) {
    case "new":
    case "hero":
      return CARD_SIZES.hero;
    case "trending":
      return CARD_SIZES.large;
    case "stale":
      return CARD_SIZES.small;
    default:
      return CARD_SIZES.medium;
  }
}

// Animation class utilities
export function getCardAnimationClass(state: CardState, index: number): string {
  const baseAnimation = "animate-in fade-in slide-in-from-bottom-4";
  const delay = `animation-delay-${Math.min(index * 50, 500)}`;
  
  const stateAnimations: Record<CardState, string> = {
    new: "animate-pulse-subtle",
    trending: "animate-glow",
    bookmarked: "animate-tilt",
    normal: "",
    stale: "animate-fade",
    hero: "animate-pulse-subtle",
  };
  
  return clsx(baseAnimation, delay, stateAnimations[state]);
}

// Ripple effect for real-time updates
export function createRipple(element: HTMLElement, x: number, y: number) {
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x - rect.left - size / 2 + "px";
  ripple.style.top = y - rect.top - size / 2 + "px";
  ripple.classList.add("ripple-effect");
  
  element.appendChild(ripple);
  
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

// Particle effect for card removal
export function createParticleEffect(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const particles = 12;
  
  for (let i = 0; i < particles; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = rect.left + rect.width / 2 + "px";
    particle.style.top = rect.top + rect.height / 2 + "px";
    particle.style.setProperty("--angle", `${(i * 360) / particles}deg`);
    
    document.body.appendChild(particle);
    
    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  }
}

// Bookmark heart explosion
export function createHeartExplosion(element: HTMLElement) {
  const hearts = 6;
  const container = element.getBoundingClientRect();
  
  for (let i = 0; i < hearts; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-particle";
    heart.innerHTML = "❤️";
    heart.style.left = container.left + container.width / 2 + "px";
    heart.style.top = container.top + container.height / 2 + "px";
    heart.style.setProperty("--random-x", `${(Math.random() - 0.5) * 100}px`);
    heart.style.setProperty("--random-y", `${Math.random() * -100 - 50}px`);
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 1000);
  }
}

// Stagger animation delays
export function staggerDelay(index: number, base: number = 50): number {
  return Math.min(index * base, 1000);
}

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
} 