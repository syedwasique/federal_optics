import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect all 23 groups to ensure everything is captured
print("Ready to process groups")

