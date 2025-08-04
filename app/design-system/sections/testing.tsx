import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function TestingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Testing</h2>
        <p className="text-lg text-muted-foreground">
          Ensuring quality through comprehensive testing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Testing Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox id="test1" />
              <label htmlFor="test1" className="text-sm">
                Can users create a topic in less than 30 seconds?
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="test2" />
              <label htmlFor="test2" className="text-sm">
                Is link metadata loaded within 2 seconds?
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="test3" />
              <label htmlFor="test3" className="text-sm">
                Are error messages clear and actionable?
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="test4" />
              <label htmlFor="test4" className="text-sm">
                Does the UI work on mobile devices?
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="test5" />
              <label htmlFor="test5" className="text-sm">
                Can keyboard users access all features?
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Component Testing</h4>
              <p className="text-sm text-muted-foreground">
                Visual regression tests for UI components
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Accessibility Testing</h4>
              <p className="text-sm text-muted-foreground">
                Automated tests with axe-core
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Interaction Testing</h4>
              <p className="text-sm text-muted-foreground">
                User flow tests with Playwright
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Responsive Testing</h4>
              <p className="text-sm text-muted-foreground">
                Cross-device and breakpoint testing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>MVP Success Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>✓ Users can create an account and log in</li>
            <li>✓ Users can create topics and add links</li>
            <li>✓ Links show rich previews automatically</li>
            <li>✓ Data persists and updates in real-time</li>
            <li>✓ Works on mobile and desktop</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}