export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating?: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface ProductVariantColor {
  id?: string;
  name: string;
  hex: string;
  image?: string;
  images?: string[];
  sku?: string;
}

export interface FrameMeasurements {
  lensWidth: number; // e.g. 52 mm
  bridgeWidth: number; // e.g. 18 mm
  templeLength: number; // e.g. 145 mm
  frameWeight?: string; // e.g. "18.5g (Ultra-Light)"
}

export type ProductCategory = 
  | 'eyeglasses' 
  | 'sunglasses' 
  | 'tint-eyeglasses' 
  | 'clear-contacts' 
  | 'color-contacts' 
  | 'accessories';

export type ProductGender = 'men' | 'women' | 'unisex' | 'kids';

export type FrameShape = 'aviator' | 'cat-eye' | 'round' | 'square' | 'rectangle' | 'rectangular' | 'browline' | 'geometric' | 'wrap';

export type LensDisposability = 'daily' | 'monthly' | 'three-month' | 'six-month' | 'yearly';

export type RimType = 'Full Rim' | 'Semi-Rimless' | 'Rimless';

export interface ProductPackOption {
  id: string;
  name: string;
  price: number; // PKR
  savingsBadge?: string;
}

export interface Product {
  id: string;
  aliases?: string[];
  name: string;
  sku: string;
  category: ProductCategory;
  subCategory: string;
  gender: ProductGender;
  brand: string;
  price: number; // PKR
  originalPrice?: number; // PKR
  rating?: number;
  reviewCount?: number;
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  frameShape?: FrameShape;
  frameMaterial?: string;
  rimType?: RimType;
  frameSize?: string;
  measurements?: FrameMeasurements;
  disposability?: LensDisposability;
  lensColor?: string;
  availableColors: ProductVariantColor[];
  packOptions?: ProductPackOption[];
  isToric?: boolean;
  lensWaterContent?: string;
  lensDiameter?: string;
  lensBaseCurve?: string;
  lensPowerRange?: string;
  reviews?: ProductReview[];
}

export function matchesCollectionSubCategory(product: Product, subCategory?: string): boolean {
  if (!subCategory || subCategory === 'all') return true;
  const subLower = subCategory.toLowerCase();
  const pSub = product.subCategory.toLowerCase();
  const pName = product.name.toLowerCase();

  // Generic labels that just name the whole department ("Color Contact Lenses",
  // "Clear Contact Lenses", "Eyeglasses"...) - the category filter already applies
  if (/^(all |view all )?(colou?r |clear )?(contact lenses|contacts|eyeglasses|sunglasses)$/.test(subLower)) return true;

  // Gender collections. Women’s must be checked first: "women’s" contains "men’s".
  if (/\bwom[ae]n\b|\bladies\b/.test(subLower)) {
    return product.gender === 'women' || product.gender === 'unisex';
  }
  if (/\bmen\b|\bgents\b/.test(subLower)) {
    return product.gender === 'men' || product.gender === 'unisex';
  }
  if (subLower.includes("kid") || subLower.includes("children") || subLower.includes("teen")) {
    return product.gender === 'kids' || pSub.includes('kid') || pSub.includes('teen');
  }
  if (subLower.includes("active") || subLower.includes("sport")) {
    return pSub.includes('active') || pSub.includes('sport') ||
           pName.includes('active') || pName.includes('sport') ||
           product.frameShape === 'wrap';
  }
  // An exact product sub-category (e.g. a colour-lens collection)
  if (pSub === subLower) return true;
  if (subLower.includes("toric") || subLower.includes("astigmatism")) {
    return product.isToric === true || pSub.includes('toric') ||
           pName.includes('toric') || pName.includes('astigmatism');
  }
  // "Lens Care" = solutions & lens-care products only
  if (subLower.includes("lens care") || subLower.includes("solution")) {
    return pSub.includes('care') || pSub.includes('solution') ||
           pName.includes('solution') || pName.includes('cleaner');
  }
  // "Accessories" = everything in the accessories range
  if (subLower.includes("accessor") || subLower.includes("care")) {
    return product.category === 'accessories';
  }

  return pSub.includes(subLower) || pName.includes(subLower);
}

export interface LensPackageOption {
  id: string;
  name: string;
  price: number; // PKR
  badge?: string;
  description: string;
  features: string[];
}

/** Lens technology packages (blue cut, photosun…) apply to optical frames only —
 *  not to sunglasses, contact lenses or accessories. */
export function takesLensPackage(product: Pick<Product, 'category'>): boolean {
  return product.category === 'eyeglasses' || product.category === 'tint-eyeglasses';
}

export const LENS_PACKAGE_OPTIONS: LensPackageOption[] = [
  {
    id: 'blue-cut-green',
    name: 'Blue Cut Green Coating',
    price: 950,
    badge: 'Popular',
    description: 'Standard anti-reflective green coating with computer blue-light filter for daily screen protection.',
    features: ['Anti-reflective green coating', 'UV400 & digital screen filter', 'Scratch-resistant hard coat']
  },
  {
    id: 'blue-cut-blue',
    name: 'Blue Cut Blue coating',
    price: 1400,
    badge: 'Enhanced Shield',
    description: 'Premium blue reflection coating with enhanced blue-light absorption for heavy digital screen use.',
    features: ['High-clarity blue AR coating', 'Enhanced HEV blue-light block', 'Hydrophobic & smudge shield']
  },
  {
    id: 'transaction-photosun',
    name: 'Transaction (photosun)',
    price: 1450,
    badge: 'Light-Adaptive',
    description: 'Photochromic lenses that stay clear indoors and darken automatically into sunglasses outdoors in sunlight.',
    features: ['Rapid UV-reactive darkening reaction', '100% UVA/UVB Category 3 sun protection', 'Indoor clarity to outdoor dark tint']
  },
  {
    id: 'drive-safe-5in1',
    name: 'Drive Safe Lens 5 in 1',
    price: 2450,
    badge: '5-in-1 Premium',
    description: 'Advanced 5-in-1 optics: night driving anti-glare, blue cut, anti-reflection, UV400, and oleophobic smudge guard.',
    features: ['Night driving headlight anti-glare', 'Computer blue-light shield', 'Water, dust & oil repellent', 'Ultra-tough scratch resistance', 'High-definition clarity']
  },
  {
    id: 'custom-tech-whatsapp',
    name: 'Custom Tech Lens',
    price: 0,
    badge: 'WhatsApp Order',
    description: 'Want progressive, bifocal, or custom high-index lenses? Mention your requirements upon WhatsApp order.',
    features: ['Progressive & bifocal multi-focals', 'High-index ultra-thin lenses', 'Direct optometrist consultation on WhatsApp']
  }
];

export const PRODUCTS: Product[] = [
  
  
  {
    id: 'stepper-2021-espresso-brown',
    aliases: ['stepper-2021-honey-amber-fade', 'stepper-2021-crystal-clear', 'stepper-2021-smoke-grey-fade', 'stepper-2021-midnight-blue-fade', 'stepper-2021-ice-crystal-fade'],
    name: 'STEPPER Germany 2021 TX5 Aviator',
    sku: 'STP-2021',
    category: 'eyeglasses',
    subCategory: "Women’s Eyeglasses",
    gender: 'women',
    brand: 'STEPPER Germany',
    price: 4250,
    originalPrice: 5800,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-espresso-brown-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-espresso-brown-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-espresso-brown-side.jpg',
      ],
    description: "Engineered in Germany with STEPPER’s patented TX5 polyamide and featherweight beta-titanium. Finished in a warm espresso brown ombré that transitions into lustrous rose-gold temples.",
    features: [
      'German patented TX5 ultra-light, hypoallergenic polyamide',
      'Aerospace-grade Beta-Titanium temples with 3D sculpted flex',
      'Precision anatomical bridge with 0-pressure nose contact',
      'Corrosion-proof, skin-friendly, sweat-resistant German engineering'
    ],
    inStock: true,
    isNew: false,
    frameShape: 'aviator',
    frameMaterial: 'TX5 & Beta-Titanium',
    rimType: 'Full Rim',
    frameSize: 'Medium (55mm)',
    measurements: {
      lensWidth: 55,
      bridgeWidth: 19,
      templeLength: 145,
      frameWeight: '14.2g'
    },
    availableColors: [
      {
        id: 'stepper-2021-espresso-brown',
        name: 'Espresso & Rose',
        hex: '#3e2723',
        sku: 'STP-2021-C03',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-espresso-brown-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-espresso-brown-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-espresso-brown-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-espresso-brown-side.jpg'
        ]
      },
      {
        id: 'stepper-2021-honey-amber-fade',
        name: 'Amber Gold Fade',
        hex: '#c47f27',
        sku: 'STP-2021-C01',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-honey-amber-fade-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-honey-amber-fade-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-honey-amber-fade-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-honey-amber-fade-side.jpg'
        ]
      },
      {
        id: 'stepper-2021-crystal-clear',
        name: 'Crystal Clear',
        hex: '#e5e7eb',
        sku: 'STP-2021-C04',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-crystal-clear-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-crystal-clear-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-crystal-clear-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/stepper-2021-crystal-clear-side.jpg'
        ]
      },
      {
        id: 'stepper-2021-smoke-grey-fade',
        name: 'Smoke Grey Ombré',
        hex: '#4b5563',
        sku: 'STP-2021-C02',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-2021-smoke-grey-fade-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-2021-smoke-grey-fade-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-2021-smoke-grey-fade-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-2021-smoke-grey-fade-side.jpg'
        ]
      },
      {
        id: 'stepper-2021-midnight-blue-fade',
        name: 'Midnight Blue Ombré',
        hex: '#1e3a8a',
        sku: 'STP-2021-C05',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-midnight-blue-fade-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-midnight-blue-fade-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-midnight-blue-fade-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-2021-midnight-blue-fade-side.jpg'
        ]
      },
      {
        id: 'stepper-2021-ice-crystal-fade',
        name: 'Ice Crystal Fade',
        hex: '#374151',
        sku: 'STP-2021-C06',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-ice-crystal-fade-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-ice-crystal-fade-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-ice-crystal-fade-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374943/federal-optics/assets/images/eyeglasses/stepper-2021-ice-crystal-fade-side.jpg'
        ]
      },
    ],
    reviews: []
  },
  
  
  {
    id: 'stepper-rect-classic-matte-black',
    aliases: [
      "stepper-rect-titanium-graphite-grey",
      "stepper-rect-exec-midnight-navy",
      "stepper-rect-urban-bronze-tortoise"
    ],
    name: 'STEPPER Germany Titanium Rectangle',
    sku: 'STP-RECT',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'STEPPER Germany',
    price: 4250,
    originalPrice: 5800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-classic-matte-black-front.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-classic-matte-black-angle.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-classic-matte-black-side.jpg"
    ],
    description: 'Ultra-refined executive rectangular silhouette with German precision titanium engineering, ergonomic nose pads, and lightweight matte black finish.',
    features: [
      'High-grade German TX5 & Beta-Titanium construction',
      'Clean rectangular architectural profile for executive and daily wear',
      'Featherweight zero-pressure ergonomic comfort bridge',
      'Corrosion-resistant satin matte black finish'
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'rectangle',
    frameMaterial: 'TX5 & Beta-Titanium',
    rimType: 'Full Rim',
    frameSize: 'Medium (53mm)',
    measurements: { lensWidth: 53, bridgeWidth: 17, templeLength: 142, frameWeight: '13.8g' },
    availableColors: [
      {
        id: "stepper-rect-classic-matte-black",
        name: "Classic Matte Black",
        hex: "#1c1917",
        sku: "STP-RECT-01",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-classic-matte-black-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-classic-matte-black-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-classic-matte-black-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-classic-matte-black-side.jpg"
        ]
      },
      {
        id: "stepper-rect-titanium-graphite-grey",
        name: "Brushed Graphite Grey",
        hex: "#4b5563",
        sku: "STP-RECT-02",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-titanium-graphite-grey-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-titanium-graphite-grey-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-titanium-graphite-grey-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-titanium-graphite-grey-side.jpg"
        ]
      },
      {
        id: "stepper-rect-exec-midnight-navy",
        name: "Black Crystal Fade",
        hex: "#3a3a3a",
        sku: "STP-RECT-03",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-exec-midnight-navy-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-exec-midnight-navy-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-exec-midnight-navy-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-exec-midnight-navy-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374944/federal-optics/assets/images/eyeglasses/stepper-rect-exec-midnight-navy-specs.jpg"
        ]
      },
      {
        id: "stepper-rect-urban-bronze-tortoise",
        name: "Dark Amber & Bronze",
        hex: "#78350f",
        sku: "STP-RECT-04",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-urban-bronze-tortoise-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-urban-bronze-tortoise-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-urban-bronze-tortoise-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-urban-bronze-tortoise-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374945/federal-optics/assets/images/eyeglasses/stepper-rect-urban-bronze-tortoise-specs.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'adidas-2041-black-teal',
    aliases: ['adidas-2041-crystal', 'adidas-2041-smoke-grey', 'adidas-2041-marine-blue'],
    name: 'Adidas Originals Sport 2041',
    sku: 'ADI-2041',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Adidas Originals',
    price: 4250,
    originalPrice: 5800,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-specs.jpg'
    ],
    description: 'Sport-performance active navigator frame featuring a modern squared aviator browline, dynamic black to emerald teal fade, and non-slip rubberized temple tips with iconic 3-Stripes branding.',
    features: [
      'High-performance TR90 sport composite construction',
      'Anti-slip ribbed temple tips engineered for athletic grip',
      'Double-bar sport navigator bridge for aerodynamic structural rigidity',
      'Detailed temple laser specifications: 53-17-142'
    ],
    inStock: true,
    isBestSeller: false,
    isNew: false,
    frameShape: 'square',
    frameMaterial: 'TR90 Sport Polymer',
    rimType: 'Full Rim',
    frameSize: 'Medium (53mm)',
    measurements: {
      lensWidth: 53,
      bridgeWidth: 17,
      templeLength: 142,
      frameWeight: '17.5g'
    },
    availableColors: [
      {
        id: 'adidas-2041-black-teal',
        name: 'Black & Emerald Teal',
        hex: '#0f766e',
        sku: 'ADI-2041-C43',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-side.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-black-teal-specs.jpg'
        ]
      },
      {
        id: 'adidas-2041-crystal',
        name: 'Crystal Clear & Onyx',
        hex: '#f3f4f6',
        sku: 'ADI-2041-C41',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-crystal-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-crystal-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-crystal-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/eyeglasses/adidas-2041-crystal-side.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-crystal-specs.jpg'
        ]
      },
      {
        id: 'adidas-2041-smoke-grey',
        name: 'Translucent Smoke Grey',
        hex: '#4b5563',
        sku: 'ADI-2041-C42',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-smoke-grey-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-smoke-grey-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-smoke-grey-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-smoke-grey-side.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-smoke-grey-specs.jpg'
        ]
      },
      {
        id: 'adidas-2041-marine-blue',
        name: 'Translucent Marine Blue',
        hex: '#1d4ed8',
        sku: 'ADI-2041-C65',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-marine-blue-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-marine-blue-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-marine-blue-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-marine-blue-side.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/adidas-2041-marine-blue-specs.jpg'
        ]
      },
    ],
    reviews: []
  },
  
  {
    id: 'regular-tr90-pilot-black-silver',
    aliases: [
      "regular-tr90-pilot-black-gold",
      "regular-tr90-pilot-matte-charcoal"
    ],
    name: 'Regular TR90 Flexible Pilot',
    sku: 'REG-TR90',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-silver-front.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-silver-angle.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-silver-side.jpg"
    ],
    description: 'Modern aerodynamic teardrop pilot frame with high-flex Swiss TR90 rims and metallic silver titanium core inserts along the temples. Bends 90 degrees and springs back without warping.',
    features: [
      'Swiss EMS TR90 shape-memory flexible polymer',
      'Metallic silver core inlay along temples for structural refinement',
      'Integrated ergonomic saddle bridge with zero pinch points',
      'Priced at Federal Optical standard regular frame rate of Rs 2,250'
    ],
    inStock: true,
    isBestSeller: false,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium-Wide (54mm)',
    measurements: {
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 142,
      frameWeight: '16.1g'
    },
    availableColors: [
      {
        id: "regular-tr90-pilot-black-silver",
        name: "Black & Silver Core",
        hex: "#262626",
        sku: "REG-TR90-01",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-silver-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-silver-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-silver-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-silver-side.jpg"
        ]
      },
      {
        id: "regular-tr90-pilot-black-gold",
        name: "Dark Espresso Brown & Gold",
        hex: "#3b2418",
        sku: "REG-TR90-02",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-gold-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-gold-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-gold-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-black-gold-side.jpg"
        ]
      },
      {
        id: "regular-tr90-pilot-matte-charcoal",
        name: "Matte Charcoal",
        hex: "#3f3f46",
        sku: "REG-TR90-03",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-matte-charcoal-angle.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'regular-tr90-pilot-gloss-black',
    name: 'Regular TR90 Aerodynamic Pilot — Streamline Black',
    sku: 'REG-TR90-04',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-gloss-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-gloss-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-gloss-black-side.jpg',
      ],
    description: 'Monochromatic streamline black pilot frame with subtle taper. Engineered for pure minimalist functionality and weightless durability.',
    features: [
      'High-gloss mirror piano black finish',
      'Unbreakable TR90 memory flex frame and temples',
      'Wide field-of-view lens pocket for prescription sunglasses or transition lenses',
      'Regular Frames value: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium-Wide (54mm)',
    measurements: {
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 142,
      frameWeight: '15.8g'
    },
    availableColors: [
      { name: 'Streamline Black', hex: '#0a0a0a' }
    ],
    reviews: []
  },
  
  {
    id: 'regular-tr90-retro-round-black-gold',
    name: 'Regular TR90 Retro Round',
    sku: 'REG-TR90',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-round-black-gold-front.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-round-black-gold-angle.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-round-black-gold-side.jpg"
    ],
    description: 'Classic round silhouette featuring featherlight TR-90 rim cups and arched gold metallic bridge. Balanced proportions suitable for men and intellectual styling.',
    features: [
      'Dual-material architecture: Swiss TR-90 rims with electroplated alloy bridge',
      'Flexible, featherlight memory temples that never pinch',
      'Adjustable silicone nose pads for tailored fit',
      'Flat price: Rs 2,250'
    ],
    inStock: true,
    isBestSeller: false,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (50mm)',
    measurements: {
      lensWidth: 50,
      bridgeWidth: 20,
      templeLength: 145,
      frameWeight: '16.8g'
    },
    availableColors: [
      {
        id: "regular-tr90-retro-round-black-gold",
        name: "Black & Gold Bridge",
        hex: "#1f1d1b",
        sku: "REG-TR90-05",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-round-black-gold-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-round-black-gold-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-round-black-gold-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-round-black-gold-side.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'regular-tr90-exec-rectangle-tortoise',
    aliases: [
      "regular-tr90-rect-charcoal-smoke",
      "regular-tr90-retro-round-amber-tortoise",
      "regular-tr90-retro-round-jet-black"
    ],
    name: 'Regular TR90 Executive Rectangle',
    sku: 'REG-TR90',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-exec-rectangle-tortoise-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-exec-rectangle-tortoise-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-exec-rectangle-tortoise-side.jpg',
      ],
    description: 'Classic masculine rectangular silhouette with mottled amber havana tortoise finish. Delivers crisp intellectual gravitas while feeling virtually weightless on the nose.',
    features: [
      'Hand-blended warm amber tortoiseshell pattern',
      'Featherweight TR-90 high-tensile construction',
      'Optimized lens bevel holding thicker prescription lenses neatly',
      'Temple core reinforcement ensures lifelong fit retention'
    ],
    inStock: true,
    isBestSeller: false,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (53mm)',
    measurements: {
      lensWidth: 53,
      bridgeWidth: 17,
      templeLength: 142,
      frameWeight: '16.4g'
    },
    availableColors: [
      {
        id: 'regular-tr90-exec-rectangle-tortoise',
        name: 'Amber Havana Tortoise',
        hex: '#78350f',
        sku: 'REG-TR90-06',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-exec-rectangle-tortoise-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-exec-rectangle-tortoise-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-exec-rectangle-tortoise-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-exec-rectangle-tortoise-side.jpg'
        ]
      },
      {
        id: 'regular-tr90-rect-charcoal-smoke',
        name: 'Charcoal Smoke',
        hex: '#3f3f46',
        sku: 'REG-TR90-10',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374939/federal-optics/assets/images/eyeglasses/regular-tr90-rect-charcoal-smoke-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374939/federal-optics/assets/images/eyeglasses/regular-tr90-rect-charcoal-smoke-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374939/federal-optics/assets/images/eyeglasses/regular-tr90-rect-charcoal-smoke-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-rect-charcoal-smoke-side.jpg'
        ]
      },
    ],
    reviews: []
  },
  
  {
    id: 'regular-tr90-slim-rectangle-amber',
    name: 'Regular TR90 Slimline Rectangle — Honey Demi Tortoise',
    sku: 'REG-TR90-07',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-slim-rectangle-amber-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-slim-rectangle-amber-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-slim-rectangle-amber-side.jpg',
      ],
    description: 'A sleek, versatile rectangular profile with gently rounded corners in rich warm amber demi tortoiseshell. Featherweight TR-90 memory polymer provides unmatched all-day comfort.',
    features: [
      'Ultralight Swiss EMS TR-90 flexible memory polymer',
      'Glossy amber tortoiseshell pattern with warm undertones',
      'Ergonomic slim temples that fit comfortably behind ear without fatigue',
      'Regular Frames pricing: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (52mm)',
    measurements: {
      lensWidth: 52,
      bridgeWidth: 16,
      templeLength: 140,
      frameWeight: '15.4g'
    },
    availableColors: [
      { name: 'Honey Demi Tortoise', hex: '#a05a2c' }
    ],
    reviews: []
  },
  
  {
    id: 'regular-tr90-pilot-tomfamous-black',
    name: 'Regular TR90 Featherlight Aviator — Matte Black',
    sku: 'REG-TR90-08',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-tomfamous-black-front.jpg'
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
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-round-tomfamous-black-front.jpg'
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
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374939/federal-optics/assets/images/eyeglasses/regular-tr90-rect-tomfamous-black-front.jpg'
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
  },
  
  {
    id: 'regular-tr90-navigator-matte-black',
    name: 'Regular TR90 Navigator — Matte Black',
    sku: 'REG-TR90-09',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-navigator-matte-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-navigator-matte-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-navigator-matte-black-side.jpg'
    ],
    description: 'Ultra-flexible Swiss TR90 navigator frame with streamlined double brow bar and lightweight ergonomic temples.',
    features: [
      'Flexible Swiss TR90 memory composite',
      'Squared navigator double-bridge styling',
      'Soft contour ear rests preventing temple pressure',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    isNew: false,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium-Wide (54mm)',
    measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 142, frameWeight: '16.0g' },
    availableColors: [{ name: 'Matte Black', hex: '#1c1917' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-wayfarer-jet-black',
    name: 'Regular TR90 Classic Square — Jet Black',
    sku: 'REG-TR90-11',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/regular-tr90-wayfarer-jet-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-wayfarer-jet-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/regular-tr90-wayfarer-jet-black-side.jpg'
    ],
    description: 'Timeless square silhouette molded from durable impact-resistant TR90 with contoured keyhole bridge.',
    features: [
      'Deep jet black mirror polish finish',
      'Keyhole bridge design distributing nose weight evenly',
      'Flexible arms that bend outward without breaking',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (52mm)',
    measurements: { lensWidth: 52, bridgeWidth: 18, templeLength: 140, frameWeight: '16.5g' },
    availableColors: [{ name: 'Jet Black', hex: '#0a0a0a' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-streamline-pilot-black',
    name: 'Regular TR90 Streamline Pilot — Pitch Black',
    sku: 'REG-TR90-13',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374942/federal-optics/assets/images/eyeglasses/regular-tr90-streamline-pilot-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-streamline-pilot-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-streamline-pilot-black-side.jpg'
    ],
    description: 'Teardrop pilot frame engineered for broad facial structures with pressure-free lightweight bridge.',
    features: [
      'Masculine aviator teardrop rim contours',
      'Aerodynamic double bridge structure',
      'Unbreakable memory flex polymer',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Wide (55mm)',
    measurements: { lensWidth: 55, bridgeWidth: 17, templeLength: 145, frameWeight: '16.7g' },
    availableColors: [{ name: 'Pitch Black', hex: '#111111' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-pantos-honey-crystal',
    name: 'Regular TR90 Pantos Round — Honey Crystal Demi',
    sku: 'REG-TR90-14',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pantos-honey-crystal-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pantos-honey-crystal-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pantos-honey-crystal-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374937/federal-optics/assets/images/eyeglasses/regular-tr90-pantos-honey-crystal-specs.jpg'
    ],
    description: 'Warm translucent honey crystal panto frame offering featherweight daily comfort and smart intellectual styling.',
    features: [
      'Translucent amber-gold crystal material',
      'Smooth keyhole bridge preventing nose marks',
      'Authentic temple laser dimensions macro shot included',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    isNew: false,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (49mm)',
    measurements: { lensWidth: 49, bridgeWidth: 19, templeLength: 140, frameWeight: '15.0g' },
    availableColors: [{ name: 'Honey Crystal Demi', hex: '#b45309' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-exec-slim-matte-black',
    name: 'Regular TR90 Slim Executive — Satin Black',
    sku: 'REG-TR90-15',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-exec-slim-matte-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-exec-slim-matte-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-exec-slim-matte-black-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-exec-slim-matte-black-specs.jpg'
    ],
    description: 'Minimalist low-profile rectangular frame with velvet matte finish that resists fingerprint oils and sweat.',
    features: [
      'Velvet matte charcoal black surface',
      'Low-profile narrow height suited for executive reading',
      'Temple specs inscription included',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (53mm)',
    measurements: { lensWidth: 53, bridgeWidth: 17, templeLength: 142, frameWeight: '15.6g' },
    availableColors: [{ name: 'Satin Black', hex: '#18181b' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-browline-hybrid-black',
    name: 'Regular TR90 Browline Hybrid — Matte Black & Gunmetal',
    sku: 'REG-TR90-16',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374934/federal-optics/assets/images/eyeglasses/regular-tr90-browline-hybrid-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374934/federal-optics/assets/images/eyeglasses/regular-tr90-browline-hybrid-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374934/federal-optics/assets/images/eyeglasses/regular-tr90-browline-hybrid-black-side.jpg'
    ],
    description: 'Distinguished browline architecture constructed with flexible TR-90 upper brow and slender lower eyewire.',
    features: [
      'Bold top browline silhouette',
      'Adjustable hypoallergenic nose pads',
      'Spring hinge action for wide head dimensions',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    isNew: false,
    frameShape: 'browline',
    frameMaterial: 'TR90 & Metal Core',
    rimType: 'Full Rim',
    frameSize: 'Medium-Wide (54mm)',
    measurements: { lensWidth: 54, bridgeWidth: 18, templeLength: 145, frameWeight: '17.8g' },
    availableColors: [{ name: 'Matte Black & Gunmetal', hex: '#27272a' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-pilot-metal-temple-black',
    name: 'Regular TR90 Pilot — Black with Silver Core Temples',
    sku: 'REG-TR90-17',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-metal-temple-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-metal-temple-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-metal-temple-black-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374938/federal-optics/assets/images/eyeglasses/regular-tr90-pilot-metal-temple-black-specs.jpg'
    ],
    description: 'Aerodynamic double-bar pilot frame with inlaid silver core reinforcement along the temple arms.',
    features: [
      'Double-bridge teardrop geometry',
      'Silver metallic core side inlay',
      'Wide coverage lens frame',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Wide (55mm)',
    measurements: { lensWidth: 55, bridgeWidth: 18, templeLength: 145, frameWeight: '16.9g' },
    availableColors: [{ name: 'Black & Silver', hex: '#1e293b' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-square-sport-grip-black',
    name: 'Regular TR90 Sport Grip Square — Onyx Black',
    sku: 'REG-TR90-18',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-square-sport-grip-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-square-sport-grip-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-square-sport-grip-black-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-square-sport-grip-black-specs.jpg'
    ],
    description: 'Athletic lifestyle square frame with ribbed non-slip temple textures that stay in place during active movement.',
    features: [
      'Grip texture inside temple arms prevents slippage',
      'Sleek modern square eyewires',
      'High-impact flexible polymer',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    isBestSeller: false,
    frameShape: 'square',
    frameMaterial: 'TR90 Sport Polymer',
    rimType: 'Full Rim',
    frameSize: 'Medium (53mm)',
    measurements: { lensWidth: 53, bridgeWidth: 17, templeLength: 142, frameWeight: '16.2g' },
    availableColors: [{ name: 'Onyx Black', hex: '#0f172a' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-urban-rectangle-midnight',
    name: 'Regular TR90 Urban Rectangle — Midnight Navy',
    sku: 'REG-TR90-19',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-urban-rectangle-midnight-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-urban-rectangle-midnight-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-urban-rectangle-midnight-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374941/federal-optics/assets/images/eyeglasses/regular-tr90-urban-rectangle-midnight-specs.jpg'
    ],
    description: 'Deep midnight blue rectangular front with clean beveled edges and ultra-flexible shape memory.',
    features: [
      'Luminous deep midnight ocean navy shade',
      'Subtle beveled chamfer around rims',
      'All-day comfort lightweight balance',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium-Wide (54mm)',
    measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 142, frameWeight: '16.4g' },
    availableColors: [{ name: 'Midnight Navy', hex: '#172554' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-contour-pilot-charcoal',
    name: 'Regular TR90 Contour Pilot — Steel Charcoal',
    sku: 'REG-TR90-20',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-contour-pilot-charcoal-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-contour-pilot-charcoal-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-contour-pilot-charcoal-side.jpg'
    ],
    description: 'Sleek contemporary aviator with smooth aerodynamic contours and integrated hypoallergenic saddle bridge.',
    features: [
      'Steel charcoal graphite coloring',
      'Contoured nose pads molded directly into the frame',
      'Wide visual field',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium-Wide (54mm)',
    measurements: { lensWidth: 54, bridgeWidth: 18, templeLength: 142, frameWeight: '16.0g' },
    availableColors: [{ name: 'Steel Charcoal', hex: '#334155' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-keyhole-round-dark-amber',
    name: 'Regular TR90 Keyhole Round — Dark Havana',
    sku: 'REG-TR90-21',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-keyhole-round-dark-amber-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-keyhole-round-dark-amber-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374936/federal-optics/assets/images/eyeglasses/regular-tr90-keyhole-round-dark-amber-side.jpg'
    ],
    description: 'Classic keyhole bridge rounded profile in rich espresso and amber tortoiseshell for smart intellectual flair.',
    features: [
      'Traditional keyhole arch bridge',
      'Subtle dark havana tortoiseshell finish',
      'Flexible ear wraps preventing sliding',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (50mm)',
    measurements: { lensWidth: 50, bridgeWidth: 19, templeLength: 140, frameWeight: '15.5g' },
    availableColors: [{ name: 'Dark Havana', hex: '#451a03' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-architectural-square-black',
    name: 'Regular TR90 Architectural Square — Matte Onyx',
    sku: 'REG-TR90-22',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374934/federal-optics/assets/images/eyeglasses/regular-tr90-architectural-square-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374934/federal-optics/assets/images/eyeglasses/regular-tr90-architectural-square-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-architectural-square-black-side.jpg'
    ],
    description: 'Bold geometric square lines with sculpted chamfered edges designed for long hours of screen work.',
    features: [
      'Modern sharp square geometry',
      'Matte onyx anti-glare finish',
      'Spring hinge flex mechanism',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (53mm)',
    measurements: { lensWidth: 53, bridgeWidth: 18, templeLength: 142, frameWeight: '16.5g' },
    availableColors: [{ name: 'Matte Onyx', hex: '#111827' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-aviator-wire-double-bridge',
    name: 'Regular TR90 Double-Bridge Aviator — Carbon Black',
    sku: 'REG-TR90-23',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374934/federal-optics/assets/images/eyeglasses/regular-tr90-aviator-wire-double-bridge-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374934/federal-optics/assets/images/eyeglasses/regular-tr90-aviator-wire-double-bridge-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-aviator-wire-double-bridge-side.jpg'
    ],
    description: 'High-durability double-bridge aviator with reinforced brow structure and flexible curved temple tips.',
    features: [
      'Dual top bridge structural bar',
      'Carbon black resilient polymer',
      'Bends 90 degrees without distortion',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'aviator',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Wide (55mm)',
    measurements: { lensWidth: 55, bridgeWidth: 18, templeLength: 145, frameWeight: '16.8g' },
    availableColors: [{ name: 'Carbon Black', hex: '#1f2937' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-classic-rectangle-deep-grey',
    name: 'Regular TR90 Classic Rectangle — Deep Slate Grey',
    sku: 'REG-TR90-24',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-classic-rectangle-deep-grey-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-classic-rectangle-deep-grey-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374935/federal-optics/assets/images/eyeglasses/regular-tr90-classic-rectangle-deep-grey-side.jpg'
    ],
    description: 'Everyday versatile rectangle frame with featherweight nose balance, ready for reading and progressive lenses.',
    features: [
      'Deep slate charcoal grey',
      'Universal ergonomic nose bridge',
      'Engineered for all face shapes',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    frameShape: 'square',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (52mm)',
    measurements: { lensWidth: 52, bridgeWidth: 17, templeLength: 142, frameWeight: '15.7g' },
    availableColors: [{ name: 'Deep Slate Grey', hex: '#374151' }],
    reviews: []
  },
  
  {
    id: 'regular-tr90-retro-horn-rim-amber-gold',
    name: 'Regular TR90 Retro Horn-Rim — Demi Amber & Gold',
    sku: 'REG-TR90-25',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Regular Frames',
    price: 2250,
    originalPrice: 3200,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-horn-rim-amber-gold-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374939/federal-optics/assets/images/eyeglasses/regular-tr90-retro-horn-rim-amber-gold-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374940/federal-optics/assets/images/eyeglasses/regular-tr90-retro-horn-rim-amber-gold-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374939/federal-optics/assets/images/eyeglasses/regular-tr90-retro-horn-rim-amber-gold-specs.jpg'
    ],
    description: 'Heritage round silhouette featuring demi tortoiseshell rims, metallic temple accents, and flexible memory arms.',
    features: [
      'Demi amber tortoise shell patterned rims',
      'Champagne gold metallic hinge and temple inlays',
      'Macro temple specifications closeup photo included',
      'Regular Frames uniform price: Rs 2,250'
    ],
    inStock: true,
    isBestSeller: false,
    isNew: false,
    frameShape: 'round',
    frameMaterial: 'TR90 Ultra-Memory',
    rimType: 'Full Rim',
    frameSize: 'Medium (50mm)',
    measurements: { lensWidth: 50, bridgeWidth: 19, templeLength: 142, frameWeight: '16.1g' },
    availableColors: [{ name: 'Demi Amber & Gold', hex: '#92400e' }],
    reviews: []
  },
  
  
  
  
  
  
  
  {
    id: 'rayban-xh6041-cateye-black',
    name: 'Ray-Ban Junior XH6041 Teen Sheet Acetate Cat-Eye',
    sku: 'RB-XH6041-BLK',
    category: 'eyeglasses',
    subCategory: "Teen’s Eyeglasses",
    gender: 'kids',
    brand: 'Ray-Ban Junior',
    price: 4650,
    originalPrice: 5900,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374932/federal-optics/assets/images/eyeglasses/rayban-xh6041-cateye-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374932/federal-optics/assets/images/eyeglasses/rayban-xh6041-cateye-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374932/federal-optics/assets/images/eyeglasses/rayban-xh6041-cateye-black-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374932/federal-optics/assets/images/eyeglasses/rayban-xh6041-cateye-black-specs.jpg'
    ],
    description: 'Authentic Ray-Ban Junior XH6041 sculpted cat-eye optical frame in Teen Age size (48-15-130). Crafted from premium high-density Italian sheet cellulose acetate with iconic silver dual-pin temple rivets, ergonomic molded bridge, and contoured tips.',
    features: [
      'Official Teen Age size laser temple inscription: XH6041 48-15-130',
      'High-density Italian sheet cellulose acetate construction with deep gloss luster',
      'Modern sculpted cat-eye silhouette designed for teenagers and petite facial structures',
      'Dual silver pin temple rivets with precision 3-barrel optical hinges'
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'cat-eye',
    frameMaterial: 'Italian Sheet Acetate',
    rimType: 'Full Rim',
    frameSize: 'Teen Age (48-15-130)',
    measurements: {
      lensWidth: 48,
      bridgeWidth: 15,
      templeLength: 130,
      frameWeight: '19.0g'
    },
    availableColors: [
      { name: 'Gloss Black', hex: '#111111' }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-xh6042-butterfly-black',
    name: 'Ray-Ban Junior XH6042 Teen Butterfly Wing Cat-Eye',
    sku: 'RB-XH6042-BLK',
    category: 'eyeglasses',
    subCategory: "Teen’s Eyeglasses",
    gender: 'kids',
    brand: 'Ray-Ban Junior',
    price: 4650,
    originalPrice: 5900,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6042-butterfly-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6042-butterfly-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6042-butterfly-black-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6042-butterfly-black-specs.jpg'
    ],
    description: 'Authentic Ray-Ban Junior XH6042 butterfly wing cat-eye optical frame in Teen Age size (47-15-130). Delicately uplifted browline handcrafted from jet-black sheet acetate with custom flexible stainless steel temple wire core.',
    features: [
      'Official Teen Age size laser temple inscription: XH6042 47-15-130',
      'Delicate butterfly curvature providing elegant cheekbone clearance for teens',
      'Flexible internal stainless steel core running through acetate temple arms',
      'Hypoallergenic smooth saddle bridge for weightless all-day school wear'
    ],
    inStock: true,
    isNew: false,
    frameShape: 'cat-eye',
    frameMaterial: 'Italian Sheet Acetate',
    rimType: 'Full Rim',
    frameSize: 'Teen Age (47-15-130)',
    measurements: {
      lensWidth: 47,
      bridgeWidth: 15,
      templeLength: 130,
      frameWeight: '18.5g'
    },
    availableColors: [
      { name: 'Polished Onyx', hex: '#111111' }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-xh6043-round-black',
    aliases: ['rayban-xh6043-round-burgundy'],
    name: 'Ray-Ban Junior XH6043 Teen Pantos Round',
    sku: 'RB-XH6043',
    category: 'eyeglasses',
    subCategory: "Teen’s Eyeglasses",
    gender: 'kids',
    brand: 'Ray-Ban Junior',
    price: 4650,
    originalPrice: 5900,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-front.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-angle.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-side.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-specs.jpg'
    ],
    description: 'Authentic Ray-Ban Junior XH6043 pantos round optical frame in Teen Age size (48-18-130). Rendered in mirror-gloss black Italian sheet acetate with vintage keyhole bridge and metallic temple rivets.',
    features: [
      'Official Teen Age size laser temple inscription: XH6043 48-18-130',
      'Timeless pantos round silhouette tailored for teenage facial proportions',
      'Sculpted keyhole bridge distributing weight evenly without slippage',
      'Signature Ray-Ban metallic temple rivets and engraved brand insignia'
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'round',
    frameMaterial: 'Italian Sheet Acetate',
    rimType: 'Full Rim',
    frameSize: 'Teen Age (48-18-130)',
    measurements: {
      lensWidth: 48,
      bridgeWidth: 18,
      templeLength: 130,
      frameWeight: '19.0g'
    },
    availableColors: [
      {
        id: 'rayban-xh6043-round-black',
        name: 'Polished Black',
        hex: '#000000',
        sku: 'RB-XH6043-BLK',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-side.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-black-specs.jpg'
        ]
      },
      {
        id: 'rayban-xh6043-round-burgundy',
        name: 'Bordeaux Wine',
        hex: '#581825',
        sku: 'RB-XH6043-WNE',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-burgundy-front.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-burgundy-front.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-burgundy-angle.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-burgundy-side.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374933/federal-optics/assets/images/eyeglasses/rayban-xh6043-round-burgundy-specs.jpg'
        ]
      },
    ],
    reviews: []
  },
  
  
  
  
  {
    id: "cl-acu-01",
    name: "ACUVUE 1-Day Moist Daily Disposable (30 Pack)",
    sku: "CL-ACU-01",
    category: "clear-contacts",
    subCategory: "Daily Disposable Clear Lenses",
    gender: "unisex",
    brand: "Johnson & Johnson Acuvue",
    price: 11500,
    originalPrice: 13500,
    rating: 5.0,
    reviewCount: 42,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/Acuvue%201%20day%20moisy%20rs%2011500.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "ACUVUE 1 day moist are soft and comfy daily disposable contact lenses. These lenses add a beautiful glow to your natural eyes without letting anyone know that you have weak eye-sight. 1 day acuvue moist daily disposable contact lenses are easy to wear and comfortable to hold for the entire day. They have 58% water content in their making that guarantees hydration and avoids any kind of redness and irritation. The best price Acuvue 1 day Moist lenses are available in a wide range of power.",
    features: [
      "Content: 58% Water for continuous all-day moisture",
      "Diameter: 14.2mm | Base Curve: 8.5mm",
      "Power Range: -0.50D to -6.00D (0.25 steps) & -6.50D to -10.00D (0.50 steps)",
      "Lacreon Technology permanently embeds moisture-rich wetting agent",
      "Class 2 UV blocking protects cornea and ocular surfaces",
      "Supplied with Federal Optical sterile case & clinic care guide",
    ],
    inStock: true,
    isBestSeller: true,
    disposability: "daily",
    lensWaterContent: "58% Water",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.5 mm",
    lensPowerRange: "-0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-bio-55",
    name: "CooperVision Biomedics 55 Premier Aspheric",
    sku: "CL-BIO-55",
    category: "clear-contacts",
    subCategory: "Monthly Clear Contact Lenses",
    gender: "unisex",
    brand: "CooperVision",
    price: 3500,
    originalPrice: 4200,
    packOptions: [
      {
        id: "1-pair",
        name: "1 Pair of Lenses (2 Lenses)",
        price: 3500,
      },
      {
        id: "2-pairs",
        name: "2 Pairs of Lenses (4 Lenses)",
        price: 6500,
        savingsBadge: "Save Rs. 500",
      },
      {
        id: "3-pairs",
        name: "3 Pairs / Box (6 Lenses)",
        price: 8500,
        savingsBadge: "Save Rs. 2,000",
      },
    ],
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375058/federal-optics/eyeglassimages/Transparent%20Lenses/BIOMEDICS%2055/WhatsApp%20Image%202026-10-19%20at%205.23.51%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375058/federal-optics/eyeglassimages/Transparent%20Lenses/BIOMEDICS%2055/WhatsApp%20Image%202026-10-19%20at%205.23.51%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375059/federal-optics/eyeglassimages/Transparent%20Lenses/BIOMEDICS%2055/WhatsApp%20Image%202026-10-19%20at%205.23.52%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "CooperVision Biomedics 55 premier aspheric contact lenses are designed to effectively control the spherical aberration in the lens and human eye. Spherical aberration is the inability of a lens to focus light on a common point. Biomedics 55 contact lenses offer excellent wearing comfort, enhanced image quality and UV blocking protection. They come in a 6 contact lenses packaging and are available at best prices in Pakistan.",
    features: [
      "Content: 38% Water for structural stability and deposit resistance",
      "Diameter: 14.2mm | Base Curve: 8.6mm",
      "Power Range: -0.50D to -6.00D (0.25 steps), -6.50D to -10.00D (0.50 steps), +0.50 to +6.00D",
      "Aspheric optical curvature neutralizes spherical aberrations",
      "Tapered edge design provides effortless, frictionless blinking",
      "Includes Federal Optical sterile case and optometrist consultation",
    ],
    inStock: true,
    isBestSeller: true,
    disposability: "monthly",
    lensWaterContent: "38% Water",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.6 mm",
    lensPowerRange: "-0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps) | +0.50 to +6.00D (0.25 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-bnl-59",
    name: "Bausch & Lomb SofLens 59 Monthly Contact Lenses",
    sku: "CL-BNL-59",
    category: "clear-contacts",
    subCategory: "Monthly Clear Contact Lenses",
    gender: "unisex",
    brand: "Bausch & Lomb",
    price: 4800,
    originalPrice: 5800,
    packOptions: [
      {
        id: "1-pair",
        name: "1 Pair of Lenses (2 Lenses)",
        price: 4800,
      },
      {
        id: "2-pairs",
        name: "2 Pairs of Lenses (4 Lenses)",
        price: 9000,
        savingsBadge: "Save Rs. 600",
      },
      {
        id: "3-pairs",
        name: "3 Pairs / Box (6 Lenses)",
        price: 13000,
        savingsBadge: "Save Rs. 1,400",
      },
    ],
    rating: 4.9,
    reviewCount: 31,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375137/federal-optics/eyeglassimages/Transparent%20Lenses/Bausch%20and%20Lomb%20Soflens%2059/WhatsApp%20Image%202026-10-19%20at%205.35.29%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375161/federal-optics/eyeglassimages/Transparent%20Lenses/Bausch%20and%20Lomb%20Soflens%2059/WhatsApp%20Image%202026-10-19%20at%205.35.30%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375161/federal-optics/eyeglassimages/Transparent%20Lenses/Bausch%20and%20Lomb%20Soflens%2059/WhatsApp%20Image%202026-10-19%20at%205.35.30%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375162/federal-optics/eyeglassimages/Transparent%20Lenses/Bausch%20and%20Lomb%20Soflens%2059/WhatsApp%20Image%202026-10-19%20at%205.35.30%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Bausch + Lomb SofLens59 contact lenses deliver clear vision with the everyday comfort you have been looking for. Bausch and Lomb Soflens 59 are light and convenient monthly disposable contact lenses made for both men and women. You can say goodbye to your dull and dry eyes and achieve protected and moistened eyes with these branded contact lenses; they guard against the sun and prevent dehydration in the eyes. Buy these Bausch & Lomb Soflens 59 with 59% Water content and 41% Hilafilcon B in its composition that guarantees you comfortable wear the entire day for a long time.",
    features: [
      "Composition: 59% Water, 41% Hilafilcon B polymer",
      "Diameter: 14.2mm | Base Curve: 8.60mm",
      "Power Range: -0.50D to -6.00D (0.25 steps) | -6.50D to -9.00D (0.50 steps)",
      "Protein-resistant polymer material minimizes buildup and irritation",
      "Time-tested edge profile provides exceptional wearing ease",
      "Certified authentic Bausch + Lomb Pakistan supply",
    ],
    inStock: true,
    isBestSeller: true,
    disposability: "monthly",
    lensWaterContent: "59% Water, 41% Hilafilcon B",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.60 mm",
    lensPowerRange: "-0.50D to -6.00D (0.25 steps) | -6.50D to -9.00D (0.50 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-ava-01",
    name: "CooperVision Avaira Vitality Monthly Silicone Hydrogel",
    sku: "CL-AVA-01",
    category: "clear-contacts",
    subCategory: "Monthly Clear Contact Lenses",
    gender: "unisex",
    brand: "CooperVision",
    price: 4300,
    originalPrice: 5200,
    packOptions: [
      {
        id: "1-pair",
        name: "1 Pair of Lenses (2 Lenses)",
        price: 4300,
      },
      {
        id: "2-pairs",
        name: "2 Pairs of Lenses (4 Lenses)",
        price: 8200,
        savingsBadge: "Save Rs. 400",
      },
      {
        id: "3-pairs",
        name: "3 Pairs / Box (6 Lenses)",
        price: 12000,
        savingsBadge: "Save Rs. 900",
      },
    ],
    rating: 5.0,
    reviewCount: 27,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/Avaira%20Vitality%20rs%204300/WhatsApp%20Image%202026-10-19%20at%205.40.42%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/Avaira%20Vitality%20rs%204300/WhatsApp%20Image%202026-10-19%20at%205.40.43%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/Avaira%20Vitality%20rs%204300/WhatsApp%20Image%202026-10-19%20at%205.40.43%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "The Avaira Vitality monthly disposable silicone hydrogel contact lenses are manufactured by the world’s leading contact lens manufacturer CooperVision. These transparent lenses provide long-lasting comfort and clear vision. The manufacturer has used the same optical features as in Biofinity contact lenses. They are produced with 3rd generation Silicone Hydrogel material ensuring better lens-wearing experience. Avaira Vitality contact lenses are available in transparent color, and these are monthly disposable lenses. These superior performance lenses are available at best prices only.",
    features: [
      "3rd Generation Silicone Hydrogel material with natural high wettability",
      "Class 1 UV filter blocks >90% UVA and >99% UVB rays",
      "High oxygen transmissibility (Dk/t) for white, healthy eyes",
      "Aberration neutralizing system for high-definition clarity",
      "Soft and flexible lens geometry for quick adaptation",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "monthly",
    lensWaterContent: "55% Water",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.4 mm",
    lensPowerRange: "-0.50D to -6.00D (0.25 steps) | -6.50D to -12.00D (0.50 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-avt-02",
    name: "CooperVision Avaira Vitality Toric (For Astigmatism)",
    sku: "CL-AVT-02",
    category: "clear-contacts",
    subCategory: "Toric Astigmatism Clear Lenses",
    gender: "unisex",
    brand: "CooperVision",
    price: 6500,
    originalPrice: 7800,
    rating: 5.0,
    reviewCount: 19,
    isToric: true,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/Avaira%20Vitality%20Toric%20RS%206500/WhatsApp%20Image%202026-10-19%20at%205.49.13%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375058/federal-optics/eyeglassimages/Transparent%20Lenses/Avaira%20Vitality%20Toric%20RS%206500/WhatsApp%20Image%202026-10-19%20at%205.49.14%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "CooperVision Avaira Vitality Toric monthly silicone hydrogel contact lenses deliver stable, crisp vision for astigmatic eyes. Engineered with Optimized Toric Lens Geometry to ensure quick orientation upon blinking and minimal rotation during reading or sports.",
    features: [
      "Diameter: 14.5mm | Base Curve: 8.5mm",
      "Sphere Power: -0.75 to -8.00D (0.50D steps after -6.00D)",
      "Cylinder Power: -0.75D, -1.25D, -1.75D, -2.25D, -2.75D, -3.25D, -3.75D",
      "Axis: 10° to 180° in 10° precise steps",
      "High Power Options: Sphere -0.75 to -8.00 with Cyl -2.75, -3.25, -3.75 (Axis 10, 20, 160, 170, 180)",
      "Optimized Toric Geometry locks lens firmly in correct meridian",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "monthly",
    lensWaterContent: "55% Water",
    lensDiameter: "14.5 mm",
    lensBaseCurve: "8.5 mm",
    lensPowerRange: "Sph -0.75 to -8.00D | Cyl -0.75 to -3.75D | Axis 10° to 180°",
    availableColors: [
      {
        name: "Clear Toric",
        hex: "#bae6fd",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-flx-01",
    name: "Flexcon Extended Wear Yearly Disposable Contact Lenses",
    sku: "CL-FLX-01",
    category: "clear-contacts",
    subCategory: "Yearly Clear Contact Lenses",
    gender: "unisex",
    brand: "Flexcon",
    price: 7700,
    originalPrice: 9200,
    packOptions: [
      {
        id: "minus-power",
        name: "Standard Minus Powers (-)",
        price: 7700,
      },
      {
        id: "plus-power",
        name: "Plus Powers (+) Range",
        price: 8300,
        savingsBadge: "High Power",
      },
    ],
    rating: 4.8,
    reviewCount: 22,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375059/federal-optics/eyeglassimages/Transparent%20Lenses/FLEXON%20%28With%20descriptipon%29%20RS%207700/WhatsApp%20Image%202026-10-19%20at%205.51.07%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Flexcon extended wear contact lenses are comfortable and secure for those who want to live their lives conveniently without having to carry the weight of glasses with them everywhere. Flexcon lenses are safe and moist yearly disposable contact lenses that you can wear all day long, from the office to late-night movies with friends. They provide a barrier to your eyes to prevent any tiredness and eye-fatigue. We are offering these branded contact lenses in a wide power range to present everyone an opportunity to try these best vision-correcting contact lenses. Buy these Flexcon contact lenses today at best prices to prevent dehydration.",
    features: [
      "Content: 55% Water for all-day comfort and ocular breathability",
      "Diameter: 14.0mm | Base Curve: 8.4mm",
      "Minus Range: -0.50D to -6.00D (0.25 steps) & -6.50D to -20.00D (0.50 steps)",
      "Plus Range (+): +1.00 to +6.00D (0.25 steps) & +6.00 to +20.00D (0.50 steps)",
      "Yearly durability with reinforced tear resistance",
      "Certified by Federal Optical Karachi optometrists",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "yearly",
    lensWaterContent: "55% Water",
    lensDiameter: "14.0 mm",
    lensBaseCurve: "8.4 mm",
    lensPowerRange: "-0.50D to -20.00D | +1.00D to +20.00D",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-bio-1d",
    name: "CooperVision Biomedics 1 Day Extra (30 Lenses)",
    sku: "CL-BIO-1D",
    category: "clear-contacts",
    subCategory: "Daily Disposable Clear Lenses",
    gender: "unisex",
    brand: "CooperVision",
    price: 9000,
    originalPrice: 10500,
    rating: 4.9,
    reviewCount: 18,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375058/federal-optics/eyeglassimages/Transparent%20Lenses/Biomedics%201%20Day%20Extra%20%28%20with%20Description%29%20Rs%209000/WhatsApp%20Image%202026-10-19%20at%205.59.20%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "30 Lenses in 1 Box CooperVision Biomedics 1 Day Extra is a trusted name in the leading contact lenses brands. It is designed to deliver the most natural, comfortable lens wearing experience. Biomedics 1 day extra are available in a pack of 30 daily disposable contact lenses.",
    features: [
      "30 sterile daily disposable lenses per box (15 pairs)",
      "Material: Oculfilcon D with high natural wettability",
      "Diameter: 14.2mm | Base Curve: 8.6mm",
      "Power Range: -0.75D to -6.00D (0.25 steps) & -6.50D to -8.00D (0.50 steps)",
      "Ultra-thin tapered edge profile prevents eyelid friction",
      "No lens care solution or storage case required — insert and dispose",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "daily",
    lensWaterContent: "55% Water (Oculfilcon D)",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.6 mm",
    lensPowerRange: "-0.75D to -6.00D (0.25 steps) | -6.50D to -8.00D (0.50 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-vis-01",
    name: "Visicon Transparent Monthly Wear Contact Lenses",
    sku: "CL-VIS-01",
    category: "clear-contacts",
    subCategory: "Monthly Clear Contact Lenses",
    gender: "unisex",
    brand: "Visicon",
    price: 4200,
    originalPrice: 5000,
    rating: 4.8,
    reviewCount: 16,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/Transparent%20Lenses/VISICON%28with%20descriotion%20%29%20RS%204200/WhatsApp%20Image%202026-10-19%20at%206.05.58%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Visicon contact lenses are transparent monthly wear lenses engineered for exceptional optical clarity and reliable moisture equilibrium. Specially crafted for South Asian climates to resist deposit adhesion.",
    features: [
      "Content: 38% Water for structural resilience and clarity",
      "Diameter: 14.0mm | Base Curve: 8.5mm",
      "Power Range: -0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps)",
      "Biocompatible polymer for dependable all-day wearing comfort",
      "Supplied with Federal Optical sterile case & hygiene guide",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "monthly",
    lensWaterContent: "38% Water",
    lensDiameter: "14.0 mm",
    lensBaseCurve: "8.5 mm",
    lensPowerRange: "-0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-foc-01",
    name: "Focus DAILIES All Day Comfort (30 Daily Lenses)",
    sku: "CL-FOC-01",
    category: "clear-contacts",
    subCategory: "Daily Disposable Clear Lenses",
    gender: "unisex",
    brand: "Focus Dailies",
    price: 10400,
    originalPrice: 12500,
    rating: 5.0,
    reviewCount: 26,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375059/federal-optics/eyeglassimages/Transparent%20Lenses/Focus%20DAILIES%20with%20description%20rs%2010400/WhatsApp%20Image%202026-10-19%20at%206.12.39%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Focus dailies all day comfort are daily disposable contact lenses. Focus Dailies contact lenses are transparent lenses and offer all-day comfort to its users. Either you are suffering from myopia or face difficulties in seeing the objects near you, focus dailies lenses are preferably the right choice for both conditions. As the name indicates these lenses can be disposed daily and cannot be used more than once. You can experience the feeling of wearing a new lens everyday without any inconvenience. Daily wear: comfortable for typical wear of 8-10 hours. Replacement: Daily disposable. Pair packaging: supplied as matched pairs in sterile vials.",
    features: [
      "Blink-activated moisture release technology",
      "Content: Standard water (69% high hydration)",
      "Diameter: 14.0mm | Base Curve: 8.7mm",
      "Power Range: -0.50D to -6.00D (0.25 steps)",
      "Plano + prescription powers confirmed via Federal Optical WhatsApp",
      "Brand new lens freshness every morning",
    ],
    inStock: true,
    isBestSeller: true,
    disposability: "daily",
    lensWaterContent: "69% Water",
    lensDiameter: "14.0 mm",
    lensBaseCurve: "8.7 mm",
    lensPowerRange: "-0.50D to -6.00D (0.25 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-frk-58",
    name: "FreshKon 58 UV Monthly Clear Lenses",
    sku: "CL-FRK-58",
    category: "clear-contacts",
    subCategory: "Monthly Clear Contact Lenses",
    gender: "unisex",
    brand: "FreshKon",
    price: 2500,
    originalPrice: 3200,
    packOptions: [
      {
        id: "1-pair",
        name: "1 Pair (2 Lenses)",
        price: 2500,
      },
      {
        id: "pack-6",
        name: "Pack of 6 Lenses (3 Pairs)",
        price: 6500,
        savingsBadge: "Save Rs. 1,000",
      },
    ],
    rating: 4.8,
    reviewCount: 15,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/freshkon%2058%20uv%201%20pair%20rs%202500.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375056/federal-optics/eyeglassimages/Transparent%20Lenses/Freshkon%2058%20UV%20Pack%20OF%206%20rs%206500.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "FreshKon 58 UV monthly clear contact lenses combine a 58% water content matrix with integrated UV blocking to shield eyes from sun exposure while keeping lenses supple and hydrated.",
    features: [
      "58% Water hydrophilic material ensures silky glide on cornea",
      "Available as single pair (Rs. 2,500) or value pack of 6 (Rs. 6,500)",
      "Diameter: 14.2mm | Base Curve: 8.5mm",
      "Integrated UV protection guards against ocular fatigue",
      "Smooth deposit-resistant surface coating",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "monthly",
    lensWaterContent: "58% Water",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.5 mm",
    lensPowerRange: "-0.50D to -10.00D (0.25 & 0.50 steps)",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-opt-sc",
    name: "Optiano See Clear Monthly Transparent Lenses",
    sku: "CL-OPT-SC",
    category: "clear-contacts",
    subCategory: "Monthly Clear Contact Lenses",
    gender: "unisex",
    brand: "Optiano",
    price: 2500,
    originalPrice: 3200,
    rating: 4.8,
    reviewCount: 21,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/OPTIANO%20SEE%20CLEAR%20RS%202500.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Optiano See Clear monthly clear contact lenses manufactured in South Korea with globally safety approved medical polymers. Crystal clarity, gentle hydration, and effortless all-day wear.",
    features: [
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Diameter: 14.2mm | Base Curve: 8.6mm | Water: 42%",
      "Precision aspheric front surface reduces glare and halos",
      "Includes Federal Optical sterile lens storage case",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "monthly",
    lensWaterContent: "42% Water",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.6 mm",
    lensPowerRange: "-0.50D to -10.00D",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-opt-ex",
    name: "Optiano EX South Korea Precision Clear Lenses",
    sku: "CL-OPT-EX",
    category: "clear-contacts",
    subCategory: "Quarterly Clear Contact Lenses",
    gender: "unisex",
    brand: "Optiano",
    price: 3450,
    originalPrice: 4200,
    rating: 4.9,
    reviewCount: 14,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375057/federal-optics/eyeglassimages/Transparent%20Lenses/OPTIANO%20EX%20RS%203450.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Optiano EX high-definition clear contact lenses. Engineered with high-molecular polymer technology from South Korea for extended 3-month wear life and exceptional tear-film stability.",
    features: [
      "3-Month comfortable wearing cycle",
      "South Korean precision lathe-cut surfacing",
      "Diameter: 14.2mm | Base Curve: 8.6mm | Water: 40%",
      "Deposit-repelling surface keeps vision crystal-clear",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "three-month",
    lensWaterContent: "40% Water",
    lensDiameter: "14.2 mm",
    lensBaseCurve: "8.6 mm",
    lensPowerRange: "-0.50D to -10.00D",
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#e0f2fe",
      },
    ],
    reviews: [],
  },
  
  {
    id: "cl-opt-tr",
    name: "Optiano Toric Astigmatism Clear Lenses (South Korea)",
    sku: "CL-OPT-TR",
    category: "clear-contacts",
    subCategory: "Toric Astigmatism Clear Lenses",
    gender: "unisex",
    brand: "Optiano",
    price: 6000,
    originalPrice: 7200,
    rating: 5.0,
    reviewCount: 11,
    isToric: true,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375058/federal-optics/eyeglassimages/Transparent%20Lenses/OPTIANO%20TORIC%20rs%206000.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Optiano Toric clear contact lenses for astigmatism. Manufactured in South Korea with dynamic stabilization zones to correct cylindrical blur without lens drift.",
    features: [
      "Prism ballast stabilization keeps cylinder axis aligned",
      "Diameter: 14.5mm | Base Curve: 8.6mm",
      "Cylinder & Axis correction tailored to your optical prescription",
      "South Korean certified medical-grade hydrogel",
    ],
    inStock: true,
    isBestSeller: false,
    disposability: "three-month",
    lensWaterContent: "40% Water",
    lensDiameter: "14.5 mm",
    lensBaseCurve: "8.6 mm",
    lensPowerRange: "Sph -0.50 to -8.00D | Cyl -0.75 to -2.75D",
    availableColors: [
      {
        name: "Clear Toric",
        hex: "#bae6fd",
      },
    ],
    reviews: [],
  },
  {
    id: "cl-clearex-hd",
    name: "Clearex HD Transparent Contact Lenses",
    sku: "CL-CLX-HD",
    category: "clear-contacts",
    subCategory: "Daily Wear Clear Contact Lenses",
    gender: "unisex",
    brand: "Clearex HD",
    price: 2000,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616459/federal-optics/eyeglassimages/Transparent%20Lenses/Clearex%20HD%20RS.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Experience clear and comfortable vision with Clearex HD Transparent Contact Lenses. Designed for daily wear, these transparent lenses provide a natural look while helping you enjoy clear vision throughout your day. Enjoy clear vision with a natural look using Clearex HD Transparent Contact Lenses!",
    features: ["Type: Transparent Contact Lenses", "Brand: Clearex HD", "Power Range: -1.00 to -8.00", "Usage: Daily Wear", "Color: Clear / Transparent", "Design: Natural and comfortable fit", "Price includes lens kit"],
    inStock: true,
    isNew: true,
    lensPowerRange: "-1.00 to -8.00",
    availableColors: [{ name: "Clear Transparent", hex: "#e0f2fe" }],
    reviews: []
  },
  {
    id: "cl-quick-beauty-ew",
    name: "Quick Beauty Transparent Extended Wear Lenses",
    sku: "CL-QB-EW",
    category: "clear-contacts",
    subCategory: "Extended Wear Clear Contact Lenses",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 2850,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616461/federal-optics/eyeglassimages/Transparent%20Lenses/Quick%20Beauty%20Extended%20Wear%20rs%202850.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Experience beautiful eyes and comfortable vision with Quick Beauty Extended Wear Contact Lenses. Designed for extended daily use, these high-quality lenses offer a comfortable wearing experience along with a wide range of attractive colours and transparent options. Whether you prefer a natural eye look or a beautiful colour transformation, Quick Beauty has something for everyone!",
    features: ["Brand: Quick Beauty", "Type: Transparent Extended Wear Contact Lenses", "Wearing Time: Approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power Range: Available up to -10.00", "Comfort: Designed for a comfortable wearing experience", "Durability: Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions", "Available Options: Coloured and Transparent Lenses", "Available Colours: Grey, Sterling Grey, Luminous Grey, Brown, Pure Hazel, Honey, Blue, Green", "Price includes lens kit"],
    inStock: true,
    isNew: true,
    lensPowerRange: "Up to -10.00",
    availableColors: [{ name: "Clear Transparent", hex: "#e0f2fe" }],
    reviews: []
  },
  
  {
    id: "bl-dia-diamond-brown",
    name: "Bella Diamond — Diamond Brown",
    sku: "BL-DIA-01",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374960/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20%20DAIMOND%20BROWN/WhatsApp%20Image%202026-10-17%20at%2010.37.54%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374960/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20%20DAIMOND%20BROWN/WhatsApp%20Image%202026-10-17%20at%2010.37.54%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Diamond Brown shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Diamond Brown", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-agate-brown",
    name: "Bella Diamond — Agate Brown",
    sku: "BL-DIA-02",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20AGATE%20BROWN/WhatsApp%20Image%202026-10-17%20at%2010.37.59%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374960/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20AGATE%20BROWN/WhatsApp%20Image%202026-10-17%20at%2010.37.59%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Agate Brown shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Agate Brown", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-allure-blonde",
    name: "Bella Diamond — Allure Blonde",
    sku: "BL-DIA-03",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20ALLURE%20BLONDE/WhatsApp%20Image%202026-10-17%20at%209.00.18%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374960/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20ALLURE%20BLONDE/WhatsApp%20Image%202026-10-17%20at%209.00.18%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Allure Blonde shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Allure Blonde", hex: "#d97706" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-breeze",
    name: "Bella Diamond — Breeze",
    sku: "BL-DIA-04",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20BREEZE/WhatsApp%20Image%202026-10-17%20at%2010.38.00%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20BREEZE/WhatsApp%20Image%202026-10-17%20at%2010.38.01%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20BREEZE/WhatsApp%20Image%202026-10-17%20at%2010.38.01%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Breeze shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Blue",
    availableColors: [
      { name: "Breeze", hex: "#0284c7" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-brown-shadow",
    name: "Bella Diamond — Brown Shadow",
    sku: "BL-DIA-05",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20BROWN%20SHADOW/WhatsApp%20Image%202026-10-17%20at%209.00.17%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20BROWN%20SHADOW/WhatsApp%20Image%202026-10-17%20at%209.00.17%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Brown Shadow shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Brown Shadow", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-glitter-gray",
    name: "Bella Diamond — Glitter Gray",
    sku: "BL-DIA-06",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20GLITTER%20GRAY/WhatsApp%20Image%202026-10-17%20at%2010.38.02%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374961/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20GLITTER%20GRAY/WhatsApp%20Image%202026-10-17%20at%2010.38.02%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Glitter Gray shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Glitter Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-gray-green",
    name: "Bella Diamond — Gray Green",
    sku: "BL-DIA-07",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20GRAY%20GREEN/WhatsApp%20Image%202026-10-17%20at%2010.37.58%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20GRAY%20GREEN/WhatsApp%20Image%202026-10-17%20at%2010.37.57%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Gray Green shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Gray Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-mysterious",
    name: "Bella Diamond — Mysterious",
    sku: "BL-DIA-08",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20MYSTERIOUS/WhatsApp%20Image%202026-10-17%20at%2010.37.57%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20MYSTERIOUS/WhatsApp%20Image%202026-10-17%20at%2010.37.56%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20MYSTERIOUS/WhatsApp%20Image%202026-10-17%20at%2010.37.57%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Mysterious shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Mysterious", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-oak",
    name: "Bella Diamond — Oak",
    sku: "BL-DIA-09",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20OAK/WhatsApp%20Image%202026-10-17%20at%2010.37.59%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20OAK/WhatsApp%20Image%202026-10-17%20at%2010.37.58%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20OAK/WhatsApp%20Image%202026-10-17%20at%2010.37.59%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Oak shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Oak", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-silver-mist",
    name: "Bella Diamond — Silver Mist",
    sku: "BL-DIA-10",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20SILVER%20MIST/WhatsApp%20Image%202026-10-17%20at%2010.38.03%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374962/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20SILVER%20MIST/WhatsApp%20Image%202026-10-17%20at%2010.38.03%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Silver Mist shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Silver Mist", hex: "#94a3b8" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-wood-stone",
    name: "Bella Diamond — Wood Stone",
    sku: "BL-DIA-11",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20WOOD%20STONE/WhatsApp%20Image%202026-10-17%20at%2010.50.10%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMOND%20WOOD%20STONE/WhatsApp%20Image%202026-10-17%20at%2010.50.09%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Wood Stone shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Wood Stone", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-jade-green",
    name: "Bella Diamond — Jade Green",
    sku: "BL-DIA-12",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20JADE%20GREEN/WhatsApp%20Image%202026-10-17%20at%2010.38.00%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20JADE%20GREEN/WhatsApp%20Image%202026-10-17%20at%2010.38.00%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Jade Green shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Jade Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-moon-stone",
    name: "Bella Diamond — Moon Stone",
    sku: "BL-DIA-13",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20MOON%20STONE%20RS%205300/WhatsApp%20Image%202026-10-17%20at%209.00.15%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374963/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20MOON%20STONE%20RS%205300/WhatsApp%20Image%202026-10-17%20at%209.00.15%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20MOON%20STONE%20RS%205300/WhatsApp%20Image%202026-10-17%20at%209.00.16%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Moon Stone shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Moon Stone", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-nay",
    name: "Bella Diamond — Nay",
    sku: "BL-DIA-14",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20NAY/WhatsApp%20Image%202026-10-17%20at%2010.37.55%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20NAY/WhatsApp%20Image%202026-10-17%20at%2010.37.55%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Nay shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Nay", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "bl-dia-wood-leaf",
    name: "Bella Diamond — Wood Leaf",
    sku: "BL-DIA-15",
    category: 'color-contacts',
    subCategory: "Bella Diamond Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5300,
    originalPrice: 6500,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20WOOD%20LEAF/WhatsApp%20Image%202026-10-17%20at%209.00.16%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20DAIMOND/BELLA%20DAIMONDS%20WOOD%20LEAF/WhatsApp%20Image%202026-10-17%20at%209.00.16%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Wood Leaf shade from the Bella Diamond Collection. Exquisite diamond-patterned iris definition with luminous depth and captivating shimmer. Engineered with 38% water content polymacon for seamless, luxurious blend on brown Asian eyes.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Wood Leaf", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-amber-gray",
    name: "Bella Elite — Amber Gray",
    sku: "BL-ELT-01",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/AMBER%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.22.38%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/AMBER%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.22.38%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/AMBER%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.22.39%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Amber Gray shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Amber Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-cinnamon-brown",
    name: "Bella Elite — Cinnamon Brown",
    sku: "BL-ELT-02",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CINNAMON%20BROWN/WhatsApp%20Image%202026-10-17%20at%203.53.43%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CINNAMON%20BROWN/WhatsApp%20Image%202026-10-17%20at%203.53.43%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CINNAMON%20BROWN/WhatsApp%20Image%202026-10-17%20at%203.53.44%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Cinnamon Brown shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Cinnamon Brown", hex: "#b45309" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-cloudy-gray",
    name: "Bella Elite — Cloudy Gray",
    sku: "BL-ELT-03",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CLOUDY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.29.43%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374964/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CLOUDY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.29.43%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CLOUDY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.29.44%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Cloudy Gray shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Cloudy Gray", hex: "#94a3b8" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-crystal-n",
    name: "Bella Elite — Crystal N",
    sku: "BL-ELT-04",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CRYSTAL%20N/WhatsApp%20Image%202026-10-17%20at%203.46.09%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CRYSTAL%20N/WhatsApp%20Image%202026-10-17%20at%203.46.10%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/CRYSTAL%20N/WhatsApp%20Image%202026-10-17%20at%203.46.09%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Crystal N shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Crystal N", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-emerald-green",
    name: "Bella Elite — Emerald Green",
    sku: "BL-ELT-05",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/EMERALD%20GREEN/WhatsApp%20Image%202026-10-17%20at%203.43.26%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/EMERALD%20GREEN/WhatsApp%20Image%202026-10-17%20at%203.43.26%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374965/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/EMERALD%20GREEN/WhatsApp%20Image%202026-10-17%20at%203.43.26%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Emerald Green shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Emerald Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-gray-olive",
    name: "Bella Elite — Gray Olive",
    sku: "BL-ELT-06",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GRAY%20OLIVE/WhatsApp%20Image%202026-10-17%20at%203.35.50%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GRAY%20OLIVE/WhatsApp%20Image%202026-10-17%20at%203.35.51%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GRAY%20OLIVE/WhatsApp%20Image%202026-10-17%20at%203.35.51%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Gray Olive shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Gray Olive", hex: "#4d7c0f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-green-olive",
    name: "Bella Elite — Green Olive",
    sku: "BL-ELT-07",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GREEN%20OLIVE/WhatsApp%20Image%202026-10-17%20at%204.00.21%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GREEN%20OLIVE/WhatsApp%20Image%202026-10-17%20at%204.00.22%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GREEN%20OLIVE/WhatsApp%20Image%202026-10-17%20at%204.00.22%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Green Olive shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Green Olive", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-grey-beige",
    name: "Bella Elite — Grey Beige",
    sku: "BL-ELT-08",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GREY%20BEIGE/WhatsApp%20Image%202026-10-17%20at%203.34.53%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GREY%20BEIGE/WhatsApp%20Image%202026-10-17%20at%203.34.54%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374966/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/GREY%20BEIGE/WhatsApp%20Image%202026-10-17%20at%203.34.53%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Grey Beige shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Grey Beige", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-lavender-gray",
    name: "Bella Elite — Lavender Gray",
    sku: "BL-ELT-09",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/LAVENDER%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.32.01%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/LAVENDER%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.32.01%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/LAVENDER%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.32.01%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Lavender Gray shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Lavender Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-matt-olive",
    name: "Bella Elite — Matt Olive",
    sku: "BL-ELT-10",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MATT%20OLIVE/WhatsApp%20Image%202026-10-17%20at%203.41.07%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MATT%20OLIVE/WhatsApp%20Image%202026-10-17%20at%203.41.08%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MATT%20OLIVE/WhatsApp%20Image%202026-10-17%20at%203.41.07%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Matt Olive shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Matt Olive", hex: "#4d7c0f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-midnight-blue",
    name: "Bella Elite — Midnight Blue",
    sku: "BL-ELT-11",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MIDNIGHT%20BLUE/WhatsApp%20Image%202026-10-17%20at%203.33.17%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MIDNIGHT%20BLUE/WhatsApp%20Image%202026-10-17%20at%203.33.17%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MIDNIGHT%20BLUE/WhatsApp%20Image%202026-10-17%20at%203.33.18%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Midnight Blue shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Blue",
    availableColors: [
      { name: "Midnight Blue", hex: "#0284c7" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-mint-gray",
    name: "Bella Elite — Mint Gray",
    sku: "BL-ELT-12",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MINT%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.37.13%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MINT%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.37.14%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374967/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/MINT%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.37.13%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Mint Gray shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Mint Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-sandy-brown",
    name: "Bella Elite — Sandy Brown",
    sku: "BL-ELT-13",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SANDY%20BROWN/WhatsApp%20Image%202026-10-17%20at%203.58.04%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SANDY%20BROWN/WhatsApp%20Image%202026-10-17%20at%203.58.05%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SANDY%20BROWN/WhatsApp%20Image%202026-10-17%20at%203.58.05%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Sandy Brown shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Sandy Brown", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-sandy-gray",
    name: "Bella Elite — Sandy Gray",
    sku: "BL-ELT-14",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SANDY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.57.09%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SANDY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.57.09%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SANDY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.57.10%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Sandy Gray shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Sandy Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-silky-gold",
    name: "Bella Elite — Silky Gold",
    sku: "BL-ELT-15",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GOLD/WhatsApp%20Image%202026-10-17%20at%203.40.37%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GOLD/WhatsApp%20Image%202026-10-17%20at%203.40.37%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374968/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GOLD/WhatsApp%20Image%202026-10-17%20at%203.40.37%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Silky Gold shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Silky Gold", hex: "#d97706" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-silky-gray",
    name: "Bella Elite — Silky Gray",
    sku: "BL-ELT-16",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.55.44%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374970/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.55.44%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GRAY/WhatsApp%20Image%202026-10-17%20at%203.55.45%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Silky Gray shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Silky Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-silky-green",
    name: "Bella Elite — Silky Green",
    sku: "BL-ELT-17",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GREEN/WhatsApp%20Image%202026-10-17%20at%203.39.13%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GREEN/WhatsApp%20Image%202026-10-17%20at%203.39.13%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/SILKY%20GREEN/WhatsApp%20Image%202026-10-17%20at%203.39.13%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Silky Green shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Silky Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-elt-wild-honey",
    name: "Bella Elite — Wild Honey",
    sku: "BL-ELT-18",
    category: 'color-contacts',
    subCategory: "Bella Elite Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 5450,
    originalPrice: 6800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/WILD%20HONEY/WhatsApp%20Image%202026-10-17%20at%203.59.18%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374970/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/WILD%20HONEY/WhatsApp%20Image%202026-10-17%20at%203.59.19%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374969/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20ELLITE%20rs%205450/WILD%20HONEY/WhatsApp%20Image%202026-10-17%20at%203.59.18%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Wild Honey shade from the Bella Elite Collection. Celebrity-favorite subtle multi-tone color gradation with a delicate limbal ring. Ultra-natural iris enlargement engineered for formal galas, weddings, and premium everyday wear.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Wild Honey", hex: "#d97706" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-gray-caramel",
    name: "Bella Glow — Gray Caramel",
    sku: "BL-GLW-01",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374971/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/GRAY%20CARAMEL/WhatsApp%20Image%202026-10-17%20at%204.29.54%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374972/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/GRAY%20CARAMEL/WhatsApp%20Image%202026-10-17%20at%204.29.54%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Gray Caramel shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Gray Caramel", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-husky-gray-green",
    name: "Bella Glow — Husky Gray Green",
    sku: "BL-GLW-02",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374970/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/HUSKY%20GRAY%20GREEN/WhatsApp%20Image%202026-10-17%20at%204.25.18%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374971/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/HUSKY%20GRAY%20GREEN/WhatsApp%20Image%202026-10-17%20at%204.25.18%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Husky Gray Green shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Husky Gray Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-lime-green",
    name: "Bella Glow — Lime Green",
    sku: "BL-GLW-03",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374971/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/LIME%20GREEN/WhatsApp%20Image%202026-10-17%20at%204.31.33%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/LIME%20GREEN/WhatsApp%20Image%202026-10-17%20at%204.31.34%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Lime Green shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Lime Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-luminous-pearl",
    name: "Bella Glow — Luminous Pearl",
    sku: "BL-GLW-04",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374972/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/LUMINOUS%20PEARL/WhatsApp%20Image%202026-10-17%20at%204.30.48%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374971/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/LUMINOUS%20PEARL/WhatsApp%20Image%202026-10-17%20at%204.30.48%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Luminous Pearl shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Luminous Pearl", hex: "#94a3b8" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-navy-gray",
    name: "Bella Glow — Navy Gray",
    sku: "BL-GLW-05",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/NAVY%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.33.14%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374972/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/NAVY%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.33.15%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Navy Gray shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Navy Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-radiant-brown",
    name: "Bella Glow — Radiant Brown",
    sku: "BL-GLW-06",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374972/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/RADIANT%20BROWN/WhatsApp%20Image%202026-10-17%20at%204.28.02%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374972/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/RADIANT%20BROWN/WhatsApp%20Image%202026-10-17%20at%204.28.03%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/RADIANT%20BROWN/WhatsApp%20Image%202026-10-17%20at%204.28.03%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Radiant Brown shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Radiant Brown", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-radiant-gray",
    name: "Bella Glow — Radiant Gray",
    sku: "BL-GLW-07",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374972/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/RADIANT%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.34.28%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374972/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/RADIANT%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.34.28%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Radiant Gray shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Radiant Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-radiant-hazelnut",
    name: "Bella Glow — Radiant Hazelnut",
    sku: "BL-GLW-08",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/RADIANT%20HAZELNUT/WhatsApp%20Image%202026-10-17%20at%204.28.59%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/RADIANT%20HAZELNUT/WhatsApp%20Image%202026-10-17%20at%204.29.00%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Radiant Hazelnut shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Radiant Hazelnut", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "bl-glw-vivid-blue",
    name: "Bella Glow — Vivid Blue",
    sku: "BL-GLW-09",
    category: 'color-contacts',
    subCategory: "Bella Glow Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/VIVID%20BLUE/WhatsApp%20Image%202026-10-17%20at%204.32.35%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/VIVID%20BLUE/WhatsApp%20Image%202026-10-17%20at%204.32.35%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374973/federal-optics/eyeglassimages/color%20contact%20lenses/BELLA%20GLOW%20RS%204800/VIVID%20BLUE/WhatsApp%20Image%202026-10-17%20at%204.32.34%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Vivid Blue shade from the Bella Glow Collection. High-impact radiant colors with soft limbal contour. Instantly illuminates facial expressions with vivid, glowing iris tones that catch ambient light flawlessly.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Blue",
    availableColors: [
      { name: "Vivid Blue", hex: "#0284c7" }
    ],
    reviews: []
  },
  
  {
    id: "bl-nat-cool-gray",
    name: "Bella Natural — Cool Gray",
    sku: "BL-NAT-01",
    category: 'color-contacts',
    subCategory: "Bella Natural Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/COOL%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.48.48%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/COOL%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.48.48%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/COOL%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.48.49%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Cool Gray shade from the Bella Natural Collection. Two-tone natural pigment blending that integrates seamlessly with your eye depth. Soft contrast outer ring creates effortless, natural sophistication.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Cool Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-nat-cool-hazel",
    name: "Bella Natural — Cool Hazel",
    sku: "BL-NAT-02",
    category: 'color-contacts',
    subCategory: "Bella Natural Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/COOL%20HAZEL/WhatsApp%20Image%202026-10-17%20at%204.49.56%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/COOL%20HAZEL/WhatsApp%20Image%202026-10-17%20at%204.49.56%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/COOL%20HAZEL/WhatsApp%20Image%202026-10-17%20at%204.49.56%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Cool Hazel shade from the Bella Natural Collection. Two-tone natural pigment blending that integrates seamlessly with your eye depth. Soft contrast outer ring creates effortless, natural sophistication.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Cool Hazel", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "bl-nat-natural-gray",
    name: "Bella Natural — Natural Gray",
    sku: "BL-NAT-03",
    category: 'color-contacts',
    subCategory: "Bella Natural Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/NATURAL%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.43.08%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/NATURAL%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.43.08%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Natural Gray shade from the Bella Natural Collection. Two-tone natural pigment blending that integrates seamlessly with your eye depth. Soft contrast outer ring creates effortless, natural sophistication.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Natural Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "bl-nat-viola-gray",
    name: "Bella Natural — Viola Gray",
    sku: "BL-NAT-04",
    category: 'color-contacts',
    subCategory: "Bella Natural Collection",
    gender: 'unisex',
    brand: "Bella",
    price: 4800,
    originalPrice: 6000,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/VIOLA%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.47.11%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/VIOLA%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.47.12%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374974/federal-optics/eyeglassimages/color%20contact%20lenses/Bella%20Natural%20Coloured%20Contact%20Lenses%20rs%204800/VIOLA%20GRAY/WhatsApp%20Image%202026-10-17%20at%204.47.12%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Viola Gray shade from the Bella Natural Collection. Two-tone natural pigment blending that integrates seamlessly with your eye depth. Soft contrast outer ring creates effortless, natural sophistication.",
    features: [
      "High moisture retention (38%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Designed in Lebanon / UAE",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Viola Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-amber-grey",
    name: "Optiano Glamorous — Amber Grey",
    sku: "OPT-GLM-01",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/AMBER%20GREY/WhatsApp%20Image%202026-10-17%20at%205.22.23%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/AMBER%20GREY/WhatsApp%20Image%202026-10-17%20at%205.22.23%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Amber Grey shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Amber Grey", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-emerald-green",
    name: "Optiano Glamorous — Emerald Green",
    sku: "OPT-GLM-02",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/EMERALD%20GREEN/WhatsApp%20Image%202026-10-17%20at%205.28.17%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/EMERALD%20GREEN/WhatsApp%20Image%202026-10-17%20at%205.28.17%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Emerald Green shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Emerald Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-honey",
    name: "Optiano Glamorous — Honey",
    sku: "OPT-GLM-03",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/HONEY/WhatsApp%20Image%202026-10-17%20at%205.24.09%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/HONEY/WhatsApp%20Image%202026-10-17%20at%205.24.09%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Honey shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Honey", hex: "#d97706" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-ice-blue",
    name: "Optiano Glamorous — Ice Blue",
    sku: "OPT-GLM-04",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/ICE%20BLUE/WhatsApp%20Image%202026-10-17%20at%205.27.42%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/ICE%20BLUE/m.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Ice Blue shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Blue",
    availableColors: [
      { name: "Ice Blue", hex: "#0284c7" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-pearl-grey",
    name: "Optiano Glamorous — Pearl Grey",
    sku: "OPT-GLM-05",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/PEARL%20GREY/WhatsApp%20Image%202026-10-17%20at%205.26.40%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/PEARL%20GREY/WhatsApp%20Image%202026-10-17%20at%205.26.41%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Pearl Grey shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Pearl Grey", hex: "#94a3b8" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-sea-green",
    name: "Optiano Glamorous — Sea Green",
    sku: "OPT-GLM-06",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/SEA%20GREEN/WhatsApp%20Image%202026-10-17%20at%205.24.49%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374975/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/SEA%20GREEN/WhatsApp%20Image%202026-10-17%20at%205.24.49%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Sea Green shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Sea Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-topaz",
    name: "Optiano Glamorous — Topaz",
    sku: "OPT-GLM-07",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374977/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/TOPAZ/WhatsApp%20Image%202026-10-17%20at%205.25.45%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/TOPAZ/WhatsApp%20Image%202026-10-17%20at%205.25.46%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Topaz shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Blue",
    availableColors: [
      { name: "Topaz", hex: "#0284c7" }
    ],
    reviews: []
  },
  
  {
    id: "opt-glm-white-rose",
    name: "Optiano Glamorous — White Rose",
    sku: "OPT-GLM-08",
    category: 'color-contacts',
    subCategory: "Optiano Glamorous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3450,
    originalPrice: 4400,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/WHITE%20ROSE/WhatsApp%20Image%202026-10-17%20at%205.29.56%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20Glamorous%20Collection%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20%2C%20RS%203450/WHITE%20ROSE/WhatsApp%20Image%202026-10-17%20at%205.29.56%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "White Rose shade from the Optiano Glamorous Collection. Striking Korean high-definition iris design with radiant color payoff. Manufactured in South Korea with international medical CE & ISO certifications for breathable ocular comfort.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "White Rose", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "opt-gor-warm-gray",
    name: "Optiano Gorgeous — Warm Gray",
    sku: "OPT-GOR-01",
    category: 'color-contacts',
    subCategory: "Optiano Gorgeous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/WARM%20GRAY/WhatsApp%20Image%202026-10-17%20at%2010.44.29%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/WARM%20GRAY/WhatsApp%20Image%202026-10-17%20at%2010.44.29%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Warm Gray shade from the Optiano Gorgeous Collection. Premium Korean cosmetic lenses featuring rich gradient transitions and soft contouring. Globally safety approved with medical-grade Korean hydrogel for long-lasting hydration.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Warm Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "opt-gor-warm-hazel",
    name: "Optiano Gorgeous — Warm Hazel",
    sku: "OPT-GOR-02",
    category: 'color-contacts',
    subCategory: "Optiano Gorgeous Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/WARM%20HAZEL/WhatsApp%20Image%202026-10-17%20at%2010.43.38%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/WARM%20HAZEL/WhatsApp%20Image%202026-10-17%20at%2010.43.38%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Warm Hazel shade from the Optiano Gorgeous Collection. Premium Korean cosmetic lenses featuring rich gradient transitions and soft contouring. Globally safety approved with medical-grade Korean hydrogel for long-lasting hydration.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Warm Hazel", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-aqua",
    name: "Optiano Classic — Aqua",
    sku: "OPT-CLS-01",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/AQUA/WhatsApp%20Image%202026-10-17%20at%205.15.01%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/AQUA/WhatsApp%20Image%202026-10-17%20at%205.15.01%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Aqua shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Blue",
    availableColors: [
      { name: "Aqua", hex: "#0284c7" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-brown",
    name: "Optiano Classic — Brown",
    sku: "OPT-CLS-02",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/BROWN/WhatsApp%20Image%202026-10-17%20at%205.06.44%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/BROWN/WhatsApp%20Image%202026-10-17%20at%205.06.45%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Brown shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Brown", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-cloud",
    name: "Optiano Classic — Cloud",
    sku: "OPT-CLS-03",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/CLOUD/WhatsApp%20Image%202026-10-17%20at%205.04.58%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/CLOUD/WhatsApp%20Image%202026-10-17%20at%205.04.58%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Cloud shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Cloud", hex: "#94a3b8" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-cool-gray",
    name: "Optiano Classic — Cool Gray",
    sku: "OPT-CLS-04",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/COOL%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.03.23%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/COOL%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.03.23%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Cool Gray shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Cool Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-dark-gray",
    name: "Optiano Classic — Dark Gray",
    sku: "OPT-CLS-05",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/DARK%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.01.21%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/DARK%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.01.21%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Dark Gray shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Dark Gray", hex: "#475569" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-enchant-brown",
    name: "Optiano Classic — Enchant Brown",
    sku: "OPT-CLS-06",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/ENCHANT%20BROWN/WhatsApp%20Image%202026-10-17%20at%205.08.30%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/ENCHANT%20BROWN/WhatsApp%20Image%202026-10-17%20at%205.08.30%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Enchant Brown shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Enchant Brown", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-enchant-gray",
    name: "Optiano Classic — Enchant Gray",
    sku: "OPT-CLS-07",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/ENCHANT%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.05.48%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/ENCHANT%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.05.48%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Enchant Gray shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Enchant Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-green",
    name: "Optiano Classic — Green",
    sku: "OPT-CLS-08",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/GREEN/WhatsApp%20Image%202026-10-17%20at%205.13.42%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374979/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/GREEN/WhatsApp%20Image%202026-10-17%20at%205.13.42%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Green shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-hazel",
    name: "Optiano Classic — Hazel",
    sku: "OPT-CLS-09",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/HAZEL/WhatsApp%20Image%202026-10-17%20at%205.07.12%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/HAZEL/WhatsApp%20Image%202026-10-17%20at%205.07.13%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Hazel shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Hazel", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-pure-hazel",
    name: "Optiano Classic — Pure Hazel",
    sku: "OPT-CLS-10",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/PURE%20HAZEL/WhatsApp%20Image%202026-10-17%20at%205.07.48%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/PURE%20HAZEL/WhatsApp%20Image%202026-10-17%20at%205.07.48%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Pure Hazel shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Pure Hazel", hex: "#a16207" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-sepia",
    name: "Optiano Classic — Sepia",
    sku: "OPT-CLS-11",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SEPIA/WhatsApp%20Image%202026-10-17%20at%205.09.09%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374980/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SEPIA/WhatsApp%20Image%202026-10-17%20at%205.09.09%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Sepia shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Hazel",
    availableColors: [
      { name: "Sepia", hex: "#78350f" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-spark-gray",
    name: "Optiano Classic — Spark Gray",
    sku: "OPT-CLS-12",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SPARK%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.04.15%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SPARK%20GRAY/WhatsApp%20Image%202026-10-17%20at%205.04.15%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Spark Gray shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Grey",
    availableColors: [
      { name: "Spark Gray", hex: "#64748b" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-spark-green",
    name: "Optiano Classic — Spark Green",
    sku: "OPT-CLS-13",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SPARK%20GREEN/WhatsApp%20Image%202026-10-17%20at%205.14.28%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SPARK%20GREEN/WhatsApp%20Image%202026-10-17%20at%205.14.29%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Spark Green shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Green",
    availableColors: [
      { name: "Spark Green", hex: "#15803d" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-spark-turquoise",
    name: "Optiano Classic — Spark Turquoise",
    sku: "OPT-CLS-14",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SPARK%20TURQUOISE/WhatsApp%20Image%202026-10-17%20at%205.16.25%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/SPARK%20TURQUOISE/WhatsApp%20Image%202026-10-17%20at%205.16.25%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Spark Turquoise shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Blue",
    availableColors: [
      { name: "Spark Turquoise", hex: "#0284c7" }
    ],
    reviews: []
  },
  
  {
    id: "opt-cls-violet",
    name: "Optiano Classic — Violet",
    sku: "OPT-CLS-15",
    category: 'color-contacts',
    subCategory: "Optiano Classic Collection",
    gender: 'unisex',
    brand: "Optiano",
    price: 3000,
    originalPrice: 3800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/VIOLET/WhatsApp%20Image%202026-10-17%20at%205.15.50%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20HIGH%20QUALITY%20LENSES%20MADE%20IN%20KOREA%20%2C%20GLOBALLY%20SAFETY%20APPROVED%20RS%203000/VIOLET/WhatsApp%20Image%202026-10-17%20at%205.15.50%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"
    ],
    description: "Violet shade from the Optiano Classic Collection. High-quality Korean color contact lenses. Vivid, reliable color payoff with smooth tear-layer hydration, certified safe for sensitive eyes with international medical approvals.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.2 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions"
    ],
    inStock: true,
    disposability: 'three-month',
    lensColor: "Violet",
    availableColors: [
      { name: "Violet", hex: "#7c3aed" }
    ],
    reviews: []
  },
  
  {
    id: "ac-pnt-p2",
    name: "Penta Plex P2 Multi-Action Disinfectant Solution",
    sku: "AC-PNT-P2",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Penta Plex",
    price: 1100,
    originalPrice: 1400,
    packOptions: [
      {
        id: "120ml",
        name: "120ml Everyday Bottle",
        price: 1100,
      },
      {
        id: "350ml",
        name: "350ml Economy Value Pack",
        price: 2250,
        savingsBadge: "Best Value",
      },
    ],
    rating: 5.0,
    reviewCount: 36,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374957/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/PENTA%20PLEX%20P2%20120ml%20rs%201100.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375135/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/PENTA%20PLEX%20P2%20350ml%20rs%202250.jpg",
    ],
    description: "Penta Plex P2 is a premium multi-purpose disinfectant and conditioning solution formulated for soft contact lenses. Eliminates 99.9% of bacteria, dissolves stubborn protein deposits, and maintains moist comfort for up to 16 hours.",
    features: [
      "Cleans, rinses, disinfects, and dissolves surface protein deposits",
      "Available in 120ml compact size and 350ml economy value pack",
      "Ophthalmic balanced pH buffers guard against eye redness",
      "Suitable for all daily, monthly, and quarterly soft contact lenses",
    ],
    inStock: true,
    isBestSeller: true,
    availableColors: [
      {
        name: "Sterile Optical Solution",
        hex: "#0284c7",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-cry-150",
    name: "Crysta 150ml Multi-Purpose Disinfectant Lens Solution",
    sku: "AC-CRY-150",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Crysta",
    price: 500,
    originalPrice: 650,
    rating: 4.8,
    reviewCount: 24,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/Crysta%20150ml.%20Multi-purpose%20Disinfectant%20Solution%20For%20Soft%20Contact%20Lenses%20RS%20500.jpg",
    ],
    description: "Crysta 150ml multi-purpose disinfectant solution formulated for soft contact lenses. Effectively clears lipid film and hydrates lenses for smooth daily insertion.",
    features: [
      "Complete 4-in-1 action: Cleans, rinses, stores, and disinfects",
      "Hydrating comfort cushion reduces lens friction",
      "150ml bottle with precision dropper nozzle",
      "Formulated for soft hydrophilic contact lenses",
    ],
    inStock: true,
    availableColors: [
      {
        name: "Clear Solution",
        hex: "#38bdf8",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-cry-gp",
    name: "Crysta Crys GP 120ml RGP Hard Contact Lens Solution",
    sku: "AC-CRY-GP",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Crysta",
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    reviewCount: 18,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/Crysta%20Crys%20GP%20120ml.RGP%20Solution%20for%20Hard%20Contact%20Lenses%20rs%201850.jpg",
    ],
    description: "Crysta Crys GP 120ml specialized conditioning and cleaning solution specifically designed for Rigid Gas Permeable (RGP) and hard contact lenses.",
    features: [
      "Specialized for Rigid Gas Permeable (RGP) and hard contact lenses",
      "Powerful lipid and protein removal without surface scratching",
      "Enhances surface wettability for seamless blinking",
      "Doctor recommended for keratoconus and specialized RGP wearers",
    ],
    inStock: true,
    availableColors: [
      {
        name: "RGP Formula",
        hex: "#0ea5e9",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-cry-kit",
    name: "Crysta Contact Lens Travel Kit (75ml Solution + Case + Pouch)",
    sku: "AC-CRY-KIT",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Crysta",
    price: 350,
    originalPrice: 500,
    rating: 4.9,
    reviewCount: 45,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374957/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/Crysta%20lens%20kit%2075ml.%20Solution%2C%20lens%20case%20and%20poch%20rs%20350.jpg",
    ],
    description: "Complete portable contact lens travel kit including 75ml sterile disinfectant solution, dual leak-proof lens case, and protective travel pouch. Flight and handbag approved.",
    features: [
      "Includes 75ml solution bottle, dual lens case, and zip travel pouch",
      "TSA / cabin luggage friendly size",
      "Leak-proof cap design prevents handbag spills",
      "Essential for office, vacations, and gym bags",
    ],
    inStock: true,
    isBestSeller: true,
    availableColors: [
      {
        name: "Complete Travel Kit",
        hex: "#6366f1",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-imp-120",
    name: "Impact Excel 120ml Multi-Purpose Contact Lens Solution",
    sku: "AC-IMP-120",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Impact Excel",
    price: 160,
    originalPrice: 220,
    rating: 4.7,
    reviewCount: 19,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374957/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/Impact%20excel%20120ml.%20rs%20160.jpg",
    ],
    description: "Impact Excel 120ml reliable daily contact lens solution. High-value everyday cleaning, rinsing, and storage solution for students and daily wearers.",
    features: [
      "Affordable daily maintenance solution",
      "120ml bottle with safety seal",
      "Mild disinfectant action for sensitive eyes",
    ],
    inStock: true,
    availableColors: [
      {
        name: "Sterile Solution",
        hex: "#38bdf8",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-slt-120",
    name: "Solite 120ml Soothing Contact Lens Solution",
    sku: "AC-SLT-120",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Solite",
    price: 360,
    originalPrice: 450,
    rating: 4.8,
    reviewCount: 14,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374957/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/Solite%20120%20ml%20360.jpg",
    ],
    description: "Solite 120ml gentle contact lens disinfectant solution. Moisture-enhancing formulation for sensitive cornea profiles and dry AC environments.",
    features: [
      "Comfort-enhanced formula reduces dry eye sensation",
      "Safe for daily cleaning and overnight storage",
      "Made with isotonic buffering agents",
    ],
    inStock: true,
    availableColors: [
      {
        name: "Soothing Solution",
        hex: "#0284c7",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-ult-120",
    name: "Ultimate Plus 120ml Advanced Contact Lens Solution",
    sku: "AC-ULT-120",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Ultimate Plus",
    price: 560,
    originalPrice: 700,
    rating: 4.8,
    reviewCount: 17,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374958/federal-optics/eyeglassimages/Asscesoories/lens%20accsessores/Ultimate%20Plus%20120ml.rs560.jpg",
    ],
    description: "Ultimate Plus 120ml high-efficiency contact lens disinfectant solution. Rapid protein breakdown and surface lubricity for long-wearing soft contact lenses.",
    features: [
      "Advanced antimicrobial efficacy",
      "Lubricating surface barrier lasts throughout the day",
      "Ideal for colored and transparent contact lenses",
    ],
    inStock: true,
    availableColors: [
      {
        name: "Advanced Formula",
        hex: "#2563eb",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-gl-hook",
    name: "Glasses Anti-Slip Silicone Ear Hooks (Comfort Grips)",
    sku: "AC-GL-HOOK",
    category: "accessories",
    subCategory: "Eyewear Accessories",
    gender: "unisex",
    brand: "Federal Care",
    price: 250,
    originalPrice: 400,
    rating: 4.9,
    reviewCount: 58,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/glass%20accesssories/Glasses%20Anti%20Slip%20Silicone%20Ear%20Hooks%20rs%20250/WhatsApp%20Image%202026-10-22%20at%203.26.06%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/glass%20accesssories/Glasses%20Anti%20Slip%20Silicone%20Ear%20Hooks%20rs%20250/WhatsApp%20Image%202026-10-22%20at%203.26.07%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/glass%20accesssories/Glasses%20Anti%20Slip%20Silicone%20Ear%20Hooks%20rs%20250/WhatsApp%20Image%202026-10-22%20at%203.26.07%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/glass%20accesssories/Glasses%20Anti%20Slip%20Silicone%20Ear%20Hooks%20rs%20250/real%20look.jpg",
    ],
    description: "Soft medical-grade silicone temple ear hooks. Secures eyewear firmly behind the ears, eliminating slipping during gym workouts, active work, driving, or heat.",
    features: [
      "Prevents glasses from sliding down your nose bridge",
      "Skin-friendly flexible silicone (sweat-proof & washable)",
      "Fits nearly all thin and thick temple arms",
      "Discrete behind-the-ear profile",
    ],
    inStock: true,
    isBestSeller: true,
    availableColors: [
      {
        name: "Clear Transparent",
        hex: "#f1f5f9",
      },
      {
        name: "Stealth Black",
        hex: "#18181b",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-gl-rope",
    name: "Adjustable Eyewear Retainer Cord (Glasses Rope / Dori)",
    sku: "AC-GL-ROPE",
    category: "accessories",
    subCategory: "Eyewear Accessories",
    gender: "unisex",
    brand: "Federal Care",
    price: 150,
    originalPrice: 250,
    rating: 4.8,
    reviewCount: 42,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/glass%20accesssories/Glasses%20Rope%20%28%20Dori%29%20rs%20150/WhatsApp%20Image%202026-10-22%20at%203.31.22%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/glass%20accesssories/Glasses%20Rope%20%28%20Dori%29%20rs%20150/WhatsApp%20Image%202026-10-22%20at%203.31.23%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/glass%20accesssories/Glasses%20Rope%20%28%20Dori%29%20rs%20150/WhatsApp%20Image%202026-10-22%20at%203.31.23%20PM.jpg",
    ],
    description: "Durable braided nylon eyeglasses retainer cord (dori) with rubber gripping loops. Hangs comfortably around the neck for easy on/off access during reading, work, and sports.",
    features: [
      "Adjustable locking slider for custom tightness",
      "High-tensile woven cord resists fraying",
      "Universal rubber connector fits any frame temple",
      "Available in multiple colors",
    ],
    inStock: true,
    availableColors: [
      {
        name: "Midnight Black",
        hex: "#09090b",
      },
      {
        name: "Navy Blue",
        hex: "#1e3a8a",
      },
      {
        name: "Ruby Red",
        hex: "#991b1b",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-cln-120",
    name: "Federal Optical Lens & Glass Cleaner Spray (Anti-Smudge)",
    sku: "AC-CLN-120",
    category: "accessories",
    subCategory: "Lens Solutions & Care",
    gender: "unisex",
    brand: "Federal Care",
    price: 120,
    originalPrice: 200,
    rating: 4.9,
    reviewCount: 65,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374956/federal-optics/eyeglassimages/Asscesoories/Glass%20cleaner%20RS%20120/WhatsApp%20Image%202026-10-20%20at%206.59.48%20PM.jpg",
    ],
    description: "Professional anti-static and anti-fog lens cleaner spray. Safe for all multi-coated, anti-reflective, and photochromic optical lenses. Dissolves oils and finger smudges instantly.",
    features: [
      "Streak-free crystal clarity with one spritz",
      "Safe for high-index, anti-glare, and blue-cut optical coatings",
      "Anti-static dust-repellent barrier",
      "Compact spray bottle fits in pocket or desk drawer",
    ],
    inStock: true,
    isBestSeller: true,
    availableColors: [
      {
        name: "Optical Cleaner",
        hex: "#06b6d4",
      },
    ],
    reviews: [],
  },
  
  {
    id: "ac-sg-box",
    name: "Luxury Designer Sunglass Protective Hard Box Case",
    sku: "AC-SG-BOX",
    category: "accessories",
    subCategory: "Eyewear Accessories",
    gender: "unisex",
    brand: "Federal Atelier",
    price: 2000,
    originalPrice: 2800,
    rating: 5.0,
    reviewCount: 29,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374958/federal-optics/eyeglassimages/Asscesoories/Sunglass%20Boxes%20RS%202000%20each/WhatsApp%20Image%202026-10-20%20at%206.46.17%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374957/federal-optics/eyeglassimages/Asscesoories/Sunglass%20Boxes%20RS%202000%20each/WhatsApp%20Image%202026-10-20%20at%206.46.17%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374957/federal-optics/eyeglassimages/Asscesoories/Sunglass%20Boxes%20RS%202000%20each/WhatsApp%20Image%202026-10-20%20at%206.46.18%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374957/federal-optics/eyeglassimages/Asscesoories/Sunglass%20Boxes%20RS%202000%20each/WhatsApp%20Image%202026-10-20%20at%206.48.51%20PM.jpg",
    ],
    description: "Premium crush-proof protective sunglasses presentation box with magnetic latch, plush interior lining, and luxury texture finish. Designed to house oversized and designer sunglasses.",
    features: [
      "Rigid crush-proof chassis shields expensive lenses",
      "Magnetic flip closure with gold-stamped detailing",
      "Velveteen interior prevents lens abrasions",
      "Fits oversized sunglasses, aviators, and sports shields",
    ],
    inStock: true,
    isBestSeller: true,
    availableColors: [
      {
        name: "Luxury Matte Black",
        hex: "#18181b",
      },
      {
        name: "Classic Tan Brown",
        hex: "#92400e",
      },
    ],
    reviews: [],
  },
  
  {
    id: 'police-clip-on-black-yellow',
    name: "Police Dual-Vision Metal Eyeglasses with Night-Vision Clip-On",
    sku: 'POL-3500-CLIP',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: "Police",
    price: 3500,
    originalPrice: 4800,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/POLICE/police%20metal%20frame%20black%20yellow%20attchment%20rs%203500/WhatsApp%20Image%202026-09-20%20at%203.01.51%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/POLICE/police%20metal%20frame%20black%20yellow%20attchment%20rs%203500/WhatsApp%20Image%202026-09-20%20at%203.01.52%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/POLICE/police%20metal%20frame%20black%20yellow%20attchment%20rs%203500/WhatsApp%20Image%202026-09-20%20at%203.01.53%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375003/federal-optics/eyeglassimages/POLICE/police%20metal%20frame%20black%20yellow%20attchment%20rs%203500/WhatsApp%20Image%202026-09-20%20at%203.01.54%20PM%20%281%29.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375003/federal-optics/eyeglassimages/POLICE/police%20metal%20frame%20black%20yellow%20attchment%20rs%203500/WhatsApp%20Image%202026-09-20%20at%203.01.54%20PM.jpg',
    ],
    description: "Engineered for versatile day-and-night clarity. Includes magnetic high-contrast yellow night-driving filter and dark UV polarized clip-on attachments over a resilient monel metal frame.",
    features: [
      "Dual magnetic attachment system (Day Polarized & Night-Vision Yellow)",
      "Precision monel alloy construction with reinforced spring temples",
      "Adjustable silicone medical-grade nose pads",
      "Includes protective hard case and lens cloth",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'rectangle',
    frameMaterial: "Monel Metal Alloy with Magnetic Clip-On",
    rimType: 'Full Rim',
    frameSize: '54-17-142',
    measurements: {
      lensWidth: 54,
      bridgeWidth: 17,
      templeLength: 142,
      frameWeight: '22.5g'
    },
    availableColors: [
      { name: "Matte Black with Yellow Night-Vision Clip", hex: '#1f1f1f' }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-metal-wire-arista-gold',
    aliases: [
      "rayban-metal-wire-satin-black",
      "rayban-metal-wire-pewter-silver"
    ],
    name: 'Ray-Ban Fine Wire Round Metal',
    sku: 'RB-3447V',
    category: 'eyeglasses',
    subCategory: "Unisex Eyeglasses",
    gender: 'unisex',
    brand: "Ray-Ban",
    price: 4450,
    originalPrice: 5900,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.53%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.54%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.55%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.56%20PM.jpg"
    ],
    description: "Timeless round full-rim optical frame executed in fine-gauge high-tensile wire metal. Lightweight, comfortable, and tailored for single-vision or progressive prescription lenses.",
    features: [
      "Ultra-fine round monel wire metal frame",
      "Signature embossed temple detailing with transparent temple tips",
      "Hypoallergenic adjustable bridge pads",
      "Engineered for all-day ergonomic balance",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'round',
    frameMaterial: "High-Grade Fine Metal Alloy",
    rimType: 'Full Rim',
    frameSize: '50-21-145',
    measurements: {
      lensWidth: 50,
      bridgeWidth: 21,
      templeLength: 145,
      frameWeight: '16.8g'
    },
    availableColors: [
      {
        id: "rayban-metal-wire-arista-gold",
        name: "Polished Arista Gold",
        hex: "#d4af37",
        sku: "RB-3447V-GLD",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.53%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.53%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.54%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.55%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.56%20PM.jpg"
        ]
      },
      {
        id: "rayban-metal-wire-satin-black",
        name: "Satin Matte Black",
        hex: "#222222",
        sku: "RB-3447V-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.58%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.58%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.59%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.59%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-metal-wire-pewter-silver",
        name: "Brushed Pewter Silver",
        hex: "#a8a8a8",
        sku: "RB-3447V-SLV",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.56%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.56%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.56%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.57%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375007/federal-optics/eyeglassimages/RAY%20BAN/premium%20ray%20ban%20metal%20frames%20rs%20Rs4450/WhatsApp%20Image%202026-09-20%20at%202.20.57%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-hex-metal-arista-gold',
    aliases: [
      "rayban-hex-metal-matte-gunmetal",
      "rayban-hex-metal-chrome-silver"
    ],
    name: 'Ray-Ban Hexagonal Geometric Metal',
    sku: 'RB-3548V',
    category: 'eyeglasses',
    subCategory: "Unisex Eyeglasses",
    gender: 'unisex',
    brand: "Ray-Ban",
    price: 4650,
    originalPrice: 6200,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.35%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.36%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.37%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.37%20PM%20%281%29.jpg"
    ],
    description: "Architectural hexagon geometric silhouette combining vintage edge with modern precision metalwork. Finished in resilient coating with flexible temple construction.",
    features: [
      "Contemporary octagonal/hex geometric frame contour",
      "Laser-etched metal temples with silicone comfort ends",
      "Featherlight balanced bridge distribution",
      "Compatible with blue-shield and transition lenses",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'geometric',
    frameMaterial: "Precision Lightweight Metal Alloy",
    rimType: 'Full Rim',
    frameSize: '51-21-145',
    measurements: {
      lensWidth: 51,
      bridgeWidth: 21,
      templeLength: 145,
      frameWeight: '17.4g'
    },
    availableColors: [
      {
        id: "rayban-hex-metal-arista-gold",
        name: "Polished Rose Gold & Ivory",
        hex: "#c9967a",
        sku: "RB-3548V-GLD",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.35%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.35%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.36%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.37%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.37%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-hex-metal-matte-gunmetal",
        name: "Matte Gunmetal",
        hex: "#4b4f54",
        sku: "RB-3548V-GUN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.38%20PM%20%283%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.38%20PM%20%283%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375009/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.39%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375009/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.40%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.40%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-hex-metal-chrome-silver",
        name: "Chrome Silver",
        hex: "#c0c0c0",
        sku: "RB-3548V-SLV",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.37%20PM%20%282%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.37%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375009/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.38%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.38%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375008/federal-optics/eyeglassimages/RAY%20BAN/premium%20rayban%20metal%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.17.38%20PM%20%282%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'tiffany-tr-blush-rose-gold',
    aliases: [
      "tiffany-tr-signature-cyan",
      "tiffany-tr-onyx-gold"
    ],
    name: 'Tiffany & Co. TR90 Sculpted Cat-Eye',
    sku: 'TF-2195',
    category: 'eyeglasses',
    subCategory: "Women’s Eyeglasses",
    gender: 'women',
    brand: "Tiffany & Co.",
    price: 4250,
    originalPrice: 5800,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.32%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.32%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.33%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.33%20PM.jpg"
    ],
    description: "Sculpted feminine cat-eye frame constructed from ultra-lightweight Swiss TR90 memory polymer. Adorned with delicate jewelry-inspired metallic temple accents.",
    features: [
      "Swiss TR90 memory material (featherlight & flexible)",
      "Sculpted lift browline tailored for women",
      "Hypoallergenic touchpoints with anti-slip nose bridge",
      "Federal optical clinical fitting warranty",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'cat-eye',
    frameMaterial: "Swiss TR90 Featherlight Memory Polymer",
    rimType: 'Full Rim',
    frameSize: '53-16-140',
    measurements: {
      lensWidth: 53,
      bridgeWidth: 16,
      templeLength: 140,
      frameWeight: '15.2g'
    },
    availableColors: [
      {
        id: "tiffany-tr-blush-rose-gold",
        name: "Rose Gold & Blush Crystal",
        hex: "#e8c4c4",
        sku: "TF-2195-RSG",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.32%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.32%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.32%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.33%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.33%20PM.jpg"
        ]
      },
      {
        id: "tiffany-tr-signature-cyan",
        name: "Gloss Black & Champagne Gold",
        hex: "#151515",
        sku: "TF-2195-BLU",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.34%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.34%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.34%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.35%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375048/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.35%20PM.jpg"
        ]
      },
      {
        id: "tiffany-tr-onyx-gold",
        name: "Crystal Clear & Tiffany Blue",
        hex: "#81d8d0",
        sku: "TF-2195-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375048/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.36%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375048/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.36%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375048/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.36%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375048/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.37%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375048/federal-optics/eyeglassimages/Tiffany%20TR%20%20Frames%20Rs4250%20women%20category/WhatsApp%20Image%202026-09-20%20at%202.24.37%20PM.jpg"
        ]
      }
    ],
    reviews: []
  },

  // ---- Women’s frames added from the client’s photo folders (STEPPER / SWAROVSKI) ----
  {
    id: "stepper-ns11014-browline",
    aliases: ["stepper-ns11014-browline-gunmetal-silver", "stepper-ns11014-browline-gold"],
    name: "STEPPER NS 11014 Half-Moon Browline",
    sku: "STP-NS11014",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "STEPPER Germany",
    price: 4250,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.39%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.39%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.40%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.41%20PM.jpg"],
    description: "A modern half-moon browline from STEPPER: a slim stainless-steel round lower rim under a bold black brow bar, finished with STEPPER-branded temples and adjustable nose pads.",
    features: ["Half-moon round shape with a black brow bar", "Stainless steel front", "Adjustable clear nose pads", "Size 50□18-140"],
    inStock: true,
    isNew: true,
    frameShape: "browline",
    frameMaterial: "Stainless Steel",
    rimType: "Full Rim",
    frameSize: "50-18-140",
    measurements: { lensWidth: 50, bridgeWidth: 18, templeLength: 140 },
    availableColors: [
      { id: "stepper-ns11014-browline-gunmetal-silver", name: "Silver & Black", hex: "#9ca3af", sku: "STP-NS11014-GUNMET", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.39%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.39%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.39%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.40%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.41%20PM.jpg"] },
      { id: "stepper-ns11014-browline-gold", name: "Gold & Black", hex: "#c9a24a", sku: "STP-NS11014-GOLD", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.41%20PM%20%281%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.41%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.41%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.42%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.27.42%20PM%20%281%29.jpg"] },
    ],
    reviews: []
  },
  {
    id: "stepper-2012-cat-eye",
    aliases: ["stepper-2012-cat-eye-black", "stepper-2012-cat-eye-burgundy-pink"],
    name: "STEPPER 2012 Soft Cat-Eye",
    sku: "STP-2012",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "STEPPER Germany",
    price: 4250,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.32%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.32%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.32%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.33%20PM.jpg"],
    description: "A softly lifted cat-eye from STEPPER with slim metal temples. Available in classic black or a burgundy-to-pink colour fade.",
    features: ["Soft cat-eye shape", "Slim metal temples", "Black or burgundy-pink fade", "Size 51□17-145"],
    inStock: true,
    isNew: true,
    frameShape: "cat-eye",
    frameMaterial: "Lightweight front with metal temples",
    rimType: "Full Rim",
    frameSize: "51-17-145",
    measurements: { lensWidth: 51, bridgeWidth: 17, templeLength: 145 },
    availableColors: [
      { id: "stepper-2012-cat-eye-black", name: "Classic Black", hex: "#111827", sku: "STP-2012-BLACK", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.32%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375013/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.32%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.32%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.32%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.33%20PM.jpg"] },
      { id: "stepper-2012-cat-eye-burgundy-pink", name: "Burgundy Pink Fade", hex: "#9d174d", sku: "STP-2012-BURGUN", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.33%20PM%20%281%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.33%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375014/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.33%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375015/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.34%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375015/federal-optics/eyeglassimages/STEEPER/premium%20quality%20steeper%20%20frames%20Rs4250%20for%20women/WhatsApp%20Image%202026-09-20%20at%202.36.34%20PM%20%281%29.jpg"] },
    ],
    reviews: []
  },
  {
    id: "swarovski-tr6843-cat-eye",
    aliases: ["swarovski-tr6843-cat-eye-brown-fade", "swarovski-tr6843-cat-eye-black", "swarovski-tr6843-cat-eye-tiger-print", "swarovski-tr6843-cat-eye-grey-fade", "swarovski-tr6843-cat-eye-pink-fade"],
    name: "SWAROVSKI TR6843 Rectangle Cat-Eye",
    sku: "SWA-TR6843",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "SWAROVSKI",
    price: 4650,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.16%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.17%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.17%20PM%20%281%29.jpg"],
    description: "A slim rectangular cat-eye with gold crest details on the temples, in two-tone colour fades, tortoise and solid black.",
    features: ["Rectangular cat-eye shape", "Gold crest detail on the temples", "Two-tone colour fades", "Size 53□16-140"],
    inStock: true,
    isNew: true,
    frameShape: "cat-eye",
    frameMaterial: "TR",
    rimType: "Full Rim",
    frameSize: "53-16-140",
    measurements: { lensWidth: 53, bridgeWidth: 16, templeLength: 140 },
    availableColors: [
      { id: "swarovski-tr6843-cat-eye-brown-fade", name: "Brown Fade", hex: "#8b5a2b", sku: "SWA-TR6843-BROWN-", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.16%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.16%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.17%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.17%20PM%20%281%29.jpg"] },
      { id: "swarovski-tr6843-cat-eye-black", name: "Black", hex: "#111827", sku: "SWA-TR6843-BLACK", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.17%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.17%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.22%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.22%20PM%20%281%29.jpg"] },
      { id: "swarovski-tr6843-cat-eye-tiger-print", name: "Tiger Print", hex: "#a0522d", sku: "SWA-TR6843-TIGER-", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.22%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.22%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.23%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.23%20PM%20%281%29.jpg"] },
      { id: "swarovski-tr6843-cat-eye-grey-fade", name: "Grey Fade", hex: "#6b7280", sku: "SWA-TR6843-GREY-F", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.23%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.23%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.24%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.24%20PM%20%281%29.jpg"] },
      { id: "swarovski-tr6843-cat-eye-pink-fade", name: "Pink Fade", hex: "#be185d", sku: "SWA-TR6843-PINK-F", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.24%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.24%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.25%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375045/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%205.54.25%20PM%20%281%29.jpg"] },
    ],
    reviews: []
  },
  {
    id: "swarovski-tr6844-cat-eye",
    aliases: ["swarovski-tr6844-cat-eye-black", "swarovski-tr6844-cat-eye-pink", "swarovski-tr6844-cat-eye-transparent", "swarovski-tr6844-cat-eye-brown-fade", "swarovski-tr6844-cat-eye-maroon"],
    name: "SWAROVSKI TR6844 Cat-Eye",
    sku: "SWA-TR6844",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "SWAROVSKI",
    price: 4650,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.48%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.48%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.48%20PM%20%282%29.jpg"],
    description: "A bold, upswept cat-eye with gold crest details on the temples. Comes in black, pink, transparent, brown fade and maroon.",
    features: ["Upswept cat-eye shape", "Gold crest detail on the temples", "Five colours incl. transparent and maroon", "Size 54□17-140"],
    inStock: true,
    isNew: true,
    frameShape: "cat-eye",
    frameMaterial: "TR",
    rimType: "Full Rim",
    frameSize: "54-17-140",
    measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 140 },
    availableColors: [
      { id: "swarovski-tr6844-cat-eye-black", name: "Black", hex: "#111827", sku: "SWA-TR6844-BLACK", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.48%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.48%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.48%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.48%20PM%20%282%29.jpg"] },
      { id: "swarovski-tr6844-cat-eye-pink", name: "Blush Pink", hex: "#f4a6b7", sku: "SWA-TR6844-PINK", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.49%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.49%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.49%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.50%20PM.jpg"] },
      { id: "swarovski-tr6844-cat-eye-transparent", name: "Transparent", hex: "#e5e7eb", sku: "SWA-TR6844-TRANSP", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.50%20PM%20%281%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.50%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.51%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.52%20PM.jpg"] },
      { id: "swarovski-tr6844-cat-eye-brown-fade", name: "Brown Fade", hex: "#7c2d12", sku: "SWA-TR6844-BROWN-", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.53%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.53%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375046/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.53%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.02.54%20PM.jpg"] },
      { id: "swarovski-tr6844-cat-eye-maroon", name: "Maroon", hex: "#7f1d1d", sku: "SWA-TR6844-MAROON", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.03.00%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.03.00%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.03.01%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375047/federal-optics/eyeglassimages/SWAROVSKI%20for%20ladies%20rs%204650%20color%202%20tone%20in%20black%20%2C%20tiger%20print%20%2C%20gray%20%2C%20pink%2C%20transparent%20%2C%20brown%20%2C%20mehron/WhatsApp%20Image%202026-10-02%20at%206.03.02%20PM.jpg"] },
    ],
    reviews: []
  },
  {
    id: "chanel-tr6839-cat-eye",
    aliases: ["chanel-tr6839-cat-eye-brown", "chanel-tr6839-cat-eye-tiger-print", "chanel-tr6839-cat-eye-blue", "chanel-tr6839-cat-eye-shocking-pink", "chanel-tr6839-cat-eye-black"],
    name: "CHANEL TR6839 Soft Cat-Eye",
    sku: "CHN-TR6839",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "CHANEL",
    price: 4650,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616229/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.07%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616230/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.08%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616232/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.08%20PM.jpg"],
    description: "A soft cat-eye frame for ladies with decorative stone detailing on the metal temples. Available in five colours: Brown, Tiger Print, Blue, Shocking Pink and Black.",
    features: ["Soft cat-eye shape", "Stone detailing on the temples", "Five colours incl. Tiger Print and Shocking Pink", "Size 50□24-140"],
    inStock: true,
    isNew: true,
    frameShape: "cat-eye",
    frameMaterial: "TR",
    rimType: "Full Rim",
    frameSize: "50-24-140",
    measurements: { lensWidth: 50, bridgeWidth: 24, templeLength: 140 },
    availableColors: [
      { id: "chanel-tr6839-cat-eye-brown", name: "Brown", hex: "#8b5a2b", sku: "CHN-TR6839-BROWN", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616229/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.07%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616229/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.07%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616230/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.08%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616232/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.08%20PM.jpg"] },
      { id: "chanel-tr6839-cat-eye-tiger-print", name: "Tiger Print", hex: "#a0522d", sku: "CHN-TR6839-TIGER-PR", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616234/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.09%20PM%20%281%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616234/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.09%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616237/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.09%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616235/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.09%20PM%20%282%29.jpg"] },
      { id: "chanel-tr6839-cat-eye-blue", name: "Blue", hex: "#1e40af", sku: "CHN-TR6839-BLUE", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616240/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.10%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616240/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.10%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616238/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.10%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616244/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.12%20PM.jpg"] },
      { id: "chanel-tr6839-cat-eye-shocking-pink", name: "Shocking Pink", hex: "#be185d", sku: "CHN-TR6839-SHOCKING", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616243/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.12%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616243/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.12%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616241/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.12%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616245/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.13%20PM%20%281%29.jpg"] },
      { id: "chanel-tr6839-cat-eye-black", name: "Black", hex: "#111827", sku: "CHN-TR6839-BLACK", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616246/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.13%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616246/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.13%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616249/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.14%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616248/federal-optics/eyeglassimages/CHANEL%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.14%20PM%20%281%29.jpg"] },
    ],
    reviews: []
  },
  {
    id: "gucci-tr6834-cat-eye",
    aliases: ["gucci-tr6834-cat-eye-tiger-print", "gucci-tr6834-cat-eye-black", "gucci-tr6834-cat-eye-gray-two-tone", "gucci-tr6834-cat-eye-mehron", "gucci-tr6834-cat-eye-mehron-two-tone"],
    name: "GUCCI TR6834 Cat-Eye",
    sku: "GUC-TR6834",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "GUCCI",
    price: 4650,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616263/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.56%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616257/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.55%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616261/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.55%20PM.jpg"],
    description: "A sleek, upswept cat-eye frame for ladies with stone detailing on the temples. Available in Tiger Print, Black, Gray 2 Tone, Mehron and Mehron 2 Tone.",
    features: ["Upswept cat-eye shape", "Stone detailing on the temples", "Five colours incl. two-tone fades", "Size 50□17-138"],
    inStock: true,
    isNew: true,
    frameShape: "cat-eye",
    frameMaterial: "TR",
    rimType: "Full Rim",
    frameSize: "50-17-138",
    measurements: { lensWidth: 50, bridgeWidth: 17, templeLength: 138 },
    availableColors: [
      { id: "gucci-tr6834-cat-eye-tiger-print", name: "Tiger Print", hex: "#a0522d", sku: "GUC-TR6834-TIGER-PR", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616263/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.56%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616263/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.56%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616257/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.55%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616261/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.55%20PM.jpg"] },
      { id: "gucci-tr6834-cat-eye-black", name: "Black", hex: "#111827", sku: "GUC-TR6834-BLACK", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616259/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.55%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616259/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.55%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616268/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.57%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616262/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.56%20PM%20%281%29.jpg"] },
      { id: "gucci-tr6834-cat-eye-gray-two-tone", name: "Gray 2 Tone", hex: "#9ca3af", sku: "GUC-TR6834-GRAY-TWO", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616265/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.57%20PM%20%281%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616265/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.57%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616253/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%201.00.02%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616266/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.57%20PM%20%282%29.jpg"] },
      { id: "gucci-tr6834-cat-eye-mehron", name: "Mehron", hex: "#7f1d1d", sku: "GUC-TR6834-MEHRON", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616251/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%201.00.01%20PM%20%281%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616251/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%201.00.01%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616255/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%201.00.03%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616252/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%201.00.01%20PM.jpg"] },
      { id: "gucci-tr6834-cat-eye-mehron-two-tone", name: "Mehron 2 Tone", hex: "#be123c", sku: "GUC-TR6834-MEHRON-T", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616267/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.57%20PM%20%283%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616267/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.57%20PM%20%283%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616254/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%201.00.03%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616270/federal-optics/eyeglassimages/GUCCI%20for%20ladies%2C%20Rs%204650/WhatsApp%20Image%202026-11-23%20at%2012.59.58%20PM.jpg"] },
    ],
    reviews: []
  },
  {
    id: "metal-stone-ladies-frame",
    aliases: ["metal-stone-ladies-frame-gray", "metal-stone-ladies-frame-brown", "metal-stone-ladies-frame-golden"],
    name: "Metal Stone Frame for Ladies",
    sku: "MTL-STN-L",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "Good Quality",
    price: 1850,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616273/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.52%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616271/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.52%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616272/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.52%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616275/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.53%20PM.jpg"],
    description: "A light, slim metal frame for ladies with a small stone detail at the hinges and adjustable nose pads. Available in Gray, Brown and Golden.",
    features: ["Slim full-rim metal frame", "Small stone detail at the hinges", "Adjustable nose pads", "Size 51□17-138"],
    inStock: true,
    isNew: true,
    frameShape: "cat-eye",
    frameMaterial: "Metal",
    rimType: "Full Rim",
    frameSize: "51-17-138",
    measurements: { lensWidth: 51, bridgeWidth: 17, templeLength: 138 },
    availableColors: [
      { id: "metal-stone-ladies-frame-gray", name: "Gray", hex: "#6b7280", sku: "MTL-STN-L-GRAY", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616273/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.52%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616273/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.52%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616271/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.52%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616272/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.52%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616275/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.53%20PM.jpg"] },
      { id: "metal-stone-ladies-frame-brown", name: "Brown", hex: "#7c4a2d", sku: "MTL-STN-L-BROWN", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616282/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.56%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616282/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.56%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616281/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.56%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616276/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.54%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616278/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.54%20PM.jpg"] },
      { id: "metal-stone-ladies-frame-golden", name: "Golden", hex: "#c9a24a", sku: "MTL-STN-L-GOLDEN", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616277/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.54%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616277/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.54%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616284/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.56%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616285/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.57%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1795616279/federal-optics/eyeglassimages/Mattel%20Ston%20Frames%20for%20ladies%20%28Gray%2C%20Brown%2C%20Golden%29%2C%20Rs%201850/WhatsApp%20Image%202026-11-23%20at%2012.58.55%20PM.jpg"] },
    ],
    reviews: []
  },
  
  {
    id: "knight-horse-sq-01-matte-black",
    aliases: [
      "knight-horse-sq-06-crystal-smoke",
      "knight-horse-sq-03-midnight-navy",
      "knight-horse-sq-02-dark-gunmetal",
      "knight-horse-sq-04-espresso-tortoise"
    ],
    name: "Knight Horse Square Trendy Eyeglasses",
    sku: "KH-255076",
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: "Knight Horse",
    price: 4250,
    originalPrice: 5600,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.34%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.35%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.37%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.41%20PM.jpg"
    ],
    description: "Trendy square masculine frame with sharp contours and structured bridge architecture. Crafted from resilient TR90 polymer for effortless everyday comfort at the desk or on the go.",
    features: [
      "Trendy structured square silhouette for men",
      "TR90 high-density impact-resistant frame",
      "Reinforced internal temple core for customized bend adjustment",
      "Suitable for high-index prescription and computerized blue-light lenses",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: "square",
    frameMaterial: "TR90 Ultra-Tough Composite",
    rimType: 'Full Rim',
    frameSize: "54-18-145",
    measurements: {
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 145,
      frameWeight: '17.9g'
    },
    availableColors: [
      {
        id: "knight-horse-sq-01-matte-black",
        name: "Polished Jet Black",
        hex: "#111111",
        sku: "KH-255076-BLACK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.34%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.34%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.35%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.37%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.41%20PM.jpg"
        ]
      },
      {
        id: "knight-horse-sq-06-crystal-smoke",
        name: "Translucent Smoke Grey",
        hex: "#9a9a9a",
        sku: "KH-255076-SMOKE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374989/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.30%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374989/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.30%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.31%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374989/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.31%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.31%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "knight-horse-sq-03-midnight-navy",
        name: "Translucent Royal Blue",
        hex: "#1f4fa0",
        sku: "KH-255076-BLUE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.32%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.32%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.32%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.33%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374990/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.41.33%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "knight-horse-keyhole-sq-black",
    aliases: [
      "knight-horse-sq-07-gloss-black",
      "knight-horse-sq-05-slate-charcoal",
      "knight-horse-sq-09-amber-brown",
      "knight-horse-sq-08-olive-demi"
    ],
    name: "Knight Horse Keyhole Square Eyeglasses",
    sku: "KH-255077",
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: "Knight Horse",
    price: 4250,
    originalPrice: 5600,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.11%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM%20%282%29.jpg"
    ],
    description: "Bold keyhole-bridge square frame with a sculpted brow line and signature Knight Horse temple hardware. Crafted from resilient TR90 polymer for effortless everyday comfort.",
    features: [
      "Trendy structured square silhouette for men",
      "TR90 high-density impact-resistant frame",
      "Reinforced internal temple core for customized bend adjustment",
      "Suitable for high-index prescription and computerized blue-light lenses",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: "square",
    frameMaterial: "TR90 Ultra-Tough Composite",
    rimType: 'Full Rim',
    frameSize: "51-19-145",
    measurements: {
      lensWidth: 51,
      bridgeWidth: 19,
      templeLength: 145,
      frameWeight: '17.9g'
    },
    availableColors: [
      {
        id: "knight-horse-sq-07-gloss-black",
        name: "Polished Jet Black",
        hex: "#111111",
        sku: "KH-255077-BLACK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.11%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.11%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "knight-horse-sq-05-slate-charcoal",
        name: "Translucent Royal Blue",
        hex: "#1f4fa0",
        sku: "KH-255077-BLUE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.06%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.06%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.07%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.07%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.09%20PM.jpg"
        ]
      },
      {
        id: "knight-horse-sq-09-amber-brown",
        name: "Amber Cognac Brown",
        hex: "#8b3a1e",
        sku: "KH-255077-BROWN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.09%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.09%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.10%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.10%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374991/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.10%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "knight-horse-sq-08-olive-demi",
        name: "Translucent Smoke Grey",
        hex: "#9a9a9a",
        sku: "KH-255077-SMOKE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM%20%283%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.12%20PM%20%283%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.13%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.13%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.45.14%20PM.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "knight-horse-aviator-black",
    aliases: [
      "knight-horse-sq-11-crystal-clear",
      "knight-horse-sq-10-graphite-silver",
      "knight-horse-aviator-smoke"
    ],
    name: "Knight Horse Aviator Eyeglasses",
    sku: "KH-255078",
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: "Knight Horse",
    price: 4250,
    originalPrice: 5600,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.35%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.35%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.36%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.36%20PM%20%281%29.jpg"
    ],
    description: "Statement double-bridge aviator eyeglasses with a modern thick-rim profile and signature Knight Horse temple hardware. Crafted from resilient TR90 polymer for effortless everyday comfort.",
    features: [
      "Trendy structured square silhouette for men",
      "TR90 high-density impact-resistant frame",
      "Reinforced internal temple core for customized bend adjustment",
      "Suitable for high-index prescription and computerized blue-light lenses",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: "aviator",
    frameMaterial: "TR90 Ultra-Tough Composite",
    rimType: 'Full Rim',
    frameSize: "56-15-145",
    measurements: {
      lensWidth: 56,
      bridgeWidth: 15,
      templeLength: 145,
      frameWeight: '17.9g'
    },
    availableColors: [
      {
        id: "knight-horse-sq-11-crystal-clear",
        name: "Polished Jet Black",
        hex: "#111111",
        sku: "KH-255078-BLACK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.35%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.35%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.35%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.36%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.36%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "knight-horse-sq-10-graphite-silver",
        name: "Translucent Royal Blue",
        hex: "#1f4fa0",
        sku: "KH-255078-BLUE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.34%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.34%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.34%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.34%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.35%20PM.jpg"
        ]
      },
      {
        id: "knight-horse-aviator-smoke",
        name: "Translucent Smoke Grey",
        hex: "#9a9a9a",
        sku: "KH-255078-SMOKE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.32%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.32%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.33%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374992/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.33%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/knight%20horse%20square%20trendy%20shape%20rs%204250%20for%20men/WhatsApp%20Image%202026-09-20%20at%202.51.33%20PM%20%282%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-sun-aviator-hybrid-black-gold',
    aliases: ['rayban-sun-aviator-hybrid-gunmetal-green', 'rayban-sun-aviator-hybrid-gold-black'],
    name: 'Ray-Ban Hybrid Aviator',
    sku: 'RB-3025-HYB',
    category: 'sunglasses',
    subCategory: "Men’s Sunglasses",
    gender: 'men',
    brand: 'Ray-Ban',
    price: 4650,
    originalPrice: 6200,
    rating: 5.0,
    reviewCount: 24,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.05%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.08%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.08%20PM%20%281%29.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.09%20PM.jpg',
    ],
    description: 'Bold hybrid design combining a rigid double-bridge metal chassis with molded cellulose acetate inner rims. Equipped with UV400 sun protection lenses engineered for outdoor glare resistance.',
    features: [
      'Hybrid metal chassis with acetate rim inserts',
      'UV400 Category 3 sun protection lenses',
      'Sweat-resistant double brow bar',
      'Supplied with branded sunglasses case and microfiber wiper',
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    frameShape: 'aviator',
    frameMaterial: 'Hybrid Metal + Cellulose Acetate Rim',
    rimType: 'Full Rim',
    frameSize: '58-14-140',
    measurements: {
      lensWidth: 58,
      bridgeWidth: 14,
      templeLength: 140,
      frameWeight: '26.5g'
    },
    availableColors: [
      {
        id: 'rayban-sun-aviator-hybrid-black-gold',
        name: 'Matte Black & Dark Grey',
        hex: '#1e1e1e',
        sku: 'RB-3025-HYB-BG',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.05%20PM.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.05%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.08%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.08%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.09%20PM.jpg'
        ]
      },
      {
        id: 'rayban-sun-aviator-hybrid-gunmetal-green',
        name: 'Brushed Gunmetal & G-15 Green',
        hex: '#4a433e',
        sku: 'RB-3025-HYB-GG',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.09%20PM%20%281%29.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.09%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.09%20PM%20%282%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.10%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.10%20PM%20%281%29.jpg'
        ]
      },
      {
        id: 'rayban-sun-aviator-hybrid-gold-black',
        name: 'Arista Gold & G-15 Green',
        hex: '#d4af37',
        sku: 'RB-3025-HYB-GB',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.10%20PM%20%282%29.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.10%20PM%20%282%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.11%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.11%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20%20Mattel%20%2B%20Plastic%20for%20men%20rs%204650/WhatsApp%20Image%202026-09-25%20at%203.13.11%20PM%20%282%29.jpg'
        ]
      },
    ],
    reviews: []
  },
  
  {
    id: 'rayban-sun-aviator-wire-gunmetal-gray',
    aliases: [
      "rayban-sun-aviator-wire-matte-black"
    ],
    name: 'Ray-Ban Classic Wire Aviator',
    sku: 'RB-3025-WR',
    category: 'sunglasses',
    subCategory: "Men’s Sunglasses",
    gender: 'men',
    brand: 'Ray-Ban',
    price: 3800,
    originalPrice: 5200,
    rating: 5.0,
    reviewCount: 28,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.30%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.39%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.40%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.41%20PM.jpg"
    ],
    description: 'Ultra-lightweight surgical stainless steel teardrop aviator frame in gunmetal finish with gradient smoke sun lenses.',
    features: [
      'Surgical steel wire teardrop construction',
      'Soft gradient smoke sun lenses',
      'Featherweight balanced ear stems',
      'Adjustable clear nose pads',
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'aviator',
    frameMaterial: 'Surgical Stainless Steel Wire',
    rimType: 'Full Rim',
    frameSize: '58-14-135',
    measurements: {
      lensWidth: 58,
      bridgeWidth: 14,
      templeLength: 135,
      frameWeight: '19.2g'
    },
    availableColors: [
      {
        id: "rayban-sun-aviator-wire-gunmetal-gray",
        name: "Gunmetal & Light Blue Gradient",
        hex: "#8fa9c4",
        sku: "RB-3025-WR-GRY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.30%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.30%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.39%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.40%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.41%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-aviator-wire-matte-black",
        name: "Pitch Matte Black & G-15 Green",
        hex: "#1a1a1a",
        sku: "RB-3025-WR-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.42%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.42%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.43%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.44%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375032/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20aviator%20shap%20rs%203800%20color%20black%20%2C%20gray/WhatsApp%20Image%202026-09-25%20at%203.10.44%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-sun-sami-sq-gold-grey',
    aliases: [
      "rayban-sun-sami-sq-gold-blue",
      "rayban-sun-sami-sq-gold-brown",
      "rayban-sun-sami-sq-gunmetal-grey",
      "rayban-sun-sami-sq-gunmetal-blue",
      "rayban-sun-sami-sq-silver-green",
      "rayban-sun-sami-sq-black-grey",
      "rayban-sun-sami-sq-black-green"
    ],
    name: 'Ray-Ban Square Metal',
    sku: 'RB-SQM',
    category: 'sunglasses',
    subCategory: "Unisex Sunglasses",
    gender: 'unisex',
    brand: 'Ray-Ban',
    price: 3650,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 18,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.10%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.12%20PM%20%282%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.12%20PM.jpg"
    ],
    description: 'Clean geometric square metal silhouette in polished Arista gold wire with solid dark grey UV400 sun protection lenses.',
    features: [
      'Fine wire geometric square chassis',
      'Polished Arista gold plating',
      'Dark grey Category 3 UV lenses',
      'Supplied with protective case and cleaning cloth',
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'square',
    frameMaterial: 'Fine Wire Stainless Steel',
    rimType: 'Full Rim',
    frameSize: '53-20-145',
    measurements: {
      lensWidth: 53,
      bridgeWidth: 20,
      templeLength: 145,
      frameWeight: '20.1g'
    },
    availableColors: [
      {
        id: "rayban-sun-sami-sq-gold-grey",
        name: "Arista Gold & Dark Grey",
        hex: "#d4af37",
        sku: "RB-SQM-01",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.10%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.10%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.12%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.12%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-sami-sq-gold-blue",
        name: "Arista Gold & Light Blue Gradient",
        hex: "#8ab4d8",
        sku: "RB-SQM-02",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.13%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.13%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.13%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.12%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.14%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.14%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-sun-sami-sq-gold-brown",
        name: "Satin Black & Brown Gradient",
        hex: "#7a5a3c",
        sku: "RB-SQM-03",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.14%20PM%20%282%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375033/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.14%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.15%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.16%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.16%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-sun-sami-sq-gunmetal-blue",
        name: "Satin Black & Gradient Blue",
        hex: "#6f8fb0",
        sku: "RB-SQM-05",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.17%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.17%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.19%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.19%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.19%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "rayban-sun-sami-sq-silver-green",
        name: "Silver Chrome & Dark Grey",
        hex: "#c0c0c0",
        sku: "RB-SQM-06",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.20%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.20%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.20%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.21%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375034/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.21%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-sun-sami-sq-black-grey",
        name: "Satin Black & Dark Grey",
        hex: "#1e1e1e",
        sku: "RB-SQM-07",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.24%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.24%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.24%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.23%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.25%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-sun-sami-sq-black-green",
        name: "Satin Black & G-15 Green",
        hex: "#2f4f3a",
        sku: "RB-SQM-08",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.21%20PM%20%282%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.21%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.22%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.25%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375035/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20Sunglasses%20Sami%20Square%20shape%20Unisex%20rs%203650/WhatsApp%20Image%202026-09-25%20at%202.25.24%20PM.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-sun-tr-pol-matte-black',
    aliases: [
      "rayban-sun-tr-pol-havana-brown",
      "rayban-sun-tr-pol-ocean-blue",
      "rayban-sun-tr-pol-burgundy",
      "rayban-sun-tr-pol-black-grey-gradient"
    ],
    name: 'Ray-Ban TR90 Polarized Sport',
    sku: 'RB-TR42',
    category: 'sunglasses',
    subCategory: "Men’s Sunglasses",
    gender: 'men',
    brand: 'Ray-Ban',
    price: 4250,
    originalPrice: 5800,
    rating: 5.0,
    reviewCount: 38,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.30%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.32%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.32%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.32%20PM%20%282%29.jpg"
    ],
    description: 'Flexible Swiss TR90 thermoplastic wrap sport frame with TAC polarized glare-blocking lenses for intense outdoor driving and active lifestyle.',
    features: [
      'Swiss TR90 memory flexible polymer',
      'High-efficiency TAC polarized sun lenses',
      'Sweat and impact resistant',
      'Includes hard case and microfiber wiper',
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    frameShape: 'rectangle',
    frameMaterial: 'Swiss TR90 Memory Polymer',
    rimType: 'Full Rim',
    frameSize: '57-16-140',
    measurements: {
      lensWidth: 57,
      bridgeWidth: 16,
      templeLength: 140,
      frameWeight: '21.5g'
    },
    availableColors: [
      {
        id: "rayban-sun-tr-pol-matte-black",
        name: "Matte Black & Dark Grey",
        hex: "#1a1a1a",
        sku: "RB-TR42-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.30%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.30%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.32%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.32%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.32%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "rayban-sun-tr-pol-havana-brown",
        name: "Demi Havana & Brown",
        hex: "#4a3319",
        sku: "RB-TR42-BRN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.35%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.35%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.35%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.35%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "rayban-sun-tr-pol-ocean-blue",
        name: "Translucent Grey & Ocean Blue Mirror",
        hex: "#1b3a57",
        sku: "RB-TR42-BLU",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.38%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.38%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.43%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.46%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.47%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-tr-pol-burgundy",
        name: "Matte Black & Brown Gradient (Gold Temple)",
        hex: "#5a3d33",
        sku: "RB-TR42-BUR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/gray.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/gray.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.36%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.36%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.37%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-tr-pol-black-grey-gradient",
        name: "Matte Black & Grey Gradient",
        hex: "#3a3a40",
        sku: "RB-TR42-GRADIE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.33%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.33%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.33%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.33%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375036/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.33%20PM%20%283%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-sun-tr-pol-clubmaster-tortoise',
    name: 'Ray-Ban Polarized Clubmaster — Tortoise & Gold',
    sku: 'RB-TR42-CLB',
    category: 'sunglasses',
    subCategory: "Unisex Sunglasses",
    gender: 'unisex',
    brand: 'Ray-Ban',
    price: 4250,
    originalPrice: 5800,
    rating: 5.0,
    reviewCount: 29,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375037/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.36%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/Ray-Ban%20TR%20Polarized%20Sunglasses%20rs4250/WhatsApp%20Image%202026-09-25%20at%202.35.37%20PM.jpg',
    ],
    description: 'Heritage browline Clubmaster silhouette featuring rich tortoise upper chassis, polished gold wire under-rims, and polarized sun lenses.',
    features: [
      'Iconic retro Clubmaster browline silhouette',
      'Tortoise brow with polished gold wire lower rim',
      'Glare-blocking polarized sun lenses',
      'Supplied with protective case and wipe',
    ],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    frameShape: 'browline',
    frameMaterial: 'Acetate Brow + Metal Rim',
    rimType: 'Full Rim',
    frameSize: '51-21-145',
    measurements: {
      lensWidth: 51,
      bridgeWidth: 21,
      templeLength: 145,
      frameWeight: '24.0g'
    },
    availableColors: [
      { name: 'Tortoise & Gold', hex: '#633917' }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-sun-round-bronze-brown',
    aliases: [
      "rayban-sun-round-gold-green",
      "rayban-sun-round-silver-green",
      "rayban-sun-round-silver-blue",
      "rayban-sun-round-matte-black",
      "rayban-sun-round-gunmetal-grey",
      "rayban-sun-round-gold-brown"
    ],
    name: 'Ray-Ban Iconic Round Metal',
    sku: 'RB-3447-SUN',
    category: 'sunglasses',
    subCategory: "Unisex Sunglasses",
    gender: 'unisex',
    brand: 'Ray-Ban',
    price: 3650,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 25,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.51%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375039/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.52%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.52%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.52%20PM%20%282%29.jpg"
    ],
    description: 'Vintage round metal frame in aged antique bronze with warm gradient brown sun lenses.',
    features: [
      'Vintage round wire chassis with antique bronze patina',
      'Smooth amber brown gradient lenses',
      'Adjustable clear nose pads',
      'Supplied with branded case and wiper',
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    frameShape: 'round',
    frameMaterial: 'Fine Wire Stainless Steel',
    rimType: 'Full Rim',
    frameSize: '50-21-145',
    measurements: {
      lensWidth: 50,
      bridgeWidth: 21,
      templeLength: 145,
      frameWeight: '21.0g'
    },
    availableColors: [
      {
        id: "rayban-sun-round-bronze-brown",
        name: "Antique Bronze & Brown Gradient",
        hex: "#8c6747",
        sku: "RB-3447-SUN-AB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.51%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.51%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375039/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.52%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.52%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375038/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.52%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "rayban-sun-round-gold-green",
        name: "Arista Gold & G-15 Green",
        hex: "#d4af37",
        sku: "RB-3447-SUN-GG",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375039/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.53%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375039/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.53%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.54%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.55%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375039/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.55%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-round-silver-green",
        name: "Silver Chrome & G-15 Green",
        hex: "#c0c0c0",
        sku: "RB-3447-SUN-SG",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.15%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.15%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.16%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.16%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.17%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.17%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-round-silver-blue",
        name: "Silver Chrome & Flash Blue Gradient",
        hex: "#b0c4de",
        sku: "RB-3447-SUN-SB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.18%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.18%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.18%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.19%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.20%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-round-matte-black",
        name: "Satin Matte Black & G-15 Green",
        hex: "#1e1e1e",
        sku: "RB-3447-SUN-MB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.20%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.20%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.21%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.22%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.22%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "rayban-sun-round-gunmetal-grey",
        name: "Brushed Gunmetal & Dark Grey",
        hex: "#5a5d60",
        sku: "RB-3447-SUN-GREY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.23%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.23%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.24%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.25%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.26%20PM.jpg"
        ]
      },
      {
        id: "rayban-sun-round-gold-brown",
        name: "Arista Gold & Brown Gradient",
        hex: "#b8925a",
        sku: "RB-3447-SUN-BROWN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.56%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.13.56%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375039/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.13%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375040/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.14%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375039/federal-optics/eyeglassimages/sunglasses/rayban%20metal%20sun%20glasses%20round%20shape%20rs%203650/WhatsApp%20Image%202026-09-20%20at%203.14.14%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'rayban-ferrari-aviator-matte-black-red',
    aliases: ['rayban-ferrari-aviator-black-gradient', 'rayban-ferrari-aviator-gold-amber', 'rayban-ferrari-aviator-gunmetal-blue'],
    name: 'Ray-Ban Scuderia Ferrari Polarized Aviator',
    sku: 'RB-FERR',
    category: 'sunglasses',
    subCategory: "Men’s Sunglasses",
    gender: 'men',
    brand: 'Ray-Ban Scuderia Ferrari',
    price: 4850,
    originalPrice: 6500,
    rating: 5.0,
    reviewCount: 38,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.53%20PM%20%281%29.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.53%20PM%20%282%29.jpg',
    ],
    description: 'Exclusive motorsport collaboration between Ray-Ban and Scuderia Ferrari. Aerodynamic carbon-reinforced temples with signature Italian Rosso Corsa racing accents and solid dark polarized glare-cutting lenses.',
    features: [
      'Official Scuderia Ferrari racing shield engraving',
      'High-grade solid dark polarized sun lenses',
      'Carbon composite temples with shock-absorbing Rosso Corsa rubber grips',
      'Engineered for high-speed highway driving and coastal glare',
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    frameShape: 'aviator',
    frameMaterial: 'Carbon Fiber & Matte Metal Polarized',
    rimType: 'Full Rim',
    frameSize: '61-13-140',
    measurements: {
      lensWidth: 61,
      bridgeWidth: 13,
      templeLength: 140,
      frameWeight: '27.0g'
    },
    availableColors: [
      {
        id: 'rayban-ferrari-aviator-matte-black-red',
        name: 'Matte Black & Rosso Corsa',
        hex: '#1a1a1a',
        sku: 'RB-FERR-01',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.53%20PM%20%281%29.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375041/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.53%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.53%20PM%20%282%29.jpg'
        ]
      },
      {
        id: 'rayban-ferrari-aviator-black-gradient',
        name: 'Matte Black & Gradient Grey',
        hex: '#2e2e2e',
        sku: 'RB-FERR-02',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.54%20PM.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.54%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.54%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.54%20PM%20%282%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.55%20PM.jpg'
        ]
      },
      {
        id: 'rayban-ferrari-aviator-gold-amber',
        name: 'Arista Gold & Amber Brown',
        hex: '#d4af37',
        sku: 'RB-FERR-03',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.55%20PM%20%281%29.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.55%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.56%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375042/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.56%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.58%20PM.jpg'
        ]
      },
      {
        id: 'rayban-ferrari-aviator-gunmetal-blue',
        name: 'Brushed Gunmetal & Gradient Blue',
        hex: '#4a5359',
        sku: 'RB-FERR-04',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.59%20PM.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.59%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.59%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.19.00%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20%2B%20feraari%20polarized%20avator%20shape%20%20rs4850%20for%20men/WhatsApp%20Image%202026-09-25%20at%203.18.59%20PM%20%282%29.jpg'
        ]
      },
    ],
    reviews: []
  },
  
  {
    id: 'rayban-sun-sheet-black-polarized',
    aliases: ['rayban-sun-sheet-havana-tortoise'],
    name: 'Ray-Ban High-Gloss Sheet Acetate',
    sku: 'RB-SHT',
    category: 'sunglasses',
    subCategory: "Men’s Sunglasses",
    gender: 'men',
    brand: 'Ray-Ban',
    price: 4650,
    originalPrice: 6200,
    rating: 5.0,
    reviewCount: 27,
    images: [
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.54%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.54%20PM%20%281%29.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.55%20PM.jpg',
      'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.55%20PM%20%281%29.jpg',
    ],
    description: 'Premium monolithic Italian sheet acetate sunglasses with high-gloss polished bevels and genuine polarized G-15 sun lenses.',
    features: [
      'Hand-polished block-cut Italian sheet acetate',
      'Polarized G-15 high contrast sun protection',
      'Five-barrel stainless steel core wire hinges',
      'Delivered with presentation hard case and wiper',
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    frameShape: 'square',
    frameMaterial: 'Block Cut Italian Sheet Acetate',
    rimType: 'Full Rim',
    frameSize: '54-18-145',
    measurements: {
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 145,
      frameWeight: '31.0g'
    },
    availableColors: [
      {
        id: 'rayban-sun-sheet-black-polarized',
        name: 'Deep Onyx Black & Polarized G-15',
        hex: '#111111',
        sku: 'RB-SHT-BLK',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.54%20PM.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.54%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.54%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.55%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.55%20PM%20%281%29.jpg'
        ]
      },
      {
        id: 'rayban-sun-sheet-havana-tortoise',
        name: 'Rich Havana Tortoise & Amber Brown',
        hex: '#3b2616',
        sku: 'RB-SHT-TOR',
        image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.55%20PM%20%282%29.jpg',
        images: [
          'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375043/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.55%20PM%20%282%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.56%20PM.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.56%20PM%20%281%29.jpg',
        'https://res.cloudinary.com/tyrukjzt/image/upload/v1794375044/federal-optics/eyeglassimages/sunglasses/sunglasses%20rayban%20sheet%20glasses%20rs%204650/WhatsApp%20Image%202026-09-20%20at%202.56.56%20PM%20%282%29.jpg'
        ]
      },
    ],
    reviews: []
  },
  
  {
    id: 'dita-solid-noir-black',
    aliases: [
      "dita-solid-tiger-print",
      "dita-solid-smoke-gray",
      "dita-solid-cognac-brown"
    ],
    name: 'DITA Solid Architectural Frame',
    sku: 'DITA-SLD',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'DITA',
    price: 4600,
    originalPrice: 6200,
    rating: 5.0,
    reviewCount: 42,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-noir-black-front.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-noir-black-angle.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-tiger-print-side.jpg"
    ],
    description: 'High-density architectural solid square optical frame engineered with heavyweight acetate, sculpted beveling, and signature geometric hinges for an unmistakable presence.',
    features: [
      'Solid high-density acetate construction',
      'Sculpted architectural browline and chiseled edges',
      'Heavy-duty multi-barrel precision hinges',
      'Uniform DITA collection price: Rs 4,600'
    ],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    frameShape: 'square',
    frameMaterial: 'Architectural Acetate',
    rimType: 'Full Rim',
    frameSize: '53-19-145',
    measurements: { lensWidth: 53, bridgeWidth: 19, templeLength: 145, frameWeight: '28.5g' },
    availableColors: [
      {
        id: "dita-solid-noir-black",
        name: "Onyx Noir Black",
        hex: "#111111",
        sku: "DITA-SLD-01",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-noir-black-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-noir-black-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-noir-black-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-tiger-print-side.jpg"
        ]
      },
      {
        id: "dita-solid-tiger-print",
        name: "Tiger Print Temples",
        hex: "#854d0e",
        sku: "DITA-SLD-02",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-tiger-print-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-tiger-print-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-tiger-print-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-noir-black-side.jpg"
        ]
      },
      {
        id: "dita-solid-smoke-gray",
        name: "Translucent Smoke Gray",
        hex: "#4b5563",
        sku: "DITA-SLD-03",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-smoke-gray-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-smoke-gray-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-smoke-gray-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-smoke-gray-side.jpg"
        ]
      },
      {
        id: "dita-solid-cognac-brown",
        name: "Rich Cognac Amber",
        hex: "#78350f",
        sku: "DITA-SLD-04",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-cognac-brown-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-cognac-brown-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/eyeglasses/dita-solid-cognac-brown-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374924/federal-optics/assets/images/eyeglasses/dita-solid-cognac-brown-side.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'gq-square-brown-twotone',
    aliases: [
      "gq-square-jet-black",
      "gq-square-crystal-lblue",
      "gq-square-navy-twotone"
    ],
    name: 'Good Quality Square Metal Temple',
    sku: 'GQ-SQ',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Good Quality',
    price: 2350,
    originalPrice: 3200,
    rating: 4.8,
    reviewCount: 29,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-brown-twotone-front.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-brown-twotone-angle.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-brown-twotone-side.jpg"
    ],
    description: 'Modern square silhouette featuring two-tone brown gradient front and sleek aerodynamic metal side temples.',
    features: [
      'Dual-tone brown ombré front rim',
      'Aerodynamic brushed metallic side arms',
      'Lightweight high-durability TR90 composite',
      'Uniform Good Quality pricing: Rs 2,350'
    ],
    inStock: true,
    isNew: true,
    frameShape: 'square',
    frameMaterial: 'TR90 & Metal Temples',
    rimType: 'Full Rim',
    frameSize: '54-17-142',
    measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 142, frameWeight: '15.5g' },
    availableColors: [
      {
        id: "gq-square-brown-twotone",
        name: "Brown Two-Tone",
        hex: "#654321",
        sku: "GQ-SQ-BRN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-brown-twotone-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-brown-twotone-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-brown-twotone-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-brown-twotone-side.jpg"
        ]
      },
      {
        id: "gq-square-jet-black",
        name: "Solid Jet Black",
        hex: "#111111",
        sku: "GQ-SQ-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-square-jet-black-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-square-jet-black-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-square-jet-black-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-square-crystal-lblue-angle.jpg"
        ]
      },
      {
        id: "gq-square-crystal-lblue",
        name: "Crystal Light Blue",
        hex: "#67e8f9",
        sku: "GQ-SQ-LBL",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-square-jet-black-side.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-square-jet-black-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-square-navy-twotone-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-square-crystal-lblue-front.jpg"
        ]
      },
      {
        id: "gq-square-navy-twotone",
        name: "Navy Blue Two-Tone",
        hex: "#1e3a8a",
        sku: "GQ-SQ-NVY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-square-crystal-lblue-side.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-square-crystal-lblue-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-square-navy-twotone-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-square-navy-twotone-angle.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'gq-teen-flexible-slate-gray',
    aliases: [
      "gq-teen-flexible-royal-blue",
      "gq-teen-flexible-light-purple",
      "gq-teen-flexible-black-twotone",
      "gq-teen-flexible-matte-black",
      "gq-teen-flexible-blush-pink",
      "gq-teen-flexible-dark-brown",
      "gq-teen-flexible-classic-brown"
    ],
    name: 'Good Quality Teen Flexible SafeFrame',
    sku: 'GQ-TEEN',
    category: 'eyeglasses',
    subCategory: "Teenage & Kids’ Eyeglasses",
    gender: 'kids',
    brand: 'Good Quality',
    price: 1999,
    originalPrice: 2800,
    rating: 4.9,
    reviewCount: 31,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374931/federal-optics/assets/images/eyeglasses/gq-teen-flexible-slate-gray-front.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-slate-gray-angle.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374931/federal-optics/assets/images/eyeglasses/gq-teen-flexible-slate-gray-side.jpg"
    ],
    description: 'Ultra-flexible unbreakable SafeFrame engineered from memory polymer for teenagers and youth. Featherlight with zero-pinch ergonomic temples.',
    features: [
      '180° twistable unbreakable flexible memory TR90 arms',
      'Ultra-lightweight safe construction for teens & students',
      'Pressure-free ergonomic comfort bridge',
      'Special teen flexible frame price: Rs 1,999'
    ],
    inStock: true,
    isNew: true,
    frameShape: 'rectangle',
    frameMaterial: 'Ultra-Flex SafeFrame TR90',
    rimType: 'Full Rim',
    frameSize: 'Teen Age (48-16-132)',
    measurements: { lensWidth: 48, bridgeWidth: 16, templeLength: 132, frameWeight: '12.0g' },
    availableColors: [
      {
        id: "gq-teen-flexible-slate-gray",
        name: "Slate Gray",
        hex: "#64748b",
        sku: "GQ-TEEN-01",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374931/federal-optics/assets/images/eyeglasses/gq-teen-flexible-slate-gray-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374931/federal-optics/assets/images/eyeglasses/gq-teen-flexible-slate-gray-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-slate-gray-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374931/federal-optics/assets/images/eyeglasses/gq-teen-flexible-slate-gray-side.jpg"
        ]
      },
      {
        id: "gq-teen-flexible-royal-blue",
        name: "Royal Cobalt Blue",
        hex: "#2563eb",
        sku: "GQ-TEEN-02",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-royal-blue-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-royal-blue-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374931/federal-optics/assets/images/eyeglasses/gq-teen-flexible-royal-blue-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-royal-blue-side.jpg"
        ]
      },
      {
        id: "gq-teen-flexible-light-purple",
        name: "Pastel Lilac Purple",
        hex: "#c084fc",
        sku: "GQ-TEEN-03",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-purple-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-purple-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-purple-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-purple-side.jpg"
        ]
      },
      {
        id: "gq-teen-flexible-black-twotone",
        name: "Black Two-Tone Ombré",
        hex: "#334155",
        sku: "GQ-TEEN-04",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-teen-flexible-black-twotone-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-teen-flexible-black-twotone-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374928/federal-optics/assets/images/eyeglasses/gq-teen-flexible-black-twotone-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-black-twotone-side.jpg"
        ]
      },
      {
        id: "gq-teen-flexible-matte-black",
        name: "Solid Matte Black",
        hex: "#1e293b",
        sku: "GQ-TEEN-05",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-jet-black-angle.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-jet-black-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-jet-black-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-pink-front.jpg"
        ]
      },
      {
        id: "gq-teen-flexible-blush-pink",
        name: "Soft Blush Pink",
        hex: "#f472b6",
        sku: "GQ-TEEN-06",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-jet-black-side.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-jet-black-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-pink-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-dark-brown-angle.jpg"
        ]
      },
      {
        id: "gq-teen-flexible-dark-brown",
        name: "Espresso Dark Brown",
        hex: "#451a03",
        sku: "GQ-TEEN-07",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-pink-side.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374930/federal-optics/assets/images/eyeglasses/gq-teen-flexible-light-pink-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-dark-brown-side.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-dark-brown-front.jpg"
        ]
      },
      {
        id: "gq-teen-flexible-classic-brown",
        name: "Classic Amber Brown",
        hex: "#92400e",
        sku: "GQ-TEEN-08",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-classic-brown-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-classic-brown-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-classic-brown-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374929/federal-optics/assets/images/eyeglasses/gq-teen-flexible-classic-brown-side.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'gq-big-square-noir-black',
    aliases: [
      "gq-big-square-amber-tortoise"
    ],
    name: 'Good Quality Oversized Square',
    sku: 'GQ-BIG',
    category: 'eyeglasses',
    subCategory: "Unisex Eyeglasses",
    gender: 'unisex',
    brand: 'Good Quality',
    price: 2350,
    originalPrice: 3200,
    rating: 5.0,
    reviewCount: 39,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-noir-black-front.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-noir-black-angle.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-noir-black-side.jpg"
    ],
    description: 'Statement oversized square frame designed with bold rectangular proportions for both men and women.',
    features: [
      'Bold oversized square eye wire',
      'Universal unisex facial bridge contouring',
      'High-gloss polished black finish',
      'Uniform Good Quality pricing: Rs 2,350'
    ],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    frameShape: 'square',
    frameMaterial: 'High-Density Acetate',
    rimType: 'Full Rim',
    frameSize: '55-18-145',
    measurements: { lensWidth: 55, bridgeWidth: 18, templeLength: 145, frameWeight: '22.0g' },
    availableColors: [
      {
        id: "gq-big-square-noir-black",
        name: "Polished Noir Black",
        hex: "#111111",
        sku: "GQ-BIG-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-noir-black-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-noir-black-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-noir-black-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-noir-black-side.jpg"
        ]
      },
      {
        id: "gq-big-square-amber-tortoise",
        name: "Crystal Clear Transparent",
        hex: "#e8e8e8",
        sku: "GQ-BIG-AMB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-amber-tortoise-front.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-amber-tortoise-front.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374926/federal-optics/assets/images/eyeglasses/gq-big-square-amber-tortoise-angle.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374927/federal-optics/assets/images/eyeglasses/gq-big-square-amber-tortoise-side.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: 'looknice-square-gloss-black',
    aliases: [
      "looknice-square-matte-black",
      "looknice-square-smoke-gray",
      "looknice-square-demi-brown",
      "looknice-square-amber-twotone",
      "looknice-square-crystal-gray"
    ],
    name: 'Look Nice Big Square Metal Temple',
    sku: 'LN-SQ-GBLK',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses",
    gender: 'men',
    brand: 'Look Nice',
    price: 2650,
    originalPrice: 3500,
    rating: 4.9,
    reviewCount: 37,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.38%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.39%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.39%20PM%20%281%29.jpg"],
    description: 'Bold oversized square silhouette crafted with substantial eye wire and precision sculpted metal side temples.',
    features: [
      'Architectural big square silhouette with wide optical coverage',
      'Sculpted lightweight metal side arms with precision hinges',
      'Ergonomic molded nose bridge for balanced weight distribution',
      'Uniform Look Nice collection price: Rs 2,650'
    ],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    frameShape: 'square',
    frameMaterial: 'TR90 & Metal Side Temples',
    rimType: 'Full Rim',
    frameSize: '51-18-145',
    measurements: { lensWidth: 51, bridgeWidth: 18, templeLength: 145, frameWeight: '18.0g' },
    availableColors: [
      { id: "looknice-square-gloss-black", name: "Black", hex: "#0a0a0a", sku: "LN-SQ-BLK", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.38%20PM.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.38%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.39%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.39%20PM%20%281%29.jpg"] },
      { id: "looknice-square-smoke-gray", name: "Gray Matt", hex: "#9ca3af", sku: "LN-SQ-GRYM", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.39%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.39%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.40%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.40%20PM%20%281%29.jpg"] },
      { id: "looknice-square-crystal-gray", name: "Gray", hex: "#c4c7cc", sku: "LN-SQ-GRY", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.40%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.40%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.41%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375001/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.41%20PM%20%281%29.jpg"] },
      { id: "looknice-square-amber-twotone", name: "Brown Matt", hex: "#8b4a24", sku: "LN-SQ-BRNM", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375001/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.42%20PM%20%281%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375001/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.42%20PM%20%281%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375002/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.43%20PM.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375002/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.43%20PM%20%281%29.jpg"] },
      { id: "looknice-square-demi-brown", name: "Brown", hex: "#713f12", sku: "LN-SQ-BRN", image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.41%20PM%20%282%29.jpg", images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.41%20PM%20%282%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375000/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.41%20PM%20%283%29.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375001/federal-optics/eyeglassimages/LOOK%20NICE/LOOK%20NICE%20%2C%20SQUARE%20SHAPE%20BIG%20FOR%20MEN%20METAL%20SIDE%20FRAMES%20%2C%20FIVE%20COLORS%20BLACK%20%2C%20GRAY%20%2C%20BROWN%2C%20MATT%20%20RS%202650/WhatsApp%20Image%202026-10-03%20at%203.38.42%20PM.jpg"] },
    ],
    reviews: []
  },
  
  {
    id: "opt-gor-crystal-gray",
    name: "Optiano Gorgeous — Crystal Gray",
    sku: "OPT-GOR-03",
    category: "color-contacts",
    subCategory: "Optiano Gorgeous Collection",
    gender: "unisex",
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 18,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/CRYSTAL%20GRAY/WhatsApp%20Image%202026-10-19%20at%204.46.27%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/CRYSTAL%20GRAY/WhatsApp%20Image%202026-10-19%20at%204.46.27%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Crystal Gray shade from the Optiano Gorgeous Collection. Premium South Korean cosmetic lenses featuring cool crystalline grey limbal definition. Globally safety approved with medical-grade Korean hydrogel for long-lasting hydration.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions",
    ],
    inStock: true,
    disposability: "three-month",
    lensColor: "Grey",
    availableColors: [
      {
        name: "Crystal Gray",
        hex: "#94a3b8",
      },
    ],
    reviews: [],
  },
  
  {
    id: "opt-gor-misty-blue",
    name: "Optiano Gorgeous — Misty Blue",
    sku: "OPT-GOR-04",
    category: "color-contacts",
    subCategory: "Optiano Gorgeous Collection",
    gender: "unisex",
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 21,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/MISTY%20BLUE/WhatsApp%20Image%202026-10-19%20at%204.51.29%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374976/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/MISTY%20BLUE/WhatsApp%20Image%202026-10-19%20at%204.51.30%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Misty Blue shade from the Optiano Gorgeous Collection. Ethereal sky-blue iris blend with soft outer ring blending naturally with dark and light eyes. Made in South Korea with certified biocompatible hydrogel.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions",
    ],
    inStock: true,
    disposability: "three-month",
    lensColor: "Blue",
    availableColors: [
      {
        name: "Misty Blue",
        hex: "#60a5fa",
      },
    ],
    reviews: [],
  },
  
  {
    id: "opt-gor-olivine",
    name: "Optiano Gorgeous — Olivine",
    sku: "OPT-GOR-05",
    category: "color-contacts",
    subCategory: "Optiano Gorgeous Collection",
    gender: "unisex",
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 16,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374977/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/OLIVINE/WhatsApp%20Image%202026-10-19%20at%204.47.56%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374977/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/OLIVINE/WhatsApp%20Image%202026-10-19%20at%204.47.57%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Olivine shade from the Optiano Gorgeous Collection. Deep olive and warm hazel undertones create an alluring, authentic earthy glance. Premium Korean hydrogel with high oxygen transmission.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions",
    ],
    inStock: true,
    disposability: "three-month",
    lensColor: "Green",
    availableColors: [
      {
        name: "Olivine Green",
        hex: "#65a30d",
      },
    ],
    reviews: [],
  },
  
  {
    id: "opt-gor-silk-green",
    name: "Optiano Gorgeous — Silk Green",
    sku: "OPT-GOR-06",
    category: "color-contacts",
    subCategory: "Optiano Gorgeous Collection",
    gender: "unisex",
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 24,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374977/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/SILK%20GREEN/WhatsApp%20Image%202026-10-19%20at%204.49.39%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/SILK%20GREEN/WhatsApp%20Image%202026-10-19%20at%204.49.39%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Silk Green shade from the Optiano Gorgeous Collection. Silky emerald and jade tones radiating from pupil to iris perimeter with captivating vibrance. South Korean safety certified.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions",
    ],
    inStock: true,
    disposability: "three-month",
    lensColor: "Green",
    availableColors: [
      {
        name: "Silk Green",
        hex: "#10b981",
      },
    ],
    reviews: [],
  },
  
  {
    id: "opt-gor-sterling-gray",
    name: "Optiano Gorgeous — Sterling Gray",
    sku: "OPT-GOR-07",
    category: "color-contacts",
    subCategory: "Optiano Gorgeous Collection",
    gender: "unisex",
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 27,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374977/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/sterling%20gray/WhatsApp%20Image%202026-10-19%20at%204.47.04%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374977/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/sterling%20gray/WhatsApp%20Image%202026-10-19%20at%204.47.05%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Sterling Gray shade from the Optiano Gorgeous Collection. Striking metallic sterling grey iris gradient designed to brighten and enlarge eye contours seamlessly.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions",
    ],
    inStock: true,
    disposability: "three-month",
    lensColor: "Grey",
    availableColors: [
      {
        name: "Sterling Gray",
        hex: "#475569",
      },
    ],
    reviews: [],
  },
  
  {
    id: "opt-gor-tiffany-gray",
    name: "Optiano Gorgeous — Tiffany Gray",
    sku: "OPT-GOR-08",
    category: "color-contacts",
    subCategory: "Optiano Gorgeous Collection",
    gender: "unisex",
    brand: "Optiano",
    price: 3850,
    originalPrice: 4800,
    rating: 5.0,
    reviewCount: 19,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374977/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/TIFFANY%20GRAY/WhatsApp%20Image%202026-10-19%20at%204.48.51%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374978/federal-optics/eyeglassimages/color%20contact%20lenses/OPTIANO%20GORGEOUS%20COLLECTION%20rs%203850/TIFFANY%20GRAY/WhatsApp%20Image%202026-10-19%20at%204.48.51%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg",
    ],
    description: "Tiffany Gray shade from the Optiano Gorgeous Collection. Exclusive aqua-grey fusion creating a jewel-like luminosity in daylight and evening lighting.",
    features: [
      "High moisture retention (40%) hydrophilic hydrogel",
      "Base Curve: 8.6 mm | Diameter: 14.5 mm",
      "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
      "Includes Federal Optical sterile lens case & guide instructions",
    ],
    inStock: true,
    disposability: "three-month",
    lensColor: "Grey",
    availableColors: [
      {
        name: "Tiffany Gray",
        hex: "#0284c7",
      },
    ],
    reviews: [],
  },
  {
    id: "frk-fus-baby-aqua",
    name: "FreshKon Fusion — Baby Aqua",
    sku: "FRK-FUS-01",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616290/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20FUSION-BABY%20AQUA.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Baby Aqua shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Baby Aqua", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Blue",
    availableColors: [{ name: "Baby Aqua", hex: "#5fb3c4" }],
    reviews: []
  },
  {
    id: "frk-fus-brilliant-brown",
    name: "FreshKon Fusion — Brilliant Brown",
    sku: "FRK-FUS-02",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616296/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20FUSION-BRILLIANT%20BROWN.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Brilliant Brown shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Brilliant Brown", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Hazel",
    availableColors: [{ name: "Brilliant Brown", hex: "#8b5a2b" }],
    reviews: []
  },
  {
    id: "frk-fus-glittering-blue",
    name: "FreshKon Fusion — Glittering Blue",
    sku: "FRK-FUS-03",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616432/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20FUSION-GLITTERING%20BLUE.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Glittering Blue shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Glittering Blue", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Blue",
    availableColors: [{ name: "Glittering Blue", hex: "#1f8a9e" }],
    reviews: []
  },
  {
    id: "frk-fus-groovy-green",
    name: "FreshKon Fusion — Groovy Green",
    sku: "FRK-FUS-04",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616433/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20FUSION-GROOVY%20GREEN.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Groovy Green shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Groovy Green", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Green",
    availableColors: [{ name: "Groovy Green", hex: "#6b8e4e" }],
    reviews: []
  },
  {
    id: "frk-fus-misty-grey",
    name: "FreshKon Fusion — Misty Grey",
    sku: "FRK-FUS-05",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616436/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20FUSION-MISTY%20GREY.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Misty Grey shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Misty Grey", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Grey",
    availableColors: [{ name: "Misty Grey", hex: "#8a8f96" }],
    reviews: []
  },
  {
    id: "frk-fus-shimmering-grey",
    name: "FreshKon Fusion — Shimmering Grey",
    sku: "FRK-FUS-06",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616437/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20FUSION-SHIMMERING%20GREy.webp", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Shimmering Grey shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Shimmering Grey", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Grey",
    availableColors: [{ name: "Shimmering Grey", hex: "#9aa3ab" }],
    reviews: []
  },
  {
    id: "frk-fus-warm-hazel",
    name: "FreshKon Fusion — Warm Hazel",
    sku: "FRK-FUS-07",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616439/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20FUSION-WARM%20HAZEL.webp", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Warm Hazel shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Warm Hazel", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Hazel",
    availableColors: [{ name: "Warm Hazel", hex: "#9c7a3c" }],
    reviews: []
  },
  {
    id: "frk-fus-perky-brown",
    name: "FreshKon Fusion — Perky Brown",
    sku: "FRK-FUS-08",
    category: "color-contacts",
    subCategory: "FreshKon Fusion Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616449/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/RESHKON%20FUSION-PERKY%20BROWN.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Perky Brown shade from the FreshKon Fusion colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Fusion colour collection — Perky Brown", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Hazel",
    availableColors: [{ name: "Perky Brown", hex: "#7b4f2c" }],
    reviews: []
  },
  {
    id: "frk-mos-charming-brown",
    name: "FreshKon Mosaic — Charming Brown",
    sku: "FRK-MOS-09",
    category: "color-contacts",
    subCategory: "FreshKon Mosaic Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616441/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20MOSAIC-CHARMING%20BROWN%204200.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Charming Brown shade from the FreshKon Mosaic colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Mosaic colour collection — Charming Brown", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Hazel",
    availableColors: [{ name: "Charming Brown", hex: "#7a5230" }],
    reviews: []
  },
  {
    id: "frk-mos-luscious-green",
    name: "FreshKon Mosaic — Luscious Green",
    sku: "FRK-MOS-10",
    category: "color-contacts",
    subCategory: "FreshKon Mosaic Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616443/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20MOSAIC-LUSCIOUS%20GREEN.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Luscious Green shade from the FreshKon Mosaic colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Mosaic colour collection — Luscious Green", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Green",
    availableColors: [{ name: "Luscious Green", hex: "#6f8f3a" }],
    reviews: []
  },
  {
    id: "frk-mos-urban-grey",
    name: "FreshKon Mosaic — Urban Grey",
    sku: "FRK-MOS-11",
    category: "color-contacts",
    subCategory: "FreshKon Mosaic Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616445/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20MOSAIC-URBAN%20GREY.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Urban Grey shade from the FreshKon Mosaic colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Mosaic colour collection — Urban Grey", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Grey",
    availableColors: [{ name: "Urban Grey", hex: "#7d848c" }],
    reviews: []
  },
  {
    id: "frk-mos-velvet-blue",
    name: "FreshKon Mosaic — Velvet Blue",
    sku: "FRK-MOS-12",
    category: "color-contacts",
    subCategory: "FreshKon Mosaic Collection",
    gender: "unisex",
    brand: "FreshKon",
    price: 4200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616447/federal-optics/eyeglassimages/color%20contact%20lenses/new%20shades/FRESHKON%20MOSAIC-VELVET%20BLUE.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Velvet Blue shade from the FreshKon Mosaic colour collection, for a natural-looking change of eye colour. Available with or without power.",
    features: ["FreshKon Mosaic colour collection — Velvet Blue", "Available with or without power (select below)", "Pair of coloured contact lenses"],
    inStock: true,
    isNew: true,
    lensColor: "Blue",
    availableColors: [{ name: "Velvet Blue", hex: "#2f6f9f" }],
    reviews: []
  },
  {
    id: "qb-blue",
    name: "Quick Beauty — Blue",
    sku: "QB-CLR-01",
    category: "color-contacts",
    subCategory: "Quick Beauty Collection",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 3200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616450/federal-optics/eyeglassimages/color%20contact%20lenses/quick%20beauty/Quick%20Beauty%20Blue.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Blue shade from Quick Beauty extended-wear coloured contact lenses, for beautiful eyes and a comfortable wearing experience.",
    features: ["Quick Beauty extended-wear colour lenses — Blue", "Wearing time: approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power: Plano to -10.00 | BC 8.6 | DIA 14.2", "Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions"],
    inStock: true,
    isNew: true,
    lensColor: "Blue",
    lensBaseCurve: "8.6 mm",
    lensDiameter: "14.2 mm",
    lensPowerRange: "Plano to -10.00",
    availableColors: [{ name: "Blue", hex: "#4f8fc9" }],
    reviews: []
  },
  {
    id: "qb-brown",
    name: "Quick Beauty — Brown",
    sku: "QB-CLR-02",
    category: "color-contacts",
    subCategory: "Quick Beauty Collection",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 3200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616452/federal-optics/eyeglassimages/color%20contact%20lenses/quick%20beauty/Quick%20Beauty%20Brown.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Brown shade from Quick Beauty extended-wear coloured contact lenses, for beautiful eyes and a comfortable wearing experience.",
    features: ["Quick Beauty extended-wear colour lenses — Brown", "Wearing time: approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power: Plano to -10.00 | BC 8.6 | DIA 14.2", "Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions"],
    inStock: true,
    isNew: true,
    lensColor: "Hazel",
    lensBaseCurve: "8.6 mm",
    lensDiameter: "14.2 mm",
    lensPowerRange: "Plano to -10.00",
    availableColors: [{ name: "Brown", hex: "#7b4a24" }],
    reviews: []
  },
  {
    id: "qb-gray",
    name: "Quick Beauty — Gray",
    sku: "QB-CLR-03",
    category: "color-contacts",
    subCategory: "Quick Beauty Collection",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 3200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616453/federal-optics/eyeglassimages/color%20contact%20lenses/quick%20beauty/Quick%20Beauty%20Gray.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Gray shade from Quick Beauty extended-wear coloured contact lenses, for beautiful eyes and a comfortable wearing experience.",
    features: ["Quick Beauty extended-wear colour lenses — Gray", "Wearing time: approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power: Plano to -15.00 | BC 8.6 | DIA 14.2", "Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions"],
    inStock: true,
    isNew: true,
    lensColor: "Grey",
    lensBaseCurve: "8.6 mm",
    lensDiameter: "14.2 mm",
    lensPowerRange: "Plano to -15.00",
    availableColors: [{ name: "Gray", hex: "#8d949b" }],
    reviews: []
  },
  {
    id: "qb-green",
    name: "Quick Beauty — Green",
    sku: "QB-CLR-04",
    category: "color-contacts",
    subCategory: "Quick Beauty Collection",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 3200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616454/federal-optics/eyeglassimages/color%20contact%20lenses/quick%20beauty/Quick%20Beauty%20Green.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Green shade from Quick Beauty extended-wear coloured contact lenses, for beautiful eyes and a comfortable wearing experience.",
    features: ["Quick Beauty extended-wear colour lenses — Green", "Wearing time: approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power: Plano to -15.00 | BC 8.6 | DIA 14.2", "Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions"],
    inStock: true,
    isNew: true,
    lensColor: "Green",
    lensBaseCurve: "8.6 mm",
    lensDiameter: "14.2 mm",
    lensPowerRange: "Plano to -15.00",
    availableColors: [{ name: "Green", hex: "#5f9a4f" }],
    reviews: []
  },
  {
    id: "qb-honey",
    name: "Quick Beauty — Honey",
    sku: "QB-CLR-05",
    category: "color-contacts",
    subCategory: "Quick Beauty Collection",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 3200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616456/federal-optics/eyeglassimages/color%20contact%20lenses/quick%20beauty/Quick%20Beauty%20Honey.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Honey shade from Quick Beauty extended-wear coloured contact lenses, for beautiful eyes and a comfortable wearing experience.",
    features: ["Quick Beauty extended-wear colour lenses — Honey", "Wearing time: approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power: Plano to -10.00 | BC 8.6 | DIA 14.2", "Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions"],
    inStock: true,
    isNew: true,
    lensColor: "Hazel",
    lensBaseCurve: "8.6 mm",
    lensDiameter: "14.2 mm",
    lensPowerRange: "Plano to -10.00",
    availableColors: [{ name: "Honey", hex: "#b07a2a" }],
    reviews: []
  },
  {
    id: "qb-pure-hazel",
    name: "Quick Beauty — Pure Hazel",
    sku: "QB-CLR-06",
    category: "color-contacts",
    subCategory: "Quick Beauty Collection",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 3200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616457/federal-optics/eyeglassimages/color%20contact%20lenses/quick%20beauty/Quick%20Beauty%20Pure%20Hazel.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Pure Hazel shade from Quick Beauty extended-wear coloured contact lenses, for beautiful eyes and a comfortable wearing experience.",
    features: ["Quick Beauty extended-wear colour lenses — Pure Hazel", "Wearing time: approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power: Plano to -15.00 | BC 8.6 | DIA 14.2", "Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions"],
    inStock: true,
    isNew: true,
    lensColor: "Hazel",
    lensBaseCurve: "8.6 mm",
    lensDiameter: "14.2 mm",
    lensPowerRange: "Plano to -15.00",
    availableColors: [{ name: "Pure Hazel", hex: "#8f8a3a" }],
    reviews: []
  },
  {
    id: "qb-sterling-gray",
    name: "Quick Beauty — Sterling Gray",
    sku: "QB-CLR-07",
    category: "color-contacts",
    subCategory: "Quick Beauty Collection",
    gender: "unisex",
    brand: "Quick Beauty",
    price: 3200,
    rating: 0,
    reviewCount: 0,
    images: ["https://res.cloudinary.com/tyrukjzt/image/upload/v1795616458/federal-optics/eyeglassimages/color%20contact%20lenses/quick%20beauty/Quick%20Beauty%20Sterling%20Gray.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374982/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpg", "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374981/federal-optics/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpg"],
    description: "Sterling Gray shade from Quick Beauty extended-wear coloured contact lenses, for beautiful eyes and a comfortable wearing experience.",
    features: ["Quick Beauty extended-wear colour lenses — Sterling Gray", "Wearing time: approximately 10–14 hours, subject to individual suitability and eye-care professional guidance", "Power: Plano to -10.00 | BC 8.6 | DIA 14.2", "Seller-stated lifespan of approximately 2–2.5 years, subject to manufacturer care and replacement instructions"],
    inStock: true,
    isNew: true,
    lensColor: "Grey",
    lensBaseCurve: "8.6 mm",
    lensDiameter: "14.2 mm",
    lensPowerRange: "Plano to -10.00",
    availableColors: [{ name: "Sterling Gray", hex: "#a3aab2" }],
    reviews: []
  },
  
  {
    id: "sg-crt-01",
    name: "Cartier Signature Luxury Sunglasses (4 Colors)",
    sku: "SG-CRT-01",
    category: "sunglasses",
    subCategory: "Unisex Sunglasses",
    gender: "unisex",
    brand: "Cartier",
    price: 5800,
    originalPrice: 7500,
    rating: 5.0,
    reviewCount: 33,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375018/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.21%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375018/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.26%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.32%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.33%20PM.jpg"
    ],
    description: "Prestigious Cartier eyewear masterfully sculpted with gold-tone panther head accents, thick hand-polished Italian acetate, and certified UV400 sun lenses for uncompromising luxury and status.",
    features: [
      "Iconic sculpted gold-tone Cartier Panther temple accents",
      "Hand-polished heavy acetate with bevelled edge contour",
      "Category 3 certified UV400 anti-glare protection",
      "Signature Cartier hardware with German barrel hinges"
    ],
    inStock: true,
    isNew: true,
    frameShape: "square",
    frameMaterial: "Premium Italian Acetate",
    rimType: "Full Rim",
    frameSize: "Medium (54mm)",
    measurements: {
      lensWidth: 54,
      bridgeWidth: 20,
      templeLength: 145
    },
    availableColors: [
      {
        id: "sg-crt-01-blue-gradient",
        name: "Indigo Fade & Dark Tint",
        hex: "#1e3a5f",
        sku: "SG-CRT-01-BLU",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375018/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.21%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375018/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.21%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375018/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.26%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.32%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.33%20PM.jpg"
        ]
      },
      {
        id: "sg-crt-01-grey-tortoise",
        name: "Crystal Grey & Tortoise",
        hex: "#94a3b8",
        sku: "SG-CRT-01-GRY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.36%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.36%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.36%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.37%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.37%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "sg-crt-01-navy-gold",
        name: "Deep Navy & Gold Panther",
        hex: "#0f172a",
        sku: "SG-CRT-01-NVY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.38%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.38%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.38%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375022/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.39%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.40%20PM.jpg"
        ]
      },
      {
        id: "sg-crt-01-black-silver",
        name: "Onyx Black & Silver Panther",
        hex: "#111111",
        sku: "SG-CRT-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.41%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.41%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.41%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.42%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CARTIER%204%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.40.43%20PM.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "sg-cln-01",
    name: "Celine Bold Statement Couture Sunglasses (5 Colors)",
    sku: "SG-CLN-01",
    category: "sunglasses",
    subCategory: "Women’s Sunglasses",
    gender: "women",
    brand: "Celine",
    price: 5800,
    originalPrice: 7500,
    rating: 5.0,
    reviewCount: 39,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.33%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.34%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.34%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.34%20PM%20%282%29.jpg"
    ],
    description: "Iconic Parisian luxury statement sunglasses featuring Celine’s renowned triple-dot temple pins, bold flat-top silhouette, and category 3 high-contrast sun lenses.",
    features: [
      "Distinctive gold starburst temple inlays and 3-pin hinge details",
      "Bold sculptural flat-top front browline",
      "Premium optical clarity UV400 protective dark lenses",
      "Substantial hand-finished premium acetate construction"
    ],
    inStock: true,
    isNew: true,
    frameShape: "square",
    frameMaterial: "Premium Italian Acetate",
    rimType: "Full Rim",
    frameSize: "Medium (53mm)",
    measurements: {
      lensWidth: 53,
      bridgeWidth: 21,
      templeLength: 145
    },
    availableColors: [
      {
        id: "sg-cln-01-smoke-grey",
        name: "Translucent Smoke Grey Fade",
        hex: "#475569",
        sku: "SG-CLN-01-GRY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.31%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.31%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.32%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.32%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.33%20PM.jpg"
        ]
      },
      {
        id: "sg-cln-01-jet-black",
        name: "Glossy Jet Black",
        hex: "#09090b",
        sku: "SG-CLN-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.33%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375023/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.33%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.34%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.34%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.34%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "sg-cln-01-havana-amber",
        name: "Translucent Olive & Amber",
        hex: "#5b2909",
        sku: "SG-CLN-01-AMB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.35%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.35%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.36%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.37%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.38%20PM.jpg"
        ]
      },
      {
        id: "sg-cln-01-crystal-clear",
        name: "Crystal Clear Ivory",
        hex: "#f8fafc",
        sku: "SG-CLN-01-CLR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.39%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.39%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.39%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375024/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.40%20PM.jpg"
        ]
      },
      {
        id: "sg-cln-01-honey-twotone",
        name: "Honey Amber Two-Tone",
        hex: "#d97706",
        sku: "SG-CLN-01-HNY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.41%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.41%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.41%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.42%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/CELINE%205%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.29.43%20PM.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "sg-lv-01",
    name: "Louis Vuitton Haute Designer Sunglasses (5 Colors)",
    sku: "SG-LV-01",
    category: "sunglasses",
    subCategory: "Unisex Sunglasses",
    gender: "unisex",
    brand: "Louis Vuitton",
    price: 5800,
    originalPrice: 7500,
    rating: 5.0,
    reviewCount: 41,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.44.37%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.44.44%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.44.54%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.00%20PM.jpg"
    ],
    description: "Opulent Louis Vuitton couture sunglasses highlighting detailed Monogram filigree hinges, sculpted thick-gauge acetate temples, and certified UV400 sun protection.",
    features: [
      "Ornate Louis Vuitton filigree metal temple hinge plates",
      "Bold thick-cut Italian acetate front frame profile",
      "Certified 100% UV400 category 3 sun-blocking lenses",
      "Subtle laser-etched LV branding and serial engravings"
    ],
    inStock: true,
    isNew: true,
    frameShape: "square",
    frameMaterial: "Premium Italian Acetate",
    rimType: "Full Rim",
    frameSize: "Medium (53mm)",
    measurements: {
      lensWidth: 53,
      bridgeWidth: 20,
      templeLength: 145
    },
    availableColors: [
      {
        id: "sg-lv-01-crystal-smoke",
        name: "Crystal Smoke Grey",
        hex: "#475569",
        sku: "SG-LV-01-GRY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.44.37%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.44.37%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.44.44%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375025/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.44.54%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.00%20PM.jpg"
        ]
      },
      {
        id: "sg-lv-01-black-gold",
        name: "Black & Gold Accent",
        hex: "#0f172a",
        sku: "SG-LV-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.43%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.43%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.45%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.47%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.48%20PM.jpg"
        ]
      },
      {
        id: "sg-lv-01-warm-amber",
        name: "Warm Amber Caramel",
        hex: "#b45309",
        sku: "SG-LV-01-AMB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.49%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.49%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.50%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375026/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.56%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.56%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "sg-lv-01-dark-demi",
        name: "Dark Demi Tortoise",
        hex: "#713f12",
        sku: "SG-LV-01-TOR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.57%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.57%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.57%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.58%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.58%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "sg-lv-01-crystal-clear",
        name: "Transparent Crystal Clear",
        hex: "#e2e8f0",
        sku: "SG-LV-01-CLR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.59%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.59%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.45.59%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.46.00%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/LOUIS%20VUITTON%205%20Colors%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.46.01%20PM.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "sg-mj-01",
    name: "Marc Jacobs Contemporary Sunglasses (3 Colors)",
    sku: "SG-MJ-01",
    category: "sunglasses",
    subCategory: "Women’s Sunglasses",
    gender: "women",
    brand: "Marc Jacobs",
    price: 5800,
    originalPrice: 7500,
    rating: 4.9,
    reviewCount: 27,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.30.54%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.05%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.10%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.16%20PM.jpg"
    ],
    description: "Chic contemporary designer sunglasses by Marc Jacobs showcasing signature arrow metal temple pins, refined bevelled proportions, and gradient UV lenses.",
    features: [
      "Marc Jacobs signature arrow metal temple hardware",
      "Ergonomic nose bridge contoured for comfort",
      "Shatter-resistant gradient UV400 lenses",
      "Durable optical-grade acetate structure"
    ],
    inStock: true,
    isNew: true,
    frameShape: "rectangle",
    frameMaterial: "Premium Italian Acetate",
    rimType: "Full Rim",
    availableColors: [
      {
        id: "sg-mj-01-classic-black",
        name: "Classic Noir Black",
        hex: "#09090b",
        sku: "SG-MJ-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.30.54%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375027/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.30.54%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.05%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.10%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.16%20PM.jpg"
        ]
      },
      {
        id: "sg-mj-01-blush-mauve",
        name: "Soft Blush Mauve Gradient",
        hex: "#a855f7",
        sku: "SG-MJ-01-MAU",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.26%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.26%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.26%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.27%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.27%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "sg-mj-01-tortoise-amber",
        name: "Tortoise Amber Translucent",
        hex: "#92400e",
        sku: "SG-MJ-01-AMB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.28%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.28%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375028/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.28%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.29%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/MARK%20JACOBS%203%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.31.29%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "sg-prd-01",
    name: "Prada Milano Faceted Temple Sunglasses (4 Colors)",
    sku: "SG-PRD-01",
    category: "sunglasses",
    subCategory: "Unisex Sunglasses",
    gender: "unisex",
    brand: "Prada",
    price: 5800,
    originalPrice: 7500,
    rating: 5.0,
    reviewCount: 48,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.11%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.24%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.47%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.49%20PM.jpg"
    ],
    description: "Avant-garde runway sunglasses featuring Prada’s geometric faceted temples, triangle logo hardware, and bold thick-rim architecture for an unmistakable luxury presence.",
    features: [
      "Signature Prada Milano triangular emblem temple inlays",
      "Architectural multi-faceted temple geometry",
      "Full UV400 high-definition sun filtering",
      "Precision Italian heavy-gauge acetate build"
    ],
    inStock: true,
    isNew: true,
    frameShape: "square",
    frameMaterial: "Premium Italian Acetate",
    rimType: "Full Rim",
    frameSize: "Medium (53mm)",
    measurements: {
      lensWidth: 53,
      bridgeWidth: 20,
      templeLength: 145
    },
    availableColors: [
      {
        id: "sg-prd-01-translucent-brown",
        name: "Translucent Champagne Brown",
        hex: "#78350f",
        sku: "SG-PRD-01-BRN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.11%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.11%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.24%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.47%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.49%20PM.jpg"
        ]
      },
      {
        id: "sg-prd-01-crystal-clear",
        name: "Crystal Clear Transparent",
        hex: "#e2e8f0",
        sku: "SG-PRD-01-CLR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.52%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.52%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.54%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.54%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.55%20PM.jpg"
        ]
      },
      {
        id: "sg-prd-01-slate-grey",
        name: "Translucent Slate Grey",
        hex: "#475569",
        sku: "SG-PRD-01-GRY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.55%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375029/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.55%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375031/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.56%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.56%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.57%20PM.jpg"
        ]
      },
      {
        id: "sg-prd-01-onyx-black",
        name: "Onyx Black & Grey Tint",
        hex: "#09090b",
        sku: "SG-PRD-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.58%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.58%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.58%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.41.59%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375030/federal-optics/eyeglassimages/sunglasses/PRADA%204%20COLORS%20RS%205800/WhatsApp%20Image%202026-10-20%20at%206.42.00%20PM.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "fo-lew-01",
    aliases: [
      "fo-lew-01-royal-purple",
      "fo-lew-01-rose-pink",
      "fo-lew-01-maroon",
      "fo-lew-01-golden",
      "fo-lew-01-maroon-full",
      "fo-lew-01-golden-half"
    ],
    name: "Federal Atelier Sculpted Ladies Eyewear Collection",
    sku: "FO-LEW-01",
    category: "eyeglasses",
    subCategory: "Women’s Eyeglasses",
    gender: "women",
    brand: "Federal Atelier",
    price: 1999,
    originalPrice: 2800,
    rating: 4.9,
    reviewCount: 31,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.17%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374994/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.19%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374994/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.20%20PM.jpg"
    ],
    description: "Graceful, feminine titanium and acetate spectacles designed with delicate filigree temples and soft pastel finishes. Lightweight everyday comfort with optical poise.",
    features: [
      "Ultra-lightweight sculpted brow with delicate floral motifs",
      "Flexible featherweight wire core temples",
      "Soft silicone non-slip contour nose pads",
      "Corrosion-resistant hypoallergenic metallic coating"
    ],
    inStock: true,
    isNew: true,
    frameShape: "cat-eye",
    frameMaterial: "Lightweight Alloy & Acetate",
    rimType: "Full Rim",
    frameSize: "Medium (52mm)",
    measurements: {
      lensWidth: 52,
      bridgeWidth: 17,
      templeLength: 138
    },
    availableColors: [
      {
        id: "fo-lew-01-royal-purple",
        name: "Royal Purple",
        hex: "#7e22ce",
        sku: "FO-LEW-01-PUR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.17%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374993/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.17%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374994/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.19%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374994/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.20%20PM.jpg"
        ]
      },
      {
        id: "fo-lew-01-rose-pink",
        name: "Pastel Rose Pink",
        hex: "#f472b6",
        sku: "FO-LEW-01-PNK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374994/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.21%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374994/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.21%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.22%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.22%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "fo-lew-01-maroon",
        name: "Deep Velvet Maroon (Half-Rim)",
        hex: "#881337",
        sku: "FO-LEW-01-MAR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.23%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.23%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.24%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.24%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "fo-lew-01-maroon-full",
        name: "Deep Velvet Maroon (Full-Rim)",
        hex: "#5a1f24",
        sku: "FO-LEW-01-FULL",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.25%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.25%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.26%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.27%20PM.jpg"
        ]
      },
      {
        id: "fo-lew-01-golden",
        name: "Lustrous Warm Golden (Full-Rim)",
        hex: "#eab308",
        sku: "FO-LEW-01-GLD",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.27%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.27%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.28%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.29%20PM.jpg"
        ]
      },
      {
        id: "fo-lew-01-golden-half",
        name: "Lustrous Warm Golden (Half-Rim)",
        hex: "#d4a464",
        sku: "FO-LEW-01-HALF",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.29%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374998/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.29%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.31%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374999/federal-optics/eyeglassimages/LADIES%20EYEWARE%20Colors%20Purple%2C%20Pink%2C%20Maroon%20Golden%20%2C%20rs%2019990/WhatsApp%20Image%202026-10-20%20at%206.10.31%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "fo-por-01",
    name: "Porsche Design Executive Dual-Tone Titanium Blend Frames",
    sku: "FO-POR-01",
    category: "eyeglasses",
    subCategory: "Men’s Eyeglasses",
    gender: "men",
    brand: "Porsche Design",
    price: 3250,
    originalPrice: 4500,
    rating: 5.0,
    reviewCount: 38,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374724/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.23%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.31%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.39%20PM.jpg"
    ],
    description: "High-performance men’s executive frames inspired by Porsche automotive engineering. Dual-tone precision metal profile with flex hinges for tailored fit, commanding presence, and all-day comfort.",
    features: [
      "Aerospace-grade Titanium Alloy construction",
      "Ergonomic dual-tone browline styling",
      "Spring-assisted multi-flex temple hinges",
      "Hypoallergenic adjustable silicone nose pads"
    ],
    inStock: true,
    isNew: true,
    frameShape: "rectangle",
    frameMaterial: "Titanium Blend",
    rimType: "Full Rim",
    frameSize: "Medium (54mm)",
    measurements: {
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 142
    },
    availableColors: [
      {
        id: "fo-por-01-black-golden",
        name: "Black & Golden",
        hex: "#d4af37",
        sku: "FO-POR-01-BG",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374724/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.23%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794374724/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.23%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.31%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.39%20PM.jpg"
        ]
      },
      {
        id: "fo-por-01-copper-metallic",
        name: "Copper Metallic",
        hex: "#b45309",
        sku: "FO-POR-01-COP",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.40%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.40%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.41%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375004/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.43%20PM.jpg"
        ]
      },
      {
        id: "fo-por-01-silver-metallic",
        name: "Silver Metallic",
        hex: "#94a3b8",
        sku: "FO-POR-01-SIL",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.45%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.45%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.45%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.49%20PM.jpg"
        ]
      },
      {
        id: "fo-por-01-polished-golden",
        name: "Polished Golden",
        hex: "#eab308",
        sku: "FO-POR-01-GLD",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.49%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.49%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.50%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375005/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.50%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "fo-por-01-carbon-black",
        name: "Sleek Carbon Black",
        hex: "#18181b",
        sku: "FO-POR-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.50%20PM%20%282%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.50%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.51%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375006/federal-optics/eyeglassimages/PORRSCEHE%20BLACK%20GOLDEN%20%2C%20COPPER%20M%20SILVER%20%2C%20GOLDEN%20%2C%20BLACK%20RS%203250/WhatsApp%20Image%202026-10-20%20at%206.21.51%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "fo-yqk-01",
    aliases: [
      "fo-yqk-01-black-ombre",
      "fo-yqk-01-gloss-black",
      "fo-yqk-01-crystal-clear",
      "fo-yqk-01-slate-grey",
      "fo-yqk-01-demi-brown",
      "fo-yqk-01-ombre-chain",
      "fo-yqk-01-black-silver",
      "fo-yqk-01-black-gold"
    ],
    name: "YQKEAKOG Resilient Lightweight TR Eyeglasses",
    sku: "FO-YQK-01",
    category: "eyeglasses",
    subCategory: "Unisex Eyeglasses",
    gender: "unisex",
    brand: "Yqkeakog",
    price: 2650,
    originalPrice: 3500,
    rating: 4.8,
    reviewCount: 22,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375059/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.11%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.17%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.27%20PM.jpg"
    ],
    description: "Ultra-durable, highly resilient square TR90 eyeglasses engineered for everyday screen use and active lifestyles. Features geometric temple inlays and featherweight ergonomics.",
    features: [
      "Aerospace TR90 Swiss polymer - bendable and memory-flex",
      "Ergonomic bridge contour with zero temple pressure",
      "Metallic geometric side accents with reinforced hinges",
      "Sweat and skin-oil resistant hypoallergenic finish"
    ],
    inStock: true,
    isNew: true,
    frameShape: "rectangle",
    frameMaterial: "TR90 Polymer",
    rimType: "Full Rim",
    frameSize: "Medium (53mm)",
    measurements: {
      lensWidth: 53,
      bridgeWidth: 18,
      templeLength: 142
    },
    availableColors: [
      {
        id: "fo-yqk-01-black-ombre",
        name: "Black & Clear Ombré",
        hex: "#171717",
        sku: "FO-YQK-01-OMB",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375059/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.11%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375059/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.11%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.17%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.27%20PM.jpg"
        ]
      },
      {
        id: "fo-yqk-01-gloss-black",
        name: "Gloss Black",
        hex: "#0a0a0a",
        sku: "FO-YQK-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.29%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.29%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.29%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.30%20PM.jpg"
        ]
      },
      {
        id: "fo-yqk-01-crystal-clear",
        name: "Crystal Clear",
        hex: "#f8fafc",
        sku: "FO-YQK-01-CLR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.36%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375060/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.36%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375061/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.37%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375061/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.37%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "fo-yqk-01-slate-grey",
        name: "Smoky Slate Grey",
        hex: "#525252",
        sku: "FO-YQK-01-GRY",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.39%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.39%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.39%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.40%20PM.jpg"
        ]
      },
      {
        id: "fo-yqk-01-demi-brown",
        name: "Rich Demi Brown Aviator",
        hex: "#78350f",
        sku: "FO-YQK-01-BRN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.50%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.50%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.53%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.54%20PM.jpg"
        ]
      },
      {
        id: "fo-yqk-01-ombre-chain",
        name: "Black & Clear Ombré (Chain Temple)",
        hex: "#3a3a3a",
        sku: "FO-YQK-01-CHAIN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375061/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.37%20PM%20%282%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375061/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.37%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375061/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.38%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375061/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.38%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "fo-yqk-01-black-silver",
        name: "Gloss Black & Silver Temple",
        hex: "#111111",
        sku: "FO-YQK-01-SILVER",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.40%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.40%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.40%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.41%20PM.jpg"
        ]
      },
      {
        id: "fo-yqk-01-black-gold",
        name: "Gloss Black & Gold Temple",
        hex: "#1a1a1a",
        sku: "FO-YQK-01-GOLD",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.41%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375062/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.41%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.42%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375063/federal-optics/eyeglassimages/YQKEAKOG%20RS%202650/WhatsApp%20Image%202026-10-20%20at%206.12.42%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
  
  {
    id: "fo-yny-01",
    aliases: [
      "fo-yny-01-cerulean-blue",
      "fo-yny-01-light-purple",
      "fo-yny-01-black-twotone",
      "fo-yny-01-light-pink",
      "fo-yny-01-walnut-brown",
      "fo-yny-01-crystal-ice",
      "fo-yny-01-crystal",
      "fo-yny-01-jet-black",
      "fo-yny-01-black-burgundy"
    ],
    name: "YunYi Flexible Featherlight Two-Tone Frames",
    sku: "FO-YNY-01",
    category: "eyeglasses",
    subCategory: "Unisex Eyeglasses",
    gender: "unisex",
    brand: "Yunyi",
    price: 1999,
    originalPrice: 2800,
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.40%20PM.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.40%20PM%20%281%29.jpg",
      "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.41%20PM.jpg"
    ],
    description: "Vibrant and featherlight round TR90 eyeglasses with two-tone contrasting temples and ergonomic bridge. Perfect balance of playful modern style and featherlight all-day comfort.",
    features: [
      "Featherlight Swiss TR90 flexible construction",
      "Two-tone contemporary temple accents",
      "All-day comfortable nose pads molded into frame",
      "Flexible spring temples resistant to twisting and dropping"
    ],
    inStock: true,
    isNew: true,
    frameShape: "round",
    frameMaterial: "TR90 Memory Flex",
    rimType: "Full Rim",
    frameSize: "Medium (50mm)",
    measurements: {
      lensWidth: 50,
      bridgeWidth: 18,
      templeLength: 140
    },
    availableColors: [
      {
        id: "fo-yny-01-cerulean-blue",
        name: "Cerulean Blue & Black",
        hex: "#2563eb",
        sku: "FO-YNY-01-BLU",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.40%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.40%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.40%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.41%20PM.jpg"
        ]
      },
      {
        id: "fo-yny-01-light-purple",
        name: "Light Lavender Purple",
        hex: "#c084fc",
        sku: "FO-YNY-01-PUR",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.39%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.39%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.39%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.39%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "fo-yny-01-black-twotone",
        name: "Black Two-Tone Fade",
        hex: "#171717",
        sku: "FO-YNY-01-BLK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.28%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.28%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.31%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.32%20PM.jpg"
        ]
      },
      {
        id: "fo-yny-01-light-pink",
        name: "Soft Light Pink",
        hex: "#f9a8d4",
        sku: "FO-YNY-01-PNK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.41%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.41%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.41%20PM%20%282%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.42%20PM.jpg"
        ]
      },
      {
        id: "fo-yny-01-walnut-brown",
        name: "Dark Walnut Brown",
        hex: "#582f0e",
        sku: "FO-YNY-01-BRN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.27%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.27%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.27%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.27%20PM%20%282%29.jpg"
        ]
      },
      {
        id: "fo-yny-01-crystal-ice",
        name: "Translucent Smoke Grey",
        hex: "#b4b4b4",
        sku: "FO-YNY-01-ICE",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.44%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.44%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.44%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.45%20PM.jpg"
        ]
      },
      {
        id: "fo-yny-01-crystal",
        name: "Translucent Crystal Ice",
        hex: "#ececec",
        sku: "FO-YNY-01-CRYSTA",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.42%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.42%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.43%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375066/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.43%20PM%20%281%29.jpg"
        ]
      },
      {
        id: "fo-yny-01-jet-black",
        name: "Solid Jet Black",
        hex: "#111111",
        sku: "FO-YNY-01-BLACK",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.32%20PM%20%281%29.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.32%20PM%20%281%29.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.33%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.34%20PM.jpg"
        ]
      },
      {
        id: "fo-yny-01-black-burgundy",
        name: "Black & Burgundy Wine",
        hex: "#5a1a24",
        sku: "FO-YNY-01-BURGUN",
        image: "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.37%20PM.jpg",
        images: [
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.37%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375065/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.38%20PM.jpg",
          "https://res.cloudinary.com/tyrukjzt/image/upload/v1794375064/federal-optics/eyeglassimages/YUNYI%20RS%201999%20COLRS%20%20BLUE%20%2C%20LIGHT%20PURPLE%20%2C%20BLACK%202%20TONE%20%2C%20L.PINK%2C%20DARK%20BROWN/WhatsApp%20Image%202026-10-20%20at%206.05.38%20PM%20%281%29.jpg"
        ]
      }
    ],
    reviews: []
  },
];

export function getProductById(id: string): Product | undefined {
  if (!id) return undefined;
  const lower = id.toLowerCase();
  const direct = PRODUCTS.find(p => p.id.toLowerCase() === lower);
  if (direct) return direct;
  return PRODUCTS.find(p =>
    (p.aliases && p.aliases.some(a => a.toLowerCase() === lower)) ||
    (p.availableColors && p.availableColors.some(c => c.id?.toLowerCase() === lower || c.sku?.toLowerCase() === lower))
  );
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category || p.subCategory.toLowerCase().includes(category.toLowerCase()));
}

export function getFeaturedProducts(limit = 8): Product[] {
  return PRODUCTS.slice(0, limit);
}
