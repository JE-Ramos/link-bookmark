import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOrCreateUser, getAuthUserId } from "./auth";

// Create a new link
export const createLink = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    favicon: v.optional(v.string()),
    platform: v.optional(v.string()),
    price: v.optional(v.string()),
    originalPrice: v.optional(v.string()),
    currency: v.optional(v.string()),
    isPublic: v.boolean(),
    reminderDate: v.optional(v.number()),
    reminderNote: v.optional(v.string()),
  },
  returns: v.id("links"),
  handler: async (ctx, args) => {
    const userId = await getOrCreateUser(ctx, ctx.auth);
    if (!userId) {
      throw new Error("Unauthorized: Must be logged in to create links");
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const linkId = await ctx.db.insert("links", {
      ...args,
      userId: user.clerkId,
      bookmarkCount: 0,
      viewCount: 0,
    });
    
    // Auto-bookmark own links
    await ctx.db.insert("bookmarks", {
      userId: user.clerkId,
      linkId,
    });
    
    // Update user's link count
    await ctx.db.patch(userId, {
      linkCount: user.linkCount + 1,
      bookmarkCount: user.bookmarkCount + 1,
    });
    
    return linkId;
  },
});

// Get user's collection (bookmarked links)
export const getUserCollection = query({
  args: {
    userId: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      link: v.object({
        _id: v.id("links"),
        _creationTime: v.number(),
        url: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        image: v.optional(v.string()),
        favicon: v.optional(v.string()),
        platform: v.optional(v.string()),
        price: v.optional(v.string()),
        originalPrice: v.optional(v.string()),
        currency: v.optional(v.string()),
        userId: v.string(),
        isPublic: v.boolean(),
        reminderDate: v.optional(v.number()),
        reminderNote: v.optional(v.string()),
        bookmarkCount: v.number(),
        viewCount: v.number(),
      }),
      isOwner: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    // Get authenticated user
    const authUserId = await getAuthUserId({ auth: ctx.auth });
    if (!authUserId) {
      // Return empty array if not authenticated
      return [];
    }
    
    const userId = args.userId || authUserId;
    
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const links = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const link = await ctx.db.get(bookmark.linkId);
        if (!link) return null;
        return {
          link,
          isOwner: link.userId === userId,
        };
      })
    );
    
    return links.filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.link._creationTime - a.link._creationTime);
  },
});

// Get public links for explore page
export const getPublicLinks = query({
  args: {
    platform: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("links"),
      _creationTime: v.number(),
      url: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
      favicon: v.optional(v.string()),
      platform: v.optional(v.string()),
      price: v.optional(v.string()),
      originalPrice: v.optional(v.string()),
      currency: v.optional(v.string()),
      userId: v.string(),
      isPublic: v.boolean(),
      reminderDate: v.optional(v.number()),
      reminderNote: v.optional(v.string()),
      bookmarkCount: v.number(),
      viewCount: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("links")
      .withIndex("by_public", (q) => q.eq("isPublic", true));
    
    if (args.platform) {
      query = ctx.db
        .query("links")
        .withIndex("by_platform", (q) => q.eq("platform", args.platform));
    }
    
    const links = await query
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .take(50);
    
    return links;
  },
});

// Toggle bookmark
export const toggleBookmark = mutation({
  args: {
    linkId: v.id("links"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId({ auth: ctx.auth });
    if (!authUserId) {
      throw new Error("Unauthorized: Must be logged in to bookmark");
    }
    
    // Check if already bookmarked
    const existingBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_link", (q) => 
        q.eq("userId", authUserId).eq("linkId", args.linkId)
      )
      .unique();
    
    if (existingBookmark) {
      // Remove bookmark
      await ctx.db.delete(existingBookmark._id);
      
      // Decrement bookmark count
      const link = await ctx.db.get(args.linkId);
      if (link) {
        await ctx.db.patch(args.linkId, {
          bookmarkCount: Math.max(0, link.bookmarkCount - 1),
        });
      }
      
      return false;
    } else {
      // Add bookmark
      await ctx.db.insert("bookmarks", {
        userId: authUserId,
        linkId: args.linkId,
      });
      
      // Increment bookmark count
      const link = await ctx.db.get(args.linkId);
      if (link) {
        await ctx.db.patch(args.linkId, {
          bookmarkCount: link.bookmarkCount + 1,
        });
      }
      
      return true;
    }
  },
});

// Check if link is bookmarked by user
export const isBookmarked = query({
  args: {
    linkId: v.id("links"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId({ auth: ctx.auth });
    if (!authUserId) {
      return false;
    }
    
    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_link", (q) => 
        q.eq("userId", authUserId).eq("linkId", args.linkId)
      )
      .unique();
    
    return bookmark !== null;
  },
});

// Update reminder
export const updateReminder = mutation({
  args: {
    linkId: v.id("links"),
    reminderDate: v.optional(v.number()),
    reminderNote: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId({ auth: ctx.auth });
    if (!authUserId) {
      throw new Error("Unauthorized: Must be logged in to update reminder");
    }
    
    const link = await ctx.db.get(args.linkId);
    if (!link) throw new Error("Link not found");
    
    // Only owner can update reminder
    if (link.userId !== authUserId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(args.linkId, {
      reminderDate: args.reminderDate,
      reminderNote: args.reminderNote,
    });
    
    return null;
  },
});

// Get links with upcoming reminders
export const getUpcomingReminders = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("links"),
      _creationTime: v.number(),
      url: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
      favicon: v.optional(v.string()),
      platform: v.optional(v.string()),
      price: v.optional(v.string()),
      originalPrice: v.optional(v.string()),
      currency: v.optional(v.string()),
      userId: v.string(),
      isPublic: v.boolean(),
      reminderDate: v.optional(v.number()),
      reminderNote: v.optional(v.string()),
      bookmarkCount: v.number(),
      viewCount: v.number(),
    })
  ),
  handler: async (ctx) => {
    const authUserId = await getAuthUserId({ auth: ctx.auth });
    if (!authUserId) {
      return [];
    }
    
    const now = Date.now();
    const weekFromNow = now + (7 * 24 * 60 * 60 * 1000);
    
    const links = await ctx.db
      .query("links")
      .withIndex("by_reminder", (q) => 
        q.eq("userId", authUserId).gte("reminderDate", now).lte("reminderDate", weekFromNow)
      )
      .collect();
    
    return links.filter(link => link.reminderDate !== undefined);
  },
}); 