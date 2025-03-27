import {importVideosWithCameraBin, insertClipWithCreateDate} from "./multiCamLogic";
import {createProjectItemVO, createTrackItemVO} from "./createVO";
import {readJSONFromXMPMeta, writeJSONToXMPMeta} from "./customXMP";

export function importAndInsertCameraVideos(mainSequenceId: string, cameraName: string, trackNum: number) {
    app.setSDKEventMessage('test ok!', 'info');
    const project = app.project;
    const importVideoResult = importVideosWithCameraBin(project, cameraName);
    if (!importVideoResult.success) {
        return {success: false};
    }
    const videos = insertClipWithCreateDate(project, mainSequenceId, trackNum, importVideoResult.projectItems);

    return {
        success: true,
        videos: videos.map(video => ({
            projectItem: createProjectItemVO(video.projectItem),
            trackItem: createTrackItemVO(video.trackItem)
        }))
    };
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