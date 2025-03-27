import React from 'react';
import { formatTime } from '../../utils/time';

interface Props {
  gap: number;
}

export const TimeGap: React.FC<Props> = ({ gap }) => {
  if (gap <= 0) return null;
  
  return (
    <div className="my-2 px-3 py-2 bg-gray-800/80 rounded border border-gray-700/50 text-xs text-gray-400">
      Gap: {formatTime(gap)}
    </div>
  );
};