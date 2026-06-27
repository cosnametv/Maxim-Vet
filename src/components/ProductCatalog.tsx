import { useState, useMemo, MouseEvent, useEffect } from 'react';
import { Product } from '../types';
import { useContent } from '../store/contentStore';
import { Plus, Check, ChevronRight } from 'lucide-react';
import { handleImageError } from '../imageFallback';

export type CategoryTab = 'all' | 'crop-health' | 'animal-health' | 'equipment' | 'seeds';

// Single source of truth for the catalog categories (nav, routing, tabs).
export const PRODUCT_CATEGORIES: { key: CategoryTab; slug: string; label: string }[] = [
  { key: 'all', slug: '', label: 'All Products' },
  { key: 'crop-health', slug: 'crop-health', label: 'Crop Health' },
  { key: 'animal-health', slug: 'animal-health', label: 'Animal Health' },
  { key: 'seeds', slug: 'seeds', label: 'Seeds & Grains' },
  { key: 'equipment', slug: 'equipment', label: 'Farm Equipment' },
];

export type SortOption = 'featured' | 'latest' | 'price-asc' | 'price-desc' | 'rating';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'latest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

interface ProductCatalogProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  variant?: 'home' | 'page';
  initialCategory?: CategoryTab;
  onCategoryChange?: (cat: CategoryTab) => void;
  // When provided, sorting/search are controlled by the parent (e.g. rendered in the breadcrumb/banner).
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  // Home preview: number of latest products to show + "View all" handler.
  previewLimit?: number;
  onViewAll?: () => void;
}

export default function ProductCatalog({
  onAddToCart,
  onSelectProduct,
  variant = 'home',
  initialCategory = 'all',
  sortBy: controlledSortBy,
  searchQuery: controlledSearch,
  previewLimit = 20,
  onViewAll,
}: ProductCatalogProps) {
  const { products: PRODUCTS } = useContent();
  const isPage = variant === 'page';
  const [activeTab, setActiveTab] = useState<CategoryTab>(initialCategory);

  // Keep the tab in sync when the category changes via the URL (page variant).
  useEffect(() => {
    setActiveTab(initialCategory);
  }, [initialCategory]);

  // Sort/search are driven by the parent (breadcrumb + banner on the page; unused on home).
  const searchQuery = controlledSearch ?? '';
  const sortBy = controlledSortBy ?? 'featured';
  const [addedItemNotificationId, setAddedItemNotificationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate loading on filters/search changes to show off the skeleton loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery, sortBy]);

  const filteredProducts = useMemo(() => {
    const matched = PRODUCTS.filter((product) => {
      const matchesTab = activeTab === 'all' || product.category === activeTab;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });

    switch (sortBy) {
      case 'price-asc':
        return [...matched].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...matched].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...matched].sort((a, b) => b.rating - a.rating);
      case 'latest':
        // No timestamps available; treat later catalog entries as newest.
        return [...matched].reverse();
      default:
        return matched;
    }
  }, [activeTab, searchQuery, sortBy, PRODUCTS]);

  // On the landing page show only the latest products as a preview.
  const displayedProducts = isPage
    ? filteredProducts
    : [...filteredProducts].reverse().slice(0, previewLimit);

  const handleQuickAdd = (product: Product, e: MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    
    setAddedItemNotificationId(product.id);
    setTimeout(() => {
      setAddedItemNotificationId(null);
    }, 1500);
  };

  return (
    <section id="products-catalog-section" className={isPage ? 'py-8 bg-emerald-50' : 'py-20 bg-emerald-50'}>
      <div className="container mx-auto px-6">
        {/* Header Block (home only — the page variant shows a breadcrumb banner instead) */}
        {!isPage && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-4">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Certified Catalog</span>
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950">
                  High-Yield Farming Products
                </h2>
                <button
                  onClick={onViewAll}
                  className="md:hidden text-[11px] font-bold text-emerald-700 hover:text-emerald-600 transition flex items-center gap-1 border-b border-emerald-700 pb-1 shrink-0 cursor-pointer"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-emerald-800 font-sans text-sm md:text-base">
                Browse our wide range of KEBS & PCPB fully-certified fertilizers, premium seeds, veterinary medicines, and modern farm tools available for delivery.
              </p>
            </div>
            <button
              onClick={onViewAll}
              className="hidden md:flex text-xs font-bold text-emerald-700 hover:text-emerald-600 transition items-center space-x-1 border-b border-emerald-700 pb-1 self-start shrink-0 cursor-pointer"
            >
              <span>View all products</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                id={`catalog-skeleton-${index}`}
                key={`catalog-skeleton-${index}`}
                className="bg-white rounded-3xl border border-emerald-900/10 overflow-hidden flex flex-col h-full animate-pulse shadow-sm"
              >
                {/* Image Skeleton */}
                <div className="relative aspect-[4/3] w-full bg-emerald-100/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/20 animate-ping" />
                </div>

                {/* Body Content Skeleton */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Category Tag */}
                    <div className="h-3 w-16 bg-emerald-100/40 rounded-full" />
                    {/* Title */}
                    <div className="h-5 w-4/5 bg-emerald-200/20 rounded" />
                    {/* Description lines */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-3 w-full bg-emerald-50/70 rounded" />
                      <div className="h-3 w-5/6 bg-emerald-50/70 rounded" />
                    </div>
                  </div>

                  {/* Rating, Price & CTA Section */}
                  <div className="pt-2 border-t border-emerald-50 space-y-3">
                    <div className="flex items-center justify-between">
                      {/* Rating */}
                      <div className="h-3 w-10 bg-emerald-100/30 rounded" />
                      {/* Price */}
                      <div className="h-4.5 w-16 bg-emerald-200/20 rounded" />
                    </div>
                    {/* Button */}
                    <div className="h-9 w-full bg-emerald-100/40 rounded-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-emerald-900/5 shadow-inner">
            <p className="text-emerald-800 text-lg font-medium">No certified products match your criteria.</p>
            <p className="text-emerald-600/70 text-sm mt-1">Please try clearing your search query or choosing another tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {displayedProducts.map((product) => (
              <article
                id={`product-card-${product.id}`}
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group bg-white rounded-3xl border border-emerald-900/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  
                  {/* Decorative Gradient overlays */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Badges */}
                  {product.tag && (
                    <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-sm z-10">
                      {product.tag}
                    </span>
                  )}

                  {product.stockStatus === 'Low Stock' && (
                    <span className="absolute top-4 right-4 text-[9px] font-bold tracking-wider uppercase bg-yellow-500 text-slate-950 px-2.5 py-1 rounded-full shadow-sm z-10">
                      Limited Stock
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4 md:p-6 flex flex-col flex-1 justify-between gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                      {product.category.replace('-', ' ')}
                    </span>
                    <h3 className="font-serif text-base md:text-lg font-medium text-emerald-950 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-emerald-800/80 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating, Price & CTA */}
                  <div className="pt-2 border-t border-emerald-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3 md:mb-4">
                      <div>
                        <span className="text-emerald-500 text-xs font-semibold mr-1">★</span>
                        <span className="text-xs font-bold text-emerald-950">{product.rating}</span>
                        <span className="text-[10px] text-emerald-600/60 ml-1">({product.reviewsCount})</span>
                      </div>
                      <span className="font-sans text-base font-bold text-emerald-900">
                        KSh {product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      id={`btn-add-cart-${product.id}`}
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                        addedItemNotificationId === product.id
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-emerald-100 hover:bg-emerald-600 text-emerald-900 hover:text-white'
                      }`}
                    >
                      {addedItemNotificationId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
