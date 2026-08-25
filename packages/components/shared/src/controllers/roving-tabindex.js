import { FocusGroupController } from './focus-group.js';
export class RovingTabindexController extends FocusGroupController {
  constructor() {
    super(...arguments);
    this.managed = true;
    this.manageIndexesAnimationFrame = 0;
  }
  set focused(focused) {
    if (focused === this.focused) return;
    super.focused = focused;
    this.manageTabindexes();
  }
  get focused() {
    return super.focused;
  }
  clearElementCache(offset = 0) {
    cancelAnimationFrame(this.manageIndexesAnimationFrame);
    super.clearElementCache(offset);
    if (!this.managed) return;
    this.manageIndexesAnimationFrame = requestAnimationFrame(() => this.manageTabindexes());
  }
  manageTabindexes() {
    if (this.focused) {
      this.updateTabindexes(() => ({ tabIndex: -1 }));
    } else {
      this.updateTabindexes(el => {
        return {
          removeTabIndex: el.contains(this.focusInElement) && el !== this.focusInElement,
          tabIndex: el === this.focusInElement ? 0 : -1
        };
      });
    }
  }
  updateTabindexes(getTabIndex) {
    this.elements.forEach(el => {
      const { tabIndex, removeTabIndex } = getTabIndex(el);
      if (!removeTabIndex) {
        el.tabIndex = tabIndex;
        return;
      }
      el.removeAttribute('tabindex');
      const updatable = el;
      if (updatable.requestUpdate) updatable.requestUpdate();
    });
  }
  manage() {
    this.managed = true;
    this.manageTabindexes();
    super.manage();
  }
  unmanage() {
    this.managed = false;
    this.updateTabindexes(() => ({ tabIndex: 0 }));
    super.unmanage();
  }
  hostUpdated() {
    if (!this.host.hasUpdated) {
      this.manageTabindexes();
    }
  }
}
//# sourceMappingURL=roving-tabindex.js.map
