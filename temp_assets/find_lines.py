with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines, 1):
    if "id: 'regular-tr90-" in l:
        print(f"{i}: {l.strip()}")
