export class MediaController {
  #config;
  #host;
  #mediaQueries = /* @__PURE__ */ new Map();
  #previousDevice;
  /** Whether the current device is a mobile device. */
  get mobile() {
    return this.#mediaQueries.get('mobile')?.matches ?? false;
  }
  /** Whether the current device is a tablet device. */
  get tablet() {
    return this.#mediaQueries.get('tablet')?.matches ?? false;
  }
  /** Whether the current device is a desktop device. */
  get desktop() {
    return this.#mediaQueries.get('desktop')?.matches ?? false;
  }
  /** Whether the current device is a digiboard device. */
  get digiboard() {
    return this.#mediaQueries.get('digiboard')?.matches ?? false;
  }
  /** Current device based on the active media query. */
  get device() {
    for (const [device, mql] of this.#mediaQueries) {
      if (mql.matches) {
        return device;
      }
    }
    return 'desktop';
  }
  constructor(host, config) {
    this.#config = config;
    this.#host = host;
    this.#host.addController(this);
  }
  hostConnected() {
    this.#setup();
    this.#previousDevice = this.device;
    this.#mediaQueries.forEach(mql => mql.addEventListener('change', this.#onChange));
  }
  hostDisconnected() {
    this.#mediaQueries.forEach(mql => mql.removeEventListener('change', this.#onChange));
  }
  #onChange = () => {
    const current = this.device;
    if (this.#previousDevice !== void 0 && this.#previousDevice !== current) {
      const previous = this.#previousDevice;
      this.#previousDevice = current;
      this.#config?.onChange?.({ previous, current });
    }
    this.#host.requestUpdate();
  };
  #setup() {
    if (this.#mediaQueries.size > 0) {
      return;
    }
    this.#mediaQueries.set('mobile', window.matchMedia('(width <= 600px)'));
    this.#mediaQueries.set('tablet', window.matchMedia('(width > 600px) and (width <= 900px)'));
    this.#mediaQueries.set('desktop', window.matchMedia('(width > 900px) and (width <= 1200px)'));
    this.#mediaQueries.set('digiboard', window.matchMedia('(width > 1200px)'));
  }
}
//# sourceMappingURL=media.js.map
