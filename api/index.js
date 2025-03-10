// This file serves as an entry point for Vercel serverless functions
const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Point to the built server file
const serverPath = path.join(process.cwd(), 'server/index.ts');

// Create a redirect to the main server file
module.exports = async (req, res) => {
  // Dynamically import the server (TypeScript file)
  try {
    // For API routes, use the server
    if (req.url.startsWith('/api/')) {
      // This will be handled by our main server/index.ts
      require('tsx/cli')(serverPath);
      return;
    }
    
    // For all other routes, serve the static files
    const staticDir = path.join(process.cwd(), 'dist');
    const publicDir = path.join(process.cwd(), 'public');
    
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Try to find the file in the dist directory first
    let filePath = path.join(staticDir, pathname === '/' ? 'index.html' : pathname);
    
    if (!fs.existsSync(filePath)) {
      // If not found, check in public directory
      filePath = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);
    }
    
    if (fs.existsSync(filePath)) {
      const contentType = getContentType(filePath);
      const content = fs.readFileSync(filePath);
      
      res.setHeader('Content-Type', contentType);
      res.statusCode = 200;
      res.end(content);
    } else {
      // Fallback to index.html for SPA routing
      const indexPath = path.join(staticDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath);
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(content);
      } else {
        // If no index.html exists in dist, try public
        const publicIndexPath = path.join(publicDir, 'index.html');
        if (fs.existsSync(publicIndexPath)) {
          const content = fs.readFileSync(publicIndexPath);
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.end(content);
        } else {
          res.statusCode = 404;
          res.end('File not found');
        }
      }
    }
  } catch (err) {
    console.error('Error handling request:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};

// Helper function to determine content type
function getContentType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };
  
  return contentTypes[extname] || 'application/octet-stream';
}