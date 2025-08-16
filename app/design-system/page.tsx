"use client";

import { DiscoverCard } from "@/components/cards/discover-card";
import { TopicDiscoverCard } from "@/components/cards/topic-discover-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DesignSystemPage() {
  const topics = useQuery(api.topics.getPublicTopics, { limit: 3 });
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Design System</h1>
        <p className="text-muted-foreground">
          A collection of reusable components and patterns
        </p>
      </div>

      {/* Card Components Section */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Card Components</h2>
          
          {/* Discover Card Examples */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Discover Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example 1 - Design & Illustration */}
                <DiscoverCard
                  title="Professional Design Resources: A Comprehensive Collection of Premium Templates, Tools, and Illustrations for Modern Creatives"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elitsed do eiusmod."
                  image="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=800&fit=crop"
                  tags={["Design", "Illustration"]}
                  highlight="$49.99"
                  officialLinks={[
                    { title: "View more", url: "#" }
                  ]}
                  socialLinks={[
                    { platform: "facebook", url: "#" },
                    { platform: "twitter", url: "#" },
                    { platform: "youtube", url: "#" },
                    { platform: "linkedin", url: "#" },
                  ]}
                />

                {/* Example 2 - Product Launch */}
                <DiscoverCard
                  title="New Product Launch"
                  description="Introducing our latest innovation in smart home technology. Experience the future of connected living."
                  image="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=800&fit=crop"
                  tags={["Tech", "Innovation"]}
                  highlight="✨ NEW"
                  officialLinks={[
                    { title: "Learn more", url: "#" },
                    { title: "Pre-order now", url: "#" }
                  ]}
                  socialLinks={[
                    { platform: "twitter", url: "#" },
                    { platform: "youtube", url: "#" },
                  ]}
                />

                {/* Example 3 - Art Exhibition */}
                <DiscoverCard
                  title="Contemporary Art"
                  description="Explore the boundaries of modern artistic expression through our curated collection."
                  image="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=800&fit=crop"
                  tags={["Art", "Gallery", "Exhibition"]}
                  highlight="Free Entry"
                  officialLinks={[
                    { title: "Visit gallery", url: "#" }
                  ]}
                  socialLinks={[
                    { platform: "facebook", url: "#" },
                    { platform: "linkedin", url: "#" },
                  ]}
                />
                
                {/* Example 4 - Without Highlight */}
                <DiscoverCard
                  title="Photography Workshop"
                  description="Master the art of visual storytelling through hands-on training with industry professionals."
                  image="https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=600&h=800&fit=crop"
                  tags={["Photography", "Workshop"]}
                  officialLinks={[
                    { title: "Register now", url: "#" },
                    { title: "View curriculum", url: "#" }
                  ]}
                  socialLinks={[
                    { platform: "twitter", url: "#" },
                  ]}
                />
              </div>
            </div>

            {/* Topic Discover Card Example */}
            <div className="mt-12">
              <h3 className="text-lg font-medium mb-4">Topic Discover Card</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Topics rendered with the Discover Card design - featuring official links and supporting links as icons.
              </p>
              {topics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topics.map((topic) => (
                    <TopicDiscoverCard key={topic._id} topic={topic} />
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 p-8 rounded-lg">
                  <p className="text-center text-muted-foreground">Loading topics...</p>
                </div>
              )}
              
              {/* Highlight Feature Note */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Highlight Feature</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  The highlight feature displays a subtle badge below the card title using the Badge component with secondary variant.
                  Cards now use a 3:4 portrait aspect ratio for images. Use cases include:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Prices:</strong> &ldquo;$29.99&rdquo;, &ldquo;$Free&rdquo;, &ldquo;From $10&rdquo;</li>
                  <li>• <strong>Status:</strong> &ldquo;NEW&rdquo;, &ldquo;TRENDING&rdquo;, &ldquo;LIMITED&rdquo;</li>
                  <li>• <strong>Availability:</strong> &ldquo;In Stock&rdquo;, &ldquo;Sold Out&rdquo;, &ldquo;Coming Soon&rdquo;</li>
                  <li>• <strong>Promotions:</strong> &ldquo;30% OFF&rdquo;, &ldquo;Sale&rdquo;, &ldquo;Hot Deal&rdquo;</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Note:</strong> For topics, highlights could be computed based on properties (e.g., &ldquo;TRENDING&rdquo; for 
                  isTrending topics) or added to the schema for custom values.
                </p>
              </div>
            </div>

            {/* Topic Square Card Example */}
            <div className="mt-12">
              <h3 className="text-lg font-medium mb-4">Topic Square Card (Current Explore View)</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This is the current card design used in the /explore page with image overlays and link badges.
              </p>
              <div className="bg-muted/50 p-8 rounded-lg">
                <p className="text-center text-muted-foreground">
                  View the Topic Square Card design at{" "}
                  <a href="/explore" className="text-primary hover:underline">
                    /explore
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold mb-6">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="h-24 bg-primary rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-muted-foreground">Brand color</p>
          </div>
          <div>
            <div className="h-24 bg-secondary rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Secondary</p>
            <p className="text-xs text-muted-foreground">Accent color</p>
          </div>
          <div>
            <div className="h-24 bg-muted rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Muted</p>
            <p className="text-xs text-muted-foreground">Background</p>
          </div>
          <div>
            <div className="h-24 bg-card border rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Card</p>
            <p className="text-xs text-muted-foreground">Card background</p>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold mb-6">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <p className="text-sm text-muted-foreground">text-3xl font-semibold</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <p className="text-sm text-muted-foreground">text-2xl font-semibold</p>
          </div>
          <div>
            <p className="text-base">Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="text-sm text-muted-foreground">text-base</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Muted text - Supporting information and descriptions.</p>
            <p className="text-sm text-muted-foreground">text-sm text-muted-foreground</p>
          </div>
        </div>
      </section>
    </div>
  );
}