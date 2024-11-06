/* eslint-disable no-useless-escape */
import { humanize } from './string.js';

export type PathImpl<T, Key extends string> = Key extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends PathKeys<T[K]>
      ? PathImpl<T[K], Rest>
      : never
    : never
  : Key extends `${infer K}[${infer I}]`
    ? K extends keyof T
      ? T[K] extends Array<infer U>
        ? I extends `${number}`
          ? U
          : never
        : never
      : never
    : Key extends keyof T
      ? T[Key]
      : never;

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

  return typeof value === 'string' ? value : (value?.toString() ?? '');
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

export function setValueByPath<T, P extends PathKeys<T>>(obj: T, path: P, value: Path<T, P>): void {
  const keys = path.split(/[\.\[\]]/).filter(Boolean);
  let result: unknown = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (typeof result === 'object' && result !== null && !(key in result)) {
      (result as Record<string, unknown>)[key] = {};
    }
    result = (result as Record<string, unknown>)[key];
  }

  const lastKey = keys[keys.length - 1];
  if (typeof result === 'object' && result !== null) {
    (result as Record<string, unknown>)[lastKey] = value;
  }
}
