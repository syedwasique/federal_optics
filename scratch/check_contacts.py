import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'id:\s*[\'\"](cl-[^\'\"]+)[\'\"],[\s\S]*?name:\s*[\'\"]([^\'\"]+)[\'\"],[\s\S]*?images:\s*\[([\s\S]*?)\]', re.MULTILINE)
for match in pattern.finditer(text):
    pid = match.group(1)
    name = match.group(2)
    raw_imgs = match.group(3)
    imgs = [i.strip().strip('\'" ') for i in raw_imgs.split(',') if i.strip().strip('\'" ')]
    print(f"{pid}: {name} -> {len(imgs)} images:")
    for img in imgs:
        print(f"   - {img}")
