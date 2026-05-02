import React from 'react';

const SIZES = [16, 32, 48, 256];

interface SizeSelectorProps {
  selectedSizes: number[];
  onSelectionChange: (sizes: number[]) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSizes, onSelectionChange }) => {
  const handleSizeClick = (size: number) => {
    if (selectedSizes.includes(size)) {
      onSelectionChange(selectedSizes.filter((value) => value !== size));
      return;
    }
    onSelectionChange([...selectedSizes, size].sort((a, b) => a - b));
  };

  return (
    <div className="my-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Icon sizes</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Multi-select</span>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeClick(size)}
            className={`group flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              selectedSizes.includes(size)
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-900'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white'
            }`}
          >
            <span>{size}×{size}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">
              {selectedSizes.includes(size) ? 'On' : 'Off'}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Standard ICO sizes optimized for modern Windows icons.
      </p>
    </div>
  );
};
