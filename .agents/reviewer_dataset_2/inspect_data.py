import json

p1_path = r"d:\CODE\Html\Showcase\src\data\projects.json"
p2_path = r"d:\CODE\Html\Showcase\portfolio_research\projects.json"

with open(p1_path, 'r', encoding='utf-8') as f:
    p1 = json.load(f)

with open(p2_path, 'r', encoding='utf-8') as f:
    p2 = json.load(f)

print(f"src/data/projects.json total projects: {len(p1['projects'])}")
print(f"portfolio_research/projects.json total projects: {len(p2['projects'])}")
print(f"Are both JSON files equal?: {p1 == p2}")

projects = p1['projects']

for idx, p in enumerate(projects):
    title = p.get('title')
    cat = p.get('category')
    featured = p.get('featured')
    desc = p.get('description')
    arch = p.get('architecture')
    metrics = p.get('metrics', [])
    techs = p.get('technologies', [])
    gh = p.get('githubUrl')
    demo = p.get('demoUrl')
    
    print(f"=== [RANK {idx+1}] {title} ===")
    print(f"Category: {cat} | Featured: {featured}")
    print(f"Technologies: {techs}")
    print(f"Description: {desc}")
    print(f"Architecture: {arch}")
    print(f"Metrics: {metrics}")
    print(f"GitHub: {gh}")
    print(f"Demo: {demo}\n")

cats = {}
for p in projects:
    cats[p['category']] = cats.get(p['category'], 0) + 1

print("--- CATEGORY BREAKDOWN ---")
for cat, count in sorted(cats.items()):
    print(f"  {cat}: {count} ({count/len(projects)*100:.1f}%)")
