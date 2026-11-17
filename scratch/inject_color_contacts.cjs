const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'eyeglassimages', 'color contact lenses');
const collections = fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory());

const guideImages = [
  '/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpeg',
  '/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpeg',
  '/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpeg'
];

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

function getHexForShade(shadeName, lensColor) {
  const lower = shadeName.toLowerCase();
  if (lower.includes('blue') || lower.includes('topaz') || lower.includes('aqua') || lower.includes('turquoise')) return '#0284c7';
  if (lower.includes('emerald') || lower.includes('green') || lower.includes('jade')) return '#15803d';
  if (lower.includes('olive')) return '#4d7c0f';
  if (lower.includes('lime')) return '#65a30d';
  if (lower.includes('dark gray') || lower.includes('dark grey')) return '#475569';
  if (lower.includes('silver') || lower.includes('pearl') || lower.includes('cloud')) return '#94a3b8';
  if (lower.includes('gray') || lower.includes('grey') || lower.includes('mist')) return '#64748b';
  if (lower.includes('violet') || lower.includes('purple')) return '#7c3aed';
  if (lower.includes('lavender')) return '#a855f7';
  if (lower.includes('honey') || lower.includes('gold') || lower.includes('blonde')) return '#d97706';
  if (lower.includes('caramel') || lower.includes('cinnamon')) return '#b45309';
  if (lower.includes('brown') || lower.includes('sepia') || lower.includes('oak')) return '#78350f';
  if (lower.includes('hazel')) return '#a16207';
  if (lensColor === 'Blue') return '#0284c7';
  if (lensColor === 'Green') return '#15803d';
  if (lensColor === 'Grey') return '#64748b';
  return '#a16207';
}

const products = [];

for (const c of collections) {
  const cName = c.name;
  const cPath = path.join(baseDir, cName);
  
  let brand = 'Bella';
  let subCategory = '';
  let price = 4800;
  let originalPrice = 6000;
  let skuPrefix = 'BL';
  let waterContent = '38%';
  let diameter = '14.5 mm';
  let origin = 'Designed in Lebanon / UAE';
  let descriptionTemplate = '';

  if (cName.includes('BELLA DAIMOND')) {
    brand = 'Bella';
    subCategory = 'Bella Diamond Collection';
    price = 5300;
    originalPrice = 6500;
    skuPrefix = 'BL-DIA';
    descriptionTemplate = 'Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.';
  } else if (cName.includes('BELLA ELLITE')) {
    brand = 'Bella';
    subCategory = 'Bella Elite Collection';
    price = 5450;
    originalPrice = 6800;
    skuPrefix = 'BL-ELT';
    descriptionTemplate = 'Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.';
  } else if (cName.includes('BELLA GLOW')) {
    brand = 'Bella';
    subCategory = 'Bella Glow Collection';
    price = 4800;
    originalPrice = 6000;
    skuPrefix = 'BL-GLW';
    descriptionTemplate = 'High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.';
  } else if (cName.includes('Bella Natural')) {
    brand = 'Bella';
    subCategory = 'Bella Natural Collection';
    price = 4800;
    originalPrice = 6000;
    skuPrefix = 'BL-NAT';
    descriptionTemplate = 'Two-tone natural pigment blending that integrates seamlessly with your eye depth. Soft contrast outer ring creates effortless, natural sophistication.';
  } else if (cName.includes('OPTIANO GORGEOUS')) {
    brand = 'Optiano';
    subCategory = 'Optiano Gorgeous Collection';
    price = 3850;
    originalPrice = 4800;
    skuPrefix = 'OPT-GOR';
    waterContent = '40%';
    diameter = '14.5 mm';
    origin = 'Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)';
    descriptionTemplate = 'Premium Korean cosmetic lenses featuring rich gradient transitions and soft contouring. Globally safety approved with medical-grade Korean hydrogel for long-lasting hydration.';
  } else if (cName.includes('OPTIANO Glamorous')) {
    brand = 'Optiano';
    subCategory = 'Optiano Glamorous Collection';
    price = 3450;
    originalPrice = 4400;
    skuPrefix = 'OPT-GLM';
    waterContent = '40%';
    diameter = '14.5 mm';
    origin = 'Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)';
    descriptionTemplate = 'Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.';
  } else if (cName.includes('OPTIANO HIGH QUALITY')) {
    brand = 'Optiano';
    subCategory = 'Optiano Classic Collection';
    price = 3000;
    originalPrice = 3800;
    skuPrefix = 'OPT-CLS';
    waterContent = '40%';
    diameter = '14.2 mm';
    origin = 'Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)';
    descriptionTemplate = 'High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.';
  }

  const shades = fs.readdirSync(cPath, { withFileTypes: true }).filter(s => s.isDirectory());
  let shadeIdx = 1;

  for (const s of shades) {
    const sName = s.name;
    const sPath = path.join(cPath, sName);
    const files = fs.readdirSync(sPath).filter(f => !f.startsWith('.'));
    
    // Model image first, followed by macro eye, followed by alternate model
    files.sort((a, b) => {
      const aIsModel = a.includes('(1)') || a === 'm.jpeg';
      const bIsModel = b.includes('(1)') || b === 'm.jpeg';
      if (aIsModel && !bIsModel) return -1;
      if (!aIsModel && bIsModel) return 1;
      return a.localeCompare(b);
    });

    const relFilePaths = files.map(f => `/eyeglassimages/color contact lenses/${cName}/${sName}/${f}`);
    const allImages = [...relFilePaths, ...guideImages];

    const cleanShade = cleanShadeName(sName);
    const lensColor = determineLensColor(cleanShade);
    const hex = getHexForShade(cleanShade, lensColor);
    const skuCode = `${skuPrefix}-${String(shadeIdx).padStart(2, '0')}`;
    const id = `${skuPrefix.toLowerCase()}-${cleanShade.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    products.push({
      id,
      name: `${subCategory.replace(' Collection', '')} — ${cleanShade}`,
      sku: skuCode,
      category: 'color-contacts',
      subCategory,
      gender: 'unisex',
      brand,
      price,
      originalPrice,
      rating: 0,
      reviewCount: 0,
      images: allImages,
      description: `${cleanShade} shade from the ${subCategory}. ${descriptionTemplate}`,
      features: [
        'Quarterly 3-Month comfortable wear cycle',
        `High moisture retention (${waterContent}) hydrophilic hydrogel`,
        `Base Curve: 8.6 mm | Diameter: ${diameter}`,
        origin,
        'Includes Federal Optical sterile lens case & guide instructions'
      ],
      inStock: true,
      disposability: 'three-month',
      lensColor,
      availableColors: [
        { name: cleanShade, hex }
      ],
      reviews: []
    });
    shadeIdx++;
  }
}

// Convert products to TypeScript string
function productToTs(p) {
  return `  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    sku: ${JSON.stringify(p.sku)},
    category: 'color-contacts',
    subCategory: ${JSON.stringify(p.subCategory)},
    gender: 'unisex',
    brand: ${JSON.stringify(p.brand)},
    price: ${p.price},
    originalPrice: ${p.originalPrice},
    rating: 0,
    reviewCount: 0,
    images: ${JSON.stringify(p.images, null, 6).replace(/\n\s*\]/, '\n    ]')},
    description: ${JSON.stringify(p.description)},
    features: ${JSON.stringify(p.features, null, 6).replace(/\n\s*\]/, '\n    ]')},
    inStock: true,
    disposability: 'three-month',
    lensColor: ${JSON.stringify(p.lensColor)},
    availableColors: [
      { name: ${JSON.stringify(p.availableColors[0].name)}, hex: ${JSON.stringify(p.availableColors[0].hex)} }
    ],
    reviews: []
  }`;
}

const tsCode = products.map(productToTs).join(',\n');
fs.writeFileSync(path.join(process.cwd(), 'scratch', 'color_contacts_block.ts'), tsCode);
console.log('Generated color_contacts_block.ts successfully with', products.length, 'products.');
