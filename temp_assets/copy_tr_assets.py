import shutil, os

src_tr = 'public/eyeglassimages/TR FRAMES GOOD QUALITY'
dest_assets = 'public/assets/images/eyeglasses'

# 1. Image 10 -> regular-tr90-pilot-gloss-black-side.jpg
# WhatsApp Image 2026-09-17 at 8.12.56 PM.jpeg
src_img_10 = os.path.join(src_tr, 'WhatsApp Image 2026-09-17 at 8.12.56 PM.jpeg')
dest_gloss_side = os.path.join(dest_assets, 'regular-tr90-pilot-gloss-black-side.jpg')
shutil.copyfile(src_img_10, dest_gloss_side)
print("Updated regular-tr90-pilot-gloss-black-side.jpg with Image 10")

# 2. Image 21 -> regular-tr90-round-tomfamous-black-front.jpg
# WhatsApp Image 2026-09-17 at 8.13.07 PM (2).jpeg
src_img_21 = os.path.join(src_tr, 'WhatsApp Image 2026-09-17 at 8.13.07 PM (2).jpeg')
dest_round_tom = os.path.join(dest_assets, 'regular-tr90-round-tomfamous-black-front.jpg')
shutil.copyfile(src_img_21, dest_round_tom)
print("Created regular-tr90-round-tomfamous-black-front.jpg")

# 3. Image 23 -> regular-tr90-rect-tomfamous-black-front.jpg
# WhatsApp Image 2026-09-17 at 8.13.08 PM.jpeg
src_img_23 = os.path.join(src_tr, 'WhatsApp Image 2026-09-17 at 8.13.08 PM.jpeg')
dest_rect_tom = os.path.join(dest_assets, 'regular-tr90-rect-tomfamous-black-front.jpg')
shutil.copyfile(src_img_23, dest_rect_tom)
print("Created regular-tr90-rect-tomfamous-black-front.jpg")

# 4. Image 33 -> regular-tr90-retro-round-jet-black-front.jpg
# WhatsApp Image 2026-09-17 at 8.59.06 PM.jpeg
src_img_33 = os.path.join(src_tr, 'WhatsApp Image 2026-09-17 at 8.59.06 PM.jpeg')
dest_round_blk = os.path.join(dest_assets, 'regular-tr90-retro-round-jet-black-front.jpg')
shutil.copyfile(src_img_33, dest_round_blk)
print("Created regular-tr90-retro-round-jet-black-front.jpg")
