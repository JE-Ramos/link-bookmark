import { mutation } from "./_generated/server";

export const clearTopics = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all topics
    const topics = await ctx.db.query("topics").collect();
    
    // Delete all topic-related data
    for (const topic of topics) {
      // Delete topic links
      const topicLinks = await ctx.db
        .query("topicLinks")
        .withIndex("by_topic", (q) => q.eq("topicId", topic._id))
        .collect();
      
      for (const link of topicLinks) {
        await ctx.db.delete(link._id);
      }
      
      // Delete topic likes
      const topicLikes = await ctx.db
        .query("topicLikes")
        .withIndex("by_topic", (q) => q.eq("topicId", topic._id))
        .collect();
      
      for (const like of topicLikes) {
        await ctx.db.delete(like._id);
      }
      
      // Delete topic bookmarks
      const topicBookmarks = await ctx.db
        .query("topicBookmarks")
        .withIndex("by_topic", (q) => q.eq("topicId", topic._id))
        .collect();
      
      for (const bookmark of topicBookmarks) {
        await ctx.db.delete(bookmark._id);
      }
      
      // Delete the topic itself
      await ctx.db.delete(topic._id);
    }
    
    return { success: true, message: `Cleared ${topics.length} topics` };
  },
});