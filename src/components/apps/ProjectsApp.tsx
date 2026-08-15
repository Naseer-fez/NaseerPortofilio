'use client';

import React, { useState, useMemo } from 'react';
import { PROJECTS, ProjectItem } from '@/data/projects';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import {
  Search,
  ExternalLink,
  Github,
  X,
  Sparkles,
  Layers,
  Cpu,
  Server,
  BarChart2,
  Activity,
  Layout,
  Zap,
  Database,
  Terminal,
  Shield,
  FolderGit2,
  Music,
  Home,
  Sliders,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', filterKey: 'All' },
  { id: 'systems', label: 'Systems', filterKey: 'Systems' },
  { id: 'ai-ml', label: 'AI / ML', filterKey: 'AI / ML' },
  { id: 'full-stack', label: 'Full Stack', filterKey: 'Full Stack' },
  { id: 'cloud', label: 'Cloud', filterKey: 'Cloud' },
  { id: 'database', label: 'Database', filterKey: 'Database' },
  { id: 'devops', label: 'DevOps', filterKey: 'DevOps' },
  { id: 'creative', label: 'Creative', filterKey: 'Creative' },
];

export function ProjectsApp() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(project => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.techStack.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCategorySelect = (filterKey: string) => {
    GlobalAudioManager.getInstance().playFx('click');
    setActiveCategory(filterKey);
  };

  const handleProjectSelect = (project: ProjectItem) => {
    GlobalAudioManager.getInstance().playFx('click');
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    GlobalAudioManager.getInstance().playFx('click');
    setSelectedProject(null);
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Layout':
        return <Layout className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Server':
        return <Server className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'BarChart2':
        return <BarChart2 className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'FolderGit2':
        return <FolderGit2 className="w-5 h-5" />;
      case 'Music':
        return <Music className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div
      data-testid="projects-app"
      className="flex-1 w-full h-full bg-stone-950/90 text-white flex flex-col overflow-hidden select-none"
    >
      {/* Top Controls Header */}
      <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.filterKey;
            const count =
              cat.filterKey === 'All'
                ? PROJECTS.length
                : PROJECTS.filter(p => p.category === cat.filterKey).length;

            return (
              <button
                key={cat.id}
                data-testid={`project-filter-${cat.id}`}
                onClick={() => handleCategorySelect(cat.filterKey)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            data-testid="project-search-input"
            type="text"
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-blue-500 focus:bg-white/15 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {filteredProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-white/50">
            <Sparkles className="w-10 h-10 mb-3 text-white/20" />
            <p className="text-sm font-medium">No matching projects found</p>
            <p className="text-xs text-white/40 mt-1">Try adjusting your search query or active filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                data-testid={`project-card-${project.id}`}
                onClick={() => handleProjectSelect(project)}
                className="group relative flex flex-col bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
              >
                {/* Gradient Header Badge & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center text-white shadow-md`}
                    >
                      {renderIcon(project.iconName)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {project.featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Featured
                    </span>
                  )}
                </div>

                {/* Tagline */}
                <p className="text-xs text-white/80 line-clamp-2 mb-3">
                  {project.tagline}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3 mt-auto">
                  {project.techStack.slice(0, 4).map(tech => (
                    <span
                      key={tech}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 font-mono">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-400 font-medium">
                  <span className="group-hover:underline flex items-center gap-1">
                    View Architecture & Metrics &rarr;
                  </span>
                  <div className="flex items-center space-x-2 text-white/40">
                    {project.githubUrl && (
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          window.open(project.githubUrl, '_blank');
                        }}
                        className="hover:text-white p-1"
                        title="GitHub Repository"
                      >
                        <Github size={14} />
                      </span>
                    )}
                    {project.demoUrl && (
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          window.open(project.demoUrl, '_blank');
                        }}
                        className="hover:text-white p-1"
                        title="Live Demo"
                      >
                        <ExternalLink size={14} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          data-testid="project-modal"
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-xl max-h-[90%] bg-stone-900 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div className={`p-5 bg-gradient-to-r ${selectedProject.gradient} relative`}>
              <button
                data-testid="project-modal-close"
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  {renderIcon(selectedProject.iconName)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedProject.title}</h2>
                  <p className="text-xs text-white/80">{selectedProject.category}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-white/60 uppercase tracking-wider text-[10px] mb-1">
                  Architecture & Overview
                </h4>
                <p className="text-white/90 leading-relaxed text-sm">
                  {selectedProject.description}
                </p>
              </div>

              {/* Metrics Grid */}
              {selectedProject.metrics && (
                <div>
                  <h4 className="font-semibold text-white/60 uppercase tracking-wider text-[10px] mb-2">
                    Key Performance Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.metrics.map(m => (
                      <div key={m.label} className="bg-white/5 rounded-lg p-2.5 border border-white/10 text-center">
                        <div className="text-blue-400 font-bold text-sm">{m.value}</div>
                        <div className="text-[10px] text-white/50">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Technical Highlights */}
              <div>
                <h4 className="font-semibold text-white/60 uppercase tracking-wider text-[10px] mb-1.5">
                  Engineering Highlights
                </h4>
                <ul className="space-y-1.5">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start space-x-2 text-white/80">
                      <span className="text-blue-400 font-bold mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Complete Tech Stack */}
              <div>
                <h4 className="font-semibold text-white/60 uppercase tracking-wider text-[10px] mb-2">
                  Full Technology Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techStack.map(tech => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-white/10 text-white/90 font-mono text-[11px] border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-end space-x-3">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center space-x-2 transition-colors"
                >
                  <Github size={14} />
                  <span>Source Code</span>
                </a>
              )}
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-colors shadow-lg shadow-blue-600/30"
                >
                  <ExternalLink size={14} />
                  <span>Live Project Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
