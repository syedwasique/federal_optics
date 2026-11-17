const fs = require('fs');

const content = fs.readFileSync('src/data/products.ts', 'utf8');
const regex = /images:\s*\[([\s\S]*?)\]/g;
let match;
const prefixes = new Set();
while ((match = regex.exec(content)) !== null) {
  const list = match[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
  for (const img of list) {
    if (img.startsWith('/')) {
      const parts = img.split('/');
      prefixes.add(parts.slice(0, 3).join('/'));
    }
  }
}
console.log('Unique local image prefixes:', Array.from(prefixes));
