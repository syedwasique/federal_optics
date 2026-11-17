import os
import json
import re

base_public = os.path.abspath('public')

def get_rel_images(folder_rel):
    folder_abs = os.path.join(base_public, folder_rel.replace('/', os.sep))
    if not os.path.exists(folder_abs):
        raise FileNotFoundError(f"Missing: {folder_abs}")
    files = [f for f in sorted(os.listdir(folder_abs)) if os.path.isfile(os.path.join(folder_abs, f)) and not f.startswith('.')]
    return [f"/{folder_rel.replace(os.sep, '/')}/{f}" for f in files]

common_clear_image = "/eyeglassimages/Transparent Lenses/use this image wuth every transparent lense category .jpeg"
guides = [
    "/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpeg"
]

def make_clear_images(specific_images):
    res = list(specific_images)
    if common_clear_image not in res:
        res.append(common_clear_image)
    for g in guides:
        if g not in res:
            res.append(g)
    return res

print("Image helper defined.")

