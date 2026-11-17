import json
import os

workspace = r'c:\Users\user\OneDrive\Desktop\federal optics'
with open(os.path.join(workspace, 'scratch', 'correct_lens_model_order.json'), 'r', encoding='utf-8') as f:
    items = json.load(f)

html = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lens First & Model Second Verification</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f1115; color: #fff; padding: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .card { background: #181b22; border: 1px solid #333; border-radius: 8px; padding: 12px; }
    .title { font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #d4af37; }
    .pair { display: flex; gap: 8px; }
    .box { flex: 1; text-align: center; }
    .box img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; border: 2px solid #444; }
    .box.lens img { border-color: #10b981; }
    .box.model img { border-color: #3b82f6; }
    .box-label { font-size: 10px; margin-top: 4px; font-weight: 600; }
    .lens-label { color: #10b981; }
    .model-label { color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Verification Sheet: LENS Image (Green / 1st) vs MODEL Image (Blue / 2nd)</h1>
  <div class="grid">
"""

for item in items:
    lens_url = (item['relDir'] + '/' + item['lens']).replace(' ', '%20')
    model_url = (item['relDir'] + '/' + item['models'][0]).replace(' ', '%20') if item['models'] else ''
    
    html += f"""
    <div class="card">
      <div class="title">{item['collection']} - {item['shade']}</div>
      <div class="pair">
        <div class="box lens">
          <img src="{lens_url}" />
          <div class="box-label lens-label">1. LENS (Card View)</div>
        </div>
        <div class="box model">
          <img src="{model_url}" />
          <div class="box-label model-label">2. MODEL (Hover View)</div>
        </div>
      </div>
    </div>
    """

html += """
  </div>
</body>
</html>
"""

with open(os.path.join(workspace, 'public', 'verify_lens_model_order.html'), 'w', encoding='utf-8') as f:
    f.write(html)

print("Regenerated public/verify_lens_model_order.html successfully!")
