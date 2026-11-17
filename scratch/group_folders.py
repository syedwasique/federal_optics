import os
import datetime

base = r"public\eyeglassimages"
now = datetime.datetime.now()
one_week_ago = now - datetime.timedelta(days=7)

recent_dirs = []
for root, dirs, files in os.walk(base):
    for d in dirs:
        p = os.path.join(root, d)
        try:
            stat = os.stat(p)
            ctime = datetime.datetime.fromtimestamp(stat.st_ctime)
            mtime = datetime.datetime.fromtimestamp(stat.st_mtime)
            latest = max(ctime, mtime)
            if latest >= one_week_ago:
                direct_files = [f for f in os.listdir(p) if os.path.isfile(os.path.join(p, f))]
                recent_dirs.append({
                    "full_path": p,
                    "rel_path": os.path.relpath(p, base),
                    "ctime": ctime,
                    "mtime": mtime,
                    "latest": latest,
                    "files": direct_files
                })
        except Exception as e:
            pass

# Group by category:
# 1. Transparent Lenses
# 2. Sunglasses
# 3. Accessories (Asscesoories)
# 4. Eyeglasses / Eyewear (Men & Women)
# 5. Color contact lenses

categories = {
    "Transparent Lenses": [],
    "Accessories": [],
    "Sunglasses": [],
    "Eyeglasses (Men & Women)": [],
    "Color Contact Lenses": [],
    "Other": []
}

for item in recent_dirs:
    rel = item["rel_path"]
    if rel == ".":
        continue
    if rel.startswith("Transparent Lenses"):
        categories["Transparent Lenses"].append(item)
    elif rel.startswith("Asscesoories"):
        categories["Accessories"].append(item)
    elif rel.startswith("sunglasses"):
        categories["Sunglasses"].append(item)
    elif rel.startswith("color contact lenses"):
        categories["Color Contact Lenses"].append(item)
    elif any(rel.startswith(k) for k in ["LADIES EYEWARE", "LOOK NICE", "PORRSCEHE", "YQKEAKOG", "YUNYI", "STEEPER", "POLICE", "RAY BAN", "DITA", "adidas", "aviator", "TR FRAMES", "GOOD QUALITY", "Tiffany"]):
        categories["Eyeglasses (Men & Women)"].append(item)
    else:
        categories["Other"].append(item)

for cat_name, items in categories.items():
    print(f"\n=== CATEGORY: {cat_name} ({len(items)} folders) ===")
    for item in items:
        print(f"- {item['rel_path']}")
        print(f"    Created: {item['ctime'].strftime('%Y-%m-%d %H:%M:%S')} | Files: {len(item['files'])}")
        if item['files']:
            print(f"    Sample files: {', '.join(item['files'][:3])}")

