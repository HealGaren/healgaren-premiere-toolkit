import { useState, useEffect } from 'react';
import {openSequence, readSequence} from '../api';
import { saveState } from '../utils/storage';
import {SequenceVO, TrackItemVO} from "../../../shared/vo";
import {listenTS} from "../../lib/utils/bolt";

export const useSequence = (defaultActiveSequence: SequenceVO | null) => {
  const [activeSequence, setActiveSequence] = useState<SequenceVO | null>(defaultActiveSequence);
  const [mainSequence, setMainSequence] = useState<SequenceVO | null>(null);
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

  useEffect(() => {
    async function fetchMainSequence() {
      if (!mainSequenceId) {
        setMainSequence(null);
        return;
      }
      const sequence = await readSequence(mainSequenceId);
      if (sequence) {
        setMainSequence(sequence);
      }
    }
    fetchMainSequence();
  }, [mainSequenceId]);

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
    mainSequence,
    isSyncing,
    setMainSequenceId,
    handleSetMainSequence,
    handleOpenMainSequence
  };
};