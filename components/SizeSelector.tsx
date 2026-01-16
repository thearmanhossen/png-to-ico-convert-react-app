import React from 'react';

const SIZES = [16, 24, 32, 48, 64, 128, 256, 512];

interface SizeSelectorProps {
  selectedSize: number;
  onSelectionChange: (size: number) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, onSelectionChange }) => {
  const handleSizeClick = (size: number) => {
    onSelectionChange(size);
  };

  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold text-center text-slate-300 mb-3">Select Icon Size</h3>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeClick(size)}
            className={`p-2 w-full rounded-lg font-mono text-sm font-semibold border-2 transition-all duration-200 ${
              selectedSize === size
                ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};