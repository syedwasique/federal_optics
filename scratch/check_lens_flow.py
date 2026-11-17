for fn in ['src/context/CartContext.tsx', 'src/components/CartDrawer.tsx', 'src/components/WhatsAppOrderModal.tsx']:
    print("="*50)
    print(fn)
    print("="*50)
    with open(fn, 'r', encoding='utf-8') as f:
        for i, l in enumerate(f):
            if any(k in l for k in ['lensPackage', 'selectedLens', 'lensPrice', 'lens']):
                print(f"{i+1}: {l.strip()}")

