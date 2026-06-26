import { useState, FormEvent } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CreditCard, ChevronRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { handleImageError } from '../imageFallback';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const KENYAN_COUNTIES = [
  'Nairobi',
  'Nakuru',
  'Uasin Gishu (Eldoret)',
  'Trans Nzoia (Kitale)',
  'Meru',
  'Kiambu',
  'Kisumu',
  'Mombasa',
  'Nyeri',
  'Kericho',
  'Kakamega'
];

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formErrors, setFormErrors] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = totalAmount > 10000 ? 0 : 350; // free delivery for orders above 10,000 KSh

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    // Basic Validation
    if (!name.trim()) {
      setFormErrors('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setFormErrors('Please enter a valid phone number (e.g. 07XXXXXXXX or +254XXXXXXXXX).');
      return;
    }

    setIsLoading(true);
    // Simulate transaction processing
    setTimeout(() => {
      setIsLoading(false);
      setOrderId('MV-' + Math.floor(100000 + Math.random() * 900000));
      setStep('success');
    }, 2000);
  };

  const resetAll = () => {
    onClearCart();
    setStep('cart');
    setName('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-emerald-950/40 backdrop-blur-md flex justify-end">
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Drawer Container */}
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative border-l border-emerald-900/10">
        
        {/* Header */}
        <div className="p-6 border-b border-emerald-50 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-emerald-300" />
            <h3 className="font-serif text-lg font-medium">Your Agrochemical Basket</h3>
          </div>
          <button
            id="cart-drawer-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-emerald-950">Your basket is empty</h4>
                  <p className="text-emerald-800/80 text-xs px-6">
                    Browse our high-quality seeds, fertilizers, and crop protection chemicals to place an order.
                  </p>
                  <button
                    id="cart-shop-now-btn"
                    onClick={onClose}
                    className="btn bg-emerald-600 text-white font-semibold text-xs px-6 py-3 rounded-full hover:bg-emerald-500 transition shadow-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center space-x-4 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-900/5 transition-all hover:bg-emerald-50"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl shrink-0 bg-white border border-emerald-100"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={handleImageError}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-medium text-emerald-950 truncate">{item.product.name}</h4>
                        <p className="text-emerald-600 font-bold text-xs mt-0.5">
                          KSh {item.product.price.toLocaleString()}
                        </p>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            id={`qty-dec-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 bg-white border border-emerald-900/10 rounded flex items-center justify-center text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-emerald-950 px-1">{item.quantity}</span>
                          <button
                            id={`qty-inc-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-5 h-5 bg-white border border-emerald-900/10 rounded flex items-center justify-center text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <button
                        id={`cart-remove-${item.product.id}`}
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div className="text-xs font-bold tracking-wider text-emerald-600 uppercase border-b border-emerald-50 pb-2">
                Checkout Details
              </div>

              {formErrors && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formErrors}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">Full Farmer Name *</label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="e.g., Tina Maina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">M-Pesa Mobile Number *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700">
                    +254
                  </span>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    placeholder="712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>
                <p className="text-[10px] text-emerald-600/70">For cash-on-delivery validation and order support via SMS/Call</p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">Farming County in Kenya *</label>
                <select
                  id="checkout-county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 bg-white text-xs focus:border-emerald-600 outline-none"
                >
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">Delivery Instructions / Location Details</label>
                <textarea
                  id="checkout-notes"
                  rows={3}
                  placeholder="e.g., Next to Gari Agrovet center, near the main sub-station. Delivery to Kitale farm."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none resize-none"
                />
              </div>

              {/* Secure Payment Note */}
              <div className="p-3 bg-emerald-50 rounded-xl flex items-start space-x-2 border border-emerald-900/5">
                <CreditCard className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[10px] text-emerald-800 leading-relaxed">
                  <strong>Secure Processing:</strong> We accept cash on delivery, bank transfer, and Lipa Na M-Pesa. You will receive an validation call shortly after placement.
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  id="btn-back-to-cart"
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-3 border border-emerald-900/10 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition"
                >
                  Go Back
                </button>
                <button
                  id="btn-complete-checkout"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validating order...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl font-semibold text-emerald-950">Hongera! Order Received</h4>
                <p className="text-emerald-800/80 text-xs px-2 leading-relaxed">
                  Thank you for choosing Maxim Vet! Your order has been placed in our delivery system successfully.
                </p>
              </div>

              {/* Dynamic Invoice Receipt layout */}
              <div className="border border-dashed border-emerald-900/25 bg-emerald-50/50 p-5 rounded-2xl text-left space-y-4">
                <div className="flex justify-between text-[11px] font-mono text-emerald-800">
                  <span>Order Receipt ID:</span>
                  <span className="font-bold text-emerald-950">{orderId}</span>
                </div>
                
                <div className="border-t border-dashed border-emerald-900/10 my-2" />

                <div className="space-y-1.5 text-xs text-emerald-950">
                  <p><strong>Farmer Name:</strong> {name}</p>
                  <p><strong>Phone Contact:</strong> +254 {phone}</p>
                  <p><strong>County Location:</strong> {county}</p>
                </div>

                <div className="border-t border-dashed border-emerald-900/10 my-2" />

                <div className="space-y-1 text-xs">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-emerald-800">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span>KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-emerald-800 pt-1.5">
                    <span>Delivery Service Fee:</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `KSh ${deliveryFee}`}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-emerald-900/10 my-2" />

                <div className="flex justify-between text-sm font-bold text-emerald-950">
                  <span>Total Amount:</span>
                  <span>KSh {(totalAmount + deliveryFee).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-xl text-[10px] text-yellow-900 leading-relaxed text-left border border-yellow-200">
                <strong>Next Step:</strong> Our dispatch unit will contact you on <strong>+254 {phone}</strong> shortly to confirm shipment, delivery route, and final payment instructions.
              </div>

              <button
                id="btn-receipt-close"
                onClick={resetAll}
                className="w-full btn bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-2xl transition shadow-sm"
              >
                Close &amp; Keep Browsing
              </button>
            </div>
          )}
        </div>

        {/* Footer Subtotal Panel */}
        {cartItems.length > 0 && step === 'cart' && (
          <div className="p-6 border-t border-emerald-50 bg-emerald-50/50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-emerald-800">
                <span>Subtotal Items:</span>
                <span>KSh {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-800">
                <span>Estimated Delivery Fee:</span>
                <span>{deliveryFee === 0 ? 'FREE' : `KSh ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-emerald-950 pt-1 border-t border-emerald-900/5">
                <span>Total Due:</span>
                <span>KSh {(totalAmount + deliveryFee).toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-emerald-600/70">
                {totalAmount > 10000 
                  ? '🎉 You qualify for FREE shipping across Kenya!'
                  : `Add KSh ${(10000 - totalAmount).toLocaleString()} more for free shipping.`}
              </p>
            </div>

            <button
              id="btn-cart-checkout"
              onClick={() => setStep('checkout')}
              className="w-full btn bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-md transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
