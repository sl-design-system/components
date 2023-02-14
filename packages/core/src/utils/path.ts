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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return value.toString();
  } else {
    return '';
  }
};

export const getValueByPath = (object: unknown, path = ''): unknown => {
  const parts = path?.split('.');

  let result = object;
  for (const part of parts) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    result = (result as any)[part];
  }

  return result;
};
