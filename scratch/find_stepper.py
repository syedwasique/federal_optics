with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(id:\s*[\'"][^\'"]*stepper[^\'"]*[\'"][\s\S]*?availableColors:\s*\[[\s\S]*?\])', text, re.IGNORECASE)
for m in matches:
    print("------------------------------------------")
    print(m[:500])

