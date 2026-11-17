import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { CartProvider } from './context/CartContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { CustomCursor } from './components/CustomCursor';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FederalCarePage } from './pages/FederalCarePage';
import { FaqPage } from './pages/FaqPage';
import { OurStoresPage } from './pages/OurStoresPage';
import { PolicyPage } from './pages/PolicyPage';

const AppContent: React.FC = () => {
  const { currentView, params } = useNavigation();

  // Lenis smooth scrolling initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const isHeroPage = [
    'home',
    'about',
    'federal-care',
    'faq',
    'stores',
    'policies'
  ].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#121316] font-sans selection:bg-[#C5A880]/30 selection:text-[#121316] relative">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Primary Navigation Bar (Sticky/Fixed across whole website) */}
      <Header />

      {/* Main Content View */}
      <main className={`flex-1 ${isHeroPage ? '' : 'pt-20'}`}>
        {currentView === 'home' && <HomePage />}
        {currentView === 'catalog' && <CategoryPage key={JSON.stringify(params)} />}
        {currentView === 'product' && <ProductDetailPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'federal-care' && <FederalCarePage />}
        {currentView === 'faq' && <FaqPage />}
        {currentView === 'stores' && <OurStoresPage />}
        {currentView === 'policies' && <PolicyPage />}
      </main>

      {/* Persistent WhatsApp Cart Drawer */}
      <CartDrawer />

      {/* WhatsApp Order Intake & Aggregation Slip Modal */}
      <WhatsAppOrderModal />

      {/* Gaba Optical Style Floating WhatsApp Consultation Button */}
      <FloatingWhatsApp />

      {/* Comprehensive Footer mirroring Gaba Optical */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <NavigationProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </NavigationProvider>
  );
}

export default App;
