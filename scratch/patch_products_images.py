import json
import os
import re

workspace = r'c:\Users\user\OneDrive\Desktop\federal optics'
prod_file = os.path.join(workspace, 'src', 'data', 'products.ts')
order_file = os.path.join(workspace, 'scratch', 'correct_lens_model_order.json')

with open(order_file, 'r', encoding='utf-8') as f:
    order_data = json.load(f)

order_by_dir = {}
for item in order_data:
    key = item['relDir'].lower().replace('\\', '/')
    order_by_dir[key] = item

with open(prod_file, 'r', encoding='utf-8') as f:
    prod_content = f.read()

guides = [
    "/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpeg"
]

updated_count = 0

def replace_images(match):
    global updated_count
    full_block = match.group(0)
    prefix = match.group(1) # up to images: [
    images_content = match.group(2) # inside brackets
    suffix = match.group(3) # ]
    
    # Extract current images
    current_imgs = re.findall(r'["\']([^"\']+)["\']', images_content)
    if not current_imgs:
        return full_block
    
    first_img = current_imgs[0].replace('\\', '/')
    img_dir = first_img.rsplit('/', 1)[0].lower()
    
    item = order_by_dir.get(img_dir)
    if not item:
        print(f"Warning: No order match for dir {img_dir}")
        return full_block
    
    # Construct ordered images:
    # 1. Lens
    # 2. Models
    # 3. Guides
    new_images = []
    lens_path = item['relDir'] + '/' + item['lens']
    new_images.append(lens_path)
    
    for m in item['models']:
        m_path = item['relDir'] + '/' + m
        if m_path not in new_images:
            new_images.append(m_path)
            
    for g in guides:
        if g not in new_images:
            new_images.append(g)
            
    # Format replacement
    lines = ['\n']
    for img in new_images:
        lines.append(f'      "{img}",\n')
    # Remove trailing comma on last item or keep standard format
    formatted_images = ''.join(lines).rstrip(',\n') + '\n    '
    
    updated_count += 1
    return f"{prefix}{formatted_images}{suffix}"

# Regex matching images array for contact lenses:
pattern = re.compile(r'((?:id:\s*["\'][^"\']+["\'].*?category:\s*["\']color-contacts["\'].*?|category:\s*["\']color-contacts["\'].*?id:\s*["\'][^"\']+["\'].*?)images:\s*\[)(.*?)(\])', re.DOTALL)

new_content = pattern.sub(replace_images, prod_content)

print(f"Total contact lens products updated: {updated_count}")

# Backup original
with open(prod_file + '.before_lens_reorder.bak', 'w', encoding='utf-8') as f:
    f.write(prod_content)

with open(prod_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Saved updated src/data/products.ts!")
