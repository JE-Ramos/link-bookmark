import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Make the first user who signs up an admin automatically
 * This should be called from your app when the first user signs up
 */
export const makeFirstUserAdmin = mutation({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    // Check if we already have any admins
    const existingAdmins = await ctx.db
      .query("users")
      .withIndex("by_admin", (q) => q.eq("isAdmin", true))
      .collect();
    
    if (existingAdmins.length > 0) {
      console.log("Admin already exists, skipping");
      return false;
    }
    
    // Get the current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Make them admin
    await ctx.db.patch(user._id, {
      isAdmin: true,
    });
    
    console.log(`Made first user ${user.email} an admin`);
    return true;
  },
});

/**
 * Internal function to make a specific user admin by email
 * Useful for running from the Convex dashboard
 */
export const makeUserAdminByEmail = internalMutation({
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

/**
 * Get current user's admin status
 */
export const getCurrentUserAdminStatus = query({
  args: {},
  returns: v.object({
    isAuthenticated: v.boolean(),
    isAdmin: v.boolean(),
    email: v.optional(v.string()),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        isAuthenticated: false,
        isAdmin: false,
      };
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    
    return {
      isAuthenticated: true,
      isAdmin: user?.isAdmin || false,
      email: user?.email,
    };
  },
}); 