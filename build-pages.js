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
        if (fs.existsSync(distDir)) {
            fs.rmSync(distDir, { recursive: true, force: true });
        }
        fs.mkdirSync(distDir, { recursive: true });
        
        console.log('📁 Created dist directory');
        
        // Copy HTML file
        const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
        fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
        console.log('✅ Copied index.html');
        
        // Copy JS file
        const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
        fs.writeFileSync(path.join(distDir, 'app.js'), jsContent);
        console.log('✅ Copied app.js');
        
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
        console.log('✅ Created _headers');
        
        // Create _redirects file
        const redirectsContent = `# Redirect all routes to index.html for SPA
/*    /index.html   200`;
        
        fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
        console.log('✅ Created _redirects');
        
        // Verify files
        const files = fs.readdirSync(distDir);
        console.log('📊 Files in dist directory:', files);
        
        // Check file sizes
        files.forEach(file => {
            const stats = fs.statSync(path.join(distDir, file));
            console.log(`   ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
        });
        
        console.log('✅ Pages build completed successfully!');
        
    } catch (error) {
        console.error('❌ Pages build failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

buildPages();