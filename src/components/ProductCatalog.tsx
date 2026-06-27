import { useState, useMemo, MouseEvent, useEffect } from 'react';
import { Product } from '../types';
import { useContent } from '../store/contentStore';
import { Search, Info, Star, Plus, Check, HelpCircle, X, Leaf, ShieldAlert } from 'lucide-react';
import { handleImageError } from '../imageFallback';

interface ProductCatalogProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

type CategoryTab = 'all' | 'crop-health' | 'animal-health' | 'equipment' | 'seeds';

export default function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const { products: PRODUCTS } = useContent();
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
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
  }, [activeTab, searchQuery]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesTab = activeTab === 'all' || product.category === activeTab;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, PRODUCTS]);

  const handleQuickAdd = (product: Product, e: MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    
    setAddedItemNotificationId(product.id);
    setTimeout(() => {
      setAddedItemNotificationId(null);
    }, 1500);
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const handleModalAdd = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, modalQuantity);
      setAddedItemNotificationId(selectedProduct.id);
      setTimeout(() => {
        setAddedItemNotificationId(null);
      }, 1500);
      handleCloseDetails();
    }
  };

  return (
    <section id="products-catalog-section" className="py-20 bg-emerald-50">
      <div className="container mx-auto px-6">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Certified Catalog</span>
          <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950">
            High-Yield Farming Products
          </h2>
          <p className="text-emerald-800 font-sans text-sm md:text-base">
            Browse our wide range of KEBS & PCPB fully-certified fertilizers, premium seeds, veterinary medicines, and modern farm tools available for delivery.
          </p>
        </div>

        {/* Toolbar: Tabs & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 mb-12 bg-white p-4 rounded-3xl border border-emerald-900/10 shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'crop-health', 'animal-health', 'seeds', 'equipment'] as const).map((tab) => (
              <button
                id={`tab-btn-${tab}`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 md:px-5 md:py-3 rounded-2xl text-[11px] md:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-50/50 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950'
                }`}
              >
                {tab === 'all' && 'All Products'}
                {tab === 'crop-health' && 'Crop Health'}
                {tab === 'animal-health' && 'Animal Health'}
                {tab === 'seeds' && 'Seeds & Grains'}
                {tab === 'equipment' && 'Farm Equipment'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input
              id="product-search-input"
              type="text"
              placeholder="Search agrochemicals, fertilizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-emerald-900/15 bg-emerald-50/20 text-emerald-950 focus:border-emerald-600 focus:bg-white outline-none text-sm transition-all"
            />
          </div>
        </div>

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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-emerald-900/5 shadow-inner">
            <p className="text-emerald-800 text-lg font-medium">No certified products match your criteria.</p>
            <p className="text-emerald-600/70 text-sm mt-1">Please try clearing your search query or choosing another tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <article
                id={`product-card-${product.id}`}
                key={product.id}
                onClick={() => handleOpenDetails(product)}
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

        {/* Product Details Modal Overlay */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative border border-emerald-900/10 max-h-[90vh] flex flex-col">
              
              {/* Header Close */}
              <button
                id="modal-close-btn"
                onClick={handleCloseDetails}
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Photo Side */}
                  <div className="relative h-64 md:h-full min-h-[250px] bg-emerald-50">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 text-white space-y-1">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald-600 px-2.5 py-1 rounded-full">
                        {selectedProduct.category.replace('-', ' ')}
                      </span>
                      <p className="text-xs text-white/80 mt-2">Verified genuine product</p>
                    </div>
                  </div>

                  {/* Information Details Side */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-medium text-emerald-950">{selectedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-emerald-900">
                          KSh {selectedProduct.price.toLocaleString()}
                        </span>
                        <div className="flex items-center text-xs">
                          <span className="text-yellow-500 font-semibold mr-1">★</span>
                          <span className="font-bold text-emerald-950">{selectedProduct.rating}</span>
                          <span className="text-emerald-600/60 ml-1">({selectedProduct.reviewsCount} farm reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Description</span>
                      <p className="text-emerald-800 text-xs md:text-sm leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Guidelines and Safety */}
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-900/5 space-y-3">
                      <div className="flex items-center space-x-2 text-emerald-900">
                        <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wide">Usage Guideline</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Store in a cool dry place, out of reach of children. Wear protective mask and gloves while spraying or handling. For best results, dilute precisely as stated on container.
                      </p>
                    </div>

                    {/* Quantity Selector & Add */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950">Select Quantity</span>
                        <div className="flex items-center border border-emerald-900/15 rounded-xl overflow-hidden">
                          <button
                            id="modal-qty-minus"
                            onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                            className="px-3 py-1 bg-emerald-50 text-emerald-900 font-bold hover:bg-emerald-100 transition"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-xs font-bold text-emerald-950">{modalQuantity}</span>
                          <button
                            id="modal-qty-plus"
                            onClick={() => setModalQuantity(q => q + 1)}
                            className="px-3 py-1 bg-emerald-50 text-emerald-900 font-bold hover:bg-emerald-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        id="modal-add-to-cart-btn"
                        onClick={handleModalAdd}
                        className="w-full btn bg-emerald-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-emerald-500 shadow-md transition"
                      >
                        Add {modalQuantity} to Cart • KSh {(selectedProduct.price * modalQuantity).toLocaleString()}
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
