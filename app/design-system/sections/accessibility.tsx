import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export function AccessibilitySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Accessibility</h2>
        <p className="text-lg text-muted-foreground">
          Making our application usable for everyone.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WCAG 2.1 AA Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Color contrast ratio: 4.5:1 for normal text, 3:1 for large text</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>All interactive elements have visible focus indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Full keyboard navigation support</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Screen reader compatibility with semantic HTML</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Support for reduced motion preferences</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Semantic HTML</h4>
              <p className="text-sm text-muted-foreground">
                Use proper HTML elements (nav, main, button) instead of generic divs
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Alt Text</h4>
              <p className="text-sm text-muted-foreground">
                Provide descriptive alt text for all images
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Form Labels</h4>
              <p className="text-sm text-muted-foreground">
                All form inputs must have associated labels
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">ARIA Labels</h4>
              <p className="text-sm text-muted-foreground">
                Use ARIA labels when visual labels aren't present
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}