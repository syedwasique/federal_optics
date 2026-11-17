import os
from PIL import Image
import numpy as np

base = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(base))[:24]

# Let's inspect the shapes of the frames in images 0..23
# For each image, let's check:
# 1. Is there a double bridge (aviator)?
# 2. What is the aspect ratio of the lenses? (round aspect ~1.0, rect aspect ~1.3-1.6, aviator ~1.1-1.2 with top bar)
# 3. What color is the frame?

for idx, f in enumerate(files):
    p = os.path.join(base, f)
    img = Image.open(p).convert('RGB')
    arr = np.array(img)
    # Check if hand holding or on table
    # Check dark frame contour
    dark = (arr[:,:,0] < 100) & (arr[:,:,1] < 100) & (arr[:,:,2] < 100)
    ys, xs = np.where(dark)
    if len(ys) > 0:
        bw = xs.max() - xs.min()
        bh = ys.max() - ys.min()
        # Top 20% of frame for double bridge
        top_slice = dark[ys.min():ys.min() + int(bh*0.25), xs.min():xs.max()]
        # Mid bridge slice
        mid_x = (xs.min() + xs.max()) // 2
        bridge_slice = dark[ys.min():ys.max(), mid_x - int(bw*0.05):mid_x + int(bw*0.05)]
        has_double_bar = bridge_slice.sum(axis=1) > 0
        
        # Color of frame
        frame_color = arr[dark].mean(axis=0)
        print(f"[{idx:2d}] {f}")
        print(f"     Box {bw}x{bh} (aspect {bw/bh:.2f}) | Frame RGB: ({frame_color[0]:.0f}, {frame_color[1]:.0f}, {frame_color[2]:.0f})")
