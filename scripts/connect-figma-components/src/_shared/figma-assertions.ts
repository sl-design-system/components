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
