with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Fix ",,\n" -> ",\n"
# Also ",," with spaces
while re.search(r',[\s\n\r]*,', text):
    text = re.sub(r',[\s\n\r]*,', ',\n  ', text)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed double commas!")

