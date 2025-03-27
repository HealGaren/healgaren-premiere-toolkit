import {TimeVO} from "./timeVO";

export interface TrackItemVO {
    name: string;
    duration: TimeVO;
    inPoint: TimeVO;
    outPoint: TimeVO;
    start: TimeVO;
    end: TimeVO;
    mediaType: string;
    type: number;
    nodeId: string;
    disabled: boolean;
    isSpeedReversed: 0 | 1;
    getSpeed: number;
}