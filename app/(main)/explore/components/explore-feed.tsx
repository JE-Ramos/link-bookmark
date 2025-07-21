"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductLinkCard } from "@/components/product-link-card";
import { Id } from "@/convex/_generated/dataModel";
import { useSearchParams } from "next/navigation";

export function ExploreFeed() {
  const searchParams = useSearchParams();
  const platform = searchParams.get("platform") || undefined;
  
  const [bookmarkedLinks, setBookmarkedLinks] = useState<Set<Id<"links">>>(new Set());
  
  // Queries
  const publicLinks = useQuery(api.links.getPublicLinks, { platform });
  const userCollection = useQuery(api.links.getUserCollection, {});
  
  // Mutations
  const toggleBookmark = useMutation(api.links.toggleBookmark);

  // Track bookmarked links
  useEffect(() => {
    if (userCollection) {
      const bookmarked = new Set(userCollection.map(item => item.link._id));
      setBookmarkedLinks(bookmarked);
    }
  }, [userCollection]);

  const handleBookmark = async (linkId: Id<"links">) => {
    try {
      const isBookmarked = await toggleBookmark({ linkId });
      setBookmarkedLinks(prev => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(linkId);
        } else {
          next.delete(linkId);
        }
        return next;
      });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  if (!publicLinks) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-64"
          />
        ))}
      </div>
    );
  }

  if (publicLinks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-2">No links found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {platform ? `No links available for ${platform}` : "Be the first to add a link!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {publicLinks.map((link) => (
        <div
          key={link._id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <ProductLinkCard
            id={link._id}
            title={link.title}
            url={link.url}
            image={link.image}
            price={link.price}
            originalPrice={link.originalPrice}
            currency={link.currency}
            platform={link.platform}
            bookmarkCount={link.bookmarkCount}
            isBookmarked={bookmarkedLinks.has(link._id)}
            onBookmark={() => handleBookmark(link._id)}
          />
        </div>
      ))}
    </div>
  );
} 