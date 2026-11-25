import React from 'react';
import { Wallet } from 'lucide-react';
import { ADVANCE_PERCENT, advanceOf } from '../utils/advance';

/* 50% advance notice shown with the order total, in the bag and in the WhatsApp order window.
   The sales team sends the account number on WhatsApp; the order is confirmed once the advance is paid. */
export const AdvancePaymentNotice: React.FC<{ total: number; className?: string }> = ({ total, className = '' }) => {
  const advance = advanceOf(total);
  const row = 'flex justify-between items-baseline gap-3';
  return (
    <div className={`rounded-xl border-2 border-[#C5A880] bg-[#FFF8EC] p-3.5 space-y-2 ${className}`} role="note">
      <p className="flex items-start gap-2 text-[13px] font-bold text-stone-900 leading-snug">
        <Wallet className="w-4 h-4 mt-px shrink-0 text-[#8C7048]" />
        <span>{ADVANCE_PERCENT}% advance payment is required to confirm your order.</span>
      </p>
      <div className="space-y-1 text-xs tabular-nums lining-nums">
        <div className={row}>
          <span className="text-stone-600">Order total</span>
          <span className="whitespace-nowrap font-semibold text-stone-900">Rs. {total.toLocaleString()}</span>
        </div>
        <div className={row}>
          <span className="font-bold text-stone-900">Advance to pay ({ADVANCE_PERCENT}%)</span>
          <span className="whitespace-nowrap font-bold text-[#8C7048] text-sm">Rs. {advance.toLocaleString()}</span>
        </div>
        <div className={row}>
          <span className="text-stone-600">Balance on delivery</span>
          <span className="whitespace-nowrap font-semibold text-stone-900">Rs. {(total - advance).toLocaleString()}</span>
        </div>
      </div>
      <p className="text-[11px] text-stone-600 leading-snug">
        After you send your order on WhatsApp, our sales team will share the account number for the advance.
      </p>
    </div>
  );
};
