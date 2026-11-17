import sys
sys.path.append('.')
import temp_assets.audit_catalog as ac

for b, prods in sorted(ac.by_brand.items()):
    pids = [p['id'] for p in prods]
    print(f"{b} ({len(prods)}): {pids}\n")
