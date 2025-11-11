import { type ReactiveController, type ReactiveElement } from 'lit';

type DirectionTypes = 'horizontal' | 'vertical' | 'both' | 'grid';

export type NewFocusGroupConfig<T> = {
  /** Whether to manage the autofocus attribute (defaults to false). */
  autofocus?: boolean;

  /** Navigation direction: 'horizontal', 'vertical', 'both', or 'grid'. */
  direction?: DirectionTypes | (() => DirectionTypes);

  /** Number of columns (for grid navigation). */
  directionLength?: number;

  /** Callback invoked when an element is focused via keyboard navigation. */
  elementEnterAction?(el: T): void;

  /** Returns the array of elements to manage. */
  elements(): T[];

  /** Returns the index of the element to receive tabindex="0" when not focused. */
  focusInIndex?(elements: T[]): number;

  /** Determines if an element can receive focus. */
  isFocusableElement?(el: T): boolean;

  /** Returns the element to attach event listeners to (defaults to host). */
  scope?(): HTMLElement;

  /** Whether focus should wrap around at boundaries (defaults to false). */
  wrap?: boolean;
};

interface UpdateTabIndexes {
  tabIndex: number;
  removeTabIndex?: boolean;
}

export class NewFocusGroupController<T extends HTMLElement> implements ReactiveController {
  // Configuration
  #autofocus = false;
  #direction = (): DirectionTypes => 'both';
  #directionLength = (): number => 1;
  #elements: () => T[];
  #focusInIndex = (_elements: T[]): number => 0;
  #host: ReactiveElement & HTMLElement;
  #scope = (): HTMLElement => this.#host;
  #wrap = false;

  // State
  #cachedElements?: T[];
  #currentIndex = -1;
  #focused = false;
  #managed = true;
  #manageIndexesAnimationFrame = 0;

  // Public properties
  elementEnterAction = (_el: T): void => {
    return;
  };

  isFocusableElement = (el: T): boolean => !el.hasAttribute('disabled');

  // Getters and setters
  get currentIndex(): number {
    if (this.#currentIndex === -1) {
      this.#currentIndex = this.focusInIndex;
    }

    return this.#currentIndex;
  }

  set currentIndex(currentIndex) {
    this.#currentIndex = currentIndex;
  }

  get direction(): DirectionTypes {
    return this.#direction();
  }

  set directionLength(directionLength: number) {
    this.#directionLength = () => directionLength;
  }

  get elements(): T[] {
    if (!this.#cachedElements) {
      this.#cachedElements = this.#elements();
    }

    return this.#cachedElements;
  }

  get focused(): boolean {
    return this.#focused;
  }

  set focused(focused: boolean) {
    if (focused === this.focused) return;
    this.#focused = focused;
    this.#manageTabindexes();
  }

  get focusInElement(): T {
    return this.elements[this.focusInIndex];
  }

  get focusInIndex(): number {
    return this.#focusInIndex(this.elements);
  }

  constructor(
    host: ReactiveElement & HTMLElement,
    {
      autofocus,
      direction,
      directionLength,
      elementEnterAction,
      elements,
      focusInIndex,
      isFocusableElement,
      scope,
      wrap
    }: NewFocusGroupConfig<T> = { elements: () => [] }
  ) {
    this.#host = host;
    this.#host.addController(this);

    if (typeof direction === 'string') {
      this.#direction = () => direction;
    } else if (typeof direction === 'function') {
      this.#direction = direction;
    }

    if (typeof directionLength === 'number') {
      this.#directionLength = () => directionLength;
    } else if (typeof directionLength === 'function') {
      this.#directionLength = directionLength;
    }

    this.#elements = elements;
    this.elementEnterAction = elementEnterAction || this.elementEnterAction;

    if (typeof focusInIndex === 'number') {
      this.#focusInIndex = () => focusInIndex;
    } else if (typeof focusInIndex === 'function') {
      this.#focusInIndex = focusInIndex;
    }

    this.isFocusableElement = isFocusableElement || this.isFocusableElement;

    this.#autofocus = autofocus ?? false;

    if (scope) {
      this.#scope = scope;
    }

    this.#wrap = wrap ?? false;
  }

  // Lifecycle methods
  hostConnected(): void {
    this.#addEventListeners();
  }

  hostDisconnected(): void {
    this.#removeEventListeners();
  }

  hostUpdated(): void {
    if (!this.#host.hasUpdated) {
      this.#manageTabindexes();
    }
  }

  // Public API
  update({ elements, wrap }: NewFocusGroupConfig<T> = { elements: () => [] }): void {
    this.unmanage();
    this.#elements = elements;
    if (wrap !== undefined) {
      this.#wrap = wrap ?? false;
    }

    this.clearElementCache();
    this.manage();
  }

  focus(options?: FocusOptions): void {
    let focusElement = this.elements[this.currentIndex];
    if (!focusElement) {
      return;
    }

    // For grid navigation, always attempt to focus the target element
    // The browser will naturally handle disabled state
    // For non-grid navigation, skip to next focusable element
    if (this.direction !== 'grid' && !this.isFocusableElement(focusElement)) {
      this.#setCurrentIndexCircularly(1);
      focusElement = this.elements[this.currentIndex];
    }

    if (focusElement) {
      focusElement.focus(options);
    }
  }

  focusToElement(element: T): void;
  focusToElement(elementIndex: number): void;

  focusToElement(elementOrIndex: T | number): void {
    this.currentIndex = typeof elementOrIndex === 'number' ? elementOrIndex : this.elements.indexOf(elementOrIndex);
    this.elementEnterAction(this.elements[this.currentIndex]);
    this.focus({ preventScroll: false });

    // Update tabindex and autofocus when navigating while focused
    if (this.focused) {
      this.elements.forEach((el, idx) => {
        if (idx === this.currentIndex) {
          el.tabIndex = 0;
          if (this.#autofocus) {
            el.setAttribute('autofocus', '');
          }
        } else {
          el.tabIndex = -1;
          if (this.#autofocus) {
            el.removeAttribute('autofocus');
          }
        }
      });
    }
  }

  clearElementCache(): void {
    cancelAnimationFrame(this.#manageIndexesAnimationFrame);
    this.#cachedElements = undefined;
    if (!this.#managed) return;

    this.#manageIndexesAnimationFrame = requestAnimationFrame(() => this.#manageTabindexes());
  }

  manage(): void {
    this.#managed = true;
    this.#manageTabindexes();
    this.#addEventListeners();

    if (this.focused) {
      this.#hostContainsFocus();
    }
  }

  unmanage(): void {
    this.#managed = false;
    this.#updateTabindexes(() => ({ tabIndex: 0 }));
    this.#removeEventListeners();
  }

  // Navigation and focus management
  #setCurrentIndexCircularly(diff: number): void {
    const { length } = this.elements;

    // If wrap is disabled, check boundaries
    if (!this.#wrap) {
      const nextIndex = this.currentIndex + diff;

      // Handle boundary conditions without wrapping
      if (nextIndex < 0 || nextIndex >= length) {
        return; // Don't move focus
      }

      // Find next focusable element without wrapping
      let steps = Math.abs(diff);
      let currentPos = this.currentIndex;

      while (steps > 0) {
        const testIndex = currentPos + (diff > 0 ? 1 : -1);

        // Stop if we hit the boundary
        if (testIndex < 0 || testIndex >= length) {
          return;
        }

        currentPos = testIndex;

        // Only count down if element is focusable
        if (this.elements[currentPos] && this.isFocusableElement(this.elements[currentPos])) {
          steps -= 1;
        }
      }

      this.focusToElement(currentPos);
      return;
    }

    // Original wrapping behavior
    let steps = length;
    let nextIndex = (length + this.currentIndex + diff) % length;
    while (steps && this.elements[nextIndex] && !this.isFocusableElement(this.elements[nextIndex])) {
      nextIndex = (length + nextIndex + diff) % length;
      steps -= 1;
    }
    this.focusToElement(nextIndex);
  }

  // Internal focus state management
  #hostContainsFocus(): void {
    const scope = this.#scope();
    scope.addEventListener('focusout', this.#onFocusout);
    scope.addEventListener('keydown', this.#onKeydown);
    this.focused = true;
  }

  #hostNoLongerContainsFocus(): void {
    const scope = this.#scope();
    scope.addEventListener('focusin', this.#onFocusin);
    scope.removeEventListener('focusout', this.#onFocusout);
    scope.removeEventListener('keydown', this.#onKeydown);
    this.currentIndex = this.focusInIndex;
    this.focused = false;
  }

  #isFocusMovingOutOfScope(event: FocusEvent): boolean {
    const relatedTarget = event.relatedTarget as null | Element;

    if (event.type === 'focusin') {
      return false;
    } else if (event.type === 'focusout' && relatedTarget === null) {
      return true;
    } else {
      return !this.elements.includes(relatedTarget as T) || !this.elements.includes(event.composedPath()[0] as T);
    }
  }

  // Event handlers
  #onFocusin = (event: FocusEvent): void => {
    if (!this.#isFocusMovingOutOfScope(event)) {
      this.#hostContainsFocus();
    }
    const path = event.composedPath() as T[];
    let targetIndex = -1;
    path.find(el => {
      targetIndex = this.elements.indexOf(el);
      return targetIndex !== -1;
    });
    this.currentIndex = targetIndex > -1 ? targetIndex : this.currentIndex;
  };

  #onFocusout = (event: FocusEvent): void => {
    if (this.#isFocusMovingOutOfScope(event)) {
      this.#hostNoLongerContainsFocus();
    }
  };

  #acceptsEventKey(key: string): boolean {
    if (key === 'End' || key === 'Home') {
      return true;
    }
    switch (this.direction) {
      case 'horizontal':
        return key === 'ArrowLeft' || key === 'ArrowRight';
      case 'vertical':
        return key === 'ArrowUp' || key === 'ArrowDown';
      case 'both':
      case 'grid':
        return key.startsWith('Arrow');
    }
  }

  #onKeydown = (event: KeyboardEvent): void => {
    if (!this.#acceptsEventKey(event.key) || event.defaultPrevented) {
      return;
    }

    let diff = 0;
    switch (event.key) {
      case 'ArrowRight':
        diff += 1;
        break;
      case 'ArrowDown':
        diff += this.direction === 'grid' ? this.#directionLength() : 1;
        break;
      case 'ArrowLeft':
        diff -= 1;
        break;
      case 'ArrowUp':
        diff -= this.direction === 'grid' ? this.#directionLength() : 1;
        break;
      case 'End':
        this.currentIndex = 0;
        diff -= 1;
        break;
      case 'Home':
        this.currentIndex = this.elements.length - 1;
        diff += 1;
        break;
    }
    event.preventDefault();

    // For grid navigation, directly move to target position without wrapping or skipping
    if (this.direction === 'grid') {
      const targetIndex = this.currentIndex + diff;
      if (targetIndex < 0) {
        this.focusToElement(0);
      } else if (targetIndex >= this.elements.length) {
        this.focusToElement(this.elements.length - 1);
      } else {
        this.focusToElement(targetIndex);
      }
    } else {
      this.#setCurrentIndexCircularly(diff);
    }
  };

  // Tabindex management
  #manageTabindexes(): void {
    if (this.focused) {
      this.#updateTabindexes(() => ({ tabIndex: -1 }));
    } else {
      // Find the first focusable element for tabindex=0
      let focusableElement = this.focusInElement;
      if (!this.isFocusableElement(focusableElement)) {
        const focusableIndex = this.elements.findIndex(el => this.isFocusableElement(el));
        if (focusableIndex !== -1) {
          focusableElement = this.elements[focusableIndex];
        }
      }

      this.#updateTabindexes((el: HTMLElement): UpdateTabIndexes => {
        return {
          removeTabIndex: el.contains(focusableElement) && el !== focusableElement,
          tabIndex: el === focusableElement ? 0 : -1
        };
      });
    }
  }

  #updateTabindexes(getTabIndex: (el: HTMLElement) => UpdateTabIndexes): void {
    this.elements.forEach(el => {
      const { tabIndex, removeTabIndex } = getTabIndex(el);
      if (!removeTabIndex) {
        el.tabIndex = tabIndex;

        // Manage autofocus attribute
        if (this.#autofocus) {
          if (tabIndex === 0 && !this.focused) {
            el.setAttribute('autofocus', '');
          } else {
            el.removeAttribute('autofocus');
          }
        }

        return;
      }
      el.removeAttribute('tabindex');

      // Remove autofocus when removing tabindex
      if (this.#autofocus) {
        el.removeAttribute('autofocus');
      }

      const updatable = el as unknown as {
        requestUpdate?(): void;
      };
      if (updatable.requestUpdate) updatable.requestUpdate();
    });
  }

  // Event listener management
  #addEventListeners(): void {
    this.#scope().addEventListener('focusin', this.#onFocusin);
  }

  #removeEventListeners(): void {
    const scope = this.#scope();

    scope.removeEventListener('focusin', this.#onFocusin);
    scope.removeEventListener('focusout', this.#onFocusout);
    scope.removeEventListener('keydown', this.#onKeydown);
  }
}
