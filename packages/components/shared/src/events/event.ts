export class SlEvent extends Event {
  constructor(type: string, eventInit?: EventInit) {
    super(type, { bubbles: true, composed: true, ...eventInit });
  }
}
