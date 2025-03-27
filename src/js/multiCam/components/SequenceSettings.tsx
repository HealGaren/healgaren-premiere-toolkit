import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PlayCircle } from 'lucide-react';
import {SequenceVO} from "../../../shared/vo";

interface Props {
  activeSequence: SequenceVO | null;
  mainSequenceId: string | undefined;
  onSetMainSequence: (sequenceId: string) => void;
  onOpenMainSequence: () => void;
}

export const SequenceSettings: React.FC<Props> = ({
  activeSequence,
  mainSequenceId,
  onSetMainSequence,
  onOpenMainSequence,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gray-800 rounded-lg mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-400" />
        )}
        <span className="font-medium">시퀸스 설정</span>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">활성 시퀸스</div>
                <div className="text-sm">
                  {activeSequence ? (
                    <>
                      <span className="font-medium">{activeSequence.name}</span>
                      <span className="text-gray-400 ml-2">
                        ({activeSequence.videoFrameWidth}×{activeSequence.videoFrameHeight}, {activeSequence.videoFrameRateFormatted}fps)
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">선택된 시퀸스 없음</span>
                  )}
                </div>
              </div>
              {activeSequence && (
                <button
                  onClick={() => onSetMainSequence(activeSequence.sequenceID)}
                  disabled={activeSequence.sequenceID === mainSequenceId}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded text-sm transition-colors whitespace-nowrap"
                >
                  메인으로 지정
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">메인 시퀸스</div>
                <div className="text-sm">
                  {mainSequenceId ? (
                    <span className="font-medium">
                      {activeSequence?.sequenceID === mainSequenceId 
                        ? activeSequence.name 
                        : mainSequenceId}
                    </span>
                  ) : (
                    <span className="text-gray-500">지정된 메인 시퀸스 없음</span>
                  )}
                </div>
              </div>
              {mainSequenceId && (
                <button
                  onClick={onOpenMainSequence}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors whitespace-nowrap"
                >
                  <PlayCircle size={14} />
                  <span>메인 시퀸스 열기</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};