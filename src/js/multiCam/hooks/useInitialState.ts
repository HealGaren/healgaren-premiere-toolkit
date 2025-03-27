import { useEffect } from 'react';
import { loadState } from '../utils/storage';
import { useVideoFiles } from '../contexts/VideoFilesContext';

export const useInitialState = (
  setIsInitialLoading: (loading: boolean) => void,
  setCameras: (cameras: any[]) => void,
  setMainSequenceId: (id: string | undefined) => void
) => {
  const { loadVideoFiles, setVideoFiles } = useVideoFiles();

  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await loadState();
        if (savedState) {
          // Load video files first
          const cameraNames = savedState.cameras.map(camera => camera.name);
          const videoFiles = await loadVideoFiles(cameraNames);
          
          // Set video files
          setVideoFiles(videoFiles);
          
          // Set state without showing loading UI
          setIsInitialLoading(false);
          setCameras(savedState.cameras);
          setMainSequenceId(savedState.mainSequenceId);
        } else {
          setIsInitialLoading(false);
        }
      } catch (error) {
        console.error('Error loading initial state:', error);
        setIsInitialLoading(false);
      }
    };

    loadSavedState();
  }, [setIsInitialLoading, setCameras, setMainSequenceId, loadVideoFiles, setVideoFiles]);
};