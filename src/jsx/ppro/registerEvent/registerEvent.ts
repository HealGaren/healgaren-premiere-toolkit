import {createSequenceVO, createTrackItemVO} from "../createVO";
import {dispatchTS} from "../../utils/utils";

function registerActiveSequenceChanged() {
    app.bind('onSequenceActivated', () => {
        dispatchTS('sequenceActivated', {
            activeSequence: createSequenceVO(app.project.activeSequence)
        });
    });
}

function unregisterActiveSequenceChanged() {
    app.unbind('onActiveSequenceChanged');
}

function registerSequenceSelectionChanged() {
    app.bind('onActiveSequenceSelectionChanged', () => {
        dispatchTS('activeSequenceSelectionChanged', {
            selection: app.project.activeSequence.getSelection()
                .map(it => createTrackItemVO(app.project.activeSequence, it))
        });
    });
}

function unregisterSequenceSelectionChanged() {
    app.unbind('onActiveSequenceSelectionChanged');
}

export function registerEvent() {
    registerActiveSequenceChanged();
    registerSequenceSelectionChanged();
}

export function unregisterEvent() {
    unregisterActiveSequenceChanged();
    unregisterSequenceSelectionChanged();
}

