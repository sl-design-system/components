import { RangeChangedEvent } from '@lit-labs/virtualizer';
import { type ReactiveController, type ReactiveElement } from 'lit';

type DirectionTypes = 'horizontal' | 'vertical' | 'both' | 'grid';

export type FocusGroupConfig<T> = {
  focusInIndex?(elements: T[]): number;
  direction?: DirectionTypes | (() => DirectionTypes);
  directionLength?: number;
  elementEnterAction?(el: T): void;
  elements(): T[];
  isFocusableElement?(el: T): boolean;
  listenerScope?: HTMLElement | (() => HTMLElement);
};

export class FocusGroupController<T extends HTMLElement> implements ReactiveController {
  #currentIndex = -1;
  #direction = (): DirectionTypes => 'both';
  #directionLength = (): number => 1;
  #elements: () => T[];
  #focused = false;
  #focusInIndex = (_elements: T[]): number => 0;
  #listenerScope = (): HTMLElement => this.host;

  protected cachedElements?: T[];

  get currentIndex(): number {
    if (this.#currentIndex === -1) {
      this.#currentIndex = this.focusInIndex;
    }

    return this.#currentIndex - this.offset * this.#directionLength();
  }

  set currentIndex(currentIndex) {
    this.#currentIndex = currentIndex + this.offset * this.#directionLength();
  }

  set directionLength(directionLength: number) {
    this.#directionLength = () => directionLength;
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

  host: ReactiveElement;

  isFocusableElement = (_el: T): boolean => true;

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
      directionLength,
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

  updateWithVirtualizer({ elements }: FocusGroupConfig<T> = { elements: () => [] }, event: RangeChangedEvent): void {
    this.unmanage();
    this.#elements = elements;
    this.clearElementCache(event.first);
    this.manage();
  }

  focus(options?: FocusOptions): void {
    let focusElement = this.elements[this.currentIndex];
    console.log(focusElement);
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
    // this.currentIndex = nextIndex;
    this.focusToElement(nextIndex);
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

  isRelatedTargetAnElement(event: FocusEvent): boolean {
    const relatedTarget = event.relatedTarget as null | Element;
    return !this.elements.includes(relatedTarget as T);
  }

  handleFocusin = (event: FocusEvent): void => {
    if (!this.isEventWithinListenerScope(event)) return;
    if (this.isRelatedTargetAnElement(event)) {
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
    if (this.isRelatedTargetAnElement(event)) {
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
    //TODO: the first rows that are out of view have not yet been removed from the 'elements' list, but the index already takes the offset into account.
    // console.log({
    //   current: this.currentIndex + ' - row: ' + this.currentIndex / this.#directionLength(),
    //   next:
    //     this.currentIndex +
    //     diff +
    //     ' - row: ' +
    //     (this.currentIndex + diff - this.offset * this.#directionLength()) / this.#directionLength(),
    //   offset: this.offset,
    //   totalNumberOfElements: this.elements[0].textContent
    // });

    //todo take offset into account
    if (this.direction === 'grid' && this.currentIndex + diff < 0) {
      // this.currentIndex = 0;
      this.focusToElement(0);
    } else if (this.direction === 'grid' && this.currentIndex + diff > this.elements.length - 1) {
      // this.currentIndex = ;
      this.focusToElement(this.elements.length - 1);
    } else {
      this.setCurrentIndexCircularly(diff);
    }
    // To allow the `focusInIndex` to be calculated with the "after" state of the keyboard interaction
    // do `elementEnterAction` _before_ focusing the next element.
    // this.elementEnterAction(this.elements[this.currentIndex + this.offset * this.#directionLength()]);
    // this.focus();
  };

  manage(): void {
    this.addEventListeners();
    if (this.focused) {
      this.hostContainsFocus();
    }
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
