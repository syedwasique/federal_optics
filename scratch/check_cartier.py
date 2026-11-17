with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(id:\s*[\'"]sg-crt-01[\'"][\s\S]*?availableColors:\s*\[[\s\S]*?\])', text)
for m in matches:
    print(m)

