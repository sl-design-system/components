import { TextInput } from '@sl-design-system/text-input';

export interface Accessor<T extends HTMLElement = HTMLElement, U = string> {
  getValue(element: T): U;
  setValue(element: T, value: U): void;
  isSupported(element: HTMLElement): boolean;
}

const textInputAccessor: Accessor<TextInput, string> = {
  getValue: element => element.value ?? '',
  setValue: (element, value) => {
    element.value = value;
  },
  isSupported: element => element instanceof TextInput
};

export const accessors = (element: HTMLElement): Accessor | undefined => {
  if (textInputAccessor.isSupported(element)) {
    return textInputAccessor;
  }

  return undefined;
};
