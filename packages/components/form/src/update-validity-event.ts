import type { FormControlShowValidity } from './form-control-mixin.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-update-validity': UpdateValidityEvent;
  }
}

/**
 * Emits when the validity of the form control changes.
 *
 * @event sl-update-validity
 * @type UpdateValidityEvent
 * @property valid - The validity state of the element
 * @property validationMessage - The validation message of the element
 * @property showValidity - What kind of validity should be shown to the user
 */
export class UpdateValidityEvent extends Event {
  constructor(
    public valid: boolean,
    public validationMessage: string,
    public readonly showValidity: FormControlShowValidity
  ) {
    super('sl-update-validity', { bubbles: true, composed: true });
  }
}
