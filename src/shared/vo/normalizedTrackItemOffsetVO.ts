export interface NormalizedTrackItemStartTimeVO {
    trackItemNodeId: string;
    startTimeSeconds: number;
}

export interface NormalizedTrackItemStartTimeInCamera {
    trackNumber: number;
    trackItemStartTimeRecord: Record<string, NormalizedTrackItemStartTimeVO>;
}
