"""
Estimate rendered text contrast on the home hero for each slide.

Reproduces object-fit: cover + object-position for the hero image at several
viewports, applies the slide's overlay gradients (same stops as HeroSlider.tsx),
and reports the worst-case WCAG contrast of the subtext (white @ 85%) and
headline (white) inside the region where text actually sits.

Run from project root: python scratch/check_hero_contrast.py
"""
import numpy as np
from PIL import Image

INK = np.array([10, 10, 10], np.float32)

# Keep in sync with HERO_SLIDES[].overlay in src/components/HeroSlider.tsx
SLIDES = {
    'eyeglasses':     {'pos_d': (0.78, 0.5), 'pos_m': (0.5, 0.0), 'd': (0.86, 0.66, 0.0), 'm': (0.92, 0.80, 0.0)},
    'sunglasses':     {'pos_d': (0.78, 0.5), 'pos_m': (0.5, 0.0), 'd': (0.86, 0.66, 0.0), 'm': (0.92, 0.80, 0.0)},
    'clear-contacts': {'pos_d': (1.00, 0.5), 'pos_m': (0.5, 0.0), 'd': (0.84, 0.64, 0.0), 'm': (0.90, 0.76, 0.0)},
    'color-contacts': {'pos_d': (0.85, 0.5), 'pos_m': (0.5, 0.0), 'd': (0.84, 0.66, 0.0), 'm': (0.90, 0.76, 0.0)},
}
TOP_SCRIM = 0.50   # rgba(10,10,10,.5) at top -> 0 at 200px
BOTTOM = 0.35      # bottom fade for dots: .35 at bottom -> 0 at 30%


def srgb_to_lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lum(rgb):
    l = srgb_to_lin(rgb)
    return 0.2126 * l[..., 0] + 0.7152 * l[..., 1] + 0.0722 * l[..., 2]


def cover(img, vw, vh, pos):
    iw, ih = img.size
    s = max(vw / iw, vh / ih)
    rw, rh = int(round(iw * s)), int(round(ih * s))
    r = img.resize((rw, rh), Image.BILINEAR)
    ox = int(round((rw - vw) * pos[0]))
    oy = int(round((rh - vh) * pos[1]))
    return np.asarray(r.crop((ox, oy, ox + vw, oy + vh)), np.float32)


def gutter(vw):
    return min(max(20, 0.05 * vw), 64)


def container_left(vw):
    """--container-left in index.css: max(--gutter, (100% - 1440px) / 2)"""
    return max(gutter(vw), (vw - 1440) / 2)


def stops_alpha(t, stops, span=None):
    """stops = (a0 @0, a1 @mid, a2 @end); linear between, a2 beyond.
    Desktop (span=viewport width): mid = max(40%, 560px), end = max(70%, 880px),
    matching the CSS in HeroSlider.tsx. Mobile: mid 45%, end 75%."""
    a0, a1, a2 = stops
    if span:
        # desktopOverlay(): a0 @0, a1 @ left+640px, a1/2 @ +200px, 0 @ +440px
        te = container_left(span) + 640
        xs = [0, te / span, (te + 200) / span, (te + 440) / span, 10.0]
        return np.interp(t, xs, [a0, a1, a1 / 2, 0.0, 0.0])
    mid, end = 0.45, 0.75
    return np.interp(t, [0, mid, end, 1.0], [a0, a1, a2, a2])


def render(arr, vw, vh, stops, horizontal):
    ys, xs = np.mgrid[0:vh, 0:vw].astype(np.float32)
    if horizontal:
        a = stops_alpha(xs / vw, stops, vw)
    else:  # mobile: gradient runs from bottom upward
        a = stops_alpha((vh - ys) / vh, stops)
    out = arr * (1 - a[..., None]) + INK * a[..., None]
    # top scrim (for header) and bottom fade (dots), composited on top
    at = np.clip(1 - ys / 200.0, 0, 1) * TOP_SCRIM
    out = out * (1 - at[..., None]) + INK * at[..., None]
    ab = np.clip((ys - 0.7 * vh) / (0.3 * vh), 0, 1) * BOTTOM
    out = out * (1 - ab[..., None]) + INK * ab[..., None]
    return out


def contrast(fg_alpha, bg):
    fg = 255 * fg_alpha + bg * (1 - fg_alpha)
    l1, l2 = lum(fg), lum(bg)
    return (np.maximum(l1, l2) + 0.05) / (np.minimum(l1, l2) + 0.05)


def worst(img_out, box, fg_alpha):
    x0, y0, x1, y1 = box
    region = img_out[y0:y1, x0:x1]
    c = contrast(fg_alpha, region)
    return float(np.percentile(c, 1))  # ignore the odd grain pixel


VIEWPORTS = [  # (w, h, desktop?, unused)
    (2560, 1440, True, 0), (1920, 1080, True, 0), (1536, 864, True, 0), (1440, 900, True, 0),
    (1366, 768, True, 0), (1280, 720, True, 0), (1024, 768, True, 0),
    (390, 844, False, 0), (360, 740, False, 0),
]

if __name__ == '__main__':
    ok = True
    for name, cfg in SLIDES.items():
        d = Image.open(f'public/assets/hero/hero-{name}-desktop-1920.webp').convert('RGB')
        m = Image.open(f'public/assets/hero/hero-{name}-mobile-900.webp').convert('RGB')
        for vw, vh, desk, pad in VIEWPORTS:
            left = int(container_left(vw)); pad = int(gutter(vw))
            if desk:
                arr = cover(d, vw, vh, cfg['pos_d'])
                out = render(arr, vw, vh, cfg['d'], True)
                # vertically centred block ~ 40%..72% of height
                head = (left, int(vh * 0.36), left + min(620, int(0.50 * vw)), int(vh * 0.56))
                sub = (left, int(vh * 0.56), left + min(480, int(0.50 * vw)), int(vh * 0.66))
            else:
                arr = cover(m, vw, vh, cfg['pos_m'])
                out = render(arr, vw, vh, cfg['m'], False)
                # bottom-aligned block: text from ~45% to ~85% of height
                head = (pad, int(vh * 0.45), vw - pad, int(vh * 0.62))
                sub = (pad, int(vh * 0.62), vw - pad, int(vh * 0.74))
            ch, cs = worst(out, head, 1.0), worst(out, sub, 0.85)
            flag = '' if (cs >= 4.5 and ch >= 3.0) else '  <-- FAIL'
            ok &= not flag
            print(f'{name:15s} {vw}x{vh}: headline {ch:5.2f}:1   subtext {cs:5.2f}:1{flag}')
    print('ALL PASS' if ok else 'SOME FAIL')
