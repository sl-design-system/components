import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { FormControlInterface } from '../utils/mixins/index.js';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Button } from '../button/index.js';
import { Input } from '../input/index.js';
import { Textarea } from '../textarea/index.js';
import styles from './label.scss.js';

export type LabelSize = 'sm' | 'md' | 'lg';

export class Label extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The actual form control id this label links to. */
  #formControlId?: string;

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  /** Observe the form control for changes to the required attribute. */
  #observer = new MutationObserver(() => void this.#update());

  /** The DOM id of the form control this is linked to. */
  @property() for?: string;

  /** The associated form control. */
  @state() formControl: (HTMLElement & FormControlInterface) | null = null;

  /** Whether this label should be marked as optional. */
  @state() optional?: boolean;

  /** Whether this label should be marked as required. */
  @state() required?: boolean;

  // /** Whether this label should have an (info) icon. */
  // @property({ reflect: true }) info?: boolean;

  /** Label size. */
  @property({ reflect: true }) size: LabelSize = 'md';

  /** The label disabled state. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The label invalid state. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean;

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    // console.log('this.getRootNode()', (this.getRootNode() as Element)?.querySelector<HTMLElement & FormControlInterface>(
    //   `#${this.for}`
    // ), this);

    console.log('changes in label', changes);

    if (changes.has('for')) {
      if (this.for) {
        this.formControl = (this.getRootNode() as Element)?.querySelector<HTMLElement & FormControlInterface>(
          `#${this.for}`
        );

        // If the form control is an <sl-input> or <sl-textarea>,
        // automatically associate the label with the <input> or
        // <textarea> in the light DOM
        if (this.formControl instanceof Input || this.formControl instanceof Textarea) {
          void this.formControl.updateComplete.then(() => {
            const input = this.formControl?.querySelector('input, textarea');

            if (input) {
              this.#formControlId = input.id;
              this.#label?.setAttribute('for', input.id);
            }

            /*            input?.addEventListener('invalid', () => {
              this.invalid = true; //input?.hasAttribute('invalid'); //true;
              console.log('this.formControl in invalid label', input, input?.hasAttribute('invalid'));
            });

            input?.addEventListener('input', () => {
              if ((input as HTMLInputElement)?.checkValidity()) {
                this.invalid = false;
              }
            });

            input?.addEventListener('change', () => {
              if ((input as HTMLInputElement)?.checkValidity()) {
                this.invalid = false;
              }
            });*/

            console.log(
              'in label updateComplete',
              input,
              input?.hasAttribute('invalid'),
              this.formControl,
              this.formControl?.hasAttribute('invalid')
            );
          });
        } else {
          this.#formControlId = this.for;
          this.#label?.setAttribute('for', this.for);

          /*          this.formControl?.addEventListener('invalid', () => {
            this.invalid = true; //this.formControl?.hasAttribute('invalid'); //true;
            console.log(
              'this.formControl in invalid label',
              this.formControl,
              this.formControl?.hasAttribute('invalid')
            );
          });

          this.formControl?.addEventListener('input', () => {
            if (this.formControl?.checkValidity()) {
              this.invalid = false;
            }
          });

          this.formControl?.addEventListener('change', () => {
            if (this.formControl?.checkValidity()) {
              this.invalid = false;
            }
          });*/
        }
      } else {
        this.#label?.removeAttribute('for');
        this.formControl = null;
      }

      // this.formControl?.addEventListener('invalid', () => {
      //   this.invalid = this.formControl?.hasAttribute('invalid');//true;
      //   console.log('this.formControl in invalid label', this.formControl, this.formControl?.hasAttribute('invalid'));
      // });

      // this.formControl?.addEventListener('change', () => {
      //   console.log('change goes...');
      //   if (this.formControl?.checkValidity()) {
      //     this.invalid = false;
      //   }
      // });

      // this.formControl?.addEventListener('input', () => {
      //   this.invalid = false;
      // });

      console.log(
        'formcontrol in forrr',
        this.formControl,
        this.formControl?.hasAttribute('disabled'),
        'invalid? ------->>>',
        this.formControl?.hasAttribute('invalid')
      );
    }

    if (changes.has('formControl')) {
      if (this.formControl) {
        let target: HTMLElement = this.formControl;

        if (target instanceof Input || target instanceof Textarea) {
          target = this.formControl.querySelector('input, textarea') as HTMLElement;
        }

        console.log(
          'formcontrol',
          target,
          this.formControl,
          this.formControl.hasAttribute('disabled'),
          'invalid? ------->>>',
          this.formControl.hasAttribute('invalid'),
          target.hasAttribute('invalid')
        );
        if (this.formControl.hasAttribute('disabled')) {
          this.disabled = true;
        }

        requestAnimationFrame(() => {
          console.log(
            'formcontrol in raf',
            this.formControl?.hasAttribute('aria-invalid'),
            target,
            this.formControl,
            this.formControl?.hasAttribute('disabled'),
            'invalid? ------->>>',
            this.formControl?.hasAttribute('invalid'),
            target.hasAttribute('invalid')
          );
        });

        // void (target as LitElement)?.updateComplete.then(() => {
        //   if (target.hasAttribute('disabled')) {
        //     this.invalid = true;
        //   }
        //   console.log('formcontrol223', target, this.formControl, this.formControl.hasAttribute('disabled'), 'invalid? ------->>>', this.formControl.hasAttribute('invalid'), target.hasAttribute('invalid'));
        // });

        /*        if (this.formControl.hasAttribute('invalid')) {
          this.invalid = true;
        }*/

        this.#observer.observe(target, { attributes: true, attributeFilter: ['required'] }); // TODO: invalid here and disabled?
        void this.#update();
      } else {
        this.#observer.disconnect();
        this.optional = this.required = undefined;
      }
    }
  }

  override update(changes: PropertyValues<this>): void {
    super.update(changes);

    console.log('changes in label update ee', changes, this.formControl?.hasAttribute('invalid'));

    // if (this.formControl?.hasAttribute('invalid')) {
    //   this.invalid = true;
    // }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes in labe updatedl', changes);

    if (this.formControl?.hasAttribute('invalid')) {
      this.invalid = true;
    } /*else {
      this.invalid = false;
    }*/
  }

  override render(): TemplateResult {
    console.log('this.info in label', this.info);

    console.log(
      'formcontrol in render',
      this.formControl,
      this.formControl?.hasAttribute('disabled'),
      'invalid? ------->>>',
      this.formControl?.hasAttribute('invalid')
    );

    // if (this.formControl?.hasAttribute('invalid')) {
    //   this.invalid = true;
    // } else {
    //   this.invalid = false;
    // }

    return html`
      <slot @slotchange=${this.#onSlotchange} style="display: none"></slot>
      <slot name="label" ?disabled=${this.disabled} ?invalid=${this.invalid}></slot>
      <slot name="icon"></slot>
      <slot name="tooltip"></slot>
      ${this.optional ? html`<span class="optional">(optional)</span>` : ''}
      ${this.required ? html`<span class="required">(required)</span>` : ''}
    `; // TODO: what about tooltip here? for the info icon?
    // TODO: sl-icon not font awesome?
    // <slot name="icon" ?disabled=${this.disabled}></slot>
    /*    ${this.info
  ? html`<sl-icon name="face-smile"></sl-icon><span class="info" aria-describedby="tooltip">info icon</span>`
  : ''}*/
    // <sl-tooltip id="tooltip">I am shared between different elements</sl-tooltip>
  }

  #onSlotchange({ target }: Event & { target: HTMLSlotElement }): void {
    const nodes = target.assignedNodes({ flatten: true });
    console.log(
      'nodes in slotchange',
      nodes,
      target,
      this.#label && nodes.length,
      '#####label',
      this.#label,
      nodes.length
    );

    if (this.#label && nodes.length) {
      this.#label.innerHTML = '';
      this.#label.append(...nodes);
    } else {
      // Workaround for `??=` output missing parens around OR statement
      this.#label = this.#label ?? (this.querySelector('label[slot="label"]') || document.createElement('label'));
      this.#label.htmlFor = this.#formControlId ?? '';
      this.#label.slot = 'label';
      this.#label.append(...nodes);
      this.append(this.#label);
    }
  }

  async #update(): Promise<void> {
    // Give the component & siblings time to set the required attribute
    await this.updateComplete;

    const { form } = this.formControl || {},
      required = this.formControl?.hasAttribute('required');

    console.log(
      'formcontrol in #update',
      this.formControl?.hasAttribute('aria-invalid'),
      this.formControl,
      this.formControl?.hasAttribute('disabled'),
      'invalid? ------->>>',
      this.formControl?.hasAttribute('invalid')
    );

    // this.formControl?.addEventListener('invalid', () => {
    //   this.invalid = this.formControl?.hasAttribute('invalid');//true;
    //   console.log('this.formControl in invalid label', this.formControl, this.formControl?.hasAttribute('invalid'));
    // });

    if (form) {
      const controls = Array.from(form.elements).filter(el => !(el instanceof Button));

      // Count the required form controls
      const requiredCount = controls.reduce((count, control) => {
        return count + (control.hasAttribute('required') ? 1 : 0);
      }, 0);

      /**
       * If the required form controls outnumber the optional form controls,
       * then mark the optional form controls. If the optional form controls
       * outnumber the required form controls, mark the required form controls.
       * If there is only a single form element, do nothing.
       */
      const optionalCount = controls.length - requiredCount,
        showRequired = requiredCount <= optionalCount;

      this.optional = !required && !showRequired;
      this.required = required && showRequired;
    } else {
      this.optional = false;
      this.required = required;
    }
  }
}
