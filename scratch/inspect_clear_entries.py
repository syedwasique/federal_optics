with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id:\s*[\'"](cl-[^\'"]+)[\'"],[\s\S]*?images:\s*\[([\s\S]*?)\]', text)
for pid, imgs in matches:
    print(f"Product: {pid}")
    lines = [l.strip() for l in imgs.strip().split('\n') if l.strip()]
    for l in lines:
        print(f"  {l}")

