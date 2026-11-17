import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r"brand:\s*['\"]Look Nice['\"].*?name:\s*['\"]([^'\"]+)['\"]", text, re.DOTALL)
print(f"Existing Look Nice products in products.ts: {len(matches)}")
for m in matches:
    print(" ", m)

