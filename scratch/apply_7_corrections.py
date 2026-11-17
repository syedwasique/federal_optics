import json
import os

workspace = r'c:\Users\user\OneDrive\Desktop\federal optics'
order_file = os.path.join(workspace, 'scratch', 'correct_lens_model_order.json')

with open(order_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Exact mapping for these 7 to ensure 100% precision:
corrections = {
    'BELLA DAIMOND GRAY GREEN': {
        'lens': 'WhatsApp Image 2026-10-17 at 10.37.58 PM.jpeg',
        'models': ['WhatsApp Image 2026-10-17 at 10.37.57 PM.jpeg']
    },
    'BELLA DAIMOND MYSTERIOUS': {
        'lens': 'WhatsApp Image 2026-10-17 at 10.37.57 PM (1).jpeg',
        'models': ['WhatsApp Image 2026-10-17 at 10.37.56 PM.jpeg', 'WhatsApp Image 2026-10-17 at 10.37.57 PM.jpeg']
    },
    'BELLA DAIMOND OAK': {
        'lens': 'WhatsApp Image 2026-10-17 at 10.37.59 PM.jpeg',
        'models': ['WhatsApp Image 2026-10-17 at 10.37.58 PM.jpeg', 'WhatsApp Image 2026-10-17 at 10.37.59 PM (1).jpeg']
    },
    'BELLA DAIMOND WOOD STONE': {
        'lens': 'WhatsApp Image 2026-10-17 at 10.50.10 PM.jpeg',
        'models': ['WhatsApp Image 2026-10-17 at 10.50.09 PM.jpeg']
    },
    'HUSKY GRAY GREEN': {
        'lens': 'WhatsApp Image 2026-10-17 at 4.25.18 PM (1).jpeg',
        'models': ['WhatsApp Image 2026-10-17 at 4.25.18 PM.jpeg']
    },
    'LIME GREEN': {
        'lens': 'WhatsApp Image 2026-10-17 at 4.31.33 PM.jpeg',
        'models': ['WhatsApp Image 2026-10-17 at 4.31.34 PM.jpeg']
    },
    'RADIANT GRAY': {
        'lens': 'WhatsApp Image 2026-10-17 at 4.34.28 PM (1).jpeg',
        'models': ['WhatsApp Image 2026-10-17 at 4.34.28 PM.jpeg']
    }
}

for item in data:
    for k, v in corrections.items():
        if k in item['shade']:
            item['lens'] = v['lens']
            item['models'] = v['models']
            print(f"Applied exact correction for {item['shade']}: Lens={v['lens']}")

with open(order_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated correct_lens_model_order.json successfully!")
