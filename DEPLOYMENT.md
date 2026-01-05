# Deployment Guide

## Cloudflare Workers Deployment

### Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install globally
   ```bash
   npm install -g wrangler
   ```

### Step-by-Step Deployment

#### 1. Login to Cloudflare
```bash
wrangler login
```
This will open your browser to authenticate with Cloudflare.

#### 2. Configure Your Worker
Edit `wrangler.toml` to customize your worker name:
```toml
name = "your-content-previewer"  # Change this to your preferred name
```

#### 3. Build and Deploy

**Deploy to Staging:**
```bash
npm run deploy:staging
```

**Deploy to Production:**
```bash
npm run deploy
```

#### 4. Access Your Deployment
After deployment, Wrangler will provide URLs like:
- **Production**: `https://your-content-previewer.your-subdomain.workers.dev`
- **Staging**: `https://your-content-previewer-staging.your-subdomain.workers.dev`

### Custom Domain (Optional)

To use a custom domain:

1. **Add Domain to Cloudflare**: Add your domain to Cloudflare DNS
2. **Configure Route**: In Cloudflare dashboard, go to Workers & Pages
3. **Add Route**: Add a route like `preview.yourdomain.com/*`
4. **Update DNS**: Add a CNAME record pointing to your worker

### Environment Management

The project supports multiple environments:

- **Development**: `npm run dev` (local development)
- **Staging**: `npm run deploy:staging`
- **Production**: `npm run deploy`

### Monitoring and Logs

View logs and analytics:
```bash
wrangler tail                    # Live logs
wrangler tail --env staging      # Staging logs
```

### Troubleshooting

**Common Issues:**

1. **Build Fails**: Ensure Node.js 16+ is installed
2. **Deploy Fails**: Check Wrangler authentication with `wrangler whoami`
3. **Worker Errors**: Check logs with `wrangler tail`

**Performance Tips:**

- Workers have a 1MB size limit (our build is well under this)
- Cold start time is typically <10ms
- Global edge deployment provides <100ms response times

### Cost

Cloudflare Workers free tier includes:
- 100,000 requests per day
- 1000 requests per minute
- Perfect for personal/small team use

Paid plans start at $5/month for 10M requests.

### Security

The worker is stateless and processes no sensitive data:
- All rendering happens client-side
- No data is stored or logged
- HTTPS enforced by default
- CORS headers configured for security