import type { ContactLensPowerSelection } from '../context/CartContext';

/** One eye in compact form: "-2.00" (plus "/ CYL -0.75 × 180°" only for older bag items that have it). */
function eye(sph?: string, cyl?: string, axis?: string): string {
  const s = sph || '0.00';
  return cyl && cyl !== '0.00' ? `${s} / CYL ${cyl} × ${axis || '—'}` : s;
}

/** Short one-line summary for the bag and order summary. */
export function describePowerShort(ps?: ContactLensPowerSelection): string {
  if (!ps) return '';
  if (!ps.hasPower) return ps.kind === 'glasses' ? 'Without power' : 'Plano (0.00)';
  if (ps.kind === 'glasses') {
    const r = eye(ps.rightEyePower, ps.rightCylinder, ps.rightAxis);
    const l = eye(ps.leftEyePower, ps.leftCylinder, ps.leftAxis);
    const extra = [ps.add ? `ADD ${ps.add}` : '', ps.pd ? `PD ${ps.pd}` : ''].filter(Boolean).join(' • ');
    return `Right: ${r} | Left: ${l}${extra ? ` • ${extra}` : ''}`;
  }
  const cyl = ps.cylinder ? ` • Cyl ${ps.cylinder} × ${ps.axis || '180°'}` : '';
  return `R: ${ps.rightEyePower || '0.00'} | L: ${ps.leftEyePower || '0.00'}${cyl}`;
}

/** WhatsApp lines (already indented and newline-terminated). */
export function describePowerForWhatsApp(ps?: ContactLensPowerSelection): string {
  if (!ps) return '';
  if (!ps.hasPower) {
    return ps.kind === 'glasses'
      ? `   • Power: *Without power (zero-power lenses)*\n`
      : `   • Power: *Plano (0.00 / Zero Power Cosmetic)*\n`;
  }
  let out = '';
  if (ps.kind === 'glasses') {
    out += `   • Power: Right Eye *${eye(ps.rightEyePower, ps.rightCylinder, ps.rightAxis)}* | Left Eye *${eye(ps.leftEyePower, ps.leftCylinder, ps.leftAxis)}*\n`;
    if (ps.add) out += `   • Near Addition (ADD): *${ps.add}*\n`;
    if (ps.pd) out += `   • Pupillary Distance (PD): *${ps.pd}*\n`;
  } else {
    out += `   • Prescription Power: Right Eye (OD): *${ps.rightEyePower || '0.00'}* | Left Eye (OS): *${ps.leftEyePower || '0.00'}*\n`;
    if (ps.cylinder) out += `   • Astigmatism (Toric): Cyl *${ps.cylinder}* | Axis *${ps.axis || '180°'}*\n`;
  }
  if (ps.prescriptionNotes) out += `   • Rx Notes: ${ps.prescriptionNotes}\n`;
  return out;
}
