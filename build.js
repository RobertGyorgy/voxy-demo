// build.js - Build Script for Vercel/Netlify
// This script injects environment variables into the HTML at build time

const fs = require('fs');
const path = require('path');

console.log('🔧 Building VOXY AI for deployment...');

// Read the HTML file
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Inject environment variables
const apiKey = process.env.VOXY_API_KEY || '';

if (apiKey) {
  console.log('✅ Injecting API key into HTML');
  
  // Create script tag with environment variables
  const envScript = `
<script>
  // Environment variables injected at build time
  window.VOXY_API_KEY = '${apiKey}';
  console.log('🔧 Environment variables loaded from build');
</script>`;
  
  // Inject before closing </head> tag
  html = html.replace('</head>', `${envScript}\n</head>`);
} else {
  console.warn('⚠️ VOXY_API_KEY not found in environment variables');
}

// Write the modified HTML
fs.writeFileSync(htmlPath, html);

console.log('✅ Build complete!');
