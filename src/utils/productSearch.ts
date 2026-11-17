import type { Product } from '../data/products';

/* -------------------------------------------------------------------------- */
/* Catalogue search                                                           */
/*                                                                            */
/* - Every query word must match somewhere in the product (any order, any     */
/*   field), so "brown aviator men" works as well as "aviator".               */
/* - Matches are exact > prefix > substring > small typo, weighted by field   */
/*   (name/brand/SKU outrank description).                                    */
/* - Light stemming, synonyms and joined words ("rayban" = "Ray-Ban").        */
/* - If nothing matches every word, falls back to the closest products.       */
/* -------------------------------------------------------------------------- */

type FieldIndex = { weight: number; tokens: string[] };
type IndexedProduct = { product: Product; fields: FieldIndex[]; nameNorm: string };

export type SearchResult = {
  results: Product[];
  total: number;
  /** true when no product matched every word and these are the closest matches */
  approximate: boolean;
};

const STOPWORDS = new Set([
  'a', 'an', 'and', 'the', 'for', 'of', 'in', 'with', 'to', 'on', 'by', 'from', 'my', 'me', 'i', 'want', 'need', 'show', 'buy',
]);

/** Words customers type -> the words to look for instead (replaces the typed word,
 *  so list the original too when it should still match). Keys/values are normalised. */
const QUERY_SYNONYMS: Record<string, string[]> = {
  grey: ['grey', 'gray'], gray: ['gray', 'grey'],
  colour: ['color'], coloured: ['color'], colored: ['color'], colours: ['color'],
  polarised: ['polarized'],
  spec: ['eyeglass'], specs: ['eyeglass'], spectacle: ['eyeglass'], spectacles: ['eyeglass'],
  frame: ['eyeglass', 'frame'], optical: ['eyeglass', 'optical'],
  shade: ['sunglass'], shades: ['sunglass'], sunnies: ['sunglass'], goggle: ['sunglass'], goggles: ['sunglass'],
  lense: ['lens'],
  ladies: ['women', 'ladies'], lady: ['women', 'ladies'], female: ['women'], girl: ['women', 'kid'], womens: ['women'],
  gents: ['men'], gent: ['men'], male: ['men'], boy: ['men', 'kid'], mens: ['men'],
  child: ['kid'], children: ['kid'], kids: ['kid'], teen: ['kid', 'teen'], teenager: ['kid', 'teen'], junior: ['kid', 'junior'],
  astigmatism: ['toric', 'astigmatism'],
  annual: ['yearly'], quarterly: ['quarterly'],
  cleaner: ['cleaner', 'clean', 'solution'], liquid: ['solution'],
  case: ['box', 'case'], cord: ['rope', 'cord'], chain: ['rope', 'cord'], dori: ['dori', 'rope'],
  honey: ['honey', 'hazel'],
};

/** If none of these appear in the query, accessories (solutions, cases, cords...)
 *  rank below eyewear and lenses: "daily contacts" should show lenses first. */
const ACCESSORY_INTENT = new Set(
  'accessory accessories solution cleaner clean spray wipe cloth case box pouch rope cord chain dori hook grip kit care drop bottle ml liquid'
    .split(' ')
);

const CATEGORY_TERMS: Record<string, string> = {
  eyeglasses: 'eyeglasses glasses spectacles specs frames optical prescription',
  sunglasses: 'sunglasses sun glasses shades uv protection',
  'tint-eyeglasses': 'tinted eyeglasses tint glasses',
  'clear-contacts': 'clear transparent contact lenses contacts lens',
  'color-contacts': 'color colored coloured contact lenses contacts lens cosmetic',
  accessories: 'accessories lens care',
};

const GENDER_TERMS: Record<string, string> = {
  men: 'men mens male gents gentlemen',
  women: 'women womens ladies female',
  kids: 'kids children teen teenage junior boys girls',
  unisex: 'unisex men women',
};

const DISPOSABILITY_TERMS: Record<string, string> = {
  daily: 'daily 1 day one day disposable',
  monthly: 'monthly 1 month one month',
  'three-month': 'quarterly 3 month three month',
  'six-month': '6 month six month half yearly',
  yearly: 'yearly annual 1 year one year',
};

export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Light stemmer, applied identically to catalogue and query words. */
function stem(w: string): string {
  if (w.length <= 3 || /\d/.test(w)) return w;
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('sses')) return w.slice(0, -2);
  if (w.endsWith('es') && /(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokenize(text: string | undefined | null): string[] {
  if (!text) return [];
  const words = normalize(text).split(' ').filter(Boolean);
  const out = words.map(stem);
  // joined neighbours so "rayban", "cateye", "1day" match "Ray-Ban", "Cat-Eye", "1-Day"
  for (let i = 0; i < words.length - 1; i++) out.push(stem(words[i] + words[i + 1]));
  return out;
}

function buildIndex(products: Product[]): IndexedProduct[] {
  return products.map(p => {
    const f = (weight: number, ...texts: (string | undefined | null)[]): FieldIndex => ({
      weight,
      tokens: Array.from(new Set(texts.flatMap(t => tokenize(t)))),
    });
    return {
      product: p,
      nameNorm: normalize(p.name),
      fields: [
        f(10, p.name),
        f(8, p.brand, p.sku),
        f(6, p.subCategory, CATEGORY_TERMS[p.category] ?? p.category, p.frameShape),
        f(5, GENDER_TERMS[p.gender], p.lensColor, ...p.availableColors.map(c => c.name)),
        f(5, p.disposability && DISPOSABILITY_TERMS[p.disposability], p.isToric ? 'toric astigmatism' : ''),
        f(4, p.frameMaterial, p.rimType, p.frameSize),
        f(3, ...(p.aliases ?? [])),
        f(2, ...p.features),
        f(1, p.description),
      ],
    };
  });
}

/** Levenshtein distance with an early exit once it exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** How well one query word matches one catalogue word (0 = no match).
 *  Typo matching is only used when `fuzzy` is on (see searchProducts). */
function wordMatch(q: string, d: string, fuzzy: boolean): number {
  if (q === d) return 1;
  if (d.startsWith(q)) return q.length >= 2 ? 0.8 : 0;
  if (q.length >= 4 && d.includes(q)) return 0.6;
  if (fuzzy && q.length >= 4 && !/\d/.test(q) && d.length >= 4) {
    const max = q.length >= 7 ? 2 : 1;
    if (editDistance(q, d, max) <= max) return 0.45;
  }
  return 0;
}

/** Best score of a query word (with its synonyms) against a product. */
function termScore(variants: string[], ip: IndexedProduct, fuzzy = false): number {
  let best = 0;
  for (const field of ip.fields) {
    for (const d of field.tokens) {
      for (const v of variants) {
        const m = wordMatch(v, d, fuzzy);
        if (m) best = Math.max(best, m * field.weight);
      }
    }
  }
  return best;
}

let cachedSource: Product[] | null = null;
let cachedIndex: IndexedProduct[] = [];

export function searchProducts(products: Product[], query: string, limit = 40): SearchResult {
  if (cachedSource !== products) {
    cachedIndex = buildIndex(products);
    cachedSource = products;
  }
  const qNorm = normalize(query);
  const rawWords = qNorm.split(' ').filter(w => w && !STOPWORDS.has(w));
  if (!rawWords.length) return { results: [], total: 0, approximate: false };

  // each query word -> its variants (stemmed word + synonyms); also try the whole query joined
  const terms = rawWords.map(w => {
    const syn = QUERY_SYNONYMS[w] ?? QUERY_SYNONYMS[stem(w)];
    return Array.from(new Set((syn ?? [w]).map(stem)));
  });
  const joined = stem(rawWords.join(''));
  const wantsAccessory = rawWords.some(w => ACCESSORY_INTENT.has(w) || ACCESSORY_INTENT.has(stem(w)) || /^\d+ml$/.test(w));

  // score[term][product]; a word only gets typo-tolerant matching if it has
  // no real match anywhere in the catalogue (so "rope" never pulls in "Rose")
  const termScores = terms.map(t => {
    const strict = cachedIndex.map(ip => termScore(t, ip));
    return strict.some(s => s > 0) ? strict : cachedIndex.map(ip => termScore(t, ip, true));
  });

  const scored = cachedIndex.map((ip, i) => {
    const scores = termScores.map(ts => ts[i]);
    const matched = scores.filter(s => s > 0).length;
    let score = scores.reduce((a, b) => a + b, 0);
    if (ip.nameNorm.includes(qNorm)) score += 25; // whole phrase in the name
    else if (rawWords.length > 1 && termScore([joined], ip) > 0) score += 8;
    if (!ip.product.inStock) score *= 0.9;
    if (ip.product.category === 'accessories' && !wantsAccessory) score *= 0.5;
    return { product: ip.product, score, matched };
  });

  const byScore = (a: { score: number }, b: { score: number }) => b.score - a.score;
  const exact = scored.filter(s => s.matched === terms.length).sort(byScore);
  if (exact.length) {
    return { results: exact.slice(0, limit).map(s => s.product), total: exact.length, approximate: false };
  }

  // Nothing matched every word: show products matching the most words
  const need = Math.max(1, Math.ceil(terms.length / 2));
  const partial = scored
    .filter(s => s.matched >= need)
    .sort((a, b) => b.matched - a.matched || b.score - a.score);
  return { results: partial.slice(0, limit).map(s => s.product), total: partial.length, approximate: partial.length > 0 };
}
