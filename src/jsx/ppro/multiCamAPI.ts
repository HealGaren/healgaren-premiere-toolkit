import {
    getSequence,
    importVideosWithCameraBin,
    overwriteClipWithCreateDate,
    readSequenceTrackFirstClipOffset,
    readVideoClips, syncAllClipStartTimeInCamera
} from "./multiCamLogic";
import {createProjectItemVO, createSequenceVO, createTimeVO, createTrackItemVO} from "./createVO";
import {readJSONFromXMPMeta, writeJSONToXMPMeta} from "./customXMP";
import {ProjectItemVO} from "../../shared/vo/projectItemVO";
import {TimeVO, TrackItemVO} from "../../shared/vo";
import {AppState, Camera} from "../../js/multiCam/types";
import {NormalizedTrackItemStartTimeInCamera} from "../../shared/vo/normalizedTrackItemOffsetVO";

export function importAndInsertCameraVideos(mainSequenceId: string, cameraName: string, trackNum: number): {success: false} | {success: true, videos: {projectItem: ProjectItemVO, trackItem: TrackItemVO}[]} {
    const sequence = getSequence(app.project, mainSequenceId);
    if (!sequence) {
        throw new Error('Sequence not found');
    }

    const project = app.project;
    const importVideoResult = importVideosWithCameraBin(project, cameraName);
    if (!importVideoResult.success) {
        return {success: false};
    }

    const videos = overwriteClipWithCreateDate(sequence, trackNum, importVideoResult.projectItems);

    return {
        success: true,
        videos: videos.map(video => ({
            projectItem: createProjectItemVO(sequence, video.projectItem),
            trackItem: createTrackItemVO(sequence, video.trackItem)
        }))
    };
}

export function readVideos(mainSequenceId: string, cameraNums: number[]): {success: false, error: unknown} | {success: true, videos: {projectItem: ProjectItemVO, trackItem: TrackItemVO}[]} {
    try {
        const sequence = getSequence(app.project, mainSequenceId);
        if (!sequence) {
            throw new Error('Sequence not found');
        }

        const videos = readVideoClips(sequence, cameraNums);
        return {
            success: true,
            videos: videos.map(video => ({
                projectItem: createProjectItemVO(sequence, video.projectItem),
                trackItem: createTrackItemVO(sequence, video.trackItem)
            }))
        }
    } catch (e: unknown) {
        return {success: false, error: e};
    }

}

export function saveAppState(appState: object) {
    writeJSONToXMPMeta(app.project.rootItem.children[0], 'appState', appState);
}

export function loadAppState(): unknown {
    return readJSONFromXMPMeta(app.project.rootItem.children[0], 'appState');
}

export function clearAppState() {
    writeJSONToXMPMeta(app.project.rootItem.children[0], 'appState', null);
}

export function openSequence(sequenceId: string) {
    app.project.openSequence(sequenceId);
}

export function readTrackStartOffset(sequence: Sequence, trackNumber: number): {startOffset: TimeVO | null} {
    const offset = readSequenceTrackFirstClipOffset(sequence, trackNumber);
    return {
        startOffset: offset ? createTimeVO(offset, sequence.getSettings().videoFrameRate.seconds) : null
    };
}

export function syncAllClipStartTime(mainSequenceId: string, cameras: NormalizedTrackItemStartTimeInCamera[]) {
    const project = app.project;
    cameras.forEach(camera => {
        syncAllClipStartTimeInCamera(project, mainSequenceId, camera);
    });
}

export function readSequence(sequenceId: string) {
    const project = app.project;
    const sequence = getSequence(project, sequenceId);
    if (!sequence) {
        throw new Error('Sequence not found');
    }
    return {
        sequence: createSequenceVO(sequence)
    };
}