import re, json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect the exact lines for the target products in src/data/products.ts
targets = [
    'rayban-ferrari-aviator',
    'rayban-sun-aviator-hybrid',
    'rayban-sun-aviator-wire',
    'rayban-sun-sami-sq',
    'rayban-sun-tr-pol',
    'rayban-sun-round',
    'rayban-sun-sheet',
    'rayban-metal-wire',
    'rayban-hex-metal'
]

for t in targets:
    count = len(re.findall(r'id:\s*[\x27\x22]' + t, text))
    print(f"{t}: {count} occurrences")
