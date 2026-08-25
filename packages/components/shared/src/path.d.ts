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
  ? {
      [K in keyof T]: K extends string ? `${K}.${PathKeys<T[K]>}` | K : never;
    }[keyof T]
  : '';
export type Path<T, Key extends PathKeys<T>> = PathImpl<T, Key>;
export declare function getNameByPath(path?: string): string;
export declare function getStringByPath<T, P extends PathKeys<T>>(obj: T, path: P): string;
export declare function getValueByPath<T, P extends PathKeys<T>>(obj: T, path: P): Path<T, P>;
export declare function setValueByPath<T, P extends PathKeys<T>>(
  obj: T,
  path: P,
  value: Path<T, P> | undefined
): void;
export {};
