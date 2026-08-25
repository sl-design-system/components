export class FocusGroupController {
  constructor(
    host,
    {
      direction,
      directionLength,
      elementEnterAction,
      elements,
      focusInIndex,
      isFocusableElement,
      listenerScope
    } = { elements: () => [] }
  ) {
    this.#currentIndex = -1;
    this.#direction = () => 'both';
    this.#directionLength = () => 1;
    this.#focused = false;
    this.#focusInIndex = _elements => 0;
    this.#listenerScope = () => this.host;
    this.elementEnterAction = _el => {
      return;
    };
    this.isFocusableElement = el => !el.hasAttribute('disabled');
    // When elements are virtualized, the delta between the first element and the first rendered element.
    this.offset = 0;
    this.handleFocusin = event => {
      if (!this.isEventWithinListenerScope(event)) return;
      if (!this.isFocusMovingOutOfScope(event)) {
        this.hostContainsFocus();
      }
      const path = event.composedPath();
      let targetIndex = -1;
      path.find(el => {
        targetIndex = this.elements.indexOf(el);
        return targetIndex !== -1;
      });
      this.currentIndex = targetIndex > -1 ? targetIndex : this.currentIndex;
    };
    this.handleFocusout = event => {
      if (this.isFocusMovingOutOfScope(event)) {
        this.hostNoLongerContainsFocus();
      }
    };
    this.handleKeydown = event => {
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
      if (this.direction === 'grid' && this.currentIndex + diff < 0) {
        this.focusToElement(0);
      } else if (this.direction === 'grid' && this.currentIndex + diff > this.elements.length - 1) {
        this.focusToElement(this.elements.length - 1);
      } else {
        this.setCurrentIndexCircularly(diff);
      }
    };
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
      this.#listenerScope = listenerScope;
    }
  }
  #currentIndex;
  #direction;
  #directionLength;
  #elements;
  #focused;
  #focusInIndex;
  #listenerScope;
  get currentIndex() {
    if (this.#currentIndex === -1) {
      this.#currentIndex = this.focusInIndex;
    }
    return this.#currentIndex - this.offset * this.#directionLength();
  }
  set currentIndex(currentIndex) {
    this.#currentIndex = currentIndex + this.offset * this.#directionLength();
  }
  set directionLength(directionLength) {
    this.#directionLength = () => directionLength;
  }
  get direction() {
    return this.#direction();
  }
  get elements() {
    if (!this.cachedElements) {
      this.cachedElements = this.#elements();
    }
    return this.cachedElements;
  }
  get focused() {
    return this.#focused;
  }
  set focused(focused) {
    if (focused === this.focused) return;
    this.#focused = focused;
  }
  get focusInElement() {
    return this.elements[this.focusInIndex];
  }
  get focusInIndex() {
    return this.#focusInIndex(this.elements);
  }
  isEventWithinListenerScope(event) {
    if (this.#listenerScope() === this.host) return true;
    return event.composedPath().includes(this.#listenerScope());
  }
  hostConnected() {
    this.addEventListeners();
  }
  hostDisconnected() {
    this.removeEventListeners();
  }
  update({ elements } = { elements: () => [] }) {
    this.unmanage();
    this.#elements = elements;
    this.clearElementCache();
    this.manage();
  }
  updateWithVirtualizer({ elements } = { elements: () => [] }, event) {
    this.unmanage();
    this.#elements = elements;
    this.clearElementCache(event.first);
    this.manage();
  }
  focus(options) {
    let focusElement = this.elements[this.currentIndex];
    if (focusElement.matches('[part~=delegate-focus]')) {
      focusElement = focusElement.querySelector('*') ?? focusElement;
    }
    if (!focusElement || !this.isFocusableElement(focusElement)) {
      this.setCurrentIndexCircularly(1);
      focusElement = this.elements[this.currentIndex];
    }
    if (focusElement && this.isFocusableElement(focusElement)) {
      focusElement.focus(options);
    }
  }
  focusToElement(elementOrIndex) {
    this.currentIndex =
      typeof elementOrIndex === 'number' ? elementOrIndex : this.elements.indexOf(elementOrIndex);
    this.elementEnterAction(this.elements[this.currentIndex]);
    this.focus({ preventScroll: false });
  }
  clearElementCache(offset = 0) {
    delete this.cachedElements;
    this.offset = offset;
  }
  setCurrentIndexCircularly(diff) {
    const { length } = this.elements;
    let steps = length;
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
    this.focusToElement(nextIndex);
  }
  hostContainsFocus() {
    this.host.addEventListener('focusout', this.handleFocusout);
    this.host.addEventListener('keydown', this.handleKeydown);
    this.focused = true;
  }
  hostNoLongerContainsFocus() {
    this.host.addEventListener('focusin', this.handleFocusin);
    this.host.removeEventListener('focusout', this.handleFocusout);
    this.host.removeEventListener('keydown', this.handleKeydown);
    this.currentIndex = this.focusInIndex;
    this.focused = false;
  }
  isFocusMovingOutOfScope(event) {
    const relatedTarget = event.relatedTarget;
    if (event.type === 'focusin') {
      return false;
    } else if (event.type === 'focusout' && relatedTarget === null) {
      return true;
    } else {
      return (
        !this.elements.includes(relatedTarget) || !this.elements.includes(event.composedPath()[0])
      );
    }
  }
  acceptsEventCode(code) {
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
  manage() {
    this.addEventListeners();
    if (this.focused) {
      this.hostContainsFocus();
    }
  }
  unmanage() {
    this.removeEventListeners();
  }
  addEventListeners() {
    this.host.addEventListener('focusin', this.handleFocusin);
  }
  removeEventListeners() {
    this.host.removeEventListener('focusin', this.handleFocusin);
    this.host.removeEventListener('focusout', this.handleFocusout);
    this.host.removeEventListener('keydown', this.handleKeydown);
  }
}
//# sourceMappingURL=focus-group.js.map
