/* -------------------------------------------------------------------------- */
/* Prescription card photos                                                   */
/*                                                                            */
/* Photos live ONLY in this browser tab's memory (a File + an object URL).    */
/* They are never uploaded, never written to localStorage/sessionStorage, and */
/* are wiped (URLs revoked) as soon as the WhatsApp order is sent. A page     */
/* refresh also discards them; cart items then keep only the file name.       */
/* -------------------------------------------------------------------------- */

export interface PrescriptionCardRef {
  id: string;
  fileName: string;
}

type StoredCard = { file: File; url: string };

const cards = new Map<string, StoredCard>();
const listeners = new Set<() => void>();
let version = 0;

const emit = () => {
  version++;
  listeners.forEach(l => l());
};

export const MAX_CARD_BYTES = 15 * 1024 * 1024;

export function validateCardFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Please choose a photo (JPG, PNG or HEIC) of your prescription card.';
  if (file.size > MAX_CARD_BYTES) return 'This photo is larger than 15 MB. Please choose a smaller photo.';
  return null;
}

export function addCard(file: File): PrescriptionCardRef {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `rx-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  cards.set(id, { file, url: URL.createObjectURL(file) });
  emit();
  return { id, fileName: file.name || 'prescription-card.jpg' };
}

export function getCard(id?: string): StoredCard | undefined {
  return id ? cards.get(id) : undefined;
}

export function removeCard(id?: string) {
  if (!id) return;
  const c = cards.get(id);
  if (!c) return;
  URL.revokeObjectURL(c.url);
  cards.delete(id);
  emit();
}

export function removeCards(ids: (string | undefined)[]) {
  ids.forEach(id => {
    const c = id ? cards.get(id) : undefined;
    if (c && id) {
      URL.revokeObjectURL(c.url);
      cards.delete(id);
    }
  });
  emit();
}

/** For useSyncExternalStore: re-render when photos are added or wiped. */
export function subscribeCards(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function getCardsVersion() {
  return version;
}

/** Can this device share image files into apps like WhatsApp (mostly phones)? */
export function canShareFiles(files: File[]): boolean {
  try {
    return typeof navigator !== 'undefined' && !!navigator.canShare && navigator.canShare({ files });
  } catch {
    return false;
  }
}

/** Use the phone share sheet (WhatsApp appears there) only on touch devices; on laptops
 *  the share panel rarely offers WhatsApp, so copy/download is offered instead. */
export function preferShareSheet(files: File[]): boolean {
  const touch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
  return !!touch && canShareFiles(files);
}

/** Re-encode a photo as a PNG (scaled to max 2000px) so it can go on the clipboard. */
async function toPngBlob(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not encode image'))), 'image/png')
  );
}

/** Copy a photo to the clipboard so it can be pasted (Ctrl+V) into WhatsApp. */
export async function copyCardToClipboard(file: File): Promise<boolean> {
  try {
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false;
    // passing a promise keeps this inside the user's click, which browsers require
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': toPngBlob(file) })]);
    return true;
  } catch {
    return false;
  }
}

export function downloadCard(file: File, name = 'prescription-card') {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  a.download = `${name}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
