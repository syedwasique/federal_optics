import os
from PIL import Image

dir_path = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(dir_path))

for idx in [48, 49, 50, 51, 52, 53, 54, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]:
    f = files[idx]
    p = os.path.join(dir_path, f)
    im = Image.open(p)
    print(f"[{idx}] {f} {im.size}")
