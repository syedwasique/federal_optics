import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    full_text = f.read()

start_marker = "export const PRODUCTS: Product[] = ["
end_marker = "export function getProductById"

start_idx = full_text.find(start_marker)
end_idx = full_text.find(end_marker)

products_block = full_text[start_idx + len(start_marker):end_idx].rstrip()
if products_block.endswith("];"):
    products_block = products_block[:-2].rstrip()

# Parse products by brace counting
products = []
depth = 0
current = []
in_string = False
string_char = ''
escape = False
comment_line = False

for line in products_block.split('\n'):
    stripped = line.strip()
    if not in_string and stripped.startswith('//'):
        # comment line outside product or inside product
        if depth > 0:
            current.append(line)
        continue
    
    # Process line chars
    for i, c in enumerate(line):
        if escape:
            escape = False
            continue
        if c == '\\':
            escape = True
            continue
        if c in ['"', "'", '`']:
            if not in_string:
                in_string = True
                string_char = c
            elif string_char == c:
                in_string = False
                string_char = ''
            continue
        if not in_string:
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                
    if depth > 0:
        current.append(line)
    elif depth == 0 and current:
        current.append(line)
        products.append('\n'.join(current))
        current = []

print(f"Extracted {len(products)} products!")
for i in [0, 1, 2, 100, 200, len(products)-1]:
    if i < len(products):
        id_m = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', products[i])
        print(f"Product {i}: id={id_m.group(1) if id_m else 'NONE'}")

