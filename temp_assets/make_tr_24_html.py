import os

dir_path = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(dir_path))[:24]

html = """<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: sans-serif; background: #111; color: #fff; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.card { background: #222; border: 1px solid #444; border-radius: 8px; padding: 10px; text-align: center; }
img { width: 100%; height: 260px; object-fit: contain; background: #fff; }
.idx { font-size: 18px; font-weight: bold; color: #eab308; }
.fname { font-size: 11px; color: #aaa; margin-top: 6px; }
</style>
</head>
<body>
<h1>First 24 Images of TR FRAMES GOOD QUALITY</h1>
<div class="grid">
"""

for idx, f in enumerate(files):
    web_p = f"/eyeglassimages/TR FRAMES GOOD QUALITY/{f}"
    html += f"""
    <div class="card">
      <div class="idx">Image [{idx}]</div>
      <img src="{web_p}">
      <div class="fname">{f}</div>
    </div>
    """

html += """</div></body></html>"""

with open('public/inspect_tr_24.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Generated public/inspect_tr_24.html")
