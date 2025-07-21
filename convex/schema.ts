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
});
