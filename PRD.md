# Product Requirements Document (PRD) — MVP
## Link Topic Aggregator

### Product Overview
A minimal application where users create topics (or product names) and attach links. Users can follow topics and organize them into personal collections. A simple feed and a stories-style image carousel help discovery. Authentication via Clerk; a one-time lifetime purchase via RevenueCat unlocks unlimited collections. Email notifications are sent via Resend when followed topics are updated.

### Core Features (MVP)

#### 1. Topics
- Create and manage topics with:
  - Title (required)
  - Description (optional)
  - Cover image (optional)
  - Category (optional, e.g., "toys", "software")
  - Slug (derived from title)
  - Official domains (optional) — array of domains used to classify links as official/partner

#### 2. Links (primary focus)
- Add links to a topic.
- Auto-resolve basic metadata per link:
  - Title
  - Description (if available)
  - Preview image and favicon (if available)
  - Status: "active" | "broken" | "checking" | "unknown"
  - Classification fields:
    - `sourceType`: "official" | "partner" | "community"
    - `verifiedOfficial`: boolean (true if the link domain matches topic official domains)
    - `publisher`: optional (human-readable source)
    - `domain`: extracted from URL
    - `tags`: optional string[] (e.g., ["guide", "docs", "account"]) 

#### 3. Follow and Collections
- Follow/unfollow topics.
- Create collections and add/remove topics within a collection.
- Gating: Free users can create up to N collections (default N = 3). RevenueCat lifetime purchase unlocks unlimited collections.

#### 4. Feed and Stories
- Basic feed with recent or followed topics.
- Stories-style carousel of images (use topic `coverImage` or latest link image).

UI building blocks:
- Carousel item
  - Image (required), label (category or live label), target (category feed or topic)
  - Types: `category` | `live` | `topic`
- Topic card
  - Image (topic cover or best link image), title, description
  - Inline list of up to 3 links with badges for `sourceType`
  - Follow button; "Add to Collection" action
- Topic rows
  - Rows of topic cards (uniform card size), optionally grouped by category
- Collections
  - Uniform card representation (name, count, latest cover), consistent with topic card sizing

#### 5. Authentication and Monetization
- Login/logout via Clerk.
- Lifetime purchase via RevenueCat to unlock unlimited collections.

#### 6. Notifications
- When a new link is added to a followed topic, send an email via Resend.
- Throttle per user+topic to avoid spam.

### Out of Scope (for MVP)
- AI summaries, embeddings, agents, or RAG.
- Social sharing, public profiles, advanced analytics, click tracking.
- Full discovery/search beyond the simple feed and stories carousel.
- Contributing links to other users’ topics.

### Success Metrics
- Topics created per user.
- Links added per topic.
- Number of topic follows and collections created.
- RevenueCat lifetime conversions.

### Architecture (Domain-Driven Design)

#### Technology Stack
- **Frontend**: Next.js 15 (App Router) + Tailwind + shadcn/ui
- **Backend**: Convex for real-time data and storage
- **Auth**: Clerk for authentication
- **Notifications**: Resend for email
- **Payments**: RevenueCat for lifetime purchases
- **API**: REST endpoints + optional direct Convex access

#### Directory Structure (DDD)

```
link-bookmark/
├── @app/                        # Next.js App Router (UI layer only)
│   ├── (auth)/                 # Auth-related pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/                 # Main app pages
│   │   ├── topics/
│   │   ├── collections/
│   │   ├── feed/
│   │   └── profile/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home/landing page
│   └── globals.css
├── @api/                        # REST API layer
│   ├── topics/
│   │   ├── route.ts            # GET, POST /api/topics
│   │   └── [id]/
│   │       ├── route.ts        # GET, PATCH, DELETE /api/topics/:id
│   │       ├── links/
│   │       │   └── route.ts    # POST, GET /api/topics/:id/links
│   │       └── follow/
│   │           └── route.ts    # POST, DELETE /api/topics/:id/follow
│   ├── links/
│   │   └── [id]/
│   │       └── route.ts        # DELETE /api/links/:id
│   ├── collections/
│   │   ├── route.ts            # GET, POST /api/collections
│   │   └── [id]/
│   │       ├── route.ts        # GET, PATCH, DELETE /api/collections/:id
│   │       └── topics/
│   │           └── [topicId]/
│   │               └── route.ts # POST, DELETE /api/collections/:id/topics/:topicId
│   ├── feed/
│   │   └── route.ts            # GET /api/feed
│   ├── users/
│   │   └── me/
│   │       └── entitlements/
│   │           └── route.ts    # GET /api/users/me/entitlements
│   ├── webhooks/
│   │   └── revenuecat/
│   │       └── route.ts        # POST /api/webhooks/revenuecat
│   └── internal/
│       └── og/
│           └── route.ts        # POST /api/internal/og (metadata extraction)
├── @convex/                     # Domain logic & data layer
│   ├── _generated/             # Convex generated files
│   ├── domain/                 # Domain entities and business rules
│   │   ├── topics/
│   │   │   ├── schema.ts       # Topic entity definition
│   │   │   ├── validators.ts   # Topic validation rules
│   │   │   └── types.ts        # Topic types and interfaces
│   │   ├── links/
│   │   │   ├── schema.ts       # Link entity definition
│   │   │   ├── validators.ts   # Link validation rules
│   │   │   ├── classifier.ts   # Link classification logic
│   │   │   └── types.ts        # Link types and interfaces
│   │   ├── collections/
│   │   │   ├── schema.ts       # Collection entity
│   │   │   ├── validators.ts   # Collection rules & gating
│   │   │   └── types.ts
│   │   ├── users/
│   │   │   ├── schema.ts       # User entity
│   │   │   ├── entitlements.ts # Entitlement logic
│   │   │   └── types.ts
│   │   └── notifications/
│   │       ├── schema.ts       # Notification entity
│   │       └── types.ts
│   ├── services/               # Application services
│   │   ├── topics.ts           # Topic CRUD operations
│   │   ├── links.ts            # Link operations & metadata
│   │   ├── collections.ts      # Collection management
│   │   ├── follows.ts          # Follow/unfollow logic
│   │   ├── feed.ts             # Feed generation
│   │   ├── notifications.ts    # Notification dispatch
│   │   └── entitlements.ts     # Purchase verification
│   ├── actions/                # Convex actions (side effects)
│   │   ├── fetchMetadata.ts    # External API calls for OG data
│   │   ├── sendNotification.ts # Resend integration
│   │   └── checkLinkStatus.ts  # Link health checking
│   ├── auth.ts                 # Authentication helpers
│   ├── schema.ts               # Combined database schema
│   └── _api.ts                 # Public API exports for REST layer
├── @components/                 # Reusable UI components only
│   ├── ui/                     # Base UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── topics/                 # Topic-specific components
│   │   ├── TopicCard.tsx
│   │   ├── TopicForm.tsx
│   │   └── TopicList.tsx
│   ├── links/                  # Link-specific components
│   │   ├── LinkCard.tsx
│   │   ├── LinkBadge.tsx
│   │   └── LinkForm.tsx
│   ├── collections/            # Collection components
│   │   ├── CollectionCard.tsx
│   │   └── CollectionGrid.tsx
│   ├── feed/                   # Feed components
│   │   ├── FeedCarousel.tsx
│   │   ├── StoryItem.tsx
│   │   └── TopicRow.tsx
│   └── providers/              # Context providers
│       ├── ConvexProvider.tsx
│       └── ClerkProvider.tsx
└── @lib/                        # Shared utilities & business logic
    ├── domain/                 # Domain utilities
    │   ├── link-classifier.ts  # Link classification logic
    │   ├── slug-generator.ts   # Slug generation
    │   └── validators.ts       # Shared validation rules
    ├── api/                    # API utilities
    │   ├── auth.ts             # Clerk token validation
    │   ├── response.ts         # Standard API responses
    │   └── errors.ts           # Error handling
    ├── hooks/                  # React hooks
    │   ├── useTopics.ts
    │   ├── useCollections.ts
    │   └── useEntitlements.ts
    └── utils/                  # General utilities
        ├── cn.ts               # Class name helper
        └── format.ts           # Formatting helpers
```

#### Domain Model

##### Core Entities
1. **Topic** - Main aggregate root
   - Contains links
   - Has followers
   - Belongs to categories
   - Can be added to collections

2. **Link** - Value object within Topic
   - Classified by source type
   - Has metadata
   - Tracked for health status

3. **Collection** - User's organization unit
   - Contains topics
   - Subject to entitlement gating

4. **User** - System user
   - Has entitlements
   - Creates topics/links
   - Follows topics
   - Owns collections

##### Bounded Contexts
1. **Content Management** - Topics, Links, Classifications
2. **User Management** - Authentication, Entitlements
3. **Discovery** - Feed, Categories, Search
4. **Notifications** - Email alerts, Throttling

### API Specifications

#### Authentication
All endpoints require Bearer token from Clerk in the Authorization header:
```
Authorization: Bearer <clerk_token>
```

#### Standard Response Format
```typescript
// Success response
{
  "success": true,
  "data": <response_data>,
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional additional context
  }
}

// Paginated response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
```

#### Error Codes
- `UNAUTHORIZED` - Invalid or missing auth token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMITED` - Too many requests
- `PAYMENT_REQUIRED` - Exceeds free tier limits
- `INTERNAL_ERROR` - Server error

### API Endpoints

- Topics
  - POST `/api/topics` — create
  - GET `/api/topics` — list (optionally `mine=1`)
  - GET `/api/topics/:id` — details (+ links)
  - PATCH `/api/topics/:id` — update
  - DELETE `/api/topics/:id` — delete

- Links
  - POST `/api/topics/:id/links` — add link (resolves metadata server-side)
  - GET `/api/topics/:id/links` — list links for a topic
  - DELETE `/api/links/:linkId` — delete link
  - Server classifies `sourceType` and `verifiedOfficial` using `topics.officialDomains`

- Follow
  - POST `/api/topics/:id/follow` — follow
  - DELETE `/api/topics/:id/follow` — unfollow

- Collections
  - POST `/api/collections` — create (enforce gating)
  - GET `/api/collections` — list
  - POST `/api/collections/:id/topics` — add topic to collection
  - DELETE `/api/collections/:id/topics/:topicId` — remove topic from collection

- Feed
  - GET `/api/feed` — recent or followed topics and stories carousel

- Entitlements / RevenueCat
  - POST `/api/revenuecat/webhook` — update user entitlements (validate signature)
  - GET `/api/users/me/entitlements` — lifetime and limits

- Notifications
  - Implicit via follows; optional endpoint to test: GET `/api/notifications/test`

Mobile can alternatively use Convex directly (preferred for real-time): use Clerk token to initialize Convex client and call the same functions.

### Database Schema (Convex)

```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"]) 
    .index("by_email", ["email"]) 
    .index("by_username", ["username"]),

  topics: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    category: v.optional(v.string()),
    slug: v.optional(v.string()),
    officialDomains: v.optional(v.array(v.string())),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"]) 
    .index("by_updated", ["updatedAt"]) 
    .index("by_category", ["category"]),

  links: defineTable({
    topicId: v.id("topics"),
    userId: v.id("users"),
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    favicon: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("broken"),
      v.literal("checking"),
      v.literal("unknown")
    ),
    lastChecked: v.optional(v.number()),
    sourceType: v.union(
      v.literal("official"),
      v.literal("partner"),
      v.literal("community")
    ),
    verifiedOfficial: v.boolean(),
    publisher: v.optional(v.string()),
    domain: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_topic", ["topicId"]) 
    .index("by_user", ["userId"]) 
    .index("by_status", ["status"]),

  follows: defineTable({
    userId: v.id("users"),
    topicId: v.id("topics"),
  })
    .index("by_user", ["userId"]) 
    .index("by_topic", ["topicId"]) 
    .index("by_user_topic", ["userId", "topicId"]),

  collections: defineTable({
    userId: v.id("users"),
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  collectionTopics: defineTable({
    collectionId: v.id("collections"),
    topicId: v.id("topics"),
  })
    .index("by_collection", ["collectionId"]) 
    .index("by_topic", ["topicId"]) 
    .index("by_collection_topic", ["collectionId", "topicId"]),

  purchases: defineTable({
    userId: v.id("users"),
    entitlement: v.string(), // e.g., "lifetime"
    source: v.literal("revenuecat"),
    active: v.boolean(),
    raw: v.optional(v.any()),
  })
    .index("by_user", ["userId"]) 
    .index("by_user_entitlement", ["userId", "entitlement"]),

  notifications: defineTable({
    userId: v.id("users"),
    topicId: v.id("topics"),
    type: v.literal("email"),
    sentAt: v.number(),
  })
    .index("by_user", ["userId"]) 
    .index("by_topic", ["topicId"]),
});
```

### Entitlements & Gating
- Default free limit: N = 3 collections per user.
- Lifetime purchase via RevenueCat sets `entitlement = "lifetime"` active, unlocking unlimited collections.

### Notifications
- Trigger on new link added to a topic; send email to followers via Resend.
- Batch and throttle (e.g., max once per 6 hours per user+topic).

### Mobile Integration
- REST: Use Bearer Clerk token to call endpoints.
- Direct Convex (recommended for real-time): Initialize client with Clerk token and call Convex functions directly.

### Implementation Plan (1 Day)
1) Environment and providers: configure Clerk, Convex, Resend, RevenueCat webhook secret; wire providers in `app/layout.tsx`. Do not auto-run dev; use `pnpm dev`.
2) Convex schema and functions: topics, links (with metadata resolution + status), follows, collections (with gating), feed, entitlements, notifications.
3) REST API routes mapping to Convex queries/mutations/actions. RevenueCat webhook to upsert purchases.
4) Minimal UI: create topics, add links, follow, create collection; simple feed + stories carousel.
5) Smoke tests: cURL all endpoints, test webhook sample, verify Resend logs.

### Environment Variables
Public:
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

Server-only:
- `CLERK_SECRET_KEY`
- `CONVEX_DEPLOY_KEY`
- `RESEND_API_KEY`
- `REVENUECAT_WEBHOOK_SECRET`

### Use-case Example: Toys / Cloud Product
- Category: `toys`
- Topic: `Cloud`
- Topic official domains: ["cloudtoys.com", "docs.cloudtoys.com"]
- Example links:
  - Official guide: `https://docs.cloudtoys.com/guide` → `sourceType=official`, `verifiedOfficial=true`, `tags=["guide"]`
  - Official third-party account (partner): `https://twitter.com/cloudtoys` → `sourceType=partner`, `verifiedOfficial=false`, `publisher="Twitter"`, `tags=["account"]`
  - Community but verified as official info (partner): `https://medium.com/@cloudtoys/overview` → `sourceType=partner`, `verifiedOfficial=false`, `tags=["docs"]`
  - Community tutorial: `https://awesomeblogs.dev/how-to-cloud-toys` → `sourceType=community`, `verifiedOfficial=false`, `tags=["tutorial"]`

Feed representation:
- Carousel shows a `category` item for `toys` with an image and label.
- Topic row lists `Cloud` topic card with cover, title, description, and top 3 links with badges (Official/Partner/Community).

## Refactoring Plan

### Current State Analysis
The codebase currently has:
- Mixed concerns in components (business logic mixed with UI)
- Convex functions spread across multiple files without clear domain boundaries
- No REST API layer (only one OG metadata endpoint)
- Components with embedded data fetching logic
- Unused legacy code (bookmarks, reminders, admin features)

### Refactoring Steps

#### 1. @convex/ Directory Cleanup
**Remove:**
- `admin.ts` - Not in MVP scope
- `clearData.ts`, `clearTopics.ts` - Development utilities
- `seed.ts`, `seedTopics.ts` - Move to scripts
- `links.ts` - Legacy bookmark system
- `setup.ts` - One-time setup

**Refactor:**
- Split `topics.ts` into domain services
- Move auth logic to dedicated auth service
- Create clear domain boundaries

**New Structure:**
```
@convex/
├── domain/
│   ├── topics/
│   ├── links/
│   ├── collections/
│   └── users/
├── services/
├── actions/
├── auth.ts
├── schema.ts
└── _api.ts
```

#### 2. @api/ Directory Creation
Create REST endpoints that wrap Convex functions:
- Implement standard response format
- Add proper error handling
- Include rate limiting
- Add request validation

#### 3. @components/ Directory Cleanup
**Remove:**
- Page-specific components (move to @app/)
- `cards/` - Most are unused, keep only needed ones
- `link-preview/` - Over-engineered for MVP
- Legacy components (reminder-dialog, etc.)

**Keep:**
- `ui/` - Base shadcn components
- Domain-specific reusable components
- Providers

#### 4. @lib/ Directory Organization
**Remove:**
- `animations.ts` - Over-engineered
- `link-type-detector.ts` - Not needed for MVP
- `schema-org-generator.ts` - Not needed for MVP

**Add:**
- Domain utilities
- API helpers
- Common validators

#### 5. @app/ Directory Cleanup
**Remove:**
- `admin/` - Not in MVP
- `design-system/` - Not needed
- `demo/` - Not needed
- Page-specific components (move to components)

**Reorganize:**
- Clear route structure matching API
- Minimal page components
- Proper layouts

### Migration Strategy
1. Create new directory structure
2. Move and refactor code incrementally
3. Update imports
4. Remove old code
5. Test each module

### Benefits of Refactoring
- Clear separation of concerns
- Easier to maintain and scale
- Better testability
- Clear API surface for mobile
- Follows DDD principles
- Reduces code duplication