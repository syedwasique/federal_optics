import os
import json
from generate_sunglasses_patch import sunglasses_products

# Function to format a product dict into clean TypeScript code
def format_ts_product(p):
    lines = ["  {"]
    lines.append(f"    id: '{p['id']}',")
    name_escaped = p['name'].replace("'", "\\'")
    lines.append(f"    name: '{name_escaped}',")
    lines.append(f"    sku: '{p['sku']}',")
    lines.append(f"    category: '{p['category']}',")
    lines.append(f"    subCategory: \"{p['subCategory']}\",")
    lines.append(f"    gender: '{p['gender']}',")
    brand_escaped = p['brand'].replace("'", "\\'")
    lines.append(f"    brand: '{brand_escaped}',")
    lines.append(f"    price: {p['price']},")
    lines.append(f"    originalPrice: {p['originalPrice']},")
    lines.append(f"    rating: {p['rating']},")
    lines.append(f"    reviewCount: {p['reviewCount']},")
    lines.append("    images: [")
    for img in p['images']:
        lines.append(f"      '{img}',")
    lines.append("    ],")
    desc_escaped = p['description'].replace("'", "\\'")
    lines.append(f"    description: '{desc_escaped}',")
    lines.append("    features: [")
    for feat in p['features']:
        f_esc = feat.replace("'", "\\'")
        lines.append(f"      '{f_esc}',")
    lines.append("    ],")
    lines.append(f"    inStock: {str(p['inStock']).lower()},")
    lines.append(f"    isNew: {str(p['isNew']).lower()},")
    lines.append(f"    isBestSeller: {str(p['isBestSeller']).lower()},")
    lines.append(f"    frameShape: '{p['frameShape']}',")
    mat_escaped = p['frameMaterial'].replace("'", "\\'")
    lines.append(f"    frameMaterial: '{mat_escaped}',")
    lines.append(f"    rimType: '{p['rimType']}',")
    lines.append(f"    frameSize: '{p['frameSize']}',")
    lines.append("    measurements: {")
    lines.append(f"      lensWidth: {p['measurements']['lensWidth']},")
    lines.append(f"      bridgeWidth: {p['measurements']['bridgeWidth']},")
    lines.append(f"      templeLength: {p['measurements']['templeLength']},")
    lines.append(f"      frameWeight: '{p['measurements']['frameWeight']}'")
    lines.append("    },")
    lines.append("    availableColors: [")
    for col in p['availableColors']:
        c_name = col['name'].replace("'", "\\'")
        lines.append(f"      {{ name: '{c_name}', hex: '{col['hex']}' }}")
    lines.append("    ],")
    lines.append("    reviews: []")
    lines.append("  },")
    return "\n".join(lines)

def update_product_images(content, prod_id, new_images):
    id_marker = f"id: '{prod_id}',"
    id_pos = content.find(id_marker)
    if id_pos == -1:
        raise ValueError(f"Could not find {prod_id}")
    img_start = content.find("images: [", id_pos)
    img_end = content.find("],", img_start) + 2
    new_img_lines = ["images: ["]
    for img in new_images:
        new_img_lines.append(f"      '{img}',")
    new_img_lines.append("    ],")
    new_img_block = "\n".join(new_img_lines)
    return content[:img_start] + new_img_block + content[img_end:]

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    updated_content = f.read()

# 1. Update Eyeglasses Wire & Hexagonal Images
eyeglass_updates = {
    'rayban-metal-wire-arista-gold': [
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.53 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.54 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.55 PM.jpeg',
    ],
    'rayban-metal-wire-pewter-silver': [
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.56 PM (1).jpeg',
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.56 PM (2).jpeg',
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.56 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.57 PM (1).jpeg',
    ],
    'rayban-metal-wire-satin-black': [
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.58 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.59 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.59 PM (1).jpeg',
    ],
    'rayban-hex-metal-arista-gold': [
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.35 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.36 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.37 PM (1).jpeg',
    ],
    'rayban-hex-metal-chrome-silver': [
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.37 PM (2).jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.37 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.38 PM (1).jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.38 PM (2).jpeg',
    ],
    'rayban-hex-metal-matte-gunmetal': [
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.38 PM (3).jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.39 PM.jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.40 PM (1).jpeg',
        '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.40 PM.jpeg',
    ],
}

for pid, imgs in eyeglass_updates.items():
    updated_content = update_product_images(updated_content, pid, imgs)
print("Updated all 6 eyeglass metal wire/hexagonal products successfully.")

# 2. Find Sunglasses Section Start & End
sunglasses_start_marker = "  {\n    id: 'rayban-sun-aviator-hybrid-black-gold',"
sunglasses_end_marker = "  {\n    id: 'dita-solid-noir-black',"

start_idx = updated_content.find(sunglasses_start_marker)
end_idx = updated_content.find(sunglasses_end_marker)

assert start_idx != -1, "Could not find start of sunglasses section"
assert end_idx != -1, "Could not find end of sunglasses section (DITA start)"

# Build the new sunglasses code
sunglasses_ts_code = "\n".join([format_ts_product(p) for p in sunglasses_products]) + "\n"

# Replace the block
new_content = updated_content[:start_idx] + sunglasses_ts_code + updated_content[end_idx:]

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully written updated src/data/products.ts!")
