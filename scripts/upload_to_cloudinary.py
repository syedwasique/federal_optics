import os
import sys
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Load credentials from .env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
cloud_name = "tyrukjzt"
api_key = "712729473832752"
api_secret = "osPDNH15bAHCoh4jzgDJlQZOgdg"

if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("CLOUDINARY_CLOUD_NAME="):
                cloud_name = line.split("=", 1)[1].strip()
            elif line.startswith("CLOUDINARY_API_KEY="):
                api_key = line.split("=", 1)[1].strip()
            elif line.startswith("CLOUDINARY_API_SECRET="):
                api_secret = line.split("=", 1)[1].strip()

cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True
)

workspace_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
public_dir = os.path.join(workspace_dir, "public")
mapping_file = os.path.join(workspace_dir, "cloudinary_mapping.json")

def load_mapping():
    if os.path.exists(mapping_file):
        try:
            with open(mapping_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_mapping(mapping):
    temp_file = mapping_file + ".tmp"
    with open(temp_file, "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2)
    if os.path.exists(mapping_file):
        os.remove(mapping_file)
    os.rename(temp_file, mapping_file)

def get_all_images(limit_folder=None):
    prefix = "\\\\?\\" + os.path.abspath(public_dir)
    images = []
    
    valid_exts = (".jpg", ".jpeg", ".png", ".webp")
    
    for root, dirs, files in os.walk(prefix):
        # Ignore audit html dirs or scratch
        for f in sorted(files):
            ext = os.path.splitext(f)[1].lower()
            if ext in valid_exts:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, prefix).replace("\\", "/")
                
                if limit_folder and not rel_path.startswith(limit_folder):
                    continue
                    
                images.append(("/" + rel_path, full_path))
    return images

def upload_single_image(web_path, full_disk_path):
    rel_clean = web_path.lstrip("/")
    folder_part = os.path.dirname(rel_clean).replace("&", "and")
    filename = os.path.splitext(os.path.basename(rel_clean))[0].strip().replace("&", "and")
    
    # Target folder in Cloudinary
    cloudinary_folder = ("federal-optics/" + folder_part).rstrip("/")
    
    # Retry up to 3 times for network resilience
    max_retries = 3
    for attempt in range(max_retries):
        try:
            res = cloudinary.uploader.upload(
                full_disk_path,
                folder=cloudinary_folder,
                public_id=filename,
                use_filename=True,
                unique_filename=False,
                overwrite=True,
                resource_type="image"
            )
            return web_path, res.get("secure_url"), None
        except Exception as e:
            if attempt == max_retries - 1:
                return web_path, None, str(e)
            time.sleep(1)

def run_upload(limit_count=None, limit_folder=None, max_workers=10):
    print("==================================================")
    print("FEDERAL OPTICS -> CLOUDINARY UPLOAD PIPELINE")
    print(f"Cloud Name: {cloud_name}")
    print("==================================================")
    
    all_images = get_all_images(limit_folder=limit_folder)
    print(f"Found {len(all_images)} total image files on disk.")
    
    mapping = load_mapping()
    print(f"Already uploaded in mapping: {len(mapping)} images.")
    
    # Filter out already uploaded
    to_upload = [(w, d) for w, d in all_images if w not in mapping]
    print(f"Remaining images to upload: {len(to_upload)}")
    
    if limit_count:
        to_upload = to_upload[:limit_count]
        print(f"Limiting to first {len(to_upload)} images for this run.")
        
    if not to_upload:
        print("Nothing to upload! All files already in mapping.")
        return mapping
        
    start_time = time.time()
    completed = 0
    total = len(to_upload)
    errors = 0
    
    print(f"\nStarting upload with {max_workers} worker threads...\n")
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(upload_single_image, w, d): w for w, d in to_upload}
        
        for future in as_completed(futures):
            web_path, secure_url, err = future.result()
            completed += 1
            if secure_url:
                mapping[web_path] = secure_url
                print(f"[{completed:04d}/{total:04d}] OK: {web_path[:40]}... -> {secure_url}")
            else:
                errors += 1
                print(f"[{completed:04d}/{total:04d}] ERROR {web_path}: {err}")
                
            # Periodically save mapping
            if completed % 10 == 0 or completed == total:
                save_mapping(mapping)
                
    elapsed = time.time() - start_time
    print("\n==================================================")
    print(f"Upload complete in {elapsed:.1f}s.")
    print(f"Successfully processed: {completed - errors}")
    print(f"Errors: {errors}")
    print(f"Total entries in cloudinary_mapping.json: {len(mapping)}")
    print("==================================================")
    return mapping

if __name__ == "__main__":
    # Check command-line args
    # python upload_to_cloudinary.py --test (uploads 3 images only)
    # python upload_to_cloudinary.py --all (uploads all)
    if "--test" in sys.argv:
        run_upload(limit_count=3)
    elif "--folder" in sys.argv:
        idx = sys.argv.index("--folder")
        folder = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else None
        run_upload(limit_folder=folder)
    elif "--all" in sys.argv:
        run_upload()
    else:
        # Default run test of 3
        print("Usage: python upload_to_cloudinary.py [--test | --all | --folder <path>]")
        print("Running safe test with 3 images:")
        run_upload(limit_count=3)

