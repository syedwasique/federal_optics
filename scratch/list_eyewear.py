import os

base = r'public\eyeglassimages'
folders = [
    r'LADIES EYEWARE Colors Purple, Pink, Maroon Golden , rs 19990',
    r'PORRSCEHE BLACK GOLDEN , COPPER M SILVER , GOLDEN , BLACK RS 3250',
    r'YQKEAKOG RS 2650',
    r'YUNYI RS 1999 COLRS  BLUE , LIGHT PURPLE , BLACK 2 TONE , L.PINK, DARK BROWN',
    r'LOOK NICE\LOOK NICE SHAPE ROUND , SQUARE AND BIG SHAOE RS 2850'
]

for f in folders:
    p = os.path.join(base, f)
    if os.path.exists(p):
        files = os.listdir(p)
        print(f"\nEyewear: {f} (Total {len(files)} files)")
        print("Files:", files[:6])

