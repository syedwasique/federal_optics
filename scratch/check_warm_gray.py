with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\{[^{}]*WARM GRAY.*?\n  \})', text, re.DOTALL)
for m in matches:
    print(m)

