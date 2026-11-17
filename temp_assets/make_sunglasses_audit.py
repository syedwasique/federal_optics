import os

sunglasses_folders = [
    ('ferrari', 'public/eyeglassimages/sunglasses/sunglasses rayban + feraari polarized avator shape  rs4850 for men'),
    ('aviator_hybrid', 'public/eyeglassimages/sunglasses/Ray-Ban Sunglasses aviator shap  Mattel + Plastic for men rs 4650'),
    ('aviator_wire', 'public/eyeglassimages/sunglasses/Ray-Ban Sunglasses aviator shap rs 3800 color black , gray'),
    ('sami_square', 'public/eyeglassimages/sunglasses/Ray-Ban Sunglasses Sami Square shape Unisex rs 3650'),
    ('tr_polarized', 'public/eyeglassimages/sunglasses/Ray-Ban TR Polarized Sunglasses rs4250'),
    ('round_metal', 'public/eyeglassimages/sunglasses/rayban metal sun glasses round shape rs 3650'),
    ('sheet_glasses', 'public/eyeglassimages/sunglasses/sunglasses rayban sheet glasses rs 4650')
]

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>All Sunglasses Visual Audit</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
h1 { color: #f59e0b; font-size: 24px; margin-bottom: 20px; }
h2 { color: #38bdf8; font-size: 18px; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-top: 30px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 12px; }
.card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px; text-align: center; }
.img-wrap { width: 100%; height: 220px; background: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
img { max-width: 100%; max-height: 100%; object-fit: contain; }
.idx { font-size: 16px; font-weight: bold; color: #fbbf24; margin-top: 6px; }
.fname { font-size: 11px; color: #94a3b8; word-break: break-all; margin-top: 2px; }
</style>
</head>
<body>
<h1>All Sunglasses Visual Inventory (7 Folders)</h1>
"""

for key, folder in sunglasses_folders:
    if not os.path.exists(folder):
        continue
    files = sorted(os.listdir(folder))
    html += f"<h2>{key} ({len(files)} files) &mdash; {os.path.basename(folder)}</h2><div class='grid'>"
    for idx, f in enumerate(files):
        # web path
        rel_path = folder.replace('public/', '').replace('public\\', '').replace('\\', '/')
        web_p = f"/{rel_path}/{f}"
        html += f"""
        <div class="card" id="{key}_{idx}">
          <div class="img-wrap"><img src="{web_p}" loading="lazy" alt="{f}"></div>
          <div class="idx">[{key} #{idx}]</div>
          <div class="fname">{f}</div>
        </div>
        """
    html += "</div>"

html += "</body></html>"

with open('public/inspect_sunglasses_all.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Generated public/inspect_sunglasses_all.html")
