# Content Previewer

A lightweight, versatile preview tool for **Markdown**, **LaTeX**, and **HTML** content. Perfect for quickly checking OCR results and formatted text output. Deployed on Cloudflare Workers for fast global access.

## ✨ Features

### 📝 Markdown Support
- Full GitHub Flavored Markdown (GFM)
- Syntax highlighting for code blocks
- Tables, lists, and blockquotes
- Math equations with KaTeX
- Mermaid diagrams
- Live preview as you type

### 🔬 LaTeX Support
- Advanced math equation rendering with MathJax
- Document structure parsing
- Support for common LaTeX environments (`equation`, `align`, `gather`, etc.)
- Both inline (`$...$`) and display (`$$...$$`) math
- Labels and references (`\label{}`, `\ref{}`)
- LaTeX commands (`\textbf`, `\textit`, etc.)

### 🌐 HTML Support
- Direct HTML rendering with CSS styling
- Math equations in HTML (KaTeX)
- Interactive elements
- Full CSS support

## 🚀 Quick Start

### Online Version
Visit the deployed version at: `https://your-worker.your-subdomain.workers.dev`

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd content-previewer

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Deployment to Cloudflare Workers

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy to staging**:
   ```bash
   npm run deploy:staging
   ```

4. **Deploy to production**:
   ```bash
   npm run deploy
   ```

## 📖 Usage

1. **Select Format**: Choose between Markdown, LaTeX, or HTML using the format buttons
2. **Input Content**: Paste or type your content in the left panel
3. **Live Preview**: See the rendered output in the right panel in real-time
4. **Switch Formats**: Easily switch between different content types

## 🎯 Perfect For

- ✅ Checking OCR output formatting
- ✅ Previewing markdown documents
- ✅ Testing LaTeX math expressions
- ✅ Validating HTML content
- ✅ Quick content formatting verification
- ✅ Educational content creation
- ✅ Technical documentation review

## 🛠 Technical Details

### Libraries Used
- **MathJax 3** - Advanced LaTeX math rendering
- **KaTeX** - Fast math rendering for Markdown/HTML
- **Marked** - Markdown parsing
- **Highlight.js** - Syntax highlighting
- **Mermaid** - Diagram rendering

### Architecture
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Backend**: Cloudflare Workers (serverless)
- **Deployment**: Single-file worker with inlined assets
- **CDN**: Global edge deployment via Cloudflare

### Performance
- ⚡ **Fast Loading**: Sub-100ms response times globally
- 🌍 **Global CDN**: Deployed to 200+ edge locations
- 📱 **Mobile Optimized**: Responsive design for all devices
- 🔄 **Real-time Preview**: Debounced updates (300ms)

## 🏗 Build Process

The build process inlines all HTML and JavaScript into a single Cloudflare Worker:

```bash
npm run build    # Builds dist/worker.js
npm run deploy   # Builds and deploys to production
```

## 📁 Project Structure

```
content-previewer/
├── public/
│   ├── index.html      # Main HTML file
│   └── app.js          # Application JavaScript
├── dist/
│   └── worker.js       # Built Cloudflare Worker (generated)
├── build.js            # Build script
├── worker.js           # Worker template
├── wrangler.toml       # Cloudflare Workers config
└── package.json        # Project configuration
```

## 🔧 Configuration

### Wrangler Configuration (`wrangler.toml`)
- **Production**: `content-previewer`
- **Staging**: `content-previewer-staging`
- **Compatibility**: Latest Cloudflare Workers runtime

### Environment Variables
No environment variables required - fully self-contained.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review the code examples

---

**Built with ❤️ for the developer community**