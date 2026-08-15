import React from 'react';
import { MapPin, Mail, Briefcase, GraduationCap, Award, Cpu, Code2, Layers } from 'lucide-react';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  skills: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Principal Full-Stack & Systems Engineer',
    company: 'NextGen Interfaces Lab',
    period: '2024 — Present',
    location: 'San Francisco, CA / Remote',
    highlights: [
      'Architected high-performance web operating system runtime with sub-1ms window drag response and zero layout thrashing.',
      'Developed real-time procedural Web Audio sound synthesis engine operating with <8ms latency.',
      'Reduced memory footprint across multi-window state machines by 45% using cached spatial matrices.',
    ],
    skills: ['React 18', 'TypeScript', 'Web Audio API', 'Distributed Systems', 'Tailwind CSS'],
  },
  {
    id: 'exp-2',
    role: 'Senior Creative Technologist & UI Architect',
    company: 'Apex Design & Motion',
    period: '2022 — 2024',
    location: 'New York, NY',
    highlights: [
      'Engineered kinetic variable typography deformation frameworks for luxury fashion and tech brands.',
      'Constructed Apple design system token pipelines ensuring pixel-perfect alignment across 8 viewport breakpoints.',
      'Pioneered spring-physics interactive taskbar widgets with continuous cosine proximity magnification.',
    ],
    skills: ['Variable Fonts', 'Canvas 2D/WebGL', 'Framer Motion', 'Mathematical Modeling', 'Performance Optimization'],
  },
  {
    id: 'exp-3',
    role: 'Software Engineer — Distributed Systems',
    company: 'Core Cloud Infrastructure',
    period: '2020 — 2022',
    location: 'Seattle, WA',
    highlights: [
      'Built distributed fault-tolerant replication primitives using Raft consensus in Rust.',
      'Implemented high-throughput gRPC streaming data ingestion pipelines handling 50k+ QPS.',
    ],
    skills: ['Rust', 'Go', 'gRPC', 'Docker', 'Kubernetes', 'PostgreSQL'],
  },
];

const SKILL_GROUPS = [
  {
    category: 'Core Engineering',
    icon: Code2,
    skills: ['TypeScript', 'JavaScript (ESNext)', 'Rust', 'Go', 'Python', 'SQL', 'GLSL'],
  },
  {
    category: 'Frontend & Creative',
    icon: Layers,
    skills: ['React 18', 'Next.js', 'Tailwind CSS', 'Web Audio API', 'Canvas API / WebGL', 'Variable Typography'],
  },
  {
    category: 'Systems & Architecture',
    icon: Cpu,
    skills: ['Raft Consensus', 'Event-Driven FSMs', 'Zero-CPU Sleep Loops', 'gRPC', 'WebSockets', 'Redis', 'Docker'],
  },
];

export const AboutApp: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#1e1e22]/90 text-body-dark overflow-y-auto flex flex-col md:flex-row select-text">
      {/* Left Column: Profile & Bio Summary */}
      <div className="w-full md:w-[35%] p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between bg-surface-black/20">
        <div>
          {/* Avatar Squircle */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shadow-product mb-5 group">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              alt="Developer Avatar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Name & Title */}
          <h2 className="text-[22px] font-bold text-white tracking-[-0.3px]">
            Jane Doe
          </h2>
          <p className="text-[13.5px] font-medium text-primary-dark mt-0.5">
            Full-Stack Specialist & Systems Architect
          </p>

          {/* Location & Status */}
          <div className="flex items-center gap-2 text-[12px] text-body-muted mt-3">
            <MapPin className="w-3.5 h-3.5 text-primary-dark shrink-0" />
            <span>San Francisco, CA • Remote Worldwide</span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-emerald-500/10 border border-emerald-500/30 text-[12px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-beacon" />
            <span>Available for Select Contracts</span>
          </div>

          {/* Bio Copy */}
          <p className="text-[13.5px] text-body-muted mt-5 leading-relaxed">
            I craft museum-grade web software, combining the mechanical rigor of systems engineering with Apple-grade aesthetic minimalism. Passionate about multi-window OS interfaces, kinetic typography, and real-time Web Audio DSP.
          </p>
        </div>

        {/* Contact Strip */}
        <div className="pt-6 mt-6 border-t border-white/10 space-y-2 text-[13px]">
          <a
            href="mailto:engineer@portfolio.os"
            className="flex items-center gap-2 text-white/80 hover:text-primary-dark transition-colors"
          >
            <Mail className="w-4 h-4 text-primary-dark" />
            <span>engineer@portfolio.os</span>
          </a>
          <div className="flex items-center gap-2 text-white/60">
            <Award className="w-4 h-4 text-primary-dark" />
            <span>Ex-NextGen Labs · 7+ Years Exp</span>
          </div>
        </div>
      </div>

      {/* Right Column: Experience Timeline & Skills Matrix */}
      <div className="w-full md:w-[65%] p-6 md:p-8 space-y-8 overflow-y-auto">
        {/* Experience Section */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Briefcase className="w-5 h-5 text-primary-dark" />
            <h3 className="text-[18px] font-semibold text-white tracking-tight">
              Professional Experience
            </h3>
          </div>

          <div className="space-y-6 border-l-2 border-white/10 pl-5 ml-2">
            {EXPERIENCES.map(exp => (
              <div key={exp.id} className="relative group">
                {/* Timeline node dot */}
                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-[#1e1e22] group-hover:scale-125 transition-transform" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-[15px] font-semibold text-white">
                    {exp.role}
                  </h4>
                  <span className="text-[12px] font-mono text-primary-dark font-medium">
                    {exp.period}
                  </span>
                </div>

                <p className="text-[13px] text-body-muted font-medium mt-0.5">
                  {exp.company} • {exp.location}
                </p>

                <ul className="mt-2.5 space-y-1.5 text-[13px] text-body-muted">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-dark mt-1">›</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exp.skills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-pill bg-white/5 border border-white/10 text-[11px] text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Matrix Section */}
        <section className="pt-4 border-t border-white/10">
          <h3 className="text-[18px] font-semibold text-white tracking-tight mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary-dark" />
            <span>Technical Competencies Matrix</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SKILL_GROUPS.map(({ category, icon: Icon, skills }) => (
              <div
                key={category}
                className="p-4 rounded-lg bg-surface-tile1/60 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-3 text-white font-medium text-[13.5px]">
                  <Icon className="w-4 h-4 text-primary-dark" />
                  <span>{category}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[11.5px] text-white/80 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Honors */}
        <section className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-primary-dark" />
            <h3 className="text-[18px] font-semibold text-white tracking-tight">
              Education & Background
            </h3>
          </div>
          <div className="p-4 rounded-lg bg-surface-tile1/60 border border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-[14px] font-semibold text-white">B.S. in Computer Science & Interactive Media</h4>
              <p className="text-[12.5px] text-body-muted">University of California, Berkeley • Magna Cum Laude</p>
            </div>
            <span className="text-[12px] font-mono text-white/50">2016 — 2020</span>
          </div>
        </section>
      </div>
    </div>
  );
};
