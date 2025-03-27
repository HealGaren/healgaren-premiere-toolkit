import {TimeVO} from "./timeVO";

export interface ProjectItemVO {
    name: string;
    mediaPath: string;
    outPoint: TimeVO;
    nodeId: string;
    createdAt: number | null;
}