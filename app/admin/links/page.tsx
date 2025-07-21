"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Trash2, Search, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LinksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const [onlyPublic, setOnlyPublic] = useState<boolean | undefined>(undefined);
  const [selectedLinks, setSelectedLinks] = useState<Set<Id<"links">>>(new Set());
  
  const links = useQuery(api.admin.getAllLinks, {
    searchTerm: searchTerm || undefined,
    platform: platform || undefined,
    onlyPublic,
  });
  
  const deleteLink = useMutation(api.admin.deleteLink);
  const toggleVisibility = useMutation(api.admin.toggleLinkVisibility);
  const bulkDelete = useMutation(api.admin.bulkDeleteLinks);

  const handleDeleteLink = async (linkId: Id<"links">) => {
    if (confirm("Are you sure you want to delete this link?")) {
      await deleteLink({ linkId });
    }
  };

  const handleToggleVisibility = async (linkId: Id<"links">) => {
    await toggleVisibility({ linkId });
  };

  const handleBulkDelete = async () => {
    if (selectedLinks.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedLinks.size} links?`)) {
      await bulkDelete({ linkIds: Array.from(selectedLinks) });
      setSelectedLinks(new Set());
    }
  };

  const toggleLinkSelection = (linkId: Id<"links">) => {
    const newSelection = new Set(selectedLinks);
    if (newSelection.has(linkId)) {
      newSelection.delete(linkId);
    } else {
      newSelection.add(linkId);
    }
    setSelectedLinks(newSelection);
  };

  const selectAll = () => {
    if (!links) return;
    setSelectedLinks(new Set(links.map(link => link._id)));
  };

  const deselectAll = () => {
    setSelectedLinks(new Set());
  };

  // Get unique platforms
  const platforms: string[] = links
    ? Array.from(new Set(links.map(l => l.platform).filter(Boolean))) as string[]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Link Management</h2>
        <p className="text-muted-foreground">
          Manage all links in the platform
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, description, or URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All platforms</SelectItem>
                {platforms.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={onlyPublic === undefined ? "all" : onlyPublic ? "public" : "private"} 
              onValueChange={(value) => {
                setOnlyPublic(value === "all" ? undefined : value === "public");
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All links</SelectItem>
                <SelectItem value="public">Public only</SelectItem>
                <SelectItem value="private">Private only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedLinks.size > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium">
                {selectedLinks.size} link{selectedLinks.size > 1 ? "s" : ""} selected
              </p>
              <Button variant="link" size="sm" onClick={deselectAll}>
                Deselect all
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Links ({links?.length || 0})</CardTitle>
              <CardDescription>
                All links in the system
              </CardDescription>
            </div>
            {links && links.length > 0 && (
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!links ? (
            <div>Loading links...</div>
          ) : links.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No links found
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div
                  key={link._id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    checked={selectedLinks.has(link._id)}
                    onCheckedChange={() => toggleLinkSelection(link._id)}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{link.title}</h4>
                          {link.platform && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {link.platform}
                            </span>
                          )}
                          {link.isPublic ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        {link.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {link.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center hover:underline"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {link.url}
                          </a>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{link.bookmarkCount} bookmarks</span>
                          <span>{link.viewCount} views</span>
                          {link.user && (
                            <span>by {link.user.name || link.user.email}</span>
                          )}
                          <span>
                            {formatDistanceToNow(new Date(link._creationTime), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleVisibility(link._id)}
                        >
                          {link.isPublic ? "Make Private" : "Make Public"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLink(link._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 