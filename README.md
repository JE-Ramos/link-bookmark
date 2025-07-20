# Link Bookmark

A modern web application for saving and tracking product links from popular e-commerce platforms like Shopee, Lazada, and TikTok Shop.

## Features

- 📱 Mobile-first design with bottom navigation
- 🔖 Save product links from multiple platforms
- 💰 Track price changes and discounts
- ⏰ Set reminders for deals
- 🔐 User authentication with Clerk
- 🌙 Dark mode support
- ⚡ Real-time updates with Convex

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **Authentication**: Clerk
- **Backend**: Convex
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Clerk account for authentication
- A Convex account for the backend

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/link-bookmark.git
   cd link-bookmark
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Convex
   CONVEX_DEPLOYMENT=your_convex_deployment
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

4. **Set up Convex**
   ```bash
   pnpm convex dev
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── cards/            # Card variations
│   └── ...               # Other components
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   └── links.ts          # API functions
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm convex dev` - Start Convex development

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
