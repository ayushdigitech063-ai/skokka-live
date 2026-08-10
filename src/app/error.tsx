'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled frontend error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-center text-white">
      <div className="max-w-md space-y-4 rounded-3xl border border-rose-500/40 bg-slate-900/90 p-8 shadow-2xl">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-2xl font-bold tracking-tight text-rose-300">Something went wrong!</h2>
        <p className="text-sm font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 text-left overflow-auto max-h-32">
          {error.message || 'Runtime TypeError: fetch failed'}
        </p>
        <p className="text-xs text-slate-400">
          An unexpected error occurred while rendering the page. Ensure the backend server is running and accessible.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-400 focus:outline-none"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
