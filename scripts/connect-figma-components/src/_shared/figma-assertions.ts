export type { InstanceHandle, TextHandle } from 'figma';

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

export function checkEnum<T extends string>(
  property: T | undefined | Array<{ message: string }>,
  name?: string
): T {
  if (typeof property === 'string') return property;

  if (Array.isArray(property)) {
    throw new Error(
      property[0]?.message ?? `Missing Figma enum property${name ? `: ${name}` : ''}`
    );
  }

  throw new Error(`Missing or unmapped Figma enum value${name ? ` for property: ${name}` : ''}`);
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
