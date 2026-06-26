import React, { useState, useEffect, FormEvent } from 'react';
import { Product, CartItem, BlogPost } from './types';
import HeroSlider from './components/HeroSlider';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer from './components/CartDrawer';
import FAQSection from './components/FAQSection';
import BlogSection from './components/BlogSection';
import BlogDetail from './components/BlogDetail';
import GetInTouchPage from './components/GetInTouchPage';
import VetAcademyPortal from './components/VetAcademyPortal';
import FarmersAcademyPortal from './components/FarmersAcademyPortal';
import { 
  Phone, MapPin, Mail, Clock, Facebook, Instagram, Linkedin, 
  ChevronRight, ArrowUp, Send, CheckCircle, Award, Users, 
  HelpCircle, MessageCircle, Heart, Star, Truck, HeartHandshake, Leaf, ShieldAlert,
  ShoppingCart, Stethoscope, FlaskConical, Menu, X, ChevronDown
} from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isGetInTouchActive, setIsGetInTouchActive] = useState(false);
  const [getInTouchTab, setGetInTouchTab] = useState<'inquiry' | 'support'>('inquiry');
  const [getInTouchService, setGetInTouchService] = useState<'vet' | 'soil' | 'agronomy' | 'delivery'>('vet');
  
  // Path Router State
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAcademyDropdownOpen, setIsAcademyDropdownOpen] = useState(false);
  const isAcademyRoute = currentPath === '/vets' || currentPath === '/farmers';

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
      setYearsCount(Math.min(30, Math.floor((30 / steps) * step)));
      setFarmersCount(Math.min(12500, Math.floor((12500 / steps) * step)));
      setProductsCount(Math.min(500, Math.floor((500 / steps) * step)));
      setCountiesCount(Math.min(15, Math.floor((15 / steps) * step)));

      if (step >= steps) {
        clearInterval(timer);
        setYearsCount(30);
        setFarmersCount(12500);
        setProductsCount(500);
        setCountiesCount(15);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Back to top behavior
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
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
    setIsGetInTouchActive(true);
    setSelectedBlogPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (selectedBlogPost || isGetInTouchActive) {
      e.preventDefault();
      setSelectedBlogPost(null);
      setIsGetInTouchActive(false);
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
    if (selectedBlogPost || isGetInTouchActive) {
      e.preventDefault();
      setSelectedBlogPost(null);
      setIsGetInTouchActive(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cartTotalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      
      {!isAcademyRoute && (
        <>
          {/* 1. TOP ANNOUNCEMENT BAR */}
          <div id="top-announcement-bar" className="bg-emerald-950 text-emerald-100 py-2.5 px-6 text-xs font-semibold border-b border-emerald-900">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center">
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
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <a href="#" className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition" aria-label="Facebook">
                <Facebook className="w-3 h-3 text-emerald-300" />
              </a>
              <a href="#" className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition" aria-label="Instagram">
                <Instagram className="w-3 h-3 text-emerald-300" />
              </a>
              <a href="#" className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition" aria-label="LinkedIn">
                <Linkedin className="w-3 h-3 text-emerald-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY BRAND NAVIGATION HEADER */}
      <header id="site-sticky-header" className="sticky top-0 z-40 bg-white border-b border-emerald-900/10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
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
            <a href="#about-us-section" onClick={(e) => handleNavLinkClick(e, 'about-us-section')} className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition">
              About Us
            </a>
            <a href="#products-catalog-section" onClick={(e) => handleNavLinkClick(e, 'products-catalog-section')} className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition">
              Certified Catalog
            </a>
            <a href="#hero-slider-container" onClick={(e) => handleNavLinkClick(e, 'hero-slider-container')} className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition">
              Home
            </a>
            <a href="#services-highlights-section" onClick={(e) => handleNavLinkClick(e, 'services-highlights-section')} className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition">
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
              </div>
            </div>
            <a href="#blog-section-wrapper" onClick={(e) => handleNavLinkClick(e, 'blog-section-wrapper')} className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition">
              Academy Blog
            </a>
            <button 
              onClick={() => {
                setIsGetInTouchActive(true);
                setGetInTouchTab('inquiry');
                setSelectedBlogPost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="px-4 py-2 rounded-full text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
            >
              Get In Touch
            </button>
          </nav>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="header-booking-btn"
              onClick={() => {
                setIsGetInTouchActive(true);
                setGetInTouchTab('support');
                setSelectedBlogPost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold border border-emerald-900/15 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition cursor-pointer"
            >
              Support Desk
            </button>
            
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
            <nav className="container mx-auto px-6 py-4 flex flex-col space-y-2">
              {[
                { label: 'About Us', href: '#about-us-section' },
                { label: 'Certified Catalog', href: '#products-catalog-section' },
                { label: 'Home', href: '#hero-slider-container' },
                { label: 'Farming Services', href: '#services-highlights-section' },
                { label: 'Academy Blog', href: '#blog-section-wrapper' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavLinkClick(e, link.href.slice(1));
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {link.label}
                </a>
              ))}

              {/* Academy Mobile Submenu */}
              <div className="border-t border-emerald-900/5 pt-2 mt-2">
                <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                  Academy Portals
                </span>
                <a
                  href="/vets"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    navigate('/vets');
                  }}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
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
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span>Farmers Academy</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsGetInTouchActive(true);
                  setGetInTouchTab('inquiry');
                  setSelectedBlogPost(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-left text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
              >
                Get In Touch
              </button>
              <div className="pt-2 border-t border-emerald-900/5">
                <button
                  id="mobile-menu-booking-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsGetInTouchActive(true);
                    setGetInTouchTab('support');
                    setSelectedBlogPost(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-center px-4 py-3 rounded-xl text-xs font-bold border border-emerald-900/15 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition cursor-pointer"
                >
                  Support Desk
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
        </>
      )}

      {currentPath === '/vets' ? (
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
          onBack={() => {
            setSelectedBlogPost(null);
            setTimeout(() => {
              const el = document.getElementById('blog-section-wrapper');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }} 
          onSelectPost={(post) => setSelectedBlogPost(post)}
        />
      ) : isGetInTouchActive ? (
        <GetInTouchPage 
          initialTab={getInTouchTab}
          initialService={getInTouchService}
          onBack={() => {
            setIsGetInTouchActive(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Browse Catalog</span>
              <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950">
                Explore Our Range
              </h2>
              <p className="text-emerald-800 text-sm">
                Invest in genuine agricultural compound lines, certified hybrid seeds, and professional high-density spray pumps.
              </p>
            </div>
            <a
              href="#products-catalog-section"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-600 transition flex items-center space-x-1 border-b border-emerald-700 pb-1 self-start shrink-0"
            >
              <span>View all inventory catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Box 1 (Large) */}
            <a
              href="#products-catalog-section"
              className="md:col-span-8 rounded-[32px] overflow-hidden relative min-h-[300px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80"
                alt="Crop Health Products"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  Pesticides &amp; Growth Booster
                </span>
                <h3 className="font-serif text-2xl font-semibold leading-tight text-white">Crop Protection &amp; Fertilisers</h3>
                <p className="text-xs text-emerald-100/90 max-w-lg">
                  Acquire certified selective crop boosters, insecticides, biological fungicides, and NPK blends from Bayer, Syngenta, and Osho.
                </p>
              </div>
            </a>

            {/* Box 2 (Medium) */}
            <a
              href="#products-catalog-section"
              className="md:col-span-4 rounded-[32px] overflow-hidden relative min-h-[300px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80"
                alt="Animal Health"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  Vet Pharmacy
                </span>
                <h3 className="font-serif text-xl font-semibold leading-tight text-white">Animal Health Medicines</h3>
                <p className="text-xs text-emerald-100/90">
                  Top-grade multivitamin supplements, ticks dip compounds, and poultry boosters.
                </p>
              </div>
            </a>

            {/* Box 3 */}
            <a
              href="#products-catalog-section"
              className="md:col-span-4 rounded-[32px] overflow-hidden relative min-h-[250px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80"
                alt="Farming Equipment"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  Tools
                </span>
                <h3 className="font-serif text-lg font-semibold text-white">Farming Sprayers &amp; Knapsacks</h3>
              </div>
            </a>

            {/* Box 4 */}
            <a
              href="#products-catalog-section"
              className="md:col-span-4 rounded-[32px] overflow-hidden relative min-h-[250px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80"
                alt="Hybrid Seeds"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  Planting Seeds
                </span>
                <h3 className="font-serif text-lg font-semibold text-white">Hybrid Corn &amp; Vegetable Seeds</h3>
              </div>
            </a>

            {/* Box 5 */}
            <a
              href="#products-catalog-section"
              className="md:col-span-4 rounded-[32px] overflow-hidden relative min-h-[250px] border border-emerald-900/10 shadow-sm group hover:shadow-lg transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1464207687583-a82f637d5c66?w=600&auto=format&fit=crop&q=80"
                alt="Soil meters"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  Lab Equipment
                </span>
                <h3 className="font-serif text-lg font-semibold text-white">Precision Testing Kits &amp; Accessories</h3>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* 6. SEASONAL CAMPAIGN/PROMO BLOCK */}
      <section id="promo-banner-blocks" className="py-20 md:py-28 bg-emerald-950 text-white relative overflow-hidden border-y border-emerald-500/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-600/25 to-transparent pointer-events-none rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none rounded-full" />

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-6 max-w-xl text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-emerald-300 px-3 py-1.5 rounded-full inline-block">
              Seasonal Planting Offer
            </span>
            <h3 className="font-serif text-3xl md:text-5xl font-medium leading-tight">
              Get up to 20% Off on Selective Planting Fertilizers
            </h3>
            <p className="text-emerald-100/85 text-xs md:text-sm leading-relaxed">
              Ensure a heavy harvest this seasonal cycle. We offer price cuts on genuine NPK, DAP, and certified biological soil fungicides with free delivery on bulk orders of more than 15 bags.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#products-catalog-section"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-md transition transform hover:-translate-y-0.5"
              >
                Shop Seasonal Fertilizer
              </a>
              <button
                id="promo-speak-btn"
                onClick={() => handleOpenBooking('agronomy')}
                className="px-6 py-3.5 border border-white/20 hover:border-white/45 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-full transition"
              >
                Consult Agronomist
              </button>
            </div>
          </div>

          <div className="relative shrink-0 w-full md:w-80 h-64 bg-emerald-900/60 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-8">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Limited Deal</span>
              <span className="bg-yellow-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                KSh 350 Flat Delivery
              </span>
            </div>
            <div className="space-y-2">
              <p className="font-serif text-2xl font-semibold leading-tight text-white">Maize &amp; Poultry Packs</p>
              <p className="text-[11px] text-emerald-200/95 leading-relaxed">
                Carefully compiled packs containing high-altitude hybrid seeds paired with crop-specific fungicides.
              </p>
            </div>
            <div className="text-xs text-yellow-400 font-bold">
              ★ 4.9 Rating from 450+ Cooperatives
            </div>
          </div>
        </div>
      </section>

      {/* 7. DETAILED PRODUCT CATALOG COMPONENT */}
      <ProductCatalog onAddToCart={handleAddToCart} />

      {/* 8. ABOUT US WITH VISUALS & LIVE COUNT COUNTERS */}
      <section id="about-us-section" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image side with Float card */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden bg-emerald-50 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1550150896-44c33c37227d?w=800&auto=format&fit=crop&q=80"
                  alt="Kenyan Farming Community"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating counter card */}
              <div className="absolute -bottom-8 -right-4 bg-white p-6 rounded-3xl shadow-2xl border border-emerald-900/5 text-center min-w-[200px] animate-bounce">
                <span className="block font-serif text-4xl font-extrabold text-emerald-700 leading-none">
                  {yearsCount}+
                </span>
                <span className="text-xs font-bold text-slate-900 mt-2 block">Years of Farmer Trust</span>
                <span className="text-[10px] text-emerald-600/70 font-semibold mt-0.5 block">Serving Kenya Since 1996</span>
              </div>
            </div>

            {/* Narrative content and live grid */}
            <div className="space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Our Story</span>
                <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950 leading-tight">
                  30 Years of Sustaining Kenya's Food Security &amp; Livestock
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

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-900/5 col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-serif text-2xl md:text-3xl font-extrabold text-emerald-950">
                        {countiesCount}+ Counties
                      </span>
                      <span className="text-[10px] md:text-xs text-emerald-800 font-bold mt-1 block">Nationwide Distribution Network</span>
                    </div>
                    <span className="text-2xl">🇰🇪</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsGetInTouchActive(true);
                    setGetInTouchTab('inquiry');
                    setSelectedBlogPost(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Service 1 */}
            <article className="bg-white rounded-3xl p-8 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-emerald-950">Veterinary Clinical Diagnostics</h3>
                <p className="text-emerald-800/80 text-xs leading-relaxed">
                  On-farm clinical vaccination, cattle pregnancy checks, tick control reviews, and poultry treatment programs.
                </p>
              </div>
              <button
                id="btn-service-vet"
                onClick={() => handleOpenBooking('vet')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 text-left transition"
              >
                Schedule Vet visit →
              </button>
            </article>

            {/* Service 2 */}
            <article className="bg-emerald-950 text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-white">Soil Nutrient &amp; Lab Testing</h3>
                <p className="text-emerald-100/80 text-xs leading-relaxed">
                  Complete laboratory analysis of nitrogen, phosphate, potassium, and pH. We supply crop-specific fertilizer plans.
                </p>
              </div>
              <button
                id="btn-service-soil"
                onClick={() => handleOpenBooking('soil')}
                className="text-xs font-bold text-emerald-300 hover:text-emerald-400 text-left transition"
              >
                Book soil test →
              </button>
            </article>

            {/* Service 3 */}
            <article className="bg-white rounded-3xl p-8 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-emerald-950">Agronomy Crop Support</h3>
                <p className="text-emerald-800/80 text-xs leading-relaxed">
                  In-depth guidance regarding selective chemical ratios, armyworm eradication timing, and optimal planting depth.
                </p>
              </div>
              <button
                id="btn-service-agronomy"
                onClick={() => handleOpenBooking('agronomy')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 text-left transition"
              >
                Speak to agronomist →
              </button>
            </article>

            {/* Service 4 */}
            <article className="bg-white rounded-3xl p-8 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-emerald-950">Nationwide Farm Dispatch</h3>
                <p className="text-emerald-800/80 text-xs leading-relaxed">
                  Consolidated logistics serving cooperatives, local community agrovets, and private farming fields.
                </p>
              </div>
              <button
                id="btn-service-delivery"
                onClick={() => handleOpenBooking('delivery')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 text-left transition"
              >
                Schedule shipment →
              </button>
            </article>

          </div>
        </div>
      </section>

      {/* 10. FAQS EXPANDABLE ACCORDIONS */}
      <FAQSection onWriteToExpert={() => {
        setIsGetInTouchActive(true);
        setGetInTouchTab('inquiry');
        setSelectedBlogPost(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* 11. BLOG COMPONENT */}
      <BlogSection onSelectArticle={(blog) => { setSelectedBlogPost(blog); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* 12. BRANDS & PARTNERS MARQUEE */}
      <section id="partners-marquee-section" className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
            Authorized Distributor &amp; Manufacturer
          </span>
          
          {/* Infinite scrolling marquee with premium side gradient masks */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee gap-8 md:gap-16 items-center">
              {[
                { name: 'Amiran Kenya', bg: 'bg-emerald-50 text-emerald-900' },
                { name: 'Bayer East Africa', bg: 'bg-teal-50 text-teal-900' },
                { name: 'Syngenta', bg: 'bg-emerald-50 text-emerald-900' },
                { name: 'Osho Chemical', bg: 'bg-sky-50 text-sky-900' },
                { name: 'Twiga Chemicals', bg: 'bg-teal-50 text-teal-900' },
                { name: 'Elgon Kenya', bg: 'bg-emerald-50 text-emerald-900' }
              ].concat([
                { name: 'Amiran Kenya', bg: 'bg-emerald-50 text-emerald-900' },
                { name: 'Bayer East Africa', bg: 'bg-teal-50 text-teal-900' },
                { name: 'Syngenta', bg: 'bg-emerald-50 text-emerald-900' },
                { name: 'Osho Chemical', bg: 'bg-sky-50 text-sky-900' },
                { name: 'Twiga Chemicals', bg: 'bg-teal-50 text-teal-900' },
                { name: 'Elgon Kenya', bg: 'bg-emerald-50 text-emerald-900' }
              ]).map((brand, idx) => (
                <div key={idx} className={`px-8 py-4 rounded-2xl text-xs font-extrabold tracking-wider uppercase border border-emerald-950/5 shrink-0 select-none mr-8 ${brand.bg}`}>
                  {brand.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 13. INTERACTIVE NEWSLETTER CARD */}
      <section id="newsletter-signup-block" className="py-8 bg-emerald-50">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-[40px] p-8 md:p-16 relative overflow-hidden text-white flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/5 shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none rounded-full" />
            
            <div className="space-y-4 max-w-xl text-left relative z-10">
              <h3 className="font-serif text-2xl md:text-4xl font-medium leading-tight">
                Stay Updated with Agricultural Cycles
              </h3>
              <p className="text-emerald-100/80 text-xs md:text-sm">
                Receive certified planting advisories, pest outbreak forecasts, and early-bird discount codes directly on your phone/email. No spam, ever.
              </p>
            </div>

            <div className="w-full lg:max-w-md relative z-10">
              {!newsletterSubscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm text-white placeholder-white/40 focus:bg-white/20 focus:border-emerald-400 outline-none transition"
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-full shadow-md transition duration-200 shrink-0"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-12">
              
              {/* Branding Column */}
              <div className="sm:col-span-2 md:col-span-4 space-y-6">
                <a href="#" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black font-serif text-lg shadow-md">
                    M
                  </div>
                  <span className="font-serif text-xl font-bold text-white tracking-tight leading-none">Maxim Vet</span>
                </a>
                <p className="text-xs md:text-sm leading-relaxed text-emerald-100/70 max-w-sm">
                  Kenya’s highly trusted supplier of KEBS and PCPB certified agricultural inputs, veterinary medications, biological crop boosters, and farm knapsacks. Empowering smallholders since 1996.
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

              {/* Links Column 1 */}
              <div className="sm:col-span-1 md:col-span-3 space-y-4 text-left">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300 border-b border-emerald-900 pb-2 sm:border-0 sm:pb-0">Catalog Ranges</h5>
                <ul className="space-y-2.5 text-xs text-emerald-200/80">
                  <li><a href="#products-catalog-section" className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition">Crop Protection</a></li>
                  <li><a href="#products-catalog-section" className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition">Biological Fungicides</a></li>
                  <li><a href="#products-catalog-section" className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition">Dairy Cow Boosters</a></li>
                  <li><a href="#products-catalog-section" className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition">Field Spray Pumps</a></li>
                  <li><a href="#products-catalog-section" className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition">High-Yield Seeds</a></li>
                </ul>
              </div>

              {/* Links Column 2 */}
              <div className="sm:col-span-1 md:col-span-3 space-y-4 text-left">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300 border-b border-emerald-900 pb-2 sm:border-0 sm:pb-0">Farming Services</h5>
                <ul className="space-y-2.5 text-xs text-emerald-200/80">
                  <li><button id="f-link-vet" onClick={() => handleOpenBooking('vet')} className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition text-left cursor-pointer">Veterinary Booking</button></li>
                  <li><button id="f-link-soil" onClick={() => handleOpenBooking('soil')} className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition text-left cursor-pointer">Soil Lab Sampling</button></li>
                  <li><button id="f-link-agronomy" onClick={() => handleOpenBooking('agronomy')} className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition text-left cursor-pointer">Agronomy Guidance</button></li>
                  <li><button id="f-link-delivery" onClick={() => handleOpenBooking('delivery')} className="hover:text-white hover:underline decoration-emerald-500 underline-offset-4 transition text-left cursor-pointer">Cooperative Dispatch</button></li>
                </ul>
              </div>

              {/* Contact details */}
              <div className="sm:col-span-2 md:col-span-2 space-y-4 text-left text-xs">
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
