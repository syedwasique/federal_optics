with open('src/pages/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[40:85]):
    print(f"{i+41}: {l}", end='')

print("\n--- COLOR SELECTION IN PDP ---\n")
for i, l in enumerate(lines):
    if 'selectedColor' in l or 'availableColors' in l:
        for j in range(max(0, i - 2), min(len(lines), i + 20)):
            print(f"{j+1}: {lines[j]}", end='')
        print("\n" + "="*40 + "\n")

