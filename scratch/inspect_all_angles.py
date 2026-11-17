import os

folders = [
    r'public\eyeglassimages\sunglasses\CARTIER 4 Colors RS 5800',
    r'public\eyeglassimages\sunglasses\PRADA 4 COLORS RS 5800',
    r'public\eyeglassimages\sunglasses\MARK JACOBS 3 COLORS RS 5800',
    r'public\eyeglassimages\sunglasses\LOUIS VUITTON 5 Colors RS 5800',
    r'public\eyeglassimages\sunglasses\CELINE 5 COLORS RS 5800',
    r'public\eyeglassimages\PORRSCEHE BLACK GOLDEN , COPPER M SILVER , GOLDEN , BLACK RS 3250',
    r'public\eyeglassimages\YUNYI RS 1999 COLRS  BLUE , LIGHT PURPLE , BLACK 2 TONE , L.PINK, DARK BROWN',
    r'public\eyeglassimages\YQKEAKOG RS 2650',
    r'public\eyeglassimages\LADIES EYEWARE Colors Purple, Pink, Maroon Golden , rs 19990'
]

for folder in folders:
    print("=" * 60)
    print(folder)
    files = sorted(os.listdir(folder))
    print(f"Total: {len(files)} files")
    for f in files:
        print(" ", f)

