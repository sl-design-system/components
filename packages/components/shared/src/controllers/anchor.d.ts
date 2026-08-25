import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type PopoverPosition, type PositionPopoverOptions } from '../popover.js';
export type AnchorControllerConfig = PositionPopoverOptions;
export declare class AnchorController implements ReactiveController {
  #private;
  /** The arrow pointing from the popover to the anchor element. */
  arrowElement?: string | HTMLElement;
  /** The padding of the arrow. */
  arrowPadding?: number;
  /** The offset of the popover to its anchor. */
  offset?: number;
  /** The max width of the popover. */
  maxWidth?: number;
  /** The main position of the popover relative to the anchor. */
  position?: PopoverPosition;
  constructor(host: ReactiveControllerHost & HTMLElement, config?: AnchorControllerConfig);
  hostConnected(): void;
  hostDisconnected(): void;
  updatePosition(): void;
}
