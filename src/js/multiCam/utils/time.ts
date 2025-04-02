export const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

export const formatFrameTime = (frame: number, frameCountInSecond: number): string | null => {
    if (frameCountInSecond === null) {
        return null;
    }
    const seconds = Math.floor(frame / frameCountInSecond);
    const frames = Math.floor(frame % frameCountInSecond);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const formattedSeconds = (seconds % 60).toString().padStart(2, '0');
    const formattedMinutes = (minutes % 60).toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedFrames = frames.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedFrames}`;
}

export function quantizeToFrame(timeInSeconds: number, frameRate: number) {
    const frames = convertToFrame(timeInSeconds, frameRate);
    return frames * frameRate;
}

export function convertToFrame(timeInSeconds: number, frameRate: number) {
    return Math.floor(timeInSeconds / frameRate);
}