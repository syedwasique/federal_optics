const fs = require('fs');
const path = require('path');

const base = path.join(process.cwd(), 'public', 'eyeglassimages', 'color contact lenses');
const collections = fs.readdirSync(base, { withFileTypes: true }).filter(d => d.isDirectory());

const allShades = [];

for (const c of collections) {
  const cPath = path.join(base, c.name);
  const shades = fs.readdirSync(cPath, { withFileTypes: true }).filter(s => s.isDirectory());
  for (const s of shades) {
    const sPath = path.join(cPath, s.name);
    const files = fs.readdirSync(sPath).filter(f => !f.startsWith('.'));
    allShades.push({
      collection: c.name,
      shade: s.name,
      fileCount: files.length,
      files: files
    });
  }
}

console.log('Total shades found:', allShades.length);

// Group by fileCount
const counts = {};
allShades.forEach(s => {
  counts[s.fileCount] = (counts[s.fileCount] || 0) + 1;
});
console.log('File counts distribution:', counts);

// Check if any shade has less than 2 files or more than 3
const abnormal = allShades.filter(s => s.fileCount < 2 || s.fileCount > 3);
console.log('Abnormal count shades (<2 or >3):', abnormal);
