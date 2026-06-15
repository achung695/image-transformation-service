'use client';

import { useState, useCallback } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { ProcessingStatusBar } from '@/components/ProcessingStatus';
import { ResultCard } from '@/components/ResultCard';
import { ProcessingStatus, ApiResponse } from '@/lib/types';

export default function Home() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ url: string; publicId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setStatus('idle');
  }, []);

  const handleProcess = async () => {
    if (!selectedFile) return;

    setError(null);
    setResult(null);

    try {
      setStatus('uploading');
      const formData = new FormData();
      formData.append('image', selectedFile);

      setStatus('removing-bg');

      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      setStatus('flipping');
      await new Promise((r) => setTimeout(r, 400)); // brief UI pause so step is visible

      setStatus('hosting');
      const text = await res.text();
      let data: ApiResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server error — request may have timed out. Please try again.');
      }

      if (!data.success) {
        throw new Error(data.error);
      }

      setResult({ url: data.url, publicId: data.publicId });
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const handleDelete = () => {
    setResult(null);
    setSelectedFile(null);
    setStatus('idle');
  };

  const isProcessing = ['uploading', 'removing-bg', 'flipping', 'hosting'].includes(status);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>
          </div>
          {/* Hitting header logo returns user to starting state */}
          <a href="/" className="font-semibold text-gray-900 text-lg hover:text-brand-500 transition-colors">
          ImageTransform
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        {/* Hero text */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Remove background & flip
          </h1>
          <p className="text-gray-500">
            Upload an image — we'll strip the background, flip it, and give you a shareable link.
          </p>
        </div>

        {/* Upload area */}
        <ImageUploader onFileSelect={handleFileSelect} disabled={isProcessing} />

        {/* Process button */}
        {selectedFile && !isProcessing && status !== 'done' && (
          <div className="animate-fade-in">
            <button
              onClick={handleProcess}
              className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-base hover:bg-brand-600 active:scale-[0.99] transition-all duration-150 shadow-sm shadow-brand-500/20"
            >
              Transform image →
            </button>
          </div>
        )}

        {/* Processing steps */}
        {isProcessing && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-5 text-center">Processing your image…</p>
            <ProcessingStatusBar status={status} />
          </div>
        )}

        {/* Error */}
        {status === 'error' && error && (
          <div className="animate-fade-in bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-700">Processing failed</p>
              <p className="text-sm text-red-500 mt-0.5">{error}</p>
              <button
                onClick={handleProcess}
                className="text-sm text-red-600 font-medium underline mt-1 hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && status === 'done' && (
          <ResultCard
            imageUrl={result.url}
            publicId={result.publicId}
            onDelete={handleDelete}
          />
        )}

        {/* Start over after done */}
        {status === 'done' && result && (
          <div className="text-center animate-fade-in">
            <button
              onClick={() => { setResult(null); setSelectedFile(null); setStatus('idle'); }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Transform another image
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
