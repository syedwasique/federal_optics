import os
from PIL import Image
import numpy as np

# Let's inspect the first 24 images by cropping the left and right lenses
# where text is printed, and checking if text exists, what text it is, etc.

base = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(base))[:24]

# Let's crop a patch around the left lens and right lens for each image and save them
crop_dir = 'temp_assets/tr_crops'
os.makedirs(crop_dir, exist_ok=True)

for idx, f in enumerate(files):
    p = os.path.join(base, f)
    img = Image.open(p).convert('RGB')
    w, h = img.size
    
    # Save a resized version for quick viewing
    thumb = img.resize((400, int(400 * h / w)))
    thumb.save(os.path.join(crop_dir, f"img_{idx:02d}.jpg"))

print(f"Saved 24 images to {crop_dir}")
