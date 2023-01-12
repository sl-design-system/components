import { SnackBarController } from './snack-bar-controller.js';
import { SnackBarOverlay } from './snack-bar-overlay.js';

customElements.define('sl-snack-bar-controller', SnackBarController);
customElements.define('sl-snack-bar-overlay', SnackBarOverlay);

declare global {
  interface HTMLElementTagNameMap {
    'sl-snack-bar-controller': SnackBarController;
  }
}
