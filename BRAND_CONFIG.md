# Brand Configuration Guide

This application supports configurable branding through environment variables.

## Configuration

### Setting the Brand Name

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_BRAND_NAME="Your Brand Name"
```

If not set, the default brand name is "Link Bookmark".

### Brand Constants

The brand configuration is centralized in `/lib/constants/brand.ts`:

```typescript
export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "Link Bookmark";
export const BRAND_TAGLINE = "Save & Track Product Deals";
export const BRAND_DESCRIPTION = "Save and track product links from your favorite e-commerce platforms. Get price alerts and never miss a deal.";
```

### Usage

The brand name is automatically used in:
- Page titles and metadata
- Open Graph tags
- Documentation
- Design system references

### Example

To rebrand the application as "DealTracker":

1. Set in `.env.local`:
   ```env
   NEXT_PUBLIC_BRAND_NAME="DealTracker"
   ```

2. Restart the development server
3. All references will automatically update

## Additional Customization

For more extensive branding changes (colors, logos, etc.), update:
- `/public/` - for logos and favicons
- `/app/globals.css` - for color schemes
- `/lib/constants/brand.ts` - for additional brand constants

