import os
import re
from PIL import Image

workspace = r'c:\Users\user\OneDrive\Desktop\federal optics'
prod_file = os.path.join(workspace, 'src', 'data', 'products.ts')

with open(prod_file, 'r', encoding='utf-8') as f:
    c = f.read()

pattern = re.compile(r'id:\s*["\']([^"\']+)["\'].*?name:\s*["\']([^"\']+)["\'].*?category:\s*["\']color-contacts["\'].*?images:\s*\[(.*?)\]', re.DOTALL)

matches = pattern.findall(c)
print(f"Total found: {len(matches)}")

errors = []
for m in matches:
    p_id = m[0]
    p_name = m[1]
    imgs = re.findall(r'["\']([^"\']+)["\']', m[2])
    
    first = imgs[0]
    second = imgs[1] if len(imgs) > 1 else None
    
    # Check dimensions
    p1 = os.path.join(workspace, 'public', first.lstrip('/').replace('/', os.sep))
    p2 = os.path.join(workspace, 'public', second.lstrip('/').replace('/', os.sep)) if second else None
    
    dim1 = Image.open(p1).size if os.path.exists(p1) else (0,0)
    dim2 = Image.open(p2).size if p2 and os.path.exists(p2) else (0,0)
    
    # In Optiano, lens is (1080, 1200), model is (908, 1280)
    if 'optiano' in p_name.lower():
        if dim1 != (1080, 1200):
            errors.append(f"{p_name}: Optiano lens image expected (1080, 1200), got {dim1} for {first}")
            
print(f"Errors found: {len(errors)}")
if errors:
    for e in errors[:10]:
        print(" ", e)
else:
    print("All Optiano shades have 1080x1200 LENS image in index 0!")
