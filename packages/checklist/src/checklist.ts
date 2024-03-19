import { faCircleCheck, faCircleExclamation } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './checklist.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'slds-checklist': Checklist;
  }
}

interface ChecklistItem {
  correct: boolean;
  title: string;
  description: string;
}

Icon.register(faCircleCheck, faCircleExclamation);

/**
 * A component to check if the SL Design System has been installed correctly.
 */
export class Checklist extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The items in the list. */
  @state() items: ChecklistItem[] = [];

  override firstUpdated(): void {
    // Delay the check to the next frame after first render to
    // give the application time to initialize.
    requestAnimationFrame(() => this.check());
  }

  override render(): TemplateResult {
    return html`
      <h1>SL Design System Checklist</h1>
      <p>
        Welcome to the Sanoma Learning Design System. You will find a checklist below of the steps described in our
        <a href="#" target="_blank">getting started for developers guide</a>.
      </p>

      ${this.items.map(
        item => html`
          <details .open=${!item.correct}>
            <summary @click=${(event: Event) => event.preventDefault()}>
              <sl-icon .name=${item.correct ? 'far-circle-check' : 'far-circle-exclamation'} size="xl"></sl-icon>
              ${item.title}
            </summary>
            <p>${item.description}</p>
          </details>
        `
      )}

      <p>
        Id reprehenderit cupidatat veniam nisi consequat ad elit. In fugiat commodo aliqua excepteur incididunt. Culpa
        qui ex qui irure quis Lorem veniam minim ex sint. Excepteur aliqua pariatur exercitation nostrud minim cupidatat
        eiusmod.
      </p>
    `;
  }

  check(): void {
    this.items = [
      {
        correct: this.#checkTheme(),
        title: 'CSS Custom Properties present',
        description:
          'Nulla fugiat adipisicing anim veniam consequat irure sint consequat duis anim velit tempor aliquip. Culpa sint proident qui quis adipisicing quis. Deserunt aliqua fugiat amet anim ex anim. Excepteur eu irure cillum qui. Eiusmod excepteur aute occaecat ullamco cupidatat. Dolor qui labore magna non non adipisicing.'
      },
      {
        correct: this.#checkFonts(),
        title: 'Webfonts are available',
        description: 'Consectetur ex adipisicing elit irure nulla fugiat officia voluptate tempor sunt ut dolor.'
      },
      {
        correct: this.#checkIcons(),
        title: 'Theme is set up correctly',
        description: 'Laborum anim proident qui Lorem.'
      },
      {
        correct: this.#checkButton(),
        title: 'Button web component is loaded',
        description: 'Eiusmod esse occaecat ad amet cupidatat elit exercitation sit.'
      }
    ];
  }

  #checkButton(): boolean {
    return true;
  }

  #checkFonts(): boolean {
    return true;
  }

  #checkIcons(): boolean {
    return true;
  }

  #checkTheme(): boolean {
    return false;
  }
}
