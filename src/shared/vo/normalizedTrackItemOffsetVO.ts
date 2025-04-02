export interface NormalizedTrackItemStartTimeVO {
    trackItemNodeId: string;
    startTime: {
        frames: number;
        seconds?: number; // 빼도 됨. 그냥 디버깅하기 쉽게 넣어둠
    }
}

export interface NormalizedTrackItemStartTimeInCamera {
    trackNumber: number;
    trackItemStartTimeRecord: Record<string, NormalizedTrackItemStartTimeVO>;
}
