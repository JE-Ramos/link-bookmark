import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: `Design System | ${BRAND_NAME}`,
  description: `Component guidelines and design principles for ${BRAND_NAME}`,
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}