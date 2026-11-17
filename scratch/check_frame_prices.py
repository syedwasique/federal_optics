with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id:\s*[\'"](regular-tr90[^\'"]*|fo-we[^\'"]*|tomfamous[^\'"]*)[\'"],[\s\S]*?name:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?price:\s*(\d+)', text)
for m in matches[:10]:
    print(m)

