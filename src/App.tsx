import React, { useState, useEffect, FormEvent } from 'react';
import { Product, CartItem } from './types';
import { useContent } from './store/contentStore';
import AdminPortal from './components/AdminPortal';
import HeroSlider from './components/HeroSlider';
import ProductCatalog, { PRODUCT_CATEGORIES, CategoryTab, SortOption, SORT_OPTIONS } from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import FilterDropdown from './components/FilterDropdown';
import CartDrawer from './components/CartDrawer';
import FAQSection from './components/FAQSection';
import BlogSection from './components/BlogSection';
import BlogDetail from './components/BlogDetail';
import GetInTouchPage from './components/GetInTouchPage';
import VetAcademyPortal from './components/VetAcademyPortal';
import FarmersAcademyPortal from './components/FarmersAcademyPortal';
import { handleImageError } from './imageFallback';
import { 
  Phone, MapPin, Mail, Clock, Facebook, Instagram, Linkedin, 
  ChevronRight, ArrowUp, Send, CheckCircle, Award, Users, 
  HelpCircle, MessageCircle, Heart, Star, Truck, HeartHandshake, Leaf, ShieldAlert,
  ShoppingCart, Stethoscope, FlaskConical, Menu, X, ChevronDown, Search
} from 'lucide-react';

// Build a URL-friendly slug from a blog title, e.g. /blog/how-to-apply-npk
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function App() {
  const { blogs: BLOGS, products: PRODUCTS } = useContent();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [getInTouchTab, setGetInTouchTab] = useState<'inquiry' | 'support'>('inquiry');
  const [getInTouchService, setGetInTouchService] = useState<'vet' | 'soil' | 'agronomy' | 'delivery'>('vet');
  const [productSort, setProductSort] = useState<SortOption>('featured');
  const [productSearch, setProductSearch] = useState('');
  
  // Path Router State
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAcademyDropdownOpen, setIsAcademyDropdownOpen] = useState(false);
  const isAdminRoute = currentPath.startsWith('/maxim/admin');
  const isContactsRoute = currentPath === '/getintouch';
  const isAcademyRoute = currentPath === '/vets' || currentPath === '/farmers' || isAdminRoute;

  // Dedicated products page, e.g. /products or /products/animal-health
  const isProductsRoute = currentPath === '/products' || currentPath.startsWith('/products/');
  const productCategorySlug = currentPath.startsWith('/products/')
    ? decodeURIComponent(currentPath.slice('/products/'.length))
    : '';
  const activeProductCategory =
    PRODUCT_CATEGORIES.find((c) => c.slug === productCategorySlug) ?? PRODUCT_CATEGORIES[0];

  // Dedicated single-product page, e.g. /product/crop-1
  const productId = currentPath.startsWith('/product/')
    ? decodeURIComponent(currentPath.slice('/product/'.length))
    : null;
  const selectedProduct = productId
    ? (PRODUCTS.find((p) => p.id === productId) ?? null)
    : null;
  const openProduct = (p: Product) => navigate('/product/' + p.id);

  // Derive the active blog post from the URL, e.g. /blog/<slug>
  const blogSlug = currentPath.startsWith('/blog/')
    ? decodeURIComponent(currentPath.slice('/blog/'.length))
    : null;
  const selectedBlogPost = blogSlug
    ? (BLOGS.find((b) => slugify(b.title) === blogSlug) ?? null)
    : null;
  const openBlogPost = (post: { title: string }) => navigate('/blog/' + slugify(post.title));

  // Sync with browser history popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Counter states (animated when loaded)
  const [yearsCount, setYearsCount] = useState(0);
  const [farmersCount, setFarmersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [countiesCount, setCountiesCount] = useState(0);

  // Auto-counting effect on page mount
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setYearsCount(Math.min(3, Math.floor((3 / steps) * step)));
      setFarmersCount(Math.min(12500, Math.floor((12500 / steps) * step)));
      setProductsCount(Math.min(500, Math.floor((500 / steps) * step)));
      setCountiesCount(Math.min(15, Math.floor((15 / steps) * step)));

      if (step >= steps) {
        clearInterval(timer);
        setYearsCount(3);
        setFarmersCount(12500);
        setProductsCount(500);
        setCountiesCount(15);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Back to top + sticky glass header behavior
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowBackToTop(y > 400);
      setIsScrolled(y > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenBooking = (service: 'vet' | 'soil' | 'agronomy' | 'delivery') => {
    setGetInTouchTab('support');
    setGetInTouchService(service);
    navigate('/getintouch');
  };

  const openContacts = (tab: 'inquiry' | 'support' = 'inquiry') => {
    setGetInTouchTab(tab);
    navigate('/getintouch');
  };

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (selectedBlogPost || currentPath !== '/') {
      e.preventDefault();
      if (currentPath !== '/') {
        window.history.pushState(null, '', '/');
        setCurrentPath('/');
      }
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (selectedBlogPost || currentPath !== '/') {
      e.preventDefault();
      if (currentPath !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const cartTotalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white overflow-x-clip">
      
      {!isAcademyRoute && (
        <>
          {/* 1. TOP ANNOUNCEMENT BAR */}
          <div id="top-announcement-bar" className="bg-emerald-950 text-emerald-100 py-2.5 px-6 text-xs font-semibold border-b border-emerald-900">
        <div className="container mx-auto flex flex-wrap justify-center gap-x-4 gap-y-1 items-center">
          <span className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Nairobi Industrial Area, Kenya</span>
          </span>
          <span className="hidden md:inline-block text-emerald-800">|</span>
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Mon – Sat, 8:00 AM – 6:00 PM (EAT)</span>
          </span>
        </div>
      </div>

      {/* 2. STICKY BRAND NAVIGATION HEADER */}
      <header
        id="site-sticky-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-xl border-b border-emerald-900/10 shadow-lg shadow-emerald-950/5'
            : 'bg-white border-b border-emerald-900/10 shadow-sm'
        }`}
      >
        <div className={`container mx-auto px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-2.5' : 'py-4'}`}>
          
          {/* Logo Brand */}
          <a href="#" onClick={handleLogoClick} className="flex items-center space-x-3 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-white font-black font-serif text-xl shadow-md group-hover:scale-105 transition-all">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-emerald-950 tracking-tight leading-none">Maxim Vet</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 mt-1">Kenyan Farmers Trust</span>
            </div>
          </a>

          {/* Core Scroll Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <a href="#hero-slider-container" onClick={(e) => handleNavLinkClick(e, 'hero-slider-container')} className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition">
              Home
            </a>
            <a href="#about-us-section" onClick={(e) => handleNavLinkClick(e, 'about-us-section')} className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition">
              About Us
            </a>
            {/* Certified Catalog dropdown */}
            <div className="relative group py-2">
              <a
                href="/products"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products');
                }}
                className="flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
              >
                <span>Certified Catalog</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-950/70 transition-transform group-hover:rotate-180" />
              </a>
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-emerald-900/10 rounded-2xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <a
                    key={cat.key}
                    href={cat.slug ? `/products/${cat.slug}` : '/products'}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(cat.slug ? `/products/${cat.slug}` : '/products');
                    }}
                    className="block px-4 py-2.5 text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Farming Services link */}
            <a
              href="#services-highlights-section"
              onClick={(e) => handleNavLinkClick(e, 'services-highlights-section')}
              className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
            >
              Farming Services
            </a>
            <div 
              className="relative group py-2"
              onMouseEnter={() => setIsAcademyDropdownOpen(true)}
              onMouseLeave={() => setIsAcademyDropdownOpen(false)}
            >
              <button 
                id="academy-dropdown-trigger"
                onClick={() => setIsAcademyDropdownOpen(!isAcademyDropdownOpen)}
                className="flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
              >
                <span>Academy</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-950/70 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white border border-emerald-900/10 rounded-2xl shadow-xl py-2 z-50 transition-all duration-200 ${
                isAcademyDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
                <a
                  id="nav-vet-portal-link"
                  href="/vets"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAcademyDropdownOpen(false);
                    navigate('/vets');
                  }}
                  className="block px-4 py-2.5 text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  Vet Academy
                </a>
                <a
                  id="nav-farmer-portal-link"
                  href="/farmers"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAcademyDropdownOpen(false);
                    navigate('/farmers');
                  }}
                  className="block px-4 py-2.5 text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  Farmers Academy
                </a>
                <div className="my-1.5 border-t border-emerald-900/10" />
                <a
                  id="nav-academy-blog-link"
                  href="#blog-section-wrapper"
                  onClick={(e) => {
                    setIsAcademyDropdownOpen(false);
                    handleNavLinkClick(e, 'blog-section-wrapper');
                  }}
                  className="block px-4 py-2.5 text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  Academy Blog
                </a>
              </div>
            </div>
            <button 
              id="nav-get-in-touch-btn"
              onClick={() => openContacts('inquiry')} 
              className="ml-2 inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-md shadow-emerald-600/25 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              Get In Touch
            </button>
          </nav>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="header-cart-trigger"
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-900/10 flex items-center justify-center transition hover:scale-105"
              aria-label="Open Shopping Basket"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-950" />
              {cartTotalQty > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
                  {cartTotalQty}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-900/10 flex items-center justify-center transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-emerald-950" /> : <Menu className="w-4 h-4 text-emerald-950" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-emerald-900/5 bg-white shadow-inner transition-all duration-300">
            <nav className="container mx-auto px-6 py-3 flex flex-col space-y-0.5">
              {[
                { label: 'Home', href: '#hero-slider-container' },
                { label: 'About Us', href: '#about-us-section' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavLinkClick(e, link.href.slice(1));
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {link.label}
                </a>
              ))}

              {/* Certified Catalog Mobile Link */}
              <div className="border-t border-emerald-900/5 pt-1.5 mt-1.5">
                <a
                  href="/products"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    navigate('/products');
                  }}
                  className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span>Certified Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>

              {/* Farming Services Mobile Link */}
              <div className="border-t border-emerald-900/5 pt-1.5 mt-1.5">
                <a
                  href="#services-highlights-section"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavLinkClick(e, 'services-highlights-section');
                  }}
                  className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span>Farming Services</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>

              {/* Academy Mobile Submenu */}
              <div className="border-t border-emerald-900/5 pt-1.5 mt-1.5">
                <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-0.5">
                  Academy Portals
                </span>
                <a
                  href="/vets"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    navigate('/vets');
                  }}
                  className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span>Vet Academy</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
                <a
                  href="/farmers"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    navigate('/farmers');
                  }}
                  className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span>Farmers Academy</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
                <a
                  href="#blog-section-wrapper"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavLinkClick(e, 'blog-section-wrapper');
                  }}
                  className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span>Academy Blog</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>
              <div className="pt-2 mt-1.5 border-t border-emerald-900/5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openContacts('inquiry');
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-md shadow-emerald-600/25 transition cursor-pointer"
                >
                  Get In Touch
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
        </>
      )}

      {isAdminRoute ? (
        <AdminPortal onBack={() => navigate('/')} />
      ) : currentPath === '/vets' ? (
        <VetAcademyPortal onBack={() => navigate('/')} />
      ) : currentPath === '/farmers' ? (
        <FarmersAcademyPortal 
          onBack={() => navigate('/')} 
          onBuyAgrochemicals={() => {
            navigate('/');
            setTimeout(() => {
              const el = document.getElementById('products-catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
        />
      ) : selectedBlogPost ? (
        <BlogDetail 
          post={selectedBlogPost} 
          onSelectPost={(post) => openBlogPost(post)}
          onViewAll={() => navigate('/blogs')}
        />
      ) : currentPath === '/blogs' ? (
        <BlogSection
          variant="page"
          onSelectArticle={(blog) => openBlogPost(blog)}
        />
      ) : isContactsRoute ? (
        <GetInTouchPage 
          initialTab={getInTouchTab}
          initialService={getInTouchService}
          onBack={() => navigate('/')}
        />
      ) : selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onSelectProduct={openProduct}
          onNavigate={navigate}
        />
      ) : isProductsRoute ? (
        <main className="min-h-screen bg-emerald-50">
          {/* Category banner with search */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600">
            <div className="container mx-auto px-6 py-6 md:py-10 flex flex-row items-center justify-between gap-3 md:gap-6">
              <div className="min-w-0">
                <span className="text-[11px] md:text-xs font-bold tracking-widest text-emerald-100/80 uppercase">Certified Catalog</span>
                <h1 className="font-serif text-xl sm:text-2xl md:text-4xl font-medium text-white mt-1 truncate">
                  {activeProductCategory.key === 'all' ? 'All Products' : activeProductCategory.label}
                </h1>
              </div>

              <div className="relative w-1/2 max-w-sm shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                <input
                  id="banner-product-search"
                  type="text"
                  placeholder="Search agrochemicals, fertilizers..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/15 border border-white/25 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 outline-none text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Breadcrumb (left) + Category/Sort (right) — below the banner label */}
          <div className="bg-emerald-50">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-3 text-[11px] font-semibold text-emerald-800/70">
              <div className="flex items-center gap-1.5 min-w-0 overflow-hidden whitespace-nowrap">
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); navigate('/'); }}
                  className="hover:text-emerald-700 transition"
                >
                  Home
                </a>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600/50" />
                <a
                  href="/products"
                  onClick={(e) => { e.preventDefault(); navigate('/products'); }}
                  className={`hover:text-emerald-700 transition ${activeProductCategory.key === 'all' ? 'text-emerald-900' : ''}`}
                >
                  Certified Catalog
                </a>
                {activeProductCategory.key !== 'all' && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-600/50" />
                    <span className="text-emerald-900 truncate">{activeProductCategory.label}</span>
                  </>
                )}
              </div>

              {/* Category + Sort — compact custom dropdowns, matches link font */}
              <div className="flex items-center gap-3 shrink-0">
                <FilterDropdown
                  id="breadcrumb-category-select"
                  value={activeProductCategory.key}
                  align="right"
                  options={PRODUCT_CATEGORIES.map((c) => ({ value: c.key, label: c.label }))}
                  onChange={(val) => {
                    const target = PRODUCT_CATEGORIES.find((c) => c.key === val);
                    navigate(target && target.slug ? `/products/${target.slug}` : '/products');
                  }}
                />
                <span className="text-emerald-900/20">|</span>
                <FilterDropdown
                  id="breadcrumb-sort-select"
                  value={productSort}
                  align="right"
                  options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  onChange={(val) => setProductSort(val as SortOption)}
                />
              </div>
            </div>
          </div>

          <ProductCatalog
            variant="page"
            initialCategory={activeProductCategory.key}
            onAddToCart={handleAddToCart}
            onSelectProduct={openProduct}
            sortBy={productSort}
            onSortChange={setProductSort}
            searchQuery={productSearch}
            onSearchChange={setProductSearch}
            onCategoryChange={(cat: CategoryTab) => {
              const target = PRODUCT_CATEGORIES.find((c) => c.key === cat);
              navigate(target && target.slug ? `/products/${target.slug}` : '/products');
            }}
          />
        </main>
      ) : (
        <>
          {/* 3. HERO SLIDESHOW COMPONENT */}
          <HeroSlider 
        onShopClick={() => {
          const el = document.getElementById('products-catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onConsultClick={() => handleOpenBooking('vet')}
      />



      {/* 5. CATEGORIES SECTIONS */}
      <section id="categories-section" className="py-20 bg-emerald-50/40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-4">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Browse Catalog</span>
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950">
                  Explore Our Range
                </h2>
                <a
                  href="/products"
                  onClick={(e) => { e.preventDefault(); navigate('/products'); }}
                  className="md:hidden text-[11px] font-bold text-emerald-700 hover:text-emerald-600 transition flex items-center gap-1 border-b border-emerald-700 pb-1 shrink-0"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-emerald-800 text-sm">
                Invest in genuine agricultural compound lines, certified hybrid seeds, and professional high-density spray pumps.
              </p>
            </div>
            <a
              href="/products"
              onClick={(e) => { e.preventDefault(); navigate('/products'); }}
              className="hidden md:flex text-xs font-bold text-emerald-700 hover:text-emerald-600 transition items-center space-x-1 border-b border-emerald-700 pb-1 self-start shrink-0"
            >
              <span>View all inventory catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-6">
            
            {/* Box 1 (Large) */}
            <a
              href="/products/crop-health"
              onClick={(e) => { e.preventDefault(); navigate('/products/crop-health'); }}
              className="col-span-2 md:col-span-8 rounded-3xl sm:rounded-[32px] overflow-hidden relative min-h-[220px] sm:min-h-[300px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80"
                alt="Crop Health Products"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-1.5 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  Pesticides &amp; Growth Booster
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-semibold leading-tight text-white">Crop Protection &amp; Fertilisers</h3>
                <p className="text-[11px] sm:text-xs text-emerald-100/90 max-w-lg line-clamp-2 sm:line-clamp-none">
                  Acquire certified selective crop boosters, insecticides, biological fungicides, and NPK blends from Bayer, Syngenta, and Osho.
                </p>
              </div>
            </a>

            {/* Box 2 (Medium) */}
            <a
              href="/products/animal-health"
              onClick={(e) => { e.preventDefault(); navigate('/products/animal-health'); }}
              className="col-span-2 md:col-span-4 rounded-3xl sm:rounded-[32px] overflow-hidden relative min-h-[200px] sm:min-h-[300px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80"
                alt="Animal Health"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-1.5 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  Vet Pharmacy
                </span>
                <h3 className="font-serif text-base sm:text-xl font-semibold leading-tight text-white">Animal Health Medicines</h3>
                <p className="text-[11px] sm:text-xs text-emerald-100/90 line-clamp-2 sm:line-clamp-none">
                  Top-grade multivitamin supplements, ticks dip compounds, and poultry boosters.
                </p>
              </div>
            </a>

            {/* Box 3 */}
            <a
              href="/products/equipment"
              onClick={(e) => { e.preventDefault(); navigate('/products/equipment'); }}
              className="col-span-1 md:col-span-4 rounded-3xl sm:rounded-[32px] overflow-hidden relative min-h-[150px] sm:min-h-[250px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80"
                alt="Farming Equipment"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-1.5 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  Tools
                </span>
                <h3 className="font-serif text-sm sm:text-lg font-semibold leading-tight text-white">Farming Sprayers &amp; Knapsacks</h3>
              </div>
            </a>

            {/* Box 4 */}
            <a
              href="/products/seeds"
              onClick={(e) => { e.preventDefault(); navigate('/products/seeds'); }}
              className="col-span-1 md:col-span-4 rounded-3xl sm:rounded-[32px] overflow-hidden relative min-h-[150px] sm:min-h-[250px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80"
                alt="Hybrid Seeds"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-1.5 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  Planting Seeds
                </span>
                <h3 className="font-serif text-sm sm:text-lg font-semibold leading-tight text-white">Hybrid Corn &amp; Vegetable Seeds</h3>
              </div>
            </a>

            {/* Box 5 */}
            <a
              href="/products/equipment"
              onClick={(e) => { e.preventDefault(); navigate('/products/equipment'); }}
              className="col-span-2 md:col-span-4 rounded-3xl sm:rounded-[32px] overflow-hidden relative min-h-[150px] sm:min-h-[250px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1464207687583-a82f637d5c66?w=600&auto=format&fit=crop&q=80"
                alt="Soil meters"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-1.5 sm:space-y-2">
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  Lab Equipment
                </span>
                <h3 className="font-serif text-sm sm:text-lg font-semibold leading-tight text-white">Precision Testing Kits &amp; Accessories</h3>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* 7. DETAILED PRODUCT CATALOG COMPONENT */}
      <ProductCatalog
        onAddToCart={handleAddToCart}
        onSelectProduct={openProduct}
        previewLimit={20}
        onViewAll={() => navigate('/products')}
      />

      {/* 8. ABOUT US WITH VISUALS & LIVE COUNT COUNTERS */}
      <section id="about-us-section" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image side with Float card */}
            <div className="relative">
              <div className="aspect-[16/11] lg:aspect-[4/5] max-w-sm lg:max-w-none mx-auto rounded-3xl lg:rounded-[40px] overflow-hidden bg-emerald-50 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80"
                  alt="Kenyan Farming Community"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                loading="lazy"
                onError={handleImageError}
                />
              </div>
            </div>

            {/* Narrative content and live grid */}
            <div className="space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Our Story</span>
                <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950 leading-tight">
                  3 Years of Sustaining Kenya's Food Security &amp; Livestock
                </h2>
                <p className="text-emerald-800 text-xs md:text-sm leading-relaxed">
                  Established in Nairobi Industrial Area, Maxim Vet has grown to become Kenya’s premier supplier of certified agrochemicals, crop protection lines, veterinary pharmaceuticals, and durable field knapsacks. We work hand-in-hand with agricultural cooperatives, county ministries, and individual smallholders.
                </p>
                <p className="text-emerald-800 text-xs md:text-sm leading-relaxed">
                  Beyond simply supplying products, our team of fully-certified agronomists and licensed livestock veterinarians travel directly to farms to run tests, provide chemical spray advice, and diagnose clinical symptoms.
                </p>
              </div>

              {/* Grid of counter statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 border border-emerald-900/10 shadow-md text-center">
                  <span className="block font-serif text-2xl md:text-3xl font-extrabold text-white leading-none">
                    {yearsCount}+
                  </span>
                  <span className="text-[10px] md:text-xs text-white font-bold mt-2 block">Years of Farmer Trust</span>
                  <span className="text-[9px] text-emerald-100/80 font-semibold mt-0.5 block">Serving Kenya Since 2023</span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-900/5">
                  <span className="block font-serif text-2xl md:text-3xl font-extrabold text-emerald-950">
                    {farmersCount.toLocaleString()}+
                  </span>
                  <span className="text-[10px] md:text-xs text-emerald-800 font-bold mt-1 block">Active Farmers Served</span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-900/5">
                  <span className="block font-serif text-2xl md:text-3xl font-extrabold text-emerald-950">
                    {productsCount}+
                  </span>
                  <span className="text-[10px] md:text-xs text-emerald-800 font-bold mt-1 block">KEBS Certified Products</span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-900/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-serif text-2xl md:text-3xl font-extrabold text-emerald-950">
                        {countiesCount}+
                      </span>
                      <span className="text-[10px] md:text-xs text-emerald-800 font-bold mt-1 block">Counties Covered</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openContacts('inquiry')}
                  className="btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Write to Company Directors
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. ON-FARM CORE SERVICES SECTION */}
      <section id="services-highlights-section" className="py-20 bg-emerald-50/40">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Expert Services</span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950">
              Our Professional Agribusiness Services
            </h2>
            <p className="text-emerald-800 font-sans text-xs md:text-base">
              We complement our premium chemical catalogs with certified training, clinical care, and farm diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                id: 'vet',
                icon: Stethoscope,
                title: 'Veterinary Clinical Diagnostics',
                desc: 'On-farm clinical vaccination, cattle pregnancy checks, tick control reviews, and poultry treatment programs.',
                cta: 'Schedule Vet Visit',
              },
              {
                id: 'soil',
                icon: FlaskConical,
                title: 'Soil Nutrient & Lab Testing',
                desc: 'Complete laboratory analysis of nitrogen, phosphate, potassium, and pH. We supply crop-specific fertilizer plans.',
                cta: 'Book Soil Test',
              },
              {
                id: 'agronomy',
                icon: Leaf,
                title: 'Agronomy Crop Support',
                desc: 'In-depth guidance regarding selective chemical ratios, armyworm eradication timing, and optimal planting depth.',
                cta: 'Speak to Agronomist',
              },
              {
                id: 'delivery',
                icon: Truck,
                title: 'Nationwide Farm Dispatch',
                desc: 'Consolidated logistics serving cooperatives, local community agrovets, and private farming fields.',
                cta: 'Schedule Shipment',
              },
            ].map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.id}
                  className="group relative bg-white rounded-3xl p-4 sm:p-7 border border-emerald-900/10 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-600/30 transition-all duration-300"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-semibold text-emerald-950 mt-4 sm:mt-5 leading-snug relative">
                    {service.title}
                  </h3>
                  <p className="text-emerald-800/75 text-xs leading-relaxed mt-2 flex-1 relative line-clamp-4 sm:line-clamp-none">
                    {service.desc}
                  </p>

                  <button
                    id={`btn-service-${service.id}`}
                    onClick={() => handleOpenBooking(service.id as 'vet' | 'soil' | 'agronomy' | 'delivery')}
                    className="relative mt-4 sm:mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-500 transition cursor-pointer self-start"
                  >
                    <span>{service.cta}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FAQS EXPANDABLE ACCORDIONS */}
      <FAQSection onWriteToExpert={() => openContacts('inquiry')} />

      {/* 11. BLOG COMPONENT */}
      <BlogSection onSelectArticle={(blog) => openBlogPost(blog)} onViewAll={() => navigate('/blogs')} />

      {/* 13. BRANDS & PARTNERS MARQUEE */}
      <section id="partners-marquee-section" className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
            Authorized Distributor &amp; Manufacturer
          </span>
          
          {/* Infinite scrolling marquee with premium side gradient masks */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-10 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-10 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee gap-8 md:gap-16 items-center">
              {(() => {
                const brands = [
                  { name: 'Amiran Kenya', bg: 'bg-emerald-50 text-emerald-900', icon: '' },
                  { name: 'Bayer East Africa', bg: 'bg-teal-50 text-teal-900', icon: 'https://icons.duckduckgo.com/ip3/bayer.com.ico' },
                  { name: 'Syngenta', bg: 'bg-emerald-50 text-emerald-900', icon: 'https://icons.duckduckgo.com/ip3/syngenta.com.ico' },
                  { name: 'Osho Chemical', bg: 'bg-sky-50 text-sky-900', icon: 'https://icons.duckduckgo.com/ip3/oshochem.com.ico' },
                  { name: 'Twiga Chemicals', bg: 'bg-teal-50 text-teal-900', icon: 'https://icons.duckduckgo.com/ip3/twigachemicals.com.ico' },
                  { name: 'Elgon Kenya', bg: 'bg-emerald-50 text-emerald-900', icon: 'https://icons.duckduckgo.com/ip3/elgonkenya.co.ke.ico' },
                ];
                return [...brands, ...brands].map((brand, idx) => (
                  <div key={idx} className={`flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3.5 rounded-2xl text-[10px] md:text-xs font-extrabold tracking-wider uppercase border border-emerald-950/5 shrink-0 select-none mr-5 md:mr-8 ${brand.bg}`}>
                    <span className="relative w-5 h-5 md:w-6 md:h-6 shrink-0 flex items-center justify-center rounded-md bg-black/5 overflow-hidden text-[10px] font-black">
                      <span className="opacity-70">{brand.name.charAt(0)}</span>
                      {brand.icon && (
                        <img
                          src={brand.icon}
                          alt={`${brand.name} logo`}
                          className="absolute inset-0 w-full h-full object-contain bg-white"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </span>
                    <span>{brand.name}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>


        </>
      )}

      {/* 15. BRANDED FOOTER */}
      {!isAcademyRoute && (
        <footer id="main-site-footer" className="mt-auto bg-emerald-950 text-emerald-100/80 pt-16 pb-8 border-t border-emerald-900 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-900/30 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-12">
              
              {/* Branding Column */}
              <div className="col-span-2 md:col-span-4 space-y-6">
                <a href="#" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black font-serif text-lg shadow-md">
                    M
                  </div>
                  <span className="font-serif text-xl font-bold text-white tracking-tight leading-none">Maxim Vet</span>
                </a>
                <p className="text-xs md:text-sm leading-relaxed text-emerald-100/70 max-w-sm">
                  Kenya’s highly trusted supplier of KEBS and PCPB certified agricultural inputs, veterinary medications, biological crop boosters, and farm knapsacks. Empowering smallholders since 2023.
                </p>
                <div className="flex space-x-3 pt-2">
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition border border-white/5" aria-label="Facebook">
                    <Facebook className="w-4 h-4 text-emerald-300" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition border border-white/5" aria-label="Instagram">
                    <Instagram className="w-4 h-4 text-emerald-300" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition border border-white/5" aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4 text-emerald-300" />
                  </a>
                </div>
              </div>

              {/* Newsletter sign-up */}
              <div id="newsletter-signup-block" className="col-span-2 md:col-span-4 space-y-4 text-left">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300 border-b border-emerald-900 pb-2 sm:border-0 sm:pb-0">Newsletter</h5>
                <h3 className="font-serif text-xl md:text-2xl font-medium leading-tight text-white">
                  Stay Updated with Agricultural Cycles
                </h3>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Receive certified planting advisories, pest outbreak forecasts, and early-bird discount codes directly on your email. No spam, ever.
                </p>
                {!newsletterSubscribed ? (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 pt-1">
                    <input
                      id="newsletter-email-input"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm text-white placeholder-white/40 focus:bg-white/20 focus:border-emerald-400 outline-none transition"
                    />
                    <button
                      id="newsletter-submit-btn"
                      type="submit"
                      className="px-8 py-3.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-full shadow-md transition duration-200"
                    >
                      Subscribe Now
                    </button>
                  </form>
                ) : (
                  <div className="p-5 bg-white/10 border border-emerald-500/30 rounded-3xl text-left space-y-2 flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-emerald-300">Asante! Subscription Confirmed</h5>
                      <p className="text-xs text-emerald-100/90 leading-relaxed">
                        You are successfully registered. We will send you certified agrochemical guides before the next rain cycle.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact details */}
              <div className="col-span-2 md:col-span-4 space-y-4 text-left text-xs">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300 border-b border-emerald-900 pb-2 sm:border-0 sm:pb-0">Nairobi Headquarters</h5>
                <div className="space-y-3 text-emerald-200/80">
                  <p className="leading-relaxed">
                    Industrial Area Main Block, Commercial Street, Nairobi, Kenya.
                  </p>
                  <p className="leading-relaxed">
                    <span className="block font-medium text-emerald-300">Phone:</span>
                    +254 712 345 678
                  </p>
                  <p className="leading-relaxed">
                    <span className="block font-medium text-emerald-300">Office:</span>
                    info@maximvet.co.ke
                  </p>
                </div>
              </div>

            </div>

            <div className="border-t border-emerald-900/60 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-emerald-300/60 text-center sm:text-left">
              <span>© 2026 Maxim Vet Ltd. All rights reserved. Registered Agribusiness Kenya.</span>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-emerald-200/40">
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">Terms of Service</a>
                <a href="#" className="hover:text-white transition">PCPB Licenses</a>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* 16. DETAILED MODULAR POPUPS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />



      {/* 17. FLOATING QUICK CHAT WHATSAPP BUTTON */}
      <a
        id="floating-chat-trigger"
        href="https://wa.me/254700000000?text=Hello%20Maxim%20Vet%20I%20have%20an%20agrochemical%20or%20veterinary%2520inquiry"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer animate-pulse"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* 18. BACK TO TOP PILL */}
      {showBackToTop && (
        <button
          id="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-7 z-40 bg-emerald-950/70 hover:bg-emerald-950 text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shadow-lg hover:scale-105 transition-all"
          title="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
