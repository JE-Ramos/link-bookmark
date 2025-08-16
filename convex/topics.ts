import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Get public topics for the feed
export const getPublicTopics = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("topics"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      image: v.optional(v.string()),
      userId: v.string(),
      tags: v.array(v.string()),
      isPublic: v.boolean(),
      viewCount: v.number(),
      likeCount: v.number(),
      commentCount: v.number(),
      bookmarkCount: v.number(),
      isTrending: v.boolean(),
      author: v.object({
        name: v.optional(v.string()),
        email: v.string(),
        imageUrl: v.optional(v.string()),
      }),
      primaryLinks: v.array(
        v.object({
          _id: v.id("links"),
          url: v.string(),
          title: v.string(),
          description: v.optional(v.string()),
          image: v.optional(v.string()),
          favicon: v.optional(v.string()),
          platform: v.optional(v.string()),
          order: v.number(),
        })
      ),
      supportingLinkCount: v.number(),
      isLiked: v.boolean(),
      isBookmarked: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    
    // Get public topics
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(limit);
    
    // Fetch all data in parallel
    const topicsWithData = await Promise.all(
      topics.map(async (topic) => {
        // Get author info
        const author = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", topic.userId))
          .unique();
        
        // Get primary links
        const topicLinks = await ctx.db
          .query("topicLinks")
          .withIndex("by_topic_and_type", (q) => 
            q.eq("topicId", topic._id).eq("linkType", "primary")
          )
          .order("asc")
          .take(3);
        
        const primaryLinks = await Promise.all(
          topicLinks.map(async (tl) => {
            const link = await ctx.db.get(tl.linkId);
            if (!link) return null;
            return {
              _id: link._id,
              url: link.url,
              title: link.title,
              description: link.description,
              image: link.image,
              favicon: link.favicon,
              platform: link.platform,
              order: tl.order,
            };
          })
        );
        
        // Get supporting link count
        const supportingLinks = await ctx.db
          .query("topicLinks")
          .withIndex("by_topic_and_type", (q) => 
            q.eq("topicId", topic._id).eq("linkType", "supporting")
          )
          .collect();
        
        // Check if user has liked/bookmarked
        let isLiked = false;
        let isBookmarked = false;
        
        if (userId) {
          const like = await ctx.db
            .query("topicLikes")
            .withIndex("by_user_and_topic", (q) => 
              q.eq("userId", userId).eq("topicId", topic._id)
            )
            .unique();
          isLiked = !!like;
          
          const bookmark = await ctx.db
            .query("topicBookmarks")
            .withIndex("by_user_and_topic", (q) => 
              q.eq("userId", userId).eq("topicId", topic._id)
            )
            .unique();
          isBookmarked = !!bookmark;
        }
        
        return {
          ...topic,
          author: {
            name: author?.name,
            email: author?.email || "Unknown",
            imageUrl: author?.imageUrl,
          },
          primaryLinks: primaryLinks.filter((l): l is NonNullable<typeof l> => l !== null),
          supportingLinkCount: supportingLinks.length,
          isLiked,
          isBookmarked,
        };
      })
    );
    
    return topicsWithData;
  },
});

// Get a single topic with all its links
export const getTopic = query({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) return null;
    
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    
    // Get author
    const author = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", topic.userId))
      .unique();
    
    // Get all topic links
    const topicLinks = await ctx.db
      .query("topicLinks")
      .withIndex("by_topic", (q) => q.eq("topicId", topic._id))
      .order("asc")
      .collect();
    
    // Separate primary and supporting links
    const primaryLinks = [];
    const supportingLinks = [];
    
    for (const tl of topicLinks) {
      const link = await ctx.db.get(tl.linkId);
      if (!link) continue;
      
      const linkData = {
        _id: link._id,
        url: link.url,
        title: link.title,
        description: link.description,
        image: link.image,
        favicon: link.favicon,
        platform: link.platform,
        price: link.price,
        originalPrice: link.originalPrice,
        currency: link.currency,
        order: tl.order,
        caption: tl.caption,
      };
      
      if (tl.linkType === "primary") {
        primaryLinks.push(linkData);
      } else {
        supportingLinks.push(linkData);
      }
    }
    
    // Sort by order
    primaryLinks.sort((a, b) => a.order - b.order);
    supportingLinks.sort((a, b) => a.order - b.order);
    
    // Check user engagement
    let isLiked = false;
    let isBookmarked = false;
    
    if (userId) {
      const like = await ctx.db
        .query("topicLikes")
        .withIndex("by_user_and_topic", (q) => 
          q.eq("userId", userId).eq("topicId", topic._id)
        )
        .unique();
      isLiked = !!like;
      
      const bookmark = await ctx.db
        .query("topicBookmarks")
        .withIndex("by_user_and_topic", (q) => 
          q.eq("userId", userId).eq("topicId", topic._id)
        )
        .unique();
      isBookmarked = !!bookmark;
    }
    
    return {
      ...topic,
      author: {
        name: author?.name,
        email: author?.email || "Unknown",
        imageUrl: author?.imageUrl,
      },
      primaryLinks,
      supportingLinks,
      isLiked,
      isBookmarked,
    };
  },
});

// Create a new topic
export const createTopic = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    primaryLinks: v.array(
      v.object({
        linkId: v.id("links"),
        caption: v.optional(v.string()),
      })
    ),
    supportingLinks: v.array(
      v.object({
        linkId: v.id("links"),
        caption: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    // Validate primary links (max 3)
    if (args.primaryLinks.length > 3) {
      throw new Error("Topics can have at most 3 primary links");
    }
    
    // Create the topic
    const topicId = await ctx.db.insert("topics", {
      title: args.title,
      description: args.description,
      userId: identity.subject,
      tags: args.tags,
      isPublic: args.isPublic,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      bookmarkCount: 0,
      isTrending: false,
    });
    
    // Add primary links
    for (let i = 0; i < args.primaryLinks.length; i++) {
      await ctx.db.insert("topicLinks", {
        topicId,
        linkId: args.primaryLinks[i].linkId,
        linkType: "primary",
        order: i,
        caption: args.primaryLinks[i].caption,
      });
    }
    
    // Add supporting links
    for (let i = 0; i < args.supportingLinks.length; i++) {
      await ctx.db.insert("topicLinks", {
        topicId,
        linkId: args.supportingLinks[i].linkId,
        linkType: "supporting",
        order: i,
        caption: args.supportingLinks[i].caption,
      });
    }
    
    return topicId;
  },
});

// Toggle like on a topic
export const toggleLike = mutation({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error("Topic not found");
    
    // Check if already liked
    const existingLike = await ctx.db
      .query("topicLikes")
      .withIndex("by_user_and_topic", (q) => 
        q.eq("userId", identity.subject).eq("topicId", args.topicId)
      )
      .unique();
    
    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.topicId, {
        likeCount: Math.max(0, topic.likeCount - 1),
      });
      return false;
    } else {
      // Like
      await ctx.db.insert("topicLikes", {
        userId: identity.subject,
        topicId: args.topicId,
      });
      await ctx.db.patch(args.topicId, {
        likeCount: topic.likeCount + 1,
      });
      return true;
    }
  },
});

// Toggle bookmark on a topic
export const toggleBookmark = mutation({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error("Topic not found");
    
    // Check if already bookmarked
    const existingBookmark = await ctx.db
      .query("topicBookmarks")
      .withIndex("by_user_and_topic", (q) => 
        q.eq("userId", identity.subject).eq("topicId", args.topicId)
      )
      .unique();
    
    if (existingBookmark) {
      // Remove bookmark
      await ctx.db.delete(existingBookmark._id);
      await ctx.db.patch(args.topicId, {
        bookmarkCount: Math.max(0, topic.bookmarkCount - 1),
      });
      return false;
    } else {
      // Add bookmark
      await ctx.db.insert("topicBookmarks", {
        userId: identity.subject,
        topicId: args.topicId,
      });
      await ctx.db.patch(args.topicId, {
        bookmarkCount: topic.bookmarkCount + 1,
      });
      return true;
    }
  },
});