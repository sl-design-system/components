import { decorateProperty } from './base.js';

export interface EventOptions {
  /** indicate if event bubbles up through the DOM or not */
  bubbles?: boolean;
  /** indicate if event is cancelable */
  cancelable?: boolean;
  /** indicate if event can bubble across the boundary between the shadow DOM and the light DOM */
  composed?: boolean;
}

export class EventEmitter<T> {
  constructor(private target: HTMLElement, private eventName: string, private options?: EventOptions) {}

  emit(value: T, options?: EventOptions): boolean {
    options = { bubbles: true, composed: true, ...this.options, ...options };

    return this.target.dispatchEvent(new CustomEvent<T>(this.eventName, { detail: value, ...options }));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function event(options?: EventOptions): any {
  return decorateProperty({
    descriptor: (key: PropertyKey) => {
      return {
        get(this: HTMLElement) {
          return new EventEmitter(this, key.toString(), options);
        },
        enumerable: true,
        configurable: true
      };
    }
  });
}
