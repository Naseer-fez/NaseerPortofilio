export interface VFSItem {
  id: string;
  name: string;
  parentId: string;
  type: 'folder' | 'app' | 'document' | 'picture' | 'download';
  size: string;
  modified: string;
  appId?: string;
  iconName: string;
  description?: string;
  contentPreview?: string;
  realFilePath?: string;
  rating?: number;
  reviews?: string;
  developer?: string;
}

export interface VFSFolder {
  id: string;
  name: string;
  iconName: string;
  path: string;
}

export const VFS_FOLDERS: VFSFolder[] = [
  { id: 'apps', name: 'Applications', iconName: 'AppWindow', path: '/Applications' },
  { id: 'docs', name: 'Documents', iconName: 'FileText', path: '/Users/naseer/Documents' },
  { id: 'pics', name: 'Pictures', iconName: 'Image', path: '/Users/naseer/Pictures' },
  { id: 'downloads', name: 'Downloads', iconName: 'Download', path: '/Users/naseer/Downloads' },
];

export const VFS_ITEMS: VFSItem[] = [
  // Applications
  {
    id: 'app-terminal',
    name: 'Terminal.app',
    parentId: 'apps',
    type: 'app',
    size: '14.2 MB',
    modified: '2026-08-15',
    appId: 'terminal',
    iconName: 'Terminal',
    description: 'Interactive Unix Shell CLI with Neofetch & Matrix mode',
    contentPreview: 'Executable application bundle for Portfolio OS Terminal.',
    rating: 4.9,
    reviews: '1,204',
    developer: 'Naseer John Ahmed',
  },
  {
    id: 'app-projects',
    name: 'Projects.app',
    parentId: 'apps',
    type: 'app',
    size: '28.6 MB',
    modified: '2026-08-15',
    appId: 'projects',
    iconName: 'Briefcase',
    description: 'Interactive portfolio projects showcase gallery',
    contentPreview: 'Executable application bundle for Projects Showcase.',
  },
  {
    id: 'app-about',
    name: 'About Me.app',
    parentId: 'apps',
    type: 'app',
    size: '18.4 MB',
    modified: '2026-08-15',
    appId: 'about',
    iconName: 'User',
    description: 'Developer biography, career timeline, and skills matrix',
    contentPreview: 'Executable application bundle for Developer Profile.',
  },
  {
    id: 'app-finder',
    name: 'Finder.app',
    parentId: 'apps',
    type: 'app',
    size: '32.1 MB',
    modified: '2026-08-15',
    appId: 'finder',
    iconName: 'Folder',
    description: 'macOS Virtual File System Browser',
    contentPreview: 'Core system file manager for Portfolio OS.',
  },
  {
    id: 'app-settings',
    name: 'Settings.app',
    parentId: 'apps',
    type: 'app',
    size: '22.0 MB',
    modified: '2026-08-15',
    appId: 'settings',
    iconName: 'Settings',
    description: 'System Preferences: Wallpapers, Themes, Sound, Dock',
    contentPreview: 'System preferences application configuration suite.',
  },
  {
    id: 'app-mail',
    name: 'Mail.app',
    parentId: 'apps',
    type: 'app',
    size: '16.8 MB',
    modified: '2026-08-15',
    appId: 'mail',
    iconName: 'Mail',
    description: 'macOS Mail Contact Dispatch Client',
    contentPreview: 'Direct contact messaging client with instant validation.',
  },

  // Documents
  {
    id: 'doc-resume',
    name: 'Resume_Shaik_Naseer_John_Ahmed.pdf',
    parentId: 'docs',
    type: 'document',
    size: '240 KB',
    modified: '2026-08-15',
    iconName: 'FileText',
    description: 'Backend & Systems Engineer Resume — Shaik Naseer John Ahmed',
    contentPreview:
      'SHAIK NASEER JOHN AHMED\nPhone: +91 7780650107 | Email: sknaseer.fez@gmail.com | Hyderabad, India\nGitHub: github.com/Naseer-fez\n\nEDUCATION:\nVignana Bharathi Institute of Technology (VBIT), Hyderabad (Expected May 2028)\nB.Tech in Computer Science and Business Systems (CSBS)\n\nTECHNICAL SKILLS:\nLanguages: Python, C, C++, JavaScript, SQL, HTML/CSS\nFrameworks: Flask, SQLAlchemy, Flask-JWT-Extended, stream-zip, rapidfuzz, NumPy, Matplotlib\nDatabases: SQLite, PostgreSQL, MySQL\nCloud & DevOps: Docker, Cloudflare Tunnel, GitHub Actions CI/CD, Gunicorn, Waitress\nDeveloper Tools: Git, Linux, PyPI (Package Publishing), PyInstaller\n\nPROJECTS:\n1. NasCloud — Self-Hosted Cloud Storage Platform\n2. apirlpy — High-Performance API Rate Limiter (Published on PyPI)\n3. TapNap — Code-Based Ephemeral Link Sharing Platform\n\nLEADERSHIP & ACTIVITIES:\n- Founder & Lead, Departmental Coding Club — VBIT (CSBS)\n- Co-Lead, Tech Team — Arrna\n- Vice President, Street Cause (Pan-India Student NGO, 65+ institutions)\n- Social Media Coordinator, Eco Club & Robotics Club — VBIT',
  },
  {
    id: 'doc-arch-notes',
    name: 'NasCloud_Architecture_Notes.md',
    parentId: 'docs',
    type: 'document',
    size: '14.2 KB',
    modified: '2026-08-12',
    iconName: 'FileCode',
    description: 'Architectural blueprints for streaming I/O and zero-config outbound tunnels',
    contentPreview:
      '# NasCloud Storage Engine Architecture\n\n## 1. Streaming I/O Pipeline\n- Generator-based zip streaming using `stream-zip`\n- Zero intermediate disk file writes during folder download\n- Per-user quota enforcement with dirty-flag cache invalidation\n\n## 2. Remote Access Tunneling\n- Outbound persistent connections to coordination server\n- Automatic endpoint registration bypassing symmetric NAT & CGNAT\n- Multi-stage path sanitization stripping `..` and root drive references\n- Cryptographically signed URL tokens with server-side expiration',
  },
  {
    id: 'doc-apirlpy-bench',
    name: 'apirlpy_Benchmark_Telemetry.txt',
    parentId: 'docs',
    type: 'document',
    size: '9.4 KB',
    modified: '2026-08-14',
    iconName: 'FileText',
    description: 'Concurrency and tail-latency benchmark results across 100k simulated clients',
    contentPreview:
      'BENCHMARK TELEMETRY — APIRLPY RATE LIMITER\n--------------------------------------------\nClients: 100,000 simulated client IPs\nThreads: 64 concurrent worker threads\nIn-Memory P95 Latency: 0.12 ms\nIn-Memory P99 Latency: 0.38 ms\nDurable SQLite WAL Latency: 1.45 ms\nRace Conditions Detected: 0 (Reentrant Locking verified)\nMemory Footprint: < 18 MB baseline RSS under sustained 64-thread load',
  },
  {
    id: 'doc-tapnap-specs',
    name: 'TapNap_Security_Whitepaper.pdf',
    parentId: 'docs',
    type: 'document',
    size: '1.2 MB',
    modified: '2026-08-08',
    iconName: 'FileText',
    description: 'Ephemeral data lifecycle management & cryptographic TTL enforcement',
    contentPreview:
      'Abstract: TapNap implements dual-tiered link lifecycle management combining request-time TTL calculation with deterministic background purging threads, hardened with cryptographic OTP verification.',
  },

  // Pictures
  {
    id: 'pic-avatar',
    name: 'Developer_Avatar.png',
    parentId: 'pics',
    type: 'picture',
    size: '420 KB',
    modified: '2026-08-01',
    iconName: 'Image',
    description: 'Shaik Naseer John Ahmed — Profile Portrait',
    contentPreview: 'Developer avatar portrait in high definition.',
    realFilePath: '/favicon.png',
  },
  {
    id: 'pic-bench-1',
    name: '1_single_worker_throughput_latency.svg',
    parentId: 'pics',
    type: 'picture',
    size: '64 KB',
    modified: '2026-08-16',
    iconName: 'Image',
    description: 'apirlpy Single Worker Throughput Latency',
    realFilePath: '/finder-data/apirlpy/benchmarks/1_single_worker_throughput_latency.svg',
  },
  {
    id: 'pic-bench-2',
    name: '2_latency_percentiles_distribution.svg',
    parentId: 'pics',
    type: 'picture',
    size: '45 KB',
    modified: '2026-08-16',
    iconName: 'Image',
    description: 'apirlpy Latency Percentiles Distribution',
    realFilePath: '/finder-data/apirlpy/benchmarks/2_latency_percentiles_distribution.svg',
  },
  {
    id: 'pic-bench-3',
    name: '3_memory_footprint_scaling.svg',
    parentId: 'pics',
    type: 'picture',
    size: '58 KB',
    modified: '2026-08-16',
    iconName: 'Image',
    description: 'apirlpy Memory Footprint Scaling',
    realFilePath: '/finder-data/apirlpy/benchmarks/3_memory_footprint_scaling.svg',
  },
  {
    id: 'pic-bench-4',
    name: '4_multi_worker_contention_performance.svg',
    parentId: 'pics',
    type: 'picture',
    size: '63 KB',
    modified: '2026-08-16',
    iconName: 'Image',
    description: 'apirlpy Multi-Worker Contention Performance',
    realFilePath: '/finder-data/apirlpy/benchmarks/4_multi_worker_contention_performance.svg',
  },
  {
    id: 'pic-bench-5',
    name: '5_rate_limit_security_integrity.svg',
    parentId: 'pics',
    type: 'picture',
    size: '56 KB',
    modified: '2026-08-16',
    iconName: 'Image',
    description: 'apirlpy Rate Limit Security Integrity',
    realFilePath: '/finder-data/apirlpy/benchmarks/5_rate_limit_security_integrity.svg',
  },
  {
    id: 'pic-bench-6',
    name: '6_performance_gap_summary_radar.svg',
    parentId: 'pics',
    type: 'picture',
    size: '61 KB',
    modified: '2026-08-16',
    iconName: 'Image',
    description: 'apirlpy Performance Gap Summary Radar',
    realFilePath: '/finder-data/apirlpy/benchmarks/6_performance_gap_summary_radar.svg',
  },
  {
    id: 'pic-sonoma',
    name: 'Sonoma_Wallpaper_4K.webp',
    parentId: 'pics',
    type: 'picture',
    size: '3.4 MB',
    modified: '2026-08-05',
    iconName: 'Image',
    description: 'macOS Sonoma Dynamic Glassmorphism Background',
    contentPreview: 'Ultra HD 3840x2160 native desktop wallpaper.',
    realFilePath: '/logo.png',
  },
  {
    id: 'pic-nascloud-arch',
    name: 'NasCloud_Tunneling_Diagram.svg',
    parentId: 'pics',
    type: 'picture',
    size: '72 KB',
    modified: '2026-08-11',
    iconName: 'Image',
    description: 'Outbound Tunnel Connection & NAT Traversal Vector Topology',
    contentPreview: 'Vector graphic detailing outbound socket handshake with coordination server.',
    realFilePath: '/finder-data/apirlpy/benchmarks/5_rate_limit_security_integrity.svg',
  },
  {
    id: 'pic-rate-limiter',
    name: 'Rate_Limiter_Latency_Graph.png',
    parentId: 'pics',
    type: 'picture',
    size: '560 KB',
    modified: '2026-08-09',
    iconName: 'Image',
    description: 'P95/P99 latency distribution graph across 100k requests',
    contentPreview: 'Performance plot showing linear tail-latency scaling under heavy concurrent load.',
    realFilePath: '/finder-data/apirlpy/benchmarks/1_single_worker_throughput_latency.svg',
  },

  // Downloads
  {
    id: 'dl-bundle',
    name: 'naseer_portfolio_source.zip',
    parentId: 'downloads',
    type: 'download',
    size: '14.2 MB',
    modified: '2026-08-15',
    iconName: 'Archive',
    description: 'Complete TypeScript source code bundle',
    contentPreview: 'Compressed ZIP archive containing Next.js 14 application sources.',
  },
  {
    id: 'dl-apirlpy-pkg',
    name: 'apirlpy-0.1.0-py3-none-any.whl',
    parentId: 'downloads',
    type: 'download',
    size: '48.5 KB',
    modified: '2026-08-14',
    iconName: 'Binary',
    description: 'apirlpy Python Wheel Package (PyPI distribution build)',
    contentPreview: 'Published wheel package for apirlpy request throttling engine.',
  },
  {
    id: 'dl-telemetry',
    name: 'rate_limiter_benchmarks.json',
    parentId: 'downloads',
    type: 'download',
    size: '95 KB',
    modified: '2026-08-14',
    iconName: 'FileCode',
    description: 'Performance telemetry benchmarks (P95, P99, memory, thread pool)',
    contentPreview: '{"clients": 100000, "threads": 64, "p95_ms": 0.12, "p99_ms": 0.38, "status": "verified"}',
  },
];
