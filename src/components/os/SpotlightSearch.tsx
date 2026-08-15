import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { APPS } from '@/lib/constants/apps';
import { Search } from 'lucide-react';

export function SpotlightSearch() {
  const spotlightOpen = useOSStore(state => state.spotlightOpen);
  const setSpotlightOpen = useOSStore(state => state.setSpotlightOpen);
  const openWindow = useOSStore(state => state.openWindow);

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spotlightOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [spotlightOpen]);

  if (!spotlightOpen) return null;

  const filteredApps = APPS.filter(app =>
    app.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: any) => {
    openWindow(id);
    setSpotlightOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSpotlightOpen(false);
    } else if (e.key === 'Enter' && filteredApps.length > 0) {
      handleSelect(filteredApps[0].id);
    }
  };

  return (
    <div
      data-testid="spotlight-backdrop"
      className="fixed inset-0 z-[9995] flex items-start justify-center pt-[18vh] bg-black/30 backdrop-blur-sm"
      onClick={() => setSpotlightOpen(false)}
    >
      <div
        data-testid="spotlight-modal"
        className="w-[560px] rounded-2xl backdrop-blur-2xl bg-stone-900/85 border border-white/20 shadow-2xl overflow-hidden text-white"
        onClick={e => e.stopPropagation()}
        style={{ backdropFilter: 'blur(32px)' }}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-white/50 mr-3" />
          <input
            ref={inputRef}
            data-testid="spotlight-input"
            type="text"
            placeholder="Spotlight Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-lg outline-none placeholder-white/40 text-white"
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredApps.map((app, idx) => (
            <div
              key={app.id}
              data-testid={`spotlight-result-${app.id}`}
              onClick={() => handleSelect(app.id)}
              className={`flex items-center px-4 py-2.5 cursor-pointer hover:bg-blue-600 ${
                idx === 0 ? 'bg-white/10' : ''
              }`}
            >
              <span className="text-sm font-medium">{app.title}</span>
              <span className="ml-auto text-xs text-white/50">Application</span>
            </div>
          ))}
          {filteredApps.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-white/40">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
