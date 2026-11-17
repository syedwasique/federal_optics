const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'eyeglassimages', 'color contact lenses');
const collections = fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory());

const items = [];

for (const c of collections) {
  const cPath = path.join(baseDir, c.name);
  const shades = fs.readdirSync(cPath, { withFileTypes: true }).filter(s => s.isDirectory());
  for (const s of shades) {
    const sPath = path.join(cPath, s.name);
    const files = fs.readdirSync(sPath).filter(f => !f.startsWith('.'));
    items.push({
      collection: c.name,
      shade: s.name,
      relDir: '/eyeglassimages/color contact lenses/' + c.name + '/' + s.name,
      files: files
    });
  }
}

let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contact Lenses Visual Audit Sheet</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f1115; color: #fff; padding: 24px; margin: 0; }
    h1 { color: #d4af37; font-size: 24px; margin-bottom: 8px; }
    p { color: #888; font-size: 14px; margin-bottom: 24px; }
    .collection-header { background: #1a1e26; border-left: 4px solid #d4af37; padding: 12px 18px; margin: 32px 0 16px 0; font-size: 18px; font-weight: bold; border-radius: 4px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px; }
    .card { background: #161920; border: 1px solid #2a2e39; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .card-title { font-size: 15px; font-weight: 600; color: #f0ece1; display: flex; justify-content: space-between; align-items: center; }
    .badge { font-size: 11px; padding: 2px 8px; background: #242936; border-radius: 999px; color: #d4af37; }
    .images-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; }
    .img-box { position: relative; width: 140px; height: 140px; background: #0a0b0e; border-radius: 8px; overflow: hidden; border: 1px solid #333; flex-shrink: 0; }
    .img-box img { width: 100%; height: 100%; object-fit: cover; }
    .img-label { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); font-size: 9px; padding: 2px 4px; text-align: center; color: #ccc; truncate; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <h1>Federal Optical — Color Contact Lenses Visual Audit</h1>
  <p>Auditing all ${items.length} unique shades across 7 collections.</p>
`;

let currentColl = '';
for (const item of items) {
  if (item.collection !== currentColl) {
    if (currentColl !== '') html += '</div>';
    currentColl = item.collection;
    html += `<div class="collection-header">${currentColl}</div><div class="grid">`;
  }

  html += `
    <div class="card">
      <div class="card-title">
        <span>${item.shade}</span>
        <span class="badge">${item.files.length} images</span>
      </div>
      <div class="images-row">
  `;

  for (let i = 0; i < item.files.length; i++) {
    const f = item.files[i];
    const encodedSrc = encodeURI(item.relDir + '/' + f);
    html += `
      <div class="img-box">
        <img src="${encodedSrc}" alt="${item.shade}" loading="lazy" />
        <div class="img-label">#${i + 1}</div>
      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;
}

html += `</div></body></html>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'audit_contact_lenses.html'), html);
console.log('Generated audit_contact_lenses.html with', items.length, 'shades.');
