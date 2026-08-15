import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  Music,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  FolderGit2,
  Terminal,
  User,
  Info,
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  kind: 'folder' | 'code' | 'doc' | 'audio' | 'app';
  size: string;
  dateModified: string;
  icon: React.ComponentType<{ className?: string }>;
  appTarget?: string;
  description?: string;
}

const FILESYSTEM: Record<string, FileItem[]> = {
  root: [
    { id: 'f-projects', name: 'Projects', kind: 'folder', size: '--', dateModified: 'Today 12:40', icon: Folder },
    { id: 'f-documents', name: 'Documents', kind: 'folder', size: '--', dateModified: 'Yesterday', icon: Folder },
    { id: 'f-downloads', name: 'Downloads', kind: 'folder', size: '--', dateModified: 'Aug 10', icon: Folder },
    { id: 'app-projects', name: 'Projects.app', kind: 'app', size: '4.8 MB', dateModified: 'Today', icon: FolderGit2, appTarget: 'projects' },
    { id: 'app-term', name: 'Terminal.app', kind: 'app', size: '1.2 MB', dateModified: 'Today', icon: Terminal, appTarget: 'terminal' },
    { id: 'app-about', name: 'About.app', kind: 'app', size: '2.1 MB', dateModified: 'Today', icon: User, appTarget: 'about' },
    { id: 'doc-readme', name: 'README.md', kind: 'doc', size: '4.2 KB', dateModified: 'Today 14:15', icon: FileText, description: 'Apple OS Portfolio Architectural Manifesto' },
    { id: 'code-synth', name: 'SynthEngine.ts', kind: 'code', size: '18.4 KB', dateModified: 'Aug 12', icon: FileCode, description: 'Web Audio Procedural DSP Oscillator Code' },
    { id: 'audio-demo', name: 'Midnight_Drive.mp3', kind: 'audio', size: '5.4 MB', dateModified: 'Aug 14', icon: Music, description: 'Synthwave Procedural Audio Master' },
  ],
  Projects: [
    { id: 'p-os', name: 'Apple_OS_Portfolio.ts', kind: 'code', size: '124 KB', dateModified: 'Today', icon: FileCode, description: 'Desktop OS Simulation kernel source' },
    { id: 'p-neural', name: 'Aura_Neural_Synth.ts', kind: 'code', size: '84 KB', dateModified: 'Yesterday', icon: FileCode, description: 'Generative Web Audio transformer models' },
    { id: 'p-chronos', name: 'Chronos_Raft_Core.rs', kind: 'code', size: '240 KB', dateModified: 'Aug 04', icon: FileCode, description: 'Raft consensus state machine implementation' },
  ],
  Documents: [
    { id: 'd-resume', name: 'Jane_Doe_Resume_2026.pdf', kind: 'doc', size: '210 KB', dateModified: 'Aug 01', icon: FileText, description: 'Staff Software Engineer Curriculum Vitae' },
    { id: 'd-arch', name: 'Systems_Architecture_Blueprint.pdf', kind: 'doc', size: '1.8 MB', dateModified: 'Aug 05', icon: FileText, description: 'High-Performance UI Runtime Specification' },
  ],
  Downloads: [
    { id: 'dl-assets', name: 'design_tokens_v2.json', kind: 'code', size: '8.4 KB', dateModified: 'Aug 14', icon: FileCode, description: 'Canonical Apple design token definitions' },
  ],
};

export const FinderApp: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<string[]>(['root']);
  const [historyIdx, setHistoryIdx] = useState(0);

  const currentFiles = (FILESYSTEM[currentFolder] || []).filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const navigateTo = (folderName: string) => {
    if (FILESYSTEM[folderName]) {
      const newHist = history.slice(0, historyIdx + 1);
      newHist.push(folderName);
      setHistory(newHist);
      setHistoryIdx(newHist.length - 1);
      setCurrentFolder(folderName);
      setSelectedFile(null);
    }
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setCurrentFolder(history[historyIdx - 1]);
      setSelectedFile(null);
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setCurrentFolder(history[historyIdx + 1]);
      setSelectedFile(null);
    }
  };

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.kind === 'folder') {
      navigateTo(item.name);
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e22]/95 text-body-dark flex flex-col select-text">
      {/* Top Finder Navigation Toolbar */}
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between gap-4 bg-surface-black/30 shrink-0">
        {/* History Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIdx === 0}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-semibold text-white/90 ml-2">
            {currentFolder === 'root' ? 'Macintosh HD' : currentFolder}
          </span>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 bg-white/10 rounded-md border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
              aria-label="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-36 sm:w-48 pl-8 pr-3 py-1 bg-white/5 border border-white/10 rounded-pill text-[12px] text-white placeholder:text-white/40 outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Main Split-Pane Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-44 bg-surface-black/40 border-r border-white/10 p-3 space-y-4 shrink-0 hidden sm:block">
          <div>
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider px-2">
              Favorites
            </span>
            <div className="mt-1.5 space-y-0.5">
              {[
                { id: 'root', label: 'Macintosh HD', icon: Folder },
                { id: 'Projects', label: 'Projects', icon: Folder },
                { id: 'Documents', label: 'Documents', icon: Folder },
                { id: 'Downloads', label: 'Downloads', icon: Folder },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                    currentFolder === item.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 text-primary-dark shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {currentFiles.map(file => {
                const Icon = file.icon;
                const isSelected = selectedFile?.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    onDoubleClick={() => handleItemDoubleClick(file)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/20 border-primary/50 text-white'
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 text-white/80'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 text-primary-dark mb-2">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[12.5px] font-medium truncate max-w-[120px]">{file.name}</span>
                    <span className="text-[10.5px] text-white/40 mt-0.5">{file.size}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full text-[12.5px]">
              <div className="flex items-center text-white/40 pb-2 border-b border-white/10 font-medium px-2">
                <span className="w-1/2">Name</span>
                <span className="w-1/4">Date Modified</span>
                <span className="w-1/4 text-right">Size</span>
              </div>
              <div className="divide-y divide-white/5">
                {currentFiles.map(file => {
                  const Icon = file.icon;
                  const isSelected = selectedFile?.id === file.id;
                  return (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      onDoubleClick={() => handleItemDoubleClick(file)}
                      className={`flex items-center py-2 px-2 rounded-md transition-colors cursor-pointer ${
                        isSelected ? 'bg-primary/20 text-white' : 'hover:bg-white/5 text-white/80'
                      }`}
                    >
                      <div className="w-1/2 flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 text-primary-dark shrink-0" />
                        <span className="font-medium truncate">{file.name}</span>
                      </div>
                      <span className="w-1/4 text-white/50">{file.dateModified}</span>
                      <span className="w-1/4 text-right text-white/50">{file.size}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Inspector Panel (When a file is selected) */}
        {selectedFile && (
          <div className="w-56 bg-surface-black/30 border-l border-white/10 p-4 space-y-3 shrink-0 hidden md:block text-[12px]">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Info className="w-4 h-4 text-primary-dark" />
              <span>Inspector</span>
            </div>
            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary-dark">
              {React.createElement(selectedFile.icon, { className: 'w-8 h-8' })}
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-[13px] truncate">{selectedFile.name}</p>
              <p className="text-white/50 text-[11px] uppercase tracking-wider">{selectedFile.kind}</p>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-1.5 text-white/70">
              <div className="flex justify-between">
                <span className="text-white/40">Size:</span>
                <span>{selectedFile.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Modified:</span>
                <span>{selectedFile.dateModified}</span>
              </div>
              {selectedFile.description && (
                <div className="pt-2 text-white/60 text-[11.5px] leading-relaxed">
                  {selectedFile.description}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
