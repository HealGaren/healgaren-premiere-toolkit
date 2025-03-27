import { Camera, VideoFile, CameraVideoFile } from '../types';
import { CAMERA_DEFAULTS } from '../constants/camera';

export const sortFilesByStartTime = (
  files: CameraVideoFile[], 
  videoFiles: { [nodeId: string]: VideoFile }
): CameraVideoFile[] => {
  return [...files].sort((a, b) => {
    const fileA = videoFiles[a.nodeId];
    const fileB = videoFiles[b.nodeId];
    if (!fileA || !fileB) return 0;
    return fileA.trackItem.start.seconds - fileB.trackItem.start.seconds;
  });
};

export const calculateTimeGap = (
  currentFile: VideoFile,
  previousFile: VideoFile | null,
  firstFileTime: number,
  cameraOffset: number
): number => {
  if (!previousFile) return 0;

  const currentStartTime = currentFile.projectItem.createdAt
    ? (currentFile.projectItem.createdAt - firstFileTime) + (cameraOffset * 1000)
    : cameraOffset * 1000;

  const previousEndTime = previousFile.projectItem.createdAt
    ? (previousFile.projectItem.createdAt - firstFileTime) +
      (previousFile.projectItem.outPoint.seconds * 1000) +
      (cameraOffset * 1000)
    : (previousFile.projectItem.outPoint.seconds * 1000) + (cameraOffset * 1000);

  return (currentStartTime - previousEndTime) / 1000;
};

export const getFirstFileTime = (
  files: CameraVideoFile[],
  videoFiles: { [nodeId: string]: VideoFile }
): number => {
  if (files.length === 0) return 0;
  const firstFile = videoFiles[files[0].nodeId];
  return firstFile?.projectItem.createdAt || 0;
};

export const isConsecutiveSelection = (
  selectedFiles: (VideoFile & { cameraId: string })[],
  cameras: Camera[]
): boolean => {
  if (selectedFiles.length < 2) return false;

  // Check if all selected files are from the same camera
  const cameraId = selectedFiles[0].cameraId;
  if (!selectedFiles.every(file => file.cameraId === cameraId)) {
    return false;
  }

  // Check if files are consecutive within their camera
  const camera = cameras.find(c => c.id === cameraId);
  if (!camera) return false;

  const fileIndices = selectedFiles
    .map(sf => camera.files.findIndex(f => f.nodeId === sf.trackItem.nodeId))
    .sort((a, b) => a - b);

  return fileIndices.every((val, idx, arr) => 
    idx === 0 || val === arr[idx - 1] + 1
  );
};