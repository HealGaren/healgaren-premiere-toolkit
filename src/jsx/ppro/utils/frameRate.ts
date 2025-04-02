function createTimeAsFraction(numerator: number, denominator: number) {
    const time = new Time();
    (time as unknown as {setSecondsAsFraction: (numerator: number, denominator: number) => boolean}).setSecondsAsFraction(numerator, denominator);
    return time;
}

export const FrameRateConst = {
    FRAME_23976: createTimeAsFraction(1001, 24000),
    FRAME_24: createTimeAsFraction(1, 24),
    FRAME_25: createTimeAsFraction(1, 25),
    FRAME_2997: createTimeAsFraction(1001, 30000),
    FRAME_30: createTimeAsFraction(1, 30),
    FRAME_50: createTimeAsFraction(1, 50),
    FRAME_5994: createTimeAsFraction(1001, 60000),
    FRAME_60: createTimeAsFraction(1, 60),
    FRAME_120: createTimeAsFraction(1, 120),
}

export function getFrameRateFormatted(frameRate: Time) {
    const frameRateMap: { [key: number]: string } = {
        [FrameRateConst.FRAME_23976.seconds]: '23.976',
        [FrameRateConst.FRAME_24.seconds]: '24',
        [FrameRateConst.FRAME_25.seconds]: '25',
        [FrameRateConst.FRAME_2997.seconds]: '29.97',
        [FrameRateConst.FRAME_30.seconds]: '30',
        [FrameRateConst.FRAME_50.seconds]: '50',
        [FrameRateConst.FRAME_5994.seconds]: '59.94',
        [FrameRateConst.FRAME_60.seconds]: '60',
        [FrameRateConst.FRAME_120.seconds]: '120',
    };

    return frameRateMap[frameRate.seconds] || 'Unknown';
}

export function getFrameCountInSecond(frameRate: Time) {
    const frameCountMap: { [key: number]: number } = {
        [FrameRateConst.FRAME_23976.seconds]: 24,
        [FrameRateConst.FRAME_24.seconds]: 24,
        [FrameRateConst.FRAME_25.seconds]: 25,
        [FrameRateConst.FRAME_2997.seconds]: 30,
        [FrameRateConst.FRAME_30.seconds]: 30,
        [FrameRateConst.FRAME_50.seconds]: 50,
        [FrameRateConst.FRAME_5994.seconds]: 60,
        [FrameRateConst.FRAME_60.seconds]: 60,
        [FrameRateConst.FRAME_120.seconds]: 120,
    };

    return frameCountMap[frameRate.seconds];
}

export function getSecondsByFrames(frames: number, frameRate: Time) {
    return frameRate.seconds * frames;
}