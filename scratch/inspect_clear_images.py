import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find all clear-contacts products
pattern = re.compile(r'(\{\s*id:\s*["\'](cl-[^"\']+)["\'].*?category:\s*["\']clear-contacts["\'].*?\n  \})', re.DOTALL)
matches = pattern.findall(text)

print(f"Total clear-contacts found: {len(matches)}")
for block, pid in matches:
    name_m = re.search(r'name:\s*["\']([^"\']+)["\']', block)
    name = name_m.group(1) if name_m else pid
    imgs_m = re.search(r'images:\s*\[(.*?)\]', block, re.DOTALL)
    imgs = []
    if imgs_m:
        imgs = re.findall(r'["\']([^"\']+)["\']', imgs_m.group(1))
    print(f"\nID: {pid} | Name: {name}")
    print(f"  Total images: {len(imgs)}")
    for i, img in enumerate(imgs):
        print(f"    [{i}] {img}")

