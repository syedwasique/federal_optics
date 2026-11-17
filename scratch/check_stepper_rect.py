import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect stepper-rect to see the full structure
match = re.search(r'id:\s*[\'"]stepper-rect-classic-matte-black[\'"][\s\S]*?\n  \},', text)
if match:
    print(match.group(0))

