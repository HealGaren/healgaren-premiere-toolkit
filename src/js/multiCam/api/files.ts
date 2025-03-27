import { VideoFile, ImportVideoFilesResponse } from '../types';
import { MOCK_DELAY, logApiCall } from './constants';
import {TrackItemVO} from "../../../shared/vo";

export const importAndInsertCameraVideos = async (mainSequenceId: string, cameraName: string, trackNum: number): Promise<ImportVideoFilesResponse> => {
  logApiCall('importAndInsertCameraVideos', 'start', { mainSequenceId, cameraName, trackNum });
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const userConfirmed = window.confirm('카메라에 파일을 추가하시겠습니까?');
  
  if (!userConfirmed) {
    const result = { success: false, videos: [] };
    logApiCall('importAndInsertCameraVideos', 'end', result);
    return result;
  }
  
  const result: ImportVideoFilesResponse = {
    success: true,
    videos: [
      {
        projectItem: {
          name: "C0026.MP4",
          mediaPath: "I:\\250322 대관공연\\원본영상\\1. 정면캠\\C0026.MP4",
          outPoint: {
            seconds: 2020.5185,
            ticks: "513244027296000"
          },
          nodeId: "000f427d",
          createdAt: 1711361400000 // 2024-03-25T10:00:00.000Z
        },
        trackItem: {
          name: "C0026.MP4",
          duration: {
            seconds: 2020.5185,
            ticks: "513244027296000"
          },
          inPoint: {
            seconds: 0,
            ticks: "0"
          },
          outPoint: {
            seconds: 2020.5185,
            ticks: "513244027296000"
          },
          start: {
            seconds: 0,
            ticks: "0"
          },
          end: {
            seconds: 2020.5185,
            ticks: "513244027296000"
          },
          mediaType: "Video",
          type: 1,
          nodeId: "000f4282",
          disabled: false,
          isSpeedReversed: 0,
          getSpeed: 1
        }
      },
      {
        projectItem: {
          name: "C0027.MP4",
          mediaPath: "I:\\250322 대관공연\\원본영상\\1. 정면캠\\C0027.MP4",
          outPoint: {
            seconds: 2129.127,
            ticks: "540832324032000"
          },
          nodeId: "000f427e",
          createdAt: 1711365000000 // 2024-03-25T11:00:00.000Z
        },
        trackItem: {
          name: "C0027.MP4",
          duration: {
            seconds: 2129.127,
            ticks: "540832324032000"
          },
          inPoint: {
            seconds: 0,
            ticks: "0"
          },
          outPoint: {
            seconds: 2129.127,
            ticks: "540832324032000"
          },
          start: {
            seconds: 2188.01916666667,
            ticks: "555791876640000"
          },
          end: {
            seconds: 4317.14616666667,
            ticks: "1096624200672000"
          },
          mediaType: "Video",
          type: 1,
          nodeId: "000f4283",
          disabled: false,
          isSpeedReversed: 0,
          getSpeed: 1
        }
      }
    ]
  };

  // Save video files to localStorage
  const videoFilesData = result.videos.map(file => ({
    nodeId: file.trackItem.nodeId,
    projectItem: file.projectItem,
    trackItem: file.trackItem
  }));

  // Get existing video files and merge with new ones
  const existingData = localStorage.getItem('premiere-sync-video-files');
  let existingFiles = [];
  if (existingData) {
    try {
      existingFiles = JSON.parse(existingData);
    } catch (error) {
      console.error('Error parsing existing video files:', error);
    }
  }

  const mergedFiles = [...existingFiles, ...videoFilesData];
  localStorage.setItem('premiere-sync-video-files', JSON.stringify(mergedFiles));

  logApiCall('importAndInsertCameraVideos', 'end', result);
  return result;
};

export const readVideos = async (cameraNames?: string[]): Promise<{ [nodeId: string]: VideoFile }> => {
  logApiCall('readVideos', 'start', { cameraNames });
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const storedData = localStorage.getItem('premiere-sync-video-files');
  if (!storedData) {
    logApiCall('readVideos', 'end', {});
    return {};
  }
  
  try {
    const videoFilesData = JSON.parse(storedData);
    const result = videoFilesData.reduce((acc: { [nodeId: string]: VideoFile }, file: any) => {
      acc[file.nodeId] = {
        projectItem: file.projectItem,
        trackItem: file.trackItem
      };
      return acc;
    }, {});
    
    logApiCall('readVideos', 'end', result);
    return result;
  } catch (error) {
    console.error('Error reading video files:', error);
    localStorage.removeItem('premiere-sync-video-files');
    logApiCall('readVideos', 'end', {});
    return {};
  }
};

export const createVideoFromTrackItem = (trackItem: TrackItemVO): VideoFile => {
  return {
    projectItem: {
      name: trackItem.name,
      mediaPath: `/videos/${trackItem.name}`,
      outPoint: trackItem.outPoint,
      nodeId: trackItem.nodeId,
      createdAt: null
    },
    trackItem
  };
};