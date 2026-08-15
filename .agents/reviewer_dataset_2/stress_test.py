import json
import re

def run_stress_test():
    p1_path = r"d:\CODE\Html\Showcase\src\data\projects.json"
    p2_path = r"d:\CODE\Html\Showcase\portfolio_research\projects.json"
    
    with open(p1_path, 'r', encoding='utf-8') as f:
        p1 = json.load(f)
    with open(p2_path, 'r', encoding='utf-8') as f:
        p2 = json.load(f)

    assert p1 == p2, "Datasets are not identical!"
    
    projects = p1['projects']
    print(f"Total projects in dataset: {len(projects)}")
    
    required_fields = [
        'title', 'category', 'featured', 'description', 
        'technologies', 'architecture', 'metrics', 'githubUrl', 'demoUrl'
    ]
    
    valid_categories = {'SYSTEMS', 'AI / ML', 'FULL STACK', 'CLOUD', 'CREATIVE', 'DATABASE', 'DEVOPS'}
    category_counts = {cat: 0 for cat in valid_categories}
    
    titles_seen = set()
    github_urls_seen = set()
    
    errors = []
    warnings = []
    
    for idx, p in enumerate(projects):
        # 1. Field presence and types
        for f in required_fields:
            if f not in p:
                errors.append(f"Project #{idx+1} ({p.get('title', 'UNKNOWN')}): Missing required field '{f}'")
            elif p[f] is None:
                errors.append(f"Project #{idx+1} ({p.get('title', 'UNKNOWN')}): Field '{f}' is null")
        
        title = p.get('title', '')
        if title in titles_seen:
            errors.append(f"Duplicate title found: '{title}'")
        titles_seen.add(title)
        
        # 2. Category check
        cat = p.get('category', '')
        if cat not in valid_categories:
            errors.append(f"Project '{title}' has invalid category '{cat}'")
        else:
            category_counts[cat] += 1
            
        # 3. Featured check
        featured = p.get('featured')
        if not isinstance(featured, bool):
            errors.append(f"Project '{title}': 'featured' is not boolean ({featured})")
            
        # 4. Description checks (1 sentence, concise, ends with period)
        desc = p.get('description', '')
        if not desc:
            errors.append(f"Project '{title}': Empty description")
        else:
            sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', desc) if s.strip()]
            if len(sentences) != 1:
                warnings.append(f"Project '{title}': Description has {len(sentences)} sentences: '{desc}'")
            if not desc.endswith('.'):
                warnings.append(f"Project '{title}': Description does not end with period")
                
        # 5. Architecture checks (must contain concrete mechanisms)
        arch = p.get('architecture', '')
        if not arch or len(arch) < 30:
            errors.append(f"Project '{title}': Architecture description too short or empty ('{arch}')")
            
        # 6. Tech stack
        techs = p.get('technologies', [])
        if not isinstance(techs, list) or len(techs) == 0:
            errors.append(f"Project '{title}': Technologies must be a non-empty list")
        for t in techs:
            if not isinstance(t, str) or not t.strip():
                errors.append(f"Project '{title}': Invalid tech item '{t}'")
                
        # 7. Metrics
        metrics = p.get('metrics', [])
        if not isinstance(metrics, list) or len(metrics) == 0:
            errors.append(f"Project '{title}': Metrics must be a non-empty list")
        for m in metrics:
            if not isinstance(m, str) or not m.strip():
                errors.append(f"Project '{title}': Invalid metric item '{m}'")
                
        # 8. URLs
        gh = p.get('githubUrl', '')
        demo = p.get('demoUrl', '')
        if not gh.startswith(('http://', 'https://')):
            errors.append(f"Project '{title}': Invalid githubUrl '{gh}'")
        if not demo.startswith(('http://', 'https://')):
            errors.append(f"Project '{title}': Invalid demoUrl '{demo}'")
            
    print("\n--- STRESS TEST REPORT ---")
    print(f"Total Errors: {len(errors)}")
    print(f"Total Warnings: {len(warnings)}")
    if errors:
        print("ERRORS:")
        for e in errors:
            print(f"  [!] {e}")
    if warnings:
        print("WARNINGS:")
        for w in warnings:
            print(f"  [*] {w}")
            
    print("\n--- CATEGORY REPRESENTATION ---")
    for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat:12s}: {count:2d} ({count/len(projects)*100:5.1f}%)")
        
    print("\nAll required categories represented:", all(c > 0 for c in category_counts.values()))
    
    # Check ranking order
    print("\n--- RANKING ORDER & FEATURED STATUS ---")
    for i, p in enumerate(projects):
        print(f"  Rank #{i+1:02d} | Featured: {str(p['featured']):5s} | Category: {p['category']:10s} | {p['title']}")

if __name__ == '__main__':
    run_stress_test()
