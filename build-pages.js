#!/usr/bin/env node

/**
 * Build script for Cloudflare Pages deployment
 * Creates static files in dist directory
 */

const fs = require('fs');
const path = require('path');

function buildPages() {
    console.log('Building for Cloudflare Pages...');
    
    try {
        // Create dist directory
        const distDir = path.join(__dirname, 'dist');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
        
        // Copy HTML file
        const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
        fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
        
        // Copy JS file
        const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
        fs.writeFileSync(path.join(distDir, 'app.js'), jsContent);
        
        // Create _headers file for Cloudflare Pages
        const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.html
  Cache-Control: public, max-age=3600

/*.js
  Cache-Control: public, max-age=86400

/*.css
  Cache-Control: public, max-age=86400`;
        
        fs.writeFileSync(path.join(distDir, '_headers'), headersContent);
        
        // Create _redirects file
        const redirectsContent = `# Redirect all routes to index.html for SPA
/*    /index.html   200`;
        
        fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
        
        console.log('✅ Pages build completed successfully!');
        console.log('📁 Files created in dist/:');
        console.log('   - index.html');
        console.log('   - app.js');
        console.log('   - _headers');
        console.log('   - _redirects');
        
    } catch (error) {
        console.error('❌ Pages build failed:', error.message);
        process.exit(1);
    }
}

buildPages();