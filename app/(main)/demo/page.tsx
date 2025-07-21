import { Metadata } from "next";
import { ShowcaseCard } from "@/components/cards/showcase-card";
import { ModernLinkCard } from "@/components/cards/modern-link-card";
import { ScrollReveal, Parallax, ScrollProgress, ScrollCountUp, ScrollScale } from "@/components/shared/scroll-animations";
import { ViewTransitionLink } from "@/components/shared/view-transitions";

export const metadata: Metadata = {
  title: "App-Like Navigation Demo",
  description: "Experience smooth transitions and scroll-driven animations",
};

export default function DemoPage() {
  const stats = [
    { label: "Links Saved", value: 1234 },
    { label: "Active Users", value: 567 },
    { label: "Countries", value: 89 },
  ];

  const demoLinks = [
    {
      title: "View Transitions API",
      description: "Smooth page transitions like native apps",
      url: "https://developer.chrome.com/docs/web-platform/view-transitions/",
      tags: ["Web API", "Animation", "UX"],
      isNew: true,
    },
    {
      title: "Scroll-driven Animations",
      description: "Create engaging scroll-based effects without JavaScript",
      url: "https://developer.chrome.com/articles/scroll-driven-animations/",
      tags: ["CSS", "Performance", "Animation"],
      emoji: "🎭",
    },
    {
      title: "Web Animations API",
      description: "Powerful animation capabilities for the modern web",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API",
      tags: ["JavaScript", "API", "Motion"],
      emoji: "✨",
    },
  ];

  return (
    <>
      <ScrollProgress />
      
      <div className="min-h-screen">
        {/* Hero Section with Parallax */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <Parallax speed={0.3} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
          </Parallax>
          
          <div className="relative z-10 text-center px-4">
            <ScrollReveal animation="fade-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                App-Like Navigation
              </h1>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience smooth transitions and scroll-driven animations that make the web feel native
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="scale" delay={400}>
              <ViewTransitionLink 
                href="#features" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Features
                <span className="animate-bounce">↓</span>
              </ViewTransitionLink>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <ScrollReveal animation="fade-in">
              <h2 className="text-3xl font-bold text-center mb-12">Platform Statistics</h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <ScrollReveal key={stat.label} animation="fade-up" delay={index * 100}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      <ScrollCountUp end={stat.value} suffix="+" />
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid with Scroll Scale */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal animation="fade-in">
              <h2 className="text-3xl font-bold text-center mb-12">Featured Technologies</h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {demoLinks.map((link, index) => (
                <ScrollScale key={link.title} minScale={0.9} maxScale={1.05}>
                  <ScrollReveal animation="slide-left" delay={index * 150}>
                    <ShowcaseCard {...link} />
                  </ScrollReveal>
                </ScrollScale>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax Section */}
        <section className="relative py-40 overflow-hidden">
          <Parallax speed={0.5} className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-r from-primary/10 to-secondary/10 animate-gradient" />
          </Parallax>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <ScrollReveal animation="scale">
              <h2 className="text-4xl font-bold mb-6">Seamless Experiences</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Modern web capabilities allow us to create experiences that rival native applications
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Modern Cards Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal animation="fade-in">
              <h2 className="text-3xl font-bold text-center mb-12">Interactive Cards</h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "GitHub Repository",
                  description: "The most popular web framework",
                  url: "https://github.com/vercel/next.js",
                  image: "https://repository-images.githubusercontent.com/70107786/6c5b7a00-5c7e-11eb-8f3e-1a4a7f9b9b7a",
                  tags: ["React", "Framework", "TypeScript"],
                  bookmarkCount: 42,
                  isNew: true,
                },
                {
                  title: "Web.dev Resources",
                  description: "Learn modern web development",
                  url: "https://web.dev",
                  tags: ["Learning", "Google", "Performance"],
                  bookmarkCount: 28,
                  price: "Free",
                },
                {
                  title: "Chrome DevTools",
                  description: "Debug and optimize your web apps",
                  url: "https://developer.chrome.com/docs/devtools/",
                  tags: ["Tools", "Debugging", "Chrome"],
                  bookmarkCount: 35,
                },
              ].map((card, index) => (
                <ScrollReveal key={card.title} animation="fade-up" delay={index * 100}>
                  <ModernLinkCard {...card} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal animation="scale">
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Transform your web experience with modern navigation patterns
              </p>
              <ViewTransitionLink
                href="/bookmarks"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all transform hover:scale-105"
              >
                Start Bookmarking
                <span className="animate-pulse">→</span>
              </ViewTransitionLink>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  );
} 