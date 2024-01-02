declare global {
  interface GlobalEventHandlersEventMap {
    'sl-form-field': FormFieldEvent;
  }
}

/**
 * Emits when a form field is added or removed to/from a form.
 *
 * @event sl-form-field
 * @type FormFieldEvent
 * @property state - The state of the form field (add or remove)
 */
export class FormFieldEvent extends Event {
  constructor(public state: 'add' | 'remove') {
    super('sl-form-field', { bubbles: true, composed: true });
  }
}
