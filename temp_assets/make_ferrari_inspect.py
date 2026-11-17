import os

folder = 'public/eyeglassimages/sunglasses/sunglasses rayban + feraari polarized avator shape  rs4850 for men'
files = sorted(os.listdir(folder))

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Ferrari Sunglasses Inspection</title>
<style>
body { font-family: sans-serif; background: #111; color: #fff; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.card { background: #222; border: 2px solid #444; border-radius: 8px; padding: 12px; text-align: center; }
img { width: 100%; height: 280px; object-fit: contain; background: #fff; border-radius: 4px; }
.idx { font-size: 20px; font-weight: bold; color: #fbbf24; }
.fname { font-size: 11px; color: #aaa; margin: 6px 0; word-break: break-all; }
</style>
</head>
<body>
<h1>Ray-Ban Scuderia Ferrari: 15 Images Inspection</h1>
<div class="grid">
"""

for idx, f in enumerate(files):
    web_p = f"/eyeglassimages/sunglasses/sunglasses rayban + feraari polarized avator shape  rs4850 for men/{f}"
    html += f"""
    <div class="card">
      <div class="idx">Image [{idx}]</div>
      <img src="{web_p}">
      <div class="fname">{f}</div>
    </div>
    """

html += "</div></body></html>"

with open('public/inspect_ferrari.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Generated public/inspect_ferrari.html")
