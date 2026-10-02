export function checkBooleanProperty(
  property: boolean | Array<{ message: string }>,
  name: string
): boolean {
  if (typeof property !== 'boolean') {
    property.forEach(error => {
      throw new Error(error.message ?? `Missing Figma property: ${name}`);
    });

    return false;
  }

  return property;
}

export function checkEnum<T extends string>(property: T | Array<{ message: string }>): T {
  if (typeof property !== 'string') {
    property.forEach(error => {
      throw new Error(error.message ?? `Missing Figma property`);
    });

    return '' as T;
  }

  return property;
}

export function checkInstance<T extends { type: string }>(
  handle: T,
  name: string
): Exclude<T, { type: 'ERROR' }> {
  if (handle.type === 'ERROR') throw new Error(`Missing Figma instance: ${name}`);

  return handle as Exclude<T, { type: 'ERROR' }>;
}

export function checkStringProperty(
  property: string | Array<{ message: string }>,
  name: string
): string {
  if (typeof property !== 'string') {
    property.forEach(error => {
      throw new Error(error.message ?? `Missing Figma property: ${name}`);
    });

    return '';
  }

  return property;
}
