import re
from collections import defaultdict

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to extract product blocks
pattern = re.compile(
    r'id:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'name:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'sku:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'category:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?'
    r'brand:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?'
    r'price:\s*(\d+),[\s\S]*?'
    r'images:\s*\[([\s\S]*?)\][\s\S]*?'
    r'availableColors:\s*\[([\s\S]*?)\]',
    re.MULTILINE
)

products = []
delimiters = [' — ', ' – ', ' - ']

for match in pattern.finditer(text):
    pid = match.group(1)
    name = match.group(2)
    sku = match.group(3)
    category = match.group(4)
    brand = match.group(5)
    price = int(match.group(6))
    raw_images = match.group(7)
    raw_colors = match.group(8)
    
    images = [i.strip().strip('\'" ') for i in raw_images.split(',') if i.strip().strip('\'" ')]
    
    # Extract base name and variant name
    base_name = name
    variant_name = ""
    for d in delimiters:
        if d in name:
            parts = name.split(d)
            base_name = parts[0].strip()
            variant_name = parts[1].strip()
            break
            
    products.append({
        'id': pid,
        'name': name,
        'base_name': base_name,
        'variant_name': variant_name,
        'sku': sku,
        'category': category,
        'brand': brand,
        'price': price,
        'images': images,
        'raw_colors': raw_colors
    })

print(f"Total products parsed: {len(products)}")

# Group by category and base_name for eyeglasses and sunglasses only
groups = defaultdict(list)
for p in products:
    if p['category'] in ['eyeglasses', 'sunglasses', 'tint-eyeglasses']:
        # Group key: (category, brand.lower(), base_name.lower())
        key = (p['category'], p['brand'].strip().lower(), p['base_name'].strip().lower())
        groups[key].append(p)

multi_color_groups = {k: v for k, v in groups.items() if len(v) > 1}
single_groups = {k: v for k, v in groups.items() if len(v) == 1}

print(f"\nFound {len(multi_color_groups)} groups with multiple color models in eyeglasses/sunglasses:")
for (cat, brand, base_name), items in multi_color_groups.items():
    print(f"\n[{cat}] Brand: {brand} | Base: '{base_name}' ({len(items)} variants):")
    for item in items:
        print(f"   - {item['id']}: '{item['name']}' (var: '{item['variant_name']}', {len(item['images'])} imgs)")

