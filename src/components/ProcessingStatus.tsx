'use client';

import { ProcessingStatus as Status } from '@/lib/types';

interface ProcessingStatusProps {
  status: Status;
}

const steps: { key: Status; label: string }[] = [
  { key: 'uploading', label: 'Uploading image' },
  { key: 'removing-bg', label: 'Removing background' },
  { key: 'flipping', label: 'Flipping image' },
  { key: 'hosting', label: 'Hosting result' },
];

export function ProcessingStatusBar({ status }: ProcessingStatusProps) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative flex items-center w-full">
                {/* Connector line left */}
                {i > 0 && (
                  <div className={`flex-1 h-0.5 transition-colors duration-500 ${isDone ? 'bg-brand-500' : 'bg-gray-200'}`} />
                )}
                {/* Circle */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                  ${isDone ? 'bg-brand-500' : isActive ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-gray-100'}
                `}>
                  {isDone ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                {/* Connector line right */}
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-colors duration-500 ${isDone ? 'bg-brand-500' : 'bg-gray-200'}`} />
                )}
              </div>
              <span className={`text-xs font-medium text-center transition-colors duration-300 ${isActive ? 'text-brand-600' : isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
