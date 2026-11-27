import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, LensPackageOption, ProductPackOption } from '../data/products';
import { getProductById, LENS_PACKAGE_OPTIONS, takesLensPackage } from '../data/products';
import type { PrescriptionCardRef } from '../utils/prescriptionCards';
import { getCard, removeCard, removeCards } from '../utils/prescriptionCards';
import { describePowerForWhatsApp } from '../utils/powerFormat';
import { ADVANCE_PERCENT, advanceOf } from '../utils/advance';

/** Power chosen on the product page: contact lenses or glasses (eyeglasses/sunglasses). */
export interface ContactLensPowerSelection {
  kind?: 'contacts' | 'glasses';
  hasPower: boolean; // false = plano / without power
  rightEyePower?: string; // OD sphere (e.g. "-2.50")
  leftEyePower?: string;  // OS sphere (e.g. "-2.50")
  cylinder?: string;      // Toric contacts: CYL for both eyes (e.g. "-1.25")
  axis?: string;          // Toric contacts: AXIS for both eyes (e.g. "90°")
  rightCylinder?: string; // Glasses: per-eye CYL / AXIS
  rightAxis?: string;
  leftCylinder?: string;
  leftAxis?: string;
  add?: string;           // Glasses: near addition (bifocal / progressive)
  pd?: string;            // Glasses: pupillary distance
  samePower?: boolean;
  prescriptionNotes?: string;
}

export type { PrescriptionCardRef };

function powerKeyOf(ps?: ContactLensPowerSelection): string {
  if (!ps) return 'no-power';
  if (!ps.hasPower) return 'plano';
  return [ps.kind, ps.rightEyePower, ps.rightCylinder, ps.rightAxis, ps.leftEyePower, ps.leftCylinder, ps.leftAxis,
    ps.cylinder, ps.axis, ps.add, ps.pd, ps.prescriptionNotes].map(v => v || '0').join('_');
}

export interface CartItem {
  id: string; // unique item id based on product id + variant + lens + pack + power
  product: Product;
  selectedColor: string;
  selectedLens?: LensPackageOption;
  selectedPack?: ProductPackOption;
  powerSelection?: ContactLensPowerSelection;
  /** Photo of the customer's prescription card. Only a reference is kept here; the
   *  image itself stays in memory (utils/prescriptionCards) and is never saved. */
  prescriptionCard?: PrescriptionCardRef;
  quantity: number;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  prescriptionNotes?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedColor: string,
    selectedLens?: LensPackageOption,
    quantity?: number,
    selectedPack?: ProductPackOption,
    powerSelection?: ContactLensPowerSelection,
    prescriptionCard?: PrescriptionCardRef
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  orderTargetItem: CartItem | null; // If null, checkouts whole cart. If set, checkouts single item.
  setOrderTargetItem: (item: CartItem | null) => void;
  triggerCheckoutCart: () => void;
  triggerQuickOrder: (
    product: Product,
    selectedColor: string,
    selectedLens?: LensPackageOption,
    selectedPack?: ProductPackOption,
    powerSelection?: ContactLensPowerSelection,
    prescriptionCard?: PrescriptionCardRef,
    quantity?: number
  ) => void;
  generateWhatsAppUrl: (customer: CustomerOrderInfo, singleItem?: CartItem | null) => string;
  /** Wipe the prescription photos of these items from memory (after the order is sent). */
  discardPrescriptionCards: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'federal_optical_cart_v1';
export const FEDERAL_OPTICAL_PHONE = '0300-2265650';
export const FEDERAL_OPTICAL_PHONE_INTL = '+92 323 2265650';
export const FEDERAL_OPTICAL_WHATSAPP_NUMBER = '923002265650'; // standard WhatsApp API format

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // The saved cart holds a snapshot of each product. Refresh it from the live
      // catalogue so prices, packs and images stay current; drop removed products.
      return parsed.flatMap((item: CartItem) => {
        const product = item?.product?.id ? getProductById(item.product.id) : undefined;
        if (!product) return [];
        const selectedPack = item.selectedPack
          ? product.packOptions?.find(pk => pk.id === item.selectedPack?.id)
          : undefined;
        // lens packages only apply to optical frames (older saved bags could carry one on sunglasses/contacts)
        const selectedLens = item.selectedLens && takesLensPackage(product)
          ? LENS_PACKAGE_OPTIONS.find(l => l.id === item.selectedLens?.id) ?? item.selectedLens
          : undefined;
        return [{ ...item, product, selectedPack, selectedLens, quantity: Math.max(1, Number(item.quantity) || 1) }];
      });
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderTargetItem, setOrderTargetItem] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    selectedColor: string,
    selectedLens?: LensPackageOption,
    quantity = 1,
    selectedPack?: ProductPackOption,
    powerSelection?: ContactLensPowerSelection,
    prescriptionCard?: PrescriptionCardRef
  ) => {
    if (!takesLensPackage(product)) selectedLens = undefined;
    const lensKey = selectedLens ? selectedLens.id : 'no-lens';
    const packKey = selectedPack ? selectedPack.id : 'no-pack';
    const rxKey = prescriptionCard ? prescriptionCard.id : 'no-card';
    const itemId = `${product.id}__${selectedColor}__${lensKey}__${packKey}__${powerKeyOf(powerSelection)}__${rxKey}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { id: itemId, product, selectedColor, selectedLens, selectedPack, powerSelection, prescriptionCard, quantity }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const gone = prev.find(item => item.id === itemId);
      const rest = prev.filter(item => item.id !== itemId);
      // forget its prescription photo unless another item still uses it
      const cardId = gone?.prescriptionCard?.id;
      if (cardId && !rest.some(i => i.prescriptionCard?.id === cardId)) removeCard(cardId);
      return rest;
    });
  };

  const discardPrescriptionCards = (items: CartItem[]) => {
    const ids = items.map(i => i.prescriptionCard?.id).filter(Boolean) as string[];
    if (!ids.length) return;
    removeCards(ids);
    // the photos are wiped; drop their references from the bag too
    setCart(prev => prev.map(i => (i.prescriptionCard && ids.includes(i.prescriptionCard.id) ? { ...i, prescriptionCard: undefined } : i)));
    setOrderTargetItem(prev => (prev && prev.prescriptionCard ? { ...prev, prescriptionCard: undefined } : prev));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    removeCards(cart.map(i => i.prescriptionCard?.id));
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const basePrice = item.selectedPack ? item.selectedPack.price : item.product.price;
    const lensPrice = item.selectedLens ? item.selectedLens.price : 0;
    return sum + (basePrice + lensPrice) * item.quantity;
  }, 0);

  const triggerCheckoutCart = () => {
    setOrderTargetItem(null);
    setIsOrderModalOpen(true);
  };

  const triggerQuickOrder = (
    product: Product,
    selectedColor: string,
    selectedLens?: LensPackageOption,
    selectedPack?: ProductPackOption,
    powerSelection?: ContactLensPowerSelection,
    prescriptionCard?: PrescriptionCardRef,
    quantity = 1
  ) => {
    if (!takesLensPackage(product)) selectedLens = undefined;
    const lensKey = selectedLens ? selectedLens.id : 'no-lens';
    const packKey = selectedPack ? selectedPack.id : 'no-pack';
    const tempItem: CartItem = {
      id: `quick__${product.id}__${selectedColor}__${lensKey}__${packKey}__${powerKeyOf(powerSelection)}`,
      product,
      selectedColor,
      selectedLens,
      selectedPack,
      powerSelection,
      prescriptionCard,
      quantity: Math.max(1, quantity)
    };
    setOrderTargetItem(tempItem);
    setIsOrderModalOpen(true);
  };

  /** Link to the exact product (and colour) so the sales team can open what was ordered. */
  const productLink = (item: CartItem): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.federaloptical.pk';
    const color = item.product.availableColors.length > 1 && item.selectedColor
      ? `?color=${encodeURIComponent(item.selectedColor)}`
      : '';
    return `${origin}/product/${encodeURIComponent(item.product.id)}${color}`;
  };

  const generateWhatsAppUrl = (customer: CustomerOrderInfo, singleItem?: CartItem | null): string => {
    const itemsToProcess = singleItem ? [singleItem] : cart;

    let itemsTotal = 0;
    let itemsText = '';

    itemsToProcess.forEach((item, index) => {
      const basePrice = item.selectedPack ? item.selectedPack.price : item.product.price;
      const lensPrice = item.selectedLens ? item.selectedLens.price : 0;
      const unitTotal = basePrice + lensPrice;
      const lineTotal = unitTotal * item.quantity;
      itemsTotal += lineTotal;

      itemsText += `${index + 1}. *${item.product.sku}* — ${item.product.name}\n`;
      if (item.selectedPack) {
        itemsText += `   • Package / Size: *${item.selectedPack.name}*\n`;
      }
      itemsText += `   • Color / Shade: ${item.selectedColor}\n`;
      itemsText += describePowerForWhatsApp(item.powerSelection);
      if (item.prescriptionCard) {
        itemsText += getCard(item.prescriptionCard.id)
          ? `   • Prescription Card: *📎 Photo attached in this chat*\n`
          : `   • Prescription Card: *I will send the photo in this chat*\n`;
      }
      if (item.selectedLens) {
        if (item.selectedLens.id === 'custom-tech-whatsapp') {
          itemsText += `   • Lens Technology: *${item.selectedLens.name}* (Customer will specify requirements on WhatsApp)\n`;
        } else {
          itemsText += `   • Lens Technology: ${item.selectedLens.name} (+Rs. ${item.selectedLens.price.toLocaleString()})\n`;
        }
      }
      itemsText += `   • Qty: ${item.quantity} × Rs. ${unitTotal.toLocaleString()} = *Rs. ${lineTotal.toLocaleString()}*\n`;
      itemsText += `   • Product Link: ${productLink(item)}\n\n`;
    });
    const advance = advanceOf(itemsTotal);

    const lines = [
      `👓 *NEW ORDER REQUEST — FEDERAL OPTICAL*`,
      `_Your Family Optician Since 1975 • Karachi, Pakistan_\n`,
      `---------------------------------------`,
      `*ITEMS ORDERED:*`,
      itemsText.trim(),
      `---------------------------------------`,
      `*ORDER SUMMARY:*`,
      `• *Order Total:* Rs. ${itemsTotal.toLocaleString()}`,
      `• *Advance Payment (${ADVANCE_PERCENT}%):* Rs. ${advance.toLocaleString()}`,
      `• *Balance on Delivery:* Rs. ${(itemsTotal - advance).toLocaleString()}`,
      `• *Estimated Shipping:* Standard Delivery (Karachi Same/Next Day • Nationwide 2–3 Days • International Express)`,
      `\n_Please send me the account details for the ${ADVANCE_PERCENT}% advance. I understand my order is confirmed once the advance is received._`,
      `\n*CUSTOMER DETAILS:*`,
      `• *Full Name:* ${customer.name}`,
      `• *WhatsApp/Phone:* ${customer.phone}`,
      `• *City:* ${customer.city || 'Karachi'}`,
      `• *Delivery Address:* ${customer.address}`,
      customer.prescriptionNotes ? `• *Prescription / Special Notes:* ${customer.prescriptionNotes}` : null,
      `\n---------------------------------------`,
      `_Order initiated via Federal Optical Digital Catalog (federaloptical.pk)_`,
      `_Please confirm availability and my prescription details._`
    ].filter(Boolean);

    const message = lines.join('\n');
    return `https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isOrderModalOpen,
        setIsOrderModalOpen,
        orderTargetItem,
        setOrderTargetItem,
        triggerCheckoutCart,
        triggerQuickOrder,
        generateWhatsAppUrl,
        discardPrescriptionCards
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
