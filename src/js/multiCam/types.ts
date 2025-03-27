import {ProjectItemVO} from "../../shared/vo/projectItemVO";
import {TrackItemVO} from "../../shared/vo";

export interface VideoFile {
  projectItem: ProjectItemVO;
  trackItem: TrackItemVO;
}

export interface CameraVideoFile {
  nodeId: string;
  userData: {
    clipOffset: number;
    groupId?: string;
  };
}

export interface VideoGroup {
  id: string;
  offset: number; // in milliseconds
}

export interface Camera {
  id: string;
  name: string;
  trackNumber: number;
  files: CameraVideoFile[];
  offset: number; // in seconds
  groups: { [key: string]: VideoGroup };
}

export interface AppState {
  cameras: Camera[];
  mainSequenceId?: string;
  nextTrackNumber: number;
}

export interface VideoFileUIState {
  selected: boolean;
  premiereSelected: boolean;
}

export interface ImportVideoFilesResponse {
  success: boolean;
  videos: VideoFile[];
}