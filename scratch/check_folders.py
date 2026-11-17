import os
import datetime

base = r"public\eyeglassimages"
now = datetime.datetime.now()
one_week_ago = now - datetime.timedelta(days=7)

recent_dirs = []
for root, dirs, files in os.walk(base):
    for d in dirs:
        p = os.path.join(root, d)
        try:
            stat = os.stat(p)
            ctime = datetime.datetime.fromtimestamp(stat.st_ctime)
            mtime = datetime.datetime.fromtimestamp(stat.st_mtime)
            latest = max(ctime, mtime)
            # Check if created or modified recently
            if latest >= one_week_ago:
                direct_files = [f for f in os.listdir(p) if os.path.isfile(os.path.join(p, f))]
                recent_dirs.append({
                    "full_path": p,
                    "rel_path": os.path.relpath(p, base),
                    "ctime": ctime,
                    "mtime": mtime,
                    "latest": latest,
                    "files": direct_files
                })
        except Exception as e:
            pass

# Also let's check root files in Transparent Lenses if any
recent_dirs.sort(key=lambda x: x["latest"], reverse=True)

print(f"Total recent items: {len(recent_dirs)}")
for item in recent_dirs:
    print(f"Folder: {item['rel_path']}")
    print(f"  Created: {item['ctime'].strftime('%Y-%m-%d %H:%M')}")
    print(f"  Modified: {item['mtime'].strftime('%Y-%m-%d %H:%M')}")
    print(f"  Files count: {len(item['files'])}")
    if item['files']:
        print(f"  Files: {item['files'][:6]}")
    print("-" * 50)
