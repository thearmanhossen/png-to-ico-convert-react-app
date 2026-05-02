import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  const handleUploaderClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleUploaderClick}
      className={`group cursor-pointer rounded-2xl border border-dashed px-6 py-10 text-center transition-all duration-200 ${
        isDragging
          ? 'border-slate-900 bg-slate-100 text-slate-900 dark:border-white dark:bg-slate-900/60 dark:text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition group-hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <UploadIcon />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {isDragging ? 'Drop your PNG files' : 'Drop PNG files here'}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            or click to browse · up to 100 files at once
          </p>
        </div>
      </div>
    </div>
  );
};
