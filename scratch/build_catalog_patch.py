import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Eyeglasses Wire & Hexagonal
wire_gold_imgs = """    images: [
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.53 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.54 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.55 PM.jpeg',
    ],"""

wire_silver_imgs = """    images: [
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.56 PM (1).jpeg',
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.56 PM (2).jpeg',
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.56 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.57 PM (1).jpeg',
    ],"""

wire_black_imgs = """    images: [
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.58 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.59 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium ray ban metal frames rs Rs4450/WhatsApp Image 2026-09-20 at 2.20.59 PM (1).jpeg',
    ],"""

hex_gold_imgs = """    images: [
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.35 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.36 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.37 PM (1).jpeg',
    ],"""

hex_silver_imgs = """    images: [
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.37 PM (2).jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.37 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.38 PM (1).jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.38 PM (2).jpeg',
    ],"""

hex_gunmetal_imgs = """    images: [
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.38 PM (3).jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.39 PM.jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.40 PM (1).jpeg',
      '/eyeglassimages/RAY BAN/premium rayban metal rs 4650/WhatsApp Image 2026-09-20 at 2.17.40 PM.jpeg',
    ],"""

# Let's verify these replacement points in the file
print("Searching replacement points for wire and hex...")
assert "id: 'rayban-metal-wire-arista-gold'" in content
assert "id: 'rayban-metal-wire-satin-black'" in content
assert "id: 'rayban-metal-wire-pewter-silver'" in content
assert "id: 'rayban-hex-metal-arista-gold'" in content
assert "id: 'rayban-hex-metal-matte-gunmetal'" in content
assert "id: 'rayban-hex-metal-chrome-silver'" in content
print("All eyeglasses IDs found successfully.")
