import os
import json

base_public = os.path.abspath('public')

def get_rel_images(folder_rel):
    folder_abs = os.path.join(base_public, folder_rel.replace('/', os.sep))
    if not os.path.exists(folder_abs):
        print(f"ERROR: folder not found: {folder_abs}")
        return []
    files = [f for f in sorted(os.listdir(folder_abs)) if os.path.isfile(os.path.join(folder_abs, f)) and not f.startswith('.')]
    return [f"/{folder_rel.replace(os.sep, '/')}/{f}" for f in files]

common_clear_image = "/eyeglassimages/Transparent Lenses/use this image wuth every transparent lense category .jpeg"
guides = [
    "/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpeg"
]

# Test gathering all image lists
print("Checking image counts:")
print("Biomedics 55:", len(get_rel_images('eyeglassimages/Transparent Lenses/BIOMEDICS 55')))
print("Soflens 59:", len(get_rel_images('eyeglassimages/Transparent Lenses/Bausch & Lomb Soflens 59')))
print("Avaira Vitality:", len(get_rel_images('eyeglassimages/Transparent Lenses/Avaira Vitality rs 4300')))
print("Avaira Toric:", len(get_rel_images('eyeglassimages/Transparent Lenses/Avaira Vitality Toric RS 6500')))
print("Flexcon:", len(get_rel_images('eyeglassimages/Transparent Lenses/FLEXON (With descriptipon) RS 7700')))
print("Biomedics 1 Day:", len(get_rel_images('eyeglassimages/Transparent Lenses/Biomedics 1 Day Extra ( with Description) Rs 9000')))
print("Visicon:", len(get_rel_images('eyeglassimages/Transparent Lenses/VISICON(with descriotion ) RS 4200')))
print("Focus Dailies:", len(get_rel_images('eyeglassimages/Transparent Lenses/Focus DAILIES with description rs 10400')))
print("Ear Hooks:", len(get_rel_images('eyeglassimages/Asscesoories/glass accesssories/Glasses Anti Slip Silicone Ear Hooks rs 250')))
print("Glasses Rope:", len(get_rel_images('eyeglassimages/Asscesoories/glass accesssories/Glasses Rope ( Dori) rs 150')))
print("Sunglass Boxes:", len(get_rel_images('eyeglassimages/Asscesoories/Sunglass Boxes RS 2000 each')))
print("Cartier:", len(get_rel_images('eyeglassimages/sunglasses/CARTIER 4 Colors RS 5800')))
print("Celine:", len(get_rel_images('eyeglassimages/sunglasses/CELINE 5 COLORS RS 5800')))
print("Louis Vuitton:", len(get_rel_images('eyeglassimages/sunglasses/LOUIS VUITTON 5 Colors RS 5800')))
print("Marc Jacobs:", len(get_rel_images('eyeglassimages/sunglasses/MARK JACOBS 3 COLORS RS 5800')))
print("Prada:", len(get_rel_images('eyeglassimages/sunglasses/PRADA 4 COLORS RS 5800')))
print("Ladies Eyewear:", len(get_rel_images('eyeglassimages/LADIES EYEWARE Colors Purple, Pink, Maroon Golden , rs 19990')))
print("Porsche:", len(get_rel_images('eyeglassimages/PORRSCEHE BLACK GOLDEN , COPPER M SILVER , GOLDEN , BLACK RS 3250')))
print("YQKEAKOG:", len(get_rel_images('eyeglassimages/YQKEAKOG RS 2650')))
print("YunYi:", len(get_rel_images('eyeglassimages/YUNYI RS 1999 COLRS  BLUE , LIGHT PURPLE , BLACK 2 TONE , L.PINK, DARK BROWN')))

