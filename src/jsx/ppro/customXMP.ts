const customNamespaceURI = "https://ns.healgaren.com/ppro-toolkit/1.0/";
const customNamespacePrefix = "hgPProToolkit";

function init() {
    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }
    if (XMPMeta == undefined) {
        throw new Error("XMPMeta is not defined");
    }
    (XMPMeta as unknown as { registerNamespace: (namespaceURI: string, prefix: string) => string })
        .registerNamespace(customNamespaceURI, customNamespacePrefix);
}

function createXMPMeta(value?: string | number[]): XMPMetaInstance {
    if (value === undefined) {
        return new (XMPMeta!!)();
    }
    if (typeof value === "string") {
        return new (XMPMeta!!)(value);
    }
    return new (XMPMeta!!)(value);
}

export function writeMultipleJSONToXMPMeta(projectItem: ProjectItem, entries: { key: string, value: object }[]) {
    const xmp = createXMPMeta(projectItem.getXMPMetadata());
    entries.map(({key, value}) => {
        const valueJSON = JSON.stringify(value);
        xmp.setProperty(customNamespaceURI, key, valueJSON);
    });
    return projectItem.setXMPMetadata(xmp.serialize());
}

export function writeJSONToXMPMeta(projectItem: ProjectItem, key: string, value: object) {
    return writeMultipleJSONToXMPMeta(projectItem, [{key, value}]);
}

function safeGetXMPProperty(xmp: XMPMetaInstance, customNamespaceURI: string, key: string): string | undefined {
    const property = xmp.getProperty(customNamespaceURI, key);
    if (property === undefined || property === null) {
        return undefined;
    }
    return property.value;
}

export function readJSONFromXMPMeta<T extends object>(projectItem: ProjectItem, key: string) {
    const xmp = createXMPMeta(projectItem.getXMPMetadata());
    const valueJSON = safeGetXMPProperty(xmp, customNamespaceURI, key);
    if (valueJSON === undefined) {
        return undefined;
    }
    return JSON.parse(valueJSON) as T;
}

init();
