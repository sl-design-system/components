import type { TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LitElement, css, html } from 'lit';

@customElement('ds-test-element')
export class TestElement extends LitElement {
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

  override render(): TemplateResult {
    return html`
      <span @click=${() => this.count++}
        >${this.greeting}
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
    'ds-test-element': TestElement;
  }
}
