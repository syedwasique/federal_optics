import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to extract individual products from PRODUCTS array
# Let's inspect the 23 groups
delims = [' — ', ' – ', ' - ']

def get_base_name(name):
    norm = name.replace('\\u2014', '—').replace('&mdash;', '—')
    for d in delims:
        if d in norm:
            return norm.split(d)[0].strip()
    return norm.strip()

def get_variant_name(name, default_color=''):
    norm = name.replace('\\u2014', '—').replace('&mdash;', '—')
    for d in delims:
        if d in norm:
            return norm.split(d)[1].strip()
    return default_color or norm.strip()

print("Helper functions ready")

