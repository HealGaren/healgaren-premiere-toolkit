import { AppState, Camera } from '../types';
import { saveAppState, loadAppState } from '../api';

export const saveState = async (cameras: Camera[], mainSequenceId?: string) => {
  const state: AppState = { 
    cameras, 
    mainSequenceId,
    nextTrackNumber: Math.max(...cameras.map(c => c.trackNumber), -1) + 1 
  };
  await saveAppState(state);
};

export const loadState = async (): Promise<AppState | null> => {
  return await loadAppState();
};

export const clearAppState = async (): Promise<void> => {
  localStorage.removeItem('premiere-sync-user-data');
  localStorage.removeItem('premiere-sync-video-files');
  localStorage.removeItem('premiere-sync-last-node-id');
};