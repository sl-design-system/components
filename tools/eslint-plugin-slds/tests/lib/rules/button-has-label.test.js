import { RuleTester } from 'eslint';
import { buttonHasLabel } from '../../../lib/rules/button-has-label.js';

// Configure rule tester with flat config format for ESLint v9
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

// Run tests
ruleTester.run('button-has-label', buttonHasLabel, {
  valid: [
    { code: 'html`<sl-button>Click me</sl-button>`;' },
    { code: "html`<sl-button aria-label='Label'></sl-button>`;" },
    { code: "html`<sl-button aria-labelledby='label'></sl-button>`;" },
    { code: 'html`<sl-button>${buttonText}</sl-button>`;' },
    { code: 'html`<sl-button>Click <strong>here</strong></sl-button>`;' },
    { code: 'html`<sl-button>&nbsp;Space</sl-button>`;' },
    { code: 'html`<sl-button><slot></slot></sl-button>`;' },
    { code: 'html`<sl-button><sl-foo></sl-foo></sl-button>`;' },
    { code: 'const template = `<sl-button></sl-button>`;' },
    { code: 'html`<div><sl-button>First</sl-button><sl-button>Second</sl-button></div>`;' },
    {
      code: "html`<sl-button ${tooltip('Toolip example', { ariaRelation: 'label' })}><sl-icon name='face-smile'></sl-icon></sl-button>`;"
    },
    {
      code: "html`<sl-button ${tooltip('Tiooltip example', { position: 'bottom-start', ariaRelation: 'label' })}><sl-icon name='face-smile'></sl-icon></sl-button>`;"
    },
    {
      code: "html`<sl-button ${tooltip('My tooltip example', { ariaRelation: 'label', position: 'bottom-start', maxWidth: 100 })}><sl-icon name='face-smile' size='lg'></sl-icon></sl-button>`;"
    },
    {
      code: "html`<sl-button variant=\"primary\" fill=\"solid\" ${tooltip('My tooltip example', { ariaRelation: 'label', position: 'bottom-start', maxWidth: 100 })}>\n`;"
    },
    // tooltip attribute on sl-button (new feature)
    { code: "html`<sl-button tooltip='Save'><sl-icon name='save'></sl-icon></sl-button>`;" },
    { code: 'html`<sl-button tooltip="Settings"><sl-icon name="gear"></sl-icon></sl-button>`;' },
    {
      code: 'html`<sl-button variant="primary" tooltip="Submit form"><sl-icon name="check"></sl-icon></sl-button>`;'
    },
    // sl-tooltip sibling with a `for` attribute referencing the button
    {
      code: 'html`<sl-button fill="outline" id="bold"><sl-icon name="far-bold"></sl-icon></sl-button><sl-tooltip for="bold">Bold</sl-tooltip>`;'
    },
    {
      code: 'html`<sl-tooltip for="italic">Italic</sl-tooltip><sl-button id="italic"><sl-icon name="far-italic"></sl-icon></sl-button>`;'
    },
    {
      code: 'html`<sl-button id="save"><sl-icon name="save"></sl-icon></sl-button><sl-tooltip for="save" type="label">Save</sl-tooltip>`;'
    }
  ],
  invalid: [
    {
      code: 'html`<sl-button></sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: 'html`<sl-button><img /></sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: 'html`<sl-button><svg></svg></sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: 'html`<sl-button><sl-icon></sl-icon></sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: 'html`<sl-button>  </sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: 'html`<div><sl-button></sl-button><sl-button>Valid</sl-button><sl-button></sl-button></div>`;',
      errors: [{ messageId: 'missingText' }, { messageId: 'missingText' }]
    },
    {
      code: 'html`<sl-button><span></span></sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: 'html`<sl-button variant="primary" class="my-button"></sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: "html`<sl-button ${tooltip('Tip', { position: 'bottom-start' })}><sl-icon name='face-smile'></sl-icon></sl-button>`;",
      errors: [{ messageId: 'mustBeAriaRelationLabel' }]
    },
    {
      code: "html`<sl-button ${tooltip('Tip', { ariaRelation: 'sth else but not label', position: 'bottom-start' })}><sl-icon name='face-smile'></sl-icon></sl-button>`;",
      errors: [{ messageId: 'mustBeAriaRelationLabel' }]
    },
    {
      code: "html`<sl-button tooltip=''><sl-icon name='save'></sl-icon></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: 'html`<sl-button tooltip=""><sl-icon name="save"></sl-icon></sl-button>`;',
      errors: [{ messageId: 'missingText' }]
    },
    // sl-tooltip sibling referencing a different element
    {
      code: 'html`<sl-button id="bold"><sl-icon name="far-bold"></sl-icon></sl-button><sl-tooltip for="other">Other</sl-tooltip>`;',
      errors: [{ messageId: 'missingText' }]
    },
    // sl-tooltip with type="description" does not label the button
    {
      code: 'html`<sl-button id="bold"><sl-icon name="far-bold"></sl-icon></sl-button><sl-tooltip for="bold" type="description">Bold</sl-tooltip>`;',
      errors: [{ messageId: 'missingText' }]
    },
    // sl-tooltip without a `for` attribute
    {
      code: 'html`<sl-button id="bold"><sl-icon name="far-bold"></sl-icon></sl-button><sl-tooltip>Bold</sl-tooltip>`;',
      errors: [{ messageId: 'missingText' }]
    }
  ]
});
