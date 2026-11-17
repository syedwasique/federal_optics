import os, re
from PIL import Image

base = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(base))

# Let's inspect each group in 24..81
# Product mappings from trace_tr_sources:
groups = {
    'regular-tr90-navigator-matte-black': [24, 25, 26],
    'regular-tr90-rect-charcoal-smoke': [29, 28, 27],
    'regular-tr90-wayfarer-jet-black': [32, 31, 30],
    'regular-tr90-retro-round-amber-tortoise': [34, 35, 36, 33],
    'regular-tr90-streamline-pilot-black': [39, 38, 37],
    'regular-tr90-pantos-honey-crystal': [40, 43, 42, 41],
    'regular-tr90-exec-slim-matte-black': [45, 47, 44, 46],
    'regular-tr90-browline-hybrid-black': [48, 51, 49],
    'regular-tr90-pilot-metal-temple-black': [50, 54, 53, 52],
    'regular-tr90-square-sport-grip-black': [55, 56, 57, 58],
    'regular-tr90-urban-rectangle-midnight': [59, 60, 61, 62],
    'regular-tr90-contour-pilot-charcoal': [64, 65, 63],
    'regular-tr90-keyhole-round-dark-amber': [66, 67, 68],
    'regular-tr90-architectural-square-black': [69, 70, 71],
    'regular-tr90-aviator-wire-double-bridge': [73, 75, 72],
    'regular-tr90-classic-rectangle-deep-grey': [74, 76, 78],
    'regular-tr90-retro-horn-rim-amber-gold': [77, 80, 79, 81]
}

print("Checking groups in TR 24-81:")
for pid, idxs in groups.items():
    print(f"\n{pid}: indices {idxs}")
    for idx in idxs:
        f = files[idx]
        print(f"   [{idx:2d}] {f}")
