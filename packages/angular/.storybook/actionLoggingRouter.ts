import { action } from '@storybook/addon-actions';
import { Router } from '@angular/router';

export class ActionLoggingRouter extends Router {
  override navigate(commands: unknown, extras: unknown) {
    action('[router] navigate')({ commands, extras });
    return Promise.resolve(true);
  }

  override navigateByUrl(url: unknown, extras: unknown) {
    action('[router] navigateByUrl')({ url, extras });
    return Promise.resolve(true);
  }
}
