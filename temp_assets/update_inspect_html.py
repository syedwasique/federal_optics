import os

dir_path = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(dir_path))[:24]

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: sans-serif; background: #18181b; color: #fff; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.card { background: #27272a; border: 2px solid #3f3f46; border-radius: 8px; padding: 12px; text-align: center; }
img { width: 100%; height: 350px; object-fit: contain; background: #fff; border-radius: 4px; }
.idx { font-size: 20px; font-weight: bold; color: #fbbf24; margin-bottom: 6px; }
.fname { font-size: 12px; color: #a1a1aa; margin-top: 8px; word-break: break-all; }
</style>
</head>
<body>
<h1>TR FRAMES GOOD QUALITY: First 24 Images (Indices 0 - 23)</h1>
<div class="grid">
"""

for idx, f in enumerate(files):
    web_p = f"/eyeglassimages/TR FRAMES GOOD QUALITY/{f}"
    html += f"""
    <div class="card" id="card-{idx}">
      <div class="idx">Image [{idx}]</div>
      <img src="{web_p}" alt="Image {idx}">
      <div class="fname">{f}</div>
    </div>
    """

html += """</div></body></html>"""

with open('public/inspect_tr_24.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Updated public/inspect_tr_24.html")
