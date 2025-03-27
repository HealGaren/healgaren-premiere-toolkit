import { AppState, Camera } from '../types';
import {saveAppState, loadAppState, clearAppState} from '../api';

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

export const clearState = async (): Promise<void> => {
  return await clearAppState();
};