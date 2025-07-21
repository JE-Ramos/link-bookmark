# Admin Guide - Link Bookmark

This guide covers administrative operations for the Link Bookmark application using Convex functions.

## Key Concepts

1. **Authentication**: Uses Clerk for user authentication with clerk IDs
2. **Database**: Convex provides real-time database with TypeScript safety
3. **Admin Access**: No built-in admin system - use Convex dashboard or create custom admin functions

## Common Admin Tasks

### 1. User Management

#### View All Users
```typescript
// In Convex dashboard console
await ctx.db.query("users").collect()
```

#### Find User by Clerk ID
```typescript
await ctx.db
  .query("users")
  .withIndex("by_clerk", q => q.eq("clerkId", "user_123"))
  .unique()
```

### 2. Link Management

#### View All Links
```typescript
await ctx.db.query("links").collect()
```

#### Delete a Link
```typescript
// First find the link
const link = await ctx.db.get(linkId)
// Then delete it
await ctx.db.delete(linkId)
```

#### Update Link Visibility
```typescript
await ctx.db.patch(linkId, {
  isPublic: false
})
```

#### Search Links by URL Domain
```typescript
await ctx.db
  .query("links")
  .filter(q => q.eq(q.field("platform"), "example.com"))
  .collect()
```

### 3. Bookmark Management

#### View User's Bookmarks
```typescript
await ctx.db
  .query("bookmarks")
  .withIndex("by_user", q => q.eq("userId", "user_123"))
  .collect()
```

### 4. Data Cleanup

#### Remove Orphaned Bookmarks
```typescript
const bookmarks = await ctx.db.query("bookmarks").collect()
for (const bookmark of bookmarks) {
  const link = await ctx.db.get(bookmark.linkId)
  if (!link) {
    await ctx.db.delete(bookmark._id)
  }
}
```

## Creating Custom Admin Functions

Add to `convex/admin.ts`:

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Example: Ban/unban a user
export const toggleUserBan = mutation({
  args: { 
    userId: v.id("users"),
    banned: v.boolean() 
  },
  handler: async (ctx, args) => {
    // Add your admin authentication check here
    await ctx.db.patch(args.userId, {
      banned: args.banned
    });
  },
});

// Example: Get platform statistics
export const getPlatformStats = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db.query("links").collect();
    const platformCounts: Record<string, number> = {};
    
    for (const link of links) {
      const platform = link.platform || 'unknown';
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    }
    
    return platformCounts;
  },
});
```

## Direct Database Operations

Use the Convex Dashboard for direct database operations:

1. Go to your Convex dashboard
2. Navigate to "Data" tab
3. Select the table you want to modify
4. Use the interface to view, edit, or delete records

## Seeding Demo Data

Run the seed function:
```bash
npx convex run seed
```

The seed file includes various types of links from different websites to demonstrate the app's capabilities.

## Security Considerations

1. **Always validate admin permissions** in mutation functions
2. **Use Clerk roles/metadata** for admin identification
3. **Audit sensitive operations** by logging admin actions
4. **Limit direct database access** to production data

## Monitoring

1. Use Convex Dashboard's "Logs" tab to monitor function executions
2. Set up error tracking for failed operations
3. Monitor usage metrics in the "Usage" tab

## Troubleshooting

### Common Issues

1. **Missing user records**: Can occur if Clerk webhook fails
   - Solution: Implement user creation on first action

2. **Orphaned bookmarks**: Links deleted but bookmarks remain
   - Solution: Use cascade delete or cleanup job

3. **Platform field inconsistency**: Different URL formats
   - Solution: Normalize URLs when saving 