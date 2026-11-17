import os

base = r'public\eyeglassimages\color contact lenses\OPTIANO GORGEOUS COLLECTION rs 3850'
for d in ['CRYSTAL GRAY', 'MISTY BLUE', 'OLIVINE', 'SILK GREEN', 'sterling gray', 'TIFFANY GRAY']:
    p = os.path.join(base, d)
    files = os.listdir(p)
    print(f"Shade: {d}")
    for f in files:
        fp = os.path.join(p, f)
        print(f"  {f} ({os.path.getsize(fp)} bytes)")

