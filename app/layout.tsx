import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_DESCRIPTION_SHORT } from "@/lib/constants/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
  description: BRAND_DESCRIPTION_SHORT,
  keywords: "bookmark, deals, price tracking, save links",
  authors: [{ name: `${BRAND_NAME} Team` }],
  icons: {
    icon: "/convex.svg",
    apple: "/convex.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    description: BRAND_DESCRIPTION_SHORT,
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
