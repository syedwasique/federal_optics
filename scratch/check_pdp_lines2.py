with open('src/pages/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(340, 410):
    print(f"{i+1}: {lines[i]}", end="")

