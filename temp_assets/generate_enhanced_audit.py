import os, json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('export const PRODUCTS')
arr_str = content[start_idx:]

raw_blocks = arr_str.split("{\n    id: '")
if len(raw_blocks) <= 1:
    raw_blocks = arr_str.split("{\n  id: '")

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
h1 { color: #f59e0b; margin-bottom: 24px; font-size: 26px; }
.category-block { margin-bottom: 50px; background: #1e293b; padding: 20px; border-radius: 12px; }
.cat-title { font-size: 22px; font-weight: bold; color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 10px; margin-bottom: 20px; }
.grid { display: flex; flex-direction: column; gap: 24px; }
.card { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 18px; }
.card-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; }
.prod-id { font-size: 13px; color: #94a3b8; font-family: monospace; }
.prod-name { font-size: 18px; font-weight: bold; color: #ffffff; }
.prod-meta { font-size: 13px; color: #fbbf24; font-weight: 500; }
.imgs-row { display: flex; gap: 14px; overflow-x: auto; padding: 4px 0 10px 0; }
.img-wrap { flex: 0 0 260px; background: #ffffff; border-radius: 8px; padding: 8px; text-align: center; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
.img-wrap img { width: 100%; height: 210px; object-fit: contain; }
.img-label { font-size: 11px; font-weight: bold; color: #0f172a; margin-top: 6px; }
.img-path { font-size: 10px; color: #64748b; margin-top: 2px; word-break: break-all; white-space: normal; }
</style>
</head>
<body>
<h1>Federal Optics \u2014 Multi-Angle Catalog Integrity Audit</h1>
"""

current_group = ""
for b in raw_blocks[1:]:
    pid = b.split("'")[0]
    
    def get_field(field):
        m = re.search(r'[\s,]' + field + r':\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]', b)
        return m.group(1) if m else ''
    
    name = get_field('name')
    brand = get_field('brand')
    category = get_field('category')
    subCategory = get_field('subCategory')
    
    # price
    price_m = re.search(r'price:\s*([0-9]+)', b)
    price = price_m.group(1) if price_m else ''
    
    # images
    m_imgs = re.search(r'images:\s*\[([\s\S]*?)\]', b)
    if m_imgs:
        imgs = [x.strip().strip("'\"") for x in m_imgs.group(1).split(',') if x.strip().strip("'\"")]
    else:
        imgs = []

    group_key = f"{category.upper()} \u2014 {brand} ({subCategory})"
    if group_key != current_group:
        if current_group != "":
            html += "</div></div>"
        current_group = group_key
        html += f"<div class='category-block'><div class='cat-title'>{current_group}</div><div class='grid'>"

    html += f"""
    <div class="card" id="{pid}">
      <div class="card-header">
        <div>
          <span class="prod-id">{pid}</span>
          <div class="prod-name">{name}</div>
        </div>
        <div class="prod-meta">Rs. {price} &bull; {len(imgs)} image(s)</div>
      </div>
      <div class="imgs-row">
    """
    for idx, img in enumerate(imgs):
        label = f"Angle {idx+1}"
        fname = os.path.basename(img)
        html += f"""
        <div class="img-wrap">
          <img src="{img}" loading="lazy" />
          <div class="img-label">{label}</div>
          <div class="img-path">{fname}</div>
        </div>
        """
    html += "</div></div>"

html += "</div></div></body></html>"

with open('public/audit_gallery.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated enhanced public/audit_gallery.html")
