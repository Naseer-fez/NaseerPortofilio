'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-stone-950 p-6 text-white select-none">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-stone-900/90 p-6 text-center backdrop-blur-xl shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold">System Recovery</h2>
        <p className="mt-2 text-xs text-white/60">
          An unexpected interface exception occurred. The macOS workspace can be safely recovered.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload Desktop</span>
        </button>
      </div>
    </div>
  );
}
