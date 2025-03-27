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
          const cameraNums = savedState.cameras.map(camera => camera.trackNumber);
          const mainSequenceId = savedState.mainSequenceId;
          if (!mainSequenceId) {
            throw new Error('Main sequence ID not found in saved state');
          }
          const videoFiles = await loadVideoFiles(mainSequenceId, cameraNums);
          
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