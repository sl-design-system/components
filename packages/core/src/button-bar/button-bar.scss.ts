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
    --align: flex-start;
    --direction: row;
    --gap-h: 1rem;
    --gap-v: 0.5rem;
  }

  :host {
    align-items: center;
    display: flex;
    flex-direction: var(--direction);
    flex-wrap: wrap;
    gap: var(--gap-v) var(--gap-h);
    justify-content: var(--align);
  }

  :host([align='center']) {
    --align: center;
  }

  :host([align='end']) {
    --align: flex-end;
  }

  :host([align='space-between']) {
    --align: space-between;
  }

  :host([icon-only]) {
    --gap-h: 0.5rem;
    --gap-v: 0.25rem;
  }

  :host([reverse]) {
    --direction: row-reverse;
  }
`;
