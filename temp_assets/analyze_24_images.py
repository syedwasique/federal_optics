import os
from PIL import Image
import numpy as np

base = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(base))[:24]

for idx, f in enumerate(files):
    p = os.path.join(base, f)
    img = Image.open(p).convert('RGB')
    arr = np.array(img)
    # Check dimensions
    w, h = img.size
    
    # Check dark frame pixels
    dark = (arr[:,:,0] < 120) & (arr[:,:,1] < 120) & (arr[:,:,2] < 120)
    ys, xs = np.where(dark)
    if len(ys) > 0:
        ymin, ymax = ys.min(), ys.max()
        xmin, xmax = xs.min(), xs.max()
        bw, bh = xmax - xmin, ymax - ymin
        # Center of frame
        center_patch = arr[int(ymin + bh*0.3):int(ymin + bh*0.7), int(xmin + bw*0.3):int(xmin + bw*0.7)]
        cp_dark = center_patch.mean(axis=(0,1))
        # Color of frame
        dark_pixels = arr[dark]
        avg_dark = dark_pixels.mean(axis=0)
        print(f"[{idx:2d}] {f}")
        print(f"     Box: {bw}x{bh} (aspect {bw/bh:.2f}) | Avg Frame RGB: ({avg_dark[0]:.0f}, {avg_dark[1]:.0f}, {avg_dark[2]:.0f})")
    else:
        print(f"[{idx:2d}] {f} - No dark detected")
