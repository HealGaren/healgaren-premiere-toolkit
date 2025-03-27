export interface SequenceVO {
    id: number;
    sequenceID: string;
    name: string;
    videoDisplayFormat: number;
    videoFrameRate: number;
    videoFrameSize: [number, number];
    audioDisplayFormat: number;
    audioFrameRate: number;
}
