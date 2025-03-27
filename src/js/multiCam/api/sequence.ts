import {MOCK_DELAY, logApiCall} from './constants';
import {evalTS} from "../../lib/utils/bolt";
import {TimeVO} from "../../../shared/vo";

export const openSequence = async (sequenceId: string): Promise<void> => {
    logApiCall('openSequence', 'start', {sequenceId});
    await evalTS('openSequence', sequenceId);
    logApiCall('openSequence', 'end');
};

export const readTrackStartOffset = async (sequenceId: string, trackNumber: number): Promise<TimeVO | null> => {
    logApiCall('readTrackStartOffset', 'start', {trackNumber});
    const result = await evalTS('readTrackStartOffset', sequenceId, trackNumber);
    logApiCall('readTrackStartOffset', 'end', result);
    return result.startOffset;
};