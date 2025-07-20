import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const clearAllData = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Get all links
    const allLinks = await ctx.db.query("links").collect();
    
    // Delete all links
    for (const link of allLinks) {
      await ctx.db.delete(link._id);
    }
    
    // Get all bookmarks
    const allBookmarks = await ctx.db.query("bookmarks").collect();
    
    // Delete all bookmarks
    for (const bookmark of allBookmarks) {
      await ctx.db.delete(bookmark._id);
    }
    
    console.log(`Deleted ${allLinks.length} links and ${allBookmarks.length} bookmarks`);
    
    return null;
  },
}); 