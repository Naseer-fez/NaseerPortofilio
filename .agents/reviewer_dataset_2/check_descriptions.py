import json
import re

p_path = r"d:\CODE\Html\Showcase\src\data\projects.json"
with open(p_path, 'r', encoding='utf-8') as f:
    projects = json.load(f)['projects']

print(f"Total projects: {len(projects)}\n")

for idx, p in enumerate(projects):
    desc = p['description']
    # Check sentence count
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', desc) if s.strip()]
    sentence_count = len(sentences)
    word_count = len(desc.split())
    ends_with_period = desc.endswith('.')
    
    print(f"Project #{idx+1:02d}: {p['title']}")
    print(f"  Category: {p['category']}")
    print(f"  Sentence count: {sentence_count}")
    print(f"  Word count: {word_count}")
    print(f"  Ends with period: {ends_with_period}")
    print(f"  Description: \"{desc}\"")
    print(f"  Passes 1-sentence requirement?: {sentence_count == 1 and ends_with_period}")
    print()
