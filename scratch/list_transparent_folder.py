import os

folder = 'public/eyeglassimages/Transparent Lenses'
for root, dirs, files in os.walk(folder):
    rel = os.path.relpath(root, folder)
    print(f"Dir: {rel}")
    for f in files:
        print(f"   - {f}")

