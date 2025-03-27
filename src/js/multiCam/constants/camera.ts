export const CAMERA_DEFAULTS = {
  MIN_TRACK_NUMBER: 0,
  DEFAULT_OFFSET: 0,
  DEFAULT_CLIP_OFFSET: 0
};

export const generateCameraName = (index: number): string => {
  const letter = String.fromCharCode(65 + index); // A = 65 in ASCII
  return `${index + 1}-${letter}`;
};