import { useState } from 'react';
import { Camera, VideoFileUIState } from '../types';
import { saveState } from '../utils/storage';
import { useVideoFiles } from '../contexts/VideoFilesContext';
import { useCameraOperations } from './useCameraOperations';
import { useGroupOperations } from './useGroupOperations';
import { CAMERA_DEFAULTS } from '../constants/camera';
import {sortFilesByStartTime} from "../utils/camera";
import {produce} from "immer";

export const useCameras = (mainSequenceId: string | undefined) => {
  const { videoFiles, setVideoFiles, loadVideoFiles } = useVideoFiles();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selections, setSelections] = useState<{ [nodeId: string]: VideoFileUIState }>({});
  const [nextTrackNumber, setNextTrackNumber] = useState(CAMERA_DEFAULTS.MIN_TRACK_NUMBER);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    loadingCameraIds,
    handleAddCamera: addCamera,
    handleImportFiles,
    handleDeleteCamera
  } = useCameraOperations(cameras, setCameras, videoFiles, setVideoFiles, mainSequenceId);

  const {
    handleGroupCreate,
    handleGroupDelete,
    handleGroupOffsetFrameChange
  } = useGroupOperations(cameras, setCameras, mainSequenceId);

  const handleAddCamera = async () => {
    await addCamera(nextTrackNumber);
    setNextTrackNumber(prev => prev + 1);
  };

  const handleSyncListOfClipsInCamera = async (cameraId: string) => {
    if (mainSequenceId === undefined) {
      alert('No sequence selected');
      return;
    }

    const cameraIndex = cameras.findIndex(camera => camera.id === cameraId);
    if (cameraIndex === -1) {
      console.error('Camera not found:', cameraId);
      return;
    }
    const oldCameraState = cameras[cameraIndex]

    const trackNumber = oldCameraState.trackNumber;

    const videoFiles = await loadVideoFiles(mainSequenceId, [trackNumber]);

    const removedVideos = oldCameraState.files.filter(video => {
        return !videoFiles[video.nodeId]
    });
    const filesToKeep = oldCameraState.files.filter(file => !removedVideos.some(removed => removed.nodeId === file.nodeId));

    const unloadedVideos = Object.values(videoFiles)
        .filter((video) => {
          return !oldCameraState.files.some(file => file.nodeId === video.trackItem.nodeId);
        });

    const newFiles = unloadedVideos.map(video => ({
      nodeId: video.trackItem.nodeId,
      userData: {
        clipOffsetFrame: 0
      }
    }));


    setCameras(produce(draft => {
      draft[cameraIndex].files = sortFilesByStartTime([...filesToKeep, ...newFiles], videoFiles)
    }));
  };

  const handleSyncListOfClipsInAllCamera = async () => {
    for (const camera of cameras) {
      await handleSyncListOfClipsInCamera(camera.id);
    }
  };

  const handleFileSelect = (nodeId: string) => {
    setSelections(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        selected: !prev[nodeId]?.selected
      }
    }));
  };

  const handleOffsetFrameChange = async (cameraId: string, offsetFrame: number) => {
    const updatedCameras = cameras.map(camera => 
      camera.id === cameraId ? { ...camera, offsetFrame } : camera
    );
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  const handleTrackNumberChange = async (cameraId: string, trackNumber: number) => {
    const updatedCameras = cameras.map(camera =>
      camera.id === cameraId ? { ...camera, trackNumber } : camera
    );
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  const handleClipOffsetFrameChange = async (cameraId: string, nodeId: string, clipOffsetFrame: number) => {
    const updatedCameras = cameras.map(camera => {
      if (camera.id !== cameraId) return camera;

      return {
        ...camera,
        files: camera.files.map(file =>
          file.nodeId === nodeId
            ? { ...file, userData: { ...file.userData, clipOffsetFrame } }
            : file
        )
      };
    });

    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  const handleNameChange = async (cameraId: string, name: string) => {
    const updatedCameras = cameras.map(camera =>
      camera.id === cameraId ? { ...camera, name } : camera
    );
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  return {
    cameras,
    videoFiles,
    selections,
    isInitialLoading,
    isSyncing,
    loadingCameraIds,
    setCameras,
    setIsInitialLoading,
    handleAddCamera,
    handleImportFiles,
    handleSyncListOfClipsInCamera,
    handleSyncListOfClipsInAllCamera,
    handleOffsetFrameChange,
    handleTrackNumberChange,
    handleClipOffsetFrameChange,
    handleNameChange,
    handleDeleteCamera,
    handleFileSelect,
    handleGroupCreate,
    handleGroupDelete,
    handleGroupOffsetFrameChange
  };
};