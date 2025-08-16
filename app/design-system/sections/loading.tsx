import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LoadingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Loading States</h2>
        <p className="text-lg text-muted-foreground">
          Consistent loading patterns for better user experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spinner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <Loader2 className="h-6 w-6 animate-spin" />
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-4 border rounded">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Fetching link metadata...</span>
          </div>
          
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>

          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>• Use skeleton loaders for initial page loads</li>
            <li>• Inline spinners for actions</li>
            <li>• Progress indicators for multi-step processes</li>
            <li>• Always provide feedback for async operations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}