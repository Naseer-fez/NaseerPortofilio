import json
import os
import re
import subprocess
import sys

RESEARCH_JSON = r"d:\CODE\Html\Showcase\portfolio_research\projects.json"
SRC_JSON = r"d:\CODE\Html\Showcase\src\data\projects.json"

ALLOWED_CATEGORIES = {
    "SYSTEMS",
    "AI / ML",
    "FULL STACK",
    "BACKEND",
    "DEVOPS",
    "CREATIVE",
    "DATABASE",
    "CLOUD"
}

def audit_deliverables():
    report = {
        "file_existence": False,
        "json_validity": False,
        "files_identical": False,
        "schema_compliance": True,
        "project_count": 0,
        "featured_count": 0,
        "category_distribution": {},
        "technology_checks": [],
        "url_checks": [],
        "metric_checks": [],
        "errors": []
    }

    # 1. Existence
    if not os.path.exists(RESEARCH_JSON):
        report["errors"].append(f"Missing file: {RESEARCH_JSON}")
    if not os.path.exists(SRC_JSON):
        report["errors"].append(f"Missing file: {SRC_JSON}")
    if report["errors"]:
        return report
    report["file_existence"] = True

    # 2. Syntactic validity
    try:
        with open(RESEARCH_JSON, "r", encoding="utf-8") as f:
            raw_research = f.read()
            data_research = json.loads(raw_research)
        with open(SRC_JSON, "r", encoding="utf-8") as f:
            raw_src = f.read()
            data_src = json.loads(raw_src)
        report["json_validity"] = True
    except Exception as e:
        report["errors"].append(f"JSON Parse Error: {e}")
        return report

    # 3. Identical content
    if raw_research.strip() != raw_src.strip():
        report["errors"].append("Files are not byte/text identical!")
    else:
        report["files_identical"] = True

    # Check top-level structure
    if not isinstance(data_research, dict) or "projects" not in data_research:
        report["errors"].append("Root JSON must be an object with a 'projects' array.")
        return report

    projects = data_research["projects"]
    report["project_count"] = len(projects)

    # 4. Project Count
    if not (15 <= len(projects) <= 20):
        report["schema_compliance"] = False
        report["errors"].append(f"Project count is {len(projects)}, expected between 15 and 20.")

    # 5. Schema checks for each project
    featured_count = 0
    categories_seen = {}

    expected_keys = {
        "title", "category", "featured", "description",
        "technologies", "architecture", "metrics", "githubUrl", "demoUrl"
    }

    for idx, p in enumerate(projects):
        p_title = p.get("title", f"<Project {idx}>")
        
        # Key set check
        p_keys = set(p.keys())
        if p_keys != expected_keys:
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' has incorrect keys: missing {expected_keys - p_keys}, extra {p_keys - expected_keys}")

        # title
        if not isinstance(p.get("title"), str) or not p.get("title").strip():
            report["schema_compliance"] = False
            report["errors"].append(f"Project [{idx}] title must be a non-empty string.")

        # category
        cat = p.get("category")
        if cat not in ALLOWED_CATEGORIES:
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' has invalid category '{cat}'. Must be one of {sorted(ALLOWED_CATEGORIES)}")
        categories_seen[cat] = categories_seen.get(cat, 0) + 1

        # featured
        feat = p.get("featured")
        if not isinstance(feat, bool):
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' featured must be boolean.")
        elif feat:
            featured_count += 1

        # description
        desc = p.get("description")
        if not isinstance(desc, str) or not desc.strip():
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' description must be non-empty string.")

        # technologies
        techs = p.get("technologies")
        if not isinstance(techs, list) or len(techs) < 1:
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' technologies must be a non-empty list.")
        else:
            # Check visible items and '+N' pattern
            # Requirement: 4-5 visible items, and '+N' for remainder if more
            plus_items = [t for t in techs if re.match(r'^\+\d+$', str(t).strip())]
            visible_items = [t for t in techs if not re.match(r'^\+\d+$', str(t).strip())]
            
            if len(plus_items) > 1:
                report["schema_compliance"] = False
                report["errors"].append(f"Project '{p_title}' has multiple '+N' items in technologies: {plus_items}")
            
            if not (4 <= len(visible_items) <= 5):
                report["schema_compliance"] = False
                report["errors"].append(f"Project '{p_title}' has {len(visible_items)} visible technologies, expected 4 or 5.")

            report["technology_checks"].append({
                "title": p_title,
                "visible_count": len(visible_items),
                "visible_techs": visible_items,
                "plus_item": plus_items[0] if plus_items else None
            })

        # architecture
        arch = p.get("architecture")
        if not isinstance(arch, str) or not arch.strip():
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' architecture must be non-empty string.")

        # metrics
        mets = p.get("metrics")
        if not isinstance(mets, list) or len(mets) == 0:
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' metrics must be a non-empty list.")
        else:
            for m in mets:
                if not isinstance(m, str) or not m.strip():
                    report["schema_compliance"] = False
                    report["errors"].append(f"Project '{p_title}' has invalid metric item: {m}")
            report["metric_checks"].append({
                "title": p_title,
                "metrics": mets
            })

        # githubUrl
        gh = p.get("githubUrl")
        if not isinstance(gh, str) or not re.match(r'^https://github\.com/Naseer-fez/[A-Za-z0-9_.-]+$', gh):
            report["schema_compliance"] = False
            report["errors"].append(f"Project '{p_title}' githubUrl '{gh}' is not a valid Naseer-fez repo URL.")

        # demoUrl
        du = p.get("demoUrl")
        if du is not None:
            if not isinstance(du, str) or not (du.startswith("http://") or du.startswith("https://")):
                report["schema_compliance"] = False
                report["errors"].append(f"Project '{p_title}' demoUrl '{du}' is not a valid URL.")

        report["url_checks"].append({
            "title": p_title,
            "githubUrl": gh,
            "demoUrl": du
        })

    report["featured_count"] = featured_count
    if not (3 <= featured_count <= 5):
        report["schema_compliance"] = False
        report["errors"].append(f"Featured count is {featured_count}, expected between 3 and 5.")

    report["category_distribution"] = categories_seen
    return report

if __name__ == "__main__":
    rep = audit_deliverables()
    print(json.dumps(rep, indent=2))
