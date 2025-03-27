import React, { createContext, useContext, useState, useCallback } from 'react';
import { VideoFile } from '../types';
import { readVideos } from '../api';

interface VideoFilesContextType {
  videoFiles: { [nodeId: string]: VideoFile };
  setVideoFiles: React.Dispatch<React.SetStateAction<{ [nodeId: string]: VideoFile }>>;
  isLoading: boolean;
  loadVideoFiles: (mainSequenceId: string, cameraNums: number[]) => Promise<{ [nodeId: string]: VideoFile }>;
}

const VideoFilesContext = createContext<VideoFilesContextType | null>(null);

export const VideoFilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoFiles, setVideoFiles] = useState<{ [nodeId: string]: VideoFile }>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadVideoFiles = useCallback(async (mainSequenceId: string, cameraNums: number[]) => {
    setIsLoading(true);
    try {
      const result = await readVideos(mainSequenceId, cameraNums);
      if (!result.success) {
        console.error(result.error);
        return {};
      }
      const newVideoRecord = result.videos.reduce((acc, video) => {
        acc[video.trackItem.nodeId] = video;
        return acc;
      }, {} as Record<string, VideoFile>);
      setVideoFiles(prev => ({ ...prev, ...newVideoRecord }));
      return newVideoRecord;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <VideoFilesContext.Provider value={{ videoFiles, setVideoFiles, isLoading, loadVideoFiles }}>
      {children}
    </VideoFilesContext.Provider>
  );
};

export const useVideoFiles = () => {
  const context = useContext(VideoFilesContext);
  if (!context) {
    throw new Error('useVideoFiles must be used within a VideoFilesProvider');
  }
  return context;
};