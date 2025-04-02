import { useMemo } from 'react';
import { Camera, VideoFile, CameraVideoFile } from '../types';
import {convertToFrame, quantizeToFrame} from "../utils/time";
import {SequenceVO} from "../../../shared/vo";

interface TimelineClip {
  file: VideoFile;
  userData: CameraVideoFile['userData'];
  gapFrame: number;
  adjustedStartFrame: number;
  adjustedEndFrame: number;
  isFirstInGroup: boolean;
  groupOffset: number;
  showGap: boolean;
}

export const useTimelineCalculations = (
    mainSequence: SequenceVO | null,
    camera: Camera,
    videoFiles: { [nodeId: string]: VideoFile }
): TimelineClip[] => {
  return useMemo(() => {
    if (mainSequence === null) return [];
    if (camera.files.length === 0) return [];

    const firstFileTime = camera.files.length > 0
        ? videoFiles[camera.files[0].nodeId]?.projectItem.createdAt || 0
        : 0;

    const timelineClipResults: TimelineClip[] = [];

    camera.files.forEach((file, index) => {
      const videoFile = videoFiles[file.nodeId];
      if (!videoFile) {
        console.error(file);
        throw new Error(`Video file not found for nodeId: ${file.nodeId}`);
      }

      const createdDeltaTime = videoFile.projectItem.createdAt - firstFileTime;
      const createdDeltaFrame = convertToFrame(createdDeltaTime / 1000, mainSequence.videoFrameRate.seconds);

      // Calculate relative start time
      const cameraStartFrame = camera.offsetFrame + createdDeltaFrame;

      // Calculate gap from previous clip
      let gapFrame = 0;
      let showGap = false;

      let isFirstInGroup = true;

      const clipGroup = (() => {
        const {groupId} = file.userData;
        if (groupId === undefined) {
          return null;
        }
        return camera.groups[groupId] ?? null;
      })();

      const groupOffset = (clipGroup?.offsetFrame ?? 0);

      // Calculate start frame based on continuous mode
      let adjustedStartFrame = cameraStartFrame;
      if (clipGroup?.continuous) {
        // In continuous mode, calculate position based on previous clips in the group
        if (index > 0) {
          const prevFile = camera.files[index - 1];
          if (prevFile.userData.groupId === file.userData.groupId) {
            // If previous clip is in the same group, position this clip right after it
            const prevClip = timelineClipResults[index - 1];
            adjustedStartFrame = prevClip.adjustedEndFrame;
          }
        }
        adjustedStartFrame += groupOffset;
      } else {
        // In non-continuous mode, use normal offset calculation
        adjustedStartFrame += groupOffset + file.userData.clipOffsetFrame;
      }

      if (index >= 1) {
        const previousFile = camera.files[index - 1];
        debugger;
        const previousEndFrame = timelineClipResults[index - 1].adjustedEndFrame;

        gapFrame = adjustedStartFrame - previousEndFrame;

        // Only show gap if:
        // 1. Previous file is not in a group and current file is not in a group
        // 2. Previous file's group is different from current file's group
        showGap = (
            (!previousFile.userData.groupId && !file.userData.groupId) ||
            previousFile.userData.groupId !== file.userData.groupId
        );

        isFirstInGroup = clipGroup
            ? previousFile.userData.groupId !== file.userData.groupId
            : false;
      }

      const adjustedEndFrame = adjustedStartFrame + convertToFrame(videoFile.projectItem.outPoint.seconds, mainSequence.videoFrameRate.seconds);

      timelineClipResults[index] = {
        file: videoFile,
        userData: file.userData,
        gapFrame,
        showGap,
        adjustedStartFrame,
        adjustedEndFrame,
        isFirstInGroup,
        groupOffset
      };
    });

    return timelineClipResults
        .filter((clip): clip is TimelineClip => clip !== null);
  }, [camera, videoFiles]);
};