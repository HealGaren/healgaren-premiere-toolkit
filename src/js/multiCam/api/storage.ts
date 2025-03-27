import {AppState} from '../types';
import {evalTS} from "../../lib/utils/bolt";
import {logApiCall} from "./constants";

export const saveAppState = async (state: AppState): Promise<void> => {
    logApiCall('saveAppState', 'start', {state});
    await evalTS('saveAppState', state);
    logApiCall('saveAppState', 'end');
};

export const loadAppState = async (): Promise<AppState | null> => {
    logApiCall('loadAppState', 'start');
    const appState = await evalTS('loadAppState');
    logApiCall('loadAppState', 'end', appState);
    return appState as AppState | null;
};

export const clearAppState = async (): Promise<void> => {
    logApiCall('clearAppState', 'start');
    await evalTS('clearAppState');
    logApiCall('clearAppState', 'end');
};