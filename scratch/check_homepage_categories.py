with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'clear-contacts[\s\S]{1,300}', text)
for m in matches:
    print("--- MATCH ---")
    print(m)

