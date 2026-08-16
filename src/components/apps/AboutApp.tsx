'use client';

import React, { useState } from 'react';
import { PROFILE_DATA } from '@/data/profile';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import {
  User,
  Briefcase,
  Code2,
  FileText,
  Download,
  Mail,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Sparkles,
} from 'lucide-react';

type TabType = 'overview' | 'timeline' | 'skills' | 'resume';

export function AboutApp() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [downloading, setDownloading] = useState(false);
  const openWindow = useOSStore(state => state.openWindow);

  const handleTabChange = (tab: TabType) => {
    GlobalAudioManager.getInstance().playFx('click');
    setActiveTab(tab);
  };

  const handleDownloadResume = () => {
    GlobalAudioManager.getInstance().playFx('click');
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const a = document.createElement('a');
      a.href = '/resume.pdf';
      a.download = 'Shaik_Naseer_John_Ahmed_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 300);
  };

  const handleContactClick = () => {
    GlobalAudioManager.getInstance().playFx('click');
    openWindow('mail');
  };

  return (
    <div
      data-testid="about-app"
      className="flex-1 w-full h-full bg-stone-950/90 text-white flex flex-col overflow-hidden select-none"
    >
      {/* Navigation Tab Bar */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-2 shrink-0 overflow-hidden">
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar max-w-full py-0.5">
          <button
            data-testid="about-tab-overview"
            onClick={() => handleTabChange('overview')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <User size={13} />
            <span>Overview</span>
          </button>

          <button
            data-testid="about-tab-timeline"
            onClick={() => handleTabChange('timeline')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Briefcase size={13} />
            <span>Timeline</span>
          </button>

          <button
            data-testid="about-tab-skills"
            onClick={() => handleTabChange('skills')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Code2 size={13} />
            <span>Skills Matrix</span>
          </button>

          <button
            data-testid="about-tab-resume"
            onClick={() => handleTabChange('resume')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'resume'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Resume</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          data-testid="about-resume-download-btn"
          onClick={handleDownloadResume}
          disabled={downloading}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-600/40 transition-all shrink-0 whitespace-nowrap"
        >
          <Download size={13} />
          <span>{downloading ? 'Preparing PDF...' : 'Download Resume'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 select-text min-h-0">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto">
            {/* Hero Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg">
              {/* Avatar with radiant glow */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-xl overflow-hidden">
                  <img
                    src="/favicon.png"
                    alt={PROFILE_DATA.name}
                    className="w-full h-full object-cover rounded-2xl bg-stone-900"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-stone-900 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{PROFILE_DATA.status}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white break-words">
                  {PROFILE_DATA.name}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-blue-400">
                  {PROFILE_DATA.title}
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-xs text-white/50">
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">{PROFILE_DATA.location}</span>
                </div>

                {/* Social & Contact Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    data-testid="about-contact-btn"
                    onClick={handleContactClick}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition-all"
                  >
                    <Mail size={13} />
                    <span>Contact Me</span>
                  </button>
                  <a
                    href={PROFILE_DATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    <Github size={14} />
                  </a>
                  <a
                    href={PROFILE_DATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                  <a
                    href={PROFILE_DATA.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    <Twitter size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {PROFILE_DATA.stats.map(stat => (
                <div
                  key={stat.label}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-3 sm:p-3.5 text-center shadow-md"
                >
                  <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-white/60 font-medium mt-0.5 truncate">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Narrative Bio Section */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Biography & Philosophy</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                {PROFILE_DATA.bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAREER TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 max-w-3xl mx-auto py-2">
            <div className="relative border-l-2 border-blue-500/30 ml-2.5 sm:ml-4 pl-4 sm:pl-6 space-y-6 sm:space-y-8">
              {PROFILE_DATA.timeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot Node */}
                  <div className="absolute -left-[23px] sm:-left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-stone-950 shadow-md shadow-blue-500/50 group-hover:scale-125 transition-transform" />

                  <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-3.5 sm:p-4 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        {item.role}
                      </h4>
                      <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full self-start sm:self-auto mt-1 sm:mt-0 font-mono">
                        {item.year}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-white/70 mb-2">
                      {item.company} &bull; <span className="text-white/40">{item.location}</span>
                    </div>

                    <p className="text-xs text-white/80 mb-3 leading-relaxed">
                      {item.description}
                    </p>

                    <ul className="space-y-1 mb-3 text-xs text-white/70">
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start space-x-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {item.techStack.map(tech => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS MATRIX - Clean 100% filled bars without tags or percentages */}
        {activeTab === 'skills' && (
          <div className="space-y-6 max-w-4xl mx-auto py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {PROFILE_DATA.skillCategories.map(cat => (
                <div
                  key={cat.name}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center justify-between">
                    <span>{cat.name}</span>
                    <span className="text-white/40 text-[10px] lowercase">({cat.skills.length} skills)</span>
                  </h4>

                  <div className="space-y-3">
                    {cat.skills.map(skill => {
                      const testId = `skills-progress-bar-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                      return (
                        <div key={skill.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-white/90">{skill.name}</span>
                          </div>

                          {/* 100% Fully Filled Glowing Bar */}
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              data-testid={testId}
                              className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.35)] transition-all duration-500"
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESUME DOCUMENT */}
        {activeTab === 'resume' && (
          <div className="max-w-3xl mx-auto bg-stone-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-white/80 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/15 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{PROFILE_DATA.name}</h2>
                <p className="text-xs font-semibold text-blue-400">{PROFILE_DATA.title}</p>
                <p className="text-xs text-white/50">{PROFILE_DATA.location} &bull; {PROFILE_DATA.email}</p>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all"
                >
                  <FileText size={13} />
                  <span>View PDF</span>
                </a>
                <button
                  onClick={handleDownloadResume}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Download size={14} />
                  <span>Download Resume (PDF)</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase text-xs tracking-wider text-blue-400">
                Executive Summary
              </h3>
              <p className="leading-relaxed text-white/80">
                {PROFILE_DATA.bio[0]}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-white uppercase text-xs tracking-wider text-blue-400">
                Experience
              </h3>
              {PROFILE_DATA.timeline.slice(0, 3).map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{item.role} — {item.company}</span>
                    <span className="text-xs text-white/50 font-mono">{item.year}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-white/70 text-xs">
                    {item.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <h3 className="font-bold text-white uppercase text-xs tracking-wider text-blue-400">
                Education
              </h3>
              <div className="flex items-center justify-between font-bold text-white">
                <span>B.Tech in CSBS — Vignana Bharathi Institute of Technology (VBIT)</span>
                <span className="text-xs text-white/50 font-mono">Expected May 2028</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
