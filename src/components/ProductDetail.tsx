import { useState } from 'react';
import { Product } from '../types';
import { useContent } from '../store/contentStore';
import { PRODUCT_CATEGORIES } from './ProductCatalog';
import { ChevronRight, Plus, Check, Leaf, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { handleImageError } from '../imageFallback';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (path: string) => void;
}

export default function ProductDetail({ product, onAddToCart, onSelectProduct, onNavigate }: ProductDetailProps) {
  const { products: PRODUCTS } = useContent();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const category = PRODUCT_CATEGORIES.find((c) => c.key === product.category);
  const categoryLabel = category?.label ?? product.category.replace('-', ' ');
  const categorySlug = category?.slug ?? '';

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <main className="min-h-screen bg-emerald-50">
      {/* Breadcrumb */}
      <div className="bg-emerald-50">
        <div className="container mx-auto px-6 py-3 flex items-center gap-2 text-xs font-semibold text-emerald-800/70 flex-wrap">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} className="hover:text-emerald-700 transition">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600/50" />
          <a href="/products" onClick={(e) => { e.preventDefault(); onNavigate('/products'); }} className="hover:text-emerald-700 transition">Certified Catalog</a>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600/50" />
          <a
            href={categorySlug ? `/products/${categorySlug}` : '/products'}
            onClick={(e) => { e.preventDefault(); onNavigate(categorySlug ? `/products/${categorySlug}` : '/products'); }}
            className="hover:text-emerald-700 transition"
          >
            {categoryLabel}
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600/50" />
          <span className="text-emerald-900 truncate max-w-[160px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 md:py-12">
        <button
          id="product-back-btn"
          onClick={() => onNavigate(categorySlug ? `/products/${categorySlug}` : '/products')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {categoryLabel}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-emerald-900/10 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
              {product.tag && (
                <span className="absolute top-5 left-5 text-[10px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-sm">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">{categoryLabel}</span>
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-emerald-950 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-bold text-emerald-900">KSh {product.price.toLocaleString()}</span>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-500 font-semibold mr-1">★</span>
                  <span className="font-bold text-emerald-950">{product.rating}</span>
                  <span className="text-emerald-600/60 ml-1">({product.reviewsCount} farm reviews)</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                  product.stockStatus === 'Out of Stock'
                    ? 'bg-red-50 text-red-700'
                    : product.stockStatus === 'Low Stock'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {product.stockStatus}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Description</span>
              <p className="text-emerald-800 text-sm md:text-base leading-relaxed">{product.description}</p>
            </div>

            {/* Usage Guideline */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide">Usage Guideline</span>
              </div>
              <p className="text-xs md:text-sm text-emerald-800 leading-relaxed">
                Store in a cool dry place, out of reach of children. Wear protective mask and gloves while spraying or handling. For best results, dilute precisely as stated on container.
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-emerald-900/10">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-emerald-900">KEBS &amp; PCPB certified genuine</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-emerald-900/10">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-emerald-900">Nationwide delivery available</span>
              </div>
            </div>

            {/* Quantity + Add */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-950">Select Quantity</span>
                <div className="flex items-center border border-emerald-900/15 rounded-xl overflow-hidden">
                  <button
                    id="detail-qty-minus"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 bg-emerald-50 text-emerald-900 font-bold hover:bg-emerald-100 transition"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-sm font-bold text-emerald-950">{quantity}</span>
                  <button
                    id="detail-qty-plus"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 bg-emerald-50 text-emerald-900 font-bold hover:bg-emerald-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                id="detail-add-to-cart-btn"
                onClick={handleAdd}
                className={`w-full font-semibold py-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 ${
                  justAdded ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add {quantity} to Cart • KSh {(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-emerald-950 mb-6 md:mb-8">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <article
                  id={`related-product-${p.id}`}
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group bg-white rounded-3xl border border-emerald-900/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-1 justify-between gap-3">
                    <h3 className="font-serif text-base md:text-lg font-medium text-emerald-950 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {p.name}
                    </h3>
                    <span className="font-sans text-base font-bold text-emerald-900">KSh {p.price.toLocaleString()}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
