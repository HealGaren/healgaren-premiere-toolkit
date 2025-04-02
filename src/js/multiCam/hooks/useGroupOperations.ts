import { Camera, VideoFile } from '../types';
import { saveState } from '../utils/storage';
import { produce } from 'immer';

export const useGroupOperations = (
  cameras: Camera[],
  setCameras: React.Dispatch<React.SetStateAction<Camera[]>>,
  mainSequenceId: string | undefined
) => {
  const handleGroupCreate = async (cameraId: string, files: VideoFile[]) => {
    const groupId = `group-${Date.now()}`;
    
    const updatedCameras = produce(cameras, draft => {
      const camera = draft.find(c => c.id === cameraId);
      if (camera) {
        camera.files.forEach(file => {
          if (files.some(f => f.trackItem.nodeId === file.nodeId)) {
            file.userData.groupId = groupId;
          }
        });
        camera.groups[groupId] = { id: groupId, offsetFrame: 0 };
      }
    });
    
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  const handleGroupDelete = async (cameraId: string, groupId: string) => {
    const updatedCameras = produce(cameras, draft => {
      const camera = draft.find(c => c.id === cameraId);
      if (camera) {
        camera.files.forEach(file => {
          if (file.userData.groupId === groupId) {
            file.userData.groupId = undefined;
          }
        });
        delete camera.groups[groupId];
      }
    });
    
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  const handleGroupOffsetFrameChange = async (cameraId: string, groupId: string, offsetFrame: number) => {
    const updatedCameras = produce(cameras, draft => {
      const camera = draft.find(c => c.id === cameraId);
      if (camera && camera.groups[groupId]) {
        camera.groups[groupId].offsetFrame = offsetFrame;
      }
    });
    
    setCameras(updatedCameras);
    await saveState(updatedCameras, mainSequenceId);
  };

  return {
    handleGroupCreate,
    handleGroupDelete,
    handleGroupOffsetFrameChange
  };
};