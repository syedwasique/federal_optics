import os
import datetime

now = datetime.datetime.now()
one_week_ago = now - datetime.timedelta(days=7)

new_files = []
base_abs = os.path.abspath('public')
long_prefix = "\\\\?\\" + base_abs

for root, dirs, files in os.walk(long_prefix):
    for f in files:
        p = os.path.join(root, f)
        try:
            st = os.stat(p)
            ctime = datetime.datetime.fromtimestamp(st.st_ctime)
            mtime = datetime.datetime.fromtimestamp(st.st_mtime)
            latest = max(ctime, mtime)
            if latest >= one_week_ago:
                new_files.append((p, ctime, mtime))
        except Exception as e:
            pass

print(f"Total files added or modified in last 7 days: {len(new_files)}")
dirs_map = {}
for p, c, m in new_files:
    d = os.path.dirname(p)
    clean_d = d.replace(long_prefix, 'public')
    if clean_d not in dirs_map:
        dirs_map[clean_d] = []
    dirs_map[clean_d].append((os.path.basename(p), c, m))

for d in sorted(dirs_map.keys()):
    files = dirs_map[d]
    latest_t = max(max(c, m) for _, c, m in files)
    earliest_t = min(min(c, m) for _, c, m in files)
    print(f"\n{d} ({len(files)} files)")
    print(f"  Range: {earliest_t.strftime('%Y-%m-%d %H:%M')} to {latest_t.strftime('%Y-%m-%d %H:%M')}")
    print(f"  Samples: {[f[0] for f in files[:3]]}")

