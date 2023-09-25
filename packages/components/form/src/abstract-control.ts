import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { DirectiveResult } from 'lit/directive';

export abstract class AbstractControl implements ReactiveController {
  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  hostConnected(): void {
    console.log('hostConnected');
  }

  abstract bind(name: string): DirectiveResult;
}
