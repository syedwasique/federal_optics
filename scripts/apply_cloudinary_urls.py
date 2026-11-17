import json
import shutil
import os
import re

backup_path = "src/data/products.ts.bak_local_images"
if not os.path.exists(backup_path):
    shutil.copyfile("src/data/products.ts", backup_path)
    print(f"Created safety backup at {backup_path}")

mapping_path = "cloudinary_mapping.json"
with open(mapping_path, "r", encoding="utf-8") as f:
    mapping = json.load(f)

with open("src/data/products.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Sort keys by length in descending order so longer sub-paths are replaced before shorter ones
sorted_keys = sorted(mapping.keys(), key=len, reverse=True)

replaced_count = 0
not_found = []

for local_path in sorted_keys:
    cdn_url = mapping[local_path]
    # Check single and double quotes
    pattern_sq = f"'{local_path}'"
    pattern_dq = f'"{local_path}"'
    
    cnt_sq = content.count(pattern_sq)
    cnt_dq = content.count(pattern_dq)
    
    if cnt_sq > 0:
        content = content.replace(pattern_sq, f"'{cdn_url}'")
        replaced_count += cnt_sq
    if cnt_dq > 0:
        content = content.replace(pattern_dq, f'"{cdn_url}"')
        replaced_count += cnt_dq

with open("src/data/products.ts", "w", encoding="utf-8") as f:
    f.write(content)

print(f"Replacement complete! Total occurrences replaced in products.ts: {replaced_count}")

# Verify if any local /eyeglassimages or /assets remain in products.ts
remaining_local = re.findall(r"['\"](/eyeglassimages/[^'\"]+)['\"]", content)
print(f"Remaining /eyeglassimages local paths in products.ts: {len(remaining_local)}")

