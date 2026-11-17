with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    c = f.read()
import re
m = re.search(r'id:\s*["\']opt-glm-amber-grey["\'].*?images:\s*\[(.*?)\]', c, re.DOTALL)
print(repr(m.group(1)))
