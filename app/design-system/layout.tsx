import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System | Link Bookmark",
  description: "Component guidelines and design principles for Link Bookmark",
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}