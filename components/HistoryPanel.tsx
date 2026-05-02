import React from 'react';
import { HISTORY_PREVIEW_COUNT } from '../utils/constants';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  fileCount: number;
  sizes: number[];
  fileNames: string[];
}

interface HistoryPanelProps {
  items: HistoryEntry[];
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ items, onClear }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent conversions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Stored locally on this device.</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
        >
          Clear
        </button>
      </div>
      <div className="divide-y divide-slate-200 px-6 py-2 dark:divide-slate-800">
        {items.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {entry.fileCount} file{entry.fileCount === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sizes (px): {entry.sizes.join(' · ')}
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:max-w-xs sm:text-right">
              {entry.fileNames.slice(0, HISTORY_PREVIEW_COUNT).join(', ')}
              {entry.fileNames.length > HISTORY_PREVIEW_COUNT
                ? ` +${entry.fileNames.length - HISTORY_PREVIEW_COUNT} more`
                : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
