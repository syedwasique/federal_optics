with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Check for ",," or ", ," or undefined in PRODUCTS
m = re.search(r'export const PRODUCTS: Product\[\] = \[([\s\S]*?)\n\];', text)
if m:
    content = m.group(1)
    # check for double commas
    if ',,' in content:
        print("Found double comma!")
    # check for undefined
    if 'undefined' in content:
        print("Found undefined literal!")
    
    # Let's check lines around line 184
    lines = text.split('\n')
    for i in range(175, 200):
        if i < len(lines):
            print(f"{i+1}: {lines[i]}")

