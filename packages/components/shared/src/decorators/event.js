import { dasherize } from '../string.js';
import { decorateProperty } from './base.js';
export class EventEmitter {
  constructor(target, eventName, options) {
    this.target = target;
    this.eventName = eventName;
    this.options = options;
  }
  emit(value, options) {
    let event2;
    if (value instanceof Event) {
      event2 = value;
    } else {
      options = { bubbles: true, composed: true, ...this.options, ...options };
      event2 = new CustomEvent(this.eventName, { detail: value, ...options });
    }
    return this.target.dispatchEvent(event2);
  }
}
export function event(options) {
  return decorateProperty({
    descriptor: key => {
      const eventName = options?.name ?? `sl-${dasherize(key.toString())}`;
      return {
        get() {
          return new EventEmitter(this, eventName, options);
        },
        enumerable: true,
        configurable: true
      };
    }
  });
}
//# sourceMappingURL=event.js.map
