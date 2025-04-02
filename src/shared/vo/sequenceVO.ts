import {TimeVO} from "./timeVO";

export interface SequenceVO {
    id: number;
    sequenceID: string;
    name: string;
    videoDisplayFormat: number;
    videoFrameRate: TimeVO;
    videoFrameRateFormatted: string;
    videoFrameCountInSecond: number;
    videoFrameWidth: number;
    videoFrameHeight: number;
    audioDisplayFormat: number;
    audioSampleRate: TimeVO;
}
