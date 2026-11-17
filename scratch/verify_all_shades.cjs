const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'eyeglassimages', 'color contact lenses');
const collections = fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory());

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function cleanShadeName(shadeFolder) {
  let name = shadeFolder;
  name = name.replace(/BELLA\s+DAIMONDS?\s*/i, '');
  name = name.replace(/RS\s*\d+/i, '');
  name = name.replace(/DAIMOND/gi, 'Diamond');
  name = name.replace(/ELLITE/gi, 'Elite');
  name = name.replace(/QUALTIY/gi, 'Quality');
  name = name.trim();
  return titleCase(name);
}

function determineLensColor(shadeName) {
  const lower = shadeName.toLowerCase();
  if (lower.includes('blue') || lower.includes('topaz') || lower.includes('aqua') || lower.includes('turquoise') || lower.includes('breeze')) {
    return 'Blue';
  }
  if (lower.includes('green') || lower.includes('olive') || lower.includes('lime') || lower.includes('jade') || lower.includes('leaf')) {
    return 'Green';
  }
  if (lower.includes('gray') || lower.includes('grey') || lower.includes('cloud') || lower.includes('mist') || lower.includes('silver') || lower.includes('stone') || lower.includes('pearl')) {
    return 'Grey';
  }
  if (lower.includes('violet') || lower.includes('purple') || lower.includes('lavender')) {
    return 'Violet';
  }
  if (lower.includes('hazel') || lower.includes('brown') || lower.includes('honey') || lower.includes('caramel') || lower.includes('cinnamon') || lower.includes('sepia') || lower.includes('oak') || lower.includes('wood') || lower.includes('gold') || lower.includes('blonde')) {
    return 'Hazel';
  }
  return 'Hazel';
}

const audit = [];

for (const c of collections) {
  const cPath = path.join(baseDir, c.name);
  const shades = fs.readdirSync(cPath, { withFileTypes: true }).filter(s => s.isDirectory());
  for (const s of shades) {
    const sPath = path.join(cPath, s.name);
    const files = fs.readdirSync(sPath).filter(f => !f.startsWith('.'));
    const clean = cleanShadeName(s.name);
    const color = determineLensColor(clean);
    audit.push({
      collection: c.name,
      rawShade: s.name,
      cleanShade: clean,
      lensColor: color,
      fileCount: files.length,
      files: files
    });
  }
}

console.log('Total verified shades:', audit.length);
audit.forEach((a, i) => {
  console.log(`${i + 1}. [${a.collection}] ${a.cleanShade} -> ${a.lensColor} (${a.fileCount} files)`);
});
