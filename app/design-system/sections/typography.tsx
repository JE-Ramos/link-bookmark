export function TypographySection() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Typography</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Clean, readable typography that scales across devices.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Heading 1 - 36px/Bold</h1>
          <p className="text-sm text-muted-foreground">Page titles</p>
        </div>
        
        <div>
          <h2 className="text-3xl font-semibold">Heading 2 - 30px/Semibold</h2>
          <p className="text-sm text-muted-foreground">Section headers</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-medium">Heading 3 - 24px/Medium</h3>
          <p className="text-sm text-muted-foreground">Subsections</p>
        </div>
        
        <div>
          <p className="text-base">Body - 16px/Regular</p>
          <p className="text-sm text-muted-foreground">Default text</p>
        </div>
        
        <div>
          <p className="text-sm">Small - 14px/Regular</p>
          <p className="text-sm text-muted-foreground">Secondary info, captions</p>
        </div>
      </div>
    </div>
  );
}