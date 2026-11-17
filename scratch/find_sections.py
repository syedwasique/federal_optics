with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip().startswith('// =========================================='):
        print(f"Line {i+1}: {line.strip()}")
        if i + 1 < len(lines):
            print(f"  Next: {lines[i+1].strip()}")

