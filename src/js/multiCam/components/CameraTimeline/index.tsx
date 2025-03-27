import React, { useState } from 'react';
import { Camera, VideoFile } from '../../types';
import { CameraHeader } from './CameraHeader';
import { VideoClip } from './VideoClip';
import { TimeGap } from './TimeGap';
import { Plus, FilePlus, ChevronDown, ChevronRight } from 'lucide-react';
import { VideoSkeleton } from '../VideoSkeleton';
import { useTimelineCalculations } from '../../hooks/useTimelineCalculations';
import {TrackItemVO} from "../../../../shared/vo";

interface Props {
  camera: Camera;
  videoFiles: { [nodeId: string]: VideoFile };
  selectedTrackItems: TrackItemVO[];
  isLoading?: boolean;
  onOffsetChange: (offset: number) => void;
  onTrackNumberChange: (trackNumber: number) => void;
  onClipOffsetChange: (nodeId: string, offset: number) => void;
  onNameChange: (name: string) => void;
  onDelete: () => void;
  onGroupCreate: (files: VideoFile[]) => void;
  onGroupDelete: (groupId: string) => void;
  onGroupOffsetChange: (groupId: string, offset: number) => void;
  onFileSelect: (nodeId: string) => void;
  onImportFiles: () => void;
  onAddSelectedClips: () => void;
  selections: { [nodeId: string]: { selected: boolean; premiereSelected: boolean } };
}

export const CameraTimeline: React.FC<Props> = ({
                                                  camera,
                                                  videoFiles,
                                                  selectedTrackItems,
                                                  isLoading,
                                                  onOffsetChange,
                                                  onTrackNumberChange,
                                                  onClipOffsetChange,
                                                  onNameChange,
                                                  onDelete,
                                                  onGroupCreate,
                                                  onGroupDelete,
                                                  onGroupOffsetChange,
                                                  onFileSelect,
                                                  onImportFiles,
                                                  onAddSelectedClips,
                                                  selections
                                                }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const timelineClips = useTimelineCalculations(camera, videoFiles);

  return (
      <div className="mb-6 bg-neutral-800 rounded-lg">
        <div className="flex items-start">
          <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 ml-4 p-2 hover:bg-neutral-700/50 rounded-lg transition-colors group"
          >
            {isExpanded ? (
                <ChevronDown
                    size={16}
                    className="text-neutral-400 transition-transform group-hover:text-neutral-200 group-hover:scale-110"
                />
            ) : (
                <ChevronRight
                    size={16}
                    className="text-neutral-400 transition-transform group-hover:text-neutral-200 group-hover:scale-110"
                />
            )}
          </button>

          <div className="flex-1 p-4">
            <CameraHeader
                name={camera.name}
                trackNumber={camera.trackNumber}
                offset={camera.offset}
                onNameChange={onNameChange}
                onTrackNumberChange={onTrackNumberChange}
                onDelete={onDelete}
                onOffsetChange={onOffsetChange}
                isExpanded={isExpanded}
            />

            {!isExpanded && (
                <div className="text-sm text-neutral-400">
                  <div className="flex items-center gap-4">
                    <span>Track {camera.trackNumber}</span>
                    <span>Offset {camera.offset}s</span>
                    <span>{camera.files.length} clips</span>
                    <span>{Object.keys(camera.groups).length} groups</span>
                  </div>
                </div>
            )}
          </div>
        </div>

        {isExpanded && (
            <div className="px-4 pb-4">
              <div className="flex justify-end gap-2 mb-4">
                <button
                    onClick={onImportFiles}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                  <FilePlus size={14} className={isLoading ? 'animate-spin' : ''} />
                  <span>새 영상 추가</span>
                </button>
                <button
                    onClick={onAddSelectedClips}
                    disabled={selectedTrackItems.length === 0 || isLoading}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                  <Plus size={14} />
                  <span>선택된 클립 추가</span>
                </button>
              </div>

              <div className="space-y-2">
                {camera.files.length === 0 && !isLoading ? (
                    <div className="text-center py-8 text-neutral-400">
                      <p>No videos added yet.</p>
                      <p className="text-sm mt-1">Click "새 영상 추가" to import videos.</p>
                    </div>
                ) : (
                    <>
                      {timelineClips.map(clip => (
                          <div key={clip.file.trackItem.nodeId}>
                            {!clip.userData.groupId && <TimeGap gap={clip.gap} />}
                            <VideoClip
                                file={clip.file}
                                userData={clip.userData}
                                group={clip.userData.groupId ? camera.groups[clip.userData.groupId] : undefined}
                                isFirstInGroup={clip.isFirstInGroup}
                                onSelect={() => onFileSelect(clip.file.trackItem.nodeId)}
                                onClipOffsetChange={onClipOffsetChange}
                                onGroupOffsetChange={
                                  clip.userData.groupId
                                      ? (offset) => onGroupOffsetChange(clip.userData.groupId!, offset)
                                      : undefined
                                }
                                onGroupDelete={
                                  clip.userData.groupId
                                      ? () => onGroupDelete(clip.userData.groupId!)
                                      : undefined
                                }
                                adjustedStartTime={clip.adjustedStartTime}
                                adjustedEndTime={clip.adjustedEndTime}
                                isSelected={selections[clip.file.trackItem.nodeId]?.selected || false}
                                isPremiereSelected={selections[clip.file.trackItem.nodeId]?.premiereSelected || false}
                            />
                          </div>
                      ))}
                      {isLoading && (
                          <>
                            <VideoSkeleton />
                            <VideoSkeleton />
                          </>
                      )}
                    </>
                )}
              </div>
            </div>
        )}
      </div>
  );
};