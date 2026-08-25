import { humanize } from './string.js';
export function getNameByPath(path) {
  if (!path) {
    return 'No path set';
  } else {
    const parts = path.split('.');
    return humanize(parts[parts.length - 1]);
  }
}
export function getStringByPath(obj, path) {
  const value = getValueByPath(obj, path);
  return value?.toString() ?? '';
}
export function getValueByPath(obj, path) {
  const keys = path.split(/[\.\[\]]/).filter(Boolean);
  let result = obj;
  for (const key of keys) {
    if (result === void 0 || result === null) {
      return void 0;
    }
    result = result[key];
  }
  return result;
}
export function setValueByPath(obj, path, value) {
  const keys = path.match(/([^[\].]+|\[\d+\])/g) ?? [];
  let result = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      nextKey = i < keys.length - 1 ? keys[i + 1] : void 0;
    if (isArrayIndex(key)) {
      const index = parseInt(key.slice(1, -1), 10);
      if (result[index] === void 0) {
        result[index] = isArrayIndex(nextKey) ? [] : {};
      }
      if (i === keys.length - 1) {
        result[index] = value;
      } else {
        result = result[index];
      }
    } else if (i === keys.length - 1) {
      result[key] = value;
    } else {
      result[key] ??= isArrayIndex(nextKey) ? [] : {};
      result = result[key];
    }
  }
}
function isArrayIndex(key) {
  return (key?.startsWith('[') && key?.endsWith(']')) || false;
}
//# sourceMappingURL=path.js.map
