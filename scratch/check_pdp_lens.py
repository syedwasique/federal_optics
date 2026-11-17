with open('src/pages/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'LENS_PACKAGE_OPTIONS' in l or 'SELECT LENS TECHNOLOGY' in l or 'selectedLens' in l:
        for j in range(max(0, i - 5), min(len(lines), i + 35)):
            print(f"{j+1}: {lines[j]}", end='')
        print("\n--- NEXT ---\n")

