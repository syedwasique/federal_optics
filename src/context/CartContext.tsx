import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, LensPackageOption, ProductPackOption } from '../data/products';
import { getProductById, LENS_PACKAGE_OPTIONS } from '../data/products';

export interface ContactLensPowerSelection {
  hasPower: boolean; // false = plano (cosmetic/zero power)
  rightEyePower?: string; // OD (e.g. "-2.50")
  leftEyePower?: string;  // OS (e.g. "-2.50")
  cylinder?: string;      // Toric CYL (e.g. "-1.25")
  axis?: string;          // Toric AXIS (e.g. "90°")
  samePower?: boolean;
  prescriptionNotes?: string;
}

export interface CartItem {
  id: string; // unique item id based on product id + variant + lens + pack + power
  product: Product;
  selectedColor: string;
  selectedLens?: LensPackageOption;
  selectedPack?: ProductPackOption;
  powerSelection?: ContactLensPowerSelection;
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
    powerSelection?: ContactLensPowerSelection
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
    powerSelection?: ContactLensPowerSelection
  ) => void;
  generateWhatsAppUrl: (customer: CustomerOrderInfo, singleItem?: CartItem | null) => string;
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
        const selectedLens = item.selectedLens
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
    powerSelection?: ContactLensPowerSelection
  ) => {
    const lensKey = selectedLens ? selectedLens.id : 'no-lens';
    const packKey = selectedPack ? selectedPack.id : 'no-pack';
    const powerKey = powerSelection?.hasPower
      ? `od_${powerSelection.rightEyePower || '0'}_os_${powerSelection.leftEyePower || '0'}_cyl_${powerSelection.cylinder || '0'}_ax_${powerSelection.axis || '0'}`
      : (powerSelection ? 'plano' : 'no-power');
    const itemId = `${product.id}__${selectedColor}__${lensKey}__${packKey}__${powerKey}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { id: itemId, product, selectedColor, selectedLens, selectedPack, powerSelection, quantity }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
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
    powerSelection?: ContactLensPowerSelection
  ) => {
    const lensKey = selectedLens ? selectedLens.id : 'no-lens';
    const packKey = selectedPack ? selectedPack.id : 'no-pack';
    const powerKey = powerSelection?.hasPower
      ? `od_${powerSelection.rightEyePower || '0'}_os_${powerSelection.leftEyePower || '0'}_cyl_${powerSelection.cylinder || '0'}_ax_${powerSelection.axis || '0'}`
      : (powerSelection ? 'plano' : 'no-power');
    const tempItem: CartItem = {
      id: `quick__${product.id}__${selectedColor}__${lensKey}__${packKey}__${powerKey}`,
      product,
      selectedColor,
      selectedLens,
      selectedPack,
      powerSelection,
      quantity: 1
    };
    setOrderTargetItem(tempItem);
    setIsOrderModalOpen(true);
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
      if (item.powerSelection) {
        if (item.powerSelection.hasPower) {
          itemsText += `   • Prescription Power: Right Eye (OD): *${item.powerSelection.rightEyePower || '0.00'}* | Left Eye (OS): *${item.powerSelection.leftEyePower || '0.00'}*\n`;
          if (item.powerSelection.cylinder) {
            itemsText += `   • Astigmatism (Toric): Cyl *${item.powerSelection.cylinder}* | Axis *${item.powerSelection.axis || '180°'}*\n`;
          }
          if (item.powerSelection.prescriptionNotes) {
            itemsText += `   • Rx Notes: ${item.powerSelection.prescriptionNotes}\n`;
          }
        } else {
          itemsText += `   • Power: *Plano (0.00 / Zero Power Cosmetic)*\n`;
        }
      }
      if (item.selectedLens) {
        if (item.selectedLens.id === 'custom-tech-whatsapp') {
          itemsText += `   • Lens Technology: *${item.selectedLens.name}* (Customer will specify requirements on WhatsApp)\n`;
        } else {
          itemsText += `   • Lens Technology: ${item.selectedLens.name} (+Rs. ${item.selectedLens.price.toLocaleString()})\n`;
        }
      }
      itemsText += `   • Qty: ${item.quantity} × Rs. ${unitTotal.toLocaleString()} = *Rs. ${lineTotal.toLocaleString()}*\n\n`;
    });

    const lines = [
      `👓 *NEW ORDER REQUEST — FEDERAL OPTICAL*`,
      `_Your Family Optician Since 1975 • Karachi, Pakistan_\n`,
      `---------------------------------------`,
      `*ITEMS ORDERED:*`,
      itemsText.trim(),
      `---------------------------------------`,
      `*ORDER SUMMARY:*`,
      `• *Subtotal:* Rs. ${itemsTotal.toLocaleString()}`,
      `• *Estimated Shipping:* Standard Delivery (Karachi Same/Next Day • Nationwide 2–3 Days • International Express)`,
      `\n*CUSTOMER DETAILS:*`,
      `• *Full Name:* ${customer.name}`,
      `• *WhatsApp/Phone:* ${customer.phone}`,
      `• *City:* ${customer.city || 'Karachi'}`,
      `• *Delivery Address:* ${customer.address}`,
      customer.prescriptionNotes ? `• *Prescription / Special Notes:* ${customer.prescriptionNotes}` : null,
      `\n---------------------------------------`,
      `_Order initiated via Federal Optical Digital Catalog (federaloptical.pk)_`,
      `_Please confirm availability, prescription axis/powers, and payment mode (COD/Bank Transfer)._`
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
        generateWhatsAppUrl
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
