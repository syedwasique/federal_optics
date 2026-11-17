with open('src/components/ProductCard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[190:235]):
    print(f"{i+191}: {l}", end='')

