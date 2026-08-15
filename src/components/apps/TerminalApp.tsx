import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { PROJECTS } from '@/data/projects';
import { PROFILE_DATA } from '@/data/profile';

interface TerminalEntry {
  id: string;
  command?: string;
  output: React.ReactNode;
  timestamp: Date;
}

const COMMANDS = [
  'help',
  'about',
  'projects',
  'skills',
  'clear',
  'neofetch',
  'theme',
  'date',
  'contact',
  'sudo',
  'cat',
  'matrix',
];

const VIRTUAL_FILES: Record<string, string> = {
  'resume.txt': `${PROFILE_DATA.name} — ${PROFILE_DATA.title}\nLocation: ${PROFILE_DATA.location}\nEmail: ${PROFILE_DATA.email}\nGitHub: ${PROFILE_DATA.github}\n\nExperience: 8+ Years in Distributed Systems, Web Audio & High-Performance UI.`,
  'bio.md': PROFILE_DATA.bio.join('\n\n'),
  'secret.txt': '🎉 Easter Egg Found! "Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs',
};

export function TerminalApp() {
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrix, setIsMatrix] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const openWindow = useOSStore(state => state.openWindow);
  const setTheme = useOSStore(state => state.setTheme);

  // Render initial neofetch on mount
  useEffect(() => {
    setHistory([
      {
        id: 'initial-neofetch',
        output: renderNeofetch(),
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom on output change
  useEffect(() => {
    if (endRef.current && typeof endRef.current.scrollIntoView === 'function') {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Focus input when clicking terminal container
  const handleContainerClick = () => {
    if (!isMatrix) {
      inputRef.current?.focus();
    }
  };

  // Matrix Digital Rain Canvas Effect
  useEffect(() => {
    if (!isMatrix) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 640;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        setIsMatrix(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMatrix]);

  function renderNeofetch() {
    return (
      <div data-testid="neofetch-banner" className="my-2 select-text font-mono text-xs leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
          <div className="sm:col-span-4 text-emerald-400 font-bold whitespace-pre">
{`   /\\_/\\
  ( o.o )  Portfolio OS
   > ^ <   Sonoma v2.4`}
          </div>
          <div className="sm:col-span-8 space-y-0.5 text-white/90">
            <div><span className="text-blue-400 font-semibold">dev@macbook-pro</span></div>
            <div className="text-white/30">-----------------------</div>
            <div><span className="text-purple-400 font-medium">OS:</span> macOS Sonoma (Web Edition)</div>
            <div><span className="text-purple-400 font-medium">Host:</span> MacBook Pro M3 Max 64GB</div>
            <div><span className="text-purple-400 font-medium">Kernel:</span> 24.2.0 Darwin x86_64</div>
            <div><span className="text-purple-400 font-medium">Uptime:</span> 42 days, 13 hours, 37 mins</div>
            <div><span className="text-purple-400 font-medium">Shell:</span> zsh 5.9 (x86_64-apple-darwin24.0)</div>
            <div><span className="text-purple-400 font-medium">Resolution:</span> 3840x2160 @ 120Hz Retina</div>
            <div><span className="text-purple-400 font-medium">Theme:</span> Sonoma Dark (Glassmorphic)</div>
            <div><span className="text-purple-400 font-medium">CPU:</span> Apple M3 Max (16 cores @ 4.05GHz)</div>
            <div><span className="text-purple-400 font-medium">Memory:</span> 32.4 GiB / 64.0 GiB (50%)</div>
          </div>
        </div>

        {/* ANSI Color palette swatches */}
        <div className="flex space-x-1.5 mt-3 pt-2 border-t border-white/10">
          <div className="w-4 h-3 rounded-xs bg-stone-900" />
          <div className="w-4 h-3 rounded-xs bg-red-500" />
          <div className="w-4 h-3 rounded-xs bg-emerald-500" />
          <div className="w-4 h-3 rounded-xs bg-yellow-400" />
          <div className="w-4 h-3 rounded-xs bg-blue-500" />
          <div className="w-4 h-3 rounded-xs bg-purple-500" />
          <div className="w-4 h-3 rounded-xs bg-cyan-400" />
          <div className="w-4 h-3 rounded-xs bg-white" />
        </div>
      </div>
    );
  }

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setHistory(prev => [
        ...prev,
        {
          id: String(Date.now()),
          command: '',
          output: null,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    GlobalAudioManager.getInstance().playFx('click');
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = null;

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1 my-1 text-xs">
            <div className="text-white/60 font-semibold mb-1">Available commands:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
              <div><span className="text-yellow-400 font-mono">about</span> — Developer bio</div>
              <div><span className="text-yellow-400 font-mono">projects</span> — Portfolio gallery</div>
              <div><span className="text-yellow-400 font-mono">skills</span> — Tech stack & skills</div>
              <div><span className="text-yellow-400 font-mono">neofetch</span> — System telemetry</div>
              <div><span className="text-yellow-400 font-mono">contact</span> — Open mail & links</div>
              <div><span className="text-yellow-400 font-mono">cat [file]</span> — Print file content</div>
              <div><span className="text-yellow-400 font-mono">theme [mode]</span> — dark / light</div>
              <div><span className="text-yellow-400 font-mono">matrix</span> — Digital rain mode</div>
              <div><span className="text-yellow-400 font-mono">date</span> — System date</div>
              <div><span className="text-yellow-400 font-mono">sudo [cmd]</span> — Superuser mode</div>
              <div><span className="text-yellow-400 font-mono">clear</span> — Clear terminal</div>
              <div><span className="text-yellow-400 font-mono">help</span> — Display this help</div>
            </div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-2 my-1 text-xs">
            <div className="text-emerald-400 font-semibold">{PROFILE_DATA.name} — {PROFILE_DATA.title}</div>
            <p className="text-white/80">{PROFILE_DATA.bio[0]}</p>
            <div className="text-white/60 text-[11px]">
              Tip: Type <span className="text-yellow-400 font-mono">open about</span> or launch from Dock to view the interactive profile.
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2 my-1 text-xs">
            <div className="text-emerald-400 font-semibold">Featured Portfolio Projects:</div>
            <div className="space-y-1.5">
              {PROJECTS.map(p => (
                <div key={p.id} className="border-l-2 border-blue-500 pl-2">
                  <div className="font-semibold text-white/90">{p.title} <span className="text-white/40 text-[10px]">[{p.category}]</span></div>
                  <div className="text-white/70 text-[11px]">{p.tagline}</div>
                  <div className="text-blue-400 text-[10px]">{p.techStack.join(' • ')}</div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 my-1 text-xs">
            {PROFILE_DATA.skillCategories.map(cat => (
              <div key={cat.name}>
                <div className="text-purple-400 font-semibold text-[11px]">{cat.name}:</div>
                <div className="text-white/80 text-[11px]">
                  {cat.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'neofetch':
        output = renderNeofetch();
        break;

      case 'theme':
        if (args[0] === 'dark' || args[0] === 'light' || args[0] === 'system') {
          setTheme(args[0]);
          output = <div className="text-emerald-400 text-xs">Theme switched to {args[0]}.</div>;
        } else {
          output = <div className="text-white/60 text-xs">Usage: theme [dark | light | system]</div>;
        }
        break;

      case 'date':
        output = <div className="text-white/90 text-xs font-mono">{new Date().toString()}</div>;
        break;

      case 'contact':
        openWindow('mail');
        output = (
          <div className="space-y-1 my-1 text-xs">
            <div className="text-emerald-400 font-semibold">Opening Mail Application...</div>
            <div>Email: <span className="text-blue-400">{PROFILE_DATA.email}</span></div>
            <div>GitHub: <span className="text-blue-400">{PROFILE_DATA.github}</span></div>
            <div>LinkedIn: <span className="text-blue-400">{PROFILE_DATA.linkedin}</span></div>
          </div>
        );
        break;

      case 'sudo':
        output = (
          <div className="text-red-400 text-xs">
            🔒 Permission denied: Incident reported to Santa Claus.
          </div>
        );
        break;

      case 'cat':
        if (!args[0]) {
          output = (
            <div className="text-white/60 text-xs">
              Usage: cat [filename]. Available files: {Object.keys(VIRTUAL_FILES).join(', ')}
            </div>
          );
        } else if (VIRTUAL_FILES[args[0]]) {
          output = (
            <pre className="text-white/90 text-xs whitespace-pre-wrap font-mono">
              {VIRTUAL_FILES[args[0]]}
            </pre>
          );
        } else {
          output = <div className="text-red-400 text-xs">cat: {args[0]}: No such file or directory</div>;
        }
        break;

      case 'matrix':
        setIsMatrix(true);
        output = <div className="text-emerald-400 text-xs">Entering Matrix digital rain. Press ESC or Ctrl+C to exit.</div>;
        break;

      default:
        output = (
          <div className="text-red-400 text-xs font-mono">
            zsh: command not found: {command}. Type &lsquo;<span className="text-yellow-400">help</span>&rsquo; for available commands.
          </div>
        );
        break;
    }

    setHistory(prev => [
      ...prev,
      {
        id: String(Date.now()),
        command: trimmed,
        output,
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.toLowerCase().trim();
      if (!current) return;
      const match = COMMANDS.find(c => c.startsWith(current));
      if (match) {
        setInput(match);
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      data-testid="terminal-app"
      ref={containerRef}
      onClick={handleContainerClick}
      className="flex-1 w-full h-full bg-[#0c0c0e]/95 text-stone-100 font-mono text-xs p-3 overflow-y-auto select-text flex flex-col relative"
      style={{ minHeight: '100%' }}
    >
      {/* Matrix Canvas Overlay */}
      {isMatrix && (
        <div
          data-testid="terminal-matrix-canvas"
          className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setIsMatrix(false)}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="relative z-40 bg-black/70 px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-[11px] shadow-lg mb-4 pointer-events-none">
            Matrix Mode Active — Press ESC or Click to Exit
          </div>
        </div>
      )}

      {/* Terminal History */}
      <div data-testid="terminal-history" className="space-y-2 flex-1">
        {history.map(entry => (
          <div key={entry.id} className="space-y-1">
            {entry.command !== undefined && (
              <div className="flex items-center space-x-2 text-white/90">
                <span className="text-emerald-400 font-bold">dev@macbook</span>
                <span className="text-purple-400 font-bold">~</span>
                <span className="text-white/50">$</span>
                <span className="font-semibold text-white">{entry.command}</span>
              </div>
            )}
            {entry.output}
          </div>
        ))}
      </div>

      {/* Active Prompt & Input */}
      <div className="flex items-center space-x-2 pt-2 mt-auto">
        <span data-testid="terminal-prompt" className="text-emerald-400 font-bold select-none">
          dev@macbook
        </span>
        <span className="text-purple-400 font-bold select-none">~</span>
        <span className="text-white/50 select-none">$</span>
        <input
          ref={inputRef}
          data-testid="terminal-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent text-stone-100 outline-none border-none p-0 font-mono text-xs focus:ring-0"
        />
      </div>

      <div ref={endRef} />
    </div>
  );
}
