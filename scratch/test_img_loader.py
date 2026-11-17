import os
import json

base_public = os.path.abspath('public')

def get_rel_images(folder_rel):
    folder_abs = os.path.join(base_public, folder_rel.replace('/', os.sep))
    if not os.path.exists(folder_abs):
        return []
    files = [f for f in os.listdir(folder_abs) if os.path.isfile(os.path.join(folder_abs, f)) and not f.startswith('.')]
    return [f"/{folder_rel.replace(os.sep, '/')}/{f}" for f in files]

print("Testing get_rel_images:")
for f in [
    'eyeglassimages/Transparent Lenses',
    'eyeglassimages/Transparent Lenses/BIOMEDICS 55',
    'eyeglassimages/Asscesoories/lens accsessores',
    'eyeglassimages/sunglasses/PRADA 4 COLORS RS 5800',
    'eyeglassimages/LADIES EYEWARE Colors Purple, Pink, Maroon Golden , rs 19990'
]:
    imgs = get_rel_images(f)
    print(f"{f}: {len(imgs)} images")

