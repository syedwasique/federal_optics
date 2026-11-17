import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find sunglasses in products.ts
matches = re.findall(r"(\{[^{}]*category:\s*['\"]sunglasses['\"].*?\n  \})", text, re.DOTALL)
print(f"Total sunglasses in products.ts: {len(matches)}")
for m in matches[:6]:
    print(m[:250])
    print("...\n")

