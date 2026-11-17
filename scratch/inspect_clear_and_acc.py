import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find where clear-contacts and accessories are in the file
for match in re.finditer(r"category:\s*'(clear-contacts|accessories)'", text):
    start = max(0, match.start() - 200)
    end = min(len(text), match.end() + 600)
    print("=" * 60)
    print(text[start:end])

