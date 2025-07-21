import { Metadata } from "next";
import { AppHeader } from "@/components/shared/app-header";
import { BookmarksCollection } from "./components/bookmarks-collection";

export const metadata: Metadata = {
  title: "Bookmarks | Link Bookmark",
  description: "Your saved product links and deals",
};

export default function BookmarksPage() {
  return (
    <>
      <AppHeader 
        title="My Bookmarks"
        subtitle="Your saved items"
      />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <BookmarksCollection />
      </main>
    </>
  );
} 