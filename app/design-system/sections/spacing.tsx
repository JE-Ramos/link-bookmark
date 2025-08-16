import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SpacingSection() {
  const spacings = [
    { size: "8px", class: "w-8 h-8" },
    { size: "16px", class: "w-8 h-16" },
    { size: "24px", class: "w-8 h-24" },
    { size: "32px", class: "w-8 h-32" },
    { size: "48px", class: "w-8 h-48" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Spacing & Layout</h2>
        <p className="text-lg text-muted-foreground">
          Consistent spacing creates visual rhythm and hierarchy.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base Unit System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Base unit: 4px</p>
          <p className="mb-6">Common spacings: 8px, 16px, 24px, 32px, 48px, 64px</p>
          
          <div className="flex gap-2 items-end">
            {spacings.map((spacing) => (
              <div key={spacing.size} className="text-center">
                <div className={cn("bg-primary rounded", spacing.class)} />
                <p className="text-xs mt-2">{spacing.size}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Container Widths</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Content: max-w-screen-xl (1280px)</li>
                <li>• Forms: max-w-md (448px)</li>
                <li>• Modals: max-w-lg (512px)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Responsive Grid</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Mobile: 1 column</li>
                <li>• Tablet: 2 columns</li>
                <li>• Desktop: 3-4 columns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}