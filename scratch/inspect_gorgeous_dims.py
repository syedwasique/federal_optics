from PIL import Image
import os

base = r'public\eyeglassimages\color contact lenses\OPTIANO GORGEOUS COLLECTION rs 3850'
for d in ['CRYSTAL GRAY', 'MISTY BLUE', 'OLIVINE', 'SILK GREEN', 'sterling gray', 'TIFFANY GRAY']:
    p = os.path.join(base, d)
    print(f"=== {d} ===")
    for f in os.listdir(p):
        fp = os.path.join(p, f)
        im = Image.open(fp)
        print(f"  {f}: size={im.size}, mode={im.mode}")

