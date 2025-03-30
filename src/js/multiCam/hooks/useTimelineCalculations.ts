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
  showGap: boolean;
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
      let showGap = false;
      const previousFile = camera.files[index - 1];

      if (previousFile) {
        const previousVideoFile = videoFiles[previousFile.nodeId];
        if (previousVideoFile) {
          const previousEndTime = previousVideoFile.projectItem.createdAt
              ? (previousVideoFile.projectItem.createdAt - firstFileTime) +
              (previousVideoFile.projectItem.outPoint.seconds * 1000) +
              (camera.offset * 1000) +
              previousFile.userData.clipOffset +
              (previousFile.userData.groupId ? camera.groups[previousFile.userData.groupId]?.offset || 0 : 0)
              : (previousVideoFile.projectItem.outPoint.seconds * 1000) +
              (camera.offset * 1000) +
              previousFile.userData.clipOffset +
              (previousFile.userData.groupId ? camera.groups[previousFile.userData.groupId]?.offset || 0 : 0);

          const currentStartTime = relativeStartTime + file.userData.clipOffset +
              (file.userData.groupId ? camera.groups[file.userData.groupId]?.offset || 0 : 0);

          gap = (currentStartTime - previousEndTime) / 1000;

          // Only show gap if:
          // 1. Previous file is not in a group and current file is not in a group
          // 2. Previous file's group is different from current file's group
          showGap = (
              (!previousFile.userData.groupId && !file.userData.groupId) ||
              previousFile.userData.groupId !== file.userData.groupId
          );
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
        showGap,
        adjustedStartTime,
        adjustedEndTime,
        isFirstInGroup,
        groupOffset
      };
    }).filter((clip): clip is TimelineClip => clip !== null);
  }, [camera, videoFiles]);
};