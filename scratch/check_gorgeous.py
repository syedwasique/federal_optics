import json
with open('scratch/correct_lens_model_order.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

gorgeous = [x for x in d if 'gorgeous' in x.get('collection', '').lower() or 'gorgeous' in x.get('shade', '').lower() or 'gorgeous' in x.get('relDir', '').lower()]
print(f"Gorgeous items in correct_lens_model_order.json: {len(gorgeous)}")
for g in gorgeous:
    print(g)

