import os, re

with open('temp_assets/multi_img_audit_report.txt', 'r', encoding='utf-8') as f:
    text = f.read()

entries = [e.strip() for e in text.split('\n\n') if e.strip()]

print(f"Total multi-img products: {len(entries)}")

for e in entries:
    lines = e.split('\n')
    header = lines[0]
    imgs = [l.strip() for l in lines[1:]]
    # Check if images come from different folders
    folders = set(os.path.dirname(im) for im in imgs)
    if len(folders) > 1:
        print(f"WARNING - MULTIPLE FOLDERS: {header}")
        for im in imgs:
            print(f"   {im}")

print("Folder consistency check complete!")
