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
    images = extract_array(p, 'images')
    
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
        'images': images,
        'hex': hex_val,
        'color_name': color_name
    })

groups = defaultdict(list)
for p in parsed_prods:
    if p['category'] in ['eyeglasses', 'sunglasses', 'tint-eyeglasses']:
        key = (p['category'], p['brand'].strip(), p['base_name'].strip())
        groups[key].append(p)

multi_keys = {k for k, v in groups.items() if len(v) > 1}

# Map each variant id in a multi group to its group key
variant_to_group = {}
for k in multi_keys:
    for item in groups[k]:
        variant_to_group[item['id']] = k

# Keep track of which group has already had its primary item emitted
emitted_groups = set()
new_products_list = []

for p in parsed_prods:
    pid = p['id']
    if pid not in variant_to_group:
        # Single product, keep as is
        new_products_list.append(p['raw'])
    else:
        grp_key = variant_to_group[pid]
        if grp_key in emitted_groups:
            # Skip subsequent variants, they are merged into the first
            continue
        emitted_groups.add(grp_key)
        
        # Build merged product
        variants = groups[grp_key]
        base_item = variants[0]
        
        # Aliases: all variant IDs except the main id
        aliases = [v['id'] for v in variants if v['id'] != base_item['id']]
        
        # Construct availableColors array with full images per color
        colors_ts = "[\n"
        for v in variants:
            v_imgs = ",\n        ".join([f"'{img}'" for img in v['images']])
            colors_ts += f"""      {{
        id: '{v['id']}',
        name: '{v['variant_name']}',
        hex: '{v['hex']}',
        sku: '{v['sku']}',
        image: '{v['images'][0] if v['images'] else ''}',
        images: [
          {v_imgs}
        ]
      }},
"""
        colors_ts += "    ]"
        
        aliases_ts = "[" + ", ".join([f"'{a}'" for a in aliases]) + "]"
        
        # Base images: default to first variant images
        base_imgs_ts = "[\n      " + ",\n      ".join([f"'{img}'" for img in base_item['images']]) + "\n    ]"
        
        # Base SKU
        base_sku = base_item['sku']
        for delim in ['-', '_']:
            parts = base_sku.rsplit(delim, 1)
            if len(parts) == 2 and (len(parts[1]) <= 3 or parts[1].isdigit()):
                base_sku = parts[0]
                break
                
        # Update raw block of base_item
        raw = base_item['raw']
        
        # Replace name
        raw = re.sub(r'name:\s*[\'"][^\'"]*[\'"]', f"name: '{base_item['base_name']}'", raw)
        # Replace sku
        raw = re.sub(r'sku:\s*[\'"][^\'"]*[\'"]', f"sku: '{base_sku}'", raw)
        
        # Add aliases right after id
        raw = re.sub(r'(id:\s*[\'"][^\'"]*[\'"],)', rf"\1\n    aliases: {aliases_ts},", raw)
        
        # Replace availableColors
        raw = re.sub(r'availableColors:\s*\[[\s\S]*?\],', f"availableColors: {colors_ts},", raw)
        
        # In description, mention colors if appropriate
        raw = re.sub(r'description:\s*[\'"]([^\'"]*)[\'"]', 
                     lambda m: f"description: '{m.group(1)} Available in {len(variants)} color finishes.'", raw)
        
        new_products_list.append(raw)

print(f"Original products: {len(parsed_prods)}")
print(f"Merged products: {len(new_products_list)}")
print(f"Emitted multi groups: {len(emitted_groups)}")

