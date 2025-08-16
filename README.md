# Link Bookmark (Configurable Brand)

> **Note**: The brand name is configurable via the `NEXT_PUBLIC_BRAND_NAME` environment variable.

A modern web application for saving and organizing links from any website. Built with Next.js 15 following best practices with Server Components and a clean feature-based architecture.

## Features

- 🔗 **Universal Link Saving**: Save links from any website with automatic metadata extraction
- 🏷️ **Smart Previews**: Automatically fetches Open Graph tags for rich link previews
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔍 **Public Discovery**: Browse and bookmark public links from other users
- 💾 **Collections**: Save and organize your favorite links
- ⏰ **Reminders**: Set reminders for time-sensitive links
- 🌐 **Real-time Updates**: Powered by Convex for instant data synchronization
- 🔒 **Secure Authentication**: User authentication via Clerk

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Convex
- **Authentication**: Clerk
- **Styling**: Tailwind CSS + Shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Convex account (free tier available)
- A Clerk account for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Convex and Clerk credentials in `.env.local`:
   ```
   # Public Environment Variables
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   NEXT_PUBLIC_BRAND_NAME="Your Brand Name"
   
   # Server-only Environment Variables
   CLERK_SECRET_KEY=your_clerk_secret_key
   CONVEX_DEPLOY_KEY=your_convex_deploy_key
   ```

4. Deploy Convex functions:
   ```bash
   pnpm convex dev
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
[Your App Name]/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main app routes
│   │   ├── bookmarks/     # User's bookmarked links
│   │   ├── explore/       # Public links discovery
│   │   └── profile/       # User profile
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── cards/             # Card components for different link types
│   ├── shared/            # Shared components
│   └── ui/                # UI components (Shadcn/ui)
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── links.ts           # Link-related functions
│   └── auth.ts            # Authentication helpers
└── public/                # Static assets
```

## Key Features Explained

### Automatic Metadata Extraction

When you add a new link, the app automatically:
- Fetches the page's Open Graph tags
- Extracts title, description, and preview image
- Identifies the website's favicon
- Creates a rich preview card

### Link Organization

- **Collections**: Save links to your personal collection
- **Public/Private**: Choose whether to share links publicly
- **Smart Cards**: Different card layouts optimized for various content types

### Real-time Features

- Instant updates when new links are added
- Live bookmark counts
- Real-time synchronization across devices

## API Routes

### `/api/og` - Open Graph Tag Fetcher

Fetches Open Graph metadata from any URL:

```typescript
POST /api/og
Content-Type: application/json

{
  "url": "https://example.com/page"
}

// Response
{
  "title": "Page Title",
  "description": "Page description",
  "image": "https://example.com/image.jpg",
  "favicon": "https://example.com/favicon.ico",
  "siteName": "Example Site",
  "platform": "example.com"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
