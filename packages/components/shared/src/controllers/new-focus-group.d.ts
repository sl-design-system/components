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
export declare class NewFocusGroupController<T extends HTMLElement> implements ReactiveController {
  #private;
  elementEnterAction: (_el: T) => void;
  isFocusableElement: (el: T) => boolean;
  get currentIndex(): number;
  set currentIndex(currentIndex: number);
  get direction(): DirectionTypes;
  set directionLength(directionLength: number);
  get elements(): T[];
  get focused(): boolean;
  set focused(focused: boolean);
  get focusInElement(): T;
  get focusInIndex(): number;
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
    }?: NewFocusGroupConfig<T>
  );
  hostConnected(): void;
  hostDisconnected(): void;
  hostUpdated(): void;
  update({ elements, wrap }?: NewFocusGroupConfig<T>): void;
  focus(options?: FocusOptions): void;
  focusToElement(element: T): void;
  focusToElement(elementIndex: number): void;
  clearElementCache(): void;
  manage(): void;
  unmanage(): void;
}
export {};
