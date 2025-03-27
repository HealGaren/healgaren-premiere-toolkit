import {SequenceVO, TrackItemVO} from "./vo";

/**
 * @description Declare event types for listening with listenTS() and dispatching with dispatchTS()
 */
export type EventTS = {
  activeSequenceChanged: {
    activeSequence: SequenceVO;
  }
  activeSequenceSelectionChanged: {
    selection: TrackItemVO[];
  }
};
