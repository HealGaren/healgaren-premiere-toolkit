import {readJSONFromXMPMeta, writeJSONToXMPMeta} from "./customXMP";

function getRootXMPItem() {
    return app.project.rootItem.children[0];
}

interface ExtensionInfo {
    initialized: boolean;
    readCount: number;
}

export const main = () => {
    const rootXMPItem = getRootXMPItem();
    const extensionInfo = readJSONFromXMPMeta<ExtensionInfo>(rootXMPItem, 'extensionInfo');
    if (!extensionInfo || !extensionInfo.initialized) {
        app.setSDKEventMessage('first initializing', 'info')
        return writeJSONToXMPMeta(rootXMPItem, 'extensionInfo', {
            initialized: true,
            readCount: 0,
        });
    } else {
        const newReadCount = extensionInfo.readCount + 1;
        app.setSDKEventMessage('read count: ' + newReadCount, 'info');
        return writeJSONToXMPMeta(rootXMPItem, 'extensionInfo', {
            initialized: extensionInfo.initialized,
            readCount: newReadCount
        });
    }
}

app.setSDKEventMessage('ppro extension loaded 테스트', 'info');
