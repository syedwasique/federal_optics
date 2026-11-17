import sys
import os
import re

# Add scratch to sys.path
sys.path.append(os.path.abspath('scratch'))

from build_clear_contacts import clear_contacts
from build_all_new_products import accessories, sunglasses, eyeglasses, color_contacts_new
from test_ts_serializer import to_ts_obj

src_path = 'src/data/products.ts'
with open(src_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open(src_path + '.bak', 'w', encoding='utf-8') as f:
    f.write(content)

# 1. Update interfaces
old_interface_part = """export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  subCategory: string;
  gender: ProductGender;
  brand: string;
  price: number; // PKR
  originalPrice?: number; // PKR
  rating?: number;
  reviewCount?: number;
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  frameShape?: FrameShape;
  frameMaterial?: string;
  rimType?: RimType;
  frameSize?: string;
  measurements?: FrameMeasurements;
  disposability?: LensDisposability;
  lensColor?: string;
  availableColors: ProductVariantColor[];
  reviews?: ProductReview[];
}"""

new_interface_part = """export interface ProductPackOption {
  id: string;
  name: string;
  price: number; // PKR
  savingsBadge?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  subCategory: string;
  gender: ProductGender;
  brand: string;
  price: number; // PKR
  originalPrice?: number; // PKR
  rating?: number;
  reviewCount?: number;
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  frameShape?: FrameShape;
  frameMaterial?: string;
  rimType?: RimType;
  frameSize?: string;
  measurements?: FrameMeasurements;
  disposability?: LensDisposability;
  lensColor?: string;
  availableColors: ProductVariantColor[];
  packOptions?: ProductPackOption[];
  isToric?: boolean;
  lensWaterContent?: string;
  lensDiameter?: string;
  lensBaseCurve?: string;
  lensPowerRange?: string;
  reviews?: ProductReview[];
}"""

if old_interface_part in content:
    content = content.replace(old_interface_part, new_interface_part)
    print("Updated Product interface successfully.")
else:
    print("Warning: old_interface_part not found verbatim.")

# 2. Update matchesCollectionSubCategory
old_match = """  if (subLower.includes("toric") || subLower.includes("astigmatism")) {
    return product.subCategory.toLowerCase().includes('toric') || 
           product.name.toLowerCase().includes('toric') ||
           product.name.toLowerCase().includes('astigmatism');
  }
  if (subLower.includes("lens care") || subLower.includes("care")) {
    return product.subCategory.toLowerCase().includes('care') || 
           product.name.toLowerCase().includes('solution') ||
           product.name.toLowerCase().includes('spray');
  }"""

new_match = """  if (subLower.includes("toric") || subLower.includes("astigmatism")) {
    return product.isToric === true ||
           product.subCategory.toLowerCase().includes('toric') || 
           product.name.toLowerCase().includes('toric') ||
           product.name.toLowerCase().includes('astigmatism');
  }
  if (subLower.includes("lens care") || subLower.includes("care") || subLower.includes("solution") || subLower.includes("accessories")) {
    return product.subCategory.toLowerCase().includes('care') || 
           product.subCategory.toLowerCase().includes('solution') ||
           product.subCategory.toLowerCase().includes('accessories') ||
           product.name.toLowerCase().includes('solution') ||
           product.name.toLowerCase().includes('spray') ||
           product.name.toLowerCase().includes('cleaner') ||
           product.name.toLowerCase().includes('hook') ||
           product.name.toLowerCase().includes('rope') ||
           product.name.toLowerCase().includes('box') ||
           product.name.toLowerCase().includes('kit');
  }"""

if old_match in content:
    content = content.replace(old_match, new_match)
    print("Updated matchesCollectionSubCategory successfully.")
else:
    print("Warning: old_match not found verbatim.")

# 3. Replace clear-contacts placeholder block
# In products.ts: from id: 'cl-ac01' to end of id: 'cl-hy06'
pattern_clear = re.compile(r"\{\s*id:\s*['\"]cl-ac01['\"].*?id:\s*['\"]cl-hy06['\"].*?\n  \},", re.DOTALL)
ts_clear = ",\n  ".join(to_ts_obj(p, indent=2) for p in clear_contacts) + ","

if pattern_clear.search(content):
    content = pattern_clear.sub(ts_clear, content, count=1)
    print("Replaced clear-contacts placeholders with 13 authentic products.")
else:
    print("Warning: clear-contacts placeholder pattern not matched!")

# 4. Replace accessories placeholder block
# In products.ts: from id: 'ac-cs01' to end of id: 'ac-sm04'
pattern_acc = re.compile(r"\{\s*id:\s*['\"]ac-cs01['\"].*?id:\s*['\"]ac-sm04['\"].*?\n  \},", re.DOTALL)
ts_acc = ",\n  ".join(to_ts_obj(p, indent=2) for p in accessories) + ","

if pattern_acc.search(content):
    content = pattern_acc.sub(ts_acc, content, count=1)
    print("Replaced accessories placeholders with 11 authentic products.")
else:
    print("Warning: accessories placeholder pattern not matched!")

# 5. Append new color-contacts, sunglasses, eyeglasses right before the closing `];` of PRODUCTS
new_additional_products = color_contacts_new + sunglasses + eyeglasses
ts_additional = "\n  // ==========================================\n  // NEW ARRIVALS (GORGEOUS SHADES, LUXURY SUNGLASSES & EYEGLASSES)\n  // ==========================================\n  "
ts_additional += ",\n  ".join(to_ts_obj(p, indent=2) for p in new_additional_products) + ",\n"

# Find `export const PRODUCTS: Product[] = [` and its closing `];`
# The closing `];` is at the end of the file
last_bracket_idx = content.rfind('];')
if last_bracket_idx != -1:
    content = content[:last_bracket_idx] + ts_additional + content[last_bracket_idx:]
    print(f"Appended {len(new_additional_products)} additional products before closing array bracket.")
else:
    print("ERROR: closing bracket of PRODUCTS not found!")

with open(src_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/data/products.ts successfully!")

