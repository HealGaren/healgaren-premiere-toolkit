import { MOCK_DELAY, logApiCall } from './constants';
import {evalTS} from "../../lib/utils/bolt";

export const openSequence = async (sequenceId: string): Promise<void> => {
  await evalTS('openSequence', sequenceId);
};