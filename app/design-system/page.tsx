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
                {/* Example 1 - Mountain Landscape */}
                <DiscoverCard
                  title="Immersive Mountain Experience: Explore Switzerland's Alpine Peaks in Stunning Detail"
                  description="Capture the breathtaking beauty of snow-capped mountains with layers of depth perfect for 3D conversion."
                  image="https://picsum.photos/600/800?random=1"
                  tags={["Nature", "Landscape"]}
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

                {/* Example 2 - Abstract Art */}
                <DiscoverCard
                  title="3D Abstract Geometry"
                  description="Dive into a world of dimensional shapes and vibrant gradients designed for immersive viewing experiences."
                  image="https://picsum.photos/600/800?random=2"
                  tags={["3D Art", "Digital"]}
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

                {/* Example 3 - Atmospheric Background */}
                <DiscoverCard
                  title="Ethereal Cloudscapes"
                  description="Experience atmospheric depth with layered clouds and dramatic lighting perfect for immersive backgrounds."
                  image="https://picsum.photos/600/800?random=3"
                  tags={["Atmosphere", "Sky", "Clouds"]}
                  highlight="Free Entry"
                  officialLinks={[
                    { title: "Visit gallery", url: "#" }
                  ]}
                  socialLinks={[
                    { platform: "facebook", url: "#" },
                    { platform: "linkedin", url: "#" },
                  ]}
                />
                
                {/* Example 4 - Architectural Depth */}
                <DiscoverCard
                  title="Urban Architecture"
                  description="Discover the depth and perspective of modern cityscapes with strong geometric lines and vanishing points."
                  image="https://picsum.photos/600/800?random=4"
                  tags={["Architecture", "Urban"]}
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
              
              {/* Test with base64 image */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Image Loading Test</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Testing with different image sources:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium mb-2">CSS Gradient</p>
                    <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">CSS</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2">Local SVG</p>
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/placeholder-image.svg" alt="Local SVG" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2">External Image</p>
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://via.placeholder.com/300x400" alt="External" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Check browser console (F12) for any image loading errors. If external images don&apos;t load, 
                  it may be due to Content Security Policy or network restrictions.
                </p>
              </div>
              
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
              
              {/* Immersive Images Note */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Immersive Images for Prototyping</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on insights from <a href="https://www.immersity.ai" className="text-primary hover:underline">Immersity.ai</a> and prototyping best practices, 
                  ideal immersive images should have:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Depth layers:</strong> Multiple planes (foreground, midground, background) for 3D conversion potential</li>
                  <li>• <strong>Natural perspective:</strong> Images with clear vanishing points or depth cues</li>
                  <li>• <strong>Motion potential:</strong> Scenes that would benefit from camera movement (dolly, zoom, pan)</li>
                  <li>• <strong>Portrait orientation:</strong> 3:4 ratio works well for mobile and immersive experiences</li>
                  <li>• <strong>High contrast elements:</strong> Clear subject separation for depth mapping</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Resources:</strong> Unsplash provides high-quality images suitable for prototyping. For production, consider 
                  using <a href="https://www.immersity.ai" className="text-primary hover:underline">Immersity.ai</a> to convert 2D images 
                  into 3D experiences for Apple Vision Pro and Meta Quest.
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