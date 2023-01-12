import type { SnackBarConfig, SnackBarDismissReason } from './snack-bar-config.js';

export class SnackBar {
  /** The snack-bar defaults. */
  static defaults: Partial<SnackBarConfig> = {
    animationOffset: 80,
    autoClose: true,
    duration: 5000,
    spacing: 16,
    position: 'top',
    type: 'info'
  };

  async show(config: SnackBarConfig): Promise<SnackBarDismissReason> {
    return new Promise(resolve => {
      config = { ...SnackBar.defaults, ...config, hideResultCallback: resolve };
      console.log(config.message);
      document.dispatchEvent(new CustomEvent('snack-bar-show', { detail: config }));
    });
  }

  // show(): void {
  //   console.log('heee');
  // }

  // async info(message: string, config?: Omit<SnackBarConfig, 'message'>): Promise<SnackBarDismissReason> {
  //   return this.show({ message, type: 'info', ...config });
  // }

  // async error(message: string, config?: Omit<SnackBarConfig, 'message'>): Promise<SnackBarDismissReason> {
  //   return this.show({ message, type: 'error', ...config });
  // }

  // async success(message: string, config?: Omit<SnackBarConfig, 'message'>): Promise<SnackBarDismissReason> {
  //   return this.show({ message, type: 'success', ...config });
  // }
}

/** Export singleton instance. */
export const snackBar = new SnackBar();
