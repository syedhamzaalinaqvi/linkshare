// Custom build script for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Execute the regular build
console.log('🚀 Building the application...');
execSync('npm run build', { stdio: 'inherit' });

// Ensure we have a dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy the public index.html to dist as a fallback if needed
const publicIndex = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(publicIndex)) {
  console.log('📄 Copying public/index.html to dist directory as a fallback...');
  fs.copyFileSync(publicIndex, path.join(distDir, 'index.html'));
}

// Create a Vercel-specific index.js file in the root of the deployment
console.log('📝 Creating Vercel serverless entry point...');
const vercelServerContent = `
// Vercel serverless entry point
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the server app
import('./server/index.js').catch((err) => {
  console.error('Failed to import server:', err);
});

// This file ensures Vercel correctly handles both API and frontend
console.log('Serverless function initialized');
`;

fs.writeFileSync(path.join(distDir, 'vercel.js'), vercelServerContent);

console.log('✅ Build completed successfully!');