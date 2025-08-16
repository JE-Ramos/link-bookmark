import { Metadata } from "next";
import { TopicFeed } from "./components/topic-feed";
import { AppHeader } from "@/components/shared/app-header";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: `Explore Topics | ${BRAND_NAME}`,
  description: "Discover curated topics with the best links and resources",
};

export default function ExplorePage() {
  return (
    <>
      <AppHeader 
        title="Explore Topics"
        subtitle="Discover curated collections"
      />
      <main className="container mx-auto px-4 py-6 pb-20">
        <TopicFeed />
      </main>
    </>
  );
} 