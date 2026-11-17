import os, json

brain_dir = r'C:\Users\user\.gemini\antigravity\brain'
for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file == 'transcript.jsonl':
            p = os.path.join(root, file)
            with open(p, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        d = json.loads(line)
                        if d.get('type') == 'USER_INPUT':
                            txt = d.get('content', '')
                            if 'blue cut' in txt.lower() or 'drive safe' in txt.lower():
                                print(f"Found in {p}:")
                                print(txt[:300])
                    except:
                        pass

