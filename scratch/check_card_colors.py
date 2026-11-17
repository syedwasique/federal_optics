with open('src/components/ProductCard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[125:190]):
    print(f"{i+126}: {l}", end='')

