import React, { useState, useMemo } from 'react';
import { ProductCategory, Currency, Product, CartItem } from './types';
import { PRODUCTS, CATEGORIES_META } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LiveOrderTicker } from './components/LiveOrderTicker';
import { ServiceFilterTabs } from './components/ServiceFilterTabs';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { SmmCustomCalculator } from './components/SmmCustomCalculator';
import { ReviewsServiceSpotlight } from './components/ReviewsServiceSpotlight';
import { SafetyGuarantees } from './components/SafetyGuarantees';
import { HowItWorks } from './components/HowItWorks';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqAccordionSection } from './components/FaqAccordionSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { LiveSupportModal } from './components/LiveSupportModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<ProductCategory>('all');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.search.includes('admin') || window.location.hash.includes('admin');
  });

  // Modals and Drawers
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [initialTrackOrderId, setInitialTrackOrderId] = useState<string>('GR-9821');
  const [isLiveSupportOpen, setIsLiveSupportOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category check
      if (currentCategory !== 'all' && item.category !== currentCategory) {
        return false;
      }
      // Region check
      if (selectedRegion !== 'all') {
        if (!item.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSub = item.subtitle.toLowerCase().includes(q);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(q);
        const matchesFeatures = item.features.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesSub && !matchesCategory && !matchesFeatures) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUsd - b.priceUsd;
      if (sortBy === 'price-desc') return b.priceUsd - a.priceUsd;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [currentCategory, selectedRegion, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, customNotes?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (customNotes) updated[existingIndex].customRequirements = customNotes;
        return updated;
      }
      return [...prev, { product, quantity, customRequirements: customNotes }];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const handleInstantBuy = (product: Product, quantity = 1, customNotes?: string) => {
    handleAddToCart(product, quantity, customNotes);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = (discount: number) => {
    setAppliedDiscountPercent(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderId: string) => {
    setCartItems([]);
    setInitialTrackOrderId(orderId);
  };

  const handleOpenOrderTrackerWithId = (orderId: string) => {
    setInitialTrackOrderId(orderId);
    setIsOrderTrackerOpen(true);
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('custom-calculator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = (cat?: ProductCategory) => {
    if (cat) setCurrentCategory(cat);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdminView) {
    return <AdminPortal onBackToStore={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-900 border border-emerald-500/50 text-white text-xs font-bold shadow-2xl shadow-emerald-950/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          scrollToCatalog(cat);
        }}
        currency={currency}
        onCurrencyChange={setCurrency}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenLiveSupport={() => setIsLiveSupportOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenAdmin={() => setIsAdminView(true)}
      />

      {/* Live Recent Deliveries Ticker */}
      <LiveOrderTicker
        currency={currency}
        onTrackOrderClick={handleOpenOrderTrackerWithId}
      />

      {/* Hero Section */}
      <Hero
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          scrollToCatalog(cat);
        }}
        onOpenCalculator={scrollToCalculator}
        onOpenLiveOrderTicker={() => setIsOrderTrackerOpen(true)}
      />

      {/* Main Catalog & Inventory Section */}
      <main id="catalog-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live Verified Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-['Outfit']">
              Digital Assets & Agency Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select an asset below for instant encrypted delivery or customize your campaign with custom drip pacing.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>All 5 Categories Available</span>
            </span>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <ServiceFilterTabs
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFilteredCount={filteredProducts.length}
        />

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keywords or switching category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentCategory('all');
                setSelectedRegion('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                currency={currency}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onInstantBuy={(p) => handleInstantBuy(p, 1)}
                onViewDetails={(p) => setSelectedProductDetails(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Interactive Custom SMM & Reviews Calculator */}
      <SmmCustomCalculator
        currency={currency}
        onAddCustomToCart={handleAddToCart}
        onInstantBuyCustom={handleInstantBuy}
      />

      {/* Dedicated Reviews Service Spotlight */}
      <ReviewsServiceSpotlight
        onExploreReviews={() => {
          setCurrentCategory('reviews-services');
          scrollToCatalog('reviews-services');
        }}
      />

      {/* Safety & Anti-Detect Guarantees */}
      <SafetyGuarantees />

      {/* How It Works */}
      <HowItWorks />

      {/* Customer Testimonials */}
      <TestimonialsSection />

      {/* FAQ Accordion */}
      <FaqAccordionSection />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          scrollToCatalog(cat);
        }}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenLiveSupport={() => setIsLiveSupportOpen(true)}
        onOpenCalculator={scrollToCalculator}
        onOpenAdmin={() => setIsAdminView(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailsModal
        product={selectedProductDetails}
        currency={currency}
        isOpen={!!selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currency={currency}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currency={currency}
        discountPercent={appliedDiscountPercent}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        initialOrderId={initialTrackOrderId}
      />

      <LiveSupportModal
        isOpen={isLiveSupportOpen}
        onClose={() => setIsLiveSupportOpen(false)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        currency={currency}
        onSelectProduct={(prod) => setSelectedProductDetails(prod)}
      />
    </div>
  );
}
