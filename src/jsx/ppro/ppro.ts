import {registerEvent} from "./registerEvent/registerEvent";

export const main = () => {
    registerEvent();
    app.setSDKEventMessage('HealGaren Toolkit Initialized!', 'info');
}

export * from "./multiCamAPI";