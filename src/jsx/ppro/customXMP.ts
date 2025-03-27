import {createXMPMeta, registerXMPNamespace} from "../utils/xmp";

const customNamespaceURI = "https://ns.healgaren.com/ppro-toolkit/1.0/";
const customNamespacePrefix = "hgPProToolkit";

function init() {
    registerXMPNamespace(customNamespaceURI, customNamespacePrefix);
}

export function writeMultipleJSONToXMPMeta(projectItem: ProjectItem, entries: { key: string, value: unknown }[]) {
    const xmp = createXMPMeta(projectItem.getXMPMetadata());
    entries.map(({key, value}) => {
        const valueJSON = JSON.stringify(value);
        xmp.setProperty(customNamespaceURI, key, valueJSON);
    });
    return projectItem.setXMPMetadata(xmp.serialize());
}

export function writeJSONToXMPMeta(projectItem: ProjectItem, key: string, value: unknown) {
    return writeMultipleJSONToXMPMeta(projectItem, [{key, value}]);
}

function safeGetXMPProperty(xmp: XMPMetaInstance, customNamespaceURI: string, key: string): string | undefined {
    const property = xmp.getProperty(customNamespaceURI, key);
    if (property === undefined || property === null) {
        return undefined;
    }
    return property.value;
}

export function readJSONFromXMPMeta<T>(projectItem: ProjectItem, key: string) {
    const xmp = createXMPMeta(projectItem.getXMPMetadata());
    const valueJSON = safeGetXMPProperty(xmp, customNamespaceURI, key);
    if (valueJSON === undefined) {
        return undefined;
    }
    return JSON.parse(valueJSON) as T;
}

init();
