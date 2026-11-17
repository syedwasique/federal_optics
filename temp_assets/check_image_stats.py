import os, re
from PIL import Image
import numpy as np

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('export const PRODUCTS')
arr_str = text[start_idx:]

raw_blocks = arr_str.split("{\n    id: '")
if len(raw_blocks) <= 1:
    raw_blocks = arr_str.split("{\n  id: '")

# For each product, let's inspect the average color / luminance of the images
# To check if an image in a group is completely different color (e.g. black frame vs transparent or tortoise)

def analyze_img(path):
    full_path = os.path.join('public', path.lstrip('/'))
    if not os.path.exists(full_path):
        return None
    try:
        im = Image.open(full_path).convert('RGB')
        im_small = im.resize((100, 100))
        arr = np.array(im_small)
        # Check central region (where frame usually sits)
        center = arr[25:75, 25:75]
        mean_rgb = center.mean(axis=(0, 1))
        # Check dark pixels proportion (frame rim)
        dark_mask = (center[:,:,0] < 80) & (center[:,:,1] < 80) & (center[:,:,2] < 80)
        dark_prop = dark_mask.mean()
        return {
            'mean_rgb': mean_rgb,
            'dark_prop': dark_prop,
            'size': im.size
        }
    except Exception as e:
        return None

print("Checking color / silhouette consistency across multi-image products...")
for b in raw_blocks[1:]:
    pid = b.split("'")[0]
    
    m_imgs = re.search(r'images:\s*\[([\s\S]*?)\]', b)
    if not m_imgs:
        continue
    imgs = [x.strip().strip("'\"") for x in m_imgs.group(1).split(',') if x.strip().strip("'\"")]
    if len(imgs) <= 1:
        continue
    
    # Analyze all images of this product
    stats = [analyze_img(im) for im in imgs]
    if any(s is None for s in stats):
        print(f"Missing image file in product: {pid}")
        continue

print("All image files exist on disk!")
