import { type FocusGroupConfig, FocusGroupController } from './focus-group.js';

export type RovingTabindexConfig<T> = FocusGroupConfig<T>;

interface UpdateTabIndexes {
  tabIndex: number;
  removeTabIndex?: boolean;
}

export class RovingTabindexController<T extends HTMLElement> extends FocusGroupController<T> {
  protected override set focused(focused: boolean) {
    console.log('this.focused', this.focused);
    if (focused === this.focused) return;
    super.focused = focused;
    this.manageTabindexes();
  }

  protected override get focused(): boolean {
    return super.focused;
  }

  private managed = true;

  private manageIndexesAnimationFrame = 0;

  override clearElementCache(offset = 0): void {
    cancelAnimationFrame(this.manageIndexesAnimationFrame);
    super.clearElementCache(offset);
    if (!this.managed) return;

    this.manageIndexesAnimationFrame = requestAnimationFrame(() => this.manageTabindexes());
  }

  manageTabindexes(): void {
    if (this.focused) {
      this.updateTabindexes(() => ({ tabIndex: -1 }));
    } else {
      this.updateTabindexes((el: HTMLElement): UpdateTabIndexes => {
        return {
          removeTabIndex: el.contains(this.focusInElement) && el !== this.focusInElement,
          tabIndex: el === this.focusInElement ? 0 : -1
        };
      });
    }
  }

  updateTabindexes(getTabIndex: (el: HTMLElement) => UpdateTabIndexes): void {
    console.log('this.elements', this.elements);
    this.elements.forEach(el => {
      const { tabIndex, removeTabIndex } = getTabIndex(el);
      if (!removeTabIndex) {
        el.tabIndex = tabIndex;
        console.log('eeel !removeTabIndex', el);
        return;
      }
      el.removeAttribute('tabindex');
      const updatable = el as unknown as {
        requestUpdate?(): void;
      };
      if (updatable.requestUpdate) updatable.requestUpdate();
      console.log('eeel removeTabIndex', el);
    });
  }

  override manage(): void {
    this.managed = true;
    this.manageTabindexes();
    super.manage();
  }

  override unmanage(): void {
    this.managed = false;
    this.updateTabindexes(() => ({ tabIndex: 0 }));
    super.unmanage();
  }

  hostUpdated(): void {
    if (!this.host.hasUpdated) {
      this.manageTabindexes();
    }
  }
}
