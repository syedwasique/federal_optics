import re
from collections import defaultdict

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('export const PRODUCTS')
arr_str = content[start_idx:]

raw_blocks = arr_str.split("{\n    id: '")
if len(raw_blocks) <= 1:
    raw_blocks = arr_str.split("{\n  id: '")

print(f"Raw blocks count: {len(raw_blocks)-1}")

products = []
for b in raw_blocks[1:]:
    pid = b.split("'")[0]
    
    def get_field(field):
        m = re.search(r'[\s,]' + field + r':\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]', b)
        return m.group(1) if m else ''
    
    name = get_field('name')
    brand = get_field('brand')
    category = get_field('category')
    subCategory = get_field('subCategory')
    
    # images
    m_imgs = re.search(r'images:\s*\[([\s\S]*?)\]', b)
    if m_imgs:
        imgs = [x.strip().strip("'\"") for x in m_imgs.group(1).split(',') if x.strip().strip("'\"")]
    else:
        imgs = []
    
    products.append({
        'id': pid,
        'name': name,
        'brand': brand,
        'category': category,
        'subCategory': subCategory,
        'images': imgs
    })

print(f"Parsed {len(products)} products.")

by_brand = defaultdict(list)
for p in products:
    by_brand[p['brand']].append(p)

for b, prods in sorted(by_brand.items()):
    print(f"\n=== {b} ({len(prods)} products) ===")
    for p in prods:
        print(f"  [{p['id']}] {p['name']} ({p['category']}/{p['subCategory']}) - {len(p['images'])} imgs")
        if len(p['images']) <= 4:
            for im in p['images']:
                print(f"      {im}")
        else:
            print(f"      {p['images'][0]} ... (+{len(p['images'])-1} more)")
