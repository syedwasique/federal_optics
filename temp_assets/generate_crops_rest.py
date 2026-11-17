import os, re
from PIL import Image

dir_path = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
files = sorted(os.listdir(dir_path))

# Let's inspect images 24 to 81
out_dir = 'public/crops_rest'
os.makedirs(out_dir, exist_ok=True)

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: sans-serif; background: #111; color: #fff; padding: 20px; }
.row { display: flex; align-items: center; border-bottom: 2px solid #333; padding: 12px 0; gap: 20px; }
.info { width: 220px; flex-shrink: 0; }
.idx { font-size: 24px; font-weight: bold; color: #fbbf24; }
.fname { font-size: 12px; color: #888; }
img { max-height: 250px; max-width: 400px; object-fit: contain; background: #fff; border-radius: 6px; }
</style>
</head>
<body>
<h1>Detailed View: TR FRAMES GOOD QUALITY (24 - 81)</h1>
"""

for idx in range(24, len(files)):
    f = files[idx]
    p = os.path.join(dir_path, f)
    img = Image.open(p)
    w, h = img.size
    crop = img.crop((int(0.1 * w), int(0.2 * h), int(0.9 * w), int(0.85 * h)))
    crop_path = os.path.join(out_dir, f"crop_{idx:02d}.jpg")
    crop.save(crop_path, quality=85)
    
    html += f"""
    <div class="row">
      <div class="info">
        <div class="idx">Image [{idx}]</div>
        <div class="fname">{f}</div>
      </div>
      <img src="/crops_rest/crop_{idx:02d}.jpg" alt="Crop {idx}">
      <img src="/eyeglassimages/TR FRAMES GOOD QUALITY/{f}" style="max-height: 160px;" alt="Full {idx}">
    </div>
    """

html += """</body></html>"""

with open('public/inspect_crops_rest.html', 'w', encoding='utf-8') as out:
    out.write(html)

print(f"Generated public/inspect_crops_rest.html for {len(files)-24} images.")
