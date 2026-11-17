import re
import os
import json
from PIL import Image

workspace = r'c:\Users\user\OneDrive\Desktop\federal optics'
prod_file = os.path.join(workspace, 'src', 'data', 'products.ts')
verified_file = os.path.join(workspace, 'scratch', 'verified_order.json')

with open(verified_file, 'r', encoding='utf-8') as f:
    verified_data = json.load(f)

# Note the 7 shades that were reversed in verified_order.json:
reversed_7 = [
    'BELLA DAIMOND GRAY GREEN',
    'BELLA DAIMOND MYSTERIOUS',
    'BELLA DAIMOND OAK',
    'BELLA DAIMOND WOOD STONE',
    'BELLA GLOW RS 4800 / HUSKY GRAY GREEN',
    'BELLA GLOW RS 4800 / LIME GREEN',
    'BELLA GLOW RS 4800 / RADIANT GRAY'
]

# Adjust verified_data for the 7 shades
for item in verified_data:
    # check if shade matches any in reversed_7
    for r in reversed_7:
        if r.split('/')[-1].strip().lower() in item['shade'].lower():
            # Swap lens and models[0]
            old_lens = item['lens']
            item['lens'] = item['models'][0]
            item['models'][0] = old_lens
            print(f"Fixed reversed shade: {item['shade']} -> Lens: {item['lens']}, Model: {item['models'][0]}")

# Save the corrected verified_order
with open(os.path.join(workspace, 'scratch', 'correct_lens_model_order.json'), 'w', encoding='utf-8') as f:
    json.dump(verified_data, f, indent=2)

print("Saved scratch/correct_lens_model_order.json")
