import { Metadata } from "next";
import { DemoContent } from "./components/demo-content";

export const metadata: Metadata = {
  title: "Link Preview Demo",
  description: "Showcase of immersive link previews for different content types",
};

export default function DemoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Link Preview Demo</h1>
          <p className="text-xl text-muted-foreground">
            Experience immersive previews for different types of content
          </p>
        </div>
        
        <DemoContent />
      </div>
    </div>
  );
} 