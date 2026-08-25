export class EventsController {
  #events;
  #host;
  #listeners = [];
  constructor(host, events) {
    this.#host = host;
    this.#host.addController(this);
    this.#events = events;
  }
  hostConnected() {
    Object.entries(this.#events ?? {}).forEach(([name, registration]) => {
      const handler = typeof registration === 'function' ? registration : registration.handler;
      const options = typeof registration === 'function' ? void 0 : registration.options;
      this.listen(this.#host, name, handler, options);
    });
  }
  hostDisconnected() {
    this.#listeners.forEach(cb => cb());
    this.#listeners = [];
  }
  listen(element, type, listener, options) {
    const callback = event => {
      if (typeof listener === 'function') {
        listener.call(this.#host, event);
      } else {
        listener.handleEvent.call(this.#host, event);
      }
    };
    element.addEventListener(type, callback, options);
    this.#listeners.push(() => element.removeEventListener(type, callback, options));
  }
}
//# sourceMappingURL=events.js.map
