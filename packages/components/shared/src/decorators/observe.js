class PropertyObserverController {
  constructor(host, key, cb, lifecycle) {
    this.host = host;
    this.key = key;
    this.cb = cb;
    this.lifecycle = lifecycle;
    host.addController(this);
  }
  hostUpdate() {
    if (this.lifecycle === 'update') {
      this.handle();
    }
  }
  hostUpdated() {
    if (this.lifecycle === 'updated') {
      this.handle();
    }
  }
  handle() {
    const { key, _value, host } = this;
    const newValue = host[key];
    if (_value !== newValue) {
      this._value = newValue;
      this.cb.call(host, _value, newValue, key);
    }
  }
}
export function observe(propertyName, lifecycle = 'update') {
  return function decorator(target, methodName) {
    const proto = target.constructor;
    proto.addInitializer(el => {
      const cb = el[methodName];
      if (!(propertyName in el)) {
        throw new TypeError(
          `@observe: property '${propertyName}' does not exist.
Possible properties: ${Object.keys(target)
            .map(p => `'${p}'`)
            .join(', ')}`
        );
      }
      el.addController(new PropertyObserverController(el, propertyName, cb, lifecycle));
    });
  };
}
//# sourceMappingURL=observe.js.map
