import { Metadata } from "next";
import { ExploreFeed } from "./components/explore-feed";
import { AppHeader } from "@/components/shared/app-header";

export const metadata: Metadata = {
  title: "Explore | Link Bookmark",
  description: "Discover and save product links from popular e-commerce platforms",
};

export default function ExplorePage() {
  return (
    <>
      <AppHeader 
        title="Link Bookmark"
        subtitle="Discover amazing deals"
      />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <ExploreFeed />
      </main>
    </>
  );
} 