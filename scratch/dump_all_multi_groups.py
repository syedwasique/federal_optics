import re
from collections import defaultdict

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

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

groups = defaultdict(list)
for p in products:
    if p['category'] in ['eyeglasses', 'sunglasses', 'tint-eyeglasses']:
        key = (p['category'], p['brand'].strip(), p['base_name'].strip())
        groups[key].append(p)

multi = {k: v for k, v in groups.items() if len(v) > 1}

print(f"Total multi-variant groups: {len(multi)}")
for i, ((cat, brand, base_name), items) in enumerate(multi.items(), 1):
    print(f"\nGroup {i}: [{cat}] '{brand}' - '{base_name}' ({len(items)} items)")
    for item in items:
        print(f"  - id: {item['id']} | name: {item['name']} | sku: {item['sku']}")

