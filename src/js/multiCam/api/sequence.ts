import {MOCK_DELAY, logApiCall} from './constants';
import {evalTS} from "../../lib/utils/bolt";
import {SequenceVO, TimeVO} from "../../../shared/vo";

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

export const readSequence = async (sequenceId: string): Promise<SequenceVO | null> => {
    logApiCall('readSequence', 'start', {sequenceId});
    const result = await evalTS('readSequence', sequenceId);
    logApiCall('readSequence', 'end', result);
    return result.sequence;
}