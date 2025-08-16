import { Metadata } from "next";
import { TopicDetail } from "./components/topic-detail";
import { AppHeader } from "@/components/shared/app-header";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: `Topic Details | ${BRAND_NAME}`,
  description: "Explore curated links and resources for this topic",
};

export default function TopicDetailPage({
  params,
}: {
  params: { topicId: string };
}) {
  return (
    <>
      <AppHeader title="Topic Details" />
      <main className="container mx-auto px-4 py-6 pb-20">
        <TopicDetail topicId={params.topicId} />
      </main>
    </>
  );
}