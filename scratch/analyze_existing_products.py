import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_prod = {}
products = []
in_prod = False
depth = 0

for line in lines:
    stripped = line.strip()
    if stripped.startswith('//') or not stripped:
        continue
    if stripped.startswith('{') and ('id:' in line or (len(products) == 0 and 'id:' in lines[lines.index(line)+1])):
        current_prod = {}
    m_id = re.search(r"id:\s*['\"]([^'\"]+)['\"]", stripped)
    if m_id: current_prod['id'] = m_id.group(1)
    m_name = re.search(r"name:\s*['\"]([^'\"]+)['\"]", stripped)
    if m_name: current_prod['name'] = m_name.group(1)
    m_sku = re.search(r"sku:\s*['\"]([^'\"]+)['\"]", stripped)
    if m_sku: current_prod['sku'] = m_sku.group(1)
    m_cat = re.search(r"category:\s*['\"]([^'\"]+)['\"]", stripped)
    if m_cat: current_prod['category'] = m_cat.group(1)
    m_sub = re.search(r"subCategory:\s*['\"]([^'\"]+)['\"]", stripped)
    if m_sub: current_prod['subCategory'] = m_sub.group(1)
    m_brand = re.search(r"brand:\s*['\"]([^'\"]+)['\"]", stripped)
    if m_brand: current_prod['brand'] = m_brand.group(1)
    m_price = re.search(r"price:\s*(\d+)", stripped)
    if m_price: current_prod['price'] = int(m_price.group(1))
    
    if stripped.startswith('},') and 'id' in current_prod and 'category' in current_prod:
        products.append(current_prod)
        current_prod = {}

print(f"Total products parsed: {len(products)}")
by_cat = {}
for p in products:
    c = p.get('category', 'unknown')
    by_cat.setdefault(c, []).append(p)

for c, plist in by_cat.items():
    print(f"\nCategory: {c} ({len(plist)} items)")
    brands = set(p.get('brand', '') for p in plist)
    print(f"  Brands: {brands}")
    for p in plist[:5]:
        print(f"    - [{p.get('sku')}] {p.get('name')} (Rs. {p.get('price')})")

