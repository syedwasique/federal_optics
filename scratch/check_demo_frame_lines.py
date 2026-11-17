with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    for i, l in enumerate(f):
        if 'demo-frame' in l:
            print(f"{i+1}: {l.strip()}")

