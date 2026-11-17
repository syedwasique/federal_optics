import os
from PIL import Image

dir_path = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(dir_path))[:24]

print(f"Inspecting first 24 images in {dir_path}:")
for idx, f in enumerate(files):
    p = os.path.join(dir_path, f)
    img = Image.open(p)
    print(f"[{idx:2d}] {f} ({img.size})")
