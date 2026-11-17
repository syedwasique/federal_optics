import os
from PIL import Image

workspace = r'c:\Users\user\OneDrive\Desktop\federal optics\public\eyeglassimages\color contact lenses'

folders = [
    r'BELLA DAIMOND\BELLA DAIMOND GRAY GREEN',
    r'BELLA DAIMOND\BELLA DAIMOND MYSTERIOUS',
    r'BELLA DAIMOND\BELLA DAIMOND OAK',
    r'BELLA DAIMOND\BELLA DAIMOND WOOD STONE',
    r'BELLA GLOW RS 4800\HUSKY GRAY GREEN',
    r'BELLA GLOW RS 4800\LIME GREEN',
    r'BELLA GLOW RS 4800\RADIANT GRAY'
]

for rel in folders:
    p = os.path.join(workspace, rel)
    print("FOLDER:", rel)
    for f in os.listdir(p):
        fp = os.path.join(p, f)
        im = Image.open(fp)
        print(f"  {f} | size={im.size} | bytes={os.path.getsize(fp)}")
