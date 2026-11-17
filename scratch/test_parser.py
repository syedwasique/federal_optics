import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    full_text = f.read()

# Let's write a parser that loads each product entry accurately
# We know PRODUCTS begins after "export const PRODUCTS: Product[] = ["
# and ends before "export function getProductById"
start_marker = "export const PRODUCTS: Product[] = ["
end_marker = "export function getProductById"

start_idx = full_text.find(start_marker)
end_idx = full_text.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

products_block = full_text[start_idx + len(start_marker):end_idx].rstrip()
# Strip the trailing "];"
if products_block.endswith("];"):
    products_block = products_block[:-2].rstrip()

print(f"Products block length: {len(products_block)}")

