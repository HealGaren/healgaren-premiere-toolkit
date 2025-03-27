import React from 'react';

export const CameraSkeleton: React.FC = () => {
  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-32 bg-gray-700 rounded"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-gray-700 rounded"></div>
          <div className="h-8 w-20 bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 bg-gray-700 rounded flex flex-col">
            <div className="flex justify-between mb-1">
              <div className="h-4 w-32 bg-gray-600 rounded"></div>
              <div className="h-4 w-20 bg-gray-600 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-3 w-24 bg-gray-600 rounded"></div>
              <div className="h-3 w-24 bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};