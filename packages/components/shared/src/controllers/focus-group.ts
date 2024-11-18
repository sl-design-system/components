import { type ReactiveController, type ReactiveElement } from 'lit';

type DirectionTypes = 'horizontal' | 'vertical' | 'both' | 'grid';

export type FocusGroupConfig<T> = {
  focusInIndex?(elements: T[]): number;
  direction?: DirectionTypes | (() => DirectionTypes);
  elementEnterAction?(el: T): void;
  elements(): T[];
  isFocusableElement?(el: T): boolean;
  listenerScope?: HTMLElement | (() => HTMLElement);
};

export class FocusGroupController<T extends HTMLElement> implements ReactiveController {
  #currentIndex = -1;
  #direction = (): DirectionTypes => 'both';
  #elements: () => T[];
  #focused = false;
  #focusInIndex = (_elements: T[]): number => 0;
  #listenerScope = (): HTMLElement => this.host;

  protected cachedElements?: T[];

  get currentIndex(): number {
    if (this.#currentIndex === -1) {
      this.#currentIndex = this.focusInIndex;
    }

    return this.#currentIndex - this.offset;
  }

  set currentIndex(currentIndex) {
    this.#currentIndex = currentIndex + this.offset;
  }

  get direction(): DirectionTypes {
    return this.#direction();
  }

  get elements(): T[] {
    if (!this.cachedElements) {
      this.cachedElements = this.#elements();
    }

    return this.cachedElements;
  }

  elementEnterAction = (_el: T): void => {
    return;
  };

  protected get focused(): boolean {
    return this.#focused;
  }

  protected set focused(focused: boolean) {
    if (focused === this.focused) return;
    this.#focused = focused;
  }

  get focusInElement(): T {
    return this.elements[this.focusInIndex];
  }

  get focusInIndex(): number {
    return this.#focusInIndex(this.elements);
  }

  directionLength = 5;

  host: ReactiveElement;

  isFocusableElement = (el: T): boolean => !el.hasAttribute('disabled');

  isEventWithinListenerScope(event: Event): boolean {
    if (this.#listenerScope() === this.host) return true;
    return event.composedPath().includes(this.#listenerScope());
  }

  // When elements are virtualized, the delta between the first element and the first rendered element.
  offset = 0;

  constructor(
    host: ReactiveElement,
    {
      direction,
      elementEnterAction,
      elements,
      focusInIndex,
      isFocusableElement,
      listenerScope
    }: FocusGroupConfig<T> = { elements: () => [] }
  ) {
    this.host = host;
    this.host.addController(this);

    if (typeof direction === 'string') {
      this.#direction = () => direction;
    } else if (typeof direction === 'function') {
      this.#direction = direction;
    }

    this.#elements = elements;
    this.elementEnterAction = elementEnterAction || this.elementEnterAction;

    if (typeof focusInIndex === 'number') {
      this.#focusInIndex = () => focusInIndex;
    } else if (typeof focusInIndex === 'function') {
      this.#focusInIndex = focusInIndex;
    }

    this.isFocusableElement = isFocusableElement || this.isFocusableElement;

    if (typeof listenerScope === 'object') {
      this.#listenerScope = () => listenerScope;
    } else if (typeof listenerScope === 'function') {
      this.#listenerScope = listenerScope as () => HTMLElement;
    }
  }

  hostConnected(): void {
    this.addEventListeners();
  }

  hostDisconnected(): void {
    this.removeEventListeners();
  }

  update({ elements }: FocusGroupConfig<T> = { elements: () => [] }): void {
    this.unmanage();
    this.#elements = elements;
    this.clearElementCache();
    this.manage();
  }

  focus(options?: FocusOptions): void {
    let focusElement = this.elements[this.currentIndex];
    if (!focusElement || !this.isFocusableElement(focusElement)) {
      this.setCurrentIndexCircularly(1);
      focusElement = this.elements[this.currentIndex];
    }
    if (focusElement && this.isFocusableElement(focusElement)) {
      focusElement.focus(options);
    }
  }

  focusToElement(elementIndex: number): void {
    this.currentIndex = elementIndex;
    this.elementEnterAction(this.elements[this.currentIndex]);
    this.focus({ preventScroll: false });
  }

  clearElementCache(offset = 0): void {
    delete this.cachedElements;
    this.offset = offset;
  }

  setCurrentIndexCircularly(diff: number): void {
    const { length } = this.elements;
    let steps = length;
    // start at a possibly not 0 index
    let nextIndex = (length + this.currentIndex + diff) % length;
    while (
      // don't cycle the elements more than once
      steps &&
      this.elements[nextIndex] &&
      !this.isFocusableElement(this.elements[nextIndex])
    ) {
      nextIndex = (length + nextIndex + diff) % length;
      steps -= 1;
    }
    this.currentIndex = nextIndex;
  }

  hostContainsFocus(): void {
    this.host.addEventListener('focusout', this.handleFocusout);
    this.host.addEventListener('keydown', this.handleKeydown);
    this.focused = true;
  }

  hostNoLongerContainsFocus(): void {
    this.host.addEventListener('focusin', this.handleFocusin);
    this.host.removeEventListener('focusout', this.handleFocusout);
    this.host.removeEventListener('keydown', this.handleKeydown);
    this.currentIndex = this.focusInIndex;
    this.focused = false;
  }

  isFocusMovingOutOfScope(event: FocusEvent): boolean {
    const relatedTarget = event.relatedTarget as null | Element;

    if (event.type === 'focusin') {
      return false;
    } else if (event.type === 'focusout' && relatedTarget === null) {
      return true;
    } else {
      return !this.elements.includes(relatedTarget as T) || !this.elements.includes(event.composedPath()[0] as T);
    }
  }

  handleFocusin = (event: FocusEvent): void => {
    console.log('this.isFocusMovingOutOfScope(event)', this.isFocusMovingOutOfScope(event), event);
    if (!this.isEventWithinListenerScope(event)) return;
    if (!this.isFocusMovingOutOfScope(event)) {
      this.hostContainsFocus();
    }
    const path = event.composedPath() as T[];
    let targetIndex = -1;
    path.find(el => {
      targetIndex = this.elements.indexOf(el);
      return targetIndex !== -1;
    });
    this.currentIndex = targetIndex > -1 ? targetIndex : this.currentIndex;
  };

  handleFocusout = (event: FocusEvent): void => {
    if (this.isFocusMovingOutOfScope(event)) {
      this.hostNoLongerContainsFocus();
    }
  };

  acceptsEventCode(code: string): boolean {
    if (code === 'End' || code === 'Home') {
      return true;
    }
    switch (this.direction) {
      case 'horizontal':
        return code === 'ArrowLeft' || code === 'ArrowRight';
      case 'vertical':
        return code === 'ArrowUp' || code === 'ArrowDown';
      case 'both':
      case 'grid':
        return code.startsWith('Arrow');
    }
  }

  handleKeydown = (event: KeyboardEvent): void => {
    if (!this.acceptsEventCode(event.code) || event.defaultPrevented) {
      return;
    }

    let diff = 0;
    switch (event.code) {
      case 'ArrowRight':
        diff += 1;
        break;
      case 'ArrowDown':
        diff += this.direction === 'grid' ? this.directionLength : 1;
        break;
      case 'ArrowLeft':
        diff -= 1;
        break;
      case 'ArrowUp':
        diff -= this.direction === 'grid' ? this.directionLength : 1;
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
    if (this.direction === 'grid' && this.currentIndex + diff < 0) {
      this.currentIndex = 0;
    } else if (this.direction === 'grid' && this.currentIndex + diff > this.elements.length - 1) {
      this.currentIndex = this.elements.length - 1;
    } else {
      this.setCurrentIndexCircularly(diff);
    }
    // To allow the `focusInIndex` to be calculated with the "after" state of the keyboard interaction
    // do `elementEnterAction` _before_ focusing the next element.
    this.elementEnterAction(this.elements[this.currentIndex]);
    this.focus();
  };

  manage(): void {
    this.addEventListeners();
  }

  unmanage(): void {
    this.removeEventListeners();
  }

  addEventListeners(): void {
    this.host.addEventListener('focusin', this.handleFocusin);
  }

  removeEventListeners(): void {
    this.host.removeEventListener('focusin', this.handleFocusin);
    this.host.removeEventListener('focusout', this.handleFocusout);
    this.host.removeEventListener('keydown', this.handleKeydown);
  }
}
