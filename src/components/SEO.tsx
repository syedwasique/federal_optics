import React, { useEffect } from 'react';
import type { Product } from '../data/products';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

export const BASE_URL = 'https://federaloptical.com';
const DEFAULT_TITLE = 'Federal Optical — Computerized Eye Clinic & Designer Eyewear Since 1975';
const DEFAULT_DESCRIPTION = 'Karachi’s trusted family opticians since 1975. Shop designer eyeglasses, sunglasses, and contact lenses, or book your computerized eye exam. Serving Pakistan with fast nationwide delivery.';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374921/federal-optics/assets/hero/hero-eyeglasses-desktop-1920.webp';
const SITE_NAME = 'Federal Optical';

// Pre-built LocalBusiness / Optician schema for Federal Optical
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Optician', 'MedicalBusiness', 'LocalBusiness'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Federal Optical — Computerized Eye Clinic',
    alternateName: 'Federal Optical',
    url: BASE_URL,
    logo: `${BASE_URL}/assets/logos/logo_charcoal.png`,
    image: DEFAULT_IMAGE,
    description: DEFAULT_DESCRIPTION,
    foundingDate: '1975',
    priceRange: 'PKR 1,500 - 15,000',
    telephone: '+92-300-8239063',
    email: 'federaloptical1975@gmail.com',
    sameAs: [
      'https://instagram.com/federaloptical',
      'https://maps.google.com/?q=Federal+Optical+Karachi'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      addressCountry: 'PK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '24.8607',
      longitude: '67.0011'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '11:00',
        closes: '21:30'
      }
    ],
    medicalSpecialty: 'Optometry',
    availableService: [
      {
        '@type': 'MedicalProcedure',
        name: 'Computerized Eye Testing & Vision Examination'
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Prescription Lens Fitting & Alignment'
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Contact Lens Consultation'
      }
    ]
  };
}

// Pre-built Product schema generator
export function getProductSchema(product: Product, selectedColorName?: string) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [DEFAULT_IMAGE];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BASE_URL}/product/${product.id}#product`,
    name: selectedColorName ? `${product.name} — ${selectedColorName}` : product.name,
    image: images,
    description: product.description || `${product.name} by ${product.brand}. Available with worldwide and Pakistan shipping at Federal Optical.`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Federal Optical'
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${product.id}`,
      priceCurrency: 'PKR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Federal Optical',
        url: BASE_URL
      }
    }
  };
}

// Pre-built Breadcrumbs schema generator
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`
    }))
  };
}

function updateMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function updateJsonLd(schema?: Record<string, unknown> | Record<string, unknown>[]) {
  const SCRIPT_ID = 'seo-structured-data';
  const existing = document.getElementById(SCRIPT_ID);

  if (!schema) {
    if (existing) existing.remove();
    return;
  }

  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(schema);
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  schema,
}) => {
  const fullTitle = title
    ? (title.includes('Federal Optical') ? title : `${title} | Federal Optical`)
    : DEFAULT_TITLE;

  const fullCanonical = canonical
    ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
    : (typeof window !== 'undefined' ? window.location.href.split('?')[0] : BASE_URL);

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // 2. Standard Meta Tags
    updateMetaTag('name', 'description', description);
    updateLinkTag('canonical', fullCanonical);

    // 3. OpenGraph / Facebook Tags
    updateMetaTag('property', 'og:site_name', SITE_NAME);
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', fullCanonical);
    updateMetaTag('property', 'og:type', type);

    // 4. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // 5. Structured Data JSON-LD
    updateJsonLd(schema);
  }, [fullTitle, description, fullCanonical, image, type, schema]);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
};
