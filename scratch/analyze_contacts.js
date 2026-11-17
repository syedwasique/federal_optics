const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/data/products.ts', 'utf8');
const regex = /images:\s*\[([\s\S]*?)\]/g;
let match;
const samples = [];
while ((match = regex.exec(content)) !== null) {
  const list = match[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
  if (list.length > 0 && !list[0].startsWith('http')) {
    samples.push(list);
  }
}
console.log('Local images products count:', samples.length);
console.log('First 5 local image sets:', JSON.stringify(samples.slice(0, 5), null, 2));
