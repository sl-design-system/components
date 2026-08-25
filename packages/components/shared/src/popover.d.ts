type Alignment = 'start' | 'end';
type Side = 'top' | 'right' | 'bottom' | 'left';
type AlignedPlacement = `${Side}-${Alignment}`;
export type PopoverPosition = Side | AlignedPlacement;
export interface PositionPopoverOptions {
  arrowElement?: string | HTMLElement;
  arrowPadding?: number;
  maxWidth?: number;
  offset?: number;
  position?: PopoverPosition;
  viewportMargin?: number;
  rootMarginTop?: number;
}
export declare const isPopoverOpen: (element?: HTMLElement) => boolean;
export declare const positionPopover: (
  element: HTMLElement,
  anchor: Element,
  options?: PositionPopoverOptions
) => () => void;
export {};
