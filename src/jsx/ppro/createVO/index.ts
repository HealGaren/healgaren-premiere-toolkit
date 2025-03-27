import {SequenceVO, TrackItemVO, TimeVO} from "../../../shared/vo";
import {ProjectItemVO} from "../../../shared/vo/projectItemVO";
import {readCreateDateMillsFromXMPMeta} from "../utils/xmp";
import {getFrameRateFormatted} from "../utils/frameRate";

export function createSequenceVO(sequence: Sequence): SequenceVO {
    const sequenceSetting = sequence.getSettings();
    return {
        id: sequence.id,
        sequenceID: sequence.sequenceID,
        name: sequence.name,
        videoDisplayFormat: sequence.videoDisplayFormat,
        videoFrameRate: createTimeVO(sequenceSetting.videoFrameRate),
        videoFrameRateFormatted: getFrameRateFormatted(sequenceSetting.videoFrameRate),
        videoFrameWidth: sequenceSetting.videoFrameWidth,
        videoFrameHeight: sequenceSetting.videoFrameHeight,
        audioDisplayFormat: sequenceSetting.audioDisplayFormat,
        audioSampleRate: createTimeVO(sequenceSetting.audioSampleRate),
    };
}

export function createTimeVO(time: Time): TimeVO {
    return {
        seconds: time.seconds,
        ticks: time.ticks,
    }
}

export function createTrackItemVO(trackItem: TrackItem): TrackItemVO {
    return {
        name: trackItem.name,
        duration: createTimeVO(trackItem.duration),
        inPoint: createTimeVO(trackItem.inPoint),
        outPoint: createTimeVO(trackItem.outPoint),
        start: createTimeVO(trackItem.start),
        end: createTimeVO(trackItem.end),
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

export function createProjectItemVO(projectItem: ProjectItem): ProjectItemVO {
    return {
        name: projectItem.name,
        mediaPath: projectItem.getMediaPath(),
        outPoint: createTimeVO(projectItem.getOutPoint()), // duration 용도로 사용
        nodeId: projectItem.nodeId,
        createdAt: readCreateDateMillsFromXMPMeta(projectItem),
    };
}

