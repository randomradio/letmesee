// Cloudflare Worker for Content Previewer
// Serves static files and handles the preview application

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Static files content - will be populated during build
const STATIC_FILES = {
  '/': HTML_CONTENT,
  '/index.html': HTML_CONTENT,
  '/app.js': JS_CONTENT
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Handle CORS for development
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };
      
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }
      
      // Serve static files
      const filePath = pathname === '/' ? '/' : pathname;
      const fileContent = STATIC_FILES[filePath];
      
      if (fileContent) {
        const extension = pathname.includes('.') ? 
          '.' + pathname.split('.').pop() : '.html';
        const mimeType = MIME_TYPES[extension] || 'text/plain';
        
        return new Response(fileContent, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=86400', // 24 hours
            ...corsHeaders
          }
        });
      }
      
      // 404 for unknown routes
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      });
      
    } catch (error) {
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};