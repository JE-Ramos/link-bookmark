import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  links: defineTable({
    // Link information
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    favicon: v.optional(v.string()),
    platform: v.optional(v.string()), // Domain of the website
    
    // Product specific fields
    price: v.optional(v.string()),
    originalPrice: v.optional(v.string()),
    currency: v.optional(v.string()),
    
    // User and visibility
    userId: v.string(), // We'll use clerk or simple auth later
    isPublic: v.boolean(),
    
    // Reminder functionality
    reminderDate: v.optional(v.number()), // timestamp
    reminderNote: v.optional(v.string()),
    
    // Engagement
    bookmarkCount: v.number(),
    viewCount: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic"])
    .index("by_reminder", ["userId", "reminderDate"])
    .index("by_platform", ["platform"]),
  
  bookmarks: defineTable({
    userId: v.string(),
    linkId: v.id("links"),
  })
    .index("by_user", ["userId"])
    .index("by_link", ["linkId"])
    .index("by_user_and_link", ["userId", "linkId"]),
    
  // User information and roles
  users: defineTable({
    // Clerk user ID
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    
    // Admin status
    isAdmin: v.boolean(),
    
    // Stats
    linkCount: v.number(),
    bookmarkCount: v.number(),
    
    // Timestamps
    lastActiveAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_admin", ["isAdmin"]),
    
  // Topics - collections of links with primary/supporting structure
  topics: defineTable({
    // Topic information
    title: v.string(),
    description: v.string(),
    image: v.optional(v.string()), // Cover image for the topic
    
    // Author
    userId: v.string(),
    
    // Tags for categorization
    tags: v.array(v.string()),
    
    // Visibility
    isPublic: v.boolean(),
    
    // Stats
    viewCount: v.number(),
    likeCount: v.number(),
    commentCount: v.number(),
    bookmarkCount: v.number(),
    
    // Trending indicator (can be calculated or manually set)
    isTrending: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic"])
    .index("by_trending", ["isTrending", "isPublic"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["isPublic", "userId"],
    }),
    
  // Topic links - links associated with topics
  topicLinks: defineTable({
    topicId: v.id("topics"),
    linkId: v.id("links"),
    
    // Link type within the topic
    linkType: v.union(v.literal("primary"), v.literal("supporting")),
    
    // Order within its type (0-2 for primary, 0+ for supporting)
    order: v.number(),
    
    // Optional caption/note for this link in this topic context
    caption: v.optional(v.string()),
  })
    .index("by_topic", ["topicId"])
    .index("by_link", ["linkId"])
    .index("by_topic_and_type", ["topicId", "linkType", "order"]),
    
  // Topic engagement
  topicLikes: defineTable({
    userId: v.string(),
    topicId: v.id("topics"),
  })
    .index("by_user", ["userId"])
    .index("by_topic", ["topicId"])
    .index("by_user_and_topic", ["userId", "topicId"]),
    
  topicBookmarks: defineTable({
    userId: v.string(),
    topicId: v.id("topics"),
  })
    .index("by_user", ["userId"])
    .index("by_topic", ["topicId"])
    .index("by_user_and_topic", ["userId", "topicId"]),
});
