import os, json

# Parse products from src/data/products.ts
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

blocks = content.split('{\n    id: \'')[1:]

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #121212; color: #eee; margin: 0; padding: 20px; }
h1 { color: #f59e0b; margin-bottom: 20px; }
.category-block { margin-bottom: 40px; }
.cat-title { font-size: 22px; color: #60a5fa; border-bottom: 1px solid #333; padding-bottom: 8px; margin-bottom: 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 16px; }
.card { background: #1e1e1e; border: 1px solid #333; border-radius: 8px; padding: 14px; }
.card-header { margin-bottom: 10px; }
.prod-id { font-size: 11px; color: #888; font-family: monospace; }
.prod-name { font-size: 15px; font-weight: bold; color: #fff; margin: 2px 0; }
.prod-meta { font-size: 12px; color: #fbbf24; }
.imgs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; }
.img-wrap { flex: 1; min-width: 90px; max-width: 130px; text-align: center; }
.img-wrap img { width: 100%; height: 95px; object-fit: contain; background: #fff; border-radius: 4px; border: 1px solid #555; }
.img-label { font-size: 10px; color: #aaa; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
</head>
<body>
<h1>Catalog Multi-Angle Audit Gallery (All Products)</h1>
"""

current_cat = ""
for b in blocks:
    id_line = b.split("'")[0]
    # Name
    name_m = b.split("name: '")
    name = name_m[1].split("'")[0] if len(name_m) > 1 else ""
    # Brand
    brand_m = b.split("brand: '")
    brand = brand_m[1].split("'")[0] if len(brand_m) > 1 else ""
    # SubCategory
    sub_m = b.split("subCategory: \"")
    if len(sub_m) > 1:
        sub = sub_m[1].split("\"")[0]
    else:
        sub_m = b.split("subCategory: '")
        sub = sub_m[1].split("'")[0] if len(sub_m) > 1 else ""
    # Price
    price_m = b.split("price: ")
    price = price_m[1].split(",")[0] if len(price_m) > 1 else ""
    # Images
    imgs_m = b.split("images: [\n")
    if len(imgs_m) > 1:
        imgs_block = imgs_m[1].split("]")[0]
        imgs = [line.strip().strip("'\",") for line in imgs_block.splitlines() if line.strip().strip("'\",")]
    else:
        imgs = []

    if sub != current_cat:
        if current_cat != "":
            html += "</div></div>"
        current_cat = sub
        html += f"<div class='category-block'><div class='cat-title'>{current_cat}</div><div class='grid'>"

    html += f"""
    <div class="card">
      <div class="card-header">
        <div class="prod-id">{id_line}</div>
        <div class="prod-name">{name}</div>
        <div class="prod-meta">{brand} • Rs. {price} • {len(imgs)} images</div>
      </div>
      <div class="imgs-row">
    """
    for idx, img in enumerate(imgs):
        label = f"Angle {idx+1}"
        html += f"""
        <div class="img-wrap">
          <img src="{img}" loading="lazy" />
          <div class="img-label">{label}</div>
        </div>
        """
    html += "</div></div>"

html += "</div></div></body></html>"

with open('public/audit_gallery.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated public/audit_gallery.html successfully!")
