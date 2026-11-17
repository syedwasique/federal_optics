import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify markers
start_marker = "  // ==========================================\n  // SUNGLASSES\n  // =========================================="
end_marker = "  // ==========================================\n  // ACCESSORIES"

assert start_marker in content, "Could not find start of SUNGLASSES"
assert end_marker in content, "Could not find start of ACCESSORIES"

# Let's inspect what is between start_marker and end_marker
sunglasses_section = content.split(start_marker)[1].split(end_marker)[0]
print(f"Current sunglasses section length: {len(sunglasses_section)} characters")
