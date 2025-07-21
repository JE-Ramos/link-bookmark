import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Bookmark - Save & Track Product Deals",
  description: "Save and track product links from your favorite e-commerce platforms. Get price alerts and never miss a deal.",
  keywords: "bookmark, deals, price tracking, save links",
  authors: [{ name: "Link Bookmark Team" }],
  icons: {
    icon: "/convex.svg",
    apple: "/convex.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Link Bookmark - Save & Track Product Deals",
    description: "Save and track product links from your favorite e-commerce platforms.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-white dark:bg-black">
        <ClerkProvider dynamic>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
