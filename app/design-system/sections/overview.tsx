import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Component, Layers, ExternalLink, Layout } from "lucide-react";

export function OverviewSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          The Link Bookmark Design System provides the foundation for building our MVP - 
          a web application for creating and managing topics by aggregating relevant links.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl">MVP Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Component className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  User login/logout via Clerk
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Topic Management</h4>
                <p className="text-sm text-muted-foreground">
                  Create, view, edit, delete topics
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Link Management</h4>
                <p className="text-sm text-muted-foreground">
                  Add links, metadata extraction, rich previews
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Layout className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Basic UI/UX</h4>
                <p className="text-sm text-muted-foreground">
                  Clean, responsive design
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Installation</h4>
            <pre className="bg-muted/50 border border-border p-4 rounded-lg text-sm overflow-x-auto">
              <code className="text-primary">pnpm install</code>
            </pre>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Development</h4>
            <pre className="bg-muted/50 border border-border p-4 rounded-lg text-sm overflow-x-auto">
              <code className="text-primary">pnpm dev</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}