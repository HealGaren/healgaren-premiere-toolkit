import {ProjectItemVO} from "../../shared/vo/projectItemVO";
import {TimeVO, TrackItemVO} from "../../shared/vo";

export interface VideoFile {
  projectItem: ProjectItemVO;
  trackItem: TrackItemVO;
}

export interface CameraVideoFile {
  nodeId: string;
  userData: {
    clipOffsetFrame: number;
    groupId?: string;
  };
}

export interface VideoGroup {
  id: string;
  offsetFrame: number;
  continuous: boolean;
}

export interface Camera {
  id: string;
  name: string;
  trackNumber: number;
  files: CameraVideoFile[];
  offsetFrame: number;
  groups: { [key: string]: VideoGroup };
}

export interface AppState {
  cameras: Camera[];
  mainSequenceId?: string;
  nextTrackNumber: number;
}

export interface VideoFileUIState {
  selected: boolean;
}

export type ImportVideoFilesResponse = {
  success: false
} | {
  success: true;
  videos: VideoFile[];
}