const fs = require('fs');
const path = require('path');

function getJpegDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xFF) break;
      const marker = buffer[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height };
      }
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  } catch (e) {
    return null;
  }
  return null;
}

const base = path.join(process.cwd(), 'public', 'eyeglassimages', 'color contact lenses');
const collections = fs.readdirSync(base, { withFileTypes: true }).filter(d => d.isDirectory());

const samples = [];
for (const c of collections) {
  const cPath = path.join(base, c.name);
  const shades = fs.readdirSync(cPath, { withFileTypes: true }).filter(s => s.isDirectory());
  for (const s of shades) {
    const sPath = path.join(cPath, s.name);
    const files = fs.readdirSync(sPath).filter(f => !f.startsWith('.'));
    const fileInfos = files.map(f => {
      const dim = getJpegDimensions(path.join(sPath, f));
      return { file: f, ...dim };
    });
    samples.push({
      collection: c.name,
      shade: s.name,
      files: fileInfos
    });
  }
}

// Print sample dimensions
console.log('Sample dimensions for first 15:');
samples.slice(0, 15).forEach(s => {
  console.log(s.collection + ' -> ' + s.shade);
  s.files.forEach(f => console.log('   ' + f.width + 'x' + f.height + ' | ' + f.file));
});
