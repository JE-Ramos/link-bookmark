"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductLinkCard } from "@/components/product-link-card";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

export function BookmarksCollection() {
  // Queries
  const userCollection = useQuery(api.links.getUserCollection, {});
  
  // Mutations
  const toggleBookmark = useMutation(api.links.toggleBookmark);

  const handleBookmark = async (linkId: Id<"links">) => {
    try {
      await toggleBookmark({ linkId });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  if (!userCollection) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-64"
          />
        ))}
      </div>
    );
  }

  if (userCollection.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No bookmarks yet</p>
        <Button 
          onClick={() => window.location.href = "/explore"}
          variant="outline"
        >
          Explore Links
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Bookmarks</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {userCollection.map(({ link }) => (
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
                bookmarkCount={link.bookmarkCount}
                isBookmarked={true}
                onBookmark={() => handleBookmark(link._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 