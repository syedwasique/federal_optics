with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for pid in ['regular-tr90-pilot-tomfamous-black', 'regular-tr90-pilot-matte-charcoal', 'regular-tr90-pilot-gloss-black', 'regular-tr90-retro-round-amber-tortoise', 'fo-we101']:
    target = f"id: '{pid}'"
    idx = text.find(target)
    if idx != -1:
        print(f"=== {pid} ===")
        print(text[idx-10:idx+600])
