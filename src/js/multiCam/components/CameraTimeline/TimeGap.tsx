import React from 'react';
import {formatFrameTime, formatTime} from '../../utils/time';

interface Props {
  gapFrame: number;
  frameCountInSecond: number;
}

export const TimeGap: React.FC<Props> = ({ gapFrame, frameCountInSecond }) => {
  if (gapFrame <= 0) return null;
  
  return (
    <div className="my-2 px-3 py-2 bg-neutral-800/80 rounded border border-neutral-700/50 text-xs text-neutral-400">
      Gap: {formatFrameTime(gapFrame, frameCountInSecond)}
    </div>
  );
};