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
  } catch (e) {}
  return null;
}

const baseDir = path.join(process.cwd(), 'public', 'eyeglassimages', 'color contact lenses');
const collections = fs.readdirSync(baseDir).filter(d => fs.statSync(path.join(baseDir, d)).isDirectory());

const results = [];

for (const c of collections) {
  const cPath = path.join(baseDir, c);
  const shades = fs.readdirSync(cPath).filter(s => fs.statSync(path.join(cPath, s)).isDirectory());

  for (const s of shades) {
    const sPath = path.join(cPath, s);
    const files = fs.readdirSync(sPath).filter(f => !f.startsWith('.'));
    
    const fileInfos = files.map(f => {
      const full = path.join(sPath, f);
      const dim = getJpegDimensions(full) || { width: 0, height: 0 };
      const size = fs.statSync(full).size;
      return { file: f, width: dim.width, height: dim.height, size };
    });

    let lensFile = null;
    let modelFiles = [];

    if (c.toLowerCase().includes('optiano')) {
      // In Optiano:
      // The lens image is always the 1080x1200 one!
      // The model image is always 908x1280 (or m.jpeg)
      lensFile = fileInfos.find(f => f.width === 1080 && f.height === 1200) || fileInfos[0];
      modelFiles = fileInfos.filter(f => f !== lensFile);
    } else {
      // In Bella:
      // Lens image is the macro eye. Notice:
      // 1) Any file without (1) or (2), or highest size among 1000x1000, or specifically macro eye.
      // Let's sort by size or specific patterns.
      // In Bella, lens images typically have larger size because of the macro eye texture (125k-180k).
      // Model images are often smaller or have (1) or (2) or 683x1024 / 1000x800.
      
      // Let's identify model files first:
      const portraitOrBanner = fileInfos.filter(f => (f.width === 683 && f.height === 1024) || (f.width === 1000 && f.height === 800));
      const squareFiles = fileInfos.filter(f => !portraitOrBanner.includes(f));
      
      if (squareFiles.length === 1) {
        lensFile = squareFiles[0];
        modelFiles = [...portraitOrBanner];
      } else if (squareFiles.length === 2) {
        // One is lens, one is model. The lens has higher byte size in all Bella sets!
        squareFiles.sort((a, b) => b.size - a.size);
        lensFile = squareFiles[0];
        modelFiles = [squareFiles[1], ...portraitOrBanner];
      } else {
        // 3 square files: lens is highest size
        squareFiles.sort((a, b) => b.size - a.size);
        lensFile = squareFiles[0];
        modelFiles = [...squareFiles.slice(1), ...portraitOrBanner];
      }
    }

    results.push({
      collection: c,
      shade: s,
      relDir: '/eyeglassimages/color contact lenses/' + c + '/' + s,
      lens: lensFile.file,
      models: modelFiles.map(m => m.file)
    });
  }
}

// Generate an audit sheet to verify every single one!
let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lens First & Model Second Verification</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f1115; color: #fff; padding: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .card { background: #181b22; border: 1px solid #333; border-radius: 8px; padding: 12px; }
    .title { font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #d4af37; }
    .pair { display: flex; gap: 8px; }
    .box { flex: 1; text-align: center; }
    .box img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; border: 2px solid #444; }
    .box.lens img { border-color: #10b981; }
    .box.model img { border-color: #3b82f6; }
    .box-label { font-size: 10px; margin-top: 4px; font-weight: 600; }
    .lens-label { color: #10b981; }
    .model-label { color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Verification Sheet: LENS Image (Green / 1st) vs MODEL Image (Blue / 2nd)</h1>
  <div class="grid">
`;

for (const r of results) {
  html += `
    <div class="card">
      <div class="title">${r.shade}</div>
      <div class="pair">
        <div class="box lens">
          <img src="${encodeURI(r.relDir + '/' + r.lens)}" />
          <div class="box-label lens-label">1. LENS (Card View)</div>
        </div>
        <div class="box model">
          <img src="${encodeURI(r.relDir + '/' + r.models[0])}" />
          <div class="box-label model-label">2. MODEL (Hover View)</div>
        </div>
      </div>
    </div>
  `;
}

html += `</div></body></html>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'verify_lens_model_order.html'), html);
fs.writeFileSync(path.join(process.cwd(), 'scratch', 'verified_order.json'), JSON.stringify(results, null, 2));
console.log('Generated verify_lens_model_order.html with', results.length, 'shades.');
