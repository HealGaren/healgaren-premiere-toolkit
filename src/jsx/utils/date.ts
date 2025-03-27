export function parseISOtoMills(isoString: string) {
    // 정규식으로 구성 요소 추출
    const regex = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|([+-])(\d{2}):?(\d{2}))?$/;
    const match = regex.exec(isoString);

    if (!match) {
        throw new Error("Invalid ISO 8601 string: " + isoString);
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS는 0부터 시작
    const day = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const second = parseInt(match[6], 10);
    const millisecond = match[7] ? parseInt(match[7], 10) : 0;

    const offset = (() => {
        if (match[8] === 'Z') {
            return 0;
        } else if (match[9]) {
            const sign = match[9] === '+' ? -1 : 1;
            const offsetHour = parseInt(match[10], 10);
            const offsetMinute = parseInt(match[11], 10);
            return sign * ((offsetHour * 60 + offsetMinute) * 60000);
        }
        return 0;
    })();

    const utcMillis = Date.UTC(year, month, day, hour, minute, second, millisecond) as unknown as number;
    return utcMillis + offset;
}
