with open('src/pages/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in ProductDetailPage.tsx: {len(lines)}")
for i in range(15, 60):
    print(f"{i+1}: {lines[i]}", end="")

