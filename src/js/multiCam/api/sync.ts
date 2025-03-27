import { MOCK_DELAY, logApiCall } from './constants';

export const syncFromPremiere = async (): Promise<{ [path: string]: number }> => {
  logApiCall('syncFromPremiere', 'start');
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY * 2));
  
  const result = {
    '/videos/cam1_001.mp4': 500,
    '/videos/cam1_002.mp4': -200,
    '/videos/cam1_003.mp4': 150,
    '/videos/cam1_004.mp4': -300
  };
  
  logApiCall('syncFromPremiere', 'end', result);
  return result;
};

export const syncToPremiere = async (offsets: { [path: string]: number }): Promise<void> => {
  logApiCall('syncToPremiere', 'start', offsets);
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY * 2));
  logApiCall('syncToPremiere', 'end');
};