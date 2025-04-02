import { MOCK_DELAY, logApiCall } from './constants';
import {evalTS} from "../../lib/utils/bolt";
import {NormalizedTrackItemStartTimeInCamera} from "../../../shared/vo/normalizedTrackItemOffsetVO";

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

export const syncAllClipStartTime = async (mainSequenceId: string, cameras: NormalizedTrackItemStartTimeInCamera[]): Promise<void> => {
  logApiCall('syncAllClipStartTime', 'start', { mainSequenceId, cameras });
  await evalTS('syncAllClipStartTime', mainSequenceId, cameras);
  logApiCall('syncAllClipStartTime', 'end');
};