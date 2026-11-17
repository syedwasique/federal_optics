import json

with open('scratch/correct_lens_model_order.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

targets = [
    'GRAY GREEN',
    'MYSTERIOUS',
    'OAK',
    'WOOD STONE',
    'HUSKY GRAY GREEN',
    'LIME GREEN',
    'RADIANT GRAY'
]

for item in data:
    for t in targets:
        if t in item['shade']:
            print(item['shade'])
            print("  Lens:", item['lens'])
            print("  Models:", item['models'])
