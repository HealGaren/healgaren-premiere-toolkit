import React from 'react';
import { FolderSyncIcon as SyncIcon, Download, Upload } from 'lucide-react';
import { TrackItemVO } from '../../../shared/vo';

interface Props {
    selectedTrackItems: TrackItemVO[];
    onSyncPremiereSelection: () => void;
    onSyncFromPremiere: () => void;
    onSyncToPremiere: () => void;
    isSyncing: boolean;
    isDisabled: boolean;
}

export const BottomBar: React.FC<Props> = ({
                                               selectedTrackItems,
                                               onSyncPremiereSelection,
                                               onSyncFromPremiere,
                                               onSyncToPremiere,
                                               isSyncing,
                                               isDisabled
                                           }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700">
            <div className="max-w-2xl mx-auto px-2 py-2 flex items-center gap-2">
                <div className="flex items-center gap-2 border-r border-neutral-700 pr-2">
                    <button
                        onClick={onSyncFromPremiere}
                        disabled={isDisabled}
                        className="flex items-center gap-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded text-sm transition-colors"
                        title="From Premiere"
                    >
                        <Download size={14} className={isSyncing ? 'animate-spin' : ''}/>
                    </button>
                    <button
                        onClick={onSyncToPremiere}
                        disabled={isDisabled}
                        className="flex items-center gap-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded text-sm transition-colors"
                        title="To Premiere"
                    >
                        <Upload size={14} className={isSyncing ? 'animate-spin' : ''}/>
                    </button>
                </div>

                {selectedTrackItems.length > 0 && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="text-sm text-neutral-300 truncate">
                            {selectedTrackItems.length} sel.
                        </div>
                        <button
                            onClick={onSyncPremiereSelection}
                            className="flex items-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors shrink-0"
                            title="Sync Selection"
                        >
                            <SyncIcon size={14} />
                            <span className="hidden sm:inline">Sync</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};