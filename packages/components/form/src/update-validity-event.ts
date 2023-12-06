export class UpdateValidityEvent extends Event {
  constructor(
    public valid: boolean,
    public validationMessage: string,
    public readonly showValidity: 'valid' | 'invalid' | undefined
  ) {
    super('sl-update-validity', { bubbles: true, composed: true });
  }
}
