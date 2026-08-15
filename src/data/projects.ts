export interface ProjectItem {
  id: string;
  title: string;
  category: 'Full Stack' | 'AI / ML' | 'Systems' | 'Creative';
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
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    iconName: 'Layout',
    demoUrl: 'https://portfolio-os.dev',
    githubUrl: 'https://github.com/developer/portfolio-os',
    featured: true,
    metrics: [
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'Audio Latency', value: '< 10ms' },
      { label: 'Bundle Size', value: '48 KB' },
    ],
  },
  {
    id: 'neural-synth',
    title: 'Neural Audio Synthesizer',
    category: 'AI / ML',
    tagline: 'Real-time neural audio synthesis & timbre transfer in WebAssembly',
    description:
      'Client-side deep learning audio engine performing real-time neural waveform synthesis and harmonic timbre transfer using ONNX Runtime Web and custom SIMD-accelerated WebAssembly kernels.',
    highlights: [
      'Sub-15ms client-side neural inference with ONNX Runtime Web and WebGPU',
      'Multi-scale spectral loss minimization for high-fidelity audio reconstruction',
      'Interactive harmonic overtones visualizer with 64-bin real-time FFT analyzer',
      'Zero-dependency procedural wavetable fallback engine',
    ],
    techStack: ['PyTorch', 'ONNX Runtime Web', 'WebAssembly', 'Web Audio API', 'TypeScript'],
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    iconName: 'Activity',
    demoUrl: 'https://neural-synth.dev',
    githubUrl: 'https://github.com/developer/neural-audio-synth',
    featured: true,
    metrics: [
      { label: 'Inference', value: '12 ms' },
      { label: 'Sample Rate', value: '48 kHz' },
      { label: 'FFT Bins', value: '64' },
    ],
  },
  {
    id: 'hyperscale-kv',
    title: 'HyperScale Distributed KV',
    category: 'Systems',
    tagline: 'High-throughput distributed key-value store with Raft consensus in Rust',
    description:
      'High-performance distributed key-value store implemented in Rust utilizing Raft consensus, LSM-tree storage engine with deterministic WAL, eBPF network telemetry, and Jepsen-tested partition tolerance.',
    highlights: [
      '120,000+ write QPS per cluster node with pipelined Raft log replication',
      'Write-Ahead Log (WAL) with deterministic chaos testing and Jepsen validation',
      'Self-healing partition recovery with automatic leader election in < 150ms',
      'Zero-copy memory mapped files with tiered compaction',
    ],
    techStack: ['Rust', 'Tokio', 'gRPC', 'Raft Consensus', 'LSM-Trees', 'eBPF'],
    gradient: 'from-amber-600 via-orange-600 to-red-700',
    iconName: 'Server',
    demoUrl: 'https://hyperscale-kv.dev',
    githubUrl: 'https://github.com/developer/hyperscale-kv',
    featured: true,
    metrics: [
      { label: 'Throughput', value: '120k QPS' },
      { label: 'P99 Latency', value: '1.2 ms' },
      { label: 'Consensus', value: '< 150ms' },
    ],
  },
  {
    id: 'agent-mesh',
    title: 'Autonomous Agent Mesh',
    category: 'AI / ML',
    tagline: 'Multi-agent orchestration runtime for distributed code synthesis',
    description:
      'Resilient multi-agent orchestration runtime featuring DAG task decomposition, zero-loss Redis Streams messaging, verifiable forensic auditing, and sandboxed code execution environments.',
    highlights: [
      'Zero-loss transactional message bus with Redis Streams and LangGraph',
      'Streaming subagent handoff protocol with deterministic state checkpoints',
      'Automated code verification sandbox with real-time test output capture',
      'Dynamic token budget optimizer reducing LLM orchestration overhead by 42%',
    ],
    techStack: ['Python', 'FastAPI', 'LangGraph', 'Redis Streams', 'Docker', 'PostgreSQL'],
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    iconName: 'Cpu',
    demoUrl: 'https://agent-mesh.dev',
    githubUrl: 'https://github.com/developer/agent-mesh',
    featured: false,
    metrics: [
      { label: 'Token Efficiency', value: '+42%' },
      { label: 'Checkpoint Latency', value: '18 ms' },
      { label: 'Concurrency', value: '500+ agents' },
    ],
  },
  {
    id: 'cloud-telemetry',
    title: 'Cloud-Native Telemetry Suite',
    category: 'Full Stack',
    tagline: 'Real-time distributed tracing and APM platform with eBPF probes',
    description:
      'Full-stack observability platform ingesting millions of spans and metrics per second via eBPF kernel probes, stored in ClickHouse OLAP, with real-time interactive microservice topology visualization.',
    highlights: [
      'Ingests 1,000,000+ spans/second with Go high-throughput stream ingestion pipeline',
      'Sub-second analytical queries across petabyte-scale ClickHouse clusters',
      'Interactive WebGL microservice dependency topology graph with live traffic heatmaps',
      'Automated anomaly detection triggering alerting webhooks within 2 seconds',
    ],
    techStack: ['Go', 'React', 'TypeScript', 'ClickHouse', 'eBPF', 'Tailwind CSS'],
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    iconName: 'BarChart2',
    demoUrl: 'https://telemetry-suite.dev',
    githubUrl: 'https://github.com/developer/telemetry-suite',
    featured: false,
    metrics: [
      { label: 'Ingestion', value: '1M spans/s' },
      { label: 'Query Time', value: '< 200ms' },
      { label: 'Storage Savings', value: '65%' },
    ],
  },
  {
    id: 'shader-visualizer',
    title: 'Generative Shader Visualizer',
    category: 'Creative',
    tagline: 'GPU-accelerated GLSL shader synthesizer with audio-reactive fractals',
    description:
      'High-performance WebGL2 shader platform rendering raymarched 3D fractals, volumetric light scattering, and real-time audio-reactive geometry synced to live audio frequency spectra.',
    highlights: [
      '60 FPS 4K raymarching using optimized bounding spheres and distance fields',
      'Real-time frequency bin harmonic mapping with Web Audio FFT analyzer',
      'Custom post-processing pipeline featuring chromatic aberration and bloom',
      'Live GLSL shader editor with instant hot-reloading and WebGL shader compilation',
    ],
    techStack: ['WebGL2', 'Three.js', 'GLSL Shaders', 'Web Audio FFT', 'React'],
    gradient: 'from-fuchsia-600 via-violet-600 to-purple-800',
    iconName: 'Zap',
    demoUrl: 'https://shader-visualizer.dev',
    githubUrl: 'https://github.com/developer/shader-visualizer',
    featured: false,
    metrics: [
      { label: 'Render Target', value: '4K @ 60fps' },
      { label: 'Shader Pass', value: '4-stage pipeline' },
      { label: 'FFT Mapping', value: '128 bands' },
    ],
  },
];
