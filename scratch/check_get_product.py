with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'function getProductById[\s\S]{1,300}', text)
for m in matches:
    print(m)

