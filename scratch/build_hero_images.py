"""
Build the 4 home-hero background images from photos already in the project.

None of the project's photos is a >=1600px landscape scene, so instead of
upscaling a crop to full-bleed, each hero is composed by:
  1. placing the sharp source photo (never upscaled more than ~1.1x) toward the
     right of a 16:9 canvas (desktop) or toward the top of a 9:16 canvas (mobile),
  2. filling the rest of the canvas with a smooth extension of the photo's own
     edge tones (Laplace / membrane fill), so the seam is invisible,
  3. feathering the photo edge into that fill and adding a touch of grain to
     prevent banding.

Outputs WebP at several widths into public/assets/hero/.
Run from the project root:  python scratch/build_hero_images.py
"""
import os
import numpy as np
from PIL import Image, ImageFilter

OUT = 'public/assets/hero'
os.makedirs(OUT, exist_ok=True)

SLIDES = {
    'eyeglasses': {
        'src': 'public/eyeglassimages/GOOD QUALITY/GOOD QUALITY , SQUARE SHAPE FOR MEN METAL SIDE FRAME , 4 COLORS BROWN 2 TONE  , BLACK , L.BLUE , NAVY BLUE 2 TONE/WhatsApp Image 2026-10-03 at 3.46.36 PM.jpeg',
        'kind': 'product',
    },
    'sunglasses': {
        'src': 'public/eyeglassimages/sunglasses/CELINE 5 COLORS RS 5800/WhatsApp Image 2026-10-20 at 6.29.35 PM.jpeg',
        'kind': 'product',
    },
    'clear-contacts': {
        'src': 'public/assets/images/clear_contacts.jpg',
        'kind': 'scene',
        # subject (hand + lens) horizontal centre as a fraction of the source width
        'focus_x': 0.66,
        # mobile: zoom in and lift so the hand + lens fill the top and the
        # blister packs fall into the dark text zone
        'm_zoom': 1.45,
        'm_shift_y': 0.08,
    },
    'color-contacts': {
        'src': 'public/assets/images/color_contacts.jpg',
        'kind': 'scene',
        'focus_x': 0.58,  # the iris
    },
}

DESKTOP = (1920, 1080)
MOBILE = (900, 1600)
DESKTOP_WIDTHS = [1920, 1440, 1024]
MOBILE_WIDTHS = [900, 600]


def membrane_fill(known: np.ndarray, mask: np.ndarray, iters: int = 4000) -> np.ndarray:
    """Fill unknown cells (mask==False) smoothly from known cells (Laplace, Jacobi)."""
    f = known.copy()
    # initial guess = mean of known
    mean = known[mask].mean(axis=0)
    f[~mask] = mean
    for _ in range(iters):
        p = np.pad(f, ((1, 1), (1, 1), (0, 0)), mode='edge')
        avg = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4.0
        f = np.where(mask[..., None], known, avg)
    return f


def product_bbox(img: Image.Image):
    """Bounding box of the product on a near-uniform studio background."""
    a = np.asarray(img.convert('RGB').filter(ImageFilter.GaussianBlur(3)), dtype=np.float32)
    h, w, _ = a.shape
    # background estimate: smooth fill from a 4% border ring
    small = np.asarray(img.convert('RGB').resize((64, 48), Image.BILINEAR), dtype=np.float32)
    ring = np.zeros((48, 64), bool)
    ring[:2, :] = ring[-2:, :] = ring[:, :3] = ring[:, -3:] = True
    bg = membrane_fill(small, ring, 1500)
    bg = np.asarray(Image.fromarray(bg.clip(0, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), dtype=np.float32)
    diff = np.abs(a - bg).max(axis=2)
    m = diff > 28
    ys, xs = np.nonzero(m)
    x0, x1 = np.percentile(xs, [0.5, 99.5])
    y0, y1 = np.percentile(ys, [0.5, 99.5])
    return int(x0), int(y0), int(x1), int(y1)


def feather_mask(size, feather, sides=('l', 'r', 't', 'b')):
    w, h = size
    m = np.ones((h, w), np.float32)
    ramp = lambda n: (np.sin(np.linspace(0, np.pi / 2, n)) ** 2).astype(np.float32)
    if 'l' in sides:
        m[:, :feather] *= ramp(feather)[None, :]
    if 'r' in sides:
        m[:, -feather:] *= ramp(feather)[::-1][None, :]
    if 't' in sides:
        m[:feather, :] *= ramp(feather)[:, None]
    if 'b' in sides:
        m[-feather:, :] *= ramp(feather)[::-1][:, None]
    return m


def compose(src: Image.Image, canvas_size, scale, offset, feather, sides):
    """Place scaled src at offset on canvas; fill the remainder from src's own edges."""
    cw, ch = canvas_size
    sw, sh = int(round(src.width * scale)), int(round(src.height * scale))
    placed = src.resize((sw, sh), Image.LANCZOS)
    ox, oy = offset

    # --- low-res background fill driven by the placed photo's border ring ---
    G = 8  # grid cell size in px
    gw, gh = cw // G, ch // G
    small_canvas = np.zeros((gh, gw, 3), np.float32)
    known = np.zeros((gh, gw), bool)
    small_src = np.asarray(placed.resize((max(1, sw // G), max(1, sh // G)), Image.BILINEAR), dtype=np.float32)
    sx0, sy0 = ox // G, oy // G
    ssh, ssw = small_src.shape[:2]
    ring = 2
    for yy in range(ssh):
        for xx in range(ssw):
            on_ring = yy < ring or yy >= ssh - ring or xx < ring or xx >= ssw - ring
            if not on_ring:
                continue
            cy, cx = sy0 + yy, sx0 + xx
            if 0 <= cy < gh and 0 <= cx < gw:
                small_canvas[cy, cx] = small_src[yy, xx]
                known[cy, cx] = True
    filled = membrane_fill(small_canvas, known, 3000)
    bg = Image.fromarray(filled.clip(0, 255).astype(np.uint8)).resize((cw, ch), Image.BICUBIC)
    bg = bg.filter(ImageFilter.GaussianBlur(G * 2))
    bga = np.asarray(bg, dtype=np.float32)

    # --- paste the sharp photo with a feathered edge ---
    out = bga.copy()
    pa = np.asarray(placed.convert('RGB'), dtype=np.float32)
    fm = feather_mask((sw, sh), feather, sides)
    x0, y0 = max(ox, 0), max(oy, 0)
    x1, y1 = min(ox + sw, cw), min(oy + sh, ch)
    px0, py0 = x0 - ox, y0 - oy
    region = pa[py0:py0 + (y1 - y0), px0:px0 + (x1 - x0)]
    mreg = fm[py0:py0 + (y1 - y0), px0:px0 + (x1 - x0)][..., None]
    out[y0:y1, x0:x1] = region * mreg + out[y0:y1, x0:x1] * (1 - mreg)

    # subtle grain so smooth gradients don't band after WebP compression
    rng = np.random.default_rng(7)
    out += rng.normal(0, 1.4, out.shape).astype(np.float32)
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))


def build_product(name, src):
    x0, y0, x1, y1 = product_bbox(src)
    pw, ph = x1 - x0, y1 - y0
    pcx, pcy = (x0 + x1) / 2, (y0 + y1) / 2
    print(f'  {name}: product bbox {x0},{y0}-{x1},{y1} ({pw}x{ph}) in {src.size}')

    # Desktop: product ~40% of canvas width, centred at 73% x / 52% y
    s = min(0.40 * DESKTOP[0] / pw, 1.0)
    ox = int(0.73 * DESKTOP[0] - pcx * s)
    oy = int(0.52 * DESKTOP[1] - pcy * s)
    d = compose(src, DESKTOP, s, (ox, oy), int(140 * s), ('l', 'r', 't', 'b'))

    # Mobile: product ~72% of width (stays uncropped on 9:19.5 phones, which
    # crop ~10% off each side of this 9:16 image), centred at 50% x / 30% y
    s = min(0.72 * MOBILE[0] / pw, 1.0)
    ox = int(0.5 * MOBILE[0] - pcx * s)
    oy = int(0.30 * MOBILE[1] - pcy * s)
    m = compose(src, MOBILE, s, (ox, oy), int(120 * s), ('l', 'r', 't', 'b'))
    return d, m, s


def build_scene(name, src, focus_x, m_zoom=1.2, m_shift_y=0.0):
    # Desktop: full height, flush right
    s = DESKTOP[1] / src.height
    sw = int(src.width * s)
    ox = DESKTOP[0] - sw
    d = compose(src, DESKTOP, s, (ox, 0), 220, ('l',))

    # Mobile: fill width with overscan (m_zoom), focus centred, flush top
    # (m_shift_y lifts the photo by that fraction of its height)
    s_m = (MOBILE[0] * m_zoom) / src.width
    sw_m, sh_m = int(src.width * s_m), int(src.height * s_m)
    ox_m = int(MOBILE[0] / 2 - focus_x * sw_m)
    ox_m = min(0, max(MOBILE[0] - sw_m, ox_m))
    oy_m = -int(m_shift_y * sh_m)
    m = compose(src, MOBILE, s_m, (ox_m, oy_m), 200, ('b',))
    print(f'  {name}: desktop scale {s:.3f}, mobile scale {s_m:.3f}')
    return d, m, max(s, s_m)


def save(img, name, variant, widths):
    for w in widths:
        h = round(img.height * w / img.width)
        im = img if w == img.width else img.resize((w, h), Image.LANCZOS)
        path = f'{OUT}/hero-{name}-{variant}-{w}.webp'
        im.save(path, 'WEBP', quality=80, method=6)
        print(f'    -> {path} ({os.path.getsize(path)//1024} KB)')


if __name__ == '__main__':
    for name, cfg in SLIDES.items():
        src = Image.open(cfg['src']).convert('RGB')
        if cfg['kind'] == 'product':
            d, m, s = build_product(name, src)
        else:
            d, m, s = build_scene(name, src, cfg['focus_x'],
                                  cfg.get('m_zoom', 1.2), cfg.get('m_shift_y', 0.0))
        print(f'  {name}: max source scale {s:.2f}x')
        save(d, name, 'desktop', DESKTOP_WIDTHS)
        save(m, name, 'mobile', MOBILE_WIDTHS)
