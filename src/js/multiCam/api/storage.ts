import { AppState } from '../types';
import { logApiCall } from './constants';

export const saveAppState = async (state: AppState): Promise<void> => {
  logApiCall('saveAppState', 'start', state);
  await new Promise(resolve => setTimeout(resolve, 100));
  localStorage.setItem('premiere-sync-user-data', JSON.stringify(state));
  logApiCall('saveAppState', 'end');
};

export const loadAppState = async (): Promise<AppState | null> => {
  logApiCall('loadAppState', 'start');
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const storedData = localStorage.getItem('premiere-sync-user-data');
  if (!storedData) {
    logApiCall('loadAppState', 'end', null);
    return null;
  }
  
  try {
    const state = JSON.parse(storedData);
    logApiCall('loadAppState', 'end', state);
    return state;
  } catch (error) {
    console.error('Error loading state:', error);
    localStorage.removeItem('premiere-sync-user-data');
    logApiCall('loadAppState', 'end', null);
    return null;
  }
};

export const clearAppState = async (): Promise<void> => {
  logApiCall('clearAppState', 'start');
  localStorage.removeItem('premiere-sync-user-data');
  localStorage.removeItem('premiere-sync-video-files');
  localStorage.removeItem('premiere-sync-last-node-id');
  logApiCall('clearAppState', 'end');
};