import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrinciplesSection() {
  const principles = [
    {
      icon: "🎯",
      title: "Clarity First",
      description: "Every interface element should have a clear purpose. No decorative complexity.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      icon: "⚡",
      title: "Performance Matters",
      description: "Fast link metadata extraction and real-time updates are core to user satisfaction.",
      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: "📱",
      title: "Mobile-First",
      description: "Design for mobile screens first, then enhance for larger displays.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
    },
    {
      icon: "🔄",
      title: "Progressive Disclosure",
      description: "Show essential features upfront, reveal advanced options as needed.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Design Principles</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Our design philosophy centers on creating an intuitive link aggregation experience 
          that scales from MVP to full product.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {principles.map((principle) => (
          <Card key={principle.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-4">
                <span className={`text-3xl w-14 h-14 rounded-lg flex items-center justify-center ${principle.color}`}>
                  {principle.icon}
                </span>
                <span className="text-lg">{principle.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}