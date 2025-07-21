"use client";

import { useState } from "react";
import { LinkPreview } from "@/components/link-preview/LinkPreview";
import { LinkPreviewModal } from "@/components/link-preview/LinkPreviewModal";
import { SharedViewTransition } from "@/components/link-preview/SharedViewTransition";
import { viewTransitionStyles } from "@/components/link-preview/SharedViewTransition";
import { detectLinkType } from "@/lib/link-type-detector";

// Demo links showcasing different content types
const demoLinks = [
  {
    category: "E-commerce",
    links: [
      {
        url: "https://www.apple.com/iphone-15-pro/",
        title: "iPhone 15 Pro - Apple",
        description: "The most powerful iPhone ever. Titanium design with A17 Pro chip.",
        image: "https://www.apple.com/v/iphone-15-pro/c/images/overview/welcome/hero_endframe__ov6ewwmbhiqq_large.jpg",
        price: "$999",
        originalPrice: "$1099",
        currency: "USD",
        rating: 4.8,
        reviewCount: 1542,
      },
      {
        url: "https://www.amazon.com/dp/B08N5WRWNW",
        title: "Echo Dot (4th Gen) - Smart speaker with Alexa",
        description: "Meet Echo Dot - Our most popular smart speaker with a fabric design.",
        image: "https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg",
        price: "$49.99",
        currency: "USD",
        rating: 4.3,
        reviewCount: 295847,
      }
    ]
  },
  {
    category: "Articles & Blogs",
    links: [
      {
        url: "https://medium.com/@example/building-modern-web-apps",
        title: "Building Modern Web Applications in 2024",
        description: "A comprehensive guide to modern web development practices and tools.",
        image: "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg",
        author: "John Developer",
        publishedTime: "2024-01-15",
        readingTime: "8 min read",
      },
      {
        url: "https://dev.to/react/new-features-in-react-19",
        title: "What's New in React 19: A Deep Dive",
        description: "Explore the latest features and improvements in React 19.",
        image: "https://res.cloudinary.com/practicaldev/image/fetch/s--_blt0f-P--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/react19.jpg",
        author: "React Team",
        publishedTime: "2024-02-01",
        readingTime: "12 min read",
      }
    ]
  },
  {
    category: "Videos",
    links: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Rick Astley - Never Gonna Give You Up",
        description: "The official video for 'Never Gonna Give You Up' by Rick Astley.",
        image: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "3:33",
        views: 1400000000,
        channelName: "Rick Astley",
      },
      {
        url: "https://vimeo.com/channels/staffpicks/123456789",
        title: "The Art of Cinematography",
        description: "A visual essay on the evolution of cinematography techniques.",
        image: "https://i.vimeocdn.com/video/123456789_1280x720.jpg",
        duration: "15:42",
        views: 45000,
        channelName: "Film School",
      }
    ]
  },
  {
    category: "Events",
    links: [
      {
        url: "https://conference2024.example.com",
        title: "TechConf 2024: The Future of AI",
        description: "Join us for the biggest tech conference of the year featuring AI innovations.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        startDate: "2024-06-15T09:00:00Z",
        endDate: "2024-06-17T18:00:00Z",
        location: {
          name: "Moscone Center",
          address: "747 Howard Street",
          city: "San Francisco",
          country: "USA"
        },
        price: "$299",
        eventType: "offline" as const,
      }
    ]
  },
  {
    category: "Failed/Generic Links",
    links: [
      {
        url: "https://home.atlassian.com/o/0kj0cb77-7adc-1783-7006-194cb2c403b6/s/3ba3ed99-9cfe-4951-9338-462ed0e231d8/goal/PSSKY-2/jira",
        title: "Atlassian Goal - PSSKY-2",
        description: "This appears to be a private Atlassian/Jira link that requires authentication.",
        image: null,
      },
      {
        url: "https://example.com/some-random-page",
        title: "Generic Web Page",
        description: "A standard web page without specific metadata or content type.",
        image: null,
      },
      {
        url: "https://internal.company.com/document/12345",
        title: "Internal Document",
        description: "This link appears to be from an internal company system.",
        image: null,
      }
    ]
  }
];

export function DemoContent() {
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLinkClick = (link: any) => {
    setSelectedLink(link);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Inject view transition styles */}
      <style dangerouslySetInnerHTML={{ __html: viewTransitionStyles }} />

      <div className="space-y-12">
        {demoLinks.map((category) => (
          <div key={category.category} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{category.category}</h2>
              <p className="text-muted-foreground">
                {category.category === "Failed/Generic Links" 
                  ? "Examples of links that fall back to a generic preview"
                  : `Immersive previews for ${category.category.toLowerCase()}`
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.links.map((link, index) => {
                const linkType = detectLinkType(link.url);
                
                return (
                  <SharedViewTransition
                    key={`${category.category}-${index}`}
                    viewTransitionName={`demo-card-${category.category}-${index}`}
                    onClick={() => handleLinkClick(link)}
                    className="cursor-pointer transform transition-transform hover:scale-105"
                  >
                    <LinkPreview
                      data={{
                        url: link.url,
                        title: link.title,
                        description: link.description,
                        image: link.image || undefined,
                        type: linkType,
                        price: (link as any).price,
                        originalPrice: (link as any).originalPrice,
                        currency: (link as any).currency,
                        rating: (link as any).rating,
                        reviewCount: (link as any).reviewCount,
                        author: (link as any).author,
                        publishedTime: (link as any).publishedTime,
                        duration: (link as any).duration,
                        views: (link as any).views,
                        channelName: (link as any).channelName,
                        startDate: (link as any).startDate,
                        endDate: (link as any).endDate,
                        location: (link as any).location,
                      }}
                      isBookmarked={false}
                      onBookmark={() => {
                        console.log("Bookmark demo link:", link.url);
                      }}
                    />
                  </SharedViewTransition>
                );
              })}
            </div>
          </div>
        ))}
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
          rating={selectedLink.rating}
          reviewCount={selectedLink.reviewCount}
          author={selectedLink.author}
          duration={selectedLink.duration}
          date={selectedLink.startDate || selectedLink.publishedTime}
          location={selectedLink.location}
          onBookmark={() => {
            console.log("Bookmark from modal:", selectedLink.url);
          }}
          onShare={() => {
            console.log("Share from modal:", selectedLink.url);
          }}
        />
      )}
    </>
  );
} 