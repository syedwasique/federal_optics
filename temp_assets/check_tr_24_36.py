import os
from PIL import Image
import numpy as np

base = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(base))

# Check images 24 to 81
print(f"Total files: {len(files)}")
for i in range(24, min(36, len(files))):
    f = files[i]
    p = os.path.join(base, f)
    img = Image.open(p).convert('RGB')
    print(f"[{i:2d}] {f} ({img.size})")
