import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Get the current user's info from Clerk auth
 */
export const getAuthUserId = async (ctx: { auth: Auth }) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return identity.subject; // This is the Clerk user ID
};

/**
 * Get or create a user in the database
 */
export const getOrCreateUser = async (
  ctx: QueryCtx | MutationCtx,
  auth: Auth
): Promise<Id<"users"> | null> => {
  const clerkId = await getAuthUserId({ auth });
  if (!clerkId) {
    return null;
  }

  const identity = await auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  // Try to find existing user
  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();

  if (existingUser) {
    // Update last active timestamp
    if ("patch" in ctx.db) {
      await ctx.db.patch(existingUser._id, {
        lastActiveAt: Date.now(),
      });
    }
    return existingUser._id;
  }

  // Create new user if in mutation context
  if ("insert" in ctx.db) {
    const userId = await ctx.db.insert("users", {
      clerkId,
      email: identity.email || "",
      name: identity.name,
      imageUrl: identity.pictureUrl,
      isAdmin: false, // Default to non-admin
      linkCount: 0,
      bookmarkCount: 0,
      lastActiveAt: Date.now(),
    });
    return userId;
  }

  return null;
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = async (
  ctx: QueryCtx | MutationCtx,
  auth: Auth
): Promise<boolean> => {
  const userId = await getOrCreateUser(ctx, auth);
  if (!userId) {
    return false;
  }

  const user = await ctx.db.get(userId);
  return user?.isAdmin || false;
};

/**
 * Require admin access - throws if not admin
 */
export const requireAdmin = async (
  ctx: QueryCtx | MutationCtx,
  auth: Auth
): Promise<Id<"users">> => {
  const userId = await getOrCreateUser(ctx, auth);
  if (!userId) {
    throw new Error("Unauthorized: Not authenticated");
  }

  const user = await ctx.db.get(userId);
  if (!user?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return userId;
}; 