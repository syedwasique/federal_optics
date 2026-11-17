import os, re
from collections import defaultdict

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('export const PRODUCTS')
arr_str = text[start_idx:]

raw_blocks = arr_str.split("{\n    id: '")
if len(raw_blocks) <= 1:
    raw_blocks = arr_str.split("{\n  id: '")

with open('temp_assets/multi_img_audit_report.txt', 'w', encoding='utf-8') as out:
    for b in raw_blocks[1:]:
        pid = b.split("'")[0]
        
        def get_field(field):
            m = re.search(r'[\s,]' + field + r':\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]', b)
            return m.group(1) if m else ''
        
        name = get_field('name')
        brand = get_field('brand')
        category = get_field('category')
        subCategory = get_field('subCategory')
        
        m_imgs = re.search(r'images:\s*\[([\s\S]*?)\]', b)
        if m_imgs:
            imgs = [x.strip().strip("'\"") for x in m_imgs.group(1).split(',') if x.strip().strip("'\"")]
        else:
            imgs = []
        
        if len(imgs) > 1:
            out.write(f"[{brand}] {pid} - {name} ({len(imgs)} imgs)\n")
            for im in imgs:
                out.write(f"    {im}\n")
            out.write("\n")

print("Saved temp_assets/multi_img_audit_report.txt")
