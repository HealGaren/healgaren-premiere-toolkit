import { useMemo } from 'react';
import { Camera, VideoFile, CameraVideoFile } from '../types';

interface TimelineClip {
  file: VideoFile;
  userData: CameraVideoFile['userData'];
  gap: number;
  adjustedStartTime: number;
  adjustedEndTime: number;
  isFirstInGroup: boolean;
  groupOffset: number;
}

export const useTimelineCalculations = (
  camera: Camera,
  videoFiles: { [nodeId: string]: VideoFile }
): TimelineClip[] => {
  return useMemo(() => {
    if (camera.files.length === 0) return [];

    const firstFileTime = camera.files.length > 0
      ? videoFiles[camera.files[0].nodeId]?.projectItem.createdAt || 0
      : 0;

    return camera.files.map((file, index) => {
      const videoFile = videoFiles[file.nodeId];
      if (!videoFile) return null;

      // Calculate relative start time
      const relativeStartTime = videoFile.projectItem.createdAt
        ? (videoFile.projectItem.createdAt - firstFileTime) + (camera.offset * 1000)
        : camera.offset * 1000;

      // Calculate gap from previous clip
      let gap = 0;
      const previousFile = camera.files[index - 1];
      if (previousFile) {
        const previousVideoFile = videoFiles[previousFile.nodeId];
        if (previousVideoFile) {
          const previousEndTime = previousVideoFile.projectItem.createdAt
            ? (previousVideoFile.projectItem.createdAt - firstFileTime) +
              (previousVideoFile.projectItem.outPoint.seconds * 1000) +
              (camera.offset * 1000)
            : (previousVideoFile.projectItem.outPoint.seconds * 1000) + (camera.offset * 1000);
          gap = (relativeStartTime - previousEndTime) / 1000;
        }
      }

      // Calculate group-related values
      const groupOffset = file.userData.groupId ? camera.groups[file.userData.groupId]?.offset || 0 : 0;
      const isFirstInGroup = file.userData.groupId && 
        (!previousFile || previousFile.userData.groupId !== file.userData.groupId);

      // Calculate adjusted times
      const adjustedStartTime = (relativeStartTime + file.userData.clipOffset + groupOffset) / 1000;
      const adjustedEndTime = adjustedStartTime + videoFile.projectItem.outPoint.seconds;

      return {
        file: videoFile,
        userData: file.userData,
        gap,
        adjustedStartTime,
        adjustedEndTime,
        isFirstInGroup,
        groupOffset
      };
    }).filter((clip): clip is TimelineClip => clip !== null);
  }, [camera, videoFiles]);
};