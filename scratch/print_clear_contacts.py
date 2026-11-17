import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'(id:\s*[\'"]cl-[^\'"]+[\'"][\s\S]*?name:\s*[\'"][^\'"]+[\'"][\s\S]*?images:\s*\[[\s\S]*?\])',
    re.MULTILINE
)

for m in pattern.finditer(text):
    print("-----------------------------------------")
    print(m.group(1))

