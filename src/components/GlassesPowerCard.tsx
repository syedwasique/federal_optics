import React from 'react';
import { CheckCircle2, Eye, Info } from 'lucide-react';
import type { ContactLensPowerSelection } from '../context/CartContext';

/* -------------------------------------------------------------------------- */
/* Lens power card for eyeglasses and sunglasses (all sub-categories).        */
/* Kept deliberately simple: one power per eye. Anything more detailed comes  */
/* from the prescription card photo uploaded just below.                      */
/* -------------------------------------------------------------------------- */

export interface GlassesRx {
  hasPower: boolean;
  samePower: boolean;
  right: string;
  left: string;
}

export const DEFAULT_GLASSES_RX: GlassesRx = {
  hasPower: false,
  samePower: false,
  right: '0.00',
  left: '0.00',
};

const fmt = (v: number) => (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2));
const steps = (from: number, to: number, step: number) => {
  const out: string[] = [];
  for (let v = from; step > 0 ? v <= to + 1e-9 : v >= to - 1e-9; v += step) out.push(fmt(Math.round(v * 100) / 100));
  return out;
};

// -0.25 … -10.00 and +0.25 … +10.00 in 0.25 steps
const MINUS = steps(-0.25, -10, -0.25);
const PLUS = steps(0.25, 10, 0.25);

/** Map the card's state to the cart's power selection. */
export function glassesRxToSelection(rx: GlassesRx): ContactLensPowerSelection {
  if (!rx.hasPower) return { kind: 'glasses', hasPower: false };
  return {
    kind: 'glasses',
    hasPower: true,
    samePower: rx.samePower,
    rightEyePower: rx.right,
    leftEyePower: rx.samePower ? rx.right : rx.left,
  };
}

const PowerSelect: React.FC<{
  id: string;
  label: string;
  dot: string;
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}> = ({ id, label, dot, value, disabled, onChange }) => (
  <div className="bg-white p-3 rounded-xl border border-[#E8E3D8] min-w-0">
    <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-2">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </label>
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      className="w-full min-w-0 h-10 px-3 text-sm font-semibold rounded-lg border border-[#E8E3D8] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880] disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed"
    >
      <optgroup label="Minus (−) power">
        {MINUS.map(v => <option key={v} value={v}>{v}</option>)}
      </optgroup>
      <option value="0.00">0.00</option>
      <optgroup label="Plus (+) power">
        {PLUS.map(v => <option key={v} value={v}>{v}</option>)}
      </optgroup>
    </select>
  </div>
);

export const GlassesPowerCard: React.FC<{
  category: string;
  value: GlassesRx;
  onChange: (v: GlassesRx) => void;
}> = ({ category, value, onChange }) => {
  const isSun = category === 'sunglasses';
  const set = (patch: Partial<GlassesRx>) => onChange({ ...value, ...patch });
  const left = value.samePower ? value.right : value.left;

  const modeBtn = (active: boolean) =>
    `p-3 rounded-xl border text-left transition-all cursor-pointer ${
      active ? 'border-[#C5A880] bg-[#FAF8F5] ring-2 ring-[#C5A880]/20 shadow-xs' : 'border-[#E8E3D8] bg-white hover:border-stone-400'
    }`;

  return (
    <div className="space-y-3.5 pt-2">
      <div className="flex items-center text-xs">
        <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#C5A880]" />
          <span>{isSun ? 'Sunglass Lens Power' : 'Lens Power'}</span>
        </span>
      </div>

      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-2 text-xs" role="radiogroup" aria-label="Lens power">
        <button type="button" role="radio" aria-checked={!value.hasPower} onClick={() => set({ hasPower: false })} className={modeBtn(!value.hasPower)}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900">Without Power</span>
            {!value.hasPower && <span className="w-2 h-2 rounded-full bg-[#8C7048]" />}
          </div>
          <span className="text-[11px] text-stone-500 block mt-0.5">{isSun ? 'Normal sun lenses' : 'Plain lenses'}</span>
        </button>
        <button type="button" role="radio" aria-checked={value.hasPower} onClick={() => set({ hasPower: true })} className={modeBtn(value.hasPower)}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900">With Power</span>
            {value.hasPower && <span className="w-2 h-2 rounded-full bg-[#8C7048]" />}
          </div>
          <span className="text-[11px] text-stone-500 block mt-0.5">{isSun ? 'Sun lenses with your power' : 'Lenses with your power'}</span>
        </button>
      </div>

      {value.hasPower ? (
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#C5A880]/40 p-3.5 sm:p-4 space-y-3 shadow-xs">
          <div className="grid grid-cols-2 gap-2">
            <PowerSelect
              id="rx-right"
              label="Right Eye"
              dot="bg-[#C5A880]"
              value={value.right}
              onChange={right => set(value.samePower ? { right, left: right } : { right })}
            />
            <PowerSelect
              id="rx-left"
              label="Left Eye"
              dot="bg-[#8C7048]"
              value={left}
              disabled={value.samePower}
              onChange={l => set({ left: l })}
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={value.samePower}
              onChange={e => set({ samePower: e.target.checked, left: e.target.checked ? value.right : value.left })}
              className="accent-[#C5A880] rounded"
            />
            <span>Same power in both eyes</span>
          </label>

          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs px-1 text-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-stone-900">Selected:</span>
            <span>
              Right <strong>{value.right}</strong> <span className="text-stone-400">|</span> Left <strong>{left}</strong>
            </span>
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-stone-500 px-1">
            <Info className="w-3.5 h-3.5 mt-px shrink-0 text-[#8C7048]" />
            <span>
              Not sure of your power, or your prescription has more details? Just upload your prescription card below and our team will take care of it.
            </span>
          </p>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isSun ? 'Normal sun lenses without power.' : 'Plain lenses without power.'}</span>
        </div>
      )}
    </div>
  );
};
