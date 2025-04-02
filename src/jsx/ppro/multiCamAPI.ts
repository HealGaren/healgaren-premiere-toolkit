import {
    importVideosWithCameraBin,
    overwriteClipWithCreateDate,
    readSequenceTrackFirstClipOffset,
    readVideoClips, syncAllClipStartTimeInCamera
} from "./multiCamLogic";
import {createProjectItemVO, createTimeVO, createTrackItemVO} from "./createVO";
import {readJSONFromXMPMeta, writeJSONToXMPMeta} from "./customXMP";
import {ProjectItemVO} from "../../shared/vo/projectItemVO";
import {TimeVO, TrackItemVO} from "../../shared/vo";
import {AppState, Camera} from "../../js/multiCam/types";
import {NormalizedTrackItemStartTimeInCamera} from "../../shared/vo/normalizedTrackItemOffsetVO";

export function importAndInsertCameraVideos(mainSequenceId: string, cameraName: string, trackNum: number): {success: false} | {success: true, videos: {projectItem: ProjectItemVO, trackItem: TrackItemVO}[]} {
    const project = app.project;
    const importVideoResult = importVideosWithCameraBin(project, cameraName);
    if (!importVideoResult.success) {
        return {success: false};
    }
    const videos = overwriteClipWithCreateDate(project, mainSequenceId, trackNum, importVideoResult.projectItems);

    return {
        success: true,
        videos: videos.map(video => ({
            projectItem: createProjectItemVO(video.projectItem),
            trackItem: createTrackItemVO(video.trackItem)
        }))
    };
}

export function readVideos(mainSequenceId: string, cameraNums: number[]): {success: false, error: unknown} | {success: true, videos: {projectItem: ProjectItemVO, trackItem: TrackItemVO}[]} {
    try {
        const videos = readVideoClips(app.project, mainSequenceId, cameraNums);
        return {
            success: true,
            videos: videos.map(video => ({
                projectItem: createProjectItemVO(video.projectItem),
                trackItem: createTrackItemVO(video.trackItem)
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

export function readTrackStartOffset(sequenceId: string, trackNumber: number): {startOffset: TimeVO | null} {
    const offset = readSequenceTrackFirstClipOffset(app.project, sequenceId, trackNumber);
    return {
        startOffset: offset ? createTimeVO(offset) : null
    };
}

export function syncAllClipStartTime(mainSequenceId: string, cameras: NormalizedTrackItemStartTimeInCamera[]) {
    const project = app.project;
    cameras.forEach(camera => {
        syncAllClipStartTimeInCamera(project, mainSequenceId, camera);
    });
}