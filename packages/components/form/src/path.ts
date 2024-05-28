/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
export type Path<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends PathKeys<T[K]>
      ? Path<T[K], Rest>
      : never
    : never
  : P extends `${infer K}[${infer I}]`
    ? K extends keyof T
      ? T[K] extends Array<infer U>
        ? I extends `${number}`
          ? U
          : never
        : never
      : never
    : P extends keyof T
      ? T[P]
      : never;

export type PathKeys<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}.${PathKeys<T[K]>}` | K : never }[keyof T]
  : '';

export function getValueByPath<T, P extends string>(obj: T, path: P): Path<T, P> | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = obj;

  for (const key of path.split('.')) {
    if (result === undefined || result === null) {
      break;
    }

    const match = /\[(\d+)\]$/.exec(key);
    if (match) {
      const index = Number(match[1]),
        arrayKey = key.slice(0, -match[0].length);

      result = result[arrayKey][index];
    } else {
      result = result[key];
    }
  }

  return result as Path<T, P>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setValueByPath<T>(obj: T, path: string, value: any): void;

export function setValueByPath<T, P extends string>(obj: T, path: P, value: Path<T, P>): void {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      match = /\[(\d+)\]$/.exec(key);

    if (match) {
      const index = Number(match[1]),
        arrayKey = key.slice(0, -match[0].length);

      current[arrayKey] ??= [];

      if (i === keys.length - 1) {
        current[arrayKey][index] = value;
      } else {
        current = current[arrayKey][index] ??= {};
      }
    } else {
      current[key] ??= {};

      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        current = current[key];
      }
    }
  }
}
