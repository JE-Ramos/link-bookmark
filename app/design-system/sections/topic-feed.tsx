import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Star, 
  Link2, 
  MessageCircle,
  Heart,
  Clock,
  TrendingUp,
  Users,
  Hash
} from "lucide-react";
import Image from "next/image";

// Demo data for topic feed
const topicFeedData = [
  {
    id: "1",
    title: "React Best Practices 2024",
    description: "A curated collection of the most important React resources, patterns, and practices for modern web development.",
    author: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      username: "@sarahchen"
    },
    stats: {
      primaryLinks: 3,
      totalLinks: 7,
      likes: 124,
      comments: 18,
      bookmarks: 45
    },
    tags: ["react", "javascript", "webdev"],
    createdAt: "2 hours ago",
    primaryLinkPreviews: [
      {
        title: "React Documentation",
        favicon: "https://react.dev/favicon.ico",
        domain: "react.dev"
      },
      {
        title: "React Patterns",
        favicon: null,
        domain: "patterns.dev"
      }
    ]
  },
  {
    id: "2",
    title: "AI Tools for Developers",
    description: "Essential AI-powered tools that are changing how developers write, test, and deploy code in 2024.",
    author: {
      name: "Alex Kumar",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      username: "@alexkumar"
    },
    stats: {
      primaryLinks: 3,
      totalLinks: 12,
      likes: 89,
      comments: 23,
      bookmarks: 67
    },
    tags: ["ai", "productivity", "tools"],
    createdAt: "5 hours ago",
    primaryLinkPreviews: [
      {
        title: "GitHub Copilot",
        favicon: "https://github.com/favicon.ico",
        domain: "github.com"
      },
      {
        title: "Cursor AI",
        favicon: null,
        domain: "cursor.sh"
      },
      {
        title: "v0 by Vercel",
        favicon: "https://vercel.com/favicon.ico",
        domain: "v0.dev"
      }
    ]
  },
  {
    id: "3",
    title: "Modern CSS Techniques",
    description: "Explore the latest CSS features including container queries, cascade layers, and new color spaces.",
    author: {
      name: "Maya Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      username: "@mayapatel"
    },
    stats: {
      primaryLinks: 2,
      totalLinks: 5,
      likes: 56,
      comments: 12,
      bookmarks: 34
    },
    tags: ["css", "frontend", "design"],
    createdAt: "1 day ago",
    trending: true,
    primaryLinkPreviews: [
      {
        title: "CSS Tricks",
        favicon: null,
        domain: "css-tricks.com"
      },
      {
        title: "MDN Web Docs",
        favicon: "https://developer.mozilla.org/favicon.ico",
        domain: "developer.mozilla.org"
      }
    ]
  }
];

// Compact Topic Card for Feed View
function TopicFeedCard({ topic }: { topic: typeof topicFeedData[0] }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardHeader className="pb-3">
        {/* Topic Title and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-xl line-clamp-1">{topic.title}</h3>
              {topic.trending && (
                <Badge variant="secondary" className="gap-1 px-2 py-0.5 whitespace-nowrap">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {topic.description}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Links Section - Visual emphasis on 3 slots */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              Primary Links
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {topic.stats.primaryLinks}/3 slots filled
            </span>
          </div>
          
          {/* Primary Links Grid - Always show 3 slots */}
          <div className="grid grid-cols-1 gap-2">
            {[0, 1, 2].map((idx) => {
              const link = topic.primaryLinkPreviews[idx];
              return (
                <div 
                  key={idx} 
                  className={cn(
                    "relative flex items-center gap-3 p-3 rounded-lg border transition-all",
                    link 
                      ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 cursor-pointer group" 
                      : "bg-muted/30 border-dashed border-muted-foreground/30"
                  )}
                >
                  {/* Slot Number */}
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0",
                    link ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>
                  
                  {link ? (
                    <>
                      {/* Favicon */}
                      <div className="h-5 w-5 rounded flex items-center justify-center bg-background flex-shrink-0">
                        {link.favicon ? (
                          <img src={link.favicon} alt="" className="h-4 w-4" />
                        ) : (
                          <Link2 className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      
                      {/* Link Title */}
                      <span className="text-sm font-medium truncate flex-1">{link.title}</span>
                      
                      {/* Domain */}
                      <span className="text-xs text-muted-foreground hidden sm:block">{link.domain}</span>
                      
                      {/* External Link Icon */}
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Empty slot</span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Supporting Links Count */}
          {topic.stats.totalLinks > topic.stats.primaryLinks && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="h-3 w-3" />
              <span>{topic.stats.totalLinks - topic.stats.primaryLinks} supporting links</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {topic.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs h-6">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Footer with Author and Stats */}
        <div className="flex items-center justify-between pt-3 border-t">
          {/* Author Info (de-emphasized) */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={topic.author.avatar} />
              <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {topic.author.name} • {topic.createdAt}
            </span>
          </div>
          
          {/* Engagement Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {topic.stats.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {topic.stats.comments}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {topic.stats.bookmarks}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid View Option
function TopicGridCard({ topic }: { topic: typeof topicFeedData[0] }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {topic.trending && (
              <Badge variant="secondary" className="gap-1 px-2 py-0.5">
                <TrendingUp className="h-3 w-3" />
                Trending
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
              <Bookmark className="h-3 w-3" />
            </Button>
          </div>
          <CardTitle className="text-base font-bold line-clamp-2">{topic.title}</CardTitle>
          <CardDescription className="text-xs line-clamp-2">
            {topic.description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-3">
        {/* Primary Links Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Primary Links</span>
            <span className="text-xs font-bold text-primary">{topic.stats.primaryLinks}/3</span>
          </div>
          
          {/* Visual representation of 3 slots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  idx < topic.stats.primaryLinks 
                    ? "bg-primary" 
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          
          {/* Domain badges for filled slots */}
          <div className="flex flex-wrap gap-1">
            {topic.primaryLinkPreviews.map((link, idx) => (
              <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0 h-5">
                {link.domain}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Supporting Links */}
        {topic.stats.totalLinks > topic.stats.primaryLinks && (
          <p className="text-xs text-muted-foreground">
            +{topic.stats.totalLinks - topic.stats.primaryLinks} supporting
          </p>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 flex-1">
          {topic.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Footer */}
        <div className="pt-2 mt-auto border-t flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={topic.author.avatar} />
              <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {topic.author.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              {topic.stats.likes}
            </span>
            <span className="flex items-center gap-0.5">
              <MessageCircle className="h-3 w-3" />
              {topic.stats.comments}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopicFeedSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Topic Feed Views</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Display topics in explore or newsfeed pages. Shows topic summaries with primary link previews
          and engagement metrics for quick browsing.
        </p>
      </div>

      {/* Feed View */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Feed View (Mobile-First)</h2>
          <p className="text-muted-foreground mb-6">
            Vertical feed optimized for mobile scrolling with rich link previews
          </p>
          
          <div className="max-w-2xl mx-auto space-y-4">
            {topicFeedData.map((topic) => (
              <TopicFeedCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="space-y-6 mt-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Grid View (Desktop)</h2>
          <p className="text-muted-foreground mb-6">
            Compact grid layout for desktop browsing
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topicFeedData.map((topic) => (
              <TopicGridCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </div>

      {/* Design Notes */}
      <Card className="bg-muted/50 mt-12">
        <CardHeader>
          <CardTitle className="text-lg">UX Design Decisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Key Visual Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>3 Primary Link Slots Always Visible</strong> - Shows filled and empty slots clearly</li>
              <li>• Numbered slots (1, 2, 3) make the limit explicit</li>
              <li>• Empty slots shown with dashed borders and "Empty slot" text</li>
              <li>• Primary link counter shows "X/3 slots filled"</li>
              <li>• Filled slots have highlighted background and borders</li>
              <li>• Supporting links de-emphasized as simple count</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Information Hierarchy</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Topic title first</strong> - Most prominent element</li>
              <li>• <strong>Primary links section</strong> - Clear visual treatment with slots</li>
              <li>• <strong>Tags</strong> - For quick topic categorization</li>
              <li>• <strong>Author last</strong> - De-emphasized in footer with smaller avatar</li>
              <li>• Engagement metrics grouped together</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Grid View Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Progress bar shows 3 slots visually</li>
              <li>• Filled slots shown as colored bars</li>
              <li>• "X/3" counter for quick scanning</li>
              <li>• Compact author info in footer</li>
              <li>• Domain badges for primary links</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Design Inspiration</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Inspired by [Tailwind UI feed patterns](https://tailwindcss.com/plus/ui-blocks/application-ui/lists/feeds)</li>
              <li>• Slot-based UI from gaming/inventory systems</li>
              <li>• Progress indicators from task management apps</li>
              <li>• Link curation sites like [GitHub brianjychan/links](https://github.com/brianjychan/links)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}