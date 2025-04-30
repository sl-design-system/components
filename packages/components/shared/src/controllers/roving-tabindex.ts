import { type FocusGroupConfig, FocusGroupController } from './focus-group.js';

export type RovingTabindexConfig<T> = FocusGroupConfig<T>;

interface UpdateTabIndexes {
  tabIndex: number;
  removeTabIndex?: boolean;
}

export class RovingTabindexController<T extends HTMLElement> extends FocusGroupController<T> {
  protected override set focused(focused: boolean) {
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
    console.log('manageTabindexes', this.focused, this.focusInElement, this.elements);
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

    console.log(
      'with tabindex00000 in manageTabIndexes...',
      this.elements.filter(el => el.tabIndex == 0),
      this.elements.filter(el => el.tabIndex == 0).length,
      this.elements.filter(el => el.tabIndex == 0)[0]?.innerText
    );
  }

  updateTabindexes(getTabIndex: (el: HTMLElement) => UpdateTabIndexes): void {
    console.log('updateTabindexes elements', this.elements, this.focused, this.focusInElement);

    this.elements.forEach(el => {
      console.log('el', el, 'tabindex12345', el.tabIndex);
    });

    // console.log('with tabindex00000', this.elements.forEach(el => {
    //   console.log('el', el, 'tabindex123', el.tabIndex);
    // }));

    this.elements.forEach(el => {
      const { tabIndex, removeTabIndex } = getTabIndex(el);
      if (!removeTabIndex) {
        el.tabIndex = tabIndex;
        return;
      }
      el.removeAttribute('tabindex');
      const updatable = el as unknown as {
        requestUpdate?(): void;
      };
      if (updatable.requestUpdate) updatable.requestUpdate();
    });

    console.log(
      'with tabindex00000',
      this.elements.filter(el => el.tabIndex == 0),
      this.elements.filter(el => el.tabIndex == 0).length
    );
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
