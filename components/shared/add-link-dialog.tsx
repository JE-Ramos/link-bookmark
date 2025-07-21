"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function AddLinkDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    image: string;
    favicon: string;
    platform: string;
  } | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const createLink = useMutation(api.links.createLink);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!url) {
        setMetadata(null);
        setError("");
        return;
      }
      
      try {
        // Basic URL validation
        new URL(url);
        setError("");
      } catch {
        setError("Please enter a valid URL");
        setMetadata(null);
        return;
      }
      
      setIsLoadingMetadata(true);
      
      try {
        const response = await fetch('/api/og', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setMetadata({
            title: data.title || "Untitled",
            description: data.description || "",
            image: data.image || "",
            favicon: data.favicon || "",
            platform: data.platform || "",
          });
        } else {
          setError("Unable to fetch link details");
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
        setError("Failed to load link preview");
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    
    // Debounce the metadata fetch
    const timeoutId = setTimeout(fetchMetadata, 800);
    return () => clearTimeout(timeoutId);
  }, [url]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!metadata) {
      setError("Please wait for the link preview to load");
      return;
    }
    
    try {
      await createLink({
        url: url,
        title: metadata.title,
        description: metadata.description || undefined,
        image: metadata.image || undefined,
        favicon: metadata.favicon || undefined,
        platform: metadata.platform || undefined,
        isPublic: isPublic,
      });
      
      // Reset form
      setOpen(false);
      setUrl("");
      setMetadata(null);
      setIsPublic(false);
      setError("");
    } catch (error) {
      console.error("Failed to create link:", error);
      setError("Failed to save link");
    }
  };

  const handleReset = () => {
    setUrl("");
    setMetadata(null);
    setIsPublic(false);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (!open) handleReset();
    }}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-300 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
          <DialogDescription>
            Paste any URL and we&apos;ll save it with a beautiful preview.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url" className="sr-only">URL</Label>
            <div className="relative">
              <Input 
                id="url" 
                name="url" 
                type="url" 
                required 
                placeholder="Paste any link here..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pr-10 text-lg h-12"
                autoFocus
              />
              {isLoadingMetadata && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          
          {/* Preview section */}
          {metadata && !error && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-lg border overflow-hidden">
                {metadata.image && (
                  <div className="aspect-video relative bg-gray-100">
                    <img 
                      src={metadata.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    {metadata.favicon && (
                      <img 
                        src={metadata.favicon} 
                        alt="" 
                        className="w-5 h-5 mt-0.5 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base line-clamp-2">
                        {metadata.title}
                      </h3>
                      {metadata.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {metadata.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {metadata.platform}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPublic" 
                  checked={isPublic}
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                />
                <Label 
                  htmlFor="isPublic" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Share this link publicly
                </Label>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-300"
            disabled={isLoadingMetadata || !metadata || !!error}
          >
            {isLoadingMetadata ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading preview...
              </>
            ) : (
              "Save Link"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 