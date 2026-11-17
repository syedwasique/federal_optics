with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Let's inspect where ',,' appears
for m in re.finditer(r',[\s\n\r]*,', text):
    start = max(0, m.start() - 40)
    end = min(len(text), m.end() + 40)
    print("Found comma sequence at position", m.start())
    print(repr(text[start:end]))

