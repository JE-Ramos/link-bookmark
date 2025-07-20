import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { requireAdmin } from "./auth";

// Admin Analytics
export const getAnalytics = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    totalLinks: v.number(),
    totalBookmarks: v.number(),
    publicLinks: v.number(),
    platformBreakdown: v.record(v.string(), v.number()),
    recentUsers: v.array(v.object({
      _id: v.id("users"),
      email: v.string(),
      name: v.optional(v.string()),
      linkCount: v.number(),
      lastActiveAt: v.optional(v.number()),
    })),
    topLinks: v.array(v.object({
      _id: v.id("links"),
      title: v.string(),
      bookmarkCount: v.number(),
      viewCount: v.number(),
      platform: v.optional(v.string()),
    })),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx, ctx.auth);

    // Get counts
    const users = await ctx.db.query("users").collect();
    const links = await ctx.db.query("links").collect();
    const bookmarks = await ctx.db.query("bookmarks").collect();
    const publicLinks = links.filter(link => link.isPublic);

    // Platform breakdown
    const platformBreakdown: Record<string, number> = {};
    for (const link of links) {
      const platform = link.platform || "other";
      platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
    }

    // Recent active users
    const recentUsers = users
      .sort((a, b) => (b.lastActiveAt || 0) - (a.lastActiveAt || 0))
      .slice(0, 10)
      .map(user => ({
        _id: user._id,
        email: user.email,
        name: user.name,
        linkCount: user.linkCount,
        lastActiveAt: user.lastActiveAt,
      }));

    // Top bookmarked links
    const topLinks = links
      .sort((a, b) => b.bookmarkCount - a.bookmarkCount)
      .slice(0, 10)
      .map(link => ({
        _id: link._id,
        title: link.title,
        bookmarkCount: link.bookmarkCount,
        viewCount: link.viewCount,
        platform: link.platform,
      }));

    return {
      totalUsers: users.length,
      totalLinks: links.length,
      totalBookmarks: bookmarks.length,
      publicLinks: publicLinks.length,
      platformBreakdown,
      recentUsers,
      topLinks,
    };
  },
});

// User Management
export const getAllUsers = query({
  args: {
    searchTerm: v.optional(v.string()),
    onlyAdmins: v.optional(v.boolean()),
  },
  returns: v.array(v.object({
    _id: v.id("users"),
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isAdmin: v.boolean(),
    linkCount: v.number(),
    bookmarkCount: v.number(),
    lastActiveAt: v.optional(v.number()),
    _creationTime: v.number(),
  })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ctx.auth);

    const users = await (args.onlyAdmins
      ? ctx.db.query("users").withIndex("by_admin", (q) => q.eq("isAdmin", true))
      : ctx.db.query("users")
    ).collect();

    // Filter by search term if provided
    let filteredUsers = users;
    if (args.searchTerm) {
      const search = args.searchTerm.toLowerCase();
      filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(search) ||
        user.name?.toLowerCase().includes(search)
      );
    }

    return filteredUsers.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const toggleUserAdmin = mutation({
  args: {
    userId: v.id("users"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ctx.auth);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newAdminStatus = !user.isAdmin;
    await ctx.db.patch(args.userId, {
      isAdmin: newAdminStatus,
    });

    return newAdminStatus;
  },
});

// Link Management
export const getAllLinks = query({
  args: {
    searchTerm: v.optional(v.string()),
    platform: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    onlyPublic: v.optional(v.boolean()),
  },
  returns: v.array(v.object({
    _id: v.id("links"),
    _creationTime: v.number(),
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    platform: v.optional(v.string()),
    price: v.optional(v.string()),
    originalPrice: v.optional(v.string()),
    userId: v.string(),
    isPublic: v.boolean(),
    bookmarkCount: v.number(),
    viewCount: v.number(),
    user: v.optional(v.object({
      email: v.string(),
      name: v.optional(v.string()),
    })),
  })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ctx.auth);

    const links = await (args.platform
      ? ctx.db.query("links").withIndex("by_platform", (q) => q.eq("platform", args.platform))
      : ctx.db.query("links")
    ).collect();

    // Filter further
    let filteredLinks = links;
    
    if (args.userId) {
      filteredLinks = filteredLinks.filter(link => link.userId === args.userId);
    }
    
    if (args.onlyPublic !== undefined) {
      filteredLinks = filteredLinks.filter(link => link.isPublic === args.onlyPublic);
    }
    
    if (args.searchTerm) {
      const search = args.searchTerm.toLowerCase();
      filteredLinks = filteredLinks.filter(link => 
        link.title.toLowerCase().includes(search) ||
        link.description?.toLowerCase().includes(search) ||
        link.url.toLowerCase().includes(search)
      );
    }

    // Attach user info
    const linksWithUser = await Promise.all(
      filteredLinks.map(async (link) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", link.userId))
          .unique();
        
        return {
          ...link,
          user: user ? {
            email: user.email,
            name: user.name,
          } : undefined,
        };
      })
    );

    return linksWithUser.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const deleteLink = mutation({
  args: {
    linkId: v.id("links"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ctx.auth);

    // Delete all bookmarks for this link
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_link", (q) => q.eq("linkId", args.linkId))
      .collect();

    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    // Delete the link
    await ctx.db.delete(args.linkId);

    return null;
  },
});

export const toggleLinkVisibility = mutation({
  args: {
    linkId: v.id("links"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ctx.auth);

    const link = await ctx.db.get(args.linkId);
    if (!link) {
      throw new Error("Link not found");
    }

    const newVisibility = !link.isPublic;
    await ctx.db.patch(args.linkId, {
      isPublic: newVisibility,
    });

    return newVisibility;
  },
});

// Bulk Operations
export const bulkDeleteLinks = mutation({
  args: {
    linkIds: v.array(v.id("links")),
  },
  returns: v.object({
    deletedCount: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ctx.auth);

    let deletedCount = 0;

    for (const linkId of args.linkIds) {
      // Delete all bookmarks for this link
      const bookmarks = await ctx.db
        .query("bookmarks")
        .withIndex("by_link", (q) => q.eq("linkId", linkId))
        .collect();

      for (const bookmark of bookmarks) {
        await ctx.db.delete(bookmark._id);
      }

      // Delete the link
      const link = await ctx.db.get(linkId);
      if (link) {
        await ctx.db.delete(linkId);
        deletedCount++;
      }
    }

    return { deletedCount };
  },
});

// Make a user admin (internal function for setup)
export const makeUserAdmin = internalMutation({
  args: {
    email: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }

    await ctx.db.patch(user._id, {
      isAdmin: true,
    });

    console.log(`Made user ${args.email} an admin`);
    return null;
  },
}); 