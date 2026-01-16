import React, { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { SizeSelector } from './components/SizeSelector';
import { DownloadIcon, LoaderIcon, ConvertIcon, CheckCircleIcon, TrashIcon, ZipIcon } from './components/Icons';
import { convertPngToIco } from './utils/converter';

declare const JSZip: any;

interface IcoFile {
  name: string;
  blob: Blob;
  originalSize: number;
}

const App: React.FC = () => {
  const [pngFiles, setPngFiles] = useState<File[]>([]);
  const [icoFiles, setIcoFiles] = useState<IcoFile[]>([]);
  const [selectedSize, setSelectedSize] = useState<number>(512);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    let incomingFiles = Array.from(files);
    const errorMessages: string[] = [];

    if (incomingFiles.length > 100) {
      errorMessages.push("Maximum 100 files allowed per conversion. Only the first 100 files were selected.");
      incomingFiles = incomingFiles.slice(0, 100);
    }

    const validFiles = incomingFiles.filter(file => file.type === 'image/png');
    
    if (validFiles.length < incomingFiles.length) {
      errorMessages.push("Some files were not PNGs and were ignored.");
    }
    
    setError(errorMessages.length > 0 ? errorMessages.join(' ') : null);
    setPngFiles(validFiles);
    setIcoFiles([]);
  }, []);

  const handleConvert = async () => {
    if (pngFiles.length === 0) return;

    setIsConverting(true);
    setError(null);
    setIcoFiles([]);

    try {
      const conversionPromises = pngFiles.map(async (file) => {
        const blob = await convertPngToIco(file, [selectedSize]); // Pass size as an array
        const name = file.name.replace(/\.[^/.]+$/, '');
        return { name, blob, originalSize: file.size };
      });
      const results = await Promise.all(conversionPromises);
      setIcoFiles(results);
      setPngFiles([]);
    } catch (err) {
      setError('Conversion failed. One of the files might be corrupted or in an unsupported format.');
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };
  
  const handleSingleDownload = (name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.ico`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadAll = async () => {
    if (icoFiles.length === 0) return;
    const zip = new JSZip();
    icoFiles.forEach(({ name, blob }) => {
      zip.file(`${name}.ico`, blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_icons.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setPngFiles([]);
    setIcoFiles([]);
    setError(null);
    setIsConverting(false);
    setSelectedSize(512);
  };
  
  const renderFilePreviewList = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-slate-300">
        {pngFiles.length} file(s) ready to convert
      </h2>
      <div className="max-h-60 overflow-y-auto bg-slate-900/50 p-3 rounded-lg space-y-2">
        {pngFiles.map((file, index) => (
          <div key={index} className="flex items-center gap-3 bg-slate-700/50 p-2 rounded-md">
            <img src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 rounded-md object-contain bg-white/10 p-1" />
            <div className="flex-grow overflow-hidden">
              <p className="text-sm font-medium text-slate-300 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        ))}
      </div>

      <SizeSelector selectedSize={selectedSize} onSelectionChange={setSelectedSize} />

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleConvert}
          disabled={isConverting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isConverting ? <LoaderIcon /> : <ConvertIcon />}
          {isConverting ? 'Converting...' : `Convert ${pngFiles.length} file(s)`}
        </button>
        <button
          onClick={handleReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
        >
          <TrashIcon /> Clear
        </button>
      </div>
    </div>
  );

  const renderResultsList = () => (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-center gap-2 text-green-400">
         <CheckCircleIcon />
         <p className="font-semibold text-xl">Conversion Successful!</p>
      </div>
       <p className="text-slate-400">{icoFiles.length} file(s) converted to .ico format.</p>
       
       <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button
            onClick={handleDownloadAll}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
        >
            <ZipIcon />
            Download All (.zip)
        </button>
        <button
          onClick={handleReset}
          className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
        >
          Start Over
        </button>
      </div>
       
      <div className="max-h-60 overflow-y-auto bg-slate-900/50 p-3 mt-4 rounded-lg space-y-2 text-left">
        {icoFiles.map((file, index) => (
           <div key={index} className="flex items-center gap-3 bg-slate-700/50 p-2 rounded-md">
            <div className="flex-grow overflow-hidden">
              <p className="text-sm font-medium text-slate-300 truncate">{file.name}.ico</p>
              <p className="text-xs text-slate-400">{(file.originalSize / 1024).toFixed(2)} KB → {(file.blob.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
                onClick={() => handleSingleDownload(file.name, file.blob)}
                className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
                <DownloadIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200">
      <header className="py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          PNG → ICO Converter
        </h1>
        <p className="mt-2 text-slate-400">Batch convert PNG files to ICO format without quality loss.</p>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-xl mx-auto bg-slate-800/50 rounded-2xl shadow-2xl shadow-blue-500/10 backdrop-blur-sm border border-slate-700">
          <div className="p-6 md:p-8">
            
            {error && <p className="mb-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg whitespace-pre-line">{error}</p>}
            
            {pngFiles.length === 0 && icoFiles.length === 0 && <FileUploader onFileSelect={handleFileSelect} />}
            {pngFiles.length > 0 && renderFilePreviewList()}
            {icoFiles.length > 0 && renderResultsList()}
            
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-500">
        <p>Built by a world-class React engineer</p>
      </footer>
    </div>
  );
};

export default App;