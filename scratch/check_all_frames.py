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
    r'price:\s*(\d+),',
    re.MULTILINE
)

items = []
for m in pattern.finditer(text):
    pid, name, sku, cat, brand, price = m.groups()
    if cat in ['eyeglasses', 'sunglasses', 'tint-eyeglasses']:
        items.append((pid, name, sku, cat, brand, int(price)))

print(f"Total eyeglass/sunglass products: {len(items)}")

# Let's inspect all items to see if any others share models
for pid, name, sku, cat, brand, price in sorted(items, key=lambda x: (x[3], x[4], x[1])):
    print(f"[{cat}] [{brand}] {pid} -> {name} (Rs. {price})")

