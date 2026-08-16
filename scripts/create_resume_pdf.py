import os

def create_resume_pdf(filename="public/resume.pdf"):
    # Standard PDF 1.4 Generator
    objects = []
    
    def add_object(content):
        objects.append(content)
        return len(objects) # 1-based obj index

    # Content Stream for Page 1
    stream_lines = []
    
    def draw_text(text, x, y, font="F1", size=12, r=0, g=0, b=0):
        # Escape parenthesis in PDF strings
        safe_text = text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        stream_lines.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        stream_lines.append("BT")
        stream_lines.append(f"/{font} {size} Tf")
        stream_lines.append(f"{x:.2f} {y:.2f} Td")
        stream_lines.append(f"({safe_text}) Tj")
        stream_lines.append("ET")

    def draw_line(x1, y1, x2, y2, r=0.2, g=0.4, b=0.8, width=1.0):
        stream_lines.append(f"{r:.3f} {g:.3f} {b:.3f} RG")
        stream_lines.append(f"{width:.2f} w")
        stream_lines.append(f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    def draw_rect(x, y, w, h, r=0.95, g=0.96, b=0.98):
        stream_lines.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        stream_lines.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re f")

    # Page Dimensions: A4 = 595.28 x 841.89 points
    PAGE_WIDTH = 595.28
    PAGE_HEIGHT = 841.89
    MARGIN = 45.0
    CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN

    # Top Header Accent Bar
    draw_rect(0, PAGE_HEIGHT - 6, PAGE_WIDTH, 6, r=0.15, g=0.45, b=0.95)

    # Header
    cur_y = PAGE_HEIGHT - 42
    draw_text("SHAIK NASEER JOHN AHMED", MARGIN, cur_y, font="F2", size=20, r=0.08, g=0.12, b=0.20)
    
    cur_y -= 16
    draw_text("Backend & Systems Engineer | Distributed Architectures & High-Concurrency Systems", MARGIN, cur_y, font="F2", size=10, r=0.15, g=0.40, b=0.85)
    
    cur_y -= 14
    contact_info = "Hyderabad, India  |  feznaseer777@gmail.com  |  github.com/Naseer-fez  |  linkedin.com/in/shaik-naseer-633010323"
    draw_text(contact_info, MARGIN, cur_y, font="F1", size=8.5, r=0.35, g=0.40, b=0.48)
    
    cur_y -= 10
    draw_line(MARGIN, cur_y, MARGIN + CONTENT_WIDTH, cur_y, r=0.82, g=0.85, b=0.90, width=1.0)

    # Section Helper
    def add_section_header(title):
        nonlocal cur_y
        cur_y -= 18
        draw_text(title.upper(), MARGIN, cur_y, font="F2", size=10.5, r=0.10, g=0.30, b=0.75)
        cur_y -= 4
        draw_line(MARGIN, cur_y, MARGIN + CONTENT_WIDTH, cur_y, r=0.20, g=0.50, b=0.90, width=1.2)
        cur_y -= 10

    # 1. SUMMARY
    add_section_header("Executive Summary")
    summary_text = [
        "Backend and systems developer specializing in Python, high-throughput streaming I/O, concurrency control,",
        "and database architecture. Creator of open-source packages on PyPI, robust WSGI backends, and low-latency data",
        "pipelines with expertise in WAL-mode SQLite, PostgreSQL concurrency, and scalable systems engineering."
    ]
    for line in summary_text:
        draw_text(line, MARGIN, cur_y, font="F1", size=8.5, r=0.20, g=0.22, b=0.26)
        cur_y -= 11

    # 2. EDUCATION
    add_section_header("Education")
    draw_text("Vignana Bharathi Institute of Technology (VBIT)", MARGIN, cur_y, font="F2", size=9.5, r=0.10, g=0.12, b=0.18)
    draw_text("2024 -- 2028 (Expected)", MARGIN + CONTENT_WIDTH - 100, cur_y, font="F2", size=8.5, r=0.35, g=0.40, b=0.48)
    cur_y -= 11
    draw_text("Bachelor of Technology (B.Tech) in Computer Science and Business Systems (CSBS) -- Hyderabad, India", MARGIN, cur_y, font="F1", size=8.5, r=0.25, g=0.30, b=0.36)
    cur_y -= 10
    draw_text("- Core Focus: Systems Programming, Operating Systems, Database Management, Data Structures & Distributed Algorithms.", MARGIN + 8, cur_y, font="F1", size=8.0, r=0.35, g=0.40, b=0.45)
    cur_y -= 8

    # 3. TECHNICAL SKILLS
    add_section_header("Technical Skills Matrix")
    skills_data = [
        ("Languages & Core:", "Python, SQL (PostgreSQL, MySQL, SQLite), C, C++, JavaScript, TypeScript, HTML5, CSS3, Shell"),
        ("Backend & Frameworks:", "Flask, Flask-JWT-Extended, SQLAlchemy ORM, Gunicorn, Waitress WSGI, stream-zip, rapidfuzz, NumPy"),
        ("Storage & Databases:", "PostgreSQL, MySQL, SQLite (WAL Mode), In-Memory Caching, Reentrant Locking, Dirty-Flag Invalidation"),
        ("DevOps & Cloud:", "Docker Containerization, Linux CLI, Git, GitHub Actions CI/CD, Cloudflare Tunnel, PyPI Publishing")
    ]
    for cat, items in skills_data:
        draw_text(cat, MARGIN, cur_y, font="F2", size=8.5, r=0.12, g=0.16, b=0.22)
        draw_text(items, MARGIN + 120, cur_y, font="F1", size=8.5, r=0.25, g=0.28, b=0.34)
        cur_y -= 11
    cur_y -= 2

    # 4. EXPERIENCE & LEADERSHIP
    add_section_header("Experience & Leadership")
    
    # Exp 1
    draw_text("Helping Hands NGO & Departmental Coding Club -- VBIT", MARGIN, cur_y, font="F2", size=9.5, r=0.10, g=0.12, b=0.18)
    draw_text("2024 -- Present", MARGIN + CONTENT_WIDTH - 80, cur_y, font="F2", size=8.5, r=0.35, g=0.40, b=0.48)
    cur_y -= 11
    draw_text("General Secretary & Technical Lead", MARGIN, cur_y, font="F2", size=8.5, r=0.18, g=0.45, b=0.85)
    cur_y -= 10
    bullets_exp1 = [
        "Architected and deployed student database management systems and automated digital registration portals.",
        "Conducted code review sessions and mentored junior developers in Python algorithms and clean code practices.",
        "Spearheaded technical events, charity hackathons, and departmental coding symposiums across the institute."
    ]
    for b in bullets_exp1:
        draw_text(f"- {b}", MARGIN + 8, cur_y, font="F1", size=8.0, r=0.25, g=0.28, b=0.34)
        cur_y -= 10

    cur_y -= 2
    # Exp 2
    draw_text("Open-Source Software & Python Package Maintainer", MARGIN, cur_y, font="F2", size=9.5, r=0.10, g=0.12, b=0.18)
    draw_text("2024 -- Present", MARGIN + CONTENT_WIDTH - 80, cur_y, font="F2", size=8.5, r=0.35, g=0.40, b=0.48)
    cur_y -= 11
    draw_text("Independent Developer & Publisher", MARGIN, cur_y, font="F2", size=8.5, r=0.18, g=0.45, b=0.85)
    cur_y -= 10
    bullets_exp2 = [
        "Published and actively maintaining open-source tools on the official Python Package Index (PyPI).",
        "Engineered automated packaging pipelines with PyPA build, Twine validation, and GitHub Actions CI matrix."
    ]
    for b in bullets_exp2:
        draw_text(f"- {b}", MARGIN + 8, cur_y, font="F1", size=8.0, r=0.25, g=0.28, b=0.34)
        cur_y -= 10

    # 5. CORE PROJECTS
    add_section_header("Featured Technical Projects")
    
    projects = [
        ("PyPackGen -- Automated PyPI Scaffolding Engine", "Python, Packaging CLI, PyPI API, AST",
         "Architected CLI scaffolding utility automating compliant Python packaging structures, LICENSE/pyproject.toml generation, and PyPI release workflows with zero configuration overhead."),
        
        ("OmniTrack -- Concurrency-Safe Asset Logistics Platform", "Flask, SQLAlchemy, SQLite WAL, HTML5",
         "Engineered a multi-tenant inventory & asset management engine featuring optimistic locking, transactional audit journals, and automated reconciliation under high concurrent requests."),
        
        ("ZipFlow -- High-Throughput Chunked Streaming Archive Engine", "Python, stream-zip, Generator I/O",
         "Developed a low-memory ZIP archive streaming engine capable of assembling and piping multi-gigabyte archives on-the-fly with constant O(1) memory footprint and dynamic compression."),
        
        ("PyFaker -- High-Throughput Synthetic Data Generation Tool", "Python, RegEx, Synthetic Data Gen",
         "Built a high-performance mock dataset generator capable of producing millions of structured records per minute for backend load testing and benchmark simulations.")
    ]
    
    for p_title, p_tech, p_desc in projects:
        draw_text(p_title, MARGIN, cur_y, font="F2", size=8.8, r=0.10, g=0.14, b=0.22)
        draw_text(f"[{p_tech}]", MARGIN + CONTENT_WIDTH - (len(p_tech)*4.6), cur_y, font="F1", size=7.5, r=0.35, g=0.45, b=0.65)
        cur_y -= 10
        draw_text(f"- {p_desc}", MARGIN + 8, cur_y, font="F1", size=8.0, r=0.25, g=0.28, b=0.34)
        cur_y -= 11

    # Bottom Footer
    draw_line(MARGIN, 28, MARGIN + CONTENT_WIDTH, 28, r=0.85, g=0.88, b=0.92, width=0.8)
    draw_text("Shaik Naseer John Ahmed -- Portfolio OS Verified Resume", MARGIN, 18, font="F1", size=7.5, r=0.45, g=0.50, b=0.58)
    draw_text("Generated & Hosted on Naseer.dev Showcase", MARGIN + CONTENT_WIDTH - 160, 18, font="F1", size=7.5, r=0.45, g=0.50, b=0.58)

    stream_content = "\n".join(stream_lines)
    stream_bytes = stream_content.encode("latin1")

    # Object 1: Catalog
    # Object 2: Outlines
    # Object 3: Pages
    # Object 4: Page 1
    # Object 5: Font F1 (Helvetica)
    # Object 6: Font F2 (Helvetica-Bold)
    # Object 7: Content Stream

    catalog_obj = "<< /Type /Catalog /Pages 3 0 R >>"
    outlines_obj = "<< /Type /Outlines /Count 0 >>"
    pages_obj = "<< /Type /Pages /Kids [4 0 R] /Count 1 >>"
    page_obj = f"<< /Type /Page /Parent 3 0 R /MediaBox [0 0 {PAGE_WIDTH:.2f} {PAGE_HEIGHT:.2f}] /Contents 7 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>"
    font1_obj = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
    font2_obj = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
    content_stream_obj = f"<< /Length {len(stream_bytes)} >>\nstream\n{stream_content}\nendstream"

    objs = [catalog_obj, outlines_obj, pages_obj, page_obj, font1_obj, font2_obj, content_stream_obj]

    pdf_parts = [b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"]
    offsets = []

    for idx, obj in enumerate(objs, start=1):
        offsets.append(sum(len(p) for p in pdf_parts))
        pdf_parts.append(f"{idx} 0 obj\n{obj}\nendobj\n".encode("latin1"))

    xref_offset = sum(len(p) for p in pdf_parts)
    xref_table = [
        f"xref\n0 {len(objs) + 1}\n",
        "0000000000 65535 f \n"
    ]
    for off in offsets:
        xref_table.append(f"{off:010d} 00000 n \n")
    
    trailer = f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n"

    pdf_parts.append("".join(xref_table).encode("latin1"))
    pdf_parts.append(trailer.encode("latin1"))

    full_pdf = b"".join(pdf_parts)
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "wb") as f:
        f.write(full_pdf)
    print(f"Generated valid PDF ({len(full_pdf)} bytes) -> {filename}")

if __name__ == "__main__":
    create_resume_pdf("public/resume.pdf")
    create_resume_pdf("public/Shaik_Naseer_Resume.pdf")
