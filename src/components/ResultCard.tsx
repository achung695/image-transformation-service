'use client';

import { useState } from 'react';

interface ResultCardProps {
  imageUrl: string;
  publicId: string;
  onDelete: () => void;
}

export function ResultCard({ imageUrl, publicId, onDelete }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this image permanently?')) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      const encodedId = encodeURIComponent(publicId);
      const res = await fetch(`/api/image/${encodedId}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        onDelete();
      } else {
        setDeleteError(data.error ?? 'Delete failed');
      }
    } catch {
      setDeleteError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Checkerboard background for transparent PNGs */}
        <div
          className="relative flex items-center justify-center p-6 min-h-64"
          style={{
            backgroundImage:
              'repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%)',
            backgroundSize: '24px 24px',
          }}
        >
          <img
            src={imageUrl}
            alt="Processed result"
            className="max-h-80 max-w-full object-contain rounded-lg"
          />
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            ✓ Ready
          </span>
        </div>

        <div className="p-4 border-t border-gray-50 space-y-3">
          {/* URL row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 min-w-0">
              <p className="text-xs text-gray-400 mb-0.5">Hosted URL</p>
              <p className="text-sm text-gray-700 font-mono truncate">{imageUrl}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-95'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy URL'}
            </button>
          </div>

          {/* Delete */}
          <div className="flex items-center justify-between">
            {deleteError && (
              <p className="text-xs text-red-500">{deleteError}</p>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
