import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CardsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Cards</h2>
        <p className="text-lg text-muted-foreground">
          Cards group related content and actions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Card</CardTitle>
          <CardDescription>Card with title and description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic Card Example</CardTitle>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with React</CardTitle>
              <CardDescription>A collection of resources for React beginners</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">12 links • Updated 2h ago</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code>{`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      Card description text
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}