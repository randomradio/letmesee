#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Just copy files to root for simple deployment
const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');

fs.writeFileSync('index.html', htmlContent);
fs.writeFileSync('app.js', jsContent);

console.log('✅ Files copied to root directory');
console.log('📁 index.html and app.js are ready');