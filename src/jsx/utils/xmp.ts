function init() {
    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }
    if (XMPMeta == undefined) {
        throw new Error("XMPMeta is not defined");
    }
}

export function registerXMPNamespace(namespaceURI: string, prefix: string) {
    (XMPMeta as unknown as { registerNamespace: (namespaceURI: string, prefix: string) => string })
        .registerNamespace(namespaceURI, prefix);
}

export function createXMPMeta(value?: string | number[]): XMPMetaInstance {
    if (value === undefined) {
        return new (XMPMeta!!)();
    }
    if (typeof value === "string") {
        return new (XMPMeta!!)(value);
    }
    return new (XMPMeta!!)(value);
}

init();