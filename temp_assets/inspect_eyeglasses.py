import os

eyeglass_folders = [
    ('rayban_metal_4450', 'public/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450'),
    ('rayban_metal_4650', 'public/eyeglassimages/RAY BAN/premium rayban metal rs 4650'),
    ('rayban_sheet_teen', 'public/eyeglassimages/ray ban sheet frame Teen Age size'),
    ('police_clipon', 'public/eyeglassimages/POLICE/police metal frame black yellow attchment rs 3500'),
    ('tiffany_tr', 'public/eyeglassimages/Tiffany TR  Frames Rs4250 women category'),
    ('knight_horse', 'public/eyeglassimages/knight horse square trendy shape rs 4250 for men')
]

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Eyeglasses Visual Audit</title>
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
<h1>Eyeglasses Visual Inventory (6 Folders)</h1>
"""

for key, folder in eyeglass_folders:
    if not os.path.exists(folder):
        continue
    files = sorted(os.listdir(folder))
    img_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    html += f"<h2>{key} ({len(img_files)} files) &mdash; {os.path.basename(folder)}</h2><div class='grid'>"
    for idx, f in enumerate(img_files):
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

with open('public/inspect_eyeglasses.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Generated public/inspect_eyeglasses.html")
