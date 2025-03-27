import { MOCK_DELAY, logApiCall } from './constants';
import {evalTS} from "../../lib/utils/bolt";

export const openSequence = async (sequenceId: string): Promise<void> => {
  logApiCall('openSequence', 'start', { sequenceId });
  await evalTS('openSequence', sequenceId);
  logApiCall('openSequence', 'end');
};