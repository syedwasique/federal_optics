with open('src/components/Header.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line.lower() for k in ['opencategory', 'clear-contacts', 'accessories', 'sunglasses', 'eyeglasses']):
        if 'navigateto' in line.lower() or 'opencategory' in line.lower() or 'drawer' in line.lower():
            print(f"{i+1}: {line.strip()[:100]}")

