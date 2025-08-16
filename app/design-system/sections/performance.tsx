import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export function PerformanceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Performance</h2>
        <p className="text-lg text-muted-foreground">
          Optimization strategies for fast, responsive applications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Lazy load images with Next.js Image component</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Virtualize long lists of links</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Debounce search inputs (300ms delay)</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Cache link metadata for 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Prefetch on hover for instant navigation</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bundle Size</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Use dynamic imports for heavy components</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Tree-shake unused shadcn components</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
              <span>Monitor with next-bundle-analyzer</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium">First Contentful Paint</h4>
              <p className="text-sm text-muted-foreground">Target: &lt; 1.8s</p>
            </div>
            <div>
              <h4 className="font-medium">Time to Interactive</h4>
              <p className="text-sm text-muted-foreground">Target: &lt; 3.8s</p>
            </div>
            <div>
              <h4 className="font-medium">Link Metadata Fetch</h4>
              <p className="text-sm text-muted-foreground">Target: &lt; 2s</p>
            </div>
            <div>
              <h4 className="font-medium">Topic Creation</h4>
              <p className="text-sm text-muted-foreground">Target: &lt; 30s</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}