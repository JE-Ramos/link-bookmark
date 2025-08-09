"use client";

import { CompactLinkCard } from "./compact-link-card";

const demoLinks = [
  {
    id: "1",
    title: "iPhone 15 Pro Max - Apple",
    description: "The ultimate iPhone with titanium design, advanced camera system, and A17 Pro chip",
    url: "https://apple.com/iphone-15-pro",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=2560&hei=2880&fmt=webp&qlt=70&.v=1692845702654",
  },
  {
    id: "2", 
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Premium noise-canceling headphones with 30-hour battery life and crystal clear sound quality",
    url: "https://sony.com/headphones",
    image: "https://m.media-amazon.com/images/I/51QeS0jkx+L._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: "3",
    title: "MacBook Pro 14-inch M3 Pro",
    description: "Supercharged for pros with M3 Pro chip, up to 18 hours of battery life, and stunning Liquid Retina XDR display",
    url: "https://apple.com/macbook-pro",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
  },
  {
    id: "4",
    title: "Tesla Model 3 Performance",
    description: "All-electric sedan with dual motor all-wheel drive, 3.1s 0-60 mph, and 315 miles of range",
    url: "https://tesla.com/model3",
    image: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg",
  },
  {
    id: "5",
    title: "Nintendo Switch OLED Model",
    description: "Gaming console with 7-inch OLED screen, enhanced audio, and 64GB internal storage",
    url: "https://nintendo.com/switch",
  },
  {
    id: "6",
    title: "AirPods Pro (2nd generation)",
    description: "Active noise cancellation, adaptive transparency, and personalized spatial audio experience",
    url: "https://apple.com/airpods-pro",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1660803972361",
  },
];

export function DemoContent() {
  const handleBookmark = (id: string) => {
    console.log("Bookmarking:", id);
  };

  const handleShare = (id: string) => {
    console.log("Sharing:", id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Compact Link Cards</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Efficient design with image on left, content on right, and compact action buttons
        </p>
      </div>

      <div className="space-y-3">
        {demoLinks.map((link) => (
          <CompactLinkCard
            key={link.id}
            title={link.title}
            description={link.description}
            url={link.url}
            image={link.image}
            isBookmarked={link.id === "2"} // Demo: show second item as bookmarked
            onBookmark={() => handleBookmark(link.id)}
            onShare={() => handleShare(link.id)}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Design Features</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 16x16 image on the left for visual recognition</li>
          <li>• Title and description optimized for mobile screens</li>
          <li>• Compact action buttons with icons and labels</li>
          <li>• Consistent spacing and hover effects</li>
          <li>• Graceful fallback for missing images</li>
        </ul>
      </div>
    </div>
  );
} 