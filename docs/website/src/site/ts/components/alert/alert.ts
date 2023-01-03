import type { TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LitElement, css, html } from 'lit';

@customElement('ds-alert')
export class Alert extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      padding: 10px;
      background: lightgray;
    }
    .planet {
      color: var(--planet-color, blue);
    }
  `;

  greeting = 'Hello';
  planet = 'World';
  @property({ type: Number }) count = 0;

  @property({ reflect: true }) variant: 'success' | 'danger' | 'success-small' | 'danger-small' = 'success';

  override render(): TemplateResult {
    return html`
      <span @click=${() => this.count++}
        >This is alert component ${this.greeting} ${this.variant}
        <span @click=${this.togglePlanet} class="planet">${this.planet}</span>
      </span>
      <div>Count: ${this.count}</div>
    `;
  }

  togglePlanet(): void {
    this.planet = this.planet === 'World' ? 'Mars' : 'World';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-alert': Alert;
  }
}
