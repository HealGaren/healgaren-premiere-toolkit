import { useState } from 'react';
import { Camera, VideoFileUIState } from '../types';
import { createVideoFromTrackItem } from '../api';
import { saveState } from '../utils/storage';
import { useVideoFiles } from '../contexts/VideoFilesContext';
import { useCameraOperations } from './useCameraOperations';
import { useGroupOperations } from './useGroupOperations';
import { CAMERA_DEFAULTS } from '../constants/camera';
import {TrackItemVO} from "../../../shared/vo";

export const useCameras = (mainSequenceId: string | undefined) => {
  const { videoFiles, setVideoFiles } = useVideoFiles();
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
    handleGroupOffsetChange
  } = useGroupOperations(cameras, setCameras, mainSequenceId);

  const handleAddCamera = async () => {
    await addCamera(nextTrackNumber);
    setNextTrackNumber(prev => prev + 1);
  };

  const handleAddSelectedClips = async (cameraId: string, selectedClips: TrackItemVO[]) => {
    const updatedCameras = cameras.map(camera => {
      if (camera.id !== cameraId) return camera;

      const newFiles = selectedClips.map(clip => ({
        nodeId: clip.nodeId,
        userData: {
          clipOffset: CAMERA_DEFAULTS.DEFAULT_CLIP_OFFSET
        }
      }));

      return {
        ...camera,
        files: [...camera.files, ...newFiles]
      };
    });

    const newVideoFiles = selectedClips.reduce((acc, clip) => ({
      ...acc,
      [clip.nodeId]: createVideoFromTrackItem(clip)
    }), {});

    setVideoFiles(prev => ({ ...prev, ...newVideoFiles }));
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
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

  const handleOffsetChange = async (cameraId: string, offset: number) => {
    const updatedCameras = cameras.map(camera => 
      camera.id === cameraId ? { ...camera, offset } : camera
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

  const handleClipOffsetChange = async (cameraId: string, nodeId: string, clipOffset: number) => {
    const updatedCameras = cameras.map(camera => {
      if (camera.id !== cameraId) return camera;

      return {
        ...camera,
        files: camera.files.map(file =>
          file.nodeId === nodeId
            ? { ...file, userData: { ...file.userData, clipOffset } }
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
  };
};