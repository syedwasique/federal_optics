import os
import re
from datetime import datetime

base_url = "https://federaloptical.com"
today = datetime.now().strftime("%Y-%m-%d")

# 1. Static Pages
static_pages = [
    {"loc": "/", "priority": "1.0", "changefreq": "daily"},
    {"loc": "/catalog/eyeglasses", "priority": "0.9", "changefreq": "weekly"},
    {"loc": "/catalog/sunglasses", "priority": "0.9", "changefreq": "weekly"},
    {"loc": "/catalog/color-contacts", "priority": "0.9", "changefreq": "weekly"},
    {"loc": "/catalog/clear-contacts", "priority": "0.9", "changefreq": "weekly"},
    {"loc": "/catalog/tint-eyeglasses", "priority": "0.8", "changefreq": "weekly"},
    {"loc": "/catalog/accessories", "priority": "0.8", "changefreq": "weekly"},
    {"loc": "/about", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/contact", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/vision-care", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/federal-care", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/stores", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/blog", "priority": "0.7", "changefreq": "weekly"},
    {"loc": "/faq", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/size-guide", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/policies", "priority": "0.5", "changefreq": "monthly"},
    {"loc": "/partnership", "priority": "0.6", "changefreq": "monthly"},
]

# 2. Extract products from src/data/products.ts
with open("src/data/products.ts", "r", encoding="utf-8") as f:
    text = f.read()

product_ids = re.findall(r"\bid:\s*['\"]([^'\"]+)['\"]", text)
# Remove non-product ids (like colors or options)
# In products.ts, products are declared with id: '...' inside the main PRODUCTS array
# Let's verify by finding products after 'export const PRODUCTS'
start_idx = text.find("export const PRODUCTS")
products_block = text[start_idx:]

matches = re.finditer(r"\{\s*id:\s*['\"]([^'\"]+)['\"].*?category:\s*['\"]([^'\"]+)['\"]", products_block, re.DOTALL)
product_urls = []
for m in matches:
    pid = m.group(1)
    product_urls.append(pid)

# Remove duplicates while preserving order
seen = set()
unique_pids = []
for pid in product_urls:
    if pid not in seen:
        seen.add(pid)
        unique_pids.append(pid)

print(f"Extracted {len(unique_pids)} unique products for sitemap.")

# Generate XML
xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]

for p in static_pages:
    xml_lines.append("  <url>")
    xml_lines.append(f"    <loc>{base_url}{p['loc']}</loc>")
    xml_lines.append(f"    <lastmod>{today}</lastmod>")
    xml_lines.append(f"    <changefreq>{p['changefreq']}</changefreq>")
    xml_lines.append(f"    <priority>{p['priority']}</priority>")
    xml_lines.append("  </url>")

for pid in unique_pids:
    xml_lines.append("  <url>")
    xml_lines.append(f"    <loc>{base_url}/product/{pid}</loc>")
    xml_lines.append(f"    <lastmod>{today}</lastmod>")
    xml_lines.append("    <changefreq>weekly</changefreq>")
    xml_lines.append("    <priority>0.8</priority>")
    xml_lines.append("  </url>")

xml_lines.append("</urlset>")

sitemap_path = os.path.join("public", "sitemap.xml")
with open(sitemap_path, "w", encoding="utf-8") as f:
    f.write("\n".join(xml_lines))

print(f"Generated {sitemap_path} with {len(static_pages) + len(unique_pids)} total URLs.")
