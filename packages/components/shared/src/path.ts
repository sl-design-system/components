import { humanize } from './string.js';

export const getNameByPath = (path?: string): string => {
  if (!path) {
    return 'No path set';
  } else {
    const parts = path.split('.');

    return humanize(parts[parts.length - 1]);
  }
};

export const getStringByPath = (object: unknown, path = ''): string => {
  const value = getValueByPath(object, path);

  if (value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-base-to-string
    return value.toString();
  } else {
    return '';
  }
};

export const getValueByPath = (object: unknown, path = ''): unknown => {
  const parts = path?.split('.');

  let result = object;
  for (const part of parts) {
    if (!result) {
      break;
    }

    const [_, prop, index] = part.match(/(.+)\[(\d+)\]/) ?? [];
    if (prop) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      result = (result as any)[prop];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      result = (result as any[])?.at(parseInt(index));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      result = (result as any)[part];
    }
  }

  return result;
};

export const setValueByPath = (object: unknown, path = '', value: unknown): void => {
  const parts = path?.split('.');

  let result = object;
  for (const part of parts.slice(0, -1)) {
    if (!result) {
      break;
    }

    const [_, prop, index] = part.match(/(.+)\[(\d+)\]/) ?? [];
    if (prop) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      result = (result as any)[prop];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      result = (result as any[])?.at(parseInt(index));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      result = (result as any)[part];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (result as any)[parts.at(-1) ?? ''] = value;
};
