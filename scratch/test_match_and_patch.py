import json
import os
import re

workspace = r'c:\Users\user\OneDrive\Desktop\federal optics'
prod_file = os.path.join(workspace, 'src', 'data', 'products.ts')
order_file = os.path.join(workspace, 'scratch', 'correct_lens_model_order.json')

with open(order_file, 'r', encoding='utf-8') as f:
    order_data = json.load(f)

with open(prod_file, 'r', encoding='utf-8') as f:
    prod_content = f.read()

# Build a lookup by directory path
order_by_dir = {}
for item in order_data:
    key = item['relDir'].lower().replace('\\', '/')
    order_by_dir[key] = item

print(f"Total order entries: {len(order_data)}")

# Find all contact lens product blocks in products.ts:
pattern = re.compile(r'(id:\s*["\']([^"\']+)["\'].*?category:\s*["\']color-contacts["\'].*?images:\s*\[)(.*?)(\])', re.DOTALL)

matches = list(pattern.finditer(prod_content))
print(f"Total color-contacts product blocks matched in products.ts: {len(matches)}")

matched_count = 0
for m in matches:
    p_id = m.group(2)
    images_block = m.group(3)
    imgs = re.findall(r'["\']([^"\']+)["\']', images_block)
    
    first_img = imgs[0].replace('\\', '/')
    img_dir = first_img.rsplit('/', 1)[0].lower()
    
    match = order_by_dir.get(img_dir)
    if match:
        matched_count += 1
    else:
        print(f"NO MATCH for {p_id} with dir: {img_dir}")

print(f"Matched {matched_count} / {len(matches)} products with order_data!")
