import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewType =
  | 'home'
  | 'catalog'
  | 'product'
  | 'about'
  | 'contact'
  | 'federal-care'
  | 'faq'
  | 'stores'
  | 'policies';

export interface NavigationParams {
  category?: string;
  subCategory?: string;
  productId?: string;
  brand?: string;
  disposability?: string;
  lensColor?: string;
  color?: string;
  searchQuery?: string;
  filterShape?: string;
  policyTab?: string;
}

interface NavigationContextType {
  currentView: ViewType;
  params: NavigationParams;
  navigateTo: (view: ViewType, params?: NavigationParams) => void;
  openProduct: (productId: string, color?: string) => void;
  openCategory: (category: string, subCategory?: string, extra?: NavigationParams) => void;
}

const QUERY_KEYS: (keyof NavigationParams)[] = [
  'category', 'subCategory', 'productId', 'brand', 'disposability', 'lensColor',
  'color', 'searchQuery', 'filterShape', 'policyTab'
];

const PAGE_VIEWS: ViewType[] = [
  'about', 'contact', 'federal-care', 'faq', 'stores', 'policies'
];

function sameParams(a: NavigationParams, b: NavigationParams): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof NavigationParams>;
  for (const k of keys) if ((a[k] || undefined) !== (b[k] || undefined)) return false;
  return true;
}

function compact(p: NavigationParams): NavigationParams {
  const out: NavigationParams = {};
  for (const k of QUERY_KEYS) if (p[k]) out[k] = p[k];
  return out;
}

function safeDecode(v?: string): string | undefined {
  if (!v) return undefined;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/** Path parts carry view / category / product; every other param travels in a
 *  "?query", so brand, colour, disposability, shape and tab selections survive
 *  navigation, page refresh, and shared links. */
function buildPath(view: ViewType, p: NavigationParams): string {
  const query = (omit: (keyof NavigationParams)[]) => {
    const q = new URLSearchParams();
    for (const k of QUERY_KEYS) if (!omit.includes(k) && p[k]) q.set(k, p[k] as string);
    const str = q.toString();
    return str ? '?' + str : '';
  };
  if (view === 'home') return '/' + (query([]).startsWith('?') ? query([]) : '');
  if (view === 'product' && p.productId) {
    return '/product/' + encodeURIComponent(p.productId) + query(['productId']);
  }
  if (view === 'catalog') {
    const sub = p.subCategory ? '/' + encodeURIComponent(p.subCategory) : '';
    return '/catalog/' + (p.category || 'all') + sub + query(['category', 'subCategory']);
  }
  return '/' + view + query([]);
}

function parseLocation(): { view: ViewType; params: NavigationParams } {
  // 1. Check if user landed with a hash (backward compatibility with legacy #/ links)
  const hash = window.location.hash.replace(/^#\/?/, '');
  let raw = window.location.pathname.replace(/^\/+/, '');
  let search = window.location.search;

  if (hash) {
    const qIndex = hash.indexOf('?');
    raw = qIndex === -1 ? hash : hash.slice(0, qIndex);
    if (qIndex !== -1) {
      search = '?' + hash.slice(qIndex + 1);
    }
  }

  const query: NavigationParams = {};
  if (search && search.length > 1) {
    new URLSearchParams(search.slice(1)).forEach((value, key) => {
      if ((QUERY_KEYS as string[]).includes(key)) query[key as keyof NavigationParams] = value;
    });
  }

  if (!raw) return { view: 'home', params: {} };

  const parts = raw.split('/');
  const view = parts[0];

  if (view === 'product' && parts[1]) {
    return { view: 'product', params: compact({ ...query, productId: safeDecode(parts[1]) }) };
  }
  if (view === 'catalog') {
    return {
      view: 'catalog',
      params: compact({ ...query, category: parts[1] || 'all', subCategory: safeDecode(parts[2]) })
    };
  }
  if (['privacy-policy', 'refund-policy', 'shipping-policy', 'terms-of-service'].includes(view)) {
    return { view: 'policies', params: { policyTab: view.replace('-policy', '').replace('terms-of-service', 'terms') } };
  }
  if ((PAGE_VIEWS as string[]).includes(view)) {
    return {
      view: view as ViewType,
      params: compact({ ...query, subCategory: safeDecode(parts[1]) ?? query.subCategory })
    };
  }
  return { view: 'home', params: {} };
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>(() => parseLocation().view);
  const [params, setParams] = useState<NavigationParams>(() => parseLocation().params);

  // Migrate legacy hash URLs into clean HTML5 paths on load; links to pages
  // that no longer exist (e.g. /blog) resolve to home, so show "/" in the address bar
  useEffect(() => {
    if (!window.location.hash && parseLocation().view === 'home' && window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }
    if (window.location.hash) {
      const { view, params: p } = parseLocation();
      const cleanPath = buildPath(view, p);
      window.history.replaceState(null, '', cleanPath);
    }
  }, []);

  // Back/forward browser buttons and history changes
  useEffect(() => {
    const handleLocationChange = () => {
      const { view, params: next } = parseLocation();
      setCurrentView(view);
      // keep the same object when nothing changed so pages don’t reset their state
      setParams(prev => (sameParams(prev, next) ? prev : next));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (view: ViewType, newParams: NavigationParams = {}) => {
    const clean = compact(newParams);
    setCurrentView(view);
    setParams(clean);

    const path = buildPath(view, clean);
    const currentLoc = window.location.pathname + window.location.search;
    if (currentLoc !== path) {
      window.history.pushState(null, '', path);
    }

    // Smoothly scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (productId: string, color?: string) => {
    navigateTo('product', { productId, color });
  };

  const openCategory = (category: string, subCategory?: string, extra: NavigationParams = {}) => {
    navigateTo('catalog', { category, subCategory, ...extra });
  };

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        params,
        navigateTo,
        openProduct,
        openCategory
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
