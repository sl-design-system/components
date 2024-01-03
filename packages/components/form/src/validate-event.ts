/**
 * Emits when the form control can be validated.
 *
 * @event sl-validate
 * @type ValidateEvent
 */
export class ValidateEvent extends Event {
  constructor() {
    super('sl-validate', { bubbles: true, composed: true });
  }
}
