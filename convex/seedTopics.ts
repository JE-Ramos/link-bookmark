import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedTopics = mutation({
  args: {},
  handler: async (ctx) => {
    // Get a demo user
    const demoUser = await ctx.db
      .query("users")
      .first();
    
    if (!demoUser) {
      throw new Error("No users found. Please create a user first.");
    }

    // Get some existing links
    const links = await ctx.db
      .query("links")
      .take(20);
    
    if (links.length < 10) {
      throw new Error("Not enough links found. Please create at least 10 links first.");
    }

    // Create sample topics
    const topics = [
      {
        title: "Best PopMart Plushies 2024",
        description: "A curated collection of the most adorable and sought-after PopMart plush toys this year",
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop",
        tags: ["popmart", "plushies", "collectibles", "toys"],
        primaryLinks: links.slice(0, 3),
        supportingLinks: links.slice(3, 6),
        isTrending: true,
      },
      {
        title: "Ultimate Tech Gadgets Under $100",
        description: "Affordable tech accessories and gadgets that won't break the bank",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=800&fit=crop",
        tags: ["tech", "gadgets", "budget", "accessories"],
        primaryLinks: links.slice(6, 9),
        supportingLinks: links.slice(9, 12),
        isTrending: false,
      },
      {
        title: "Minimalist Home Decor Essentials",
        description: "Transform your space with these simple yet elegant home decor pieces",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop",
        tags: ["home", "decor", "minimalist", "design"],
        primaryLinks: links.slice(12, 14),
        supportingLinks: links.slice(14, 18),
        isTrending: true,
      },
    ];

    // Create topics
    for (const topicData of topics) {
      const topicId = await ctx.db.insert("topics", {
        title: topicData.title,
        description: topicData.description,
        image: topicData.image,
        userId: demoUser.clerkId,
        tags: topicData.tags,
        isPublic: true,
        viewCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
        bookmarkCount: Math.floor(Math.random() * 200),
        isTrending: topicData.isTrending,
      });

      // Add primary links
      for (let i = 0; i < topicData.primaryLinks.length; i++) {
        await ctx.db.insert("topicLinks", {
          topicId,
          linkId: topicData.primaryLinks[i]._id,
          linkType: "primary",
          order: i,
          caption: i === 0 ? "Top recommendation" : undefined,
        });
      }

      // Add supporting links
      for (let i = 0; i < topicData.supportingLinks.length; i++) {
        await ctx.db.insert("topicLinks", {
          topicId,
          linkId: topicData.supportingLinks[i]._id,
          linkType: "supporting",
          order: i,
        });
      }
    }

    return { success: true, message: "Seeded 3 topics successfully" };
  },
});