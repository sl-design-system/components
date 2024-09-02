import { type ReactiveElement } from 'lit';
import { type Constructor } from '../types.js';

// From the TC39 Decorators proposal
export interface ClassDescriptor {
  kind: 'class';
  elements: ClassElement[];
  finisher?<T>(clazz: Constructor<T>): void | Constructor<T>;
}

// From the TC39 Decorators proposal
export interface ClassElement {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  initializer?: Function;
  extras?: ClassElement[];
  finisher?<T>(clazz: Constructor<T>): void | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

/**
 * Helper for decorating a property that is compatible with both TypeScript
 * and Babel decorators. The optional `finisher` can be used to perform work on
 * the class. The optional `descriptor` should return a PropertyDescriptor
 * to install for the given property.
 *
 * @param finisher {function} Optional finisher method; receives the element
 * constructor and property key as arguments and has no return value.
 * @param descriptor {function} Optional descriptor method; receives the
 * property key as an argument and returns a property descriptor to define for
 * the given property.
 * @returns {ClassElement|void}
 */
export const decorateProperty =
  ({
    finisher,
    descriptor
  }: {
    finisher?: ((ctor: typeof ReactiveElement, property: PropertyKey) => void) | null;
    descriptor?(property: PropertyKey): PropertyDescriptor;
  }) =>
  (
    protoOrDescriptor: ReactiveElement | ClassElement,
    name?: PropertyKey
    // Note TypeScript requires the return type to be `void|any`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  ): void | any => {
    // TypeScript / Babel legacy mode
    if (name !== undefined) {
      const ctor = (protoOrDescriptor as ReactiveElement).constructor;
      if (descriptor !== undefined) {
        Object.defineProperty(protoOrDescriptor, name, descriptor(name));
      }
      finisher?.(ctor as typeof ReactiveElement, name);
      // Babel standard mode
    } else {
      // Note, the @property decorator saves `key` as `originalKey`
      // so try to use it here.
      const key: PropertyKey =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        ((protoOrDescriptor as unknown as any).originalKey as PropertyKey) ?? (protoOrDescriptor as ClassElement).key;
      const info: ClassElement =
        descriptor != undefined
          ? {
              kind: 'method',
              placement: 'prototype',
              key,
              descriptor: descriptor((protoOrDescriptor as ClassElement).key)
            }
          : { ...(protoOrDescriptor as ClassElement), key };
      if (finisher != undefined) {
        info.finisher = function <ReactiveElement>(ctor: Constructor<ReactiveElement>) {
          finisher(ctor as unknown as typeof ReactiveElement, key);
        };
      }
      return info;
    }
  };
