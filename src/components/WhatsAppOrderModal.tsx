import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { CustomerOrderInfo } from '../context/CartContext';
import { X, MessageSquare, ShieldCheck, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export const WhatsAppOrderModal: React.FC = () => {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    orderTargetItem,
    cart,
    subtotal,
    generateWhatsAppUrl
  } = useCart();

  const [customer, setCustomer] = useState<CustomerOrderInfo>(() => {
    try {
      const saved = localStorage.getItem('federal_customer_info');
      return saved
        ? JSON.parse(saved)
        : { name: '', phone: '', address: '', city: 'Karachi', prescriptionNotes: '' };
    } catch {
      return { name: '', phone: '', address: '', city: 'Karachi', prescriptionNotes: '' };
    }
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOrderModalOpen) return null;

  const isSingle = !!orderTargetItem;
  const items = isSingle ? [orderTargetItem] : cart;
  const currentTotal = isSingle
    ? (((orderTargetItem.selectedPack ? orderTargetItem.selectedPack.price : orderTargetItem.product.price) + (orderTargetItem.selectedLens ? orderTargetItem.selectedLens.price : 0)) * orderTargetItem.quantity)
    : subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setErrorMsg('Please complete your name, phone number, and delivery address.');
      return;
    }

    try {
      localStorage.setItem('federal_customer_info', JSON.stringify(customer));
    } catch (err) {
      console.error(err);
    }

    const waUrl = generateWhatsAppUrl(customer, orderTargetItem);
    window.open(waUrl, '_blank');
    setHasSubmitted(true);
  };

  const handleClose = () => {
    setIsOrderModalOpen(false);
    setHasSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#C5A880]/30 p-6 md:p-8 text-[#121316]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-500 hover:text-black hover:bg-[#E8E3D8] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {hasSubmitted ? (
          <div className="text-center py-8 space-y-5 animate-scale-up">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-sans text-2xl font-bold text-[#121316]">
              Order Slip Sent to WhatsApp
            </h3>
            <p className="text-stone-600 max-w-md mx-auto text-sm leading-relaxed">
              We have generated your structured order slip and opened WhatsApp in a new tab. 
              <strong className="text-stone-900 block mt-1">Please hit "Send" in WhatsApp to confirm with Federal Optical’s optical consultants.</strong>
            </p>
            <div className="bg-[#F3EFE8] rounded-xl p-4 text-xs text-stone-700 space-y-1 text-left max-w-md mx-auto border border-[#E8E3D8]">
              <p className="font-semibold text-stone-900">What happens next?</p>
              <p>1. Our Karachi clinic verifies your frame measurements and lens prescription.</p>
              <p>2. We confirm COD (Cash on Delivery) or bank transfer details.</p>
              <p>3. Your eyewear is custom-inspected, securely packed in our 1975 hard case, and dispatched.</p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  const waUrl = generateWhatsAppUrl(customer, orderTargetItem);
                  window.open(waUrl, '_blank');
                }}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Re-open WhatsApp
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-[#121316] hover:bg-stone-800 text-white font-medium text-sm transition-colors"
              >
                Done / Back to Catalog
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="border-b border-[#E8E3D8] pb-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/15 text-[#8C7048] text-xs font-semibold tracking-wider uppercase mb-2">
                <MessageSquare className="w-3.5 h-3.5" /> Direct WhatsApp Order Flow
              </div>
              <h2 className="font-sans text-xl md:text-2xl font-bold text-[#121316]">
                {isSingle ? 'Quick Order via WhatsApp' : 'Complete Your Order'}
              </h2>
              <p className="text-stone-600 text-xs md:text-sm mt-1">
                Your order items are bundled into a verified order slip and sent directly to Federal Optical’s customer desk (0300-2265650).
              </p>
            </div>

            {/* Mini Order Summary Box */}
            <div className="bg-[#F3EFE8] rounded-xl p-4 mb-6 border border-[#E8E3D8] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-stone-500 uppercase">
                <span>Selected {items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
                <span>Subtotal: <strong className="font-sans font-semibold text-stone-900 tabular-nums lining-nums">Rs. {currentTotal.toLocaleString()}</strong></span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1 divide-y divide-[#E8E3D8]/60">
                {items.map((item, idx) => {
                  const basePrice = item.selectedPack ? item.selectedPack.price : item.product.price;
                  const unitPrice = basePrice + (item.selectedLens ? item.selectedLens.price : 0);
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div key={item.id || idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-9 h-9 object-cover rounded-md border border-[#E8E3D8]"
                        />
                        <div>
                          <p className="font-sans font-semibold text-stone-900 leading-snug">{item.product.name}</p>
                          <p className="text-stone-500 text-[11px]">
                            {item.selectedPack ? `${item.selectedPack.name} • ` : ''}
                            {item.selectedColor} 
                            {item.powerSelection ? (
                              item.powerSelection.hasPower
                                ? ` • Rx: OD ${item.powerSelection.rightEyePower || '0'}, OS ${item.powerSelection.leftEyePower || '0'}`
                                : ' • Plano'
                            ) : ''}
                            {item.selectedLens ? ` • ${item.selectedLens.name}` : ''} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-sans font-semibold text-stone-900 tabular-nums lining-nums">
                        Rs. {lineTotal.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="e.g. 0300-1234567"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block font-medium text-stone-800 mb-1">
                    City *
                  </label>
                  <select
                    value={customer.city}
                    onChange={e => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  >
                    <option value="Karachi">Karachi (Same Day)</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad / Rawalpindi">Islamabad / RWP</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Multan">Multan</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Other Pakistan City">Other Pakistan City</option>
                    <option value="International (USA/UK/Canada)">International (USA/UK/Canada)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-800 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="House/Apartment #, Street, Area / Sector"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-800 mb-1">
                  Prescription Powers or Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customer.prescriptionNotes || ''}
                  onChange={e => setCustomer({ ...customer, prescriptionNotes: e.target.value })}
                  placeholder="e.g. SPH: -2.00, CYL: -0.75, AXIS: 180 (or note: 'I will send prescription photo on WhatsApp')"
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E8E3D8] bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880] text-xs"
                />
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E3D8] text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Nationwide & Global Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>50-Yr Family Optician Guarantee</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#121316] hover:bg-[#252830] text-white font-medium text-sm md:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-black/10 transition-all cursor-pointer group"
              >
                <span>Generate Order & Open WhatsApp</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A880]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
