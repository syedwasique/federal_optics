with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "'clear-contacts'" in line or "'accessories'" in line:
        print(f"Line {i+1}: {line.strip()}")

