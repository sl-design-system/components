import type { ReactiveController, ReactiveControllerHost } from 'lit';

export class FormBuilder implements ReactiveController {
  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  hostConnected(): void {
    console.log('hostConnected');
  }
}
