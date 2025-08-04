import { cn } from "@/lib/utils";

export function ColorsSection() {
  const colors = [
    { name: "Primary", class: "bg-primary", usage: "Actions, links, focus states" },
    { name: "Secondary", class: "bg-secondary", usage: "Secondary actions" },
    { name: "Accent", class: "bg-accent", usage: "Highlights, hover states" },
    { name: "Destructive", class: "bg-destructive", usage: "Delete actions, errors" },
    { name: "Background", class: "bg-background border-2 border-border", usage: "Base background" },
    { name: "Card", class: "bg-card border-2 border-border", usage: "Component backgrounds" },
    { name: "Muted", class: "bg-muted", usage: "Subdued elements" },
    { name: "Border", class: "bg-muted border-2 border-border", usage: "Dividers, borders" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Colors</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Our color system is built on semantic tokens that adapt to light and dark themes automatically.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {colors.map((color) => (
          <div key={color.name} className="group">
            <div className={cn("h-32 rounded-lg shadow-sm transition-transform group-hover:scale-105", color.class)} />
            <div className="mt-4 space-y-1">
              <p className="font-semibold">{color.name}</p>
              <p className="text-sm text-muted-foreground">{color.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}