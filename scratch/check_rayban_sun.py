import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r"(\{[^{}]*id:\s*['\"]rayban-sun-aviator-hybrid-black-gold['\"].*?\n  \})", text, re.DOTALL)
if m:
    print(m.group(1))

