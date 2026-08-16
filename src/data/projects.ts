export interface ProjectItem {
  id: string;
  title: string;
  category: 'Full Stack' | 'AI / ML' | 'Systems' | 'Creative' | 'Cloud' | 'Database' | 'DevOps';
  tagline: string;
  description: string;
  highlights: string[];
  techStack: string[];
  gradient: string;
  iconName: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'nascloud',
    title: 'NasCloud',
    category: 'Cloud',
    tagline: 'Self-Hosted Cloud Storage Platform with Streaming I/O & Outbound Tunneling',
    description:
      'A multi-user self-hosted cloud storage platform architected with streaming upload/download pipelines, generator-based folder-to-archive conversion that avoids intermediate disk writes, zero-configuration remote access using outbound tunnel connections without NAT traversal, and multi-stage path sanitization.',
    highlights: [
      'Streaming upload/download pipelines and generator-based folder-to-archive compression without temporary disk files',
      'Zero-configuration remote access via outbound tunnel connections with automatic coordination server registration',
      'Hardened directory traversal defense with multi-stage path sanitization and cryptographically signed expiration URLs',
      'Packaged as a single-binary installer with embedded runtime provisioning and lifecycle management',
    ],
    techStack: ['Python', 'Flask', 'SQLAlchemy', 'Cloudflare Tunnel', 'stream-zip', 'Docker', 'PyInstaller'],
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    iconName: 'Server',
    demoUrl: 'https://github.com/Naseer-fez/PersonalDrive',
    githubUrl: 'https://github.com/Naseer-fez/PersonalDrive',
    featured: true,
    metrics: [
      { label: 'Disk Overhead', value: '0 Temp Writes' },
      { label: 'Tunneling', value: 'Zero-Config' },
      { label: 'Security', value: 'Signed URLs' },
    ],
  },
  {
    id: 'apirlpy',
    title: 'apirlpy',
    category: 'Systems',
    tagline: 'High-Performance Pluggable API Rate Limiter (Published on PyPI)',
    description:
      'Pluggable request-throttling engine with interchangeable persistence layers supporting volatile in-memory operation for latency-critical paths and durable storage for state recovery across process restarts. Eliminates race conditions under concurrent access via reentrant locking with snapshot isolation.',
    highlights: [
      'Published on PyPI with interchangeable volatile in-memory and durable database persistence layers',
      'Eliminated concurrency race conditions via reentrant locking and atomic database eviction queries',
      'Validated through benchmarking across 100,000 simulated clients with sustained 64-thread workloads',
      'Measures P95/P99 response times with predictable CPU/memory consumption profile',
    ],
    techStack: ['Python', 'PyPI', 'SQLite', 'PostgreSQL', 'Threading', 'Benchmarking'],
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    iconName: 'Activity',
    demoUrl: 'https://pypi.org/project/apirlpy/',
    githubUrl: 'https://github.com/Naseer-fez/Api_RateLimiter',
    featured: true,
    metrics: [
      { label: 'Tested Clients', value: '100,000' },
      { label: 'Workload', value: '64 Threads' },
      { label: 'Distribution', value: 'PyPI Package' },
    ],
  },
  {
    id: 'tapnap',
    title: 'TapNap',
    category: 'Full Stack',
    tagline: 'Code-Based Ephemeral Link Sharing Platform with Cryptographic TTL',
    description:
      'A secure link-sharing service with ephemeral data lifecycle management where shared content expires based on configurable time-to-live rules enforced through request-time validation and periodic background purging, protected by cryptographically random one-time verification codes.',
    highlights: [
      'Ephemeral data lifecycle management with request-time validation and automated background purging',
      'Cryptographically random OTP verification codes with time-windowed validity enforcement',
      'Validated system stability under 500 concurrent asynchronous connections under parallel load',
      'Per-endpoint request throttling to mitigate brute-force and enumeration attacks',
    ],
    techStack: ['Python', 'Flask', 'Flask-JWT-Extended', 'SQLAlchemy', 'Docker', 'Async I/O'],
    gradient: 'from-amber-600 via-orange-600 to-red-700',
    iconName: 'Cpu',
    demoUrl: 'https://github.com/Naseer-fez/TapNap-Backend',
    githubUrl: 'https://github.com/Naseer-fez/TapNap-Backend',
    featured: true,
    metrics: [
      { label: 'Concurrency', value: '500 Conns' },
      { label: 'Security', value: 'Cryptographic TTL' },
      { label: 'Auth', value: 'OTP Verified' },
    ],
  },
  {
    id: 'portfolio-os',
    title: 'macOS Portfolio OS',
    category: 'Creative',
    tagline: 'Web desktop operating system with Euler physics & Web Audio',
    description:
      'A production-grade web desktop operating system replicating macOS Sonoma with semi-implicit Euler physics for kinetic typography, Luca parabolic Cosine Bell dock magnification, procedural Web Audio sound synthesis with auto-ducking, and full window management.',
    highlights: [
      'Semi-implicit Euler ODE solver for kinetic typography (k=280, c=24, m=1.0)',
      'Luca parabolic Cosine Bell dock magnification with smooth Gaussian falloff',
      'Procedural Web Audio API sound synthesis with automatic 40ms ducking',
      '8-directional window resizing, cascading positioning, and glassmorphism styling',
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web Audio API', 'Zustand'],
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    iconName: 'Layout',
    demoUrl: 'https://github.com/Naseer-fez/NaseerPortofilio',
    githubUrl: 'https://github.com/Naseer-fez/NaseerPortofilio',
    featured: true,
    metrics: [
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'Audio Latency', value: '< 10ms' },
      { label: 'Test Suite', value: '399 Passing' },
    ],
  },
  {
    id: 'project-jarvis',
    title: 'Project Jarvis AI Desktop OS',
    category: 'AI / ML',
    tagline: 'Modular Autonomous Voice Assistant and Desktop AI Operating System',
    description:
      'A decoupled multi-agent desktop assistant with speech-to-text audio ingestion, regex intent parsing, automated system execution routines, and real-time voice feedback.',
    highlights: [
      'Speech-to-text audio stream processing using Google SpeechRecognition engine',
      'Multi-tool automation pipeline controlling OS processes, browser tasks, and media playback',
      'Offline pyttsx3 text-to-speech feedback pipeline with configurable speech rates',
      'Decoupled multi-agent design with robust error recovery for unparseable intents',
    ],
    techStack: ['Python', 'SpeechRecognition', 'Pyttsx3', 'PyAudio', 'OS Automation', 'Regex'],
    gradient: 'from-violet-600 via-indigo-600 to-blue-700',
    iconName: 'Zap',
    demoUrl: 'https://github.com/Naseer-fez/Project_Jarvis',
    githubUrl: 'https://github.com/Naseer-fez/Project_Jarvis',
    featured: true,
    metrics: [
      { label: 'Event Loop', value: 'Voice Driven' },
      { label: 'Architecture', value: 'Multi-Agent' },
      { label: 'Latency', value: 'Real-Time' },
    ],
  },
  {
    id: 'credit-score-predictor',
    title: 'Credit Score Predictor',
    category: 'AI / ML',
    tagline: 'Machine Learning Scoring System with Fuzzy Matching & Feature Engineering',
    description:
      'Ensemble Random Forest regression pipeline evaluating creditworthiness with RapidFuzz string normalization for messy categorical inputs and financial feature engineering.',
    highlights: [
      'Random Forest Regressor trained on complex credit history datasets',
      'RapidFuzz string normalization handling noisy categorical entries and typos',
      'Financial ratio feature engineering including debt-to-income and credit utilization',
      'Comprehensive data preprocessing and outlier filtering pipeline',
    ],
    techStack: ['Python', 'Scikit-Learn', 'RapidFuzz', 'Pandas', 'NumPy', 'Matplotlib'],
    gradient: 'from-teal-600 via-emerald-600 to-green-700',
    iconName: 'BarChart2',
    demoUrl: 'https://github.com/Naseer-fez/Credit_Score_Predictor',
    githubUrl: 'https://github.com/Naseer-fez/Credit_Score_Predictor',
    featured: false,
    metrics: [
      { label: 'Model', value: 'Random Forest' },
      { label: 'Normalization', value: 'RapidFuzz' },
      { label: 'Features', value: 'DTI / Utilization' },
    ],
  },
  {
    id: 'real-estate-pipeline',
    title: 'Real Estate Valuation Pipeline',
    category: 'AI / ML',
    tagline: 'End-to-End Property Valuation with Custom Closed-Form Ridge Regression',
    description:
      'Closed-form regularized Ridge Regression solver implemented directly in NumPy without high-level ML dependencies, handling 15+ real-estate features with custom imputation.',
    highlights: [
      'Closed-form normal equation solver: (X^T X + lambda I)^(-1) X^T y written in pure NumPy',
      'Robust matrix inversion with regularization preventing singular matrix instability',
      'Comprehensive feature engineering across 15+ dimensional property datasets',
      'Custom statistical missing-value imputation and feature scaling pipelines',
    ],
    techStack: ['Python', 'NumPy', 'Linear Algebra', 'Statistical Modeling', 'Pandas'],
    gradient: 'from-orange-600 via-amber-600 to-yellow-600',
    iconName: 'Home',
    demoUrl: 'https://github.com/Naseer-fez/Real-Estate-Pipeline',
    githubUrl: 'https://github.com/Naseer-fez/Real-Estate-Pipeline',
    featured: false,
    metrics: [
      { label: 'Algorithm', value: 'Closed-Form Ridge' },
      { label: 'Dependencies', value: 'Pure NumPy' },
      { label: 'Features', value: '15+ Dimensions' },
    ],
  },
  {
    id: 'spotify-recommendation',
    title: 'Spotify Music Recommendation Engine',
    category: 'AI / ML',
    tagline: 'Content-Based Music Recommendation Engine Matching Audio Attributes',
    description:
      'Multi-dimensional attribute scoring using danceability, energy, acousticness, and loudness with recursive best-fit track searching under release era constraints.',
    highlights: [
      'Content-based vector matching comparing multi-attribute audio feature vectors',
      'Multi-attribute scoring including danceability, energy, acousticness, and tempo',
      'Era-constrained recursive search algorithms filtering tracks by artist and genre',
      'Interactive dataset exploration for dynamic personalized recommendation playlists',
    ],
    techStack: ['Python', 'Pandas', 'Scikit-Learn', 'NumPy', 'Data Analysis'],
    gradient: 'from-green-600 via-emerald-600 to-teal-700',
    iconName: 'Music',
    demoUrl: 'https://github.com/Naseer-fez/music_rec',
    githubUrl: 'https://github.com/Naseer-fez/music_rec',
    featured: false,
    metrics: [
      { label: 'Scoring', value: 'Vector Distance' },
      { label: 'Filters', value: 'Era & Genre' },
      { label: 'Domain', value: 'Audio DSP' },
    ],
  },
  {
    id: 'taskbar-engine',
    title: 'Taskbar Engine',
    category: 'Systems',
    tagline: 'Native Windows Shell Enhancement & Customization Engine in C++',
    description:
      'Low-level Win32 window message hooks, multi-threaded event dispatching, modular plugin SDK, and automated cross-configuration CMake build presets.',
    highlights: [
      'Low-level Win32 window procedure hooks intercepting system shell events',
      'Multi-threaded UI event queue ensuring zero latency on system interactions',
      'Modular plugin architecture enabling custom visual skins and widgets',
      'Cross-configuration CMake build matrix with automated Azure Pipelines CI/CD',
    ],
    techStack: ['C++', 'Win32 API', 'CMake', 'Azure Pipelines', 'Shell Hooks'],
    gradient: 'from-blue-600 via-sky-600 to-cyan-600',
    iconName: 'Sliders',
    demoUrl: 'https://github.com/Naseer-fez/Taskbarengine',
    githubUrl: 'https://github.com/Naseer-fez/Taskbarengine',
    featured: false,
    metrics: [
      { label: 'Interface', value: 'Win32 Hooks' },
      { label: 'Build', value: 'CMake Presets' },
      { label: 'CI/CD', value: 'Azure Pipelines' },
    ],
  },
  {
    id: 'livewallpaper-engine',
    title: 'LiveWallpaper Engine',
    category: 'Creative',
    tagline: 'Win32 Animated Desktop Engine Hijacking the WorkerW Window Hierarchy',
    description:
      'Direct WorkerW desktop handle hijacking, multi-monitor coordinate virtualization, and low-overhead DirectX rendering loops for interactive desktop backgrounds.',
    highlights: [
      'Desktop wallpaper hijacking via Win32 WorkerW and Progman window handle traversal',
      'DirectX hardware-accelerated rendering loop minimizing background CPU usage',
      'Multi-monitor coordinate space virtualization supporting arbitrary aspect ratios',
      'Process lifecycle watcher that pauses rendering when full-screen applications launch',
    ],
    techStack: ['C++', 'Win32 API', 'DirectX', 'GDI+', 'Graphics Programming'],
    gradient: 'from-pink-600 via-rose-600 to-red-600',
    iconName: 'Layout',
    demoUrl: 'https://github.com/Naseer-fez/Livewallpaper',
    githubUrl: 'https://github.com/Naseer-fez/Livewallpaper',
    featured: false,
    metrics: [
      { label: 'Injection', value: 'WorkerW Hook' },
      { label: 'Acceleration', value: 'DirectX HW' },
      { label: 'Multi-Monitor', value: 'Virtual Grid' },
    ],
  },
  {
    id: 'dates-cextension',
    title: 'Dates C-Extension Engine',
    category: 'Systems',
    tagline: 'High-Performance Date Manipulation Interfacing Python with C via Ctypes',
    description:
      'Modular C architecture with strict separation of concerns, providing direct memory allocation and zero-overhead date arithmetic for Python via Ctypes.',
    highlights: [
      'Ctypes foreign function interface bridging Python high-level APIs to C binaries',
      'Strict pointer memory management preventing memory leaks during batch computations',
      'Modular source layout with dedicated header contracts and compilation artifacts',
      'Sub-microsecond date calculation routines surpassing standard interpreted performance',
    ],
    techStack: ['C', 'Python', 'Ctypes', 'Memory Management', 'FFI'],
    gradient: 'from-slate-600 via-zinc-600 to-stone-700',
    iconName: 'Cpu',
    demoUrl: 'https://github.com/Naseer-fez/Dates',
    githubUrl: 'https://github.com/Naseer-fez/Dates',
    featured: false,
    metrics: [
      { label: 'Interface', value: 'Ctypes FFI' },
      { label: 'Memory', value: 'Manual Pointers' },
      { label: 'Performance', value: 'Native C' },
    ],
  },
  {
    id: 'secure-password-generator',
    title: 'Secure Password Generator',
    category: 'Systems',
    tagline: 'High-Entropy Dual C/Python Engine with Clipboard Integration',
    description:
      'Cryptographically randomized index selection avoiding character repetition patterns, wrapped in a memory-safe C buffer pipeline and Python CLI with native clipboard integration.',
    highlights: [
      'Dual compilation targeting both native C executable and Python CLI interfaces',
      'Cryptographic entropy sampling eliminating predictable character patterns',
      'Memory buffer zeroing upon output generation to safeguard sensitive credentials',
      'OS clipboard integration for seamless credential provisioning',
    ],
    techStack: ['C', 'Python', 'NumPy', 'Clipboard API', 'Cryptography'],
    gradient: 'from-cyan-600 via-teal-600 to-emerald-700',
    iconName: 'Shield',
    demoUrl: 'https://github.com/Naseer-fez/Pass_Gen',
    githubUrl: 'https://github.com/Naseer-fez/Pass_Gen',
    featured: false,
    metrics: [
      { label: 'Engine', value: 'Dual C / Python' },
      { label: 'Entropy', value: 'Cryptographic' },
      { label: 'Safety', value: 'Buffer Zeroing' },
    ],
  },
  {
    id: 'phone-contact-manager',
    title: 'Phone Contact Manager',
    category: 'Systems',
    tagline: 'In-Memory Dynamic Contact Engine in Pure C with Doubly Linked Lists',
    description:
      'Dynamic bidirectional node chaining with manual memory allocation and deallocation, input sanitization, and structured terminal reporting in pure C.',
    highlights: [
      'Bidirectional node pointer chaining with O(1) insertion and O(N) traversal',
      'Dynamic heap memory allocation using malloc/free with zero memory leaks',
      'Defensive input parsing preventing buffer overflow vulnerabilities in terminal prompts',
      'Structured tabular rendering directly in standard Unix/Windows console',
    ],
    techStack: ['C', 'Data Structures', 'Pointers', 'Doubly Linked Lists', 'Memory Management'],
    gradient: 'from-indigo-600 via-blue-600 to-sky-700',
    iconName: 'Terminal',
    demoUrl: 'https://github.com/Naseer-fez/Phone-Contract',
    githubUrl: 'https://github.com/Naseer-fez/Phone-Contract',
    featured: false,
    metrics: [
      { label: 'Structure', value: 'Doubly Linked' },
      { label: 'Pointers', value: 'Manual Heap' },
      { label: 'Safety', value: 'Zero Leaks' },
    ],
  },
  {
    id: 'dsa-journey',
    title: 'DSA Journey & Algorithmic Repository',
    category: 'Systems',
    tagline: 'Optimized Competitive Programming & Algorithms Repository in C++',
    description:
      'Optimized space-time complexity implementations of graph algorithms, dynamic programming, binary search, and SQL optimization patterns.',
    highlights: [
      'Production-quality implementations of Dijkstra, DFS, BFS, and Disjoint Set Union',
      'Dynamic programming solutions with memoization and bottom-up space optimization',
      'Advanced SQL schema designs and index-optimized relational queries',
      'Comprehensive time and space complexity analysis documented per module',
    ],
    techStack: ['C++', 'Data Structures', 'Algorithms', 'MySQL', 'Competitive Programming'],
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
    iconName: 'Activity',
    demoUrl: 'https://github.com/Naseer-fez/DSA-Journey',
    githubUrl: 'https://github.com/Naseer-fez/DSA-Journey',
    featured: false,
    metrics: [
      { label: 'Domain', value: 'Graphs & DP' },
      { label: 'Language', value: 'Modern C++' },
      { label: 'Database', value: 'MySQL Queries' },
    ],
  },
  {
    id: 'student-records',
    title: 'Student Records System',
    category: 'Database',
    tagline: 'Console Academic Record Management with Dynamic Linked Lists & Flat-File Storage',
    description:
      'Dynamic memory-linked node structure paired with formatted flat-file binary persistence, search indexers, and batch deletion safety in C.',
    highlights: [
      'Hybrid in-memory linked list with persistent flat-file disk synchronization',
      'Full CRUD lifecycle: create, search, update, delete, and grade calculation routines',
      'Defensive file parsing with corruption recovery and data validation check routines',
      'Interactive text menu with field validation and formatted report generation',
    ],
    techStack: ['C', 'File I/O', 'Linked Lists', 'CRUD Architecture', 'Persistence'],
    gradient: 'from-emerald-600 via-green-600 to-teal-700',
    iconName: 'Database',
    demoUrl: 'https://github.com/Naseer-fez/Student_Records',
    githubUrl: 'https://github.com/Naseer-fez/Student_Records',
    featured: false,
    metrics: [
      { label: 'Persistence', value: 'Binary Flat-File' },
      { label: 'Structure', value: 'Linked Nodes' },
      { label: 'Operations', value: 'Full CRUD' },
    ],
  },
  {
    id: 'hospital-ward',
    title: 'Hospital Ward Management',
    category: 'Database',
    tagline: 'Hospital Bed Allocation & Occupancy Engine in C with 2D Visual Matrices',
    description:
      '2D matrix bed tracking with real-time occupancy state toggling, patient metadata structs, and statistical ward occupancy reporting.',
    highlights: [
      '2D array grid visualization representing multi-ward hospital bed layouts',
      'Real-time state transitions between occupied, available, and reserved states',
      'Structured patient metadata records with admission and discharge tracking',
      'Ward capacity analytics and statistical utilization reporting',
    ],
    techStack: ['C', '2D Arrays', 'Systems Programming', 'State Management', 'Terminal UI'],
    gradient: 'from-sky-600 via-blue-600 to-indigo-700',
    iconName: 'Database',
    demoUrl: 'https://github.com/Naseer-fez/Hosplital_Managment',
    githubUrl: 'https://github.com/Naseer-fez/Hosplital_Managment',
    featured: false,
    metrics: [
      { label: 'Capacity', value: '100+ Bed Grid' },
      { label: 'Rendering', value: '2D Visual Grid' },
      { label: 'Analytics', value: 'State Machine' },
    ],
  },
  {
    id: 'fitness-tracker',
    title: 'Fitness Tracker CLI & Analytics',
    category: 'Database',
    tagline: 'Structured Workout Logging & Volume Progression Tracking Engine',
    description:
      'Relational workout schemas capturing sets, reps, weight, volume calculations over time, and automated summary reporting in Python/SQLite.',
    highlights: [
      'Relational schema architecture storing multi-exercise sessions and set parameters',
      'Automated tonnage and progressive overload calculations across training periods',
      'Dual storage interface supporting lightweight JSON exports and SQLite persistence',
      'Terminal dashboard with formatted progression tables and personal record alerts',
    ],
    techStack: ['Python', 'SQLite', 'CLI', 'Data Analysis', 'Schema Design'],
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    iconName: 'BarChart2',
    demoUrl: 'https://github.com/Naseer-fez/Fitness_Tracker',
    githubUrl: 'https://github.com/Naseer-fez/Fitness_Tracker',
    featured: false,
    metrics: [
      { label: 'Database', value: 'SQLite / JSON' },
      { label: 'Calculations', value: 'Volume / Overload' },
      { label: 'Interface', value: 'CLI Analytics' },
    ],
  }
  
];
