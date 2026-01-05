# Deployment Instructions

## ⚠️ Important: This is a Cloudflare Workers project, not Pages

### Deploy with Wrangler CLI (Recommended)

1. **Install Wrangler globally:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

### Alternative: Convert to Cloudflare Pages

If you prefer to use Cloudflare Pages, use these build settings:

- **Build command:** `npm run build:pages`
- **Build output directory:** `dist`
- **Root directory:** `/`

Then I'll create the Pages version for you.