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
}

export interface VFSFolder {
  id: string;
  name: string;
  iconName: string;
  path: string;
}

export const VFS_FOLDERS: VFSFolder[] = [
  { id: 'apps', name: 'Applications', iconName: 'AppWindow', path: '/Applications' },
  { id: 'docs', name: 'Documents', iconName: 'FileText', path: '/Users/dev/Documents' },
  { id: 'pics', name: 'Pictures', iconName: 'Image', path: '/Users/dev/Pictures' },
  { id: 'downloads', name: 'Downloads', iconName: 'Download', path: '/Users/dev/Downloads' },
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
    name: 'Resume_2026_Alex_Rivera.pdf',
    parentId: 'docs',
    type: 'document',
    size: '240 KB',
    modified: '2026-08-10',
    iconName: 'FileText',
    description: 'Principal Software Engineer & Systems Architect Resume',
    contentPreview:
      'ALEX RIVERA — PRINCIPAL SOFTWARE ENGINEER\n\nExperience:\n- Lead Systems & AI Engineer @ Autonomous Labs (2024-Present)\n- Senior Full-Stack Engineer @ CloudScale Technologies (2021-2024)\n- Software Engineer @ Interactive Media Studio (2018-2021)\n\nEducation:\n- B.S. in Computer Science @ UC Berkeley (Magna Cum Laude)',
  },
  {
    id: 'doc-arch-notes',
    name: 'System_Architecture_Notes.md',
    parentId: 'docs',
    type: 'document',
    size: '18.4 KB',
    modified: '2026-08-12',
    iconName: 'FileCode',
    description: 'Architectural blueprints for distributed audio synthesis & Euler physics',
    contentPreview:
      '# macOS Portfolio OS Architecture\n\n## 1. Physics Engine\n- Euler semi-implicit solver: k=280, c=24, m=1.0\n- Gaussian falloff radius: 260px\n\n## 2. Web Audio Synthesizer\n- Automatic ducking: 20% gain during UI sound events over 40ms\n- Frequency modulated procedural osc triggers',
  },
  {
    id: 'doc-specs',
    name: 'Portfolio_Project_Specs.txt',
    parentId: 'docs',
    type: 'document',
    size: '8.2 KB',
    modified: '2026-08-14',
    iconName: 'FileText',
    description: 'Technical requirements and performance milestones',
    contentPreview:
      'SPECIFICATIONS:\n1. 60 FPS minimum interaction loop on M-series & desktop GPUs\n2. Sub-15ms Web Audio procedural sound generation\n3. Zero hydration mismatches across viewport transitions\n4. Strict adherence to macOS Sonoma aesthetic guidelines',
  },
  {
    id: 'doc-research',
    name: 'Distributed_Systems_Research.pdf',
    parentId: 'docs',
    type: 'document',
    size: '1.4 MB',
    modified: '2026-07-28',
    iconName: 'FileText',
    description: 'Deterministic Consensus & Partition Tolerant Storage Research',
    contentPreview:
      'Abstract: Exploring low-latency pipelined Raft log replication over gRPC in Rust with zero-copy LSM memory mapping and eBPF network telemetry.',
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
    description: 'High-resolution profile portrait',
    contentPreview: 'Radiant developer avatar photo in 4K resolution.',
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
  },
  {
    id: 'pic-arch',
    name: 'Architecture_Diagram.svg',
    parentId: 'pics',
    type: 'picture',
    size: '65 KB',
    modified: '2026-08-11',
    iconName: 'Image',
    description: 'OS Component Layering & Event Pipeline Vector Diagram',
    contentPreview: 'Vector graphic detailing z-index layer stack (0 through 7).',
  },
  {
    id: 'pic-synth',
    name: 'Audio_Synthesizer_UI.png',
    parentId: 'pics',
    type: 'picture',
    size: '850 KB',
    modified: '2026-08-09',
    iconName: 'Image',
    description: 'Screenshot of Neural Synthesizer WebAssembly interface',
    contentPreview: 'UI mock showing real-time 64-bin FFT spectrum visualizer.',
  },

  // Downloads
  {
    id: 'dl-bundle',
    name: 'portfolio_source_bundle.zip',
    parentId: 'downloads',
    type: 'download',
    size: '14.2 MB',
    modified: '2026-08-15',
    iconName: 'Archive',
    description: 'Complete TypeScript source code bundle',
    contentPreview: 'Compressed ZIP archive containing Next.js 14 application sources.',
  },
  {
    id: 'dl-onnx',
    name: 'neural_weights_fp16.onnx',
    parentId: 'downloads',
    type: 'download',
    size: '45.8 MB',
    modified: '2026-08-08',
    iconName: 'Binary',
    description: 'Quantized neural audio model weights',
    contentPreview: 'FP16 ONNX model graph for real-time client-side neural timbre transfer.',
  },
  {
    id: 'dl-telemetry',
    name: 'benchmark_telemetry.json',
    parentId: 'downloads',
    type: 'download',
    size: '120 KB',
    modified: '2026-08-14',
    iconName: 'FileCode',
    description: 'Performance telemetry benchmarks (FPS, memory, audio latency)',
    contentPreview: '{"fps_mean": 59.8, "audio_latency_ms": 7.4, "memory_mb": 42.1, "status": "optimal"}',
  },
];
