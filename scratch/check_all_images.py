import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'id:\s*[\'"]([^\'"]+)[\'"],\s*'
    r'name:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?'
    r'category:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?'
    r'images:\s*\[([\s\S]*?)\]',
    re.MULTILINE
)

single_image_prods = []
multi_image_prods = []

for match in pattern.finditer(text):
    pid = match.group(1)
    name = match.group(2)
    cat = match.group(3)
    raw_imgs = match.group(4)
    imgs = [i.strip().strip('\'" ') for i in raw_imgs.split(',') if i.strip().strip('\'" ')]
    
    # check if any images are generic guides or the transparent lens placeholder
    generic_imgs = [img for img in imgs if 'use this image wuth every transparent' in img or 'contact-lens-guides' in img]
    real_imgs = [img for img in imgs if 'use this image wuth every transparent' not in img and 'contact-lens-guides' not in img]
    
    if len(real_imgs) == 1:
        single_image_prods.append((pid, name, cat, len(real_imgs), len(imgs), imgs[0]))
    else:
        multi_image_prods.append((pid, name, cat, len(real_imgs), len(imgs)))

print(f"Total single-real-image products: {len(single_image_prods)}")
for p in single_image_prods:
    print(f"[{p[2]}] {p[0]}: {p[1]} (real: {p[3]}, total: {p[4]}) -> {p[5]}")

