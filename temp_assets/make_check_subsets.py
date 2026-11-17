import os

dir_path = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(dir_path))

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: sans-serif; background: #111; color: #fff; padding: 20px; }
.card { display: inline-block; width: 300px; background: #222; margin: 10px; padding: 10px; vertical-align: top; text-align: center; }
img { width: 100%; height: 220px; object-fit: contain; background: #fff; }
.idx { font-size: 18px; font-weight: bold; color: #fbbf24; }
.fname { font-size: 11px; color: #aaa; }
</style>
</head>
<body>
<h1>Check TR 48-54 and 72-81</h1>
"""

for idx in [48, 49, 50, 51, 52, 53, 54, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]:
    f = files[idx]
    html += f"""
    <div class="card">
      <div class="idx">Image [{idx}]</div>
      <img src="/eyeglassimages/TR FRAMES GOOD QUALITY/{f}">
      <div class="fname">{f}</div>
    </div>
    """

html += "</body></html>"
with open('public/check_subsets.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Saved public/check_subsets.html")
