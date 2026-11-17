import os

base_folders = [
    # Sunglasses
    ('sunglasses_ferrari', 'public/eyeglassimages/sunglasses/sunglasses rayban + feraari polarized avator shape  rs4850 for men'),
    ('sunglasses_aviator_hybrid', 'public/eyeglassimages/sunglasses/Ray-Ban Sunglasses aviator shap  Mattel + Plastic for men rs 4650'),
    ('sunglasses_aviator_wire', 'public/eyeglassimages/sunglasses/Ray-Ban Sunglasses aviator shap rs 3800 color black , gray'),
    ('sunglasses_sami_square', 'public/eyeglassimages/sunglasses/Ray-Ban Sunglasses Sami Square shape Unisex rs 3650'),
    ('sunglasses_tr_polarized', 'public/eyeglassimages/sunglasses/Ray-Ban TR Polarized Sunglasses rs4250'),
    ('sunglasses_round_metal', 'public/eyeglassimages/sunglasses/rayban metal sun glasses round shape rs 3650'),
    ('sunglasses_sheet', 'public/eyeglassimages/sunglasses/sunglasses rayban sheet glasses rs 4650'),
    
    # Eyeglasses
    ('rayban_metal_4450', 'public/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450'),
    ('rayban_metal_4650', 'public/eyeglassimages/RAY BAN/premium rayban metal rs 4650'),
    ('rayban_sheet_teen', 'public/eyeglassimages/ray ban sheet frame Teen Age size'),
    ('police_clipon', 'public/eyeglassimages/POLICE/police metal frame black yellow attchment rs 3500'),
    ('tiffany_tr', 'public/eyeglassimages/Tiffany TR  Frames Rs4250 women category'),
    ('knight_horse', 'public/eyeglassimages/knight horse square trendy shape rs 4250 for men'),
    ('adidas', 'public/eyeglassimages/adidas'),
    ('dita', 'public/eyeglassimages/DITA/DITA FOR MEN SOLID FRAMES RS 4600 , COLOR  BLACK , TIGER SIDE PRINT , GRAY , BROWN'),
    ('gq_square', 'public/eyeglassimages/GOOD QUALITY/GOOD QUALITY , SQUARE SHAPE FOR MEN METAL SIDE FRAME , 4 COLORS BROWN 2 TONE  , BLACK , L.BLUE , NAVY BLUE 2 TONE'),
    ('gq_teen', 'public/eyeglassimages/GOOD QUALITY/GOOD QUALITY , TEENAGER , FLEXIBLE FRAMES , 8 COLORS GRAY , BLUE , L.PURPLE , BLACK 2 TONE , BLACK , L.PINK , DARK BROWN , BROWN RS 1999'),
    ('gq_big_square', 'public/eyeglassimages/GOOD QUALITY/GOOD QUALTIY MEN AND WOMEN , SQUARE SHAPE BIG , RS 2350'),
    ('looknice_square', 'public/eyeglassimages/LOOK NICE/LOOK NICE , SQUARE SHAPE BIG FOR MEN METAL SIDE FRAMES , FIVE COLORS BLACK , GRAY , BROWN, MATT  RS 2650'),
    ('looknice_round', 'public/eyeglassimages/LOOK NICE/LOOK NICE,  FOR LADIES AND GENTS  , ROUND SHAPE , 4 COLORS BLACK , MATTE , GRAY , GRAY MATTE RS 2650'),
    ('stepper_women_2021', 'public/eyeglassimages/STEEPER/premium quality steeper  frames Rs4250 for women'),
    ('stepper_rectangular', 'public/eyeglassimages/STEEPER/Premium quality stepper rectangular frames'),
    ('swarovski', 'public/eyeglassimages/SWAROVSKI for ladies rs 4650 color 2 tone in black , tiger print , gray , pink, transparent , brown , mehron'),
    ('tr_frames_82', 'public/eyeglassimages/TR FRAMES GOOD QUALITY'),
    ('aviator_24', 'public/eyeglassimages/aviator')
]

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Federal Optical Master Visual Audit</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #090d16; color: #f1f5f9; margin: 0; padding: 24px; }
h1 { color: #f59e0b; font-size: 26px; margin-bottom: 8px; }
.desc { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
.folder-section { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 32px; }
.folder-header { font-size: 20px; font-weight: bold; color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px; text-align: center; }
.img-wrap { width: 100%; height: 210px; background: #ffffff; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
img { max-width: 100%; max-height: 100%; object-fit: contain; }
.card-idx { font-size: 16px; font-weight: bold; color: #fbbf24; margin-top: 8px; }
.card-fname { font-size: 11px; color: #94a3b8; word-break: break-all; margin-top: 2px; }
</style>
</head>
<body>
<h1>Federal Optical Master Visual Inventory & Audit</h1>
<div class="desc">Every physical image file across all store collections for visual verification and clustering.</div>
"""

for key, folder in base_folders:
    if not os.path.exists(folder):
        continue
    files = sorted(os.listdir(folder))
    img_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    folder_name = os.path.basename(folder)
    html += f"""
    <div class="folder-section" id="{key}">
      <div class="folder-header">
        <span>{key.upper()}: {folder_name}</span>
        <span>{len(img_files)} images</span>
      </div>
      <div class="grid">
    """
    rel_path = folder.replace('public/', '').replace('public\\', '').replace('\\', '/')
    for idx, f in enumerate(img_files):
        web_p = f"/{rel_path}/{f}"
        html += f"""
        <div class="card" id="{key}_{idx}">
          <div class="img-wrap"><img src="{web_p}" loading="lazy" alt="{f}"></div>
          <div class="card-idx">[{key} #{idx}]</div>
          <div class="card-fname">{f}</div>
        </div>
        """
    html += "</div></div>"

html += "</body></html>"

with open('public/full_catalog_audit.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Generated public/full_catalog_audit.html")
