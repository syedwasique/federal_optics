import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

local_imgs = re.findall(r"images:\s*\[\s*['\"](/[^\'\"]+)['\"]", text)
print(f"Total products using local images: {len(local_imgs)}")
for img in local_imgs[:10]:
    print(' ', img)

