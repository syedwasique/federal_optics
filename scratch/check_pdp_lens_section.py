with open('src/pages/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[435:515]):
    print(f"{i+436}: {l}", end='')

