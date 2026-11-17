import os

folder = 'public/eyeglassimages/sunglasses/sunglasses rayban sheet glasses rs 4650'
files = sorted(os.listdir(folder))

html = """<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
body { background: #111; color: #fff; font-family: sans-serif; display: flex; flex-wrap: wrap; gap: 16px; padding: 20px; }
.card { width: 280px; background: #222; border: 1px solid #444; border-radius: 8px; padding: 10px; text-align: center; }
img { width: 100%; height: 200px; object-fit: contain; background: #fff; border-radius: 4px; }
.idx { font-size: 18px; font-weight: bold; color: #fbbf24; margin-top: 6px; }
.fname { font-size: 11px; color: #aaa; margin-top: 4px; word-break: break-all; }
</style>
</head><body>
"""

for idx, f in enumerate(files):
    p = f"/eyeglassimages/sunglasses/sunglasses rayban sheet glasses rs 4650/{f}"
    html += f"""
    <div class="card">
      <img src="{p}">
      <div class="idx">Image [{idx}]</div>
      <div class="fname">{f}</div>
    </div>
    """

html += "</body></html>"

with open('public/inspect_sheet.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Generated public/inspect_sheet.html")
