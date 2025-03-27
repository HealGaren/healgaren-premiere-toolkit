import {VideoFile, ImportVideoFilesResponse} from '../types';
import {MOCK_DELAY, logApiCall} from './constants';
import {TrackItemVO} from "../../../shared/vo";
import {evalTS} from "../../lib/utils/bolt";

export const importAndInsertCameraVideos = async (mainSequenceId: string, cameraName: string, trackNum: number): Promise<ImportVideoFilesResponse> => {
    logApiCall('importAndInsertCameraVideos', 'start', { mainSequenceId, cameraName, trackNum });
    const result = await evalTS('importAndInsertCameraVideos', mainSequenceId, cameraName, trackNum);
    logApiCall('importAndInsertCameraVideos', 'end', result);
    return result;
};

export const readVideos = async (mainSequenceId: string, cameraNums: number[]): Promise<{
    success: false,
    error: unknown
} | { success: true, videos: VideoFile[] }> => {
    logApiCall('readVideos', 'start', { mainSequenceId, cameraNums });
    const result = await evalTS('readVideos', mainSequenceId, cameraNums);
    logApiCall('readVideos', 'end', result);
    return result;
};

export const createVideoFromTrackItem = (trackItem: TrackItemVO): VideoFile => {
    return {
        projectItem: {
            name: trackItem.name,
            mediaPath: `/videos/${trackItem.name}`,
            outPoint: trackItem.outPoint,
            nodeId: trackItem.nodeId,
            createdAt: null
        },
        trackItem
    };
};