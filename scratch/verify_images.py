import os

base_public = os.path.abspath('public')

def get_rel_images(folder_rel):
    folder_abs = os.path.join(base_public, folder_rel.replace('/', os.sep))
    if not os.path.exists(folder_abs):
        print(f"ERROR: Not found: {folder_abs}")
        return []
    files = [f for f in sorted(os.listdir(folder_abs)) if os.path.isfile(os.path.join(folder_abs, f)) and not f.startswith('.')]
    return [f"/{folder_rel.replace(os.sep, '/')}/{f}" for f in files]

common_clear_image = "/eyeglassimages/Transparent Lenses/use this image wuth every transparent lense category .jpeg"
guides = [
    "/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpeg"
]

print("Checking existence of common images:")
print("common_clear_image exists:", os.path.exists(os.path.join(base_public, common_clear_image.lstrip('/'))))
for g in guides:
    print(f"{g} exists:", os.path.exists(os.path.join(base_public, g.lstrip('/'))))

