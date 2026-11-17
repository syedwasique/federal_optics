import os, re
from collections import defaultdict

with open('temp_assets/multi_img_audit_report.txt', 'r', encoding='utf-8') as f:
    text = f.read()

entries = text.split('\n\n')
print(f"Total multi-image products in report: {len(entries)-1}")

prods_by_brand = defaultdict(list)
for e in entries:
    if not e.strip():
        continue
    lines = e.strip().split('\n')
    header = lines[0]
    brand = header.split(']')[0].lstrip('[')
    pid = header.split(']')[1].split('-')[0].strip()
    full_id = header.split(']')[1].split()[0]
    imgs = [l.strip() for l in lines[1:]]
    prods_by_brand[brand].append({
        'header': header,
        'pid': full_id,
        'imgs': imgs
    })

for brand, prods in sorted(prods_by_brand.items()):
    print(f"{brand}: {len(prods)} products")
