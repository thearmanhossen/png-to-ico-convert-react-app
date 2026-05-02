import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { SizeSelector } from './components/SizeSelector';
import {
  CheckCircleIcon,
  ConvertIcon,
  DownloadIcon,
  LoaderIcon,
  TrashIcon,
  ZipIcon,
} from './components/Icons';
import { HistoryEntry, HistoryPanel } from './components/HistoryPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { convertPngToIco } from './utils/converter';
import { HISTORY_PREVIEW_COUNT } from './utils/constants';

declare const JSZip: any;

const MAX_FILES = 100;
const HISTORY_STORAGE_KEY = 'png-to-ico-history';
const HISTORY_LIMIT = 8;

interface PngItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface IcoFile {
  id: string;
  name: string;
  blob: Blob;
  originalSize: number;
  sizes: number[];
}

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;

const generateHistoryEntryId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const App: React.FC = () => {
  const [items, setItems] = useState<PngItem[]>([]);
  const [icoFiles, setIcoFiles] = useState<IcoFile[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 256]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [completedCount, setCompletedCount] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const normalizedSizes = useMemo(
    () => Array.from(new Set(selectedSizes)).sort((a, b) => a - b),
    [selectedSizes],
  );

  const overallProgress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setHistory(parsed as HistoryEntry[]);
      }
    } catch (loadError) {
      console.error('Failed to load conversion history', loadError);
    }
  }, []);

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [items]);

  const handleFileSelect = useCallback((files: File[]) => {
    let incomingFiles = Array.from(files);
    const errorMessages: string[] = [];

    if (incomingFiles.length > MAX_FILES) {
      errorMessages.push(
        `Maximum ${MAX_FILES} files allowed per conversion. Only the first ${MAX_FILES} files were selected.`,
      );
      incomingFiles = incomingFiles.slice(0, MAX_FILES);
    }

    const validFiles = incomingFiles.filter((file) => {
      const isPngType = file.type === 'image/png';
      const hasPngExtension = file.name.toLowerCase().endsWith('.png');
      return isPngType || hasPngExtension;
    });

    if (validFiles.length === 0) {
      setError('No valid PNG files were selected. Please choose PNG images only.');
      return;
    }

    if (validFiles.length < incomingFiles.length) {
      errorMessages.push('Some files were not PNGs and were ignored.');
    }

    const nextItems = validFiles.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${file.size}-${index}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setItems(nextItems);
    setIcoFiles([]);
    setProgress({});
    setCompletedCount(0);
    setError(errorMessages.length > 0 ? errorMessages.join(' ') : null);
  }, []);

  const handleSizeChange = useCallback(
    (sizes: number[]) => {
      setSelectedSizes(sizes);
      if (!isConverting && icoFiles.length > 0) {
        setIcoFiles([]);
      }
    },
    [icoFiles.length, isConverting],
  );

  const handleConvert = async () => {
    if (items.length === 0 || normalizedSizes.length === 0) {
      setError('Select at least one icon size before converting.');
      return;
    }

    setIsConverting(true);
    setError(null);
    setIcoFiles([]);
    setProgress(Object.fromEntries(items.map((item) => [item.id, 0])));
    setCompletedCount(0);

    const results: IcoFile[] = [];
    const failedFiles: string[] = [];

    for (const [index, item] of items.entries()) {
      try {
        setProgress((prev) => ({ ...prev, [item.id]: 20 }));
        const blob = await convertPngToIco(item.file, normalizedSizes);
        const name = item.file.name.replace(/\.[^/.]+$/, '');
        results.push({
          id: item.id,
          name,
          blob,
          originalSize: item.file.size,
          sizes: normalizedSizes,
        });
        setProgress((prev) => ({ ...prev, [item.id]: 100 }));
      } catch (conversionError) {
        failedFiles.push(item.file.name);
        setProgress((prev) => ({ ...prev, [item.id]: 100 }));
        console.error('Conversion failed for file', item.file.name, conversionError);
      } finally {
        setCompletedCount(index + 1);
      }
    }

    if (failedFiles.length > 0) {
      setError(
        `Failed to convert ${failedFiles.length} file(s): ${failedFiles
          .slice(0, HISTORY_PREVIEW_COUNT)
          .join(', ')}${failedFiles.length > HISTORY_PREVIEW_COUNT ? '…' : ''}
        }`,
      );
    }

    if (results.length > 0) {
      setIcoFiles(results);
      const entry: HistoryEntry = {
        id: generateHistoryEntryId(),
        timestamp: Date.now(),
        fileCount: results.length,
        sizes: normalizedSizes,
        fileNames: results.map((file) => file.name),
      };
      setHistory((previousHistory) => {
        const updated = [entry, ...previousHistory].slice(0, HISTORY_LIMIT);
        try {
          window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        } catch (storageError) {
          console.error('Failed to persist conversion history', storageError);
        }
        return updated;
      });
    }

    setIsConverting(false);
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
    if (icoFiles.length === 0) {
      return;
    }
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
    setItems([]);
    setIcoFiles([]);
    setError(null);
    setIsConverting(false);
    setProgress({});
    setCompletedCount(0);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (storageError) {
      console.error('Failed to clear conversion history', storageError);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">PNG → ICO</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              PNG to ICO Converter
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Crisp, multi-size icons with a minimal, Standard Notes-inspired workspace.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <div className="space-y-6 p-6 md:p-8">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            )}

            <FileUploader onFileSelect={handleFileSelect} />

            {items.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {items.length} file{items.length === 1 ? '' : 's'} ready
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Conversion stays in your browser · PNG only
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Batch mode · up to {MAX_FILES}
                  </div>
                </div>

                {isConverting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Converting…</span>
                      <span>{overallProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-slate-900 transition-all duration-200 dark:bg-white"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {items.map((item) => {
                    const itemProgress = progress[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center"
                      >
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="h-14 w-14 rounded-xl border border-slate-200 bg-slate-50 object-contain p-2 dark:border-slate-800 dark:bg-slate-900"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {item.file.name}
                            </p>
                            <span className="text-xs text-slate-400">{formatSize(item.file.size)}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-1.5 rounded-full bg-slate-900 transition-all duration-200 dark:bg-white"
                              style={{ width: `${itemProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isConverting
                              ? itemProgress === 100
                                ? 'Converted'
                                : 'Converting…'
                              : 'Ready to convert'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <SizeSelector selectedSizes={selectedSizes} onSelectionChange={handleSizeChange} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={handleConvert}
                    disabled={isConverting || items.length === 0 || normalizedSizes.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-700"
                  >
                    {isConverting ? <LoaderIcon /> : <ConvertIcon />}
                    {isConverting ? 'Converting…' : `Convert ${items.length} file${items.length === 1 ? '' : 's'}`}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white sm:w-auto"
                  >
                    <TrashIcon />
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {icoFiles.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="space-y-6 p-6 md:p-8">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Conversion complete
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {icoFiles.length} icon{icoFiles.length === 1 ? '' : 's'} ready · Sizes:{' '}
                    {normalizedSizes.join(' · ')} px
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleDownloadAll}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                  <ZipIcon />
                  Download All (.zip)
                </button>
                <button
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                >
                  Start over
                </button>
              </div>

              <div className="space-y-2">
                {icoFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}.ico</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatSize(file.originalSize)} → {formatSize(file.blob.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSingleDownload(file.name, file.blob)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      <DownloadIcon />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <HistoryPanel items={history} onClear={handleClearHistory} />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
        Designed for focus · Files never leave your browser
      </footer>
    </div>
  );
};

export default App;
