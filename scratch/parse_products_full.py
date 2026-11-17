import re
from collections import defaultdict

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to extract individual product blocks
prod_blocks = []
# split text into product blocks within PRODUCTS array
m = re.search(r'export const PRODUCTS: Product\[\] = \[([\s\S]*?)\n\];', text)
if not m:
    print("Could not find PRODUCTS array")
    exit(1)

products_content = m.group(1)

# Find each object: { id: ... },
# We can find each object by searching for `{ id:` up to `},\n  {` or `}\n];`
lines = products_content.split('\n')
curr_obj = []
in_obj = False
objects = []

for line in lines:
    if re.match(r'^\s*\{\s*$', line) or re.match(r'^\s*\{\s*id:', line):
        if curr_obj:
            objects.append('\n'.join(curr_obj))
            curr_obj = []
        in_obj = True
        curr_obj.append(line)
    elif in_obj:
        curr_obj.append(line)
        if re.match(r'^\s*\},?\s*$', line) and not any(k in line for k in ['measurements', 'packOptions', 'reviews', 'availableColors']):
            # check bracket depth
            block_text = '\n'.join(curr_obj)
            # count opening vs closing braces
            opens = block_text.count('{')
            closes = block_text.count('}')
            if opens == closes:
                objects.append(block_text)
                curr_obj = []
                in_obj = False

if curr_obj:
    objects.append('\n'.join(curr_obj))

print(f"Extracted {len(objects)} raw product objects")

# Parse each product
parsed = []
for obj in objects:
    pid_m = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', obj)
    name_m = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', obj)
    cat_m = re.search(r'category:\s*[\'"]([^\'"]+)[\'"]', obj)
    brand_m = re.search(r'brand:\s*[\'"]([^\'"]+)[\'"]', obj)
    price_m = re.search(r'price:\s*(\d+)', obj)
    if pid_m and name_m and cat_m and brand_m:
        pid = pid_m.group(1)
        name = name_m.group(1).replace('\\u2014', '—').replace('&mdash;', '—')
        cat = cat_m.group(1)
        brand = brand_m.group(1)
        price = int(price_m.group(1)) if price_m else 0
        parsed.append({
            'id': pid,
            'name': name,
            'category': cat,
            'brand': brand,
            'price': price,
            'raw': obj
        })

print(f"Parsed {len(parsed)} products successfully.")

