"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

declare global {
  interface Document {
    startViewTransition(callback: () => void | Promise<void>): ViewTransition | undefined;
  }
}

export function useViewTransition() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateWithTransition = (href: string) => {
    if (!document.startViewTransition) {
      // Fallback for browsers that don't support View Transitions
      router.push(href);
      return;
    }

    document.startViewTransition(async () => {
      startTransition(() => {
        router.push(href);
      });
    });
  };

  return { navigateWithTransition, isPending };
}

interface ViewTransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function ViewTransitionLink({ 
  href, 
  children, 
  className,
  onClick 
}: ViewTransitionLinkProps) {
  const { navigateWithTransition } = useViewTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(e);
    navigateWithTransition(href);
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}

// Card transition wrapper for morphing effects
interface CardTransitionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function CardTransition({ id, children, className }: CardTransitionProps) {
  return (
    <div 
      className={className}
      style={{
        viewTransitionName: `card-${id}`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
} 