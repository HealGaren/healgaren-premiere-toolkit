export type Element<T> = T extends { [index: number]: infer E } ? E : never;

export function createArray<T extends {
    [index: number]: unknown
}, LK extends keyof T>(arrayLike: T & { [lengthKey in LK]: number }, lengthKey: LK): Element<T>[] {
    const length = arrayLike[lengthKey];
    const array = new Array<Element<T>>(length);
    for (let i = 0; i < length; i++) {
        array[i] = arrayLike[i] as Element<T>;
    }
    return array;
}
