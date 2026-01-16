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
      className={`p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 text-center ${isDragging ? 'border-blue-500 bg-blue-900/30' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
        <UploadIcon />
        <p className="font-semibold text-slate-300">
          <span className="text-blue-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm">PNG files only</p>
      </div>
    </div>
  );
};