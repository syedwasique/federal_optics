import json

with open(r'C:\Users\user\.gemini\antigravity\brain\f60cbf5a-b246-4ef1-b1ad-841314c2ef50\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            if any(k in content.lower() for k in ['coating', 'blue cut', 'photosun', 'drive safe', 'demo lens', 'frame only', 'technology']):
                print("FOUND USER INPUT:")
                print(content[:500])
                print("="*40)

