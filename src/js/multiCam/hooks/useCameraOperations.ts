import { useState } from 'react';
import { Camera, VideoFile } from '../types';
import { generateCameraName } from '../constants/camera';
import { importAndInsertCameraVideos } from '../api/files';
import { saveState } from '../utils/storage';
import { sortFilesByStartTime } from '../utils/camera';

export const useCameraOperations = (
    cameras: Camera[],
    setCameras: React.Dispatch<React.SetStateAction<Camera[]>>,
    videoFiles: { [nodeId: string]: VideoFile },
    setVideoFiles: React.Dispatch<React.SetStateAction<{ [nodeId: string]: VideoFile }>>,
    mainSequenceId: string | undefined
) => {
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());

  const handleAddCamera = async (nextTrackNumber: number) => {
    const newCamera: Camera = {
      id: `camera-${Date.now()}`,
      name: generateCameraName(cameras.length),
      trackNumber: nextTrackNumber,
      files: [],
      offset: 0,
      groups: {}
    };

    const updatedCameras = [...cameras, newCamera];
    setCameras(updatedCameras);

    await saveState(updatedCameras, mainSequenceId).catch(error => {
      console.error('Failed to save state:', error);
    });
  };

  const handleImportFiles = async (cameraId: string) => {
    if (!mainSequenceId) {
      alert('메인 시퀸스를 먼저 지정해주세요.');
      return;
    }

    const camera = cameras.find(c => c.id === cameraId);
    if (!camera) return;

    setLoadingCameraIds(prev => new Set(prev).add(cameraId));

    try {
      const result = await importAndInsertCameraVideos(mainSequenceId, camera.name, camera.trackNumber);

      if (!result.success) return;

      const newVideoFiles = result.videos.reduce((acc, file) => ({
        ...acc,
        [file.trackItem.nodeId]: file
      }), {});

      setVideoFiles(prev => ({ ...prev, ...newVideoFiles }));

      const updatedCameras = cameras.map(c => {
        if (c.id !== cameraId) return c;

        const newFiles = result.videos.map(file => ({
          nodeId: file.trackItem.nodeId,
          userData: {
            clipOffset: 0
          }
        }));

        return {
          ...c,
          files: sortFilesByStartTime([...c.files, ...newFiles], {
            ...videoFiles,
            ...newVideoFiles
          })
        };
      });

      setCameras(updatedCameras);
      await saveState(updatedCameras, mainSequenceId);
    } catch (error) {
      console.error('Error importing files:', error);
    } finally {
      setLoadingCameraIds(prev => {
        const next = new Set(prev);
        next.delete(cameraId);
        return next;
      });
    }
  };

  const handleDeleteCamera = async (cameraId: string) => {
    if (!window.confirm('Are you sure you want to delete this camera?')) return;

    const updatedCameras = cameras.filter(camera => camera.id !== cameraId);
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  return {
    loadingCameraIds,
    handleAddCamera,
    handleImportFiles,
    handleDeleteCamera
  };
};