import os

base = r'public\eyeglassimages\Asscesoories'
for root, dirs, files in os.walk(base):
    rel = os.path.relpath(root, base)
    print(f"Folder: {rel}")
    for f in files:
        print(f"   {f}")

