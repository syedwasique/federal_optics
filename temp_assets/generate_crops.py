import os
from PIL import Image

dir_path = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
out_dir = 'public/crops_24'
os.makedirs(out_dir, exist_ok=True)

files = sorted(os.listdir(dir_path))[:24]

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
img { max-height: 380px; max-width: 650px; object-fit: contain; background: #222; border-radius: 6px; }
</style>
</head>
<body>
<h1>Detailed View: TR FRAMES GOOD QUALITY (0 - 23)</h1>
"""

for idx, f in enumerate(files):
    p = os.path.join(dir_path, f)
    img = Image.open(p)
    w, h = img.size
    # Center crop around glasses: roughly [0.15*h:0.85*h, 0.1*w:0.9*w]
    crop = img.crop((int(0.1 * w), int(0.2 * h), int(0.9 * w), int(0.85 * h)))
    crop_path = os.path.join(out_dir, f"crop_{idx:02d}.jpg")
    crop.save(crop_path, quality=90)
    
    html += f"""
    <div class="row">
      <div class="info">
        <div class="idx">Image [{idx}]</div>
        <div class="fname">{f}</div>
      </div>
      <img src="/crops_24/crop_{idx:02d}.jpg" alt="Crop {idx}">
      <img src="/eyeglassimages/TR FRAMES GOOD QUALITY/{f}" style="max-height: 200px;" alt="Full {idx}">
    </div>
    """

html += """</body></html>"""

with open('public/inspect_crops_24.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Generated public/inspect_crops_24.html and crops_24 images.")
