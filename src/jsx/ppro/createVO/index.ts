import {SequenceVO, TrackItemVO, TimeVO} from "../../../shared/vo";
import {ProjectItemVO} from "../../../shared/vo/projectItemVO";
import {readCreateDateMillsFromXMPMeta} from "../utils/xmp";
import {getFrameCountInSecond, getFrameRateFormatted} from "../utils/frameRate";

export function createSequenceVO(sequence: Sequence): SequenceVO {
    const sequenceSetting = sequence.getSettings();
    const videoFrameRate = sequenceSetting.videoFrameRate.seconds;
    return {
        id: sequence.id,
        sequenceID: sequence.sequenceID,
        name: sequence.name,
        videoDisplayFormat: sequence.videoDisplayFormat,
        videoFrameRate: createTimeVO(sequenceSetting.videoFrameRate, videoFrameRate),
        videoFrameRateFormatted: getFrameRateFormatted(sequenceSetting.videoFrameRate),
        videoFrameCountInSecond: getFrameCountInSecond(sequenceSetting.videoFrameRate),
        videoFrameWidth: sequenceSetting.videoFrameWidth,
        videoFrameHeight: sequenceSetting.videoFrameHeight,
        audioDisplayFormat: sequenceSetting.audioDisplayFormat,
        audioSampleRate: createTimeVO(sequenceSetting.audioSampleRate, videoFrameRate),
    };
}

export function createTimeVO(time: Time, videoFrameRateSeconds: number): TimeVO {
    return {
        seconds: time.seconds,
        ticks: time.ticks,
        frames: time.seconds / videoFrameRateSeconds
    }
}

export function createTrackItemVO(sequence: Sequence, trackItem: TrackItem): TrackItemVO {
    const sequenceSetting = sequence.getSettings();
    const videoFrameRate = sequenceSetting.videoFrameRate.seconds;
    return {
        name: trackItem.name,
        duration: createTimeVO(trackItem.duration, videoFrameRate),
        inPoint: createTimeVO(trackItem.inPoint, videoFrameRate),
        outPoint: createTimeVO(trackItem.outPoint, videoFrameRate),
        start: createTimeVO(trackItem.start, videoFrameRate),
        end: createTimeVO(trackItem.end, videoFrameRate),
        mediaType: trackItem.mediaType,
        type: trackItem.type,
        // components: trackItem.components,
        nodeId: trackItem.nodeId,
        // projectItem: trackItem.projectItem,
        disabled: trackItem.disabled,
        // isSelected: trackItem.isSelected(),
        isSpeedReversed: trackItem.isSpeedReversed(),
        // isAdjustmentLayer: trackItem.isAdjustmentLayer(),
        getSpeed: trackItem.getSpeed(),
        // getMGTComponent: trackItem.getMGTComponent(),
        // getColorSpace: trackItem.getColorSpace(),
    }
}

export function createProjectItemVO(sequence: Sequence, projectItem: ProjectItem): ProjectItemVO {
    const sequenceSetting = sequence.getSettings();
    const videoFrameRate = sequenceSetting.videoFrameRate.seconds;

    const createdAt = readCreateDateMillsFromXMPMeta(projectItem);
    if (createdAt === null) {
        throw new Error("createdAt is null");
    }
    return {
        name: projectItem.name,
        mediaPath: projectItem.getMediaPath(),
        outPoint: createTimeVO(projectItem.getOutPoint(), videoFrameRate), // duration 용도로 사용
        nodeId: projectItem.nodeId,
        createdAt
    };
}

