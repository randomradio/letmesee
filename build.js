#!/usr/bin/env node

/**
 * Build script for Cloudflare Workers deployment
 * Inlines HTML and JS content into the worker script
 */

const fs = require('fs');
const path = require('path');

function buildWorker() {
    console.log('Building Cloudflare Worker...');
    
    try {
        // Read source files
        const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
        const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
        const workerTemplate = fs.readFileSync(path.join(__dirname, 'worker.js'), 'utf8');
        
        console.log('📖 Read source files successfully');
        
        // Use Base64 encoding to avoid all escaping issues
        const htmlBase64 = Buffer.from(htmlContent).toString('base64');
        const jsBase64 = Buffer.from(jsContent).toString('base64');
        
        console.log('🔧 Encoded content to Base64');
        
        // Replace placeholders in worker template
        let workerCode = workerTemplate;
        
        // Replace with Base64 decode calls
        workerCode = workerCode.replaceAll('HTML_CONTENT', `atob('${htmlBase64}')`);
        workerCode = workerCode.replaceAll('JS_CONTENT', `atob('${jsBase64}')`);
        
        console.log('🔄 Replaced placeholders in worker template');
        
        // Verify replacements worked
        if (workerCode.includes('HTML_CONTENT') || workerCode.includes('JS_CONTENT')) {
            throw new Error('Placeholder replacement failed');
        }
        
        // Write the final worker script
        fs.writeFileSync(path.join(__dirname, 'dist', 'worker.js'), workerCode);
        
        console.log('✅ Worker built successfully at dist/worker.js');
        console.log('📦 Ready for Cloudflare Workers deployment');
        
        // Show file sizes
        const stats = fs.statSync(path.join(__dirname, 'dist', 'worker.js'));
        console.log(`📊 Worker size: ${(stats.size / 1024).toFixed(2)} KB`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
}

buildWorker();