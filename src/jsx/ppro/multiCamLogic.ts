import {createArray} from "../utils/array";
import {readCreateDateMillsFromXMPMeta} from "./utils/xmp";


function findBinInRoot(project: Project, name: string) {
    const children = createArray(project.rootItem.children, 'numItems');
    return children.find(child => child.type === ProjectItemType.BIN && child.name === name);
}

function getOrCreateBin(project: Project, name: string) {
    const bin = findBinInRoot(project, name);
    if (bin) {
        return bin;
    }
    return project.rootItem.createBin(name);
}

function importVideos(project: Project, targetBin: ProjectItem): { success: false } | {
    success: true,
    projectItems: ProjectItem[]
} {
    const rawFiles = File.openDialog(
        "비디오 파일을 선택하세요",
        "Video files:" + [
            'mp4',
            'mov',
            'avi',
            'mxf',
            'm2ts',
            'mts',
            'mkv',
            'flv',
            'webm',
            'wmv',
            'mpg',
            'mpeg',
            'vob',
        ].map(ext => '*.' + ext).join(';'),
        true // 여러 개 선택 허용
    ) as File[] | null;
    if (!rawFiles) {
        return {success: false};
    }
    const fsNames = rawFiles.map(file => file.fsName);
    project.importFiles(fsNames, false, targetBin);

    return {
        success: true,
        projectItems: createArray(targetBin.children, 'numItems')
            .filter(item => fsNames.find(name => name === item.getMediaPath()))
    };
}

function getSequence(project: Project, sequenceId: string) {
    const sequences = createArray(project.sequences, 'numSequences');
    return sequences.find(sequence => sequence.sequenceID === sequenceId) ?? null;
}

function secondsAsTime(seconds: number) {
    return seconds as unknown as Time;
}

export function importVideosWithCameraBin(project: Project, cameraName: string) {
    const targetBin = getOrCreateBin(project, 'CAM-' + cameraName);
    return importVideos(project, targetBin);
}

export function insertClipWithCreateDate(project: Project, sequenceId: string, trackNum: number, videoProjectItems: ProjectItem[]) {
    const sequence = getSequence(project, sequenceId);
    if (!sequence) {
        throw new Error("Sequence not found");
    }

    const videoProjectItemsWithCreateDate = videoProjectItems.map(item => {
        const createDate = readCreateDateMillsFromXMPMeta(item);
        if (createDate === null) {
            throw new Error("Create date is not found in XMP metadata");
        }
        return {
            projectItem: item,
            createDate,
        };
    });
    videoProjectItemsWithCreateDate.sort((a, b) => {
        return (a.createDate ?? 0) - (b.createDate ?? 0);
    });

    const firstVideoCreateDate = videoProjectItemsWithCreateDate[0].createDate;
    videoProjectItemsWithCreateDate.forEach(videoProjectItem => {
        const deltaSeconds = (videoProjectItem.createDate - firstVideoCreateDate) / 1000;
        sequence.insertClip(videoProjectItem.projectItem, secondsAsTime(deltaSeconds), trackNum, trackNum);
    });

    const clips = createArray(sequence.videoTracks[trackNum].clips, 'numItems');
    return videoProjectItems.map(projectItem => {
        const trackItem = clips.find(clip => clip.projectItem.nodeId === projectItem.nodeId);
        if (!trackItem) {
            throw new Error("Track item not found");
        }
        return {
            projectItem,
            trackItem
        };
    });
}
