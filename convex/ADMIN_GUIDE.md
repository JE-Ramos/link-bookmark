# Admin System Guide

## Overview
This admin system provides comprehensive tools for managing users, links, and viewing analytics in your link bookmarking application.

## Setup

### 1. Configure Clerk Authentication
Make sure your Clerk environment variables are set in the Convex Dashboard:
- `CLERK_JWT_ISSUER_DOMAIN`

### 2. Make the First Admin
There are two ways to create an admin:

#### Option A: Automatic First User
The first user who signs up can be automatically made an admin by calling:
```typescript
// In your frontend after user signs up
const wasAdminCreated = await mutation(api.setup.makeFirstUserAdmin);
```

#### Option B: Manual via Convex Dashboard
Run this in the Convex Dashboard Functions panel:
```javascript
await internal.setup.makeUserAdminByEmail({ email: "admin@example.com" });
```

## Admin Functions

### Analytics Dashboard
```typescript
// Get comprehensive analytics
const analytics = await query(api.admin.getAnalytics);
// Returns: totalUsers, totalLinks, platformBreakdown, topLinks, etc.
```

### User Management
```typescript
// Get all users
const users = await query(api.admin.getAllUsers, {
  searchTerm: "john", // optional
  onlyAdmins: true,   // optional
});

// Toggle admin status
await mutation(api.admin.toggleUserAdmin, {
  userId: "user_id_here"
});
```

### Link Management
```typescript
// Get all links with filters
const links = await query(api.admin.getAllLinks, {
  searchTerm: "product",  // optional
  platform: "shopee",     // optional
  userId: "user_id",      // optional
  onlyPublic: true,       // optional
});

// Delete a link
await mutation(api.admin.deleteLink, {
  linkId: "link_id_here"
});

// Toggle link visibility
await mutation(api.admin.toggleLinkVisibility, {
  linkId: "link_id_here"
});

// Bulk delete links
await mutation(api.admin.bulkDeleteLinks, {
  linkIds: ["link1", "link2", "link3"]
});
```

### Check Admin Status
```typescript
// Check if current user is admin
const status = await query(api.setup.getCurrentUserAdminStatus);
// Returns: { isAuthenticated, isAdmin, email }
```

## Frontend Integration Example

```typescript
// AdminRoute.tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AdminRoute({ children }) {
  const status = useQuery(api.setup.getCurrentUserAdminStatus);
  
  if (!status?.isAdmin) {
    return <div>Unauthorized</div>;
  }
  
  return children;
}
```

## Security Notes
1. All admin functions use `requireAdmin` which validates both authentication and admin status
2. Regular users cannot access admin functions - they will receive "Unauthorized" errors
3. The system tracks user activity with `lastActiveAt` timestamps
4. All actions are logged to the console for audit purposes 