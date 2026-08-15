export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  location: string;
  description: string;
  bullets: string[];
  techStack: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number; tag: 'Expert' | 'Advanced' | 'Proficient' }[];
}

export const PROFILE_DATA = {
  name: 'Alex Rivera',
  title: 'Principal Software Engineer & Systems Architect',
  location: 'San Francisco, CA (Open to Remote)',
  email: 'contact@developer.dev',
  github: 'https://github.com/developer',
  linkedin: 'https://linkedin.com/in/developer',
  twitter: 'https://twitter.com/developer_dev',
  status: 'Available for high-impact engineering leadership roles',
  bio: [
    'I am a design-driven systems architect and creative technologist specializing in distributed computing, real-time audio/visual synthesis, and high-performance user interfaces. With over 8 years of engineering experience spanning systems infrastructure to cutting-edge browser engines, I build software that merges mathematical rigor with sublime tactile ergonomics.',
    'My recent work centers on low-latency Web Audio engines, deterministic distributed consensus protocols, and client-side neural inference in WebAssembly. I am obsessed with frame-perfect 60 FPS interactions, physical spring solvers, and zero-compromise developer velocity.',
    'When not architecting distributed clusters or tuning ODE physics integrators, you can find me composing electronic music, experimenting with GLSL raymarching shaders, or tinkering with custom mechanical keyboards.',
  ],
  stats: [
    { label: 'Years Experience', value: '8+' },
    { label: 'Projects Shipped', value: '40+' },
    { label: 'GitHub Stars', value: '2.5k+' },
    { label: 'System Reliability', value: '99.99%' },
  ],
  timeline: [
    {
      year: '2024 — Present',
      role: 'Lead Systems & AI Engineer',
      company: 'Autonomous Labs',
      location: 'San Francisco, CA',
      description:
        'Architecting distributed agent execution runtimes, real-time code synthesis pipelines, and high-throughput streaming message buses.',
      bullets: [
        'Engineered distributed agent runtime supporting 500+ parallel LLM execution instances with deterministic state tracking.',
        'Designed streaming multi-agent handoff protocol reducing task decomposition latency by 45%.',
        'Implemented sub-15ms client-side WebAssembly inference engine for audio synthesis models.',
      ],
      techStack: ['Rust', 'Python', 'FastAPI', 'Redis Streams', 'LangGraph', 'Docker'],
    },
    {
      year: '2021 — 2024',
      role: 'Senior Full-Stack & UI Architect',
      company: 'CloudScale Technologies',
      location: 'San Francisco, CA',
      description:
        'Led frontend architecture and telemetry visualization platforms ingesting over 1M metrics/sec across enterprise clusters.',
      bullets: [
        'Built interactive WebGL distributed tracing visualizer rendering 10k+ node microservice topology in 60 FPS.',
        'Spearheaded migration to Next.js and Tailwind design system, improving core web vitals by 60%.',
        'Authored low-latency Web Audio playback deck with automatic dynamic range compression and DSP filtering.',
      ],
      techStack: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS', 'WebGL', 'Go', 'ClickHouse'],
    },
    {
      year: '2018 — 2021',
      role: 'Software Engineer',
      company: 'Interactive Media Studio',
      location: 'New York, NY',
      description:
        'Developed creative web experiences, audio-reactive graphics, and cross-platform native interactive installations.',
      bullets: [
        'Engineered GPU-accelerated GLSL shader synthesizer used by over 200,000 monthly active creators.',
        'Constructed custom physics simulation engines utilizing Euler and Verlet integration methods.',
        'Collaborated with top-tier brands on award-winning interactive digital campaigns and WebGL showcases.',
      ],
      techStack: ['JavaScript', 'Three.js', 'GLSL', 'Web Audio API', 'React', 'Node.js'],
    },
    {
      year: '2014 — 2018',
      role: 'B.S. in Computer Science',
      company: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      description: 'Graduated Magna Cum Laude with focus on Distributed Systems and Computer Graphics.',
      bullets: [
        'Conducted undergraduate research in distributed consensus protocols and lock-free data structures.',
        'Teaching Assistant for CS 162 (Operating Systems and System Programming).',
        'President of Computer Graphics & Creative Tech Student Guild.',
      ],
      techStack: ['C', 'C++', 'Java', 'Algorithms', 'Operating Systems', 'Computer Graphics'],
    },
  ] as TimelineItem[],
  skillCategories: [
    {
      name: 'Languages',
      skills: [
        { name: 'TypeScript / JavaScript', level: 96, tag: 'Expert' },
        { name: 'Rust', level: 88, tag: 'Advanced' },
        { name: 'Python', level: 92, tag: 'Expert' },
        { name: 'Go', level: 85, tag: 'Advanced' },
        { name: 'C / C++', level: 80, tag: 'Proficient' },
        { name: 'SQL (PostgreSQL / ClickHouse)', level: 90, tag: 'Expert' },
      ],
    },
    {
      name: 'Frontend & Creative Tech',
      skills: [
        { name: 'React / Next.js (App Router)', level: 96, tag: 'Expert' },
        { name: 'Tailwind CSS / Glassmorphism', level: 95, tag: 'Expert' },
        { name: 'Framer Motion / Physics Animation', level: 92, tag: 'Expert' },
        { name: 'WebGL2 / Three.js / GLSL', level: 86, tag: 'Advanced' },
        { name: 'Web Audio API / DSP', level: 90, tag: 'Expert' },
      ],
    },
    {
      name: 'Backend & Distributed Systems',
      skills: [
        { name: 'Node.js / Express / Fastify', level: 94, tag: 'Expert' },
        { name: 'FastAPI / Python AsyncIO', level: 90, tag: 'Expert' },
        { name: 'Raft Consensus & LSM-Trees', level: 86, tag: 'Advanced' },
        { name: 'Redis Streams & Pub/Sub', level: 90, tag: 'Expert' },
        { name: 'gRPC / Protocol Buffers', level: 88, tag: 'Advanced' },
        { name: 'eBPF Kernel Probing', level: 82, tag: 'Proficient' },
      ],
    },
    {
      name: 'Cloud, DevOps & Tooling',
      skills: [
        { name: 'Docker / Kubernetes', level: 88, tag: 'Advanced' },
        { name: 'AWS / GCP Cloud Architecture', level: 88, tag: 'Advanced' },
        { name: 'CI/CD Pipelines & Terraform', level: 85, tag: 'Advanced' },
        { name: 'Linux Kernel & Systemd Tuning', level: 84, tag: 'Proficient' },
        { name: 'Vitest / Jest / Playwright', level: 92, tag: 'Expert' },
      ],
    },
  ] as SkillCategory[],
};
