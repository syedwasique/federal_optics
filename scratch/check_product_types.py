with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[:136]):
    print(f"{i+1}: {l}", end='')

