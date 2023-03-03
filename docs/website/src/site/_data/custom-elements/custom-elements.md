# `../../packages/core/src/form.stories.ts`:

## Variables

| Name                       | Description | Type       |
| -------------------------- | ----------- | ---------- |
| `Horizontal`               |             | `StoryObj` |
| `Vertical`                 |             | `StoryObj` |
| `Hints`                    |             | `StoryObj` |
| `ValidationRequired`       |             | `StoryObj` |
| `ValidationRequiredReport` |             | `StoryObj` |
| `Validation`               |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name                       | Declaration              | Module                                  | Package |
| ---- | -------------------------- | ------------------------ | --------------------------------------- | ------- |
| `js` | `default`                  |                          | ../../packages/core/src/form.stories.ts |         |
| `js` | `Horizontal`               | Horizontal               | ../../packages/core/src/form.stories.ts |         |
| `js` | `Vertical`                 | Vertical                 | ../../packages/core/src/form.stories.ts |         |
| `js` | `Hints`                    | Hints                    | ../../packages/core/src/form.stories.ts |         |
| `js` | `ValidationRequired`       | ValidationRequired       | ../../packages/core/src/form.stories.ts |         |
| `js` | `ValidationRequiredReport` | ValidationRequiredReport | ../../packages/core/src/form.stories.ts |         |
| `js` | `Validation`               | Validation               | ../../packages/core/src/form.stories.ts |         |

# `../../packages/core/src/button/button.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/button/button.scss.ts |         |

# `../../packages/core/src/button/button.stories.ts`:

## Variables

| Name       | Description | Type       |
| ---------- | ----------- | ---------- |
| `API`      |             | `StoryObj` |
| `All`      |             | `StoryObj` |
| `Fills`    |             | `StoryObj` |
| `Sizes`    |             | `StoryObj` |
| `Variants` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                           | Package |
| ---- | ---------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default`  |             | ../../packages/core/src/button/button.stories.ts |         |
| `js` | `API`      | API         | ../../packages/core/src/button/button.stories.ts |         |
| `js` | `All`      | All         | ../../packages/core/src/button/button.stories.ts |         |
| `js` | `Fills`    | Fills       | ../../packages/core/src/button/button.stories.ts |         |
| `js` | `Sizes`    | Sizes       | ../../packages/core/src/button/button.stories.ts |         |
| `js` | `Variants` | Variants    | ../../packages/core/src/button/button.stories.ts |         |

# `../../packages/core/src/button/button.ts`:

## class: `Button`, `sl-button`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Static Fields

| Name             | Privacy | Type      | Default | Description | Inherited From |
| ---------------- | ------- | --------- | ------- | ----------- | -------------- |
| `formAssociated` | private | `boolean` | `true`  |             |                |

### Fields

| Name               | Privacy | Type                        | Default                      | Description                                                                            | Inherited From |
| ------------------ | ------- | --------------------------- | ---------------------------- | -------------------------------------------------------------------------------------- | -------------- |
| `#events`          | private |                             | `new EventsController(this)` | Event controller.                                                                      |                |
| `internals`        |         |                             |                              | Element internals.                                                                     |                |
| `originalTabIndex` | private | `number`                    | `0`                          | The original tabIndex before disabled.                                                 |                |
| `fill`             |         | `ButtonFill`                | `'default'`                  | The button fill.                                                                       |                |
| `size`             |         | `ButtonSize`                | `'md'`                       | Button size.                                                                           |                |
| `type`             |         | `button \| reset \| submit` | `'button'`                   | The button type. Defaults to `button`, but can be set to `submit` when used in a form. |                |
| `variant`          |         | `ButtonVariant`             | `'default'`                  | The button variant. If no variant is specified, it uses the default button style.      |                |

### Methods

| Name                   | Privacy | Description | Parameters             | Return | Inherited From |
| ---------------------- | ------- | ----------- | ---------------------- | ------ | -------------- |
| `formDisabledCallback` |         |             | `disabled: boolean`    | `void` |                |
| `#onClick`             |         |             | `event: Event`         | `void` |                |
| `#onKeydown`           |         |             | `event: KeyboardEvent` | `void` |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `fill`    | fill    |                |
| `size`    | size    |                |
| `type`    | type    |                |
| `variant` | variant |                |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                   | Package |
| ---- | -------- | ----------- | ---------------------------------------- | ------- |
| `js` | `Button` | Button      | ../../packages/core/src/button/button.ts |         |

# `../../packages/core/src/button/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package     |
| ---- | ---- | ----------- | ------ | ----------- |
| `js` | `*`  | *           |        | ./button.js |

# `../../packages/core/src/button/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                              | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------- | ------- |
| `custom-element-definition` | `sl-button` | Button      | /packages/core/src/button/button.js |         |

# `../../packages/core/src/button-bar/button-bar.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                | Package |
| ---- | --------- | ----------- | ----------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/button-bar/button-bar.scss.ts |         |

# `../../packages/core/src/button-bar/button-bar.stories.ts`:

## Variables

| Name  | Description | Type       |
| ----- | ----------- | ---------- |
| `API` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                                   | Package |
| ---- | --------- | ----------- | -------------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/button-bar/button-bar.stories.ts |         |
| `js` | `API`     | API         | ../../packages/core/src/button-bar/button-bar.stories.ts |         |

# `../../packages/core/src/button-bar/button-bar.ts`:

## class: `ButtonBar`, `sl-button-bar`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name       | Privacy | Type                                        | Default   | Description                                      | Inherited From |
| ---------- | ------- | ------------------------------------------- | --------- | ------------------------------------------------ | -------------- |
| `align`    |         | `start \| center \| end \| 'space-between'` | `'start'` | How the buttons are aligned with the bar.        |                |
| `iconOnly` |         | `boolean \| undefined`                      |           | Whether the bar only contains icon-only buttons. |                |
| `reverse`  |         | `boolean`                                   | `false`   | If set, the button order is reversed.            |                |

### Methods

| Name            | Privacy | Description | Parameters | Return          | Inherited From |
| --------------- | ------- | ----------- | ---------- | --------------- | -------------- |
| `#onSlotchange` |         |             |            | `Promise<void>` |                |

### Attributes

| Name        | Field    | Inherited From |
| ----------- | -------- | -------------- |
| `align`     | align    |                |
| `icon-only` | iconOnly |                |
| `reverse`   | reverse  |                |

### Slots

| Name      | Description                      |
| --------- | -------------------------------- |
| `default` | Buttons to be grouped in the bar |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                           | Package |
| ---- | ----------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `ButtonBar` | ButtonBar   | ../../packages/core/src/button-bar/button-bar.ts |         |

# `../../packages/core/src/button-bar/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./button-bar.js |

# `../../packages/core/src/button-bar/register.ts`:

## Exports

| Kind                        | Name            | Declaration | Module                                      | Package |
| --------------------------- | --------------- | ----------- | ------------------------------------------- | ------- |
| `custom-element-definition` | `sl-button-bar` | ButtonBar   | /packages/core/src/button-bar/button-bar.js |         |

# `../../packages/core/src/avatar/avatar.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/avatar/avatar.scss.ts |         |

# `../../packages/core/src/avatar/avatar.stories.ts`:

## Variables

| Name  | Description | Type       |
| ----- | ----------- | ---------- |
| `API` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../../packages/core/src/avatar/avatar.stories.ts |         |
| `js` | `API`     | API         | ../../packages/core/src/avatar/avatar.stories.ts |         |

# `../../packages/core/src/avatar/avatar.ts`:

## class: `Avatar`, `sl-avatar`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name              | Privacy | Type                                    | Default  | Description                                                   | Inherited From |
| ----------------- | ------- | --------------------------------------- | -------- | ------------------------------------------------------------- | -------------- |
| `uniqueProfileId` |         | `string`                                | `'slds'` | Renders the tabs vertically instead of the default horizontal |                |
| `profileName`     |         | `string`                                |          |                                                               |                |
| `user`            |         | `UserProfile \| undefined \| undefined` |          |                                                               |                |

### Methods

| Name              | Privacy | Description | Parameters   | Return                              | Inherited From |
| ----------------- | ------- | ----------- | ------------ | ----------------------------------- | -------------- |
| `_getUserDetails` |         |             | `id: string` | `Promise<UserProfile \| undefined>` |                |

### Attributes

| Name              | Field           | Inherited From |
| ----------------- | --------------- | -------------- |
| `uniqueProfileId` | uniqueProfileId |                |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                   | Package |
| ---- | -------- | ----------- | ---------------------------------------- | ------- |
| `js` | `Avatar` | Avatar      | ../../packages/core/src/avatar/avatar.ts |         |

# `../../packages/core/src/avatar/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package     |
| ---- | ---- | ----------- | ------ | ----------- |
| `js` | `*`  | *           |        | ./avatar.js |

# `../../packages/core/src/avatar/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                              | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------- | ------- |
| `custom-element-definition` | `sl-avatar` | Avatar      | /packages/core/src/avatar/avatar.js |         |

# `../../packages/core/src/checkbox/checkbox-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                  | Package |
| ---- | --------- | ----------- | ------------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/checkbox/checkbox-group.scss.ts |         |

# `../../packages/core/src/checkbox/checkbox-group.ts`:

## class: `CheckboxGroup`, `sl-checkbox-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name        | Module                                   | Package |
| ----------- | ---------------------------------------- | ------- |
| `HintMixin` | /packages/core/src/utils/mixins/index.js |         |

### Static Fields

| Name             | Privacy | Type      | Default | Description | Inherited From |
| ---------------- | ------- | --------- | ------- | ----------- | -------------- |
| `formAssociated` | private | `boolean` | `true`  |             |                |

### Fields

| Name                        | Privacy | Type                       | Default                                                                                                                                                                                                                                                                                                                              | Description                                                           | Inherited From |
| --------------------------- | ------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | -------------- |
| `#events`                   | private |                            | `new EventsController(this, { click: this.#onClick })`                                                                                                                                                                                                                                                                               | Events controller.                                                    |                |
| `#mutation`                 | private |                            | `new MutationController(this, {
    callback: () => {
      const value = this.boxes
        ?.map(box => (box.checked ? box.value : null))
        .filter(Boolean)
        .join(', ');

      this.#validation.validate(value);
    },
    config: { attributeFilter: ['checked'], attributeOldValue: true, subtree: true }
  })` | Observe changes to the checkboxes.                                    |                |
| `#rovingTabindexController` | private |                            | `new RovingTabindexController<Checkbox>(this, {
    focusInIndex: (elements: Checkbox[]) => elements.findIndex(el => !el.disabled),
    elements: () => this.boxes \|\| [],
    isFocusableElement: (el: Checkbox) => !el.disabled
  })`                                                                                             | Manage the keyboard navigation.                                       |                |
| `#validation`               | private |                            | `new ValidationController(this, {
    validators: [requiredValidator]
  })`                                                                                                                                                                                                                                                          | Support validation that at least 1 checkbox is required in the group. |                |
| `internals`                 |         |                            |                                                                                                                                                                                                                                                                                                                                      | Element internals.                                                    |                |
| `boxes`                     |         | `Checkbox[] \| undefined`  |                                                                                                                                                                                                                                                                                                                                      | The slotted checkboxes.                                               |                |
| `validators`                |         | `Validator[] \| undefined` |                                                                                                                                                                                                                                                                                                                                      | Custom validators.                                                    |                |
| `form`                      |         | `HTMLFormElement \| null`  |                                                                                                                                                                                                                                                                                                                                      |                                                                       |                |
| `hint`                      |         | `string \| undefined`      |                                                                                                                                                                                                                                                                                                                                      | The hint. If you need to display HTML, use the `hint` slot instead.   | HintMixin      |

### Methods

| Name          | Privacy | Description | Parameters                      | Return           | Inherited From |
| ------------- | ------- | ----------- | ------------------------------- | ---------------- | -------------- |
| `#onClick`    |         |             | `event: Event`                  | `void`           |                |
| `updated`     |         |             | `changes: PropertyValues<this>` | `void`           | HintMixin      |
| `renderHint`  |         |             |                                 | `TemplateResult` | HintMixin      |
| `#updateHint` |         |             |                                 | `void`           | HintMixin      |
| `#removeHint` |         |             |                                 | `void`           | HintMixin      |

### Attributes

| Name   | Field | Inherited From |
| ------ | ----- | -------------- |
| `hint` | hint  | HintMixin      |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                             | Package |
| ---- | --------------- | ------------- | -------------------------------------------------- | ------- |
| `js` | `CheckboxGroup` | CheckboxGroup | ../../packages/core/src/checkbox/checkbox-group.ts |         |

# `../../packages/core/src/checkbox/checkbox.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                            | Package |
| ---- | --------- | ----------- | ------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/checkbox/checkbox.scss.ts |         |

# `../../packages/core/src/checkbox/checkbox.stories.ts`:

## Variables

| Name            | Description | Type       |
| --------------- | ----------- | ---------- |
| `API`           |             | `StoryObj` |
| `Indeterminate` |             | `StoryObj` |
| `NoText`        |             | `StoryObj` |
| `Overflow`      |             | `StoryObj` |
| `WithLabel`     |             | `StoryObj` |
| `Group`         |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                               | Package |
| ---- | --------------- | ------------- | ---------------------------------------------------- | ------- |
| `js` | `default`       |               | ../../packages/core/src/checkbox/checkbox.stories.ts |         |
| `js` | `API`           | API           | ../../packages/core/src/checkbox/checkbox.stories.ts |         |
| `js` | `Indeterminate` | Indeterminate | ../../packages/core/src/checkbox/checkbox.stories.ts |         |
| `js` | `NoText`        | NoText        | ../../packages/core/src/checkbox/checkbox.stories.ts |         |
| `js` | `Overflow`      | Overflow      | ../../packages/core/src/checkbox/checkbox.stories.ts |         |
| `js` | `WithLabel`     | WithLabel     | ../../packages/core/src/checkbox/checkbox.stories.ts |         |
| `js` | `Group`         | Group         | ../../packages/core/src/checkbox/checkbox.stories.ts |         |

# `../../packages/core/src/checkbox/checkbox.ts`:

## class: `Checkbox`, `sl-checkbox`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module                                   | Package |
| ------------------ | ---------------------------------------- | ------- |
| `FormControlMixin` | /packages/core/src/utils/mixins/index.js |         |
| `HintMixin`        | /packages/core/src/utils/mixins/index.js |         |

### Static Fields

| Name             | Privacy | Type      | Default | Description | Inherited From |
| ---------------- | ------- | --------- | ------- | ----------- | -------------- |
| `formAssociated` | private | `boolean` | `true`  |             |                |

### Fields

| Name                  | Privacy | Type                                   | Default                                                                                    | Description                                                                                                                     | Inherited From   |
| --------------------- | ------- | -------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `#events`             | private |                                        | `new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  })` |                                                                                                                                 |                  |
| `#validation`         | private |                                        | `new ValidationController(this, {
    validators: [requiredValidator]
  })`                |                                                                                                                                 |                  |
| `internals`           |         |                                        |                                                                                            | Element internals.                                                                                                              |                  |
| `change`              |         | `EventEmitter<boolean>`                |                                                                                            | Emits when the checked state changes.                                                                                           |                  |
| `checked`             |         | `boolean`                              | `false`                                                                                    | Whether the checkbox is checked.                                                                                                |                  |
| `indeterminate`       |         | `boolean`                              | `false`                                                                                    | Whether the checkbox has the indeterminate state.                                                                               |                  |
| `value`               |         | `string \| undefined`                  |                                                                                            | The value for the checkbox.                                                                                                     |                  |
| `#cachedValue`        | private | `FormControlValue \| undefined`        |                                                                                            | The cached value for the form control.                                                                                          | FormControlMixin |
| `#formControlElement` | private | `FormControlElement \| undefined`      |                                                                                            | The actual element that integrates with the form; either&#xA;a Form Associated Custom Element, or an `<input>` or `<textarea>`. | FormControlMixin |
| `disabled`            |         | `boolean \| undefined`                 |                                                                                            | No interaction is possible with this control when disabled.                                                                     | FormControlMixin |
| `name`                |         | `string \| undefined`                  |                                                                                            | The name of the form control.                                                                                                   | FormControlMixin |
| `required`            |         | `boolean \| undefined`                 |                                                                                            | Whether this form control is a required field.                                                                                  | FormControlMixin |
| `formControlElement`  |         | `FormControlElement`                   |                                                                                            |                                                                                                                                 | FormControlMixin |
| `form`                |         | `HTMLFormElement \| null`              |                                                                                            |                                                                                                                                 | FormControlMixin |
| `labels`              |         | `NodeListOf<HTMLLabelElement> \| null` |                                                                                            |                                                                                                                                 | FormControlMixin |
| `hint`                |         | `string \| undefined`                  |                                                                                            | The hint. If you need to display HTML, use the `hint` slot instead.                                                             | HintMixin        |

### Methods

| Name                    | Privacy | Description | Parameters                                                        | Return           | Inherited From   |
| ----------------------- | ------- | ----------- | ----------------------------------------------------------------- | ---------------- | ---------------- |
| `#onClick`              |         |             | `event: Event`                                                    | `void`           |                  |
| `#onKeydown`            |         |             | `event: KeyboardEvent`                                            | `void`           |                  |
| `#onToggle`             |         |             | `event: Event`                                                    | `void`           |                  |
| `updated`               |         |             | `changes: PropertyValues<this>`                                   | `void`           | HintMixin        |
| `checkValidity`         |         |             |                                                                   | `boolean`        | FormControlMixin |
| `reportValidity`        |         |             |                                                                   | `boolean`        | FormControlMixin |
| `setFormControlElement` |         |             | `element: FormControlElement`                                     | `void`           | FormControlMixin |
| `setValidity`           |         |             | `flags: ValidityStateFlags, message: string, anchor: HTMLElement` | `void`           | FormControlMixin |
| `setFormValue`          |         |             | `value: FormControlValue`                                         | `void`           | FormControlMixin |
| `renderHint`            |         |             |                                                                   | `TemplateResult` | HintMixin        |
| `#updateHint`           |         |             |                                                                   | `void`           | HintMixin        |
| `#removeHint`           |         |             |                                                                   | `void`           | HintMixin        |

### Attributes

| Name            | Field         | Inherited From   |
| --------------- | ------------- | ---------------- |
| `checked`       | checked       |                  |
| `indeterminate` | indeterminate |                  |
| `value`         | value         |                  |
| `disabled`      | disabled      | FormControlMixin |
| `name`          | name          | FormControlMixin |
| `required`      | required      | FormControlMixin |
| `hint`          | hint          | HintMixin        |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                       | Package |
| ---- | ---------- | ----------- | -------------------------------------------- | ------- |
| `js` | `Checkbox` | Checkbox    | ../../packages/core/src/checkbox/checkbox.ts |         |

# `../../packages/core/src/checkbox/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package             |
| ---- | ---- | ----------- | ------ | ------------------- |
| `js` | `*`  | *           |        | ./checkbox.js       |
| `js` | `*`  | *           |        | ./checkbox-group.js |

# `../../packages/core/src/checkbox/register.ts`:

## Exports

| Kind                        | Name                | Declaration   | Module                                        | Package |
| --------------------------- | ------------------- | ------------- | --------------------------------------------- | ------- |
| `custom-element-definition` | `sl-checkbox`       | Checkbox      | /packages/core/src/checkbox/checkbox.js       |         |
| `custom-element-definition` | `sl-checkbox-group` | CheckboxGroup | /packages/core/src/checkbox/checkbox-group.js |         |

# `../../packages/core/src/dialog/dialog.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/dialog/dialog.scss.ts |         |

# `../../packages/core/src/dialog/dialog.stories.ts`:

## Variables

| Name            | Description | Type       |
| --------------- | ----------- | ---------- |
| `API`           |             | `StoryObj` |
| `DisableClose`  |             | `StoryObj` |
| `ScrollingBody` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                           | Package |
| ---- | --------------- | ------------- | ------------------------------------------------ | ------- |
| `js` | `default`       |               | ../../packages/core/src/dialog/dialog.stories.ts |         |
| `js` | `API`           | API           | ../../packages/core/src/dialog/dialog.stories.ts |         |
| `js` | `DisableClose`  | DisableClose  | ../../packages/core/src/dialog/dialog.stories.ts |         |
| `js` | `ScrollingBody` | ScrollingBody | ../../packages/core/src/dialog/dialog.stories.ts |         |

# `../../packages/core/src/dialog/dialog.ts`:

## class: `Dialog`, `sl-dialog`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                  |
| --------------------- | ------ | ------------------------ |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements |

### Static Fields

| Name             | Privacy | Type                | Default | Description | Inherited From |
| ---------------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `scopedElements` | private | `ScopedElementsMap` |         |             |                |

### Fields

| Name           | Privacy | Type                             | Default    | Description                                                    | Inherited From |
| -------------- | ------- | -------------------------------- | ---------- | -------------------------------------------------------------- | -------------- |
| `dialog`       |         | `HTMLDialogElement \| undefined` |            |                                                                |                |
| `disableClose` |         | `boolean`                        | `false`    | Disables the ability to close the dialog using the Escape key. |                |
| `role`         |         | `'dialog' \| 'alertdialog'`      | `'dialog'` | The ARIA role of the dialog.                                   |                |

### Methods

| Name        | Privacy | Description | Parameters                                      | Return | Inherited From |
| ----------- | ------- | ----------- | ----------------------------------------------- | ------ | -------------- |
| `showModal` |         |             |                                                 | `void` |                |
| `close`     |         |             |                                                 | `void` |                |
| `#onCancel` |         |             | `event: Event`                                  | `void` |                |
| `#onClick`  |         |             | `event: PointerEvent & { target: HTMLElement }` | `void` |                |
| `#onClose`  |         |             |                                                 | `void` |                |

### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `disable-close` | disableClose |                |
| `role`          | role         |                |

### Slots

| Name      | Description                          |
| --------- | ------------------------------------ |
| `action`  | Area where action buttons are placed |
| `default` | Body content for the dialog          |
| `footer`  | Footer content for the dialog        |
| `header`  | Header content for the dialog        |
| `title`   | The title of the dialog              |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                   | Package |
| ---- | -------- | ----------- | ---------------------------------------- | ------- |
| `js` | `Dialog` | Dialog      | ../../packages/core/src/dialog/dialog.ts |         |

# `../../packages/core/src/dialog/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package     |
| ---- | ---- | ----------- | ------ | ----------- |
| `js` | `*`  | *           |        | ./dialog.js |

# `../../packages/core/src/dialog/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                              | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------- | ------- |
| `custom-element-definition` | `sl-dialog` | Dialog      | /packages/core/src/dialog/dialog.js |         |

# `../../packages/core/src/drawer/drawer.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/drawer/drawer.scss.ts |         |

# `../../packages/core/src/drawer/drawer.stories.ts`:

## Variables

| Name             | Description | Type       |
| ---------------- | ----------- | ---------- |
| `API`            |             | `StoryObj` |
| `DisableClose`   |             | `StoryObj` |
| `CompleteHeader` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name             | Declaration    | Module                                           | Package |
| ---- | ---------------- | -------------- | ------------------------------------------------ | ------- |
| `js` | `default`        |                | ../../packages/core/src/drawer/drawer.stories.ts |         |
| `js` | `API`            | API            | ../../packages/core/src/drawer/drawer.stories.ts |         |
| `js` | `DisableClose`   | DisableClose   | ../../packages/core/src/drawer/drawer.stories.ts |         |
| `js` | `CompleteHeader` | CompleteHeader | ../../packages/core/src/drawer/drawer.stories.ts |         |

# `../../packages/core/src/drawer/drawer.ts`:

## class: `Drawer`, `sl-drawer`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                  |
| --------------------- | ------ | ------------------------ |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements |

### Static Fields

| Name             | Privacy | Type                | Default | Description | Inherited From |
| ---------------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `scopedElements` | private | `ScopedElementsMap` |         |             |                |

### Fields

| Name              | Privacy | Type                             | Default   | Description                                                    | Inherited From |
| ----------------- | ------- | -------------------------------- | --------- | -------------------------------------------------------------- | -------------- |
| `dialog`          |         | `HTMLDialogElement \| undefined` |           |                                                                |                |
| `disableClose`    |         | `boolean`                        | `false`   | Disables the ability to close the dialog using the Escape key. |                |
| `attachment`      |         | `DrawerAttachment`               | `'right'` | The side of the screen where the drawer is attached            |                |
| `closeButtonSize` |         | `ButtonSize`                     | `'sm'`    | The size of the button                                         |                |

### Methods

| Name        | Privacy | Description | Parameters                                      | Return | Inherited From |
| ----------- | ------- | ----------- | ----------------------------------------------- | ------ | -------------- |
| `showModal` |         |             |                                                 | `void` |                |
| `close`     |         |             |                                                 | `void` |                |
| `#onCancel` |         |             | `event: Event`                                  | `void` |                |
| `#onClick`  |         |             | `event: PointerEvent & { target: HTMLElement }` | `void` |                |
| `#onClose`  |         |             |                                                 | `void` |                |

### Attributes

| Name              | Field           | Inherited From |
| ----------------- | --------------- | -------------- |
| `disable-close`   | disableClose    |                |
| `attachment`      | attachment      |                |
| `closeButtonSize` | closeButtonSize |                |

### Slots

| Name      | Description                   |
| --------- | ----------------------------- |
| `default` | Body content for the drawer   |
| `header`  | Header content for the drawer |
| `title`   | The title of the drawer       |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                   | Package |
| ---- | -------- | ----------- | ---------------------------------------- | ------- |
| `js` | `Drawer` | Drawer      | ../../packages/core/src/drawer/drawer.ts |         |

# `../../packages/core/src/drawer/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package     |
| ---- | ---- | ----------- | ------ | ----------- |
| `js` | `*`  | *           |        | ./drawer.js |

# `../../packages/core/src/drawer/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                              | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------- | ------- |
| `custom-element-definition` | `sl-drawer` | Drawer      | /packages/core/src/drawer/drawer.js |         |

# `../../packages/core/src/label/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package    |
| ---- | ---- | ----------- | ------ | ---------- |
| `js` | `*`  | *           |        | ./label.js |

# `../../packages/core/src/label/label.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                      | Package |
| ---- | --------- | ----------- | ------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/label/label.scss.ts |         |

# `../../packages/core/src/label/label.stories.ts`:

## Variables

| Name          | Description | Type       |
| ------------- | ----------- | ---------- |
| `API`         |             | `StoryObj` |
| `CustomLabel` |             | `StoryObj` |
| `Required`    |             | `StoryObj` |
| `Optional`    |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name          | Declaration | Module                                         | Package |
| ---- | ------------- | ----------- | ---------------------------------------------- | ------- |
| `js` | `default`     |             | ../../packages/core/src/label/label.stories.ts |         |
| `js` | `API`         | API         | ../../packages/core/src/label/label.stories.ts |         |
| `js` | `CustomLabel` | CustomLabel | ../../packages/core/src/label/label.stories.ts |         |
| `js` | `Required`    | Required    | ../../packages/core/src/label/label.stories.ts |         |
| `js` | `Optional`    | Optional    | ../../packages/core/src/label/label.stories.ts |         |

# `../../packages/core/src/label/label.ts`:

## class: `Label`, `sl-label`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name             | Privacy | Type                                           | Default                                           | Description                                                     | Inherited From |
| ---------------- | ------- | ---------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------- | -------------- |
| `#formControlId` | private | `string \| undefined`                          |                                                   | The actual form control id this label links to.                 |                |
| `#label`         | private | `HTMLLabelElement \| undefined`                |                                                   | The label instance in the light DOM.                            |                |
| `#observer`      | private |                                                | `new MutationObserver(() => void this.#update())` | Observe the form control for changes to the required attribute. |                |
| `for`            |         | `string \| undefined`                          |                                                   | The DOM id of the form control this is linked to.               |                |
| `formControl`    |         | `(HTMLElement & FormControlInterface) \| null` | `null`                                            | The associated form control.                                    |                |
| `optional`       |         | `boolean \| undefined`                         |                                                   | Whether this label should be marked as optional.                |                |
| `required`       |         | `boolean \| undefined`                         |                                                   | Whether this label should be marked as required.                |                |

### Methods

| Name            | Privacy | Description | Parameters                                        | Return          | Inherited From |
| --------------- | ------- | ----------- | ------------------------------------------------- | --------------- | -------------- |
| `#onSlotchange` |         |             | `{ target }: Event & { target: HTMLSlotElement }` | `void`          |                |
| `#update`       |         |             |                                                   | `Promise<void>` |                |

### Attributes

| Name  | Field | Inherited From |
| ----- | ----- | -------------- |
| `for` | for   |                |

<hr/>

## Exports

| Kind | Name    | Declaration | Module                                 | Package |
| ---- | ------- | ----------- | -------------------------------------- | ------- |
| `js` | `Label` | Label       | ../../packages/core/src/label/label.ts |         |

# `../../packages/core/src/label/register.ts`:

## Exports

| Kind                        | Name       | Declaration | Module                            | Package |
| --------------------------- | ---------- | ----------- | --------------------------------- | ------- |
| `custom-element-definition` | `sl-label` | Label       | /packages/core/src/label/label.js |         |

# `../../packages/core/src/icon/icon.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                    | Package |
| ---- | --------- | ----------- | ----------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/icon/icon.scss.ts |         |

# `../../packages/core/src/icon/icon.stories.ts`:

## Variables

| Name  | Description | Type       |
| ----- | ----------- | ---------- |
| `API` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                       | Package |
| ---- | --------- | ----------- | -------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/icon/icon.stories.ts |         |
| `js` | `API`     | API         | ../../packages/core/src/icon/icon.stories.ts |         |

# `../../packages/core/src/icon/icon.ts`:

## class: `Icon`, `sl-icon`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Static Fields

| Name       | Privacy | Type           | Default | Description | Inherited From |
| ---------- | ------- | -------------- | ------- | ----------- | -------------- |
| `resolver` | private | `IconResolver` |         |             |                |

### Static Methods

| Name               | Privacy | Description | Parameters                   | Return | Inherited From |
| ------------------ | ------- | ----------- | ---------------------------- | ------ | -------------- |
| `registerIcon`     |         |             | `name: string, icon: string` | `void` |                |
| `registerResolver` |         |             | `resolver: IconResolver`     | `void` |                |

### Fields

| Name    | Privacy | Type                  | Default | Description                                                                                                       | Inherited From |
| ------- | ------- | --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- | -------------- |
| `label` |         | `string \| undefined` |         | Describes the icon for assistive devices. If not present, the icon is considered&#xA;to be purely presentational. |                |
| `name`  |         | `string \| undefined` |         | The name of the icon to show.                                                                                     |                |

### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `label` | label |                |
| `name`  | name  |                |

<hr/>

## Exports

| Kind | Name   | Declaration | Module                               | Package |
| ---- | ------ | ----------- | ------------------------------------ | ------- |
| `js` | `Icon` | Icon        | ../../packages/core/src/icon/icon.ts |         |

# `../../packages/core/src/icon/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package   |
| ---- | ---- | ----------- | ------ | --------- |
| `js` | `*`  | *           |        | ./icon.js |

# `../../packages/core/src/icon/register.ts`:

## Exports

| Kind                        | Name      | Declaration | Module                          | Package |
| --------------------------- | --------- | ----------- | ------------------------------- | ------- |
| `custom-element-definition` | `sl-icon` | Icon        | /packages/core/src/icon/icon.js |         |

# `../../packages/core/src/input/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package    |
| ---- | ---- | ----------- | ------ | ---------- |
| `js` | `*`  | *           |        | ./input.js |

# `../../packages/core/src/input/input.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                      | Package |
| ---- | --------- | ----------- | ------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/input/input.scss.ts |         |

# `../../packages/core/src/input/input.stories.ts`:

## Variables

| Name               | Description | Type       |
| ------------------ | ----------- | ---------- |
| `API`              |             | `StoryObj` |
| `Disabled`         |             | `StoryObj` |
| `Label`            |             | `StoryObj` |
| `Hint`             |             | `StoryObj` |
| `RichLabelHint`    |             | `StoryObj` |
| `PrefixSuffix`     |             | `StoryObj` |
| `MinMaxLength`     |             | `StoryObj` |
| `Pattern`          |             | `StoryObj` |
| `CustomInput`      |             | `StoryObj` |
| `CustomValidation` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                         | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------------- | ------- |
| `js` | `default`          |                  | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `API`              | API              | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `Disabled`         | Disabled         | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `Label`            | Label            | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `Hint`             | Hint             | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `RichLabelHint`    | RichLabelHint    | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `PrefixSuffix`     | PrefixSuffix     | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `MinMaxLength`     | MinMaxLength     | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `Pattern`          | Pattern          | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `CustomInput`      | CustomInput      | ../../packages/core/src/input/input.stories.ts |         |
| `js` | `CustomValidation` | CustomValidation | ../../packages/core/src/input/input.stories.ts |         |

# `../../packages/core/src/input/input.ts`:

## class: `Input`, `sl-input`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module                                   | Package |
| ------------------ | ---------------------------------------- | ------- |
| `FormControlMixin` | /packages/core/src/utils/mixins/index.js |         |
| `HintMixin`        | /packages/core/src/utils/mixins/index.js |         |

### Fields

| Name                  | Privacy | Type                                                            | Default                                                              | Description                                                                                                                     | Inherited From   |
| --------------------- | ------- | --------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `#events`             | private |                                                                 | `new EventsController(this, {
    click: this.#onClick
  })`         |                                                                                                                                 |                  |
| `#onKeydown`          | private |                                                                 |                                                                      |                                                                                                                                 |                  |
| `#validation`         | private |                                                                 | `new ValidationController(this, {
    target: () => this.input
  })` |                                                                                                                                 |                  |
| `input`               |         | `HTMLInputElement`                                              |                                                                      | The input element in the light DOM.                                                                                             |                  |
| `internals`           |         |                                                                 |                                                                      | Element internals.                                                                                                              |                  |
| `autocomplete`        |         | `string \| undefined`                                           |                                                                      | Specifies which type of data the browser can use to pre-fill the input.                                                         |                  |
| `maxLength`           |         | `number \| undefined`                                           |                                                                      | Maximum length (number of characters).                                                                                          |                  |
| `minLength`           |         | `number \| undefined`                                           |                                                                      | Minimum length (number of characters).                                                                                          |                  |
| `pattern`             |         | `string \| undefined`                                           |                                                                      | Validation using pattern.                                                                                                       |                  |
| `placeholder`         |         | `string \| undefined`                                           |                                                                      | Placeholder text in the input.                                                                                                  |                  |
| `type`                |         | `'email' \| 'number' \| 'password' \| 'tel' \| 'text' \| 'url'` | `'text'`                                                             | The input type. Only text types are valid here. For other types,&#xA;see their respective components.                           |                  |
| `validators`          |         | `Validator[] \| undefined`                                      |                                                                      | Custom validators specified by the user.                                                                                        |                  |
| `value`               |         | `string \| undefined`                                           |                                                                      | The value for the input.                                                                                                        |                  |
| `#cachedValue`        | private | `FormControlValue \| undefined`                                 |                                                                      | The cached value for the form control.                                                                                          | FormControlMixin |
| `#formControlElement` | private | `FormControlElement \| undefined`                               |                                                                      | The actual element that integrates with the form; either&#xA;a Form Associated Custom Element, or an `<input>` or `<textarea>`. | FormControlMixin |
| `disabled`            |         | `boolean \| undefined`                                          |                                                                      | No interaction is possible with this control when disabled.                                                                     | FormControlMixin |
| `name`                |         | `string \| undefined`                                           |                                                                      | The name of the form control.                                                                                                   | FormControlMixin |
| `required`            |         | `boolean \| undefined`                                          |                                                                      | Whether this form control is a required field.                                                                                  | FormControlMixin |
| `formControlElement`  |         | `FormControlElement`                                            |                                                                      |                                                                                                                                 | FormControlMixin |
| `form`                |         | `HTMLFormElement \| null`                                       |                                                                      |                                                                                                                                 | FormControlMixin |
| `labels`              |         | `NodeListOf<HTMLLabelElement> \| null`                          |                                                                      |                                                                                                                                 | FormControlMixin |
| `hint`                |         | `string \| undefined`                                           |                                                                      | The hint. If you need to display HTML, use the `hint` slot instead.                                                             | HintMixin        |

### Methods

| Name                    | Privacy | Description | Parameters                                                        | Return           | Inherited From   |
| ----------------------- | ------- | ----------- | ----------------------------------------------------------------- | ---------------- | ---------------- |
| `#onClick`              |         |             | `event: Event`                                                    | `void`           |                  |
| `#onInput`              |         |             | `{ target }: Event & { target: HTMLInputElement }`                | `void`           |                  |
| `#onSlotchange`         |         |             | `event: Event & { target: HTMLSlotElement }`                      | `void`           |                  |
| `updated`               |         |             | `changes: PropertyValues<this>`                                   | `void`           | HintMixin        |
| `checkValidity`         |         |             |                                                                   | `boolean`        | FormControlMixin |
| `reportValidity`        |         |             |                                                                   | `boolean`        | FormControlMixin |
| `setFormControlElement` |         |             | `element: FormControlElement`                                     | `void`           | FormControlMixin |
| `setValidity`           |         |             | `flags: ValidityStateFlags, message: string, anchor: HTMLElement` | `void`           | FormControlMixin |
| `setFormValue`          |         |             | `value: FormControlValue`                                         | `void`           | FormControlMixin |
| `renderHint`            |         |             |                                                                   | `TemplateResult` | HintMixin        |
| `#updateHint`           |         |             |                                                                   | `void`           | HintMixin        |
| `#removeHint`           |         |             |                                                                   | `void`           | HintMixin        |

### Attributes

| Name           | Field        | Inherited From   |
| -------------- | ------------ | ---------------- |
| `autocomplete` | autocomplete |                  |
| `maxlength`    | maxLength    |                  |
| `minlength`    | minLength    |                  |
| `pattern`      | pattern      |                  |
| `placeholder`  | placeholder  |                  |
| `type`         | type         |                  |
| `value`        | value        |                  |
| `disabled`     | disabled     | FormControlMixin |
| `name`         | name         | FormControlMixin |
| `required`     | required     | FormControlMixin |
| `hint`         | hint         | HintMixin        |

### Slots

| Name     | Description                    |
| -------- | ------------------------------ |
| `prefix` | Content shown before the input |
| `input`  | The slot for the input element |
| `suffix` | Content shown after the input  |

<hr/>

## Exports

| Kind | Name    | Declaration | Module                                 | Package |
| ---- | ------- | ----------- | -------------------------------------- | ------- |
| `js` | `Input` | Input       | ../../packages/core/src/input/input.ts |         |

# `../../packages/core/src/input/register.ts`:

## Exports

| Kind                        | Name       | Declaration | Module                            | Package |
| --------------------------- | ---------- | ----------- | --------------------------------- | ------- |
| `custom-element-definition` | `sl-input` | Input       | /packages/core/src/input/input.js |         |

# `../../packages/core/src/locales/locale-codes.ts`:

## Variables

| Name            | Description                                                                                   | Type             |
| --------------- | --------------------------------------------------------------------------------------------- | ---------------- |
| `sourceLocale`  | The locale code that templates in this source code are written in.                            |                  |
| `targetLocales` | The other locale codes that this application is localized into. Sorted&#xA;lexicographically. | ``[`nl`]``       |
| `allLocales`    | All valid project locale codes. Sorted lexicographically.                                     | ``[`en`, `nl`]`` |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                          | Package |
| ---- | --------------- | ------------- | ----------------------------------------------- | ------- |
| `js` | `sourceLocale`  | sourceLocale  | ../../packages/core/src/locales/locale-codes.ts |         |
| `js` | `targetLocales` | targetLocales | ../../packages/core/src/locales/locale-codes.ts |         |
| `js` | `allLocales`    | allLocales    | ../../packages/core/src/locales/locale-codes.ts |         |

# `../../packages/core/src/locales/nl.ts`:

## Variables

| Name        | Description | Type     |
| ----------- | ----------- | -------- |
| `templates` |             | `object` |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                | Package |
| ---- | ----------- | ----------- | ------------------------------------- | ------- |
| `js` | `templates` | templates   | ../../packages/core/src/locales/nl.ts |         |

# `../../packages/core/src/popover/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package      |
| ---- | ---- | ----------- | ------ | ------------ |
| `js` | `*`  | *           |        | ./popover.js |
| `js` | `*`  | *           |        | ./types.js   |

# `../../packages/core/src/popover/popover.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                          | Package |
| ---- | --------- | ----------- | ----------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/popover/popover.scss.ts |         |

# `../../packages/core/src/popover/popover.stories.ts`:

## Variables

| Name    | Description | Type       |
| ------- | ----------- | ---------- |
| `API`   |             | `StoryObj` |
| `Focus` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                             | Package |
| ---- | --------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/popover/popover.stories.ts |         |
| `js` | `API`     | API         | ../../packages/core/src/popover/popover.stories.ts |         |
| `js` | `Focus`   | Focus       | ../../packages/core/src/popover/popover.stories.ts |         |

# `../../packages/core/src/popover/popover.ts`:

## class: `Popover`, `sl-popover`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                   | Module                                                | Package |
| ---------------------- | ----------------------------------------------------- | ------- |
| `AnchoredPopoverMixin` | /packages/core/src/popover/mixins/anchored-popover.js |         |

### Fields

| Name                 | Privacy | Type                       | Default | Description                                          | Inherited From       |
| -------------------- | ------- | -------------------------- | ------- | ---------------------------------------------------- | -------------------- |
| `#onAnchorClick`     | private |                            |         |                                                      |                      |
| `arrow`              |         | `HTMLElement \| undefined` |         | The arrow linking the popover to the anchor element. | AnchoredPopoverMixin |
| `placement`          |         | `Placement`                | `'top'` | Popover placement relative to the anchor.            | AnchoredPopoverMixin |
| `#onPopoverHide`     | private |                            |         |                                                      | AnchoredPopoverMixin |
| `cleanupFloatingUI`  |         | `() => void \| undefined`  |         | Cleanup callback for floating-ui.                    | AnchoredPopoverMixin |
| `#anchorElement`     | private | `HTMLElement \| undefined` |         |                                                      | AnchoredMixin        |
| `anchorElement`      |         | `HTMLElement \| undefined` |         |                                                      | AnchoredMixin        |
| `#popoverOpen`       | private | `boolean`                  | `false` |                                                      | PopoverMixin         |
| `#onDocumentClick`   | private |                            |         |                                                      | PopoverMixin         |
| `#onDocumentKeydown` | private |                            |         |                                                      | PopoverMixin         |
| `open`               |         | `boolean`                  | `false` | Whether the popover is open or not.                  | PopoverMixin         |
| `receivesFocus`      |         | `'auto' \| undefined`      |         |                                                      | PopoverMixin         |
| `popoverOpen`        | public  | `boolean`                  |         |                                                      | PopoverMixin         |

### Methods

| Name                             | Privacy | Description                                                            | Parameters                      | Return          | Inherited From       |
| -------------------------------- | ------- | ---------------------------------------------------------------------- | ------------------------------- | --------------- | -------------------- |
| `addEventListenersToAnchor`      |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `removeEventListenersFromAnchor` |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `#onClick`                       |         |                                                                        | `event: Event`                  | `void`          |                      |
| `positionPopover`                |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `cleanupPopover`                 |         |                                                                        |                                 | `void`          | AnchoredPopoverMixin |
| `firstUpdated`                   |         |                                                                        | `changes: PropertyValues<this>` | `void`          | AnchoredMixin        |
| `#resolveAnchor`                 |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `willUpdate`                     |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin         |
| `updated`                        |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin         |
| `showPopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `hidePopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `#setup`                         |         | Setup light dismiss handlers if no top-layer and not a manual popover. |                                 | `Promise<void>` | PopoverMixin         |
| `#cleanup`                       |         | Cleanup light dismiss handlers.                                        |                                 | `void`          | PopoverMixin         |

### Events

| Name          | Type    | Description | Inherited From |
| ------------- | ------- | ----------- | -------------- |
| `popovershow` | `Event` |             | PopoverMixin   |
| `popoverhide` | `Event` |             | PopoverMixin   |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `placement`      | placement     |                |
| `open`           | open          | PopoverMixin   |
| `receives-focus` | receivesFocus | PopoverMixin   |

### CSS Parts

| Name        | Description                   |
| ----------- | ----------------------------- |
| `container` | The container for the popover |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                     | Package |
| ---- | --------- | ----------- | ------------------------------------------ | ------- |
| `js` | `Popover` | Popover     | ../../packages/core/src/popover/popover.ts |         |

# `../../packages/core/src/popover/register.ts`:

## Exports

| Kind                        | Name         | Declaration | Module                                | Package |
| --------------------------- | ------------ | ----------- | ------------------------------------- | ------- |
| `custom-element-definition` | `sl-popover` | Popover     | /packages/core/src/popover/popover.js |         |

# `../../packages/core/src/radio-group/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package          |
| ---- | ---- | ----------- | ------ | ---------------- |
| `js` | `*`  | *           |        | ./radio.js       |
| `js` | `*`  | *           |        | ./radio-group.js |

# `../../packages/core/src/radio-group/radio-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                  | Package |
| ---- | --------- | ----------- | ------------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/radio-group/radio-group.scss.ts |         |

# `../../packages/core/src/radio-group/radio-group.stories.ts`:

## Variables

| Name               | Description | Type       |
| ------------------ | ----------- | ---------- |
| `API`              |             | `StoryObj` |
| `Disabled`         |             | `StoryObj` |
| `Horizontal`       |             | `StoryObj` |
| `Selected`         |             | `StoryObj` |
| `Label`            |             | `StoryObj` |
| `Hint`             |             | `StoryObj` |
| `RichLabelHint`    |             | `StoryObj` |
| `Required`         |             | `StoryObj` |
| `CustomValidation` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                                     | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------------------------- | ------- |
| `js` | `default`          |                  | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `API`              | API              | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `Disabled`         | Disabled         | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `Horizontal`       | Horizontal       | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `Selected`         | Selected         | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `Label`            | Label            | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `Hint`             | Hint             | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `RichLabelHint`    | RichLabelHint    | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `Required`         | Required         | ../../packages/core/src/radio-group/radio-group.stories.ts |         |
| `js` | `CustomValidation` | CustomValidation | ../../packages/core/src/radio-group/radio-group.stories.ts |         |

# `../../packages/core/src/radio-group/radio-group.ts`:

## class: `RadioGroup`, `sl-radio-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module                                   | Package |
| ------------------ | ---------------------------------------- | ------- |
| `FormControlMixin` | /packages/core/src/utils/mixins/index.js |         |
| `HintMixin`        | /packages/core/src/utils/mixins/index.js |         |

### Static Fields

| Name             | Privacy | Type      | Default | Description | Inherited From |
| ---------------- | ------- | --------- | ------- | ----------- | -------------- |
| `formAssociated` | private | `boolean` | `true`  |             |                |

### Fields

| Name                        | Privacy | Type                                   | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Description                                                                                                                     | Inherited From   |
| --------------------------- | ------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `#events`                   | private |                                        | `new EventsController(this, {
    click: this.#onClick,
    focusout: this.#onFocusout
  })`                                                                                                                                                                                                                                                                                                                                                                                              | Events controller.                                                                                                              |                  |
| `#mutation`                 | private |                                        | `new MutationController(this, {
    callback: mutations => {
      const { target } = mutations.find(m => m.attributeName === 'checked' && m.oldValue === null) \|\| {};

      if (target instanceof Radio && target.value) {
        this.buttons?.forEach(radio => (radio.checked = radio.value === target.value));
        this.value = target.value;
      }
    },
    config: {
      attributeFilter: ['checked'],
      attributeOldValue: true,
      subtree: true
    }
  })` | Observe the state of the radios.                                                                                                |                  |
| `#rovingTabindexController` | private |                                        | `new RovingTabindexController<Radio>(this, {
    focusInIndex: (elements: Radio[]) => {
      return elements.findIndex(el => {
        return this.value ? !el.disabled && el.value === this.value : !el.disabled;
      });
    },
    elementEnterAction: (el: Radio) => {
      this.value = el.value;
    },
    elements: () => this.buttons,
    isFocusableElement: (el: Radio) => !el.disabled
  })`                                                                             | Manage the keyboard navigation.                                                                                                 |                  |
| `#validation`               | private |                                        | `new ValidationController(this, {
    validators: [requiredValidator]
  })`                                                                                                                                                                                                                                                                                                                                                                                                               |                                                                                                                                 |                  |
| `internals`                 |         |                                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Element internals.                                                                                                              |                  |
| `defaultNodes`              |         | `Node[] \| undefined`                  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The assigned nodes.                                                                                                             |                  |
| `horizontal`                |         | `boolean \| undefined`                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | If true, displays the radio buttons next to each other instead of below.                                                        |                  |
| `validators`                |         | `Validator[] \| undefined`             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Custom validators specified by the user.                                                                                        |                  |
| `value`                     |         | `string \| undefined`                  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The value for this group.                                                                                                       |                  |
| `buttons`                   |         | `Radio[]`                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                 |                  |
| `#cachedValue`              | private | `FormControlValue \| undefined`        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The cached value for the form control.                                                                                          | FormControlMixin |
| `#formControlElement`       | private | `FormControlElement \| undefined`      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The actual element that integrates with the form; either&#xA;a Form Associated Custom Element, or an `<input>` or `<textarea>`. | FormControlMixin |
| `disabled`                  |         | `boolean \| undefined`                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | No interaction is possible with this control when disabled.                                                                     | FormControlMixin |
| `name`                      |         | `string \| undefined`                  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The name of the form control.                                                                                                   | FormControlMixin |
| `required`                  |         | `boolean \| undefined`                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Whether this form control is a required field.                                                                                  | FormControlMixin |
| `formControlElement`        |         | `FormControlElement`                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                 | FormControlMixin |
| `form`                      |         | `HTMLFormElement \| null`              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                 | FormControlMixin |
| `labels`                    |         | `NodeListOf<HTMLLabelElement> \| null` |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                 | FormControlMixin |
| `hint`                      |         | `string \| undefined`                  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The hint. If you need to display HTML, use the `hint` slot instead.                                                             | HintMixin        |

### Methods

| Name                    | Privacy | Description | Parameters                                                        | Return           | Inherited From   |
| ----------------------- | ------- | ----------- | ----------------------------------------------------------------- | ---------------- | ---------------- |
| `#onClick`              |         |             | `event: Event`                                                    | `void`           |                  |
| `#onFocusout`           |         |             | `event: FocusEvent`                                               | `void`           |                  |
| `updated`               |         |             | `changes: PropertyValues<this>`                                   | `void`           | HintMixin        |
| `checkValidity`         |         |             |                                                                   | `boolean`        | FormControlMixin |
| `reportValidity`        |         |             |                                                                   | `boolean`        | FormControlMixin |
| `setFormControlElement` |         |             | `element: FormControlElement`                                     | `void`           | FormControlMixin |
| `setValidity`           |         |             | `flags: ValidityStateFlags, message: string, anchor: HTMLElement` | `void`           | FormControlMixin |
| `setFormValue`          |         |             | `value: FormControlValue`                                         | `void`           | FormControlMixin |
| `renderHint`            |         |             |                                                                   | `TemplateResult` | HintMixin        |
| `#updateHint`           |         |             |                                                                   | `void`           | HintMixin        |
| `#removeHint`           |         |             |                                                                   | `void`           | HintMixin        |

### Attributes

| Name         | Field      | Inherited From   |
| ------------ | ---------- | ---------------- |
| `horizontal` | horizontal |                  |
| `value`      | value      |                  |
| `disabled`   | disabled   | FormControlMixin |
| `name`       | name       | FormControlMixin |
| `required`   | required   | FormControlMixin |
| `hint`       | hint       | HintMixin        |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                             | Package |
| ---- | ------------ | ----------- | -------------------------------------------------- | ------- |
| `js` | `RadioGroup` | RadioGroup  | ../../packages/core/src/radio-group/radio-group.ts |         |

# `../../packages/core/src/radio-group/radio.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                            | Package |
| ---- | --------- | ----------- | ------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/radio-group/radio.scss.ts |         |

# `../../packages/core/src/radio-group/radio.ts`:

## class: `Radio`, `sl-radio`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name        | Privacy | Type      | Default                                                                                    | Description                      | Inherited From |
| ----------- | ------- | --------- | ------------------------------------------------------------------------------------------ | -------------------------------- | -------------- |
| `#events`   | private |           | `new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  })` | Events controller.               |                |
| `internals` |         |           |                                                                                            | Element internals.               |                |
| `checked`   |         | `boolean` | `false`                                                                                    | Whether the radio is selected.   |                |
| `disabled`  |         | `boolean` | `false`                                                                                    | Wether this radio is disabled.   |                |
| `value`     |         | `string`  | `''`                                                                                       | The value for this radio button. |                |

### Methods

| Name         | Privacy | Description | Parameters             | Return | Inherited From |
| ------------ | ------- | ----------- | ---------------------- | ------ | -------------- |
| `#onClick`   |         |             | `event: Event`         | `void` |                |
| `#onKeydown` |         |             | `event: KeyboardEvent` | `void` |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `checked`  | checked  |                |
| `disabled` | disabled |                |
| `value`    | value    |                |

<hr/>

## Exports

| Kind | Name    | Declaration | Module                                       | Package |
| ---- | ------- | ----------- | -------------------------------------------- | ------- |
| `js` | `Radio` | Radio       | ../../packages/core/src/radio-group/radio.ts |         |

# `../../packages/core/src/radio-group/register.ts`:

## Exports

| Kind                        | Name             | Declaration | Module                                        | Package |
| --------------------------- | ---------------- | ----------- | --------------------------------------------- | ------- |
| `custom-element-definition` | `sl-radio`       | Radio       | /packages/core/src/radio-group/radio.js       |         |
| `custom-element-definition` | `sl-radio-group` | RadioGroup  | /packages/core/src/radio-group/radio-group.js |         |

# `../../packages/core/src/select/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                  |
| ---- | ---- | ----------- | ------ | ------------------------ |
| `js` | `*`  | *           |        | ./select.js              |
| `js` | `*`  | *           |        | ./select-option.js       |
| `js` | `*`  | *           |        | ./select-option-group.js |

# `../../packages/core/src/select/register.ts`:

## Exports

| Kind                        | Name                     | Declaration       | Module                                           | Package |
| --------------------------- | ------------------------ | ----------------- | ------------------------------------------------ | ------- |
| `custom-element-definition` | `sl-select`              | Select            | /packages/core/src/select/select.js              |         |
| `custom-element-definition` | `sl-select-option`       | SelectOption      | /packages/core/src/select/select-option.js       |         |
| `custom-element-definition` | `sl-select-option-group` | SelectOptionGroup | /packages/core/src/select/select-option-group.js |         |
| `custom-element-definition` | `sl-select-overlay`      | SelectOverlay     | /packages/core/src/select/select-overlay.js      |         |

# `../../packages/core/src/select/select-option-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                     | Package |
| ---- | --------- | ----------- | ---------------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/select/select-option-group.scss.ts |         |

# `../../packages/core/src/select/select-option-group.ts`:

## class: `SelectOptionGroup`, `sl-select-option-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name         | Privacy | Type                  | Default | Description | Inherited From |
| ------------ | ------- | --------------------- | ------- | ----------- | -------------- |
| `groupTitle` |         | `string \| undefined` |         |             |                |

### Attributes

| Name          | Field      | Inherited From |
| ------------- | ---------- | -------------- |
| `group-title` | groupTitle |                |

<hr/>

## Exports

| Kind | Name                | Declaration       | Module                                                | Package |
| ---- | ------------------- | ----------------- | ----------------------------------------------------- | ------- |
| `js` | `SelectOptionGroup` | SelectOptionGroup | ../../packages/core/src/select/select-option-group.ts |         |

# `../../packages/core/src/select/select-option.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                               | Package |
| ---- | --------- | ----------- | ---------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/select/select-option.scss.ts |         |

# `../../packages/core/src/select/select-option.ts`:

## class: `SelectOption`, `sl-select-option`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name          | Privacy | Type                                 | Default                   | Description                                           | Inherited From |
| ------------- | ------- | ------------------------------------ | ------------------------- | ----------------------------------------------------- | -------------- |
| `value`       |         | `FormControlValue \| undefined`      |                           | Whether the option item is selected                   |                |
| `selected`    |         | `boolean`                            | `false`                   | Whether the option item is selected                   |                |
| `disabled`    |         | `boolean`                            | `false`                   | Whether the option item is disabled                   |                |
| `contentType` |         | `'string' \| 'element' \| undefined` |                           | Whether the content of the option item is a node      |                |
| `size`        |         | `{ width: number; height: number }`  | `{ width: 0, height: 0 }` |                                                       |                |
| `#observer`   | private | `ResizeObserver \| undefined`        |                           |                                                       |                |
| `#tabIndex`   | private | `string \| null`                     |                           | Get the selected tab button, or the first tab button. |                |

### Methods

| Name                    | Privacy   | Description                                                                                               | Parameters                                   | Return          | Inherited From |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------- | -------------- |
| `handleSelectionChange` | protected | Apply accessible attributes and values to the tab button.&#xA;Observe the selected property if it changes |                                              | `void`          |                |
| `#onSlotchange`         |           |                                                                                                           | `event: Event & { target: HTMLSlotElement }` | `Promise<void>` |                |
| `#handleResize`         |           |                                                                                                           | `mutations: ResizeObserverEntry[]`           | `void`          |                |

### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `value`       | value       |                |
| `selected`    | selected    |                |
| `disabled`    | disabled    |                |
| `contentType` | contentType |                |
| `size`        | size        |                |

<hr/>

## Exports

| Kind | Name           | Declaration  | Module                                          | Package |
| ---- | -------------- | ------------ | ----------------------------------------------- | ------- |
| `js` | `SelectOption` | SelectOption | ../../packages/core/src/select/select-option.ts |         |

# `../../packages/core/src/select/select-overlay.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                | Package |
| ---- | --------- | ----------- | ----------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/select/select-overlay.scss.ts |         |

# `../../packages/core/src/select/select-overlay.ts`:

## class: `SelectOverlay`, `sl-select-overlay`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                   | Module                                                | Package |
| ---------------------- | ----------------------------------------------------- | ------- |
| `AnchoredPopoverMixin` | /packages/core/src/popover/mixins/anchored-popover.js |         |

### Fields

| Name                 | Privacy | Type                       | Default                      | Description                               | Inherited From       |
| -------------------- | ------- | -------------------------- | ---------------------------- | ----------------------------------------- | -------------------- |
| `placement`          |         | `Placement`                | `'bottom-start'`             | Tooltip placement.                        | AnchoredPopoverMixin |
| `#events`            | private |                            | `new EventsController(this)` |                                           |                      |
| `#onPopoverHide`     | private |                            |                              |                                           | AnchoredPopoverMixin |
| `arrow`              |         | `HTMLElement \| undefined` |                              | The arrow pointing to the anchor element. | AnchoredPopoverMixin |
| `cleanupFloatingUI`  |         | `() => void \| undefined`  |                              | Cleanup callback for floating-ui.         | AnchoredPopoverMixin |
| `#anchorElement`     | private | `HTMLElement \| undefined` |                              |                                           | AnchoredMixin        |
| `anchorElement`      |         | `HTMLElement \| undefined` |                              |                                           | AnchoredMixin        |
| `#popoverOpen`       | private | `boolean`                  | `false`                      |                                           | PopoverMixin         |
| `#onDocumentClick`   | private |                            |                              |                                           | PopoverMixin         |
| `#onDocumentKeydown` | private |                            |                              |                                           | PopoverMixin         |
| `open`               |         | `boolean`                  | `false`                      | Whether the popover is open or not.       | PopoverMixin         |
| `receivesFocus`      |         | `'auto' \| undefined`      |                              |                                           | PopoverMixin         |
| `popoverOpen`        | public  | `boolean`                  |                              |                                           | PopoverMixin         |

### Methods

| Name                             | Privacy | Description                                                            | Parameters                      | Return          | Inherited From       |
| -------------------------------- | ------- | ---------------------------------------------------------------------- | ------------------------------- | --------------- | -------------------- |
| `show`                           |         |                                                                        | `target: HTMLElement`           | `void`          |                      |
| `hide`                           |         |                                                                        | `target: EventTarget \| null`   | `void`          |                      |
| `positionPopover`                |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `cleanupPopover`                 |         |                                                                        |                                 | `void`          | AnchoredPopoverMixin |
| `addEventListenersToAnchor`      |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `removeEventListenersFromAnchor` |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `firstUpdated`                   |         |                                                                        | `changes: PropertyValues<this>` | `void`          | AnchoredMixin        |
| `#resolveAnchor`                 |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `willUpdate`                     |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin         |
| `updated`                        |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin         |
| `showPopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `hidePopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `#setup`                         |         | Setup light dismiss handlers if no top-layer and not a manual popover. |                                 | `Promise<void>` | PopoverMixin         |
| `#cleanup`                       |         | Cleanup light dismiss handlers.                                        |                                 | `void`          | PopoverMixin         |

### Events

| Name          | Type    | Description | Inherited From |
| ------------- | ------- | ----------- | -------------- |
| `popovershow` | `Event` |             | PopoverMixin   |
| `popoverhide` | `Event` |             | PopoverMixin   |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `placement`      | placement     |                |
| `open`           | open          | PopoverMixin   |
| `receives-focus` | receivesFocus | PopoverMixin   |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                           | Package |
| ---- | --------------- | ------------- | ------------------------------------------------ | ------- |
| `js` | `SelectOverlay` | SelectOverlay | ../../packages/core/src/select/select-overlay.ts |         |

# `../../packages/core/src/select/select.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/select/select.scss.ts |         |

# `../../packages/core/src/select/select.stories.ts`:

## Variables

| Name               | Description | Type       |
| ------------------ | ----------- | ---------- |
| `API`              |             | `StoryObj` |
| `CustomComponents` |             | `StoryObj` |
| `InForm`           |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                           | Package |
| ---- | ------------------ | ---------------- | ------------------------------------------------ | ------- |
| `js` | `default`          |                  | ../../packages/core/src/select/select.stories.ts |         |
| `js` | `API`              | API              | ../../packages/core/src/select/select.stories.ts |         |
| `js` | `CustomComponents` | CustomComponents | ../../packages/core/src/select/select.stories.ts |         |
| `js` | `InForm`           | InForm           | ../../packages/core/src/select/select.stories.ts |         |

# `../../packages/core/src/select/select.ts`:

## class: `Select`, `sl-select`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module                                          | Package |
| ------------------ | ----------------------------------------------- | ------- |
| `FormControlMixin` | /packages/core/src/utils/mixins/form-control.js |         |

### Static Fields

| Name               | Privacy | Type      | Default                                                                                                                 | Description | Inherited From |
| ------------------ | ------- | --------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `formAssociated`   |         | `boolean` | `true`                                                                                                                  |             |                |
| `#observerOptions` | private | `object`  | `{
    attributes: true,
    subtree: true,
    attributeFilter: ['selected', 'size'],
    attributeOldValue: true
  }` |             |                |

### Fields

| Name                        | Privacy | Type                                             | Default                                                                                                                                                                                                                                                                                 | Description                                                                                                                     | Inherited From   |
| --------------------------- | ------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `overlay`                   |         | `SelectOverlay \| undefined`                     |                                                                                                                                                                                                                                                                                         |                                                                                                                                 |                  |
| `selectedOptionPlaceholder` |         | `HTMLElement \| undefined`                       |                                                                                                                                                                                                                                                                                         |                                                                                                                                 |                  |
| `options`                   |         | `SelectOption[] \| undefined`                    |                                                                                                                                                                                                                                                                                         | The slotted options.                                                                                                            |                  |
| `optionGroups`              |         | `SelectOptionGroup[] \| undefined`               |                                                                                                                                                                                                                                                                                         |                                                                                                                                 |                  |
| `size`                      |         | `{ width: string; height: string } \| undefined` | `{ width: '500px', height: '32px' }`                                                                                                                                                                                                                                                    | render helpers                                                                                                                  |                  |
| `maxOverlayHeight`          |         | `string \| undefined`                            |                                                                                                                                                                                                                                                                                         |                                                                                                                                 |                  |
| `#rovingTabindexController` | private |                                                  | `new RovingTabindexController<SelectOption>(this, {
    focusInIndex: (elements: SelectOption[]) => elements.findIndex(el => el.selected && !!this.overlay?.popoverOpen),
    elements: () => this.allOptions \|\| [],
    isFocusableElement: (el: SelectOption) => !el.disabled
  })` |                                                                                                                                 |                  |
| `#validation`               | private |                                                  | `new ValidationController(this, {
    validators: [requiredValidator]
  })`                                                                                                                                                                                                             |                                                                                                                                 |                  |
| `#observer`                 | private | `MutationObserver \| undefined`                  |                                                                                                                                                                                                                                                                                         |                                                                                                                                 |                  |
| `#selectId`                 | private |                                                  | `` `sl-select-${nextUniqueId++}` ``                                                                                                                                                                                                                                                     |                                                                                                                                 |                  |
| `allOptions`                |         | `SelectOption[]`                                 |                                                                                                                                                                                                                                                                                         |                                                                                                                                 |                  |
| `internals`                 |         |                                                  |                                                                                                                                                                                                                                                                                         | Element internals.                                                                                                              |                  |
| `selectedOption`            | private | `SelectOption \| null \| undefined`              |                                                                                                                                                                                                                                                                                         | The current tab node selected in the tab group.                                                                                 |                  |
| `#cachedValue`              | private | `FormControlValue \| undefined`                  |                                                                                                                                                                                                                                                                                         | The cached value for the form control.                                                                                          | FormControlMixin |
| `#formControlElement`       | private | `FormControlElement \| undefined`                |                                                                                                                                                                                                                                                                                         | The actual element that integrates with the form; either&#xA;a Form Associated Custom Element, or an `<input>` or `<textarea>`. | FormControlMixin |
| `disabled`                  |         | `boolean \| undefined`                           |                                                                                                                                                                                                                                                                                         | No interaction is possible with this control when disabled.                                                                     | FormControlMixin |
| `name`                      |         | `string \| undefined`                            |                                                                                                                                                                                                                                                                                         | The name of the form control.                                                                                                   | FormControlMixin |
| `required`                  |         | `boolean \| undefined`                           |                                                                                                                                                                                                                                                                                         | Whether this form control is a required field.                                                                                  | FormControlMixin |
| `formControlElement`        |         | `FormControlElement`                             |                                                                                                                                                                                                                                                                                         |                                                                                                                                 | FormControlMixin |
| `form`                      |         | `HTMLFormElement \| null`                        |                                                                                                                                                                                                                                                                                         |                                                                                                                                 | FormControlMixin |
| `labels`                    |         | `NodeListOf<HTMLLabelElement> \| null`           |                                                                                                                                                                                                                                                                                         |                                                                                                                                 | FormControlMixin |

### Methods

| Name                        | Privacy | Description                                                                                       | Parameters                                                        | Return    | Inherited From   |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------- | ---------------- |
| `openSelect`                |         |                                                                                                   | `{ target }: Event`                                               | `void`    |                  |
| `#closeSelect`              |         |                                                                                                   |                                                                   | `void`    |                  |
| `#handleOptionsSlotChange`  |         |                                                                                                   |                                                                   | `void`    |                  |
| `#handleMutation`           |         | If an option is selected programmatically update all the options or the size of the select itself | `mutations: MutationRecord[]`                                     | `void`    |                  |
| `#handleOptionChange`       |         | One of the options in the select has been clicked, get the right target and update the selection  | `event: Event`                                                    | `void`    |                  |
| `#updateSelectedOption`     |         | Update the selected option with attributes and values.                                            | `selectedOption: SelectOption`                                    | `void`    |                  |
| `#updateSize`               |         | Find the largest option and set the select to that width                                          |                                                                   | `void`    |                  |
| `#setSelectedOptionVisible` |         | Copy the value/represenation of the selected option to the placeholder                            | `option: SelectOption`                                            | `void`    |                  |
| `#handleOverlayKeydown`     |         | Handle keyboard accessible controls.                                                              | `event: KeyboardEvent`                                            | `void`    |                  |
| `#handleOverallKeydown`     |         | Handle keyboard accessible controls.                                                              | `event: KeyboardEvent`                                            | `void`    |                  |
| `updated`                   |         |                                                                                                   | `changes: PropertyValues<this>`                                   | `void`    | FormControlMixin |
| `checkValidity`             |         |                                                                                                   |                                                                   | `boolean` | FormControlMixin |
| `reportValidity`            |         |                                                                                                   |                                                                   | `boolean` | FormControlMixin |
| `setFormControlElement`     |         |                                                                                                   | `element: FormControlElement`                                     | `void`    | FormControlMixin |
| `setValidity`               |         |                                                                                                   | `flags: ValidityStateFlags, message: string, anchor: HTMLElement` | `void`    | FormControlMixin |
| `setFormValue`              |         |                                                                                                   | `value: FormControlValue`                                         | `void`    | FormControlMixin |

### Attributes

| Name               | Field            | Inherited From   |
| ------------------ | ---------------- | ---------------- |
| `size`             | size             |                  |
| `maxOverlayHeight` | maxOverlayHeight |                  |
| `disabled`         | disabled         | FormControlMixin |
| `name`             | name             | FormControlMixin |
| `required`         | required         | FormControlMixin |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                   | Package |
| ---- | -------- | ----------- | ---------------------------------------- | ------- |
| `js` | `Select` | Select      | ../../packages/core/src/select/select.ts |         |

# `../../packages/core/src/tabs/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package        |
| ---- | ---- | ----------- | ------ | -------------- |
| `js` | `*`  | *           |        | ./tab-group.js |
| `js` | `*`  | *           |        | ./tab-panel.js |
| `js` | `*`  | *           |        | ./tab.js       |

# `../../packages/core/src/tabs/register.ts`:

## Exports

| Kind                        | Name           | Declaration | Module                               | Package |
| --------------------------- | -------------- | ----------- | ------------------------------------ | ------- |
| `custom-element-definition` | `sl-tab`       | Tab         | /packages/core/src/tabs/tab.js       |         |
| `custom-element-definition` | `sl-tab-group` | TabGroup    | /packages/core/src/tabs/tab-group.js |         |
| `custom-element-definition` | `sl-tab-panel` | TabPanel    | /packages/core/src/tabs/tab-panel.js |         |

# `../../packages/core/src/tabs/tab-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                         | Package |
| ---- | --------- | ----------- | ---------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/tabs/tab-group.scss.ts |         |

# `../../packages/core/src/tabs/tab-group.stories.ts`:

## Variables

| Name                  | Description | Type       |
| --------------------- | ----------- | ---------- |
| `API`                 |             | `StoryObj` |
| `LongTitles`          |             | `StoryObj` |
| `ExternalInteraction` |             | `StoryObj` |
| `SingleTab`           |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name                  | Declaration         | Module                                            | Package |
| ---- | --------------------- | ------------------- | ------------------------------------------------- | ------- |
| `js` | `default`             |                     | ../../packages/core/src/tabs/tab-group.stories.ts |         |
| `js` | `API`                 | API                 | ../../packages/core/src/tabs/tab-group.stories.ts |         |
| `js` | `LongTitles`          | LongTitles          | ../../packages/core/src/tabs/tab-group.stories.ts |         |
| `js` | `ExternalInteraction` | ExternalInteraction | ../../packages/core/src/tabs/tab-group.stories.ts |         |
| `js` | `SingleTab`           | SingleTab           | ../../packages/core/src/tabs/tab-group.stories.ts |         |

# `../../packages/core/src/tabs/tab-group.ts`:

## class: `TabGroup`, `sl-tab-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                  |
| --------------------- | ------ | ------------------------ |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements |

### Static Fields

| Name               | Privacy | Type                | Default                                                                                                         | Description | Inherited From |
| ------------------ | ------- | ------------------- | --------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `scopedElements`   | private | `ScopedElementsMap` |                                                                                                                 |             |                |
| `#observerOptions` | private | `object`            | `{
    attributes: true,
    subtree: true,
    attributeFilter: ['selected'],
    attributeOldValue: true
  }` |             |                |

### Fields

| Name                        | Privacy | Type                            | Default                                                                                                                                                                                                                 | Description                                                           | Inherited From |
| --------------------------- | ------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------- |
| `#tabGroupId`               | private |                                 | `` `sl-tab-group-${nextUniqueId++}` ``                                                                                                                                                                                  | Unique ID for each tab group component present.                       |                |
| `#observer`                 | private | `MutationObserver \| undefined` |                                                                                                                                                                                                                         |                                                                       |                |
| `#rovingTabindexController` | private |                                 | `new RovingTabindexController<Tab>(this, {
    focusInIndex: (elements: Tab[]) => elements.findIndex(el => el.selected),
    elements: () => this.tabs \|\| [],
    isFocusableElement: (el: Tab) => !el.disabled
  })` |                                                                       |                |
| `tabs`                      |         | `Tab[] \| undefined`            |                                                                                                                                                                                                                         | The slotted tabs.                                                     |                |
| `selectedTab`               | private | `Tab \| null`                   |                                                                                                                                                                                                                         | The current tab node selected in the tab group.                       |                |
| `tabChange`                 |         | `EventEmitter<number>`          |                                                                                                                                                                                                                         |                                                                       |                |
| `vertical`                  |         | `boolean`                       | `false`                                                                                                                                                                                                                 | Renders the tabs vertically instead of the default horizontal         |                |
| `#initialSelectedTab`       | private | `Tab \| null`                   |                                                                                                                                                                                                                         | Get the selected tab button, or the first tab button.                 |                |
| `#handleMutation`           | private |                                 |                                                                                                                                                                                                                         | If the selected tab is selected programmatically update all the tabs. |                |

### Methods

| Name                        | Privacy | Description                                                                                | Parameters             | Return | Inherited From |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------ | ---------------------- | ------ | -------------- |
| `#updateSlots`              |         |                                                                                            |                        | `void` |                |
| `#setupTabs`                |         | Apply accessible attributes and values to the tab buttons.                                 |                        | `void` |                |
| `#setupPanels`              |         | Apply accessible attributes and values to the tab panels.                                  |                        | `void` |                |
| `#handleTabChange`          |         |                                                                                            | `event: Event`         | `void` |                |
| `#updateSelectedTab`        |         | Update the selected tab button with attributes and values.&#xA;Update the tab group state. | `selectedTab: Tab`     | `void` |                |
| `#handleKeydown`            |         | Handle keyboard accessible controls.                                                       | `event: KeyboardEvent` | `void` |                |
| `#updateSelectionIndicator` |         |                                                                                            |                        | `void` |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `vertical` | vertical |                |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                    | Package |
| ---- | ---------- | ----------- | ----------------------------------------- | ------- |
| `js` | `TabGroup` | TabGroup    | ../../packages/core/src/tabs/tab-group.ts |         |

# `../../packages/core/src/tabs/tab-panel.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                         | Package |
| ---- | --------- | ----------- | ---------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/tabs/tab-panel.scss.ts |         |

# `../../packages/core/src/tabs/tab-panel.ts`:

## class: `TabPanel`, `sl-tab-panel`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                    | Package |
| ---- | ---------- | ----------- | ----------------------------------------- | ------- |
| `js` | `TabPanel` | TabPanel    | ../../packages/core/src/tabs/tab-panel.ts |         |

# `../../packages/core/src/tabs/tab.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                   | Package |
| ---- | --------- | ----------- | ---------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/tabs/tab.scss.ts |         |

# `../../packages/core/src/tabs/tab.ts`:

## class: `Tab`, `sl-tab`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name       | Privacy | Type      | Default | Description                      | Inherited From |
| ---------- | ------- | --------- | ------- | -------------------------------- | -------------- |
| `selected` |         | `boolean` | `false` | Whether the tab item is selected |                |
| `disabled` |         | `boolean` | `false` | Whether the tab item is disabled |                |

### Methods

| Name                    | Privacy   | Description                                                                                               | Parameters | Return | Inherited From |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------- | ---------- | ------ | -------------- |
| `handleSelectionChange` | protected | Apply accessible attributes and values to the tab button.&#xA;Observe the selected property if it changes |            | `void` |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `selected` | selected |                |
| `disabled` | disabled |                |

<hr/>

## Exports

| Kind | Name  | Declaration | Module                              | Package |
| ---- | ----- | ----------- | ----------------------------------- | ------- |
| `js` | `Tab` | Tab         | ../../packages/core/src/tabs/tab.ts |         |

# `../../packages/core/src/textarea/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package       |
| ---- | ---- | ----------- | ------ | ------------- |
| `js` | `*`  | *           |        | ./textarea.js |

# `../../packages/core/src/textarea/register.ts`:

## Exports

| Kind                        | Name          | Declaration | Module                                  | Package |
| --------------------------- | ------------- | ----------- | --------------------------------------- | ------- |
| `custom-element-definition` | `sl-textarea` | Textarea    | /packages/core/src/textarea/textarea.js |         |

# `../../packages/core/src/textarea/textarea.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                            | Package |
| ---- | --------- | ----------- | ------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/textarea/textarea.scss.ts |         |

# `../../packages/core/src/textarea/textarea.stories.ts`:

## Variables

| Name               | Description | Type       |
| ------------------ | ----------- | ---------- |
| `API`              |             | `StoryObj` |
| `Disabled`         |             | `StoryObj` |
| `Label`            |             | `StoryObj` |
| `Hint`             |             | `StoryObj` |
| `RichLabelHint`    |             | `StoryObj` |
| `MinMaxLength`     |             | `StoryObj` |
| `CustomValidation` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                               | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------------------- | ------- |
| `js` | `default`          |                  | ../../packages/core/src/textarea/textarea.stories.ts |         |
| `js` | `API`              | API              | ../../packages/core/src/textarea/textarea.stories.ts |         |
| `js` | `Disabled`         | Disabled         | ../../packages/core/src/textarea/textarea.stories.ts |         |
| `js` | `Label`            | Label            | ../../packages/core/src/textarea/textarea.stories.ts |         |
| `js` | `Hint`             | Hint             | ../../packages/core/src/textarea/textarea.stories.ts |         |
| `js` | `RichLabelHint`    | RichLabelHint    | ../../packages/core/src/textarea/textarea.stories.ts |         |
| `js` | `MinMaxLength`     | MinMaxLength     | ../../packages/core/src/textarea/textarea.stories.ts |         |
| `js` | `CustomValidation` | CustomValidation | ../../packages/core/src/textarea/textarea.stories.ts |         |

# `../../packages/core/src/textarea/textarea.ts`:

## class: `Textarea`, `sl-textarea`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module                                   | Package |
| ------------------ | ---------------------------------------- | ------- |
| `FormControlMixin` | /packages/core/src/utils/mixins/index.js |         |
| `HintMixin`        | /packages/core/src/utils/mixins/index.js |         |

### Fields

| Name                  | Privacy | Type                                   | Default                                                                 | Description                                                                                                                     | Inherited From   |
| --------------------- | ------- | -------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `#events`             | private |                                        | `new EventsController(this, {
    click: this.#onClick
  })`            |                                                                                                                                 |                  |
| `#validation`         | private |                                        | `new ValidationController(this, {
    target: () => this.textarea
  })` |                                                                                                                                 |                  |
| `internals`           |         |                                        |                                                                         | Element internals.                                                                                                              |                  |
| `textarea`            |         | `HTMLTextAreaElement`                  |                                                                         | The textarea in the light DOM.                                                                                                  |                  |
| `maxLength`           |         | `number \| undefined`                  |                                                                         | Maximum length (number of characters).                                                                                          |                  |
| `minLength`           |         | `number \| undefined`                  |                                                                         | Minimum length (number of characters).                                                                                          |                  |
| `placeholder`         |         | `string \| undefined`                  |                                                                         | Placeholder text in the input.                                                                                                  |                  |
| `validators`          |         | `Validator[] \| undefined`             |                                                                         | Custom validators specified by the user.                                                                                        |                  |
| `value`               |         | `string \| undefined`                  |                                                                         | The value for the textarea.                                                                                                     |                  |
| `#cachedValue`        | private | `FormControlValue \| undefined`        |                                                                         | The cached value for the form control.                                                                                          | FormControlMixin |
| `#formControlElement` | private | `FormControlElement \| undefined`      |                                                                         | The actual element that integrates with the form; either&#xA;a Form Associated Custom Element, or an `<input>` or `<textarea>`. | FormControlMixin |
| `disabled`            |         | `boolean \| undefined`                 |                                                                         | No interaction is possible with this control when disabled.                                                                     | FormControlMixin |
| `name`                |         | `string \| undefined`                  |                                                                         | The name of the form control.                                                                                                   | FormControlMixin |
| `required`            |         | `boolean \| undefined`                 |                                                                         | Whether this form control is a required field.                                                                                  | FormControlMixin |
| `formControlElement`  |         | `FormControlElement`                   |                                                                         |                                                                                                                                 | FormControlMixin |
| `form`                |         | `HTMLFormElement \| null`              |                                                                         |                                                                                                                                 | FormControlMixin |
| `labels`              |         | `NodeListOf<HTMLLabelElement> \| null` |                                                                         |                                                                                                                                 | FormControlMixin |
| `hint`                |         | `string \| undefined`                  |                                                                         | The hint. If you need to display HTML, use the `hint` slot instead.                                                             | HintMixin        |

### Methods

| Name                    | Privacy | Description | Parameters                                                        | Return           | Inherited From   |
| ----------------------- | ------- | ----------- | ----------------------------------------------------------------- | ---------------- | ---------------- |
| `#onClick`              |         |             | `event: Event`                                                    | `void`           |                  |
| `#onInput`              |         |             | `{ target }: Event & { target: HTMLTextAreaElement }`             | `void`           |                  |
| `#onSlotchange`         |         |             | `event: Event & { target: HTMLSlotElement }`                      | `void`           |                  |
| `updated`               |         |             | `changes: PropertyValues<this>`                                   | `void`           | HintMixin        |
| `checkValidity`         |         |             |                                                                   | `boolean`        | FormControlMixin |
| `reportValidity`        |         |             |                                                                   | `boolean`        | FormControlMixin |
| `setFormControlElement` |         |             | `element: FormControlElement`                                     | `void`           | FormControlMixin |
| `setValidity`           |         |             | `flags: ValidityStateFlags, message: string, anchor: HTMLElement` | `void`           | FormControlMixin |
| `setFormValue`          |         |             | `value: FormControlValue`                                         | `void`           | FormControlMixin |
| `renderHint`            |         |             |                                                                   | `TemplateResult` | HintMixin        |
| `#updateHint`           |         |             |                                                                   | `void`           | HintMixin        |
| `#removeHint`           |         |             |                                                                   | `void`           | HintMixin        |

### Attributes

| Name          | Field       | Inherited From   |
| ------------- | ----------- | ---------------- |
| `maxlength`   | maxLength   |                  |
| `minlength`   | minLength   |                  |
| `placeholder` | placeholder |                  |
| `value`       | value       |                  |
| `disabled`    | disabled    | FormControlMixin |
| `name`        | name        | FormControlMixin |
| `required`    | required    | FormControlMixin |
| `hint`        | hint        | HintMixin        |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                       | Package |
| ---- | ---------- | ----------- | -------------------------------------------- | ------- |
| `js` | `Textarea` | Textarea    | ../../packages/core/src/textarea/textarea.ts |         |

# `../../packages/core/src/utils/css.ts`:

## Variables

| Name                     | Description | Type      |
| ------------------------ | ----------- | --------- |
| `supportsTopLayer`       |             |           |
| `supportsHas`            |             |           |
| `supportsAnchor`         |             | `boolean` |
| `firstFocusableSelector` |             | `string`  |

<hr/>

## Exports

| Kind | Name                     | Declaration            | Module                               | Package |
| ---- | ------------------------ | ---------------------- | ------------------------------------ | ------- |
| `js` | `supportsTopLayer`       | supportsTopLayer       | ../../packages/core/src/utils/css.ts |         |
| `js` | `supportsHas`            | supportsHas            | ../../packages/core/src/utils/css.ts |         |
| `js` | `supportsAnchor`         | supportsAnchor         | ../../packages/core/src/utils/css.ts |         |
| `js` | `firstFocusableSelector` | firstFocusableSelector | ../../packages/core/src/utils/css.ts |         |

# `../../packages/core/src/utils/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./css.js        |
| `js` | `*`  | *           |        | ./path.js       |
| `js` | `*`  | *           |        | ./string.js     |
| `js` | `*`  | *           |        | ./validators.js |

# `../../packages/core/src/utils/path.ts`:

## Functions

| Name              | Description | Parameters              | Return    |
| ----------------- | ----------- | ----------------------- | --------- |
| `getNameByPath`   |             | `path: string`          | `string`  |
| `getStringByPath` |             | `object: unknown, path` | `string`  |
| `getValueByPath`  |             | `object: unknown, path` | `unknown` |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                | Package |
| ---- | ----------------- | --------------- | ------------------------------------- | ------- |
| `js` | `getNameByPath`   | getNameByPath   | ../../packages/core/src/utils/path.ts |         |
| `js` | `getStringByPath` | getStringByPath | ../../packages/core/src/utils/path.ts |         |
| `js` | `getValueByPath`  | getValueByPath  | ../../packages/core/src/utils/path.ts |         |

# `../../packages/core/src/utils/string.ts`:

## Functions

| Name         | Description                                                                                                                                                                                                                                                                                                                                                       | Parameters    | Return |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| `camelize`   | Returns the lowerCamelCase form of a string.&#xA;&#xA;\```javascript&#xA;camelize('innerHTML')          // 'innerHTML'&#xA;camelize('action_name')        // 'actionName'&#xA;camelize('css-class-name')     // 'cssClassName'&#xA;camelize('my favorite items')  // 'myFavoriteItems'&#xA;camelize('My Favorite Items')  // 'myFavoriteItems'&#xA;\```           | `str: string` |        |
| `capitalize` | Returns the Capitalized form of a string&#xA;&#xA;\```javascript&#xA;capitalize('innerHTML')         // 'InnerHTML'&#xA;capitalize('action_name')       // 'Action_name'&#xA;capitalize('css-class-name')    // 'Css-class-name'&#xA;capitalize('my favorite items') // 'My favorite items'&#xA;\```                                                              | `str: string` |        |
| `classify`   | Returns the UpperCamelCase form of a string.&#xA;&#xA;\```javascript&#xA;classify('innerHTML')          // 'InnerHTML'&#xA;classify('action_name')        // 'ActionName'&#xA;classify('css-class-name')     // 'CssClassName'&#xA;classify('my favorite items')  // 'MyFavoriteItems'&#xA;\```                                                                   | `str: string` |        |
| `dasherize`  | Replaces underscores, spaces, or camelCase with dashes.&#xA;&#xA;\```javascript&#xA;dasherize('innerHTML')         // 'inner-html'&#xA;dasherize('action_name')       // 'action-name'&#xA;dasherize('css-class-name')    // 'css-class-name'&#xA;dasherize('my favorite items') // 'my-favorite-items'&#xA;\```                                                  | `str: string` |        |
| `decamelize` | Converts a camelized string into all lower case separated by underscores.&#xA;&#xA;\```javascript&#xA;decamelize('innerHTML')         // 'inner_html'&#xA;decamelize('action_name')       // 'action_name'&#xA;decamelize('css-class-name')    // 'css-class-name'&#xA;decamelize('my favorite items') // 'my favorite items'&#xA;\```                            | `str: string` |        |
| `humanize`   | Returns the Humanized form of a string&#xA;&#xA;\```javascript&#xA;humanize('innerHTML')         // 'Inner HTML'&#xA;humanize('action_name')       // 'Action name'&#xA;humanize('css-class-name')    // 'Css class name'&#xA;humanize('my favorite items') // 'My favorite items'&#xA;\```                                                                       | `str: string` |        |
| `underscore` | More general than decamelize. Returns the lower\\_case\\_and\\_underscored&#xA;form of a string.&#xA;&#xA;\```javascript&#xA;underscore('innerHTML')          // 'inner_html'&#xA;underscore('action_name')        // 'action_name'&#xA;underscore('css-class-name')     // 'css_class_name'&#xA;underscore('my favorite items')  // 'my_favorite_items'&#xA;\``` | `str: string` |        |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                  | Package |
| ---- | ------------ | ----------- | --------------------------------------- | ------- |
| `js` | `camelize`   | camelize    | ../../packages/core/src/utils/string.ts |         |
| `js` | `capitalize` | capitalize  | ../../packages/core/src/utils/string.ts |         |
| `js` | `classify`   | classify    | ../../packages/core/src/utils/string.ts |         |
| `js` | `dasherize`  | dasherize   | ../../packages/core/src/utils/string.ts |         |
| `js` | `decamelize` | decamelize  | ../../packages/core/src/utils/string.ts |         |
| `js` | `humanize`   | humanize    | ../../packages/core/src/utils/string.ts |         |
| `js` | `underscore` | underscore  | ../../packages/core/src/utils/string.ts |         |

# `../../packages/core/src/utils/validators.ts`:

## Variables

| Name                    | Description | Type        |
| ----------------------- | ----------- | ----------- |
| `requiredValidator`     |             | `Validator` |
| `programmaticValidator` |             | `Validator` |
| `minLengthValidator`    |             | `Validator` |
| `maxLengthValidator`    |             | `Validator` |
| `patternValidator`      |             | `Validator` |

<hr/>

## Exports

| Kind | Name                    | Declaration           | Module                                      | Package |
| ---- | ----------------------- | --------------------- | ------------------------------------------- | ------- |
| `js` | `requiredValidator`     | requiredValidator     | ../../packages/core/src/utils/validators.ts |         |
| `js` | `programmaticValidator` | programmaticValidator | ../../packages/core/src/utils/validators.ts |         |
| `js` | `minLengthValidator`    | minLengthValidator    | ../../packages/core/src/utils/validators.ts |         |
| `js` | `maxLengthValidator`    | maxLengthValidator    | ../../packages/core/src/utils/validators.ts |         |
| `js` | `patternValidator`      | patternValidator      | ../../packages/core/src/utils/validators.ts |         |

# `../../packages/core/src/tooltip/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                |
| ---- | ---- | ----------- | ------ | ---------------------- |
| `js` | `*`  | *           |        | ./tooltip.js           |
| `js` | `*`  | *           |        | ./tooltip-directive.js |

# `../../packages/core/src/tooltip/register.ts`:

## Exports

| Kind                        | Name         | Declaration | Module                                | Package |
| --------------------------- | ------------ | ----------- | ------------------------------------- | ------- |
| `custom-element-definition` | `sl-tooltip` | Tooltip     | /packages/core/src/tooltip/tooltip.js |         |

# `../../packages/core/src/tooltip/tooltip-directive.ts`:

## class: `TooltipDirective`

### Superclass

| Name        | Module | Package          |
| ----------- | ------ | ---------------- |
| `Directive` |        | lit/directive.js |

### Fields

| Name           | Privacy | Type                       | Default | Description | Inherited From |
| -------------- | ------- | -------------------------- | ------- | ----------- | -------------- |
| `content`      |         | `unknown \| undefined`     |         |             |                |
| `didSetupLazy` |         | `boolean`                  | `false` |             |                |
| `part`         |         | `ElementPart \| undefined` |         |             |                |
| `tooltip`      |         | `Tooltip \| undefined`     |         |             |                |

### Methods

| Name            | Privacy | Description | Parameters | Return | Inherited From |
| --------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `renderContent` |         |             |            | `void` |                |
| `setupLazy`     |         |             |            | `void` |                |

<hr/>

## Variables

| Name      | Description | Type |
| --------- | ----------- | ---- |
| `tooltip` |             |      |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                               | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------------------- | ------- |
| `js` | `TooltipDirective` | TooltipDirective | ../../packages/core/src/tooltip/tooltip-directive.ts |         |
| `js` | `tooltip`          | tooltip          | ../../packages/core/src/tooltip/tooltip-directive.ts |         |

# `../../packages/core/src/tooltip/tooltip.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                          | Package |
| ---- | --------- | ----------- | ----------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/core/src/tooltip/tooltip.scss.ts |         |

# `../../packages/core/src/tooltip/tooltip.stories.ts`:

## Variables

| Name        | Description | Type       |
| ----------- | ----------- | ---------- |
| `API`       |             | `StoryObj` |
| `Directive` |             | `StoryObj` |
| `Overflow`  |             | `StoryObj` |
| `Shared`    |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                             | Package |
| ---- | ----------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default`   |             | ../../packages/core/src/tooltip/tooltip.stories.ts |         |
| `js` | `API`       | API         | ../../packages/core/src/tooltip/tooltip.stories.ts |         |
| `js` | `Directive` | Directive   | ../../packages/core/src/tooltip/tooltip.stories.ts |         |
| `js` | `Overflow`  | Overflow    | ../../packages/core/src/tooltip/tooltip.stories.ts |         |
| `js` | `Shared`    | Shared      | ../../packages/core/src/tooltip/tooltip.stories.ts |         |

# `../../packages/core/src/tooltip/tooltip.ts`:

## class: `Tooltip`, `sl-tooltip`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                   | Module                                                | Package |
| ---------------------- | ----------------------------------------------------- | ------- |
| `AnchoredPopoverMixin` | /packages/core/src/popover/mixins/anchored-popover.js |         |

### Static Methods

| Name   | Privacy | Description | Parameters                                             | Return | Inherited From |
| ------ | ------- | ----------- | ------------------------------------------------------ | ------ | -------------- |
| `lazy` |         |             | `target: Element, callback: (target: Tooltip) => void` | `void` |                |

### Fields

| Name                 | Privacy | Type                       | Default                      | Description                               | Inherited From       |
| -------------------- | ------- | -------------------------- | ---------------------------- | ----------------------------------------- | -------------------- |
| `#events`            | private |                            | `new EventsController(this)` |                                           |                      |
| `#matchesAnchor`     | private |                            |                              |                                           |                      |
| `#onHide`            | private |                            |                              |                                           |                      |
| `#onShow`            | private |                            |                              |                                           |                      |
| `placement`          |         | `Placement`                | `'bottom'`                   | Tooltip placement.                        | AnchoredPopoverMixin |
| `#onPopoverHide`     | private |                            |                              |                                           | AnchoredPopoverMixin |
| `arrow`              |         | `HTMLElement \| undefined` |                              | The arrow pointing to the anchor element. | AnchoredPopoverMixin |
| `cleanupFloatingUI`  |         | `() => void \| undefined`  |                              | Cleanup callback for floating-ui.         | AnchoredPopoverMixin |
| `#anchorElement`     | private | `HTMLElement \| undefined` |                              |                                           | AnchoredMixin        |
| `anchorElement`      |         | `HTMLElement \| undefined` |                              |                                           | AnchoredMixin        |
| `#popoverOpen`       | private | `boolean`                  | `false`                      |                                           | PopoverMixin         |
| `#onDocumentClick`   | private |                            |                              |                                           | PopoverMixin         |
| `#onDocumentKeydown` | private |                            |                              |                                           | PopoverMixin         |
| `open`               |         | `boolean`                  | `false`                      | Whether the popover is open or not.       | PopoverMixin         |
| `receivesFocus`      |         | `'auto' \| undefined`      |                              |                                           | PopoverMixin         |
| `popoverOpen`        | public  | `boolean`                  |                              |                                           | PopoverMixin         |

### Methods

| Name                             | Privacy | Description                                                            | Parameters                      | Return          | Inherited From       |
| -------------------------------- | ------- | ---------------------------------------------------------------------- | ------------------------------- | --------------- | -------------------- |
| `positionPopover`                |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `cleanupPopover`                 |         |                                                                        |                                 | `void`          | AnchoredPopoverMixin |
| `addEventListenersToAnchor`      |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `removeEventListenersFromAnchor` |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `firstUpdated`                   |         |                                                                        | `changes: PropertyValues<this>` | `void`          | AnchoredMixin        |
| `#resolveAnchor`                 |         |                                                                        |                                 | `void`          | AnchoredMixin        |
| `willUpdate`                     |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin         |
| `updated`                        |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin         |
| `showPopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `hidePopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin         |
| `#setup`                         |         | Setup light dismiss handlers if no top-layer and not a manual popover. |                                 | `Promise<void>` | PopoverMixin         |
| `#cleanup`                       |         | Cleanup light dismiss handlers.                                        |                                 | `void`          | PopoverMixin         |

### Events

| Name          | Type    | Description | Inherited From |
| ------------- | ------- | ----------- | -------------- |
| `popovershow` | `Event` |             | PopoverMixin   |
| `popoverhide` | `Event` |             | PopoverMixin   |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `placement`      | placement     |                |
| `open`           | open          | PopoverMixin   |
| `receives-focus` | receivesFocus | PopoverMixin   |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                     | Package |
| ---- | --------- | ----------- | ------------------------------------------ | ------- |
| `js` | `Tooltip` | Tooltip     | ../../packages/core/src/tooltip/tooltip.ts |         |

# `../../packages/core/src/popover/utils/position-anchored-element.ts`:

## Functions

| Name                      | Description | Parameters                                                                           | Return         |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------ | -------------- |
| `flipPlacement`           |             | `placement: Placement`                                                               | `Placement`    |
| `positionAnchoredElement` |             | `element: HTMLElement, anchor: HTMLElement, options: PositionAnchoredElementOptions` | `(() => void)` |

<hr/>

## Exports

| Kind | Name                      | Declaration             | Module                                                             | Package |
| ---- | ------------------------- | ----------------------- | ------------------------------------------------------------------ | ------- |
| `js` | `Placement`               | Placement               | ../../packages/core/src/popover/utils/position-anchored-element.ts |         |
| `js` | `flipPlacement`           | flipPlacement           | ../../packages/core/src/popover/utils/position-anchored-element.ts |         |
| `js` | `positionAnchoredElement` | positionAnchoredElement | ../../packages/core/src/popover/utils/position-anchored-element.ts |         |

# `../../packages/core/src/popover/mixins/anchored-popover.ts`:

## mixin: `AnchoredPopoverMixin`

### Mixins

| Name            | Module                                        | Package |
| --------------- | --------------------------------------------- | ------- |
| `AnchoredMixin` | /packages/core/src/popover/mixins/anchored.js |         |
| `PopoverMixin`  | /packages/core/src/popover/mixins/popover.js  |         |

### Parameters

| Name          | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `constructor` | `T`  |         |             |

### Fields

| Name                 | Privacy | Type                       | Default    | Description                                                  | Inherited From |
| -------------------- | ------- | -------------------------- | ---------- | ------------------------------------------------------------ | -------------- |
| `#onPopoverHide`     | private |                            |            |                                                              |                |
| `arrow`              |         | `HTMLElement \| undefined` |            | The arrow pointing to the anchor element.                    |                |
| `placement`          |         | `Placement`                | `'bottom'` | The placement of the popover relative to the anchor element. |                |
| `cleanupFloatingUI`  |         | `() => void \| undefined`  |            | Cleanup callback for floating-ui.                            |                |
| `#anchorElement`     | private | `HTMLElement \| undefined` |            |                                                              | AnchoredMixin  |
| `anchorElement`      |         | `HTMLElement \| undefined` |            |                                                              | AnchoredMixin  |
| `#popoverOpen`       | private | `boolean`                  | `false`    |                                                              | PopoverMixin   |
| `#onDocumentClick`   | private |                            |            |                                                              | PopoverMixin   |
| `#onDocumentKeydown` | private |                            |            |                                                              | PopoverMixin   |
| `open`               |         | `boolean`                  | `false`    | Whether the popover is open or not.                          | PopoverMixin   |
| `receivesFocus`      |         | `'auto' \| undefined`      |            |                                                              | PopoverMixin   |
| `popoverOpen`        | public  | `boolean`                  |            |                                                              | PopoverMixin   |

### Methods

| Name                             | Privacy | Description                                                            | Parameters                      | Return          | Inherited From |
| -------------------------------- | ------- | ---------------------------------------------------------------------- | ------------------------------- | --------------- | -------------- |
| `positionPopover`                |         |                                                                        |                                 | `void`          | PopoverMixin   |
| `cleanupPopover`                 |         |                                                                        |                                 | `void`          |                |
| `addEventListenersToAnchor`      |         |                                                                        |                                 | `void`          | AnchoredMixin  |
| `removeEventListenersFromAnchor` |         |                                                                        |                                 | `void`          | AnchoredMixin  |
| `firstUpdated`                   |         |                                                                        | `changes: PropertyValues<this>` | `void`          | AnchoredMixin  |
| `#resolveAnchor`                 |         |                                                                        |                                 | `void`          | AnchoredMixin  |
| `willUpdate`                     |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin   |
| `updated`                        |         |                                                                        | `changes: PropertyValues<this>` | `void`          | PopoverMixin   |
| `showPopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin   |
| `hidePopover`                    |         |                                                                        |                                 | `void`          | PopoverMixin   |
| `#setup`                         |         | Setup light dismiss handlers if no top-layer and not a manual popover. |                                 | `Promise<void>` | PopoverMixin   |
| `#cleanup`                       |         | Cleanup light dismiss handlers.                                        |                                 | `void`          | PopoverMixin   |

### Events

| Name          | Type    | Description | Inherited From |
| ------------- | ------- | ----------- | -------------- |
| `popovershow` | `Event` |             | PopoverMixin   |
| `popoverhide` | `Event` |             | PopoverMixin   |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `open`           | open          | PopoverMixin   |
| `receives-focus` | receivesFocus | PopoverMixin   |

<hr/>

## Exports

| Kind | Name                   | Declaration          | Module                                                     | Package |
| ---- | ---------------------- | -------------------- | ---------------------------------------------------------- | ------- |
| `js` | `AnchoredPopoverMixin` | AnchoredPopoverMixin | ../../packages/core/src/popover/mixins/anchored-popover.ts |         |

# `../../packages/core/src/popover/mixins/anchored.ts`:

## mixin: `AnchoredMixin`

### Parameters

| Name          | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `constructor` | `T`  |         |             |

### Fields

| Name             | Privacy | Type                       | Default | Description | Inherited From |
| ---------------- | ------- | -------------------------- | ------- | ----------- | -------------- |
| `#anchorElement` | private | `HTMLElement \| undefined` |         |             |                |
| `anchorElement`  |         | `HTMLElement \| undefined` |         |             |                |

### Methods

| Name                             | Privacy | Description | Parameters                      | Return | Inherited From |
| -------------------------------- | ------- | ----------- | ------------------------------- | ------ | -------------- |
| `addEventListenersToAnchor`      |         |             |                                 | `void` |                |
| `removeEventListenersFromAnchor` |         |             |                                 | `void` |                |
| `firstUpdated`                   |         |             | `changes: PropertyValues<this>` | `void` |                |
| `#resolveAnchor`                 |         |             |                                 | `void` |                |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                             | Package |
| ---- | --------------- | ------------- | -------------------------------------------------- | ------- |
| `js` | `AnchoredMixin` | AnchoredMixin | ../../packages/core/src/popover/mixins/anchored.ts |         |

# `../../packages/core/src/popover/mixins/popover.ts`:

## mixin: `PopoverMixin`

### Parameters

| Name          | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `constructor` | `T`  |         |             |

### Fields

| Name                 | Privacy | Type                  | Default | Description                         | Inherited From |
| -------------------- | ------- | --------------------- | ------- | ----------------------------------- | -------------- |
| `#popoverOpen`       | private | `boolean`             | `false` |                                     |                |
| `#onDocumentClick`   | private |                       |         |                                     |                |
| `#onDocumentKeydown` | private |                       |         |                                     |                |
| `open`               |         | `boolean`             | `false` | Whether the popover is open or not. |                |
| `receivesFocus`      |         | `'auto' \| undefined` |         |                                     |                |
| `popoverOpen`        | public  | `boolean`             |         |                                     |                |

### Methods

| Name              | Privacy | Description                                                            | Parameters                      | Return          | Inherited From |
| ----------------- | ------- | ---------------------------------------------------------------------- | ------------------------------- | --------------- | -------------- |
| `willUpdate`      |         |                                                                        | `changes: PropertyValues<this>` | `void`          |                |
| `updated`         |         |                                                                        | `changes: PropertyValues<this>` | `void`          |                |
| `showPopover`     |         |                                                                        |                                 | `void`          |                |
| `hidePopover`     |         |                                                                        |                                 | `void`          |                |
| `positionPopover` |         |                                                                        |                                 | `void`          |                |
| `#setup`          |         | Setup light dismiss handlers if no top-layer and not a manual popover. |                                 | `Promise<void>` |                |
| `#cleanup`        |         | Cleanup light dismiss handlers.                                        |                                 | `void`          |                |

### Events

| Name          | Type    | Description | Inherited From |
| ------------- | ------- | ----------- | -------------- |
| `popovershow` | `Event` |             |                |
| `popoverhide` | `Event` |             |                |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `open`           | open          |                |
| `receives-focus` | receivesFocus |                |

<hr/>

## Variables

| Name                 | Description | Type             |
| -------------------- | ----------- | ---------------- |
| `popoverMixinStyles` |             | `CSSResultGroup` |

<hr/>

## Exports

| Kind | Name                 | Declaration        | Module                                            | Package |
| ---- | -------------------- | ------------------ | ------------------------------------------------- | ------- |
| `js` | `popoverMixinStyles` | popoverMixinStyles | ../../packages/core/src/popover/mixins/popover.ts |         |
| `js` | `PopoverMixin`       | PopoverMixin       | ../../packages/core/src/popover/mixins/popover.ts |         |

# `../../packages/core/src/utils/controllers/events.ts`:

## class: `EventsController`

### Fields

| Name         | Privacy | Type                                   | Default | Description | Inherited From |
| ------------ | ------- | -------------------------------------- | ------- | ----------- | -------------- |
| `#host`      | private | `ReactiveControllerHost & HTMLElement` | `host`  |             |                |
| `#listeners` | private | `Array<() => void>`                    | `[]`    |             |                |

### Methods

| Name               | Privacy | Description | Parameters                                                                                                                                            | Return | Inherited From |
| ------------------ | ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------- |
| `hostDisconnected` |         |             |                                                                                                                                                       | `void` |                |
| `listen`           |         |             | `host: Node, type: K, listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => void, options: boolean \| AddEventListenerOptions` | `void` |                |
| `listen`           |         |             | `host: Node, type: string, listener: unknown, options: boolean \| AddEventListenerOptions`                                                            | `void` |                |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                              | Package |
| ---- | ------------------ | ---------------- | --------------------------------------------------- | ------- |
| `js` | `EventsController` | EventsController | ../../packages/core/src/utils/controllers/events.ts |         |

# `../../packages/core/src/utils/controllers/focus-group.ts`:

## class: `FocusGroupController`

### Fields

| Name                 | Privacy   | Type               | Default    | Description | Inherited From |
| -------------------- | --------- | ------------------ | ---------- | ----------- | -------------- |
| `#currentIndex`      | private   | `number`           | `-1`       |             |                |
| `#direction`         | private   |                    |            |             |                |
| `#elements`          | private   | `() => T[]`        | `elements` |             |                |
| `#focused`           | private   | `boolean`          | `false`    |             |                |
| `#focusInIndex`      | private   |                    |            |             |                |
| `#listenerScope`     | private   |                    |            |             |                |
| `cachedElements`     | protected | `T[] \| undefined` |            |             |                |
| `currentIndex`       |           | `number`           |            |             |                |
| `direction`          |           | `DirectionTypes`   |            |             |                |
| `elements`           |           | `T[]`              |            |             |                |
| `elementEnterAction` |           |                    |            |             |                |
| `focused`            | protected | `boolean`          |            |             |                |
| `focusInElement`     |           | `T`                |            |             |                |
| `focusInIndex`       |           | `number`           |            |             |                |
| `directionLength`    |           | `number`           | `5`        |             |                |
| `host`               |           | `ReactiveElement`  | `host`     |             |                |
| `isFocusableElement` |           |                    |            |             |                |
| `offset`             |           | `number`           | `0`        |             |                |
| `handleFocusin`      |           |                    |            |             |                |
| `handleFocusout`     |           |                    |            |             |                |
| `handleKeydown`      |           |                    |            |             |                |

### Methods

| Name                         | Privacy | Description | Parameters              | Return    | Inherited From |
| ---------------------------- | ------- | ----------- | ----------------------- | --------- | -------------- |
| `isEventWithinListenerScope` |         |             | `event: Event`          | `boolean` |                |
| `hostConnected`              |         |             |                         | `void`    |                |
| `hostDisconnected`           |         |             |                         | `void`    |                |
| `focus`                      |         |             | `options: FocusOptions` | `void`    |                |
| `clearElementCache`          |         |             | `offset`                | `void`    |                |
| `setCurrentIndexCircularly`  |         |             | `diff: number`          | `void`    |                |
| `hostContainsFocus`          |         |             |                         | `void`    |                |
| `hostNoLongerContainsFocus`  |         |             |                         | `void`    |                |
| `isRelatedTargetAnElement`   |         |             | `event: FocusEvent`     | `boolean` |                |
| `acceptsEventCode`           |         |             | `code: string`          | `boolean` |                |
| `manage`                     |         |             |                         | `void`    |                |
| `unmanage`                   |         |             |                         | `void`    |                |
| `addEventListeners`          |         |             |                         | `void`    |                |
| `removeEventListeners`       |         |             |                         | `void`    |                |

<hr/>

## Exports

| Kind | Name                   | Declaration          | Module                                                   | Package |
| ---- | ---------------------- | -------------------- | -------------------------------------------------------- | ------- |
| `js` | `FocusGroupController` | FocusGroupController | ../../packages/core/src/utils/controllers/focus-group.ts |         |

# `../../packages/core/src/utils/controllers/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package              |
| ---- | ---- | ----------- | ------ | -------------------- |
| `js` | `*`  | *           |        | ./events.js          |
| `js` | `*`  | *           |        | ./focus-group.js     |
| `js` | `*`  | *           |        | ./roving-tabindex.js |
| `js` | `*`  | *           |        | ./selection.js       |
| `js` | `*`  | *           |        | ./validation.js      |

# `../../packages/core/src/utils/controllers/roving-tabindex.ts`:

## class: `RovingTabindexController`

### Superclass

| Name                   | Module                                              | Package |
| ---------------------- | --------------------------------------------------- | ------- |
| `FocusGroupController` | /packages/core/src/utils/controllers/focus-group.js |         |

### Fields

| Name                          | Privacy   | Type               | Default    | Description | Inherited From       |
| ----------------------------- | --------- | ------------------ | ---------- | ----------- | -------------------- |
| `focused`                     | protected | `boolean`          |            |             | FocusGroupController |
| `managed`                     | private   | `boolean`          | `true`     |             |                      |
| `manageIndexesAnimationFrame` | private   | `number`           | `0`        |             |                      |
| `#currentIndex`               | private   | `number`           | `-1`       |             | FocusGroupController |
| `#direction`                  | private   |                    |            |             | FocusGroupController |
| `#elements`                   | private   | `() => T[]`        | `elements` |             | FocusGroupController |
| `#focused`                    | private   | `boolean`          | `false`    |             | FocusGroupController |
| `#focusInIndex`               | private   |                    |            |             | FocusGroupController |
| `#listenerScope`              | private   |                    |            |             | FocusGroupController |
| `cachedElements`              | protected | `T[] \| undefined` |            |             | FocusGroupController |
| `currentIndex`                |           | `number`           |            |             | FocusGroupController |
| `direction`                   |           | `DirectionTypes`   |            |             | FocusGroupController |
| `elements`                    |           | `T[]`              |            |             | FocusGroupController |
| `elementEnterAction`          |           |                    |            |             | FocusGroupController |
| `focusInElement`              |           | `T`                |            |             | FocusGroupController |
| `focusInIndex`                |           | `number`           |            |             | FocusGroupController |
| `directionLength`             |           | `number`           | `5`        |             | FocusGroupController |
| `host`                        |           | `ReactiveElement`  | `host`     |             | FocusGroupController |
| `isFocusableElement`          |           |                    |            |             | FocusGroupController |
| `offset`                      |           | `number`           | `0`        |             | FocusGroupController |
| `handleFocusin`               |           |                    |            |             | FocusGroupController |
| `handleFocusout`              |           |                    |            |             | FocusGroupController |
| `handleKeydown`               |           |                    |            |             | FocusGroupController |

### Methods

| Name                         | Privacy | Description | Parameters                                           | Return    | Inherited From       |
| ---------------------------- | ------- | ----------- | ---------------------------------------------------- | --------- | -------------------- |
| `clearElementCache`          |         |             | `offset`                                             | `void`    | FocusGroupController |
| `manageTabindexes`           |         |             |                                                      | `void`    |                      |
| `updateTabindexes`           |         |             | `getTabIndex: (el: HTMLElement) => UpdateTabIndexes` | `void`    |                      |
| `manage`                     |         |             |                                                      | `void`    | FocusGroupController |
| `unmanage`                   |         |             |                                                      | `void`    | FocusGroupController |
| `hostUpdated`                |         |             |                                                      | `void`    |                      |
| `isEventWithinListenerScope` |         |             | `event: Event`                                       | `boolean` | FocusGroupController |
| `hostConnected`              |         |             |                                                      | `void`    | FocusGroupController |
| `hostDisconnected`           |         |             |                                                      | `void`    | FocusGroupController |
| `focus`                      |         |             | `options: FocusOptions`                              | `void`    | FocusGroupController |
| `setCurrentIndexCircularly`  |         |             | `diff: number`                                       | `void`    | FocusGroupController |
| `hostContainsFocus`          |         |             |                                                      | `void`    | FocusGroupController |
| `hostNoLongerContainsFocus`  |         |             |                                                      | `void`    | FocusGroupController |
| `isRelatedTargetAnElement`   |         |             | `event: FocusEvent`                                  | `boolean` | FocusGroupController |
| `acceptsEventCode`           |         |             | `code: string`                                       | `boolean` | FocusGroupController |
| `addEventListeners`          |         |             |                                                      | `void`    | FocusGroupController |
| `removeEventListeners`       |         |             |                                                      | `void`    | FocusGroupController |

<hr/>

## Exports

| Kind | Name                       | Declaration              | Module                                                       | Package |
| ---- | -------------------------- | ------------------------ | ------------------------------------------------------------ | ------- |
| `js` | `RovingTabindexController` | RovingTabindexController | ../../packages/core/src/utils/controllers/roving-tabindex.ts |         |

# `../../packages/core/src/utils/controllers/selection.ts`:

## class: `SelectionController`

### Fields

| Name         | Privacy | Type                     | Default               | Description                                                                                                                    | Inherited From |
| ------------ | ------- | ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `#host`      | private | `ReactiveControllerHost` | `host`                |                                                                                                                                |                |
| `#selectAll` | private | `boolean`                | `false`               | Whether all items are selected or not.                                                                                         |                |
| `#selection` | private |                          | `new Set<T>()`        | The current selection; these are either the selected items, or the unselected items,&#xA;depending on the value of #selectAll. |                |
| `size`       |         | `number`                 | `0`                   | The total number of items in the selection.                                                                                    |                |
| `multiple`   |         | `boolean`                | `!!options?.multiple` | Whether more than 1 item can be selected at a time.                                                                            |                |
| `selection`  |         | `Set<T>`                 |                       |                                                                                                                                |                |

### Methods

| Name              | Privacy | Description | Parameters | Return    | Inherited From |
| ----------------- | ------- | ----------- | ---------- | --------- | -------------- |
| `select`          |         |             | `item: T`  | `void`    |                |
| `selectAll`       |         |             |            | `void`    |                |
| `deselect`        |         |             | `item: T`  | `void`    |                |
| `deselectAll`     |         |             |            | `void`    |                |
| `toggle`          |         |             | `item: T`  | `void`    |                |
| `areAllSelected`  |         |             |            | `boolean` |                |
| `areSomeSelected` |         |             |            | `boolean` |                |
| `isSelected`      |         |             | `item: T`  | `boolean` |                |

<hr/>

## Exports

| Kind | Name                  | Declaration         | Module                                                 | Package |
| ---- | --------------------- | ------------------- | ------------------------------------------------------ | ------- |
| `js` | `SelectionController` | SelectionController | ../../packages/core/src/utils/controllers/selection.ts |         |

# `../../packages/core/src/utils/controllers/validation.ts`:

## class: `ValidationController`

### Fields

| Name                          | Privacy | Type                                                      | Default | Description                                                                                                         | Inherited From |
| ----------------------------- | ------- | --------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- | -------------- |
| `#abortController`            | private | `AbortController \| undefined`                            |         | An internal abort controller for cancelling pending async validation.                                               |                |
| `#previousAbortController`    | private | `AbortController \| undefined`                            |         |                                                                                                                     |                |
| `#customValidators`           | private | `Validator[] \| undefined`                                |         | Custom validators set at runtime.                                                                                   |                |
| `#host`                       | private | `ReactiveControllerHost & HTMLElement`                    | `host`  | Controller host.                                                                                                    |                |
| `#showErrors`                 | private | `boolean`                                                 | `false` | Determines when validation messages should be shown.                                                                |                |
| `#target`                     | private | `ValidationTarget \| undefined`                           |         | The element which is being validated. Either a Form Associated&#xA;Custom Element, or an `<input>` or `<textarea>`. |                |
| `#targetFn`                   | private | `() => ValidationTarget \| undefined`                     |         | The target is set after the host's connectedCallback has run.                                                       |                |
| `#validationComplete`         | private |                                                           |         | Used when validation is pending.                                                                                    |                |
| `#validationCompleteResolver` | private | `(value: void \| PromiseLike<void>) => void \| undefined` |         | Save a reference to the validation complete resolver                                                                |                |
| `#validationPending`          | private | `boolean`                                                 | `false` | Whether validation is pending.                                                                                      |                |
| `#validators`                 | private | `Validator[]`                                             | `[]`    | The custom validators. If the target is an `<input>` or `<textarea>`,&#xA;the target has built-in validators.       |                |
| `#onInvalid`                  | private |                                                           |         | Event handler for when invalid validity must be reported.                                                           |                |
| `#onReset`                    | private |                                                           |         | Event handler for when the parent form is reset.                                                                    |                |
| `target`                      |         | `ValidationTarget`                                        |         |                                                                                                                     |                |
| `validationMessage`           |         | `string`                                                  |         |                                                                                                                     |                |
| `validity`                    |         | `ValidityState`                                           |         |                                                                                                                     |                |

### Methods

| Name                             | Privacy | Description | Parameters                                                                 | Return                             | Inherited From |
| -------------------------------- | ------- | ----------- | -------------------------------------------------------------------------- | ---------------------------------- | -------------- |
| `hostConnected`                  |         |             |                                                                            | `Promise<void>`                    |                |
| `hostDisconnected`               |         |             |                                                                            | `void`                             |                |
| `hostUpdated`                    |         |             |                                                                            | `void`                             |                |
| `addValidator`                   |         |             | `validator: Validator`                                                     | `void`                             |                |
| `removeValidator`                |         |             | `validator: Validator`                                                     | `void`                             |                |
| `setCustomValidity`              |         |             | `message: string`                                                          | `void`                             |                |
| `validate`                       |         |             | `value: ValidationValue`                                                   | `void`                             |                |
| `#getInvalidState`               |         |             | `validity: ValidityState`                                                  | `keyof ValidityState \| undefined` |                |
| `#getValidationMessageForState`  |         |             | `state: keyof ValidityState`                                               | `string \| undefined`              |                |
| `#getValidatorMessageForValue`   |         |             | `validator: Validator, value: ValidationValue`                             | `string`                           |                |
| `#setValidityWithOptionalTarget` |         |             | `validity: Partial<ValidityState>, validationMessage: string \| undefined` | `void`                             |                |

<hr/>

## Variables

| Name               | Description | Type             |
| ------------------ | ----------- | ---------------- |
| `validationStyles` |             | `CSSResultGroup` |

<hr/>

## Exports

| Kind | Name                   | Declaration          | Module                                                  | Package |
| ---- | ---------------------- | -------------------- | ------------------------------------------------------- | ------- |
| `js` | `validationStyles`     | validationStyles     | ../../packages/core/src/utils/controllers/validation.ts |         |
| `js` | `ValidationController` | ValidationController | ../../packages/core/src/utils/controllers/validation.ts |         |

# `../../packages/core/src/utils/data-source/array-data-source.ts`:

## class: `ArrayDataSource`

### Superclass

| Name         | Module                                              | Package |
| ------------ | --------------------------------------------------- | ------- |
| `DataSource` | /packages/core/src/utils/data-source/data-source.js |         |

### Fields

| Name             | Privacy | Type                                   | Default      | Description                                               | Inherited From |
| ---------------- | ------- | -------------------------------------- | ------------ | --------------------------------------------------------- | -------------- |
| `#items`         | private | `T[]`                                  | `[...items]` | Array of filtered & sorted items.                         |                |
| `#originalItems` | private | `T[]`                                  | `[...items]` | The original array of items as passed to the constructor. |                |
| `items`          |         | `T[]`                                  |              | The array of items.                                       | DataSource     |
| `size`           |         | `number`                               |              | Size of the item collection.                              | DataSource     |
| `filter`         |         | `DataSourceFilter<T> \| undefined`     |              | The filter implementation.                                | DataSource     |
| `filterValues`   |         | `DataSourceFilterValue[] \| undefined` |              | The values to filter on.                                  | DataSource     |
| `sorter`         |         | `DataSourceSorter<T> \| undefined`     |              | The sorter implementation.                                | DataSource     |
| `sortValue`      |         | `DataSourceSortValue \| undefined`     |              | The path & direction to sort on.                          | DataSource     |

### Methods

| Name      | Privacy | Description | Parameters                        | Return                        | Inherited From |
| --------- | ------- | ----------- | --------------------------------- | ----------------------------- | -------------- |
| `#filter` |         |             | `values: DataSourceFilterValue[]` | `DataSourceFilterFunction<T>` |                |

### Events

| Name        | Type          | Description | Inherited From |
| ----------- | ------------- | ----------- | -------------- |
| `sl-update` | `CustomEvent` |             |                |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                                         | Package |
| ---- | ----------------- | --------------- | -------------------------------------------------------------- | ------- |
| `js` | `ArrayDataSource` | ArrayDataSource | ../../packages/core/src/utils/data-source/array-data-source.ts |         |

# `../../packages/core/src/utils/data-source/data-source.ts`:

## class: `DataSource`

### Superclass

| Name          | Module                                                   | Package |
| ------------- | -------------------------------------------------------- | ------- |
| `EventTarget` | ../../packages/core/src/utils/data-source/data-source.ts |         |

### Fields

| Name           | Privacy | Type                                   | Default | Description                      | Inherited From |
| -------------- | ------- | -------------------------------------- | ------- | -------------------------------- | -------------- |
| `filter`       |         | `DataSourceFilter<T> \| undefined`     |         | The filter implementation.       |                |
| `filterValues` |         | `DataSourceFilterValue[] \| undefined` |         | The values to filter on.         |                |
| `sorter`       |         | `DataSourceSorter<T> \| undefined`     |         | The sorter implementation.       |                |
| `sortValue`    |         | `DataSourceSortValue \| undefined`     |         | The path & direction to sort on. |                |
| `items`        |         | `T[]`                                  |         | The array of items.              |                |
| `size`         |         | `number`                               |         | Size of the item collection.     |                |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                                   | Package |
| ---- | ------------ | ----------- | -------------------------------------------------------- | ------- |
| `js` | `DataSource` | DataSource  | ../../packages/core/src/utils/data-source/data-source.ts |         |

# `../../packages/core/src/utils/data-source/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                |
| ---- | ---- | ----------- | ------ | ---------------------- |
| `js` | `*`  | *           |        | ./array-data-source.js |
| `js` | `*`  | *           |        | ./data-source.js       |

# `../../packages/core/src/utils/decorators/base.ts`:

## Functions

| Name               | Description                                                                                                                                                                                                                                                                  | Parameters                                                                                                                                                                                                                                    | Return               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `decorateProperty` | Helper for decorating a property that is compatible with both TypeScript&#xA;and Babel decorators. The optional `finisher` can be used to perform work on&#xA;the class. The optional `descriptor` should return a PropertyDescriptor&#xA;to install for the given property. | `{
    finisher,
    descriptor
  }: {
    finisher?: ((ctor: typeof ReactiveElement, property: PropertyKey) => void) \| null;
    descriptor?: (property: PropertyKey) => PropertyDescriptor;
  }, finisher: function, descriptor: function` | `ClassElement\|void` |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                           | Package |
| ---- | ------------------ | ---------------- | ------------------------------------------------ | ------- |
| `js` | `decorateProperty` | decorateProperty | ../../packages/core/src/utils/decorators/base.ts |         |

# `../../packages/core/src/utils/decorators/event.ts`:

## class: `EventEmitter`

### Methods

| Name   | Privacy | Description | Parameters                        | Return    | Inherited From |
| ------ | ------- | ----------- | --------------------------------- | --------- | -------------- |
| `emit` |         |             | `value: T, options: EventOptions` | `boolean` |                |

<hr/>

## Variables

| Name    | Description | Type    |
| ------- | ----------- | ------- |
| `event` |             | `Event` |

<hr/>

## Functions

| Name    | Description | Parameters              | Return |
| ------- | ----------- | ----------------------- | ------ |
| `event` |             | `options: EventOptions` | `any`  |

<hr/>

## Exports

| Kind | Name           | Declaration  | Module                                            | Package |
| ---- | -------------- | ------------ | ------------------------------------------------- | ------- |
| `js` | `EventEmitter` | EventEmitter | ../../packages/core/src/utils/decorators/event.ts |         |
| `js` | `event`        | event        | ../../packages/core/src/utils/decorators/event.ts |         |

# `../../packages/core/src/utils/decorators/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package      |
| ---- | ---- | ----------- | ------ | ------------ |
| `js` | `*`  | *           |        | ./base.js    |
| `js` | `*`  | *           |        | ./event.js   |
| `js` | `*`  | *           |        | ./observe.js |

# `../../packages/core/src/utils/decorators/observe.ts`:

## Functions

| Name      | Description | Parameters                                          | Return |
| --------- | ----------- | --------------------------------------------------- | ------ |
| `observe` |             | `propertyName: string, lifecycle: ObserveLifecycle` |        |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                              | Package |
| ---- | --------- | ----------- | --------------------------------------------------- | ------- |
| `js` | `observe` | observe     | ../../packages/core/src/utils/decorators/observe.ts |         |

# `../../packages/core/src/utils/mixins/form-control.ts`:

## mixin: `FormControlMixin`

### Parameters

| Name          | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `constructor` | `T`  |         |             |

### Fields

| Name                  | Privacy | Type                                   | Default | Description                                                                                                                     | Inherited From |
| --------------------- | ------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `#cachedValue`        | private | `FormControlValue \| undefined`        |         | The cached value for the form control.                                                                                          |                |
| `#formControlElement` | private | `FormControlElement \| undefined`      |         | The actual element that integrates with the form; either&#xA;a Form Associated Custom Element, or an `<input>` or `<textarea>`. |                |
| `disabled`            |         | `boolean \| undefined`                 |         | No interaction is possible with this control when disabled.                                                                     |                |
| `name`                |         | `string \| undefined`                  |         | The name of the form control.                                                                                                   |                |
| `required`            |         | `boolean \| undefined`                 |         | Whether this form control is a required field.                                                                                  |                |
| `formControlElement`  |         | `FormControlElement`                   |         |                                                                                                                                 |                |
| `form`                |         | `HTMLFormElement \| null`              |         |                                                                                                                                 |                |
| `labels`              |         | `NodeListOf<HTMLLabelElement> \| null` |         |                                                                                                                                 |                |

### Methods

| Name                    | Privacy | Description | Parameters                                                        | Return    | Inherited From |
| ----------------------- | ------- | ----------- | ----------------------------------------------------------------- | --------- | -------------- |
| `updated`               |         |             | `changes: PropertyValues<this>`                                   | `void`    |                |
| `checkValidity`         |         |             |                                                                   | `boolean` |                |
| `reportValidity`        |         |             |                                                                   | `boolean` |                |
| `setFormControlElement` |         |             | `element: FormControlElement`                                     | `void`    |                |
| `setValidity`           |         |             | `flags: ValidityStateFlags, message: string, anchor: HTMLElement` | `void`    |                |
| `setFormValue`          |         |             | `value: FormControlValue`                                         | `void`    |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `disabled` | disabled |                |
| `name`     | name     |                |
| `required` | required |                |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                               | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------------------- | ------- |
| `js` | `FormControlMixin` | FormControlMixin | ../../packages/core/src/utils/mixins/form-control.ts |         |

# `../../packages/core/src/utils/mixins/hint.spec.ts`:

## class: `TestHint`, `test-hint`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name        | Module                                  | Package |
| ----------- | --------------------------------------- | ------- |
| `HintMixin` | /packages/core/src/utils/mixins/hint.js |         |

### Fields

| Name   | Privacy | Type                  | Default | Description                                                         | Inherited From |
| ------ | ------- | --------------------- | ------- | ------------------------------------------------------------------- | -------------- |
| `hint` |         | `string \| undefined` |         | The hint. If you need to display HTML, use the `hint` slot instead. | HintMixin      |

### Methods

| Name          | Privacy | Description | Parameters                      | Return           | Inherited From |
| ------------- | ------- | ----------- | ------------------------------- | ---------------- | -------------- |
| `updated`     |         |             | `changes: PropertyValues<this>` | `void`           | HintMixin      |
| `renderHint`  |         |             |                                 | `TemplateResult` | HintMixin      |
| `#updateHint` |         |             |                                 | `void`           | HintMixin      |
| `#removeHint` |         |             |                                 | `void`           | HintMixin      |

### Attributes

| Name   | Field | Inherited From |
| ------ | ----- | -------------- |
| `hint` | hint  | HintMixin      |

<hr/>

## Exports

| Kind                        | Name        | Declaration | Module                                            | Package |
| --------------------------- | ----------- | ----------- | ------------------------------------------------- | ------- |
| `custom-element-definition` | `test-hint` | TestHint    | ../../packages/core/src/utils/mixins/hint.spec.ts |         |

# `../../packages/core/src/utils/mixins/hint.ts`:

## mixin: `HintMixin`

### Parameters

| Name          | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `constructor` | `T`  |         |             |

### Fields

| Name   | Privacy | Type                  | Default | Description                                                         | Inherited From |
| ------ | ------- | --------------------- | ------- | ------------------------------------------------------------------- | -------------- |
| `hint` |         | `string \| undefined` |         | The hint. If you need to display HTML, use the `hint` slot instead. |                |

### Methods

| Name          | Privacy | Description | Parameters                      | Return           | Inherited From |
| ------------- | ------- | ----------- | ------------------------------- | ---------------- | -------------- |
| `updated`     |         |             | `changes: PropertyValues<this>` | `void`           |                |
| `renderHint`  |         |             |                                 | `TemplateResult` |                |
| `#updateHint` |         |             |                                 | `void`           |                |
| `#removeHint` |         |             |                                 | `void`           |                |

### Attributes

| Name   | Field | Inherited From |
| ------ | ----- | -------------- |
| `hint` | hint  |                |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                       | Package |
| ---- | ----------- | ----------- | -------------------------------------------- | ------- |
| `js` | `HintMixin` | HintMixin   | ../../packages/core/src/utils/mixins/hint.ts |         |

# `../../packages/core/src/utils/mixins/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package           |
| ---- | ---- | ----------- | ------ | ----------------- |
| `js` | `*`  | *           |        | ./form-control.js |
| `js` | `*`  | *           |        | ./hint.js         |
| `js` | `*`  | *           |        | ./types.js        |

# `../../packages/editor/src/commands.ts`:

## Functions

| Name      | Description | Parameters        | Return    |
| --------- | ----------- | ----------------- | --------- |
| `setHTML` |             | `content: string` | `Command` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                | Package |
| ---- | --------- | ----------- | ------------------------------------- | ------- |
| `js` | `setHTML` | setHTML     | ../../packages/editor/src/commands.ts |         |

# `../../packages/editor/src/editor.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                   | Package |
| ---- | --------- | ----------- | ---------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/editor/src/editor.scss.ts |         |

# `../../packages/editor/src/editor.stories.ts`:

## Variables

| Name  | Description | Type       |
| ----- | ----------- | ---------- |
| `API` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                      | Package |
| ---- | --------- | ----------- | ------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/editor/src/editor.stories.ts |         |
| `js` | `API`     | API         | ../../packages/editor/src/editor.stories.ts |         |

# `../../packages/editor/src/editor.ts`:

## class: `Editor`, `sl-editor`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module | Package                                |
| ------------------ | ------ | -------------------------------------- |
| `FormControlMixin` |        | @sanomalearning/slds-core/utils/mixins |
| `HintMixin`        |        | @sanomalearning/slds-core/utils/mixins |

### Static Fields

| Name             | Privacy | Type      | Default | Description | Inherited From |
| ---------------- | ------- | --------- | ------- | ----------- | -------------- |
| `formAssociated` | private | `boolean` | `true`  |             |                |

### Fields

| Name                  | Privacy | Type                                   | Default                                                                     | Description                                                                                                                     | Inherited From   |
| --------------------- | ------- | -------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `#events`             | private |                                        | `new EventsController(this)`                                                | Manage events.                                                                                                                  |                  |
| `#validation`         | private |                                        | `new ValidationController(this, {
    validators: [requiredValidator]
  })` |                                                                                                                                 |                  |
| `#value`              | private | `string \| undefined`                  |                                                                             | The value of the content in the editor.                                                                                         |                  |
| `#view`               | private | `EditorView \| undefined`              |                                                                             | The ProseMirror editor view instance.                                                                                           |                  |
| `internals`           |         |                                        |                                                                             | Element internals.                                                                                                              |                  |
| `plugins`             |         | `Plugin[] \| undefined`                |                                                                             | Additional plugins.                                                                                                             |                  |
| `value`               |         | `string \| undefined`                  |                                                                             |                                                                                                                                 |                  |
| `#cachedValue`        | private | `FormControlValue \| undefined`        |                                                                             | The cached value for the form control.                                                                                          | FormControlMixin |
| `#formControlElement` | private | `FormControlElement \| undefined`      |                                                                             | The actual element that integrates with the form; either&#xA;a Form Associated Custom Element, or an `<input>` or `<textarea>`. | FormControlMixin |
| `disabled`            |         | `boolean \| undefined`                 |                                                                             | No interaction is possible with this control when disabled.                                                                     | FormControlMixin |
| `name`                |         | `string \| undefined`                  |                                                                             | The name of the form control.                                                                                                   | FormControlMixin |
| `required`            |         | `boolean \| undefined`                 |                                                                             | Whether this form control is a required field.                                                                                  | FormControlMixin |
| `formControlElement`  |         | `FormControlElement`                   |                                                                             |                                                                                                                                 | FormControlMixin |
| `form`                |         | `HTMLFormElement \| null`              |                                                                             |                                                                                                                                 | FormControlMixin |
| `labels`              |         | `NodeListOf<HTMLLabelElement> \| null` |                                                                             |                                                                                                                                 | FormControlMixin |
| `hint`                |         | `string \| undefined`                  |                                                                             | The hint. If you need to display HTML, use the `hint` slot instead.                                                             | HintMixin        |

### Methods

| Name                    | Privacy | Description | Parameters                                                        | Return                             | Inherited From   |
| ----------------------- | ------- | ----------- | ----------------------------------------------------------------- | ---------------------------------- | ---------------- |
| `createEditor`          |         |             |                                                                   | `EditorView`                       |                  |
| `createSchema`          |         |             |                                                                   | `Schema<EditorNodes, EditorMarks>` |                  |
| `createState`           |         |             |                                                                   | `EditorState`                      |                  |
| `#onFocusout`           |         |             |                                                                   | `void`                             |                  |
| `updated`               |         |             | `changes: PropertyValues<this>`                                   | `void`                             | HintMixin        |
| `checkValidity`         |         |             |                                                                   | `boolean`                          | FormControlMixin |
| `reportValidity`        |         |             |                                                                   | `boolean`                          | FormControlMixin |
| `setFormControlElement` |         |             | `element: FormControlElement`                                     | `void`                             | FormControlMixin |
| `setValidity`           |         |             | `flags: ValidityStateFlags, message: string, anchor: HTMLElement` | `void`                             | FormControlMixin |
| `setFormValue`          |         |             | `value: FormControlValue`                                         | `void`                             | FormControlMixin |
| `renderHint`            |         |             |                                                                   | `TemplateResult`                   | HintMixin        |
| `#updateHint`           |         |             |                                                                   | `void`                             | HintMixin        |
| `#removeHint`           |         |             |                                                                   | `void`                             | HintMixin        |

### Attributes

| Name       | Field    | Inherited From   |
| ---------- | -------- | ---------------- |
| `value`    | value    |                  |
| `disabled` | disabled | FormControlMixin |
| `name`     | name     | FormControlMixin |
| `required` | required | FormControlMixin |
| `hint`     | hint     | HintMixin        |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                              | Package |
| ---- | -------- | ----------- | ----------------------------------- | ------- |
| `js` | `Editor` | Editor      | ../../packages/editor/src/editor.ts |         |

# `../../packages/editor/src/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package     |
| ---- | ---- | ----------- | ------ | ----------- |
| `js` | `*`  | *           |        | ./editor.js |

# `../../packages/editor/src/keymap.ts`:

## Functions

| Name              | Description | Parameters                                 | Return                       |
| ----------------- | ----------- | ------------------------------------------ | ---------------------------- |
| `buildKeymap`     |             | `schema: Schema<EditorNodes, EditorMarks>` | `{ [key: string]: Command }` |
| `buildListKeymap` |             | `schema: Schema<EditorNodes, EditorMarks>` | `{ [key: string]: Command }` |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                              | Package |
| ---- | ----------------- | --------------- | ----------------------------------- | ------- |
| `js` | `buildKeymap`     | buildKeymap     | ../../packages/editor/src/keymap.ts |         |
| `js` | `buildListKeymap` | buildListKeymap | ../../packages/editor/src/keymap.ts |         |

# `../../packages/editor/src/list-utils.ts`:

## Functions

| Name                      | Description | Parameters                                                                                | Return                |
| ------------------------- | ----------- | ----------------------------------------------------------------------------------------- | --------------------- |
| `rootListDepth`           |             | `pos: ResolvedPos, nodes: { [key: string]: NodeType }`                                    | `number \| undefined` |
| `getListLiftTarget`       |             | `schema: Schema, resPos: ResolvedPos`                                                     | `number`              |
| `liftSelectionList`       |             | `state: EditorState, tr: Transaction`                                                     | `Transaction`         |
| `toggleList`              |             | `state: EditorState, dispatch: DispatchFn, view: EditorView, listType: string`            | `boolean`             |
| `toggleListCommand`       |             | `listType: string`                                                                        | `Command`             |
| `liftFollowingList`       |             | `state: EditorState, from: number, to: number, rootListDepthNum: number, tr: Transaction` | `Transaction`         |
| `isRangeOfType`           |             | `doc: Node, $from: ResolvedPos, $to: ResolvedPos, nodeType: NodeType`                     | `boolean`             |
| `getAncestorNodesBetween` |             | `doc: Node, $from: ResolvedPos, $to: ResolvedPos`                                         | `Node[]`              |
| `findAncestorPosition`    |             | `doc: Node, pos: ResolvedPos`                                                             | `ResolvedPos`         |
| `liftListItems`           |             |                                                                                           | `Command`             |
| `wrapInList`              |             | `nodeType: NodeType`                                                                      | `Command`             |
| `toggleUnorderedList`     |             | `state: EditorState, dispatch: DispatchFn, view: EditorView`                              | `boolean`             |
| `toggleOrderedList`       |             | `state: EditorState, dispatch: DispatchFn, view: EditorView`                              | `boolean`             |
| `splitListItemKeepMarks`  |             | `itemType: NodeType`                                                                      |                       |

<hr/>

## Exports

| Kind | Name                      | Declaration             | Module                                  | Package |
| ---- | ------------------------- | ----------------------- | --------------------------------------- | ------- |
| `js` | `rootListDepth`           | rootListDepth           | ../../packages/editor/src/list-utils.ts |         |
| `js` | `getListLiftTarget`       | getListLiftTarget       | ../../packages/editor/src/list-utils.ts |         |
| `js` | `liftSelectionList`       | liftSelectionList       | ../../packages/editor/src/list-utils.ts |         |
| `js` | `toggleList`              | toggleList              | ../../packages/editor/src/list-utils.ts |         |
| `js` | `toggleListCommand`       | toggleListCommand       | ../../packages/editor/src/list-utils.ts |         |
| `js` | `liftFollowingList`       | liftFollowingList       | ../../packages/editor/src/list-utils.ts |         |
| `js` | `isRangeOfType`           | isRangeOfType           | ../../packages/editor/src/list-utils.ts |         |
| `js` | `getAncestorNodesBetween` | getAncestorNodesBetween | ../../packages/editor/src/list-utils.ts |         |
| `js` | `findAncestorPosition`    | findAncestorPosition    | ../../packages/editor/src/list-utils.ts |         |
| `js` | `liftListItems`           | liftListItems           | ../../packages/editor/src/list-utils.ts |         |
| `js` | `wrapInList`              | wrapInList              | ../../packages/editor/src/list-utils.ts |         |
| `js` | `toggleUnorderedList`     | toggleUnorderedList     | ../../packages/editor/src/list-utils.ts |         |
| `js` | `toggleOrderedList`       | toggleOrderedList       | ../../packages/editor/src/list-utils.ts |         |
| `js` | `splitListItemKeepMarks`  | splitListItemKeepMarks  | ../../packages/editor/src/list-utils.ts |         |

# `../../packages/editor/src/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                         | Package |
| --------------------------- | ----------- | ----------- | ------------------------------ | ------- |
| `custom-element-definition` | `sl-editor` | Editor      | /packages/editor/src/editor.js |         |

# `../../packages/editor/src/schema.ts`:

## Variables

| Name    | Description | Type                            |
| ------- | ----------- | ------------------------------- |
| `marks` |             | `Record<EditorMarks, MarkSpec>` |
| `nodes` |             | `Record<EditorNodes, NodeSpec>` |

<hr/>

## Functions

| Name                 | Description | Parameters                                                          | Return                   |
| -------------------- | ----------- | ------------------------------------------------------------------- | ------------------------ |
| `isEmpty`            |             | `obj: Record<string, unknown>`                                      | `boolean`                |
| `removeEntries`      |             | `obj: Record<string, unknown>, predicate: (key: string) => boolean` | `Record<string, string>` |
| `removeEmptyEntries` |             | `obj: Record<string, unknown>`                                      | `Record<string, string>` |
| `commonAttributes`   |             |                                                                     | `Attrs`                  |

<hr/>

## Exports

| Kind | Name                 | Declaration        | Module                              | Package |
| ---- | -------------------- | ------------------ | ----------------------------------- | ------- |
| `js` | `isEmpty`            | isEmpty            | ../../packages/editor/src/schema.ts |         |
| `js` | `removeEntries`      | removeEntries      | ../../packages/editor/src/schema.ts |         |
| `js` | `removeEmptyEntries` | removeEmptyEntries | ../../packages/editor/src/schema.ts |         |
| `js` | `commonAttributes`   | commonAttributes   | ../../packages/editor/src/schema.ts |         |
| `js` | `marks`              | marks              | ../../packages/editor/src/schema.ts |         |
| `js` | `nodes`              | nodes              | ../../packages/editor/src/schema.ts |         |

# `../../packages/editor/src/utils.ts`:

## Functions

| Name                | Description | Parameters              | Return   |
| ------------------- | ----------- | ----------------------- | -------- |
| `createContentNode` |             | `schema: Schema, value` | `Node`   |
| `getHTML`           |             | `state: EditorState`    | `string` |

<hr/>

## Exports

| Kind | Name                | Declaration       | Module                             | Package |
| ---- | ------------------- | ----------------- | ---------------------------------- | ------- |
| `js` | `createContentNode` | createContentNode | ../../packages/editor/src/utils.ts |         |
| `js` | `getHTML`           | getHTML           | ../../packages/editor/src/utils.ts |         |

# `../../packages/grid/src/column-group.ts`:

## class: `GridColumnGroup`, `sl-grid-column-group`

### Superclass

| Name         | Module                       | Package |
| ------------ | ---------------------------- | ------- |
| `GridColumn` | /packages/grid/src/column.js |         |

### Fields

| Name        | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ----------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `#width`    | private | `number \| undefined`                             |           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `columns`   |         | `Array<GridColumn<T>>`                            | `[]`      | The nested columns in the group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| `width`     |         | `number \| undefined`                             |           | The width of the group column is either manually specified, or the sum of the nested columns.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |
| `align`     |         | `'start' \| 'center' \| 'end'`                    | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth` |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`      |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`      |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`    |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `path`      |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `parts`     |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `renderer`  |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `sticky`    |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |

### Methods

| Name            | Privacy | Description | Parameters                                   | Return           | Inherited From |
| --------------- | ------- | ----------- | -------------------------------------------- | ---------------- | -------------- |
| `renderHeader`  |         |             |                                              | `TemplateResult` | GridColumn     |
| `#onSlotchange` |         |             | `event: Event & { target: HTMLSlotElement }` | `void`           |                |
| `renderData`    |         |             | `item: T`                                    | `TemplateResult` | GridColumn     |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `align`      | align     | GridColumn     |
| `auto-width` | autoWidth | GridColumn     |
| `grow`       | grow      | GridColumn     |
| `header`     | header    | GridColumn     |
| `path`       | path      | GridColumn     |
| `parts`      | parts     | GridColumn     |
| `sticky`     | sticky    | GridColumn     |
| `width`      | width     | GridColumn     |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                  | Package |
| ---- | ----------------- | --------------- | --------------------------------------- | ------- |
| `js` | `GridColumnGroup` | GridColumnGroup | ../../packages/grid/src/column-group.ts |         |

# `../../packages/grid/src/column.ts`:

## class: `GridColumn`, `sl-grid-column`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name        | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ----------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `#width`    | private | `number \| undefined`                             |           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                |
| `align`     |         | `'start' \| 'center' \| 'end'`                    | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                |
| `autoWidth` |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. |                |
| `grid`      |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                |
| `grow`      |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                |
| `header`    |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| `path`      |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                |
| `parts`     |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                |
| `renderer`  |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                |
| `sticky`    |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                |
| `width`     |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                |

### Methods

| Name           | Privacy | Description | Parameters | Return           | Inherited From |
| -------------- | ------- | ----------- | ---------- | ---------------- | -------------- |
| `renderHeader` |         |             |            | `TemplateResult` |                |
| `renderData`   |         |             | `item: T`  | `TemplateResult` |                |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `align`      | align     |                |
| `auto-width` | autoWidth |                |
| `grow`       | grow      |                |
| `header`     | header    |                |
| `path`       | path      |                |
| `parts`      | parts     |                |
| `sticky`     | sticky    |                |
| `width`      | width     |                |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                            | Package |
| ---- | ------------ | ----------- | --------------------------------- | ------- |
| `js` | `GridColumn` | GridColumn  | ../../packages/grid/src/column.ts |         |

# `../../packages/grid/src/filter-column.ts`:

## class: `GridFilterColumn`, `sl-grid-filter-column`

### Superclass

| Name         | Module                       | Package |
| ------------ | ---------------------------- | ------- |
| `GridColumn` | /packages/grid/src/column.js |         |

### Mixins

| Name                  | Module | Package                  |
| --------------------- | ------ | ------------------------ |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements |

### Static Fields

| Name             | Privacy | Type                | Default | Description | Inherited From |
| ---------------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `scopedElements` | private | `ScopedElementsMap` |         |             |                |

### Fields

| Name        | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ----------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `#width`    | private | `number \| undefined`                             |           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `align`     |         | `'start' \| 'center' \| 'end'`                    | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth` |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`      |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`      |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`    |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `path`      |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `parts`     |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `renderer`  |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `sticky`    |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`     |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description | Parameters | Return           | Inherited From |
| -------------- | ------- | ----------- | ---------- | ---------------- | -------------- |
| `renderHeader` |         |             |            | `TemplateResult` | GridColumn     |
| `renderData`   |         |             | `item: T`  | `TemplateResult` | GridColumn     |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `align`      | align     | GridColumn     |
| `auto-width` | autoWidth | GridColumn     |
| `grow`       | grow      | GridColumn     |
| `header`     | header    | GridColumn     |
| `path`       | path      | GridColumn     |
| `parts`      | parts     | GridColumn     |
| `sticky`     | sticky    | GridColumn     |
| `width`      | width     | GridColumn     |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                   | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------- | ------- |
| `js` | `GridFilterColumn` | GridFilterColumn | ../../packages/grid/src/filter-column.ts |         |

# `../../packages/grid/src/filter.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                 | Package |
| ---- | --------- | ----------- | -------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/grid/src/filter.scss.ts |         |

# `../../packages/grid/src/filter.ts`:

## class: `GridFilterValueChangeEvent`

### Superclass

| Name    | Module                            | Package |
| ------- | --------------------------------- | ------- |
| `Event` | ../../packages/grid/src/filter.ts |         |

<hr/>

## class: `GridFilter`, `sl-grid-filter`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                  |
| --------------------- | ------ | ------------------------ |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements |

### Static Fields

| Name             | Privacy | Type                | Default | Description | Inherited From |
| ---------------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `scopedElements` | private | `ScopedElementsMap` |         |             |                |

### Fields

| Name                | Privacy | Type                                       | Default | Description       | Inherited From |
| ------------------- | ------- | ------------------------------------------ | ------- | ----------------- | -------------- |
| `#value`            | private | `string`                                   | `''`    | The filter value. |                |
| `column`            |         | `GridColumn`                               |         | The grid column.  |                |
| `filterChange`      |         | `EventEmitter<GridFilterChange>`           |         |                   |                |
| `filterValueChange` |         | `EventEmitter<GridFilterValueChangeEvent>` |         |                   |                |
| `value`             |         | `string`                                   |         |                   |                |

### Methods

| Name       | Privacy | Description | Parameters                              | Return | Inherited From |
| ---------- | ------- | ----------- | --------------------------------------- | ------ | -------------- |
| `#onInput` |         |             | `{ target }: Event & { target: Input }` | `void` |                |

### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `value` | value |                |

<hr/>

## Exports

| Kind | Name                         | Declaration                | Module                            | Package |
| ---- | ---------------------------- | -------------------------- | --------------------------------- | ------- |
| `js` | `GridFilterValueChangeEvent` | GridFilterValueChangeEvent | ../../packages/grid/src/filter.ts |         |
| `js` | `GridFilter`                 | GridFilter                 | ../../packages/grid/src/filter.ts |         |

# `../../packages/grid/src/grid.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                               | Package |
| ---- | --------- | ----------- | ------------------------------------ | ------- |
| `js` | `default` |             | ../../packages/grid/src/grid.scss.ts |         |

# `../../packages/grid/src/grid.ts`:

## class: `GridActiveItemChangeEvent`

### Superclass

| Name    | Module                          | Package |
| ------- | ------------------------------- | ------- |
| `Event` | ../../packages/grid/src/grid.ts |         |

<hr/>

## class: `Grid`, `sl-grid`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name                             | Privacy | Type                                         | Default                            | Description                                                          | Inherited From |
| -------------------------------- | ------- | -------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------- | -------------- |
| `#filters`                       | private | `GridFilter[]`                               | `[]`                               | The filters for this grid.                                           |                |
| `#initialColumnWidthsCalculated` | private | `boolean`                                    | `false`                            | Flag for calculating the column widths only once.                    |                |
| `#sorters`                       | private | `GridSorter[]`                               | `[]`                               | The sorters for this grid.                                           |                |
| `selection`                      |         |                                              | `new SelectionController<T>(this)` | Selection manager.                                                   |                |
| `activeItem`                     |         | `T \| undefined`                             |                                    | The active item in the grid.                                         |                |
| `activeItemChange`               |         | `EventEmitter<GridActiveItemChangeEvent<T>>` |                                    | Emits when the active item changes                                   |                |
| `columns`                        |         | `Array<GridColumn<T>>`                       | `[]`                               | The columns in the grid.                                             |                |
| `dataSource`                     |         | `DataSource<T> \| undefined`                 |                                    | Provide your own implementation for getting the data.                |                |
| `items`                          |         | `T[] \| undefined`                           |                                    | An array of items to be displayed in the grid.                       |                |
| `itemParts`                      |         | `GridItemParts<T> \| undefined`              |                                    | Custom parts to be set on the `<tr>` so it can be styled externally. |                |
| `noBorder`                       |         | `boolean \| undefined`                       |                                    | Hide the border around the grid when true.                           |                |
| `noRowBorder`                    |         | `boolean \| undefined`                       |                                    | Hides the border between rows when true.                             |                |
| `striped`                        |         | `boolean \| undefined`                       |                                    | Uses alternating background colors for the rows when set.            |                |

### Methods

| Name                      | Privacy | Description                                                              | Parameters                                                                               | Return                        | Inherited From |
| ------------------------- | ------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------- | -------------- |
| `renderStyles`            |         |                                                                          |                                                                                          | `TemplateResult`              |                |
| `renderHeader`            |         |                                                                          |                                                                                          | `TemplateResult`              |                |
| `renderItem`              |         |                                                                          | `item: T, index: number`                                                                 | `TemplateResult`              |                |
| `recalculateColumnWidths` |         | Updates the `width` of all columns which have `autoWidth` set to `true`. |                                                                                          | `Promise<void>`               |                |
| `#onClickRow`             |         |                                                                          | `event: Event, item: T`                                                                  | `void`                        |                |
| `#onDirectionChange`      |         |                                                                          | `{ target }: CustomEvent<DataSourceSortDirection \| undefined> & { target: GridSorter }` | `void`                        |                |
| `#onFilterChange`         |         |                                                                          | `{ detail, target }: CustomEvent<GridFilterChange> & { target: GridFilter }`             | `void`                        |                |
| `#onFilterValueChange`    |         |                                                                          |                                                                                          | `void`                        |                |
| `#onSlotchange`           |         |                                                                          | `event: Event & { target: HTMLSlotElement }`                                             | `void`                        |                |
| `#onSorterChange`         |         |                                                                          | `{ detail, target }: CustomEvent<GridSorterChange> & { target: GridSorter }`             | `void`                        |                |
| `#onVisibilityChanged`    |         |                                                                          |                                                                                          | `void`                        |                |
| `#applyFilters`           |         |                                                                          |                                                                                          | `void`                        |                |
| `#applySorters`           |         |                                                                          |                                                                                          | `void`                        |                |
| `#getHeaderRows`          |         |                                                                          | `columns: Array<GridColumn<T>>`                                                          | `Array<Array<GridColumn<T>>>` |                |
| `#getStickyColumnOffset`  |         |                                                                          | `index: number`                                                                          | `number`                      |                |

### Attributes

| Name            | Field       | Inherited From |
| --------------- | ----------- | -------------- |
| `items`         | items       |                |
| `no-border`     | noBorder    |                |
| `no-row-border` | noRowBorder |                |
| `striped`       | striped     |                |

<hr/>

## Exports

| Kind | Name                        | Declaration               | Module                          | Package |
| ---- | --------------------------- | ------------------------- | ------------------------------- | ------- |
| `js` | `GridActiveItemChangeEvent` | GridActiveItemChangeEvent | ../../packages/grid/src/grid.ts |         |
| `js` | `Grid`                      | Grid                      | ../../packages/grid/src/grid.ts |         |

# `../../packages/grid/src/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package               |
| ---- | ---- | ----------- | ------ | --------------------- |
| `js` | `*`  | *           |        | ./column.js           |
| `js` | `*`  | *           |        | ./column-group.js     |
| `js` | `*`  | *           |        | ./filter-column.js    |
| `js` | `*`  | *           |        | ./grid.js             |
| `js` | `*`  | *           |        | ./selection-column.js |
| `js` | `*`  | *           |        | ./sort-column.js      |

# `../../packages/grid/src/register.ts`:

## Exports

| Kind                        | Name                       | Declaration         | Module                                 | Package |
| --------------------------- | -------------------------- | ------------------- | -------------------------------------- | ------- |
| `custom-element-definition` | `sl-grid`                  | Grid                | /packages/grid/src/grid.js             |         |
| `custom-element-definition` | `sl-grid-column`           | GridColumn          | /packages/grid/src/column.js           |         |
| `custom-element-definition` | `sl-grid-column-group`     | GridColumnGroup     | /packages/grid/src/column-group.js     |         |
| `custom-element-definition` | `sl-grid-filter`           | GridFilter          | /packages/grid/src/filter.js           |         |
| `custom-element-definition` | `sl-grid-filter-column`    | GridFilterColumn    | /packages/grid/src/filter-column.js    |         |
| `custom-element-definition` | `sl-grid-selection-column` | GridSelectionColumn | /packages/grid/src/selection-column.js |         |
| `custom-element-definition` | `sl-grid-sort-column`      | GridSortColumn      | /packages/grid/src/sort-column.js      |         |
| `custom-element-definition` | `sl-grid-sorter`           | GridSorter          | /packages/grid/src/sorter.js           |         |

# `../../packages/grid/src/selection-column.ts`:

## class: `GridSelectionColumn`, `sl-grid-selection-column`

### Superclass

| Name         | Module                       | Package |
| ------------ | ---------------------------- | ------- |
| `GridColumn` | /packages/grid/src/column.js |         |

### Mixins

| Name                  | Module | Package                  |
| --------------------- | ------ | ------------------------ |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements |

### Static Fields

| Name             | Privacy | Type                | Default | Description | Inherited From |
| ---------------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `scopedElements` | private | `ScopedElementsMap` |         |             |                |

### Fields

| Name         | Privacy | Type                                              | Default                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ------------ | ------- | ------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `#events`    | private |                                                   | `new EventsController(this)` |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                |
| `autoSelect` |         | `boolean \| undefined`                            |                              | When true, the active rows get selected automatically.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                |
| `selectAll`  |         | `boolean \| undefined`                            |                              | When true, all items are selected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                |
| `#width`     | private | `number \| undefined`                             |                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `align`      |         | `'start' \| 'center' \| 'end'`                    | `'start'`                    | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth`  |         | `boolean \| undefined`                            |                              | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`       |         | `Grid<T> \| undefined`                            |                              | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`       |         | `number`                                          | `1`                          | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`     |         | `string \| GridColumnHeaderRenderer \| undefined` |                              | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `path`       |         | `string \| undefined`                             |                              | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `parts`      |         | `string \| GridColumnParts<T> \| undefined`       |                              | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `renderer`   |         | `GridColumnDataRenderer<T> \| undefined`          |                              | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `sticky`     |         | `boolean \| undefined`                            |                              | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`      |         | `number \| undefined`                             |                              | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name                  | Privacy | Description | Parameters                                             | Return           | Inherited From |
| --------------------- | ------- | ----------- | ------------------------------------------------------ | ---------------- | -------------- |
| `renderHeader`        |         |             |                                                        | `TemplateResult` | GridColumn     |
| `renderData`          |         |             | `item: T`                                              | `TemplateResult` | GridColumn     |
| `#onActiveItemChange` |         |             | `{ item, relatedEvent }: GridActiveItemChangeEvent<T>` | `void`           |                |
| `#onToggleSelect`     |         |             | `item: T, checked: boolean`                            | `void`           |                |
| `#onToggleSelectAll`  |         |             | `checked: boolean`                                     | `void`           |                |

### Attributes

| Name          | Field      | Inherited From |
| ------------- | ---------- | -------------- |
| `auto-select` | autoSelect |                |
| `select-all`  | selectAll  |                |
| `align`       | align      | GridColumn     |
| `auto-width`  | autoWidth  | GridColumn     |
| `grow`        | grow       | GridColumn     |
| `header`      | header     | GridColumn     |
| `path`        | path       | GridColumn     |
| `parts`       | parts      | GridColumn     |
| `sticky`      | sticky     | GridColumn     |
| `width`       | width      | GridColumn     |

<hr/>

## Exports

| Kind | Name                  | Declaration         | Module                                      | Package |
| ---- | --------------------- | ------------------- | ------------------------------------------- | ------- |
| `js` | `GridSelectionColumn` | GridSelectionColumn | ../../packages/grid/src/selection-column.ts |         |

# `../../packages/grid/src/sort-column.ts`:

## class: `GridSortColumn`, `sl-grid-sort-column`

### Superclass

| Name         | Module                       | Package |
| ------------ | ---------------------------- | ------- |
| `GridColumn` | /packages/grid/src/column.js |         |

### Mixins

| Name                  | Module | Package                  |
| --------------------- | ------ | ------------------------ |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements |

### Static Fields

| Name             | Privacy | Type                | Default | Description | Inherited From |
| ---------------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `scopedElements` | private | `ScopedElementsMap` |         |             |                |

### Fields

| Name        | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ----------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `#width`    | private | `number \| undefined`                             |           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `align`     |         | `'start' \| 'center' \| 'end'`                    | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth` |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`      |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`      |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`    |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `path`      |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `parts`     |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `renderer`  |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `sticky`    |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`     |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description | Parameters | Return           | Inherited From |
| -------------- | ------- | ----------- | ---------- | ---------------- | -------------- |
| `renderHeader` |         |             |            | `TemplateResult` | GridColumn     |
| `renderData`   |         |             | `item: T`  | `TemplateResult` | GridColumn     |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `align`      | align     | GridColumn     |
| `auto-width` | autoWidth | GridColumn     |
| `grow`       | grow      | GridColumn     |
| `header`     | header    | GridColumn     |
| `path`       | path      | GridColumn     |
| `parts`      | parts     | GridColumn     |
| `sticky`     | sticky    | GridColumn     |
| `width`      | width     | GridColumn     |

<hr/>

## Exports

| Kind | Name             | Declaration    | Module                                 | Package |
| ---- | ---------------- | -------------- | -------------------------------------- | ------- |
| `js` | `GridSortColumn` | GridSortColumn | ../../packages/grid/src/sort-column.ts |         |

# `../../packages/grid/src/sorter.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                 | Package |
| ---- | --------- | ----------- | -------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/grid/src/sorter.scss.ts |         |

# `../../packages/grid/src/sorter.ts`:

## class: `GridSorter`, `sl-grid-sorter`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name              | Privacy | Type                                                 | Default                      | Description                               | Inherited From |
| ----------------- | ------- | ---------------------------------------------------- | ---------------------------- | ----------------------------------------- | -------------- |
| `#events`         | private |                                                      | `new EventsController(this)` |                                           |                |
| `column`          |         | `GridColumn`                                         |                              | The grid column.                          |                |
| `direction`       |         | `DataSourceSortDirection \| undefined`               |                              | The direction in which to sort the items. |                |
| `directionChange` |         | `EventEmitter<DataSourceSortDirection \| undefined>` |                              |                                           |                |
| `sorterChange`    |         | `EventEmitter<GridSorterChange>`                     |                              |                                           |                |

### Methods

| Name               | Privacy | Description | Parameters             | Return | Inherited From |
| ------------------ | ------- | ----------- | ---------------------- | ------ | -------------- |
| `reset`            |         |             |                        | `void` |                |
| `#onClick`         |         |             |                        | `void` |                |
| `#onKeydown`       |         |             | `event: KeyboardEvent` | `void` |                |
| `#toggleDirection` |         |             |                        | `void` |                |

### Attributes

| Name        | Field     | Inherited From |
| ----------- | --------- | -------------- |
| `direction` | direction |                |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                            | Package |
| ---- | ------------ | ----------- | --------------------------------- | ------- |
| `js` | `GridSorter` | GridSorter  | ../../packages/grid/src/sorter.ts |         |

# `../../packages/grid/src/stories/basics.stories.ts`:

## Variables

| Name           | Description | Type       |
| -------------- | ----------- | ---------- |
| `Simple`       |             | `StoryObj` |
| `ColumnGroups` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name           | Declaration  | Module                                            | Package |
| ---- | -------------- | ------------ | ------------------------------------------------- | ------- |
| `js` | `default`      |              | ../../packages/grid/src/stories/basics.stories.ts |         |
| `js` | `Simple`       | Simple       | ../../packages/grid/src/stories/basics.stories.ts |         |
| `js` | `ColumnGroups` | ColumnGroups | ../../packages/grid/src/stories/basics.stories.ts |         |

# `../../packages/grid/src/stories/filtering.stories.ts`:

## Variables

| Name          | Description | Type       |
| ------------- | ----------- | ---------- |
| `PerColumn`   |             | `StoryObj` |
| `OutsideGrid` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name          | Declaration | Module                                               | Package |
| ---- | ------------- | ----------- | ---------------------------------------------------- | ------- |
| `js` | `default`     |             | ../../packages/grid/src/stories/filtering.stories.ts |         |
| `js` | `PerColumn`   | PerColumn   | ../../packages/grid/src/stories/filtering.stories.ts |         |
| `js` | `OutsideGrid` | OutsideGrid | ../../packages/grid/src/stories/filtering.stories.ts |         |

# `../../packages/grid/src/stories/rendering.stories.ts`:

## Variables

| Name             | Description | Type       |
| ---------------- | ----------- | ---------- |
| `ColumnRenderer` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name             | Declaration    | Module                                               | Package |
| ---- | ---------------- | -------------- | ---------------------------------------------------- | ------- |
| `js` | `default`        |                | ../../packages/grid/src/stories/rendering.stories.ts |         |
| `js` | `ColumnRenderer` | ColumnRenderer | ../../packages/grid/src/stories/rendering.stories.ts |         |

# `../../packages/grid/src/stories/scrolling.stories.ts`:

## Variables

| Name               | Description | Type       |
| ------------------ | ----------- | ---------- |
| `VerticalOverflow` |             | `StoryObj` |
| `VerticalPage`     |             | `StoryObj` |
| `HorizontalSticky` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                               | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------------------- | ------- |
| `js` | `default`          |                  | ../../packages/grid/src/stories/scrolling.stories.ts |         |
| `js` | `VerticalOverflow` | VerticalOverflow | ../../packages/grid/src/stories/scrolling.stories.ts |         |
| `js` | `VerticalPage`     | VerticalPage     | ../../packages/grid/src/stories/scrolling.stories.ts |         |
| `js` | `HorizontalSticky` | HorizontalSticky | ../../packages/grid/src/stories/scrolling.stories.ts |         |

# `../../packages/grid/src/stories/selection.stories.ts`:

## Variables

| Name                 | Description | Type       |
| -------------------- | ----------- | ---------- |
| `Single`             |             | `StoryObj` |
| `Multiple`           |             | `StoryObj` |
| `MultipleAutoSelect` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name                 | Declaration        | Module                                               | Package |
| ---- | -------------------- | ------------------ | ---------------------------------------------------- | ------- |
| `js` | `default`            |                    | ../../packages/grid/src/stories/selection.stories.ts |         |
| `js` | `Single`             | Single             | ../../packages/grid/src/stories/selection.stories.ts |         |
| `js` | `Multiple`           | Multiple           | ../../packages/grid/src/stories/selection.stories.ts |         |
| `js` | `MultipleAutoSelect` | MultipleAutoSelect | ../../packages/grid/src/stories/selection.stories.ts |         |

# `../../packages/grid/src/stories/sorting.stories.ts`:

## Variables

| Name     | Description | Type       |
| -------- | ----------- | ---------- |
| `Single` |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                             | Package |
| ---- | --------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default` |             | ../../packages/grid/src/stories/sorting.stories.ts |         |
| `js` | `Single`  | Single      | ../../packages/grid/src/stories/sorting.stories.ts |         |

# `../../packages/grid/src/stories/styling.stories.ts`:

## Variables

| Name        | Description | Type       |
| ----------- | ----------- | ---------- |
| `NoBorders` |             | `StoryObj` |
| `Striped`   |             | `StoryObj` |
| `Parts`     |             | `StoryObj` |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                             | Package |
| ---- | ----------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default`   |             | ../../packages/grid/src/stories/styling.stories.ts |         |
| `js` | `NoBorders` | NoBorders   | ../../packages/grid/src/stories/styling.stories.ts |         |
| `js` | `Striped`   | Striped     | ../../packages/grid/src/stories/styling.stories.ts |         |
| `js` | `Parts`     | Parts       | ../../packages/grid/src/stories/styling.stories.ts |         |
