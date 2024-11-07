/* eslint-disable no-useless-escape */
import { humanize } from './string.js';

type ArrayPathImpl<T, Key extends string> = Key extends `${infer K}[${infer I}]${infer Rest}`
  ? K extends keyof T
    ? NonNullable<T[K]> extends Array<infer U>
      ? I extends `${number}`
        ? Rest extends ''
          ? U
          : Rest extends `.${infer R}`
            ? PathImpl<U, R>
            : never
        : never
      : never
    : never
  : never;

type ObjectPathImpl<T, Key extends string> = Key extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends PathKeys<NonNullable<T[K]>>
      ? PathImpl<NonNullable<T[K]>, Rest>
      : never
    : never
  : Key extends keyof T
    ? NonNullable<T[Key]>
    : never;

type PathImpl<T, Key extends string> = ArrayPathImpl<T, Key> | ObjectPathImpl<T, Key>;

export type PathKeys<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}.${PathKeys<T[K]>}` | K : never }[keyof T]
  : '';

export type Path<T, Key extends PathKeys<T>> = PathImpl<T, Key>;

export function getNameByPath(path?: string): string {
  if (!path) {
    return 'No path set';
  } else {
    const parts = path.split('.');

    return humanize(parts[parts.length - 1]);
  }
}

export function getStringByPath<T, P extends PathKeys<T>>(obj: T, path: P): string {
  const value = getValueByPath(obj, path);

  return value?.toString() ?? '';
}

export function getValueByPath<T, P extends PathKeys<T>>(obj: T, path: P): Path<T, P> {
  const keys = path.split(/[\.\[\]]/).filter(Boolean);
  let result: unknown = obj;

  for (const key of keys) {
    if (result === undefined || result === null) {
      return undefined as Path<T, P>;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result as Path<T, P>;
}

export function setValueByPath<T, P extends PathKeys<T>>(obj: T, path: P, value: Path<T, P> | undefined): void {
  const keys = path.match(/([^[\].]+|\[\d+\])/g) ?? [];

  let result: unknown = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      nextKey = i < keys.length - 1 ? keys[i + 1] : undefined;

    if (isArrayIndex(key)) {
      const index = parseInt(key.slice(1, -1), 10);

      if ((result as unknown[])[index] === undefined) {
        (result as unknown[])[index] = isArrayIndex(nextKey) ? [] : {};
      }

      if (i === keys.length - 1) {
        (result as unknown[])[index] = value;
      } else {
        result = (result as unknown[])[index];
      }
    } else if (i === keys.length - 1) {
      (result as Record<string, unknown>)[key] = value;
    } else {
      (result as Record<string, unknown>)[key] ??= isArrayIndex(nextKey) ? [] : {};

      result = (result as Record<string, unknown>)[key];
    }
  }
}

function isArrayIndex(key: string | undefined): boolean {
  return (key?.startsWith('[') && key?.endsWith(']')) || false;
}
