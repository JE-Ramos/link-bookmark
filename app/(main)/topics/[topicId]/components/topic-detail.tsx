"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  Loader2,
  ArrowLeft,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopicDetailProps {
  topicId: string;
}

export function TopicDetail({ topicId }: TopicDetailProps) {
  const router = useRouter();
  const topic = useQuery(api.topics.getTopic, {
    topicId: topicId as Id<"topics">,
  });
  const toggleLike = useMutation(api.topics.toggleLike);
  const toggleBookmark = useMutation(api.topics.toggleBookmark);

  if (topic === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">Topic not found.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const createdAt = new Date(topic._creationTime).toLocaleDateString();

  const handleToggleLike = async () => {
    try {
      await toggleLike({ topicId: topic._id });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      await toggleBookmark({ topicId: topic._id });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Topics
      </Button>

      {/* Topic Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            {/* Title and badges */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{topic.title}</h1>
                  {topic.isTrending && (
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground">
                  {topic.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleBookmark}
                >
                  <Bookmark className={cn("h-4 w-4", topic.isBookmarked && "fill-current")} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {topic.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Stats and author */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={topic.author.imageUrl} />
                  <AvatarFallback>
                    {topic.author.name?.[0] || topic.author.email[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {topic.author.name || topic.author.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created on {createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleLike}
                  className="flex items-center gap-2 text-sm hover:text-foreground transition-colors"
                >
                  <Heart className={cn("h-5 w-5", topic.isLiked && "fill-red-500 text-red-500")} />
                  {topic.likeCount} likes
                </button>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                  {topic.commentCount} comments
                </span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-5 w-5" />
                  {topic.bookmarkCount} bookmarks
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Primary Links Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <CardTitle>Primary Links</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {topic.primaryLinks.length}/3 slots
              </Badge>
            </div>
            {topic.primaryLinks.length < 3 && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Primary Link
              </Button>
            )}
          </div>
          <CardDescription>
            The most important and relevant links for this topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {[0, 1, 2].map((idx) => {
              const link = topic.primaryLinks[idx];
              return (
                <div
                  key={idx}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-lg border transition-all",
                    link
                      ? "bg-card hover:bg-accent hover:border-accent cursor-pointer group"
                      : "bg-muted/30 border-dashed border-muted-foreground/30"
                  )}
                  onClick={() => link && window.open(link.url, "_blank")}
                >
                  {/* Slot Number */}
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold flex-shrink-0",
                    link ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>

                  {link ? (
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-base group-hover:underline">
                            {link.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {link.description}
                          </p>
                          {link.caption && (
                            <p className="text-sm mt-2 italic">
                              "{link.caption}"
                            </p>
                          )}
                        </div>
                        {link.image && (
                          <img
                            src={link.image}
                            alt=""
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          {link.platform || new URL(link.url).hostname}
                        </span>
                        {link.price && (
                          <span className="font-medium text-foreground">
                            {link.currency || "$"}{link.price}
                          </span>
                        )}
                        <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Empty primary link slot
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Link
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Supporting Links Section */}
      {topic.supportingLinks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                <CardTitle>Supporting Links</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {topic.supportingLinks.length} links
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Supporting Link
              </Button>
            </div>
            <CardDescription>
              Additional resources and references
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topic.supportingLinks.map((link) => (
                <div
                  key={link._id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:border-accent cursor-pointer group transition-all"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  {/* Favicon */}
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    {link.favicon ? (
                      <img src={link.favicon} alt="" className="h-5 w-5" />
                    ) : (
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Link info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:underline">
                      {link.title}
                    </p>
                    {link.caption && (
                      <p className="text-xs text-muted-foreground truncate">
                        {link.caption}
                      </p>
                    )}
                  </div>

                  {/* Domain and price */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="hidden sm:block">
                      {link.platform || new URL(link.url).hostname}
                    </span>
                    {link.price && (
                      <span className="font-medium text-foreground">
                        {link.currency || "$"}{link.price}
                      </span>
                    )}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty Supporting Links */}
      {topic.supportingLinks.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8">
            <div className="text-center space-y-3">
              <Link2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">No supporting links yet</p>
                <p className="text-sm text-muted-foreground">
                  Add additional resources to complement the primary links
                </p>
              </div>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Supporting Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}