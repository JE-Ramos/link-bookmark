"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductLinkCard } from "@/components/product-link-card";
import { ReminderDialog } from "@/components/reminder-dialog";
import { ProfilePage } from "@/components/profile-page";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
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
import { cn } from "@/lib/utils";

type Tab = "explore" | "collection" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bookmarkedLinks, setBookmarkedLinks] = useState<Set<Id<"links">>>(new Set());
  const [reminderDialog, setReminderDialog] = useState<{
    open: boolean;
    linkId: Id<"links"> | null;
    linkTitle: string;
  }>({ open: false, linkId: null, linkTitle: "" });

  // Queries
  const publicLinks = useQuery(api.links.getPublicLinks, { platform: selectedPlatform });
  const userCollection = useQuery(api.links.getUserCollection, {});
  
  // Mutations
  const toggleBookmark = useMutation(api.links.toggleBookmark);
  const createLink = useMutation(api.links.createLink);
  const updateReminder = useMutation(api.links.updateReminder);

  // Track bookmarked links
  useEffect(() => {
    if (userCollection) {
      const bookmarked = new Set(userCollection.map(item => item.link._id));
      setBookmarkedLinks(bookmarked);
    }
  }, [userCollection]);

  const handleBookmark = async (linkId: Id<"links">) => {
    try {
      const isBookmarked = await toggleBookmark({ linkId });
      setBookmarkedLinks(prev => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(linkId);
        } else {
          next.delete(linkId);
        }
        return next;
      });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const handleSetReminder = (linkId: Id<"links">, linkTitle: string) => {
    setReminderDialog({ open: true, linkId, linkTitle });
  };

  const handleSaveReminder = async (date: Date, note?: string) => {
    if (!reminderDialog.linkId) return;
    
    try {
      await updateReminder({
        linkId: reminderDialog.linkId,
        reminderDate: date.getTime(),
        reminderNote: note,
      });
      setReminderDialog({ open: false, linkId: null, linkTitle: "" });
    } catch (error) {
      console.error("Failed to set reminder:", error);
    }
  };

  const handleAddLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createLink({
        url: formData.get("url") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string || undefined,
        price: formData.get("price") as string || undefined,
        originalPrice: formData.get("originalPrice") as string || undefined,
        platform: formData.get("platform") as string || undefined,
        isPublic: formData.get("isPublic") === "on",
      });
      setShowAddDialog(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to create link:", error);
    }
  };

  const platforms = ["shopee", "lazada", "tiktok"];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Modern Header with Gradient */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Link Bookmark
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeTab === "explore" ? "Track your bookmarks" : 
                 activeTab === "collection" ? "Your saved items" : "Your profile"}
              </p>
            </div>
            
            <div className="transform transition-transform hover:scale-105 active:scale-95">
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-300 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Link</DialogTitle>
                    <DialogDescription>
                      Save a product link to track price changes and set reminders.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input id="url" name="url" type="url" required placeholder="https://..." />
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" required placeholder="Product name" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input id="description" name="description" placeholder="Brief description" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" name="price" placeholder="99.99" />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price</Label>
                        <Input id="originalPrice" name="originalPrice" placeholder="149.99" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <select
                        id="platform"
                        name="platform"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white"
                      >
                        <option value="">Select platform</option>
                        <option value="shopee">Shopee</option>
                        <option value="lazada">Lazada</option>
                        <option value="tiktok">TikTok Shop</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isPublic" name="isPublic" />
                      <Label htmlFor="isPublic">Make this link public</Label>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-300">
                      Add Link
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Platform Filter Pills (for Explore tab) */}
      <div className={cn(
        "sticky top-[73px] z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
        activeTab !== "explore" && "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Button
              size="sm"
              variant={!selectedPlatform ? "default" : "outline"}
              onClick={() => setSelectedPlatform(undefined)}
              className={cn(
                "whitespace-nowrap transition-all",
                !selectedPlatform && "bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-300"
              )}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              All
            </Button>
            {platforms.map((platform) => (
              <Button
                key={platform}
                size="sm"
                variant={selectedPlatform === platform ? "default" : "outline"}
                onClick={() => setSelectedPlatform(platform)}
                className={cn(
                  "whitespace-nowrap capitalize transition-all",
                  selectedPlatform === platform && "bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-300"
                )}
              >
                {platform}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with CSS Transitions */}
      <main className="max-w-screen-xl mx-auto px-4 py-6 pb-24">
        <div className="relative">
          {/* Explore Tab */}
          <div className={cn(
            "transition-all duration-300",
            activeTab === "explore" ? "opacity-100 translate-x-0" : "opacity-0 absolute inset-0 -translate-x-4 pointer-events-none"
          )}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {publicLinks?.map((link) => (
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
                    platform={link.platform}
                    bookmarkCount={link.bookmarkCount}
                    isBookmarked={bookmarkedLinks.has(link._id)}
                    onBookmark={() => handleBookmark(link._id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Collection Tab */}
          <div className={cn(
            "transition-all duration-300",
            activeTab === "collection" ? "opacity-100 translate-x-0" : "opacity-0 absolute inset-0 -translate-x-4 pointer-events-none"
          )}>
            <div className="space-y-6">
              {/* Reminders section */}
              {userCollection?.some(item => item.link.reminderDate && item.link.reminderDate > Date.now()) && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 bg-black rounded-full animate-pulse" />
                    Upcoming Reminders
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {userCollection
                      .filter(item => item.link.reminderDate && item.link.reminderDate > Date.now())
                      .map(({ link, isOwner }) => (
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
                            platform={link.platform}
                            reminderDate={link.reminderDate}
                            bookmarkCount={link.bookmarkCount}
                            isBookmarked={true}
                            isOwner={isOwner}
                            onBookmark={() => handleBookmark(link._id)}
                            onSetReminder={() => handleSetReminder(link._id, link.title)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* All bookmarks */}
              <div>
                <h2 className="text-lg font-semibold mb-4">All Bookmarks</h2>
                {userCollection && userCollection.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {userCollection.map(({ link, isOwner }) => (
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
                          platform={link.platform}
                          reminderDate={link.reminderDate}
                          bookmarkCount={link.bookmarkCount}
                          isBookmarked={true}
                          isOwner={isOwner}
                          onBookmark={() => handleBookmark(link._id)}
                          onSetReminder={() => handleSetReminder(link._id, link.title)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No bookmarks yet</p>
                    <Button 
                      onClick={() => setActiveTab("explore")}
                      variant="outline"
                    >
                      Explore Links
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Tab */}
          <div className={cn(
            "transition-all duration-300",
            activeTab === "profile" ? "opacity-100 translate-x-0" : "opacity-0 absolute inset-0 -translate-x-4 pointer-events-none"
          )}>
            <ProfilePage bookmarkCount={userCollection?.length || 0} />
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Reminder Dialog */}
      <ReminderDialog
        open={reminderDialog.open}
        onOpenChange={(open) => setReminderDialog(prev => ({ ...prev, open }))}
        onSave={handleSaveReminder}
        linkTitle={reminderDialog.linkTitle}
      />
    </div>
  );
}
