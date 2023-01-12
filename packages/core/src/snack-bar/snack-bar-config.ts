import type { TemplateResult } from 'lit';

export type SnackBarOffset = [x: number, y: number] | (() => [x: number, y: number]);

export type SnackBarPosition = 'top' | 'bottom';

export type SnackBarType = 'error' | 'info' | 'success';

export interface SnackBarDismissReason {
  /**
   * The reason why the snack-bar was dismissed:
   * - action: The user clicked an action button (`action` property is also set)
   * - dismiss: The user dismissed the snack-bar (either via Escape key, clicking outside the snack-bar or closing the snack-bar manually)
   * - timeout: The snack-bar timed out
   */
  reason: 'action' | 'dismiss' | 'timeout';

  /** The action label of the pressed button in the snack-bar. */
  action?: string;
}

export interface SnackBarConfig {
  /** Action label for the button in the snack-bar */
  action?: string | TemplateResult;

  /** The offset in pixels that the snacks will animate on screen from. */
  animationOffset?: number;

  /** Whether the snack-bar closes automatically. */
  autoClose?: boolean;

  /** Shows a close button if true. */
  dismissable?: boolean;

  /** The length in milliseconds that the snack-bar will be visible. */
  duration?: number;

  /**
   * Custom icon, either the name of an icon already in the registry, or
   * a custom piece of template from calling the `html` method.
   */
  icon?: string | TemplateResult;

  /** The text to be displayed in the snack-bar. */
  message: string | TemplateResult;

  /** Position of the snack-bar on the screen. */
  position?: SnackBarPosition;

  /** Offset in pixels from the root position of the snack-bar. */
  offset?: SnackBarOffset;

  /** The space in pixels between two snacks. */
  spacing?: number;

  /** Position action buttons below the message when true. */
  stacked?: boolean;

  /** The type of snack-bar; determines the icon and color */
  type?: SnackBarType;

  /** Callback with snack-bar result reason */
  hideResultCallback?: (reason: SnackBarDismissReason) => void;
}
