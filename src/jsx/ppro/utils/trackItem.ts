import {createArray} from "../../utils/array";

export function setTrackItemStartTime(trackItem: TrackItem, startTime: number) {
    const deltaStartTime = startTime - trackItem.start.seconds;
    trackItem.move(deltaStartTime);
}

export function setTrackItemStartTimeWithLinkedItems(trackItem: TrackItem, startTime: number) {
    const deltaStartTime = startTime - trackItem.start.seconds;
    createArray(trackItem.getLinkedItems(), 'numItems').forEach(linkedTrackItem => {
        linkedTrackItem.move(deltaStartTime);
    });
}