import { useState, useEffect } from 'react';
import { openSequence } from '../api';
import { saveState } from '../utils/storage';
import {SequenceVO, TrackItemVO} from "../../../shared/vo";
import {listenTS} from "../../lib/utils/bolt";

export const useSequence = (defaultActiveSequence: SequenceVO | null) => {
  const [activeSequence, setActiveSequence] = useState<SequenceVO | null>(defaultActiveSequence);
  const [selectedTrackItems, setSelectedTrackItems] = useState<TrackItemVO[]>([]);
  const [mainSequenceId, setMainSequenceId] = useState<string>();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Listen for sequence changes
    listenTS('sequenceActivated', ({ activeSequence }) => {
      setActiveSequence(activeSequence);
    });

    // Listen for selection changes
    listenTS('activeSequenceSelectionChanged', ({ selection }) => {
      setSelectedTrackItems(selection.filter(item => item.mediaType === 'Video'));
    });

    return () => {
      // sequenceUnsubscribe();
      // selectionUnsubscribe();
    };
  }, []);

  const handleSetMainSequence = async (sequenceId: string) => {
    setIsSyncing(true);
    try {
      setMainSequenceId(sequenceId);
      await saveState([], sequenceId);
      return sequenceId;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenMainSequence = async () => {
    if (!mainSequenceId) return;
    await openSequence(mainSequenceId);
  };

  return {
    activeSequence,
    selectedTrackItems,
    mainSequenceId,
    isSyncing,
    setMainSequenceId,
    handleSetMainSequence,
    handleOpenMainSequence
  };
};