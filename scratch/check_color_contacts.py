import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'id:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'name:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?'
    r'category:\s*[\'"]color-contacts[\'"],[\s\S]*?'
    r'images:\s*\[([\s\S]*?)\]',
    re.MULTILINE
)

matches = list(pattern.finditer(text))
print(f"Found {len(matches)} color contact products:")
for m in matches[:5]:
    pid = m.group(1)
    name = m.group(2)
    raw_imgs = m.group(3)
    imgs = [i.strip().strip('\'" ') for i in raw_imgs.split(',') if i.strip().strip('\'" ')]
    print(f"{pid}: {name} -> {len(imgs)} images:")
    for img in imgs:
        print(f"   - {img}")

