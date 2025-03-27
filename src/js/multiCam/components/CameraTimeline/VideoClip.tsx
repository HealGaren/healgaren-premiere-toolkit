import React from 'react';
import { VideoFile, VideoGroup, CameraVideoFile } from '../../types';
import { formatTime } from '../../utils/time';
import { Unlink, AlertTriangle, Scissors } from 'lucide-react';

interface Props {
  file: VideoFile;
  userData: CameraVideoFile['userData'];
  group?: VideoGroup;
  isFirstInGroup: boolean;
  onSelect: () => void;
  onClipOffsetChange: (nodeId: string, offset: number) => void;
  onGroupOffsetChange?: (offset: number) => void;
  onGroupDelete?: () => void;
  adjustedStartTime: number;
  adjustedEndTime: number;
  overlappingClips?: Array<{
    nodeId: string;
    name: string;
    overlap: number;
  }>;
  isSelected: boolean;
  isPremiereSelected: boolean;
}

export const VideoClip: React.FC<Props> = ({
  file,
  userData,
  group,
  isFirstInGroup,
  onSelect,
  onClipOffsetChange,
  onGroupOffsetChange,
  onGroupDelete,
  adjustedStartTime,
  adjustedEndTime,
  overlappingClips,
  isSelected,
  isPremiereSelected
}) => {
  const getOffsetColor = (offset: number) => {
    if (offset === 0) return '';
    return offset > 0 
      ? 'text-yellow-500/80' 
      : 'text-blue-500/80';
  };

  const isTrimmed = file.trackItem.duration.seconds !== file.projectItem.outPoint.seconds;
  const trimDifference = file.projectItem.outPoint.seconds - file.trackItem.duration.seconds;
  
  return (
    <div 
      data-node-id={file.trackItem.nodeId}
      className={`p-3 rounded flex flex-col relative transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${userData.groupId ? 'border-l-4 border-green-500/50' : ''}
        ${overlappingClips?.length ? 'border border-red-500/50' : ''}
        ${isPremiereSelected 
          ? 'bg-blue-900/30 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]' 
          : 'bg-neutral-700'
        }`}
    >
      {isFirstInGroup && group && (
        <div className="absolute -top-3 left-4 bg-neutral-800 px-2 py-1 rounded text-xs flex items-center gap-2">
          <span className="text-green-500">Grouped</span>
          <input
            type="number"
            value={group.offset}
            onChange={(e) => onGroupOffsetChange?.(Number(e.target.value))}
            className="w-20 px-2 py-0.5 bg-neutral-700 text-white rounded text-xs"
            step="1"
          />
          <span className="text-neutral-400">ms</span>
          <button
            onClick={onGroupDelete}
            className="p-1 hover:bg-neutral-600 rounded transition-colors"
          >
            <Unlink size={12} />
          </button>
        </div>
      )}
      <div className="flex justify-between text-sm text-neutral-300 mb-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded border-neutral-600"
          />
          <span>{file.projectItem.name}</span>
          {isPremiereSelected && (
            <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded">
              Selected in Premiere
            </span>
          )}
        </div>
        <span>{formatTime(file.projectItem.outPoint.seconds)}</span>
      </div>
      <div className="text-xs space-y-1">
        <div className={getOffsetColor(userData.clipOffset)}>
          <div>Start: {formatTime(adjustedStartTime)}</div>
          <div>End: {formatTime(adjustedEndTime)}</div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <label className="text-neutral-400">Clip offset:</label>
          <input
            type="number"
            value={userData.clipOffset}
            onChange={(e) => onClipOffsetChange(file.trackItem.nodeId, Number(e.target.value))}
            className="w-20 px-2 py-1 bg-neutral-600 text-white rounded text-xs"
            step="1"
          />
          <span className="text-neutral-400">ms</span>
        </div>
      </div>

      {/* Warnings Section */}
      {(overlappingClips?.length || isTrimmed) && (
        <div className="mt-2 pt-2 border-t border-neutral-600/50 space-y-1.5">
          {overlappingClips?.length && (
            <div className="flex items-start gap-1.5 text-xs text-red-400">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <div>
                <div>Overlaps with:</div>
                <ul className="mt-0.5 space-y-0.5 text-red-300">
                  {overlappingClips.map(clip => (
                    <li key={clip.nodeId}>
                      {clip.name} ({formatTime(clip.overlap)} overlap)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {isTrimmed && (
            <div className="flex items-center gap-1.5 text-xs text-yellow-400">
              <Scissors size={14} />
              <span>
                Trimmed {trimDifference > 0 ? 'down' : 'up'} by {formatTime(Math.abs(trimDifference))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};