import re
from collections import defaultdict

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    full_text = f.read()

start_marker = "export const PRODUCTS: Product[] = ["
end_marker = "export function getProductById"

start_idx = full_text.find(start_marker)
end_idx = full_text.find(end_marker)

products_block = full_text[start_idx + len(start_marker):end_idx].rstrip()
if products_block.endswith("];"):
    products_block = products_block[:-2].rstrip()

# Parse products by brace counting
raw_products = []
depth = 0
current = []
in_string = False
string_char = ''
escape = False

for line in products_block.split('\n'):
    stripped = line.strip()
    if not in_string and stripped.startswith('//'):
        if depth > 0:
            current.append(line)
        continue
    
    for i, c in enumerate(line):
        if escape:
            escape = False
            continue
        if c == '\\':
            escape = True
            continue
        if c in ['"', "'", '`']:
            if not in_string:
                in_string = True
                string_char = c
            elif string_char == c:
                in_string = False
                string_char = ''
            continue
        if not in_string:
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                
    if depth > 0:
        current.append(line)
    elif depth == 0 and current:
        current.append(line)
        raw_products.append('\n'.join(current))
        current = []

print(f"Total raw products: {len(raw_products)}")

# Helper to extract a property value from raw text
def extract_prop(text, prop_name):
    # match prop_name: ...
    # handles string, number, boolean, array, object
    pattern = rf'{prop_name}:\s*([^\n,]+)'
    m = re.search(pattern, text)
    if m:
        return m.group(1).strip().strip('\'"')
    return None

def extract_string(text, prop_name):
    m = re.search(rf'{prop_name}:\s*[\'"]([^\'"]*)[\'"]', text)
    return m.group(1) if m else None

def extract_array(text, prop_name):
    m = re.search(rf'{prop_name}:\s*\[([\s\S]*?)\]', text)
    if not m:
        return []
    items = []
    for item in m.group(1).split(','):
        cleaned = item.strip().strip('\'" \n\r')
        if cleaned:
            items.append(cleaned)
    return items

delims = [' — ', ' – ', ' - ']

def parse_name(name):
    norm = name.replace('\\u2014', '—').replace('&mdash;', '—')
    for d in delims:
        if d in norm:
            parts = norm.split(d)
            return parts[0].strip(), parts[1].strip()
    return norm.strip(), ""

parsed_prods = []
for p in raw_products:
    pid = extract_string(p, 'id')
    name = extract_string(p, 'name')
    sku = extract_string(p, 'sku')
    category = extract_string(p, 'category')
    subCategory = extract_string(p, 'subCategory')
    gender = extract_string(p, 'gender')
    brand = extract_string(p, 'brand')
    price_s = extract_prop(p, 'price')
    price = int(price_s) if price_s and price_s.isdigit() else 0
    orig_price_s = extract_prop(p, 'originalPrice')
    orig_price = int(orig_price_s) if orig_price_s and orig_price_s.isdigit() else None
    images = extract_array(p, 'images')
    
    # color
    hex_m = re.search(r'hex:\s*[\'"]([^\'"]+)[\'"]', p)
    hex_val = hex_m.group(1) if hex_m else '#111111'
    cname_m = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', p[p.find('availableColors'):] if 'availableColors' in p else '')
    color_name = cname_m.group(1) if cname_m else ''
    
    base_name, var_name = parse_name(name)
    if not var_name:
        var_name = color_name or base_name
        
    parsed_prods.append({
        'raw': p,
        'id': pid,
        'name': name,
        'base_name': base_name,
        'variant_name': var_name,
        'sku': sku,
        'category': category,
        'subCategory': subCategory,
        'gender': gender,
        'brand': brand,
        'price': price,
        'originalPrice': orig_price,
        'images': images,
        'hex': hex_val,
        'color_name': color_name
    })

# Check groups
groups = defaultdict(list)
for p in parsed_prods:
    if p['category'] in ['eyeglasses', 'sunglasses', 'tint-eyeglasses']:
        key = (p['category'], p['brand'].strip(), p['base_name'].strip())
        groups[key].append(p)

multi_keys = {k for k, v in groups.items() if len(v) > 1}
print(f"Total multi groups: {len(multi_keys)}")

# Print preview of group 15 (Stepper Titanium Rectangle)
stepper_key = ('eyeglasses', 'STEPPER Germany', 'STEPPER Germany Titanium Rectangle')
if stepper_key in groups:
    items = groups[stepper_key]
    print(f"\nStepper group has {len(items)} items:")
    for it in items:
        print(f"  ID: {it['id']} | Variant: '{it['variant_name']}' | Hex: {it['hex']} | Imgs: {len(it['images'])}")

