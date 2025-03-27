import React from 'react';

export const VideoSkeleton: React.FC = () => {
  return (
    <div className="p-3 bg-neutral-700 rounded animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-neutral-600 rounded"></div>
          <div className="h-4 w-32 bg-neutral-600 rounded"></div>
        </div>
        <div className="h-4 w-16 bg-neutral-600 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 bg-neutral-600 rounded"></div>
        <div className="h-3 w-24 bg-neutral-600 rounded"></div>
        <div className="flex items-center gap-2 mt-3">
          <div className="h-3 w-16 bg-neutral-600 rounded"></div>
          <div className="h-6 w-20 bg-neutral-600 rounded"></div>
          <div className="h-3 w-6 bg-neutral-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};