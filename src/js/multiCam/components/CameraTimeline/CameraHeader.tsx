import React, {useState} from 'react';
import {Pencil, Trash2, X, Check, ArrowDownToLine} from 'lucide-react';

interface Props {
    name: string;
    trackNumber: number;
    onNameChange: (name: string) => void;
    onTrackNumberChange: (trackNumber: number) => void;
    onDelete: () => void;
    onOffsetFrameChange: (offsetFrame: number) => void;
    onFetchTrackOffset?: () => void;
    offsetFrame: number;
    isExpanded: boolean;
}

export const CameraHeader: React.FC<Props> = ({
                                                  name,
                                                  trackNumber,
                                                  onNameChange,
                                                  onTrackNumberChange,
                                                  onDelete,
                                                  onOffsetFrameChange,
                                                  onFetchTrackOffset,
                                                  offsetFrame,
                                                  isExpanded
                                              }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNameChange(editedName);
        setIsEditing(false);
    };

    return (
        <div className="mb-4">
            <div className="w-full mb-3">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="flex-1 px-2 py-1 bg-neutral-700 text-white rounded"
                            autoFocus
                        />
                        <div className="flex items-center gap-1">
                            <button
                                type="submit"
                                className="p-1 hover:bg-neutral-600 rounded transition-colors"
                            >
                                <Check size={16}/>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditedName(name);
                                    setIsEditing(false);
                                }}
                                className="p-1 hover:bg-neutral-600 rounded transition-colors"
                            >
                                <X size={16}/>
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="w-full flex items-center">
                        <h3 className="flex-1 text-lg font-semibold text-white truncate">{name}</h3>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 hover:bg-neutral-600 rounded transition-colors"
                            >
                                <Pencil size={16}/>
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1 hover:bg-neutral-600 rounded transition-colors text-red-400 hover:text-red-300"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="flex justify-end items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <label className="text-neutral-400">Track</label>
                        <input
                            type="number"
                            value={trackNumber}
                            onChange={(e) => onTrackNumberChange(Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-neutral-700 text-white rounded text-right"
                            min="0"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <label className="text-neutral-400">Offset</label>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={offsetFrame}
                                onChange={(e) => onOffsetFrameChange(Number(e.target.value))}
                                className="w-20 px-2 py-1 bg-neutral-700 text-white rounded text-right"
                                step={1}
                            />
                            {onFetchTrackOffset && (
                                <button
                                    onClick={onFetchTrackOffset}
                                    className="p-1 hover:bg-neutral-600 rounded transition-colors text-neutral-400 hover:text-white"
                                    title="트랙의 첫 클립 위치로 오프셋 가져오기"
                                >
                                    <ArrowDownToLine size={14}/>
                                </button>
                            )}
                        </div>
                        <span className="text-neutral-400">f</span>
                    </div>
                </div>
            )}
        </div>
    );
};