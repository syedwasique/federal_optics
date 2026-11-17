import os

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            p = os.path.join(root, file)
            with open(p, 'r', encoding='utf-8') as f:
                c = f.read()
                if 'LENS_PACKAGE_OPTIONS' in c or 'selectedLens' in c or 'lensPackage' in c:
                    print(f"File: {p}")

