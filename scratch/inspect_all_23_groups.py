import re
from collections import defaultdict
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to extract each product object
pattern = re.compile(
    r'(\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'name:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'sku:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'category:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?'
    r'brand:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?'
    r'price:\s*(\d+),[\s\S]*?'
    r'images:\s*\[([\s\S]*?)\][\s\S]*?'
    r'availableColors:\s*\[([\s\S]*?)\][\s\S]*?\n\s*\})',
    re.MULTILINE
)

products = []

for match in pattern.finditer(text):
    full_block = match.group(1)
    pid = match.group(2)
    name = match.group(3)
    sku = match.group(4)
    category = match.group(5)
    brand = match.group(6)
    price = int(match.group(7))
    raw_images = match.group(8)
    raw_colors = match.group(9)
    
    images = [i.strip().strip('\'" ') for i in raw_images.split(',') if i.strip().strip('\'" ')]
    
    # parse hex from raw_colors
    hex_match = re.search(r'hex:\s*[\'"]([^\'"]+)[\'"]', raw_colors)
    hex_val = hex_match.group(1) if hex_match else '#000000'
    
    color_name_match = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', raw_colors)
    color_name_val = color_name_match.group(1) if color_name_match else ''
    
    norm_name = name.replace('\\u2014', '—').replace('&mdash;', '—')
    delims = [' — ', ' – ', ' - ']
    base_name = norm_name
    variant_name = color_name_val
    for d in delims:
        if d in norm_name:
            parts = norm_name.split(d)
            base_name = parts[0].strip()
            if not variant_name:
                variant_name = parts[1].strip()
            break
            
    products.append({
        'id': pid,
        'name': norm_name,
        'base_name': base_name,
        'variant_name': variant_name,
        'sku': sku,
        'category': category,
        'brand': brand,
        'price': price,
        'images': images,
        'hex': hex_val,
        'color_name': color_name_val,
        'block': full_block
    })

groups = defaultdict(list)
for p in products:
    if p['category'] in ['eyeglasses', 'sunglasses', 'tint-eyeglasses']:
        key = (p['category'], p['brand'].strip(), p['base_name'].strip())
        groups[key].append(p)

multi = {k: v for k, v in groups.items() if len(v) > 1}

print(f"Total multi groups: {len(multi)}\n")
for i, ((cat, brand, base_name), items) in enumerate(sorted(multi.items(), key=lambda x: (x[0][0], x[0][1], x[0][2])), 1):
    print(f"=== Group {i}: [{cat}] '{brand}' - '{base_name}' ===")
    print(f"Price: Rs. {items[0]['price']} | Count: {len(items)} variants")
    for it in items:
        print(f"  - Var: '{it['variant_name']}' | Hex: '{it['hex']}' | SKU: {it['sku']} | ID: {it['id']} | Imgs ({len(it['images'])})")
    print()

