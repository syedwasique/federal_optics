const fs = require('fs');
const path = require('path');

// Let's inspect the files in each folder
const baseDir = path.join(process.cwd(), 'public', 'eyeglassimages', 'color contact lenses');
const collections = fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory());

for (const c of collections) {
  console.log('\n=== COLLECTION: ' + c.name + ' ===');
  const cPath = path.join(baseDir, c.name);
  const shades = fs.readdirSync(cPath, { withFileTypes: true }).filter(s => s.isDirectory());
  for (const s of shades) {
    const sPath = path.join(cPath, s.name);
    const files = fs.readdirSync(sPath).filter(f => !f.startsWith('.')).sort();
    console.log(s.name + ' -> files: ' + files.join(' | '));
  }
}
