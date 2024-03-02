import { type ReactiveController, type ReactiveElement } from 'lit';
import { type ClassElement } from './base.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObserveFunction = (oldValue: any, newValue: any, name: PropertyKey) => void;
type ObserveLifecycle = 'update' | 'updated';

class PropertyObserverController<T extends ReactiveElement, TKey extends keyof T> implements ReactiveController {
  private _value?: T[TKey];

  constructor(
    private host: T,
    private key: TKey,
    private cb: ObserveFunction,
    private lifecycle: ObserveLifecycle
  ) {
    host.addController(this);
  }

  hostUpdate(): void {
    if (this.lifecycle === 'update') {
      this.handle();
    }
  }

  hostUpdated(): void {
    if (this.lifecycle === 'updated') {
      this.handle();
    }
  }

  private handle(): void {
    const { key, _value, host } = this;
    const newValue = host[key];

    if (_value !== newValue) {
      this._value = newValue;
      this.cb.call(host, _value, newValue, key);
    }
  }
}

export function observe(propertyName: string, lifecycle: ObserveLifecycle = 'update') {
  return function decorator(target: ReactiveElement | ClassElement, methodName: string) {
    const proto = target.constructor as typeof ReactiveElement;

    proto.addInitializer(el => {
      type Key = keyof typeof el;
      const cb = el[methodName as Key] as ObserveFunction;
      // // since we can't get strong typing here, we can add a runtime check
      // // this will get stripped out in prod, and should only ever happen in dev anyway
      // if (process?.env.NODE_ENV === 'development') {
      if (!(propertyName in el)) {
        throw new TypeError(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          `@observe: property '${propertyName}' does not exist.\nPossible properties: ${Object.keys(target)
            .map(p => `'${p}'`)
            .join(', ')}`
        );
      }
      // }
      el.addController(new PropertyObserverController(el, propertyName as Key, cb, lifecycle));
    });
  };
}
