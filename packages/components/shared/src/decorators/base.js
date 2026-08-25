export const decorateProperty =
  ({ finisher, descriptor }) =>
  (protoOrDescriptor, name) => {
    if (name !== void 0) {
      const ctor = protoOrDescriptor.constructor;
      if (descriptor !== void 0) {
        Object.defineProperty(protoOrDescriptor, name, descriptor(name));
      }
      finisher?.(ctor, name);
    } else {
      const key =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        protoOrDescriptor.originalKey ?? protoOrDescriptor.key;
      const info =
        descriptor != void 0
          ? {
              kind: 'method',
              placement: 'prototype',
              key,
              descriptor: descriptor(protoOrDescriptor.key)
            }
          : { ...protoOrDescriptor, key };
      if (finisher != void 0) {
        info.finisher = function (ctor) {
          finisher(ctor, key);
        };
      }
      return info;
    }
  };
//# sourceMappingURL=base.js.map
