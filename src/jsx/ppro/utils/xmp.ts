import {createXMPMeta} from "../../utils/xmp";
import {parseISOtoMills} from "../../utils/date";

export function readXMPMeta(projectItem: ProjectItem, key: string) {
    const xmp = createXMPMeta(projectItem.getXMPMetadata());
    const property = xmp.getProperty((XMPConst as unknown as {
        NS_XMP: string
    }).NS_XMP, key) as XMPProperty | undefined;
    return property?.value;
}

export function readCreateDateMillsFromXMPMeta(projectItem: ProjectItem) {
    const createDate = readXMPMeta(projectItem, 'CreateDate');
    if (createDate === undefined) {
        return null;
    }
    return parseISOtoMills(createDate);
}