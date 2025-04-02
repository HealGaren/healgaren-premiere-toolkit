import React, {useState} from 'react';
import {Camera, VideoFile} from '../../types';
import {CameraHeader} from './CameraHeader';
import {VideoClip} from './VideoClip';
import {TimeGap} from './TimeGap';
import {Plus, FilePlus, ChevronDown, ChevronRight} from 'lucide-react';
import {VideoSkeleton} from '../VideoSkeleton';
import {useTimelineCalculations} from '../../hooks/useTimelineCalculations';
import {SequenceVO, TrackItemVO} from "../../../../shared/vo";
import {readTrackStartOffset} from "../../api";

interface Props {
    camera: Camera;
    videoFiles: { [nodeId: string]: VideoFile };
    selectedTrackItems: TrackItemVO[];
    mainSequenceId?: string;
    mainSequence: SequenceVO | null;
    isLoading?: boolean;
    onOffsetFrameChange: (offsetFrame: number) => void;
    onTrackNumberChange: (trackNumber: number) => void;
    onClipOffsetFrameChange: (nodeId: string, offsetFrame: number) => void;
    onNameChange: (name: string) => void;
    onDelete: () => void;
    onGroupCreate: (files: VideoFile[]) => void;
    onGroupDelete: (groupId: string) => void;
    onGroupOffsetFrameChange: (groupId: string, offsetFrame: number) => void;
    onFileSelect: (nodeId: string) => void;
    onImportFiles: () => void;
    onSyncListOfClips: () => void;
    selections: { [nodeId: string]: { selected: boolean } };
}

export const CameraTimeline: React.FC<Props> = ({
                                                    camera,
                                                    videoFiles,
                                                    selectedTrackItems,
                                                    mainSequenceId,
                                                    mainSequence,
                                                    isLoading,
                                                    onOffsetFrameChange,
                                                    onTrackNumberChange,
                                                    onClipOffsetFrameChange,
                                                    onNameChange,
                                                    onDelete,
                                                    onGroupCreate,
                                                    onGroupDelete,
                                                    onGroupOffsetFrameChange,
                                                    onFileSelect,
                                                    onImportFiles,
                                                    onSyncListOfClips,
                                                    selections
                                                }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const timelineClips = useTimelineCalculations(mainSequence, camera, videoFiles);

    const handleFetchTrackOffset = async () => {
        if (!mainSequenceId) {
            alert('메인 시퀸스를 먼저 지정해주세요.');
            return;
        }

        try {
            const newOffset = await readTrackStartOffset(mainSequenceId, camera.trackNumber);
            if (newOffset !== null) {
                onOffsetFrameChange(newOffset.frames);
            }
        } catch (error) {
            console.error('Failed to fetch track offset:', error);
        }
    };

    function isPremiereSelected(nodeId: string) {
        if (selectedTrackItems.length === 0) {
            return false;
        }
        return selectedTrackItems.some(item => item.nodeId === nodeId);
    }

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
                        offsetFrame={camera.offsetFrame}
                        onNameChange={onNameChange}
                        onTrackNumberChange={onTrackNumberChange}
                        onDelete={onDelete}
                        onOffsetFrameChange={onOffsetFrameChange}
                        onFetchTrackOffset={handleFetchTrackOffset}
                        isExpanded={isExpanded}
                    />

                    {!isExpanded && (
                        <div className="text-sm text-neutral-400">
                            <div className="flex items-center gap-4">
                                <span>Track {camera.trackNumber}</span>
                                <span>Offset {camera.offsetFrame}f</span>
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
                            <FilePlus size={14} className={isLoading ? 'animate-spin' : ''}/>
                            <span>새 영상 추가</span>
                        </button>
                        <button
                            onClick={onSyncListOfClips}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded text-sm transition-colors"
                        >
                            <Plus size={14}/>
                            <span>클립 목록 동기화</span>
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
                                        {clip.gapFrame > 0 && clip.showGap && mainSequence && <TimeGap gapFrame={clip.gapFrame} frameCountInSecond={mainSequence.videoFrameCountInSecond} />}
                                        <VideoClip
                                            sequence={mainSequence}
                                            file={clip.file}
                                            userData={clip.userData}
                                            group={clip.userData.groupId ? camera.groups[clip.userData.groupId] : undefined}
                                            isFirstInGroup={clip.isFirstInGroup}
                                            onSelect={() => onFileSelect(clip.file.trackItem.nodeId)}
                                            onClipOffsetFrameChange={onClipOffsetFrameChange}
                                            onGroupOffsetFrameChange={
                                                clip.userData.groupId
                                                    ? (offsetFrame) => onGroupOffsetFrameChange(clip.userData.groupId!, offsetFrame)
                                                    : undefined
                                            }
                                            onGroupDelete={
                                                clip.userData.groupId
                                                    ? () => onGroupDelete(clip.userData.groupId!)
                                                    : undefined
                                            }
                                            adjustedStartFrame={clip.adjustedStartFrame}
                                            adjustedEndFrame={clip.adjustedEndFrame}
                                            isSelected={selections[clip.file.trackItem.nodeId]?.selected || false}
                                            isPremiereSelected={isPremiereSelected(clip.file.trackItem.nodeId)}
                                        />
                                    </div>
                                ))}
                                {isLoading && (
                                    <>
                                        <VideoSkeleton/>
                                        <VideoSkeleton/>
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