import {registerEvent} from "./registerEvent/registerEvent";
import {createSequenceVO} from "./createVO";

export const initialize = () => {
    registerEvent();
    app.setSDKEventMessage('HealGaren Toolkit Initialized!', 'info');
    return {
        activeSequence: createSequenceVO(app.project.activeSequence),
    }
}

export * from "./multiCamAPI";