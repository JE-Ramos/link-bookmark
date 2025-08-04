import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";

export function LinksSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Link Components</h2>
        <p className="text-lg text-muted-foreground">
          Components for displaying and managing links - the core of our MVP.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Card</CardTitle>
          <CardDescription>Rich preview layout for links</CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="p-3">
            <div className="flex gap-3 mb-3">
              <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1">Link Title</h3>
                <span className="text-xs text-muted-foreground line-clamp-2 mt-1 block">
                  Description of the linked content goes here...
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <ExternalLink className="w-3 h-3 mr-1" />
                Open
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm">Broken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm">Checking</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata Display</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>• <strong>Title:</strong> From OG tags or page title</li>
            <li>• <strong>Description:</strong> From meta description</li>
            <li>• <strong>Preview image:</strong> 64x64px, object-cover</li>
            <li>• <strong>Favicon:</strong> 16x16px</li>
            <li>• <strong>Status indicator:</strong> Active/broken</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Link Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm space-y-2">
            <li>1. User clicks "Add Link" button</li>
            <li>2. Modal opens with URL input field</li>
            <li>3. User pastes URL and clicks "Add"</li>
            <li>4. Loading state while fetching metadata</li>
            <li>5. Preview shows fetched data</li>
            <li>6. User confirms or cancels</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}