import { css } from 'lit';

export default css`
  :host {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  :host {
    --_align: flex-start;
    --_direction: row;
    --gap-h: 1rem;
    --gap-v: 0.5rem;
  }

  :host {
    align-items: center;
    display: flex;
    flex-direction: var(--_direction);
    flex-wrap: wrap;
    gap: var(--gap-v) var(--gap-h);
    justify-content: var(--_align);
  }

  :host([align='center']) {
    --_align: center;
  }

  :host([align='end']) {
    --_align: flex-end;
  }

  :host([align='space-between']) {
    --_align: space-between;
  }

  :host([icon-only]) {
    --gap-h: 0.5rem;
    --gap-v: 0.25rem;
  }

  :host([reverse]) {
    --_direction: row-reverse;
  }
`;
