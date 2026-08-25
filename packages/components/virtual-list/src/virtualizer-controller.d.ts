import { Virtualizer, type VirtualizerOptions } from '@tanstack/virtual-core';
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
export type VirtualizerControllerOptions<
  TScrollElement extends Element | Window,
  TItemElement extends Element
> = Omit<
  VirtualizerOptions<TScrollElement, TItemElement>,
  'getScrollElement' | 'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;
/**
 * A reactive controller that manages virtualization using @tanstack/virtual-core. This controller
 * integrates TanStack Virtual with Lit's reactive update cycle.
 */
export declare class VirtualizerController<
  TScrollElement extends Element | Window,
  TItemElement extends Element
> implements ReactiveController {
  #private;
  /** Get the virtualizer instance. */
  get instance(): Virtualizer<Element, TItemElement> | Virtualizer<Window, TItemElement>;
  constructor(
    host: ReactiveControllerHost & HTMLElement,
    options: VirtualizerControllerOptions<TScrollElement, TItemElement>
  );
  hostConnected(): void;
  hostUpdate(): void;
  hostDisconnected(): void;
  updateOptions(options: Partial<VirtualizerControllerOptions<TScrollElement, TItemElement>>): void;
}
