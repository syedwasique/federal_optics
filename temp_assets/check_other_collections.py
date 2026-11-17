import os, re
from PIL import Image

# Check DITA
print("=== DITA ===")
dita_dir = 'public/eyeglassimages/DITA/DITA FOR MEN SOLID FRAMES RS 4600 , COLOR  BLACK , TIGER SIDE PRINT , GRAY , BROWN'
if os.path.exists(dita_dir):
    files = sorted(os.listdir(dita_dir))
    print(f"Total DITA files: {len(files)}")
    for i, f in enumerate(files):
        print(f"  [{i}] {f}")

# Check Adidas
print("\n=== ADIDAS ===")
adidas_dir = 'public/eyeglassimages/adidas'
if os.path.exists(adidas_dir):
    files = sorted(os.listdir(adidas_dir))
    print(f"Total Adidas files: {len(files)}")
    for i, f in enumerate(files):
        print(f"  [{i}] {f}")

# Check Look Nice Square
print("\n=== LOOK NICE SQUARE ===")
ln_sq_dir = 'public/eyeglassimages/LOOK NICE/LOOK NICE , SQUARE SHAPE BIG FOR MEN METAL SIDE FRAMES , FIVE COLORS BLACK , GRAY , BROWN, MATT  RS 2650'
if os.path.exists(ln_sq_dir):
    files = sorted(os.listdir(ln_sq_dir))
    print(f"Total Look Nice Square files: {len(files)}")
    for i, f in enumerate(files):
        print(f"  [{i}] {f}")

# Check Good Quality Square
print("\n=== GOOD QUALITY SQUARE ===")
gq_sq_dir = 'public/eyeglassimages/GOOD QUALITY/GOOD QUALITY , SQUARE SHAPE FOR MEN METAL SIDE FRAME , 4 COLORS BROWN 2 TONE  , BLACK , L.BLUE , NAVY BLUE 2 TONE'
if os.path.exists(gq_sq_dir):
    files = sorted(os.listdir(gq_sq_dir))
    print(f"Total Good Quality Square files: {len(files)}")
    for i, f in enumerate(files):
        print(f"  [{i}] {f}")

# Check Good Quality Teen
print("\n=== GOOD QUALITY TEEN ===")
gq_teen_dir = 'public/eyeglassimages/GOOD QUALITY/GOOD QUALITY , TEENAGER , FLEXIBLE FRAMES , 8 COLORS GRAY , BLUE , L.PURPLE , BLACK 2 TONE , BLACK , L.PINK , DARK BROWN , BROWN RS 1999'
if os.path.exists(gq_teen_dir):
    files = sorted(os.listdir(gq_teen_dir))
    print(f"Total Good Quality Teen files: {len(files)}")
    for i, f in enumerate(files):
        print(f"  [{i}] {f}")
