with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = '      "/eyeglassimages/Transparent Lenses/use this image wuth every transparent lense category .jpeg",\n'
count = content.count(target)
print(f"Target occurrences found: {count}")

new_content = content.replace(target, '')
with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Removed {count} occurrences of target.")

