with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines, 1):
    for prefix in ['rayban-ferrari-aviator', 'rayban-sun-aviator', 'rayban-sun-sami', 'rayban-sun-tr-pol', 'rayban-sun-round', 'rayban-sun-sheet', 'rayban-metal-wire', 'rayban-hex-metal']:
        if f"id: '{prefix}" in l or f'id: "{prefix}' in l:
            print(f"{i:4d}: {l.strip()}")
