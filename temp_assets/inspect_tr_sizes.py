import os
from PIL import Image

folder = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(folder))

print(f"Total files in {folder}: {len(files)}")
for i in range(24):
    f = files[i]
    p = os.path.join(folder, f)
    img = Image.open(p)
    print(f"[{i:2d}] {f} | Size: {img.size}")
