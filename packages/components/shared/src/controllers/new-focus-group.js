export class NewFocusGroupController {
  constructor(
    host,
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
    } = { elements: () => [] }
  ) {
    // Configuration
    this.#autofocus = false;
    this.#direction = () => 'both';
    this.#directionLength = () => 1;
    this.#focusInIndex = _elements => 0;
    this.#scope = () => this.#host;
    this.#wrap = false;
    this.#currentIndex = -1;
    this.#focused = false;
    this.#listenersAdded = false;
    this.#managed = true;
    this.#manageIndexesAnimationFrame = 0;
    // Public properties
    this.elementEnterAction = _el => {
      return;
    };
    this.isFocusableElement = el => !el.hasAttribute('disabled');
    // Event handlers
    this.#onFocusin = event => {
      const path = event.composedPath();
      let targetIndex = -1;
      path.find(el => {
        targetIndex = this.elements.indexOf(el);
        return targetIndex !== -1;
      });
      if (targetIndex === -1) {
        this.#cachedElements = void 0;
        path.find(el => {
          targetIndex = this.elements.indexOf(el);
          return targetIndex !== -1;
        });
      }
      this.currentIndex = targetIndex > -1 ? targetIndex : this.currentIndex;
      if (!this.#isFocusMovingOutOfScope(event) && targetIndex > -1) {
        this.#hostContainsFocus();
      }
    };
    this.#onFocusout = event => {
      if (this.#isFocusMovingOutOfScope(event)) {
        this.#hostNoLongerContainsFocus();
      }
    };
    this.#onKeydown = event => {
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
      if (this.direction === 'grid') {
        const targetIndex = this.currentIndex + diff;
        if (targetIndex < 0 || targetIndex >= this.elements.length) {
          if (this.#wrap) {
            this.#setCurrentIndexCircularly(diff);
          }
        } else {
          const targetElement = this.elements[targetIndex];
          if (this.isFocusableElement(targetElement)) {
            this.focusToElement(targetIndex);
          } else {
            const isVerticalMove = Math.abs(diff) > 1;
            if (isVerticalMove) {
              const direction = diff > 0 ? this.#directionLength() : -this.#directionLength();
              const targetColumn = targetIndex % this.#directionLength();
              let searchIndex = targetIndex + direction;
              let found = false;
              while (searchIndex >= 0 && searchIndex < this.elements.length) {
                const searchColumn = searchIndex % this.#directionLength();
                if (
                  searchColumn === targetColumn &&
                  this.isFocusableElement(this.elements[searchIndex])
                ) {
                  this.focusToElement(searchIndex);
                  found = true;
                  break;
                }
                if (searchColumn !== targetColumn) {
                  break;
                }
                searchIndex += direction;
              }
              if (!found) {
                const targetRow = Math.floor(targetIndex / this.#directionLength());
                const rowStart = targetRow * this.#directionLength();
                const rowEnd = Math.min(rowStart + this.#directionLength(), this.elements.length);
                for (let i = targetIndex + 1; i < rowEnd; i++) {
                  if (this.isFocusableElement(this.elements[i])) {
                    this.focusToElement(i);
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  for (let i = targetIndex - 1; i >= rowStart; i--) {
                    if (this.isFocusableElement(this.elements[i])) {
                      this.focusToElement(i);
                      found = true;
                      break;
                    }
                  }
                }
              }
              if (!found && this.#wrap) {
                this.#setCurrentIndexCircularly(diff);
              }
            } else {
              if (this.#wrap) {
                this.#setCurrentIndexCircularly(diff);
              } else {
                const direction = diff > 0 ? 1 : -1;
                let searchIndex = targetIndex;
                while (searchIndex >= 0 && searchIndex < this.elements.length) {
                  searchIndex += direction;
                  if (searchIndex < 0 || searchIndex >= this.elements.length) break;
                  if (this.isFocusableElement(this.elements[searchIndex])) {
                    this.focusToElement(searchIndex);
                    break;
                  }
                }
              }
            }
          }
        }
      } else {
        this.#setCurrentIndexCircularly(diff);
      }
    };
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
  #autofocus;
  #direction;
  #directionLength;
  #elements;
  #focusInIndex;
  #host;
  #scope;
  #wrap;
  // State
  #cachedElements;
  #currentIndex;
  #focused;
  #listenersAdded;
  #managed;
  #manageIndexesAnimationFrame;
  // Getters and setters
  get currentIndex() {
    if (this.#currentIndex === -1) {
      this.#currentIndex = this.focusInIndex;
    }
    return this.#currentIndex;
  }
  set currentIndex(currentIndex) {
    this.#currentIndex = currentIndex;
  }
  get direction() {
    return this.#direction();
  }
  set directionLength(directionLength) {
    this.#directionLength = () => directionLength;
  }
  get elements() {
    if (!this.#cachedElements) {
      this.#cachedElements = this.#elements();
    }
    return this.#cachedElements;
  }
  get focused() {
    return this.#focused;
  }
  set focused(focused) {
    if (focused === this.focused) return;
    this.#focused = focused;
    this.#manageTabindexes();
  }
  get focusInElement() {
    return this.elements[this.focusInIndex];
  }
  get focusInIndex() {
    return this.#focusInIndex(this.elements);
  }
  // Lifecycle methods
  hostConnected() {}
  hostDisconnected() {
    this.#removeEventListeners();
  }
  hostUpdated() {
    if (!this.#listenersAdded) {
      this.#addEventListeners();
      this.#listenersAdded = true;
    }
    if (!this.#host.hasUpdated) {
      this.#manageTabindexes();
    }
  }
  // Public API
  update({ elements, wrap } = { elements: () => [] }) {
    this.unmanage();
    this.#elements = elements;
    if (wrap !== void 0) {
      this.#wrap = wrap ?? false;
    }
    this.clearElementCache();
    this.manage();
  }
  focus(options) {
    let focusElement = this.elements[this.currentIndex];
    if (!focusElement) {
      return;
    }
    if (this.direction !== 'grid' && !this.isFocusableElement(focusElement)) {
      this.#setCurrentIndexCircularly(1);
      focusElement = this.elements[this.currentIndex];
    }
    if (focusElement) {
      focusElement.focus(options);
    }
  }
  focusToElement(elementOrIndex) {
    this.currentIndex =
      typeof elementOrIndex === 'number' ? elementOrIndex : this.elements.indexOf(elementOrIndex);
    this.elementEnterAction(this.elements[this.currentIndex]);
    this.focus({ preventScroll: false });
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
  clearElementCache() {
    cancelAnimationFrame(this.#manageIndexesAnimationFrame);
    this.#cachedElements = void 0;
    if (!this.#managed) return;
    this.#manageIndexesAnimationFrame = requestAnimationFrame(() => this.#manageTabindexes());
  }
  manage() {
    this.#managed = true;
    this.#manageTabindexes();
    this.#addEventListeners();
    if (this.focused) {
      this.#hostContainsFocus();
    }
  }
  unmanage() {
    this.#managed = false;
    this.#updateTabindexes(() => ({ tabIndex: 0 }));
    this.#removeEventListeners();
  }
  // Navigation and focus management
  #setCurrentIndexCircularly(diff) {
    const { length } = this.elements;
    if (!this.#wrap) {
      const nextIndex2 = this.currentIndex + diff;
      if (nextIndex2 < 0 || nextIndex2 >= length) {
        return;
      }
      let steps2 = Math.abs(diff);
      let currentPos = this.currentIndex;
      while (steps2 > 0) {
        const testIndex = currentPos + (diff > 0 ? 1 : -1);
        if (testIndex < 0 || testIndex >= length) {
          return;
        }
        currentPos = testIndex;
        if (this.elements[currentPos] && this.isFocusableElement(this.elements[currentPos])) {
          steps2 -= 1;
        }
      }
      this.focusToElement(currentPos);
      return;
    }
    let steps = length;
    let nextIndex = (length + this.currentIndex + diff) % length;
    while (
      steps &&
      this.elements[nextIndex] &&
      !this.isFocusableElement(this.elements[nextIndex])
    ) {
      nextIndex = (length + nextIndex + diff) % length;
      steps -= 1;
    }
    this.focusToElement(nextIndex);
  }
  // Internal focus state management
  #hostContainsFocus() {
    const scope = this.#scope();
    scope.addEventListener('focusout', this.#onFocusout);
    scope.addEventListener('keydown', this.#onKeydown);
    this.focused = true;
  }
  #hostNoLongerContainsFocus() {
    const scope = this.#scope();
    scope.addEventListener('focusin', this.#onFocusin);
    scope.removeEventListener('focusout', this.#onFocusout);
    scope.removeEventListener('keydown', this.#onKeydown);
    this.currentIndex = this.focusInIndex;
    this.focused = false;
  }
  #isFocusMovingOutOfScope(event) {
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
  #onFocusin;
  #onFocusout;
  #onKeydown;
  #acceptsEventKey(key) {
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
  // Tabindex management
  #manageTabindexes() {
    if (this.focused) {
      const activeElement = this.elements[this.currentIndex] ?? this.focusInElement;
      this.#updateTabindexes(el => ({ tabIndex: el === activeElement ? 0 : -1 }));
    } else {
      let focusableElement = this.focusInElement;
      if (!this.isFocusableElement(focusableElement)) {
        const focusableIndex = this.elements.findIndex(el => this.isFocusableElement(el));
        if (focusableIndex !== -1) {
          focusableElement = this.elements[focusableIndex];
        }
      }
      this.#updateTabindexes(el => {
        return {
          removeTabIndex: el.contains(focusableElement) && el !== focusableElement,
          tabIndex: el === focusableElement ? 0 : -1
        };
      });
    }
  }
  #updateTabindexes(getTabIndex) {
    this.elements.forEach(el => {
      const { tabIndex, removeTabIndex } = getTabIndex(el);
      if (!removeTabIndex) {
        el.tabIndex = tabIndex;
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
      if (this.#autofocus) {
        el.removeAttribute('autofocus');
      }
      const updatable = el;
      if (updatable.requestUpdate) {
        updatable.requestUpdate();
      }
    });
  }
  // Event listener management
  #addEventListeners() {
    this.#scope().addEventListener('focusin', this.#onFocusin);
  }
  #removeEventListeners() {
    const scope = this.#scope();
    scope.removeEventListener('focusin', this.#onFocusin);
    scope.removeEventListener('focusout', this.#onFocusout);
    scope.removeEventListener('keydown', this.#onKeydown);
    this.#listenersAdded = false;
  }
}
//# sourceMappingURL=new-focus-group.js.map
