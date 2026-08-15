import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, Layers, Cpu, Globe, Code2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: 'systems' | 'creative' | 'ai' | 'fullstack';
  categoryLabel: string;
  tagline: string;
  description: string;
  year: string;
  role: string;
  tech: string[];
  metrics: string;
  demoUrl?: string;
  githubUrl?: string;
  gradient: string;
}

const PROJECTS: Project[] = [
  {
    id: 'os-portfolio',
    title: 'Apple-Inspired OS Portfolio',
    category: 'systems',
    categoryLabel: 'Systems / OS',
    tagline: 'Multi-window desktop simulation with proximity dock & kinetic typography',
    description: 'High-performance virtual operating system built in React and TypeScript. Features 8-way window resizing, 1D cosine dock proximity scaling, 2D kinetic typography deformation field, and procedural Web Audio engine.',
    year: '2026',
    role: 'Lead Architect & Engineer',
    tech: ['React 18', 'TypeScript', 'Tailwind CSS', 'Web Audio API', 'Canvas API'],
    metrics: '0% Idle CPU · 120 FPS Rendering',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    gradient: 'from-blue-600/20 via-indigo-900/30 to-black/60',
  },
  {
    id: 'neural-synth',
    title: 'Aura Neural Sound Synthesizer',
    category: 'ai',
    categoryLabel: 'AI / ML',
    tagline: 'Real-time generative Web Audio synthesizer driven by transformer embeddings',
    description: 'Algorithmic procedural audio workstation that synthesizes adaptive soundscapes and binaural beats in real-time without static samples, running directly in the browser via Web Audio DSP nodes.',
    year: '2025',
    role: 'Full-Stack & DSP Engineer',
    tech: ['Web Audio DSP', 'TypeScript', 'Web Workers', 'WebAssembly', 'GLSL'],
    metrics: 'Latency < 8ms · Offline Capable',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    gradient: 'from-purple-600/20 via-pink-900/30 to-black/60',
  },
  {
    id: 'kinetic-engine',
    title: 'Vortex Kinetic Typography Engine',
    category: 'creative',
    categoryLabel: 'Creative Dev',
    tagline: 'GPU-accelerated variable font spatial deformation and physics framework',
    description: 'Micro-library for spatial character deformation with Euclidean distance fields, pre-cached centroid matrices, and spring-physics settling with zero layout thrashing.',
    year: '2025',
    role: 'Creative Developer',
    tech: ['Variable Fonts', 'RAF Pipeline', 'Vector Math', 'CSS Houdini'],
    metrics: 'Zero Layout Thrash · 60/120 FPS',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    gradient: 'from-cyan-600/20 via-blue-900/30 to-black/60',
  },
  {
    id: 'hyper-commerce',
    title: 'Lumina Hypermedia Commerce Engine',
    category: 'fullstack',
    categoryLabel: 'Full-Stack',
    tagline: 'Museum-grade luxury e-commerce platform with 3D WebGL product configurator',
    description: 'Ultra-low-latency headless commerce architecture featuring interactive 3D model customizers, real-time price delta pipelines, and instantaneous page transitions.',
    year: '2024',
    role: 'Principal Full-Stack Architect',
    tech: ['Next.js', 'Three.js / WebGL', 'GraphQL', 'Tailwind CSS', 'Redis'],
    metrics: '99 Lighthouse · sub-100ms TTFB',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    gradient: 'from-emerald-600/20 via-teal-900/30 to-black/60',
  },
  {
    id: 'distributed-kv',
    title: 'Chronos Distributed Key-Value Store',
    category: 'systems',
    categoryLabel: 'Systems / OS',
    tagline: 'Raft-consensus distributed storage engine with sub-millisecond p99 replication',
    description: 'High-availability distributed key-value storage engine implemented with Raft consensus protocol, log compaction, snapshotting, and gRPC streaming interfaces.',
    year: '2024',
    role: 'Systems Engineer',
    tech: ['Rust', 'Raft Consensus', 'gRPC', 'RocksDB', 'Docker'],
    metrics: '50k+ QPS · Linearizable Read/Write',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    gradient: 'from-amber-600/20 via-orange-900/30 to-black/60',
  },
  {
    id: 'quantum-vision',
    title: 'VisionOS Spatial UI Simulation',
    category: 'creative',
    categoryLabel: 'Creative Dev',
    tagline: 'Spatial computing glassmorphic UI system for web with eye/hand gaze interaction',
    description: 'Experimental spatial interface recreating visionOS specular highlights, dynamic material depth, and head/pointer parallax mapping on standard displays.',
    year: '2024',
    role: 'UI/UX & Creative Technologist',
    tech: ['Three.js', 'React', 'Shader Material', 'Tailwind CSS'],
    metrics: 'Ultra-High Fidelity Specular Blur',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    gradient: 'from-rose-600/20 via-purple-900/30 to-black/60',
  },
];

type CategoryFilter = 'all' | 'systems' | 'creative' | 'ai' | 'fullstack';

export const ProjectsApp: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = PROJECTS.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.category === activeFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const categories: { id: CategoryFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Projects', icon: Layers },
    { id: 'systems', label: 'Systems / OS', icon: Cpu },
    { id: 'creative', label: 'Creative Dev', icon: Sparkles },
    { id: 'ai', label: 'AI / ML', icon: Code2 },
    { id: 'fullstack', label: 'Full-Stack', icon: Globe },
  ];

  return (
    <div className="w-full h-full bg-[#1e1e22]/90 text-body-dark overflow-y-auto p-4 md:p-6 select-text">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-[24px] font-semibold text-white tracking-[-0.28px] flex items-center gap-2">
            <span>Portfolio Projects</span>
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-primary/20 text-primary-dark font-medium border border-primary/30">
              {filteredProjects.length} Flagship Works
            </span>
          </h2>
          <p className="text-[13px] text-body-muted mt-0.5">
            Architected for extreme performance, photographic fidelity, and fluid interaction.
          </p>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-black/40 rounded-pill border border-white/10 overflow-x-auto max-w-full">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] font-medium transition-all ${
                activeFilter === id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="group relative flex flex-col justify-between rounded-lg bg-surface-tile1/80 border border-white/10 hover:border-primary-dark/50 transition-all duration-200 overflow-hidden p-5 shadow-product"
          >
            {/* Top Row: Category tag & Year */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-body-muted mb-2">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-medium">
                  {project.categoryLabel}
                </span>
                <span className="font-mono text-white/50">{project.year} • {project.role}</span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-[18px] font-semibold text-white tracking-[-0.2px] group-hover:text-primary-dark transition-colors">
                {project.title}
              </h3>
              <p className="text-[13px] font-medium text-primary-dark mt-0.5">
                {project.tagline}
              </p>

              {/* Description */}
              <p className="text-[13.5px] text-body-muted mt-3 leading-relaxed">
                {project.description}
              </p>

              {/* Metrics Badge */}
              <div className="mt-3.5 p-2 rounded-md bg-white/5 border border-white/5 text-[12px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{project.metrics}</span>
              </div>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {project.tech.map(tech => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-pill bg-white/5 border border-white/10 text-[11.5px] text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row Actions */}
            <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-white/10">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-pill bg-primary hover:bg-primary-focus text-white text-[13px] font-medium transition-transform active:scale-95 shadow-md"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-pill bg-white/10 hover:bg-white/15 text-white text-[13px] font-medium transition-transform active:scale-95 border border-white/10"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
                <span>Code</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
