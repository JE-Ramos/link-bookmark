"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LinkPreview } from "@/components/link-preview/LinkPreview";
import { LinkPreviewModal } from "@/components/link-preview/LinkPreviewModal";
import { SharedViewTransition } from "@/components/link-preview/SharedViewTransition";
import { viewTransitionStyles } from "@/components/link-preview/SharedViewTransition";
import { detectLinkType } from "@/lib/link-type-detector";
import { Loader2 } from "lucide-react";

type LinkType = NonNullable<ReturnType<typeof useQuery<typeof api.links.getPublicLinks>>>[0];

export function ExploreFeed() {
  const links = useQuery(api.links.getPublicLinks, {});
  const [selectedLink, setSelectedLink] = useState<LinkType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (links === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No links to explore yet.</p>
      </div>
    );
  }

  const handleLinkClick = (link: typeof links[0]) => {
    setSelectedLink(link);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Inject view transition styles */}
      <style dangerouslySetInnerHTML={{ __html: viewTransitionStyles }} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 pb-20">
        {links.map((link) => {
          const linkType = detectLinkType(link.url);
          
          return (
            <SharedViewTransition
              key={link._id}
              href={`/bookmarks/${link._id}`}
              viewTransitionName={`card-${link._id}`}
              onClick={() => handleLinkClick(link)}
              className="cursor-pointer transform transition-transform hover:scale-105"
            >
              <LinkPreview
                data={{
                  url: link.url,
                  title: link.title,
                  description: link.description,
                  image: link.image,
                  type: linkType,
                  price: link.price,
                  originalPrice: link.originalPrice,
                  currency: link.currency,
                  siteName: link.platform,
                }}
                isBookmarked={false} // We'll need to query this separately
                onBookmark={() => {
                  // Handle bookmark action
                  console.log("Bookmark", link._id);
                }}
              />
            </SharedViewTransition>
          );
        })}
      </div>

      {/* Link Preview Modal */}
      {selectedLink && (
        <LinkPreviewModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          url={selectedLink.url}
          title={selectedLink.title}
          description={selectedLink.description}
          imageUrl={selectedLink.image}
          linkType={detectLinkType(selectedLink.url)}
          price={selectedLink.price}
          onBookmark={() => {
            // Handle bookmark action in modal
            console.log("Bookmark from modal", selectedLink._id);
          }}
          onShare={() => {
            // Handle share action in modal
            console.log("Share from modal", selectedLink._id);
          }}
        />
      )}
    </>
  );
} 