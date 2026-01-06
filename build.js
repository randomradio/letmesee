#!/usr/bin/env node

/**
 * Build script for Cloudflare Workers deployment
 * Inlines HTML and JS content into the worker script
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateHash(content) {
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

function buildWorker() {
    console.log('Building Cloudflare Worker...');
    
    try {
        // Read source files
        const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
        const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
        const sitemapContent = fs.readFileSync(path.join(__dirname, 'public', 'sitemap.xml'), 'utf8');
        const robotsContent = fs.readFileSync(path.join(__dirname, 'public', 'robots.txt'), 'utf8');
        const workerTemplate = fs.readFileSync(path.join(__dirname, 'worker.js'), 'utf8');
        
        console.log('📖 Read source files successfully');
        
        // Generate hashes for cache busting
        const jsHash = generateHash(jsContent);
        const htmlHash = generateHash(htmlContent);
        
        console.log(`🔢 Generated hashes - JS: ${jsHash}, HTML: ${htmlHash}`);
        
        // Update HTML to reference hashed JS file
        const hashedJsFilename = `app.${jsHash}.js`;
        const updatedHtmlContent = htmlContent.replace(
            '<script src="app.js"></script>',
            `<script src="${hashedJsFilename}"></script>`
        );
        
        // Use Base64 encoding to avoid all escaping issues
        const htmlBase64 = Buffer.from(updatedHtmlContent).toString('base64');
        const jsBase64 = Buffer.from(jsContent).toString('base64');
        const sitemapBase64 = Buffer.from(sitemapContent).toString('base64');
        const robotsBase64 = Buffer.from(robotsContent).toString('base64');
        
        console.log('🔧 Encoded content to Base64 with hash-busted references');
        
        // Replace placeholders in worker template
        let workerCode = workerTemplate;
        
        // Create the static files mapping with hashed filenames
        const staticFilesMapping = `{
  '/': atob('${htmlBase64}'),
  '/index.html': atob('${htmlBase64}'),
  '/app.js': atob('${jsBase64}'),
  '/${hashedJsFilename}': atob('${jsBase64}'),
  '/sitemap.xml': atob('${sitemapBase64}'),
  '/robots.txt': atob('${robotsBase64}')
}`;
        
        // Replace HTML_CONTENT and JS_CONTENT with the complete mapping
        workerCode = workerCode.replace(
            /const STATIC_FILES = \{[^}]+\};/s,
            `const STATIC_FILES = ${staticFilesMapping};`
        );
        
        console.log('🔄 Replaced placeholders with hash-busted file mapping');
        
        // Verify replacements worked
        if (workerCode.includes('HTML_CONTENT') || workerCode.includes('JS_CONTENT') || !workerCode.includes(hashedJsFilename)) {
            throw new Error('Placeholder replacement failed or hash not applied');
        }
        
        // Write the final worker script
        fs.writeFileSync(path.join(__dirname, 'dist', 'worker.js'), workerCode);
        
        // Write build info for debugging
        const buildInfo = {
            timestamp: new Date().toISOString(),
            hashes: {
                html: htmlHash,
                js: jsHash
            },
            files: {
                html: 'index.html',
                js: hashedJsFilename
            },
            sizes: {
                worker: `${(workerCode.length / 1024).toFixed(2)} KB`,
                html: `${(htmlContent.length / 1024).toFixed(2)} KB`,
                js: `${(jsContent.length / 1024).toFixed(2)} KB`
            }
        };
        
        fs.writeFileSync(
            path.join(__dirname, 'dist', 'build-info.json'), 
            JSON.stringify(buildInfo, null, 2)
        );
        
        console.log('✅ Worker built successfully at dist/worker.js');
        console.log('📦 Ready for Cloudflare Workers deployment');
        
        // Show file sizes and hash info
        const stats = fs.statSync(path.join(__dirname, 'dist', 'worker.js'));
        console.log(`📊 Worker size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`🔗 Hashed JS file: ${hashedJsFilename}`);
        console.log(`📝 Build info:`);
        console.log(`   - HTML hash: ${htmlHash}`);
        console.log(`   - JS hash: ${jsHash}`);
        console.log(`   - Cache busting: ✅ Enabled`);
        console.log(`   - Hashed files cache: 1 year`);
        console.log(`   - Non-hashed files cache: 1 hour`);
        
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