import { RangeChangedEvent } from '@lit-labs/virtualizer/events.js';
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
export declare class FocusGroupController<T extends HTMLElement> implements ReactiveController {
  #private;
  protected cachedElements?: T[];
  get currentIndex(): number;
  set currentIndex(currentIndex: number);
  set directionLength(directionLength: number);
  get direction(): DirectionTypes;
  get elements(): T[];
  elementEnterAction: (_el: T) => void;
  protected get focused(): boolean;
  protected set focused(focused: boolean);
  get focusInElement(): T;
  get focusInIndex(): number;
  host: ReactiveElement;
  isFocusableElement: (el: T) => boolean;
  isEventWithinListenerScope(event: Event): boolean;
  offset: number;
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
    }?: FocusGroupConfig<T>
  );
  hostConnected(): void;
  hostDisconnected(): void;
  update({ elements }?: FocusGroupConfig<T>): void;
  updateWithVirtualizer(
    { elements }: FocusGroupConfig<T> | undefined,
    event: RangeChangedEvent
  ): void;
  focus(options?: FocusOptions): void;
  focusToElement(element: T): void;
  focusToElement(elementIndex: number): void;
  clearElementCache(offset?: number): void;
  setCurrentIndexCircularly(diff: number): void;
  hostContainsFocus(): void;
  hostNoLongerContainsFocus(): void;
  isFocusMovingOutOfScope(event: FocusEvent): boolean;
  handleFocusin: (event: FocusEvent) => void;
  handleFocusout: (event: FocusEvent) => void;
  acceptsEventCode(code: string): boolean;
  handleKeydown: (event: KeyboardEvent) => void;
  manage(): void;
  unmanage(): void;
  addEventListeners(): void;
  removeEventListeners(): void;
}
export {};
