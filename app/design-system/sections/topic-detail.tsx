import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bookmark, Share2, Star, Link2, Plus } from "lucide-react";
import Image from "next/image";

// Demo data for the topic detail view
const topicData = {
  title: "React Best Practices 2024",
  description: "A curated collection of the most important React resources, patterns, and practices for modern web development.",
  primaryLinks: [
    {
      id: "1",
      title: "React Documentation - New React Docs",
      description: "The official React documentation with interactive examples and comprehensive guides",
      url: "https://react.dev",
      image: "https://react.dev/images/og-home.png",
      isPrimary: true,
    },
    {
      id: "2",
      title: "React Patterns - Advanced Component Patterns",
      description: "Deep dive into advanced React patterns including compound components, render props, and custom hooks",
      url: "https://patterns.dev",
      image: null,
      isPrimary: true,
    },
    {
      id: "3",
      title: "React Performance Optimization Guide",
      description: "Comprehensive guide to optimizing React applications for production",
      url: "https://web.dev/react",
      image: null,
      isPrimary: true,
    },
  ],
  supportingLinks: [
    {
      id: "4",
      title: "React Query - Server State Management",
      description: "Powerful data synchronization for React",
      url: "https://tanstack.com/query",
    },
    {
      id: "5",
      title: "Zustand - Lightweight State Management",
      description: "A small, fast and scalable state-management solution",
      url: "https://github.com/pmndrs/zustand",
    },
    {
      id: "6",
      title: "React Hook Form - Form Validation",
      description: "Performant forms with easy-to-use validation",
      url: "https://react-hook-form.com",
    },
    {
      id: "7",
      title: "Framer Motion - Animation Library",
      description: "Production-ready motion library for React",
      url: "https://framer.com/motion",
    },
  ],
};

function PrimaryLinkCard({ link }: { link: typeof topicData.primaryLinks[0] }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-muted-foreground">PRIMARY LINK</span>
            </div>
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {link.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {link.description}
            </CardDescription>
          </div>
          {link.image && (
            <div className="flex-shrink-0">
              <Image
                src={link.image}
                alt={link.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => window.open(link.url, "_blank")}
          >
            <ExternalLink className="h-3 w-3" />
            Visit Site
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportingLinkItem({ link }: { link: typeof topicData.supportingLinks[0] }) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10">
          <Link2 className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {link.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {link.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => window.open(link.url, "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function TopicDetailSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Topic Detail View</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Display a topic with 3 primary links and unlimited supporting links. Primary links get
          prominent placement with rich previews, while supporting links are displayed in a compact list.
        </p>
      </div>

      {/* Topic Header */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{topicData.title}</CardTitle>
          <CardDescription className="text-base">
            {topicData.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Primary Links Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Primary Links</h2>
          <span className="text-sm text-muted-foreground">3 of 3 slots used</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {topicData.primaryLinks.map((link) => (
            <PrimaryLinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>

      {/* Supporting Links Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Supporting Links</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardContent className="p-2">
            <div className="divide-y">
              {topicData.supportingLinks.map((link) => (
                <SupportingLinkItem key={link.id} link={link} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Notes */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Design Decisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Primary Links (3 max)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Prominent card layout with images when available</li>
              <li>• Star icon to indicate primary status</li>
              <li>• Clear "Visit Site" CTA button</li>
              <li>• Bookmark and share actions readily available</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Supporting Links (unlimited)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Compact list view for efficient space usage</li>
              <li>• Hover states for better interactivity</li>
              <li>• Quick access to external link and bookmark</li>
              <li>• Grouped in a single card to show relationship</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Mobile Considerations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Primary links stack vertically on mobile</li>
              <li>• Touch-friendly button sizes (min 44px)</li>
              <li>• Swipe actions could be added for mobile</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}