import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix fo-we101 images
fo_old = """    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop'
    ],"""

fo_new = """    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1000&auto=format&fit=crop'
    ],"""

assert fo_old in content, "Could not find fo-we101 images block"
content = content.replace(fo_old, fo_new, 1)
print("1. Fixed fo-we101")

# 2. Fix regular-tr90-pilot-matte-charcoal images (remove mismatched side image)
charcoal_old = """    images: [
      '/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-front.jpg',
      '/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-angle.jpg',
      '/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-side.jpg',
      ],"""

charcoal_new = """    images: [
      '/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-front.jpg',
      '/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-angle.jpg'
    ],"""

assert charcoal_old in content, "Could not find charcoal images block"
content = content.replace(charcoal_old, charcoal_new, 1)
print("2. Fixed regular-tr90-pilot-matte-charcoal")

# 3. Fix regular-tr90-pilot-tomfamous-black and split into 3 unique products
tomfamous_old = """  {
    id: 'regular-tr90-pilot-tomfamous-black',
    name: 'Regular TR90 Featherlight Aviator — Matte Black',
    sku: 'REG-TR90-08',
    category: 'eyeglasses',
    subCategory: "Men's Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      '/assets/images/eyeglasses/regular-tr90-pilot-tomfamous-black-front.jpg',
      '/assets/images/eyeglasses/regular-tr90-pilot-tomfamous-black-angle.jpg',
      '/assets/images/eyeglasses/regular-tr90-pilot-tomfamous-black-side.jpg',
      ],
    description: 'Featherlight 13.8-gram aviator featuring razor-thin TR-90 rims, comfortable double-bridge wire reinforcement, and soft ergonomic temples.',
    features: [
      'Featherweight 13.8-gram total frame weight',
      'Matte stealth black finish resistant to wear',
      'Engineered for medium facial widths (51-17-140)',
      'Optimal for computerized blue-ray or progressive lenses'
    ],
    inStock: true,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (51mm)',
    measurements: {
      lensWidth: 51,
      bridgeWidth: 17,
      templeLength: 140,
      frameWeight: '13.8g'
    },
    availableColors: [
      { name: 'Stealth Matte Black', hex: '#18181b' }
    ],
    reviews: []
  },"""

tomfamous_new = """  {
    id: 'regular-tr90-pilot-tomfamous-black',
    name: 'Regular TR90 Featherlight Aviator — Matte Black',
    sku: 'REG-TR90-08',
    category: 'eyeglasses',
    subCategory: "Men's Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      '/assets/images/eyeglasses/regular-tr90-pilot-tomfamous-black-front.jpg'
    ],
    description: 'Featherlight 13.8-gram aviator featuring razor-thin TR-90 rims, comfortable double-bridge wire reinforcement, and soft ergonomic temples (TR6808 51-17-140).',
    features: [
      'Model code: TR6808 51[]17-140 Tom Famous',
      'Featherweight 13.8-gram total frame weight',
      'Matte stealth black finish resistant to wear',
      'Double-bridge classic aviator architecture'
    ],
    inStock: true,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (51mm)',
    measurements: {
      lensWidth: 51,
      bridgeWidth: 17,
      templeLength: 140,
      frameWeight: '13.8g'
    },
    availableColors: [
      { name: 'Stealth Matte Black', hex: '#18181b' }
    ],
    reviews: []
  },
  {
    id: 'regular-tr90-round-tomfamous-black',
    name: 'Regular TR90 Featherlight Round — Matte Black',
    sku: 'REG-TR90-08-RND',
    category: 'eyeglasses',
    subCategory: "Men's Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      '/assets/images/eyeglasses/regular-tr90-round-tomfamous-black-front.jpg'
    ],
    description: 'Minimalist round silhouette crafted from resilient TR-90 memory polymer in clean matte black with ergonomic saddle bridge (TR6818 49-17-140).',
    features: [
      'Model code: TR6818 49[]17-140 Tom Famous',
      'Featherweight round frame: 13.5 grams',
      'Matte stealth black finish resistant to oils and sweat',
      'Balanced intellectual proportions for everyday wear'
    ],
    inStock: true,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (49mm)',
    measurements: {
      lensWidth: 49,
      bridgeWidth: 17,
      templeLength: 140,
      frameWeight: '13.5g'
    },
    availableColors: [
      { name: 'Stealth Matte Black', hex: '#18181b' }
    ],
    reviews: []
  },
  {
    id: 'regular-tr90-rect-tomfamous-black',
    name: 'Regular TR90 Featherlight Rectangle — Classic Black',
    sku: 'REG-TR90-08-RECT',
    category: 'eyeglasses',
    subCategory: "Men's Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      '/assets/images/eyeglasses/regular-tr90-rect-tomfamous-black-front.jpg'
    ],
    description: 'Modern streamlined rectangular everyday frame in high-grade flexible TR-90 polymer with comfortable wide nose bridge (TM6812 50-24-140).',
    features: [
      'Model code: TM6812 50[]24-140 Tom Famous',
      'Comfort-fit wide 24mm bridge architecture',
      'Flexible memory TR-90 temples that resist bowing and pinching',
      'Polished classic black frame body'
    ],
    inStock: true,
    frameShape: 'rectangle',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (50mm)',
    measurements: {
      lensWidth: 50,
      bridgeWidth: 24,
      templeLength: 140,
      frameWeight: '14.2g'
    },
    availableColors: [
      { name: 'Classic Black', hex: '#0a0a0a' }
    ],
    reviews: []
  },"""

assert tomfamous_old in content, "Could not find tomfamous block"
content = content.replace(tomfamous_old, tomfamous_new, 1)
print("3. Split tomfamous into 3 unique products")

# 4. Fix regular-tr90-retro-round-amber-tortoise (remove mixed black specs image) and add regular-tr90-retro-round-jet-black
amber_old = """  {
    id: 'regular-tr90-retro-round-amber-tortoise',
    name: 'Regular TR90 Retro Round — Amber Havana Tortoise',
    sku: 'REG-TR90-12',
    category: 'eyeglasses',
    subCategory: "Men's Eyeglasses",
    gender: 'men',
    brand: 'Federal Atelier',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      '/assets/images/eyeglasses/regular-tr90-retro-round-amber-tortoise-front.jpg',
      '/assets/images/eyeglasses/regular-tr90-retro-round-amber-tortoise-angle.jpg',
      '/assets/images/eyeglasses/regular-tr90-retro-round-amber-tortoise-side.jpg',
      '/assets/images/eyeglasses/regular-tr90-retro-round-amber-tortoise-specs.jpg'
    ],
    description: 'Vintage-inspired rounded frame with warm amber mottled tortoise acetate texture and flexible TR-90 memory core.',
    features: [
      'Rich amber havana tortoiseshell pattern',
      'Includes temple laser inscription close-up',
      'Featherlight weight: 15.2 grams',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    isBestSeller: false,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (50mm)',
    measurements: { lensWidth: 50, bridgeWidth: 19, templeLength: 140, frameWeight: '15.2g' },
    availableColors: [{ name: 'Amber Havana Tortoise', hex: '#78350f' }],
    reviews: []
  },"""

amber_new = """  {
    id: 'regular-tr90-retro-round-amber-tortoise',
    name: 'Regular TR90 Retro Round — Amber Havana Tortoise',
    sku: 'REG-TR90-12',
    category: 'eyeglasses',
    subCategory: "Men's Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      '/assets/images/eyeglasses/regular-tr90-retro-round-amber-tortoise-front.jpg',
      '/assets/images/eyeglasses/regular-tr90-retro-round-amber-tortoise-angle.jpg',
      '/assets/images/eyeglasses/regular-tr90-retro-round-amber-tortoise-side.jpg'
    ],
    description: 'Vintage-inspired rounded frame with warm amber mottled tortoise acetate texture and flexible TR-90 memory core (TR6805 50-20-145).',
    features: [
      'Model code: TR6805 50[]20-145',
      'Rich amber havana tortoiseshell pattern',
      'Featherlight weight: 15.2 grams',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    isBestSeller: false,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (50mm)',
    measurements: { lensWidth: 50, bridgeWidth: 19, templeLength: 140, frameWeight: '15.2g' },
    availableColors: [{ name: 'Amber Havana Tortoise', hex: '#78350f' }],
    reviews: []
  },
  {
    id: 'regular-tr90-retro-round-jet-black',
    name: 'Regular TR90 Retro Round — Solid Jet Black',
    sku: 'REG-TR90-RND-BLK',
    category: 'eyeglasses',
    subCategory: "Men's Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      '/assets/images/eyeglasses/regular-tr90-retro-round-jet-black-front.jpg'
    ],
    description: 'Vintage-inspired rounded silhouette in high-density TR-90 memory polymer with deep jet black finish and keyhole bridge (TR6805 50-20-145).',
    features: [
      'Model code: TR6805 50[]20-145',
      'Solid jet black polish with keyhole bridge',
      'Flexible lightweight memory temples',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (50mm)',
    measurements: { lensWidth: 50, bridgeWidth: 20, templeLength: 145, frameWeight: '15.0g' },
    availableColors: [{ name: 'Jet Black', hex: '#0a0a0a' }],
    reviews: []
  },"""

assert amber_old in content, "Could not find amber_old block"
content = content.replace(amber_old, amber_new, 1)
print("4. Fixed amber tortoise and added jet black round")

# 5. For all other regular-tr90 products from navigator to horn-rim, set brand: 'Regular Frames'
# Let's find all regular-tr90 blocks with brand: 'Federal Atelier'
pattern = r"(id:\s*'regular-tr90-[^']+'[\s\S]*?brand:\s*)'Federal Atelier'"
matches = list(re.finditer(pattern, content))
print(f"5. Found {len(matches)} regular-tr90 products with brand 'Federal Atelier'")
content = re.sub(pattern, r"\1'Regular Frames'", content)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated src/data/products.ts successfully!")
