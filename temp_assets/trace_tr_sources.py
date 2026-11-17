import os, re
from PIL import Image

base = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(base))

# Load products from products.ts
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's see which product uses which image from TR FRAMES
# Check products that have images from /assets/images/eyeglasses/regular-tr90-*
import hashlib

def get_hash(path):
    with open(path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

tr_hashes = {get_hash(os.path.join(base, f)): (i, f) for i, f in enumerate(files)}

# Get regular-tr90 products
prods = re.findall(r'(\{\s*id:\s*[\x27\x22](regular-tr90[^\x27\x22]+)[\x27\x22][\s\S]*?images:\s*\[([\s\S]*?)\])', text)

print(f"Total regular-tr90 products: {len(prods)}")
for full, pid, imgs_str in prods:
    imgs = [x.strip().strip("'\"") for x in imgs_str.split(',') if x.strip()]
    matched_indices = []
    for im in imgs:
        asset_p = os.path.join('public', im.lstrip('/'))
        if os.path.exists(asset_p):
            h = get_hash(asset_p)
            if h in tr_hashes:
                idx, fname = tr_hashes[h]
                matched_indices.append((idx, fname))
            else:
                matched_indices.append((-1, 'no-hash-match'))
        else:
            matched_indices.append((-2, 'missing-file'))
    print(f"\n[{pid}]")
    for (idx, fname), im in zip(matched_indices, imgs):
        print(f"   [{idx:2d}] {fname} -> {im}")
