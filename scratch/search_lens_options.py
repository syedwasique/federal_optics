import os

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            p = os.path.join(root, file)
            with open(p, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'LENS_PACKAGE_OPTIONS' in content or 'Single Vision — Anti-Reflective' in content:
                    print(f"Found in: {p}")

