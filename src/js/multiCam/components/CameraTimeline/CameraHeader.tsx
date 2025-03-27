import React, {useState} from 'react';
import {Pencil, Trash2, X, Check} from 'lucide-react';

interface Props {
    name: string;
    trackNumber: number;
    onNameChange: (name: string) => void;
    onTrackNumberChange: (trackNumber: number) => void;
    onDelete: () => void;
    onOffsetChange: (offset: number) => void;
    offset: number;
}

export const CameraHeader: React.FC<Props> = ({
                                                  name,
                                                  trackNumber,
                                                  onNameChange,
                                                  onTrackNumberChange,
                                                  onDelete,
                                                  onOffsetChange,
                                                  offset
                                              }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNameChange(editedName);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-between mb-4">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="px-2 py-1 bg-gray-700 text-white rounded"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                        <Check size={16}/>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setEditedName(name);
                            setIsEditing(false);
                        }}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                        <X size={16}/>
                    </button>
                </form>
            ) : (
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{name}</h3>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                        <Pencil size={16}/>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-gray-600 rounded transition-colors text-red-400 hover:text-red-300"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
            )}
            <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                    <label className="text-gray-400">Track</label>
                    <input
                        type="number"
                        value={trackNumber}
                        onChange={(e) => onTrackNumberChange(Number(e.target.value))}
                        className="w-12 px-1.5 py-0.5 bg-gray-700 text-white rounded"
                        min="0"
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <label className="text-gray-400">Offset</label>
                    <input
                        type="number"
                        value={offset}
                        onChange={(e) => onOffsetChange(Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 bg-gray-700 text-white rounded"
                    />
                    <span className="text-gray-400">s</span>
                </div>
            </div>
        </div>
    );
};