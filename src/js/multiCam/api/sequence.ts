import { MOCK_DELAY, logApiCall } from './constants';

export const openSequence = async (sequenceId: string): Promise<void> => {
  logApiCall('openSequence', 'start', { sequenceId });
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  logApiCall('openSequence', 'end');
};