import json
import os
import subprocess
import glob

RESEARCH_JSON = r"d:\CODE\Html\Showcase\portfolio_research\projects.json"

with open(RESEARCH_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

projects = data["projects"]

print(f"Auditing {len(projects)} projects for factuality and metric authenticity...\n")

# Find all git repos on D:\CODE
git_repos = {}
search_dirs = [
    r"d:\CODE",
    r"d:\CODE\GithubCodes",
    r"d:\CODE\Utlities",
    r"d:\CODE\PYTHON\CODE\Projects",
    r"d:\CODE\Html\Showcase",
    r"d:\CODE\DSA"
]

for base in search_dirs:
    if os.path.exists(base):
        # check if base is a git repo
        try:
            res = subprocess.run(["git", "remote", "-v"], cwd=base, capture_output=True, text=True, timeout=5)
            if res.returncode == 0 and res.stdout.strip():
                git_repos[base] = res.stdout.strip()
        except Exception:
            pass
        # check subdirs
        try:
            for item in os.listdir(base):
                subpath = os.path.join(base, item)
                if os.path.isdir(subpath) and os.path.exists(os.path.join(subpath, ".git")):
                    try:
                        res = subprocess.run(["git", "remote", "-v"], cwd=subpath, capture_output=True, text=True, timeout=5)
                        if res.returncode == 0 and res.stdout.strip():
                            git_repos[subpath] = res.stdout.strip()
                    except Exception:
                        pass
        except Exception:
            pass

print("=== Discovered Git Repositories on Disk ===")
for path, remote in git_repos.items():
    print(f"Path: {path}\n  Remote:\n    {remote.replace('\n', '\n    ')}")

print("\n=== Verifying Each Project in Dataset ===")
for idx, p in enumerate(projects):
    title = p["title"]
    gh = p["githubUrl"]
    demo = p.get("demoUrl")
    repo_name = gh.split("/")[-1]
    metrics = p.get("metrics", [])
    
    matching_repos = [k for k, v in git_repos.items() if repo_name.lower() in v.lower() or repo_name.lower() in k.lower()]
    print(f"[{idx+1}/{len(projects)}] {title}")
    print(f"  Category: {p['category']} | Featured: {p['featured']}")
    print(f"  GitHub URL: {gh} (Repo: {repo_name})")
    print(f"  Demo URL: {demo}")
    print(f"  Matching Local Repos: {matching_repos}")
    print(f"  Metrics: {metrics}")
    print()
