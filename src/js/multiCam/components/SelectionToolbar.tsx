import React from 'react';
import { Link, X } from 'lucide-react';
import { VideoFile } from '../types';

interface Props {
  selectedFiles: (VideoFile & { cameraId: string })[];
  onClearSelection: () => void;
  onCreateGroup: () => void;
  isConsecutive: boolean;
}

export const SelectionToolbar: React.FC<Props> = ({
  selectedFiles,
  onClearSelection,
  onCreateGroup,
  isConsecutive
}) => {
  if (selectedFiles.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 p-3 flex items-center gap-4 z-50">
      <div className="text-sm text-neutral-300">
        {selectedFiles.length} item{selectedFiles.length > 1 ? 's' : ''} selected
      </div>
      
      {selectedFiles.length >= 2 && isConsecutive && (
        <button
          onClick={onCreateGroup}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors whitespace-nowrap"
        >
          <Link size={14} />
          <span>Group Selected</span>
        </button>
      )}
      
      <button
        onClick={onClearSelection}
        className="flex items-center gap-1.5 px-2 py-1 hover:bg-neutral-700 rounded text-sm transition-colors text-neutral-400 hover:text-white"
      >
        <X size={14} />
        <span>Clear</span>
      </button>
    </div>
  );
};