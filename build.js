#!/usr/bin/env node

/**
 * Build script for Cloudflare Workers deployment
 * Inlines HTML and JS content into the worker script
 */

const fs = require('fs');
const path = require('path');

function escapeForJS(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');
}

function buildWorker() {
    console.log('Building Cloudflare Worker...');
    
    try {
        // Read source files
        const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
        const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
        const workerTemplate = fs.readFileSync(path.join(__dirname, 'worker.js'), 'utf8');
        
        // Escape content for JavaScript
        const escapedHtml = escapeForJS(htmlContent);
        const escapedJs = escapeForJS(jsContent);
        
        // Replace placeholders in worker template
        const workerCode = workerTemplate
            .replace('HTML_CONTENT', `\`${escapedHtml}\``)
            .replace('JS_CONTENT', `\`${escapedJs}\``);
        
        // Write the final worker script
        fs.writeFileSync(path.join(__dirname, 'dist', 'worker.js'), workerCode);
        
        console.log('✅ Worker built successfully at dist/worker.js');
        console.log('📦 Ready for Cloudflare Workers deployment');
        
        // Show file sizes
        const stats = fs.statSync(path.join(__dirname, 'dist', 'worker.js'));
        console.log(`📊 Worker size: ${(stats.size / 1024).toFixed(2)} KB`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
}

buildWorker();