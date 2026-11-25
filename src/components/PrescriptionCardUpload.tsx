import React, { useRef, useState, useSyncExternalStore } from 'react';
import { Camera, FileImage, Lock, RefreshCw, Trash2 } from 'lucide-react';
import type { PrescriptionCardRef } from '../utils/prescriptionCards';
import { addCard, getCard, getCardsVersion, removeCard, subscribeCards, validateCardFile } from '../utils/prescriptionCards';
import { useCart } from '../context/CartContext';

/* -------------------------------------------------------------------------- */
/* "Upload your prescription card" — shown after the power card on glasses    */
/* and contact lens pages. The photo stays in this tab's memory only (see     */
/* utils/prescriptionCards.ts) and is sent with the WhatsApp order.           */
/* -------------------------------------------------------------------------- */

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const PrescriptionCardUpload: React.FC<{
  value: PrescriptionCardRef | null;
  onChange: (v: PrescriptionCardRef | null) => void;
}> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  // re-render when photos are added or wiped (e.g. after an order is sent)
  useSyncExternalStore(subscribeCards, getCardsVersion);
  const card = value ? getCard(value.id) : undefined;
  const { cart } = useCart();
  // wipe a replaced/removed photo at once, unless an item in the bag still uses it
  const release = () => {
    if (value && !cart.some(i => i.prescriptionCard?.id === value.id)) removeCard(value.id);
  };

  const take = (file?: File | null) => {
    if (!file) return;
    const problem = validateCardFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    release();
    onChange(addCard(file));
  };

  const open = () => inputRef.current?.click();

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <FileImage className="w-4 h-4 text-[#C5A880]" />
          <span>Upload Your Prescription Card</span>
        </span>
        <span className="text-[10px] font-semibold text-stone-500 bg-[#F3EFE8] px-2.5 py-0.5 rounded-full shrink-0">Optional</span>
      </div>
      <p className="text-[11px] text-stone-500 -mt-1">
        Have a power that isn’t in the list above, or rather send your doctor’s prescription? Add a clear photo of it and it’s sent with your WhatsApp order.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={e => {
          take(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {card && value ? (
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-[#C5A880]/50 bg-[#FAF8F5] shadow-xs">
          <a
            href={card.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 block w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#E8E3D8] bg-white"
            title="View full photo"
          >
            <img src={card.url} alt="Your prescription card" className="w-full h-full object-cover" />
          </a>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-stone-900 truncate">{value.fileName}</p>
            <p className="text-[11px] text-stone-500">{formatSize(card.file.size)} · ready to send</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={open}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#E8E3D8] bg-white text-[11px] font-semibold text-stone-800 hover:bg-[#F3EFE8] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change
              </button>
              <button
                type="button"
                onClick={() => {
                  release();
                  onChange(null);
                }}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#E8E3D8] bg-white text-[11px] font-semibold text-stone-600 hover:text-red-600 hover:border-red-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          onDragOver={e => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            take(e.dataTransfer.files?.[0]);
          }}
          className={`w-full flex items-center gap-3 sm:gap-4 p-4 rounded-2xl border-2 border-dashed text-left transition-colors cursor-pointer ${
            dragging ? 'border-[#C5A880] bg-[#FAF5EC]' : 'border-[#DDD3C1] bg-white hover:border-[#C5A880] hover:bg-[#FAF8F5]'
          }`}
        >
          <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-[#F3EFE8] text-[#8C7048]">
            <Camera className="w-5 h-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-stone-900">
              <span className="sm:hidden">Take or choose a photo</span>
              <span className="hidden sm:inline">Choose a photo or drag it here</span>
            </span>
            <span className="block text-[11px] text-stone-500">JPG, PNG or HEIC · up to 15 MB</span>
          </span>
        </button>
      )}

      {error && <p className="text-[11px] text-red-600" role="alert">{error}</p>}

      <p className="flex items-start gap-1.5 text-[11px] text-stone-500">
        <Lock className="w-3.5 h-3.5 mt-px shrink-0 text-[#8C7048]" />
        <span>
          Private: your photo stays on your device. It isn’t uploaded to or stored on our website, and it’s cleared as soon as your WhatsApp order is sent.
        </span>
      </p>
    </div>
  );
};
