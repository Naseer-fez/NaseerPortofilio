import React, { useState, useRef, useEffect } from 'react';

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      command: 'welcome',
      output: (
        <div className="space-y-1 text-white/90">
          <p className="text-emerald-400 font-bold"> Apple Portfolio OS — Interactive Terminal v1.0.4</p>
          <p className="text-white/70">Type <span className="text-primary-dark font-semibold">help</span> to list available commands. ArrowUp/Down to navigate history.</p>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setCmdHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);

    const [cmd, ...args] = trimmed.split(' ');
    const lowerCmd = cmd.toLowerCase();

    let outputNode: React.ReactNode;

    switch (lowerCmd) {
      case 'help':
        outputNode = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-white/80 py-1 font-mono text-[12px]">
            <div><span className="text-primary-dark font-bold">about</span> - Background & engineering philosophy</div>
            <div><span className="text-primary-dark font-bold">projects</span> - Flagship portfolio engineering works</div>
            <div><span className="text-primary-dark font-bold">skills</span> - Technical competencies matrix</div>
            <div><span className="text-primary-dark font-bold">contact</span> - Email, LinkedIn, GitHub endpoints</div>
            <div><span className="text-primary-dark font-bold">whoami</span> - Inspect active session context</div>
            <div><span className="text-primary-dark font-bold">date</span> - Display current timestamp</div>
            <div><span className="text-primary-dark font-bold">cat [file]</span> - Read file (e.g. cat README.md)</div>
            <div><span className="text-primary-dark font-bold">clear</span> - Clear terminal buffer</div>
            <div><span className="text-primary-dark font-bold">sudo</span> - Elevated administrative privileges</div>
          </div>
        );
        break;

      case 'about':
        outputNode = (
          <div className="space-y-1.5 text-white/85 text-[12.5px] leading-relaxed">
            <p className="font-semibold text-white">Full-Stack Implementation Specialist & Systems Architect</p>
            <p>Passionate about crafting ultra-high performance web experiences that combine low-level systems precision with Apple-grade aesthetic minimalism and fluid physics.</p>
            <p className="text-white/60">Core Focus: React 18, Web Audio DSP, Kinetic Typography, Low-Latency Web Applications, Distributed Systems.</p>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-[12px] font-mono">
            <div className="p-2 rounded bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">1. OS Portfolio Engine</span> — React 18 / TypeScript / Web Audio / Math Proximity
              <div className="text-white/60 text-[11px]">Desktop simulation with 8-way resize and 0% CPU sleep loop</div>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/10">
              <span className="text-cyan-400 font-bold">2. Aura Neural Synthesizer</span> — Web Audio DSP / WebAssembly / GLSL
              <div className="text-white/60 text-[11px]">Real-time generative sound engine with offline zero-network audio</div>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/10">
              <span className="text-purple-400 font-bold">3. Chronos Key-Value Store</span> — Rust / Raft Consensus / gRPC
              <div className="text-white/60 text-[11px]">Distributed fault-tolerant linearizable storage engine</div>
            </div>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-2 text-[12px] font-mono">
            <div>
              <span className="text-primary-dark font-bold">[Languages]:</span> TypeScript, JavaScript, Rust, Go, Python, SQL, GLSL, HTML5/CSS3
            </div>
            <div>
              <span className="text-emerald-400 font-bold">[Frontend]:</span> React 18, Next.js, Tailwind CSS, Web Audio API, Canvas 2D/WebGL, Framer Motion
            </div>
            <div>
              <span className="text-amber-400 font-bold">[Backend/Systems]:</span> Node.js, Express, Fastify, gRPC, Redis, PostgreSQL, Raft, Docker, WebSockets
            </div>
            <div>
              <span className="text-pink-400 font-bold">[Architecture]:</span> Distributed Consensus, 0% CPU Sleep Loops, Event-Driven FSMs, Micro-Frontends
            </div>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-[12.5px]">
            <p>📧 Email: <a href="mailto:engineer@portfolio.os" className="text-primary-dark hover:underline">engineer@portfolio.os</a></p>
            <p>🐙 GitHub: <a href="https://github.com" target="_blank" rel="noreferrer" className="text-primary-dark hover:underline">github.com/developer</a></p>
            <p>💼 LinkedIn: <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-primary-dark hover:underline">linkedin.com/in/developer</a></p>
          </div>
        );
        break;

      case 'whoami':
        outputNode = (
          <div className="text-[12px] font-mono text-emerald-400">
            guest@portfolio-os (interactive visitor session - full read/execute permissions)
          </div>
        );
        break;

      case 'date':
        outputNode = (
          <div className="text-[12px] font-mono text-white/80">
            {new Date().toString()}
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'cat':
        const file = args[0];
        if (file === 'README.md') {
          outputNode = (
            <div className="text-[12px] text-white/80 space-y-1">
              <p className="font-bold text-white"># High-Performance Apple OS Web Portfolio</p>
              <p>Implemented strictly adhering to design.md tokens, Action Blue (#0066cc), Obsidian canvas, and mathematical proximity scaling.</p>
            </div>
          );
        } else if (file === 'system.log') {
          outputNode = (
            <div className="text-[11px] font-mono text-white/60 space-y-0.5">
              <p>[INFO] Desktop kernel initialized (100vw x 100vh)</p>
              <p>[INFO] Proximity Dock engine active (R=150px, S_base=40px, S_max=72px)</p>
              <p>[INFO] Kinetic typography deformation field mounted (R=220px, wght: 600&rarr;850)</p>
              <p>[INFO] Web Audio engine standby (Strict zero-autoplay policy)</p>
            </div>
          );
        } else {
          outputNode = <span className="text-rose-400">cat: {file || 'null'}: No such file or directory (try 'cat README.md' or 'cat system.log')</span>;
        }
        break;

      case 'sudo':
        outputNode = (
          <div className="text-rose-400 font-bold">
            Permission denied: User 'guest' is not in the sudoers file. This incident will be reported to Santa.
          </div>
        );
        break;

      default:
        outputNode = (
          <div className="text-rose-400">
            zsh: command not found: {cmd}. Type <span className="text-white font-bold">help</span> to list commands.
          </div>
        );
    }

    setHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        command: rawCmd,
        output: outputNode,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIdx(nextIdx);
          setInput(cmdHistory[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInput('');
        }
      }
    }
  };

  return (
    <div
      className="w-full h-full bg-surface-black text-[#f1f1f1] font-mono text-[13px] p-4 overflow-y-auto flex flex-col justify-between select-text"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Buffer Output */}
      <div className="space-y-3">
        {history.map(item => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 text-white/60 text-[12px]">
              <span className="text-emerald-400 font-bold">guest@portfolio:~$</span>
              <span className="text-white font-semibold">{item.command}</span>
              <span className="text-white/30 text-[10px] ml-auto">{item.timestamp}</span>
            </div>
            <div className="pl-3 border-l border-white/10">{item.output}</div>
          </div>
        ))}

        {/* Live Input Prompt */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold shrink-0">guest@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[13px] p-0 focus:ring-0"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
