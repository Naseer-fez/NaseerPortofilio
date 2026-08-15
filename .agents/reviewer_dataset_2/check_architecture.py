import json

p_path = r"d:\CODE\Html\Showcase\src\data\projects.json"
with open(p_path, 'r', encoding='utf-8') as f:
    projects = json.load(f)['projects']

print("=== ARCHITECTURAL MECHANISM ANALYSIS ===")
for idx, p in enumerate(projects):
    arch = p.get('architecture', '')
    metrics = p.get('metrics', [])
    print(f"\n[Project #{idx+1:02d}] {p['title']} ({p['category']})")
    print(f"  Architecture: {arch}")
    print(f"  Metrics: {metrics}")
