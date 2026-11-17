import os

base = r'public\eyeglassimages\sunglasses'
folders = [
    'CARTIER 4 Colors RS 5800',
    'CELINE 5 COLORS RS 5800',
    'LOUIS VUITTON 5 Colors RS 5800',
    'MARK JACOBS 3 COLORS RS 5800',
    'PRADA 4 COLORS RS 5800'
]

for f in folders:
    p = os.path.join(base, f)
    files = os.listdir(p)
    print(f"\nSunglasses: {f} (Total {len(files)} files)")
    print("Files:", files[:8])

