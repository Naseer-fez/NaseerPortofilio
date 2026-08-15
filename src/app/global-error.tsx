'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen w-screen items-center justify-center bg-black text-white select-none">
        <div className="text-center p-8 max-w-sm rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl">
          <h2 className="text-lg font-bold">Critical System Error</h2>
          <p className="text-xs text-white/60 mt-2 mb-6">
            A critical system boundary exception occurred.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
