import React from 'react';
import {CameraTimeline} from './components/CameraTimeline';
import {CameraSkeleton} from './components/CameraSkeleton';
import {SequenceSettings} from './components/SequenceSettings';
import {SelectionToolbar} from './components/SelectionToolbar';
import {Plus, Download, Upload, Trash2} from 'lucide-react';
import {useSequence} from './hooks/useSequence';
import {useCameras} from './hooks/useCameras';
import {useInitialState} from './hooks/useInitialState';
import {useAutoScroll} from './hooks/useAutoScroll';
import {syncFromPremiere, syncToPremiere} from './api';
import {saveState, clearState} from './utils/storage';
import {SequenceVO} from "../../shared/vo";

interface Props {
    defaultActiveSequence: SequenceVO | null;
}

export function MultiCam({defaultActiveSequence}: Props) {
    const {
        activeSequence,
        selectedTrackItems,
        mainSequenceId,
        isSyncing: isSequenceSyncing,
        setMainSequenceId,
        handleSetMainSequence,
        handleOpenMainSequence
    } = useSequence(defaultActiveSequence);

    const {
        cameras,
        videoFiles,
        selections,
        isInitialLoading,
        isSyncing: isCameraSyncing,
        loadingCameraIds,
        setCameras,
        setIsInitialLoading,
        handleAddCamera,
        handleImportFiles,
        handleAddSelectedClips,
        handleOffsetChange,
        handleTrackNumberChange,
        handleClipOffsetChange,
        handleNameChange,
        handleDeleteCamera,
        handleFileSelect,
        handleGroupCreate,
        handleGroupDelete,
        handleGroupOffsetChange
    } = useCameras(mainSequenceId);

    useInitialState(setIsInitialLoading, setCameras, setMainSequenceId);

    const scrollContainerRef = useAutoScroll(selectedTrackItems || []);
    const isSyncing = isSequenceSyncing || isCameraSyncing;

    // Get all selected files across all cameras
    const selectedFiles = cameras.flatMap(camera =>
        camera.files
            .filter(file => selections[file.nodeId]?.selected)
            .map(file => {
                const videoFile = videoFiles[file.nodeId];
                if (!videoFile) return null;
                return {
                    cameraId: camera.id,
                    ...videoFile,
                    userData: file.userData
                };
            })
            .filter((file): file is Exclude<typeof file, null> => file !== null)
    );

    const handleClearSelection = () => {
        selectedFiles.forEach(file => {
            handleFileSelect(file.trackItem.nodeId);
        });
    };

    const handleCreateGroup = () => {
        if (selectedFiles.length < 2) return;

        // Group files should be from the same camera
        const cameraId = selectedFiles[0].cameraId;
        if (!selectedFiles.every(file => file.cameraId === cameraId)) {
            alert('Can only group files from the same camera');
            return;
        }

        // Check if files are consecutive within their camera
        const camera = cameras.find(c => c.id === cameraId);
        if (!camera) return;

        const fileIndices = selectedFiles
            .map(sf => camera.files.findIndex(f => f.nodeId === sf.trackItem.nodeId))
            .sort((a, b) => a - b);

        const isConsecutive = fileIndices.every((val, idx, arr) =>
            idx === 0 || val === arr[idx - 1] + 1
        );

        if (!isConsecutive) {
            alert('Only consecutive files can be grouped');
            return;
        }

        handleGroupCreate(cameraId, selectedFiles);
    };

    const isConsecutiveSelection = () => {
        if (selectedFiles.length < 2) return false;

        // Check if all selected files are from the same camera
        const cameraId = selectedFiles[0].cameraId;
        if (!selectedFiles.every(file => file.cameraId === cameraId)) {
            return false;
        }

        // Check if files are consecutive within their camera
        const camera = cameras.find(c => c.id === cameraId);
        if (!camera) return false;

        const fileIndices = selectedFiles
            .map(sf => camera.files.findIndex(f => f.nodeId === sf.trackItem.nodeId))
            .sort((a, b) => a - b);

        return fileIndices.every((val, idx, arr) =>
            idx === 0 || val === arr[idx - 1] + 1
        );
    };

    const handleSyncFromPremiere = async () => {
        if (isSyncing) return;

        try {
            const offsets = await syncFromPremiere();
            const updatedCameras = cameras.map(camera => ({
                ...camera,
                files: camera.files.map(file => {
                    const videoFile = videoFiles[file.nodeId];
                    if (videoFile && offsets[videoFile.trackItem.nodeId] !== undefined) {
                        return {
                            ...file,
                            userData: {
                                ...file.userData,
                                clipOffset: offsets[videoFile.trackItem.nodeId]
                            }
                        };
                    }
                    return file;
                })
            }));

            setCameras(updatedCameras);
            await saveState(updatedCameras, mainSequenceId);
        } catch (error) {
            console.error('Error syncing from Premiere:', error);
        }
    };

    const handleSyncToPremiere = async () => {
        if (isSyncing) return;

        try {
            const offsets: { [path: string]: number } = {};
            cameras.forEach(camera => {
                camera.files.forEach(file => {
                    const videoFile = videoFiles[file.nodeId];
                    if (videoFile) {
                        const groupOffset = file.userData.groupId ? camera.groups[file.userData.groupId].offset : 0;
                        offsets[videoFile.trackItem.nodeId] = file.userData.clipOffset + groupOffset;
                    }
                });
            });

            await syncToPremiere(offsets);
        } catch (error) {
            console.error('Error syncing to Premiere:', error);
        }
    };

    const handleClearAppState = async () => {
        if (!window.confirm('정말 모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        try {
            await clearState();
            setCameras([]);
            setMainSequenceId(undefined);
            window.location.reload();
        } catch (error) {
            console.error('Error clearing app state:', error);
            alert('데이터 초기화 중 오류가 발생했습니다.');
        }
    };

    return (
        <div
            ref={scrollContainerRef}
            className={`min-h-screen bg-neutral-900 text-white p-4 ${
                isSyncing ? 'opacity-50 pointer-events-none' : ''
            }`}
        >
            <div className="max-w-2xl mx-auto">
                <SequenceSettings
                    activeSequence={activeSequence}
                    mainSequenceId={mainSequenceId}
                    onSetMainSequence={handleSetMainSequence}
                    onOpenMainSequence={handleOpenMainSequence}
                />

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleClearAppState}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg transition-colors text-sm whitespace-nowrap"
                    >
                        <Trash2 size={14}/>
                        <span>초기화</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSyncFromPremiere}
                            disabled={isInitialLoading || isSyncing || cameras.length === 0}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg transition-colors text-sm whitespace-nowrap"
                        >
                            <Download size={14} className={isSyncing ? 'animate-spin' : ''}/>
                            <span>From Premiere</span>
                        </button>
                        <button
                            onClick={handleSyncToPremiere}
                            disabled={isInitialLoading || isSyncing || cameras.length === 0}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg transition-colors text-sm whitespace-nowrap"
                        >
                            <Upload size={14} className={isSyncing ? 'animate-spin' : ''}/>
                            <span>To Premiere</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {isInitialLoading ? (
                        <>
                            <CameraSkeleton/>
                            <CameraSkeleton/>
                        </>
                    ) : (
                        <>
                            {cameras.map(camera => (
                                <CameraTimeline
                                    key={camera.id}
                                    camera={camera}
                                    videoFiles={videoFiles}
                                    selectedTrackItems={selectedTrackItems || []}
                                    isLoading={loadingCameraIds.has(camera.id)}
                                    onOffsetChange={(offset) => handleOffsetChange(camera.id, offset)}
                                    onTrackNumberChange={(trackNumber) => handleTrackNumberChange(camera.id, trackNumber)}
                                    onClipOffsetChange={(nodeId, offset) => handleClipOffsetChange(camera.id, nodeId, offset)}
                                    onNameChange={(name) => handleNameChange(camera.id, name)}
                                    onDelete={() => handleDeleteCamera(camera.id)}
                                    onFileSelect={handleFileSelect}
                                    onGroupCreate={(files) => handleGroupCreate(camera.id, files)}
                                    onGroupDelete={(groupId) => handleGroupDelete(camera.id, groupId)}
                                    onGroupOffsetChange={(groupId, offset) => handleGroupOffsetChange(camera.id, groupId, offset)}
                                    onImportFiles={() => handleImportFiles(camera.id)}
                                    onAddSelectedClips={() => handleAddSelectedClips(camera.id, selectedTrackItems || [])}
                                    selections={selections}
                                />
                            ))}
                            <button
                                onClick={handleAddCamera}
                                disabled={isInitialLoading || isSyncing}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-800 disabled:cursor-not-allowed rounded-lg transition-colors text-neutral-400 hover:text-white group"
                            >
                                <Plus
                                    size={18}
                                    className="transition-transform group-hover:scale-110"
                                />
                                <span className="font-medium">새 카메라 추가</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <SelectionToolbar
                    selectedFiles={selectedFiles}
                    onClearSelection={handleClearSelection}
                    onCreateGroup={handleCreateGroup}
                    isConsecutive={isConsecutiveSelection()}
                />
            )}

            {isSyncing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-neutral-800 p-6 rounded-lg shadow-xl">
                        <div
                            className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
                        <p className="text-center text-neutral-300">Syncing with Premiere...</p>
                    </div>
                </div>
            )}
        </div>
    );
}