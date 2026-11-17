import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'id:\s*[\'"](knight-horse[^\'"]*)[\'"],[\s\S]*?name:\s*[\'"]([^\'"]+)[\'"]', re.MULTILINE)
for m in pattern.finditer(text):
    print(m.group(1), "->", repr(m.group(2)))

