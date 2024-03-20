# `../packages/components/accordion/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                 |
| ---- | ---- | ----------- | ------ | ----------------------- |
| `js` | `*`  | *           |        | ./src/accordion.js      |
| `js` | `*`  | *           |        | ./src/accordion-item.js |

# `../packages/components/accordion/register.ts`:

## Exports

| Kind                        | Name                | Declaration   | Module                                               | Package |
| --------------------------- | ------------------- | ------------- | ---------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-accordion`      | Accordion     | /packages/components/accordion/src/accordion.js      |         |
| `custom-element-definition` | `sl-accordion-item` | AccordionItem | /packages/components/accordion/src/accordion-item.js |         |

# `../packages/components/accordion/src/accordion-item.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                      | Package |
| ---- | --------- | ----------- | ----------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/accordion/src/accordion-item.scss.ts |         |

# `../packages/components/accordion/src/accordion-item.ts`:

## class: `AccordionItem`, `sl-accordion-item`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name       | Privacy | Type                   | Default | Description                                                    | Inherited From |
| ---------- | ------- | ---------------------- | ------- | -------------------------------------------------------------- | -------------- |
| `disabled` |         | `boolean \| undefined` |         | Whether the element is disabled.                               |                |
| `open`     |         | `boolean \| undefined` |         | Whether the details element is opened.                         |                |
| `summary`  |         | `string \| undefined`  |         | A text shown in the header - as a title of the accordion item. |                |

### Events

| Name          | Type                                  | Description                                     | Inherited From |
| ------------- | ------------------------------------- | ----------------------------------------------- | -------------- |
| `toggleEvent` | `EventEmitter<SlToggleEvent<string>>` | Emits when the accordion item has been toggled. |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `disabled` | disabled |                |
| `open`     | open     |                |
| `summary`  | summary  |                |

### CSS Parts

| Name      | Description                          |
| --------- | ------------------------------------ |
| `summary` | Header element of the accordion-item |

### Slots

| Name      | Description                    |
| --------- | ------------------------------ |
| `default` | Body content for the accordion |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                                 | Package |
| ---- | --------------- | ------------- | ------------------------------------------------------ | ------- |
| `js` | `AccordionItem` | AccordionItem | ../packages/components/accordion/src/accordion-item.ts |         |

# `../packages/components/accordion/src/accordion.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                 | Package |
| ---- | --------- | ----------- | ------------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/accordion/src/accordion.scss.ts |         |

# `../packages/components/accordion/src/accordion.ts`:

## class: `Accordion`, `sl-accordion`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name     | Privacy | Type                   | Default | Description                                                                                                | Inherited From |
| -------- | ------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------- | -------------- |
| `single` |         | `boolean \| undefined` |         | Whether only one accordion item can be opened at once. By default, multiple accordion items can be opened. |                |

### Attributes

| Name     | Field  | Inherited From |
| -------- | ------ | -------------- |
| `single` | single |                |

### Slots

| Name      | Description                                  |
| --------- | -------------------------------------------- |
| `default` | The place for multiple `<sl-accordion-item>` |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                            | Package |
| ---- | ----------- | ----------- | ------------------------------------------------- | ------- |
| `js` | `Accordion` | Accordion   | ../packages/components/accordion/src/accordion.ts |         |

# `../packages/components/avatar/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./src/avatar.js |
| `js` | `*`  | *           |        | ./src/models.js |

# `../packages/components/avatar/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                                    | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------------- | ------- |
| `custom-element-definition` | `sl-avatar` | Avatar      | /packages/components/avatar/src/avatar.js |         |

# `../packages/components/avatar/src/avatar.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/avatar/src/avatar.scss.ts |         |

# `../packages/components/avatar/src/avatar.ts`:

## class: `Avatar`, `sl-avatar`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name              | Privacy | Type                                                                       | Default        | Description                                                                                                                                                                                                             | Inherited From |
| ----------------- | ------- | -------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `badgeText`       |         | `string \| undefined`                                                      |                | Text to show on the badge in the top right corner of the avatar.&#xA;Be aware this text should not be more then a few characters.&#xA;Typically this option is used to show a number, for example unread messages.      |                |
| `displayInitials` |         | `string \| undefined`                                                      |                | The initials that need to be displayed. If none are set they are determined based on the displayName .                                                                                                                  |                |
| `displayName`     |         | `string \| undefined`                                                      |                | The name that needs to be displayed.                                                                                                                                                                                    |                |
| `fallback`        |         | `'initials' \| 'image'`                                                    | `'initials'`   | The fallback to use when there is no user image present.                                                                                                                                                                |                |
| `imageOnly`       |         | `boolean \| undefined`                                                     |                | This hides the name when set to true.                                                                                                                                                                                   |                |
| `label`           |         | `string`                                                                   | `''`           | Used for the aria-label on the image. You can use `{{badgeText}}` in the string&#xA;to have it replaced by the value set in the badgeText. For example to show "6 unread messages", where 6 is also shown in the badge. |                |
| `orientation`     |         | `'horizontal' \| 'vertical'`                                               | `'horizontal'` | The orientation of the avatar.                                                                                                                                                                                          |                |
| `pictureUrl`      |         | `string \| undefined`                                                      |                | The url of the avatar image.                                                                                                                                                                                            |                |
| `size`            |         | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'`                           | `'md'`         | The size of the avatar.                                                                                                                                                                                                 |                |
| `status`          |         | `'danger' \| 'success' \| 'warning' \| 'accent' \| 'neutral' \| 'primary'` |                | Optional user status to show.                                                                                                                                                                                           |                |

### Attributes

| Name               | Field           | Inherited From |
| ------------------ | --------------- | -------------- |
| `badge-text`       | badgeText       |                |
| `fallback`         | fallback        |                |
| `image-only`       | imageOnly       |                |
| `label`            | label           |                |
| `orientation`      | orientation     |                |
| `size`             | size            |                |
| `status`           | status          |                |
| `display-name`     | displayName     |                |
| `display-initials` | displayInitials |                |
| `picture-url`      | pictureUrl      |                |

### CSS Properties

| Name                          | Default | Description                                                                                                           |
| ----------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| `--sl-avatar-max-inline-size` |         | Max inline-size of the container in vertical mode. If not set it will behave like a regular `display: block` element. |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Avatar` | Avatar      | ../packages/components/avatar/src/avatar.ts |         |

# `../packages/components/badge/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package        |
| ---- | ---- | ----------- | ------ | -------------- |
| `js` | `*`  | *           |        | ./src/badge.js |

# `../packages/components/badge/register.ts`:

## Exports

| Kind                        | Name       | Declaration | Module                                  | Package |
| --------------------------- | ---------- | ----------- | --------------------------------------- | ------- |
| `custom-element-definition` | `sl-badge` | Badge       | /packages/components/badge/src/badge.js |         |

# `../packages/components/badge/src/badge.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                         | Package |
| ---- | --------- | ----------- | ---------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/badge/src/badge.scss.ts |         |

# `../packages/components/badge/src/badge.ts`:

## class: `Badge`, `sl-badge`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name      | Privacy | Type           | Default     | Description                      | Inherited From |
| --------- | ------- | -------------- | ----------- | -------------------------------- | -------------- |
| `size`    |         | `BadgeSize`    | `'md'`      | The size of the badge component. |                |
| `variant` |         | `BadgeVariant` | `'neutral'` | The variant of the badge.        |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `size`    | size    |                |
| `variant` | variant |                |

### Slots

| Name      | Description           |
| --------- | --------------------- |
| `default` | Contents of the badge |

<hr/>

## Exports

| Kind | Name    | Declaration | Module                                    | Package |
| ---- | ------- | ----------- | ----------------------------------------- | ------- |
| `js` | `Badge` | Badge       | ../packages/components/badge/src/badge.ts |         |

# `../packages/components/breadcrumbs/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package              |
| ---- | ---- | ----------- | ------ | -------------------- |
| `js` | `*`  | *           |        | ./src/breadcrumbs.js |

# `../packages/components/breadcrumbs/register.ts`:

## Exports

| Kind                        | Name             | Declaration | Module                                              | Package |
| --------------------------- | ---------------- | ----------- | --------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-breadcrumbs` | Breadcrumbs | /packages/components/breadcrumbs/src/breadcrumbs.js |         |

# `../packages/components/breadcrumbs/src/breadcrumbs.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                     | Package |
| ---- | --------- | ----------- | ---------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/breadcrumbs/src/breadcrumbs.scss.ts |         |

# `../packages/components/breadcrumbs/src/breadcrumbs.ts`:

## class: `Breadcrumbs`, `sl-breadcrumbs`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Static Fields

| Name      | Privacy | Type      | Default | Description                                                                                                                                                                                                                                                    | Inherited From |
| --------- | ------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `homeUrl` |         | `string`  | `'/'`   | The url for the home link, defaults to the root url.&#xA;&#xA;By changing this static property you can change the default value for&#xA;all future instances of the component. Changing the static property&#xA;won't affect already created instances.        |                |
| `noHome`  |         | `boolean` | `false` | When true doesn't show a home link as the first breadcrumb.&#xA;&#xA;By changing this static property you can change the default value for&#xA;all future instances of the component. Changing the static property&#xA;won't affect already created instances. |                |

### Fields

| Name                | Privacy | Type           | Default | Description                                                                                                                                                                                                                                                                                              | Inherited From |
| ------------------- | ------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `breadcrumbs`       |         | `Breadcrumb[]` | `[]`    | The slotted breadcrumbs.                                                                                                                                                                                                                                                                                 |                |
| `collapseThreshold` |         | `number`       | `3`     | The threshold for when breadcrumbs should be collapsed into a menu.                                                                                                                                                                                                                                      |                |
| `homeUrl`           |         |                |         | The url for the home link, defaults to the root url.&#xA;&#xA;If you want to change the default value for all future instances of the component,&#xA;you can change the static property. If you want to change the property of an already&#xA;created instance, you need to change this property.        |                |
| `noHome`            |         |                |         | When true doesn't show a home link as the first breadcrumb.&#xA;&#xA;If you want to change the default value for all future instances of the component,&#xA;you can change the static property. If you want to change the property of an already&#xA;created instance, you need to change this property. |                |

### Attributes

| Name       | Field   | Inherited From |
| ---------- | ------- | -------------- |
| `home-url` | homeUrl |                |
| `no-home`  | noHome  |                |

### Slots

| Name      | Description                 |
| --------- | --------------------------- |
| `default` | The breadcrumbs to display. |

<hr/>

## Exports

| Kind | Name          | Declaration | Module                                                | Package |
| ---- | ------------- | ----------- | ----------------------------------------------------- | ------- |
| `js` | `Breadcrumbs` | Breadcrumbs | ../packages/components/breadcrumbs/src/breadcrumbs.ts |         |

# `../packages/components/button-bar/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package             |
| ---- | ---- | ----------- | ------ | ------------------- |
| `js` | `*`  | *           |        | ./src/button-bar.js |

# `../packages/components/button-bar/register.ts`:

## Exports

| Kind                        | Name            | Declaration | Module                                            | Package |
| --------------------------- | --------------- | ----------- | ------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-button-bar` | ButtonBar   | /packages/components/button-bar/src/button-bar.js |         |

# `../packages/components/button-bar/src/button-bar.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                   | Package |
| ---- | --------- | ----------- | -------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/button-bar/src/button-bar.scss.ts |         |

# `../packages/components/button-bar/src/button-bar.ts`:

## class: `ButtonBar`, `sl-button-bar`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name      | Privacy | Type                          | Default | Description                                                          | Inherited From |
| --------- | ------- | ----------------------------- | ------- | -------------------------------------------------------------------- | -------------- |
| `align`   |         | `ButtonBarAlign \| undefined` |         | The alignment of the buttons within the bar.                         |                |
| `reverse` |         | `boolean \| undefined`        |         | When set to true, the button order is reversed using flex-direction. |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `align`   | align   |                |
| `reverse` | reverse |                |

### CSS Properties

| Name                        | Default | Description                                 |
| --------------------------- | ------- | ------------------------------------------- |
| `--sl-button-bar-align`     |         | The alignment of the buttons within the bar |
| `--sl-button-bar-direction` |         | The flex direction of the button container  |

### Slots

| Name      | Description                      |
| --------- | -------------------------------- |
| `default` | Buttons to be grouped in the bar |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                              | Package |
| ---- | ----------- | ----------- | --------------------------------------------------- | ------- |
| `js` | `ButtonBar` | ButtonBar   | ../packages/components/button-bar/src/button-bar.ts |         |

# `../packages/components/button/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./src/button.js |

# `../packages/components/button/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                                    | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------------- | ------- |
| `custom-element-definition` | `sl-button` | Button      | /packages/components/button/src/button.js |         |

# `../packages/components/button/src/button.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/button/src/button.scss.ts |         |

# `../packages/components/button/src/button.ts`:

## class: `Button`, `sl-button`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name       | Privacy | Type                   | Default     | Description                                                                                                        | Inherited From |
| ---------- | ------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ | -------------- |
| `disabled` |         | `boolean \| undefined` |             | Whether the button is disabled; when set no interaction is possible.                                               |                |
| `fill`     |         | `ButtonFill`           | `'solid'`   | The fill of the button.                                                                                            |                |
| `size`     |         | `ButtonSize`           | `'md'`      | The size of the button.                                                                                            |                |
| `type`     |         | `ButtonType`           | `'button'`  | The type of the button. Can be used to mimic the functionality of submit and reset buttons in native HTML buttons. |                |
| `variant`  |         | `ButtonVariant`        | `'default'` | The variant of the button.                                                                                         |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `disabled` | disabled |                |
| `fill`     | fill     |                |
| `size`     | size     |                |
| `type`     | type     |                |
| `variant`  | variant  |                |

### Slots

| Name      | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| `default` | Text label of the button. Optionally an <code>sl-icon</code> can be added |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Button` | Button      | ../packages/components/button/src/button.ts |         |

# `../packages/components/card/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package       |
| ---- | ---- | ----------- | ------ | ------------- |
| `js` | `*`  | *           |        | ./src/card.js |

# `../packages/components/card/register.ts`:

## Exports

| Kind                        | Name      | Declaration | Module                                | Package |
| --------------------------- | --------- | ----------- | ------------------------------------- | ------- |
| `custom-element-definition` | `sl-card` | Card        | /packages/components/card/src/card.js |         |

# `../packages/components/card/src/card.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                       | Package |
| ---- | --------- | ----------- | -------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/card/src/card.scss.ts |         |

# `../packages/components/card/src/card.ts`:

## class: `Card`, `sl-card`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name             | Privacy | Type                   | Default        | Description                                                                                                                                                                            | Inherited From |
| ---------------- | ------- | ---------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `explicitHeight` |         | `boolean \| undefined` |                | When the height of the card is set (or constrained) by its container (for example in a grid with fixed rows) this needs to be set to be added in order to assure the correct rendering |                |
| `height`         |         | `CardHeightOptions`    | `'fixed'`      | When the height is `fixed` the image will determine the height of the card, when it is `flex` the height of the text will determine the height of the card.                            |                |
| `mediaPosition`  |         | `CardMediaPosition`    | `'start'`      | Show the media at the start or at the end.                                                                                                                                             |                |
| `orientation`    |         | `CardOrientation`      | `'horizontal'` | The position of the media in relation to the text                                                                                                                                      |                |
| `padding`        |         | `boolean`              | `false`        | Indicates whether there is a padding around the media. Recommended to set to true when the `--sl-card-stretch-image` isn't set to 100%                                                 |                |

### Attributes

| Name              | Field          | Inherited From |
| ----------------- | -------------- | -------------- |
| `padding`         | padding        |                |
| `explicit-height` | explicitHeight |                |
| `height`          | height         |                |
| `orientation`     | orientation    |                |
| `media-position`  | mediaPosition  |                |

### CSS Properties

| Name                               | Default | Description                                                                                                                                                                                           |
| ---------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sl-card-media-aspect-ratio`     |         | The aspectratio of the media container (default is 4/3). By default this ratio is always maintained, and will cause the media to become smaller when there isn't sufficient space for the full width. |
| `--sl-card-media-width`            |         | The width of the media in relation to the text. Can be set in pixels or `fr`.                                                                                                                         |
| `--sl-card-media-x`                |         | X-Focuspoint of the media; this is taken as the center when the media is cropped.                                                                                                                     |
| `--sl-card-media-y`                |         | Y-Focuspoint of the media; this is taken as the center when the media is cropped.                                                                                                                     |
| `--sl-card-orientation-breakpoint` |         | When card is smaller than this size it will switch from horizontal (when set) to vertical layout.                                                                                                     |
| `--sl-card-stretch-image`          |         | Set this to 100% when the aspectratio of the media doesn't matter and you want it to fill the full height of the card.                                                                                |
| `--sl-card-text-width`             |         | The width of the text in relation to the media. Can be set in pixels (not recommended) or `fr`.                                                                                                       |

### Slots

| Name      | Description                          |
| --------- | ------------------------------------ |
| `default` | Title of the card                    |
| `media`   | Media, this can be an image or video |
| `header`  | Subtitle or badges                   |
| `body`    | Body text of the card                |
| `actions` | Icon button for actions on the card. |

<hr/>

## Exports

| Kind | Name   | Declaration | Module                                  | Package |
| ---- | ------ | ----------- | --------------------------------------- | ------- |
| `js` | `Card` | Card        | ../packages/components/card/src/card.ts |         |

# `../packages/components/checkbox/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                 |
| ---- | ---- | ----------- | ------ | ----------------------- |
| `js` | `*`  | *           |        | ./src/checkbox.js       |
| `js` | `*`  | *           |        | ./src/checkbox-group.js |

# `../packages/components/checkbox/register.ts`:

## Exports

| Kind                        | Name                | Declaration   | Module                                              | Package |
| --------------------------- | ------------------- | ------------- | --------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-checkbox`       | Checkbox      | /packages/components/checkbox/src/checkbox.js       |         |
| `custom-element-definition` | `sl-checkbox-group` | CheckboxGroup | /packages/components/checkbox/src/checkbox-group.js |         |

# `../packages/components/checkbox/src/checkbox-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                     | Package |
| ---- | --------- | ----------- | ---------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/checkbox/src/checkbox-group.scss.ts |         |

# `../packages/components/checkbox/src/checkbox-group.ts`:

## class: `CheckboxGroup`, `sl-checkbox-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module | Package                |
| ------------------ | ------ | ---------------------- |
| `FormControlMixin` |        | @sl-design-system/form |

### Fields

| Name                | Privacy | Type                                         | Default | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `customValidity`    |         | `string \| undefined`                        |         | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `disabled`          |         | `boolean \| undefined`                       |         | Whether the group is disabled; when set no interaction is possible.                                                                                                                                                                                                                                                                                     |                  |
| `form`              |         | `HTMLFormElement \| null`                    |         | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                    |         | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null `` |         | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `name`              |         | `string \| undefined`                        |         | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                  |         |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `required`          |         | `boolean \| undefined`                       |         | At least one checkbox in the group must be checked if true.                                                                                                                                                                                                                                                                                             |                  |
| `showValid`         |         | `boolean`                                    | `false` | Optional property to indicate the valid state should be shown.                                                                                                                                                                                                                                                                                          | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`          |         | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `size`              |         | `'md' \| 'lg'`                               |         | The size of the checkboxes in the group.                                                                                                                                                                                                                                                                                                                |                  |
| `valid`             |         | `boolean`                                    |         | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                     |         | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                              |         | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`          |         | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                       |         | The value of the group.                                                                                                                                                                                                                                                                                                                                 | FormControlMixin |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | ---------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    | FormControlMixin |

### Events

| Name          | Type                               | Description                                | Inherited From   |
| ------------- | ---------------------------------- | ------------------------------------------ | ---------------- |
| `blurEvent`   | `EventEmitter<SlBlurEvent>`        | Emits when the component loses focus.      |                  |
| `changeEvent` | `EventEmitter<SlChangeEvent<T[]>>` | Emits when the value of the group changes. |                  |
| `focusEvent`  | `EventEmitter<SlFocusEvent>`       | Emits when the component receives focus.   |                  |
|               | `ValidateEvent`                    |                                            | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `disabled`        | disabled       |                  |
| `required`        | required       |                  |
| `size`            | size           |                  |
| `value`           | value          |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

### Slots

| Name      | Description                       |
| --------- | --------------------------------- |
| `default` | A list of `sl-checkbox` elements. |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                                | Package |
| ---- | --------------- | ------------- | ----------------------------------------------------- | ------- |
| `js` | `CheckboxGroup` | CheckboxGroup | ../packages/components/checkbox/src/checkbox-group.ts |         |

# `../packages/components/checkbox/src/checkbox.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                               | Package |
| ---- | --------- | ----------- | ---------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/checkbox/src/checkbox.scss.ts |         |

# `../packages/components/checkbox/src/checkbox.ts`:

## class: `Checkbox`, `sl-checkbox`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module | Package                |
| ------------------ | ------ | ---------------------- |
| `FormControlMixin` |        | @sl-design-system/form |

### Fields

| Name                | Privacy | Type                                         | Default | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `checked`           |         | `boolean \| undefined`                       |         | Whether the checkbox is checked.                                                                                                                                                                                                                                                                                                                        |                  |
| `customValidity`    |         | `string \| undefined`                        |         | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `disabled`          |         | `boolean \| undefined`                       |         | Whether the checkbox is disabled; when set no interaction is possible.                                                                                                                                                                                                                                                                                  |                  |
| `form`              |         | `HTMLFormElement \| null`                    |         | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                    |         | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `indeterminate`     |         | `boolean \| undefined`                       |         | Whether the checkbox has the indeterminate state.                                                                                                                                                                                                                                                                                                       |                  |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null `` |         | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `name`              |         | `string \| undefined`                        |         | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                  |         |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `required`          |         | `boolean \| undefined`                       |         | Whether the checkbox is required.                                                                                                                                                                                                                                                                                                                       |                  |
| `showValid`         |         | `boolean`                                    | `false` | When set will cause the control to show it is valid after reportValidity is called.                                                                                                                                                                                                                                                                     | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`          |         | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `size`              |         | `CheckboxSize`                               | `'md'`  | The size of the checkbox.                                                                                                                                                                                                                                                                                                                               |                  |
| `valid`             |         | `boolean`                                    |         | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                     |         | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                              |         | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`          |         | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                       |         | The value of the checkbox when the checkbox is checked.&#xA;See the formValue property for easy access.                                                                                                                                                                                                                                                 | FormControlMixin |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | ---------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    | FormControlMixin |

### Events

| Name          | Type                                     | Description                              | Inherited From   |
| ------------- | ---------------------------------------- | ---------------------------------------- | ---------------- |
| `blurEvent`   | `EventEmitter<SlBlurEvent>`              | Emits when the component loses focus.    |                  |
| `changeEvent` | `EventEmitter<SlChangeEvent<T \| null>>` | Emits when the checked state changes.    |                  |
| `focusEvent`  | `EventEmitter<SlFocusEvent>`             | Emits when the component receives focus. |                  |
|               | `ValidateEvent`                          |                                          | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `checked`         | checked        |                  |
| `disabled`        | disabled       |                  |
| `indeterminate`   | indeterminate  |                  |
| `required`        | required       |                  |
| `show-valid`      | showValid      |                  |
| `size`            | size           |                  |
| `value`           | value          |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

### Slots

| Name      | Description                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `default` | Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc. |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                          | Package |
| ---- | ---------- | ----------- | ----------------------------------------------- | ------- |
| `js` | `Checkbox` | Checkbox    | ../packages/components/checkbox/src/checkbox.ts |         |

# `../packages/components/dialog/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./src/dialog.js |

# `../packages/components/dialog/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                                    | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------------- | ------- |
| `custom-element-definition` | `sl-dialog` | Dialog      | /packages/components/dialog/src/dialog.js |         |

# `../packages/components/dialog/src/dialog.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/dialog/src/dialog.scss.ts |         |

# `../packages/components/dialog/src/dialog.ts`:

## class: `Dialog`, `sl-dialog`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name            | Privacy | Type                        | Default    | Description                                                                                           | Inherited From |
| --------------- | ------- | --------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- | -------------- |
| `closeButton`   |         | `boolean \| undefined`      |            | Determines whether a close button should be shown in the top right corner.                            |                |
| `dialogRole`    |         | `'dialog' \| 'alertdialog'` | `'dialog'` | The role for the dialog element.                                                                      |                |
| `disableCancel` |         | `boolean \| undefined`      |            | Disables the ability to cancel the dialog by pressing the Escape key&#xA;or clicking on the backdrop. |                |

### Methods

| Name        | Privacy | Description | Parameters | Return | Inherited From |
| ----------- | ------- | ----------- | ---------- | ------ | -------------- |
| `close`     |         |             |            | `void` |                |
| `showModal` |         |             |            | `void` |                |

### Events

| Name          | Type                          | Description                                                                                                                                | Inherited From |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `cancelEvent` | `EventEmitter<SlCancelEvent>` | Emits when the cancel has been cancelled. This happens when the user closes&#xA;the dialog using the escape key or clicks on the backdrop. |                |
| `closeEvent`  | `EventEmitter<SlCloseEvent>`  | Emits when the dialog has been closed.                                                                                                     |                |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `close-button`   | closeButton   |                |
| `dialog-role`    | dialogRole    |                |
| `disable-cancel` | disableCancel |                |

### CSS Properties

| Name                          | Default | Description                     |
| ----------------------------- | ------- | ------------------------------- |
| `--sl-dialog-max-inline-size` |         | The maximum width of the dialog |

### CSS Parts

| Name         | Description                             |
| ------------ | --------------------------------------- |
| `dialog`     | The dialog element                      |
| `titles`     | The container of the title and subtitle |
| `header-bar` | The button bar in the header            |
| `footer-bar` | The button bar in the footer            |

### Slots

| Name             | Description                                    |
| ---------------- | ---------------------------------------------- |
| `actions`        | Area where action buttons are placed           |
| `default`        | Body content for the dialog                    |
| `footer`         | Footer content for the dialog                  |
| `header`         | Header content for the dialog                  |
| `header-buttons` | More space for buttons for the dialog's header |
| `title`          | The title of the dialog                        |
| `subtitle`       | The subtitle of the dialog                     |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Dialog` | Dialog      | ../packages/components/dialog/src/dialog.ts |         |

# `../packages/components/drawer/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./src/drawer.js |

# `../packages/components/drawer/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                                    | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------------- | ------- |
| `custom-element-definition` | `sl-drawer` | Drawer      | /packages/components/drawer/src/drawer.js |         |

# `../packages/components/drawer/src/drawer.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/drawer/src/drawer.scss.ts |         |

# `../packages/components/drawer/src/drawer.ts`:

## class: `Drawer`, `sl-drawer`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name              | Privacy | Type                             | Default   | Description                                                    | Inherited From |
| ----------------- | ------- | -------------------------------- | --------- | -------------------------------------------------------------- | -------------- |
| `attachment`      |         | `DrawerAttachment`               | `'right'` | The side of the screen where the drawer is attached            |                |
| `closeButtonSize` |         | `ButtonSize`                     | `'sm'`    | The size of the button                                         |                |
| `dialog`          |         | `HTMLDialogElement \| undefined` |           |                                                                |                |
| `disableClose`    |         | `boolean`                        | `false`   | Disables the ability to close the dialog using the Escape key. |                |

### Methods

| Name        | Privacy | Description | Parameters | Return | Inherited From |
| ----------- | ------- | ----------- | ---------- | ------ | -------------- |
| `close`     |         |             |            | `void` |                |
| `showModal` |         |             |            | `void` |                |

### Attributes

| Name              | Field           | Inherited From |
| ----------------- | --------------- | -------------- |
| `disable-close`   | disableClose    |                |
| `attachment`      | attachment      |                |
| `closeButtonSize` | closeButtonSize |                |

### CSS Properties

| Name                          | Default | Description                           |
| ----------------------------- | ------- | ------------------------------------- |
| `--sl-drawer-max-inline-size` |         | The maximum inline size of the drawer |

### Slots

| Name      | Description                   |
| --------- | ----------------------------- |
| `default` | Body content for the drawer   |
| `header`  | Header content for the drawer |
| `title`   | The title of the drawer       |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Drawer` | Drawer      | ../packages/components/drawer/src/drawer.ts |         |

# `../packages/components/editor/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./src/editor.js |

# `../packages/components/editor/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                                    | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------------- | ------- |
| `custom-element-definition` | `sl-editor` | Editor      | /packages/components/editor/src/editor.js |         |

# `../packages/components/editor/src/commands.ts`:

## Functions

| Name      | Description | Parameters        | Return    |
| --------- | ----------- | ----------------- | --------- |
| `setHTML` |             | `content: string` | `Command` |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `setHTML` | setHTML     | ../packages/components/editor/src/commands.ts |         |

# `../packages/components/editor/src/editor.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/editor/src/editor.scss.ts |         |

# `../packages/components/editor/src/editor.ts`:

## class: `Editor`, `sl-editor`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module | Package                |
| ------------------ | ------ | ---------------------- |
| `FormControlMixin` |        | @sl-design-system/form |

### Fields

| Name                | Privacy | Type                                         | Default | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `customValidity`    |         | `string \| undefined`                        |         | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `form`              |         | `HTMLFormElement \| null`                    |         | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                    |         | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null `` |         | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `name`              |         | `string \| undefined`                        |         | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                  |         |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `plugins`           |         | `Plugin[] \| undefined`                      |         | Additional plugins.                                                                                                                                                                                                                                                                                                                                     |                  |
| `showValid`         |         | `boolean`                                    | `false` | Optional property to indicate the valid state should be shown.                                                                                                                                                                                                                                                                                          | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`          |         | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `valid`             |         | `boolean`                                    |         | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                     |         | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                              |         | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`          |         | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                       |         | The value for this form control.                                                                                                                                                                                                                                                                                                                        | FormControlMixin |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return                             | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------- | ---------------- |
| `createEditor`                  |         |                                                                                                                                                                                                                                                 |                                      | `EditorView`                       |                  |
| `createSchema`                  |         |                                                                                                                                                                                                                                                 |                                      | `Schema<EditorNodes, EditorMarks>` |                  |
| `createState`                   |         |                                                                                                                                                                                                                                                 |                                      | `EditorState`                      |                  |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`                           | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean`                          | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`                             | FormControlMixin |

### Events

| Name | Type            | Description | Inherited From   |
| ---- | --------------- | ----------- | ---------------- |
|      | `ValidateEvent` |             | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `value`           | value          |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Editor` | Editor      | ../packages/components/editor/src/editor.ts |         |

# `../packages/components/editor/src/keymap.ts`:

## Functions

| Name              | Description | Parameters                                 | Return                       |
| ----------------- | ----------- | ------------------------------------------ | ---------------------------- |
| `buildKeymap`     |             | `schema: Schema<EditorNodes, EditorMarks>` | `{ [key: string]: Command }` |
| `buildListKeymap` |             | `schema: Schema<EditorNodes, EditorMarks>` | `{ [key: string]: Command }` |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                      | Package |
| ---- | ----------------- | --------------- | ------------------------------------------- | ------- |
| `js` | `buildKeymap`     | buildKeymap     | ../packages/components/editor/src/keymap.ts |         |
| `js` | `buildListKeymap` | buildListKeymap | ../packages/components/editor/src/keymap.ts |         |

# `../packages/components/editor/src/list-utils.ts`:

## Functions

| Name                      | Description | Parameters                                                                                | Return                |
| ------------------------- | ----------- | ----------------------------------------------------------------------------------------- | --------------------- |
| `findAncestorPosition`    |             | `doc: Node, pos: ResolvedPos`                                                             | `ResolvedPos`         |
| `getAncestorNodesBetween` |             | `doc: Node, $from: ResolvedPos, $to: ResolvedPos`                                         | `Node[]`              |
| `getListLiftTarget`       |             | `schema: Schema, resPos: ResolvedPos`                                                     | `number`              |
| `isRangeOfType`           |             | `doc: Node, $from: ResolvedPos, $to: ResolvedPos, nodeType: NodeType`                     | `boolean`             |
| `liftFollowingList`       |             | `state: EditorState, from: number, to: number, rootListDepthNum: number, tr: Transaction` | `Transaction`         |
| `liftListItems`           |             |                                                                                           | `Command`             |
| `liftSelectionList`       |             | `state: EditorState, tr: Transaction`                                                     | `Transaction`         |
| `rootListDepth`           |             | `pos: ResolvedPos, nodes: { [key: string]: NodeType }`                                    | `number \| undefined` |
| `splitListItemKeepMarks`  |             | `itemType: NodeType`                                                                      |                       |
| `toggleList`              |             | `state: EditorState, dispatch: DispatchFn, view: EditorView, listType: string`            | `boolean`             |
| `toggleListCommand`       |             | `listType: string`                                                                        | `Command`             |
| `toggleOrderedList`       |             | `state: EditorState, dispatch: DispatchFn, view: EditorView`                              | `boolean`             |
| `toggleUnorderedList`     |             | `state: EditorState, dispatch: DispatchFn, view: EditorView`                              | `boolean`             |
| `wrapInList`              |             | `nodeType: NodeType`                                                                      | `Command`             |

<hr/>

## Exports

| Kind | Name                      | Declaration             | Module                                          | Package |
| ---- | ------------------------- | ----------------------- | ----------------------------------------------- | ------- |
| `js` | `rootListDepth`           | rootListDepth           | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `getListLiftTarget`       | getListLiftTarget       | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `liftSelectionList`       | liftSelectionList       | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `toggleList`              | toggleList              | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `toggleListCommand`       | toggleListCommand       | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `liftFollowingList`       | liftFollowingList       | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `isRangeOfType`           | isRangeOfType           | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `getAncestorNodesBetween` | getAncestorNodesBetween | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `findAncestorPosition`    | findAncestorPosition    | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `liftListItems`           | liftListItems           | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `wrapInList`              | wrapInList              | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `toggleUnorderedList`     | toggleUnorderedList     | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `toggleOrderedList`       | toggleOrderedList       | ../packages/components/editor/src/list-utils.ts |         |
| `js` | `splitListItemKeepMarks`  | splitListItemKeepMarks  | ../packages/components/editor/src/list-utils.ts |         |

# `../packages/components/editor/src/schema.ts`:

## Variables

| Name    | Description | Type                            |
| ------- | ----------- | ------------------------------- |
| `marks` |             | `Record<EditorMarks, MarkSpec>` |
| `nodes` |             | `Record<EditorNodes, NodeSpec>` |

<hr/>

## Functions

| Name                 | Description | Parameters                                                          | Return                   |
| -------------------- | ----------- | ------------------------------------------------------------------- | ------------------------ |
| `commonAttributes`   |             |                                                                     | `Attrs`                  |
| `isEmpty`            |             | `obj: Record<string, unknown>`                                      | `boolean`                |
| `removeEmptyEntries` |             | `obj: Record<string, unknown>`                                      | `Record<string, string>` |
| `removeEntries`      |             | `obj: Record<string, unknown>, predicate: (key: string) => boolean` | `Record<string, string>` |

<hr/>

## Exports

| Kind | Name                 | Declaration        | Module                                      | Package |
| ---- | -------------------- | ------------------ | ------------------------------------------- | ------- |
| `js` | `isEmpty`            | isEmpty            | ../packages/components/editor/src/schema.ts |         |
| `js` | `removeEntries`      | removeEntries      | ../packages/components/editor/src/schema.ts |         |
| `js` | `removeEmptyEntries` | removeEmptyEntries | ../packages/components/editor/src/schema.ts |         |
| `js` | `commonAttributes`   | commonAttributes   | ../packages/components/editor/src/schema.ts |         |
| `js` | `marks`              | marks              | ../packages/components/editor/src/schema.ts |         |
| `js` | `nodes`              | nodes              | ../packages/components/editor/src/schema.ts |         |

# `../packages/components/editor/src/utils.ts`:

## Functions

| Name                | Description | Parameters              | Return   |
| ------------------- | ----------- | ----------------------- | -------- |
| `createContentNode` |             | `schema: Schema, value` | `Node`   |
| `getHTML`           |             | `state: EditorState`    | `string` |

<hr/>

## Exports

| Kind | Name                | Declaration       | Module                                     | Package |
| ---- | ------------------- | ----------------- | ------------------------------------------ | ------- |
| `js` | `createContentNode` | createContentNode | ../packages/components/editor/src/utils.ts |         |
| `js` | `getHTML`           | getHTML           | ../packages/components/editor/src/utils.ts |         |

# `../packages/components/form/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                        |
| ---- | ---- | ----------- | ------ | ------------------------------ |
| `js` | `*`  | *           |        | ./src/error.js                 |
| `js` | `*`  | *           |        | ./src/form-control-mixin.js    |
| `js` | `*`  | *           |        | ./src/form-field.js            |
| `js` | `*`  | *           |        | ./src/form.js                  |
| `js` | `*`  | *           |        | ./src/hint.js                  |
| `js` | `*`  | *           |        | ./src/label.js                 |
| `js` | `*`  | *           |        | ./src/update-validity-event.js |
| `js` | `*`  | *           |        | ./src/validate-event.js        |

# `../packages/components/form/register.ts`:

## Exports

| Kind                        | Name            | Declaration | Module                                      | Package |
| --------------------------- | --------------- | ----------- | ------------------------------------------- | ------- |
| `custom-element-definition` | `sl-error`      | Error       | /packages/components/form/src/error.js      |         |
| `custom-element-definition` | `sl-form`       | Form        | /packages/components/form/src/form.js       |         |
| `custom-element-definition` | `sl-form-field` | FormField   | /packages/components/form/src/form-field.js |         |
| `custom-element-definition` | `sl-hint`       | Hint        | /packages/components/form/src/hint.js       |         |
| `custom-element-definition` | `sl-label`      | Label       | /packages/components/form/src/label.js      |         |

# `../packages/components/form/src/error.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/form/src/error.scss.ts |         |

# `../packages/components/form/src/error.ts`:

## class: `Error`, `sl-error`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name     | Privacy | Type                   | Default | Description                                                                                                                        | Inherited From |
| -------- | ------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `noIcon` |         | `boolean \| undefined` |         | Whether the icon should be hidden. This can be useful when the form control&#xA;already shows an icon inside the component itself. |                |
| `size`   |         | `ErrorSize`            | `'md'`  | The size at which the error is displayed.                                                                                          |                |

### Attributes

| Name      | Field  | Inherited From |
| --------- | ------ | -------------- |
| `no-icon` | noIcon |                |
| `size`    | size   |                |

### Slots

| Name         | Description                   |
| ------------ | ----------------------------- |
| `error-text` | The error message to display. |

<hr/>

## Exports

| Kind | Name    | Declaration | Module                                   | Package |
| ---- | ------- | ----------- | ---------------------------------------- | ------- |
| `js` | `Error` | Error       | ../packages/components/form/src/error.ts |         |

# `../packages/components/form/src/form-control-mixin.ts`:

## mixin: `FormControlMixin`

### Parameters

| Name          | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `constructor` | `T`  |         |             |

### Fields

| Name                | Privacy | Type                                         | Default | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From |
| ------------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `customValidity`    |         | `string \| undefined`                        |         | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               |                |
| `form`              |         | `HTMLFormElement \| null`                    |         | The form associated with the control.                                                                                                                                                                                                                                                                                                                   |                |
| `formValue`         |         | `unknown`                                    |         | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                |                |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null `` |         | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 |                |
| `name`              |         | `string \| undefined`                        |         | The name of the form control.                                                                                                                                                                                                                                                                                                                           |                |
| `nativeFormValue`   |         | `FormValue`                                  |         |                                                                                                                                                                                                                                                                                                                                                         |                |
| `showValid`         |         | `boolean`                                    | `false` | Optional property to indicate the valid state should be shown.                                                                                                                                                                                                                                                                                          |                |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`          |         | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     |                |
| `valid`             |         | `boolean`                                    |         | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       |                |
| `validationMessage` |         | `string`                                     |         | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. |                |
| `validity`          |         | `ValidityState`                              |         | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           |                |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`          |         | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     |                |
| `value`             |         | `unknown \| undefined`                       |         | The value for this form control.                                                                                                                                                                                                                                                                                                                        |                |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | -------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  |                |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` |                |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    |                |

### Events

| Name | Type            | Description | Inherited From |
| ---- | --------------- | ----------- | -------------- |
|      | `ValidateEvent` |             |                |

### Attributes

| Name              | Field          | Inherited From |
| ----------------- | -------------- | -------------- |
| `custom-validity` | customValidity |                |
| `name`            | name           |                |
| `show-validity`   | showValidity   |                |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                                | Package |
| ---- | ------------------ | ---------------- | ----------------------------------------------------- | ------- |
| `js` | `FormControlMixin` | FormControlMixin | ../packages/components/form/src/form-control-mixin.ts |         |

# `../packages/components/form/src/form-field.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                             | Package |
| ---- | --------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/form/src/form-field.scss.ts |         |

# `../packages/components/form/src/form-field.ts`:

## class: `FormField`, `sl-form-field`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name      | Privacy | Type                                     | Default | Description                                                                                                    | Inherited From |
| --------- | ------- | ---------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- | -------------- |
| `control` |         | `HTMLElement & FormControl \| undefined` |         | The form control element.                                                                                      |                |
| `hint`    |         | `string \| undefined`                    |         | A hint that will be shown when there are no validation messages.&#xA;You can also slot an `<sl-hint>` element. |                |
| `label`   |         | `string \| undefined`                    |         | The text for the label. You can also slot an `<sl-label>` element.                                             |                |
| `mark`    |         | `LabelMark \| undefined`                 |         | How to mark this field depending if it is required or not.                                                     |                |

### Events

| Name             | Type                             | Description                              | Inherited From |
| ---------------- | -------------------------------- | ---------------------------------------- | -------------- |
| `formFieldEvent` | `EventEmitter<SlFormFieldEvent>` | Emits when the field is added to a form. |                |

### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `hint`  | hint  |                |
| `label` | label |                |
| `mark`  | mark  |                |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                        | Package |
| ---- | ----------- | ----------- | --------------------------------------------- | ------- |
| `js` | `FormField` | FormField   | ../packages/components/form/src/form-field.ts |         |

# `../packages/components/form/src/form.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                       | Package |
| ---- | --------- | ----------- | -------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/form/src/form.scss.ts |         |

# `../packages/components/form/src/form.ts`:

## class: `Form`, `sl-form`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name           | Privacy | Type          | Default | Description             | Inherited From |
| -------------- | ------- | ------------- | ------- | ----------------------- | -------------- |
| `fields`       |         | `FormField[]` | `[]`    | The fields in the form. |                |
| `showValidity` |         | `boolean`     |         |                         |                |
| `valid`        |         | `boolean`     |         |                         |                |
| `value`        |         | `T`           |         |                         |                |

### Methods

| Name             | Privacy | Description | Parameters | Return    | Inherited From |
| ---------------- | ------- | ----------- | ---------- | --------- | -------------- |
| `reportValidity` |         |             |            | `boolean` |                |

<hr/>

## Exports

| Kind | Name   | Declaration | Module                                  | Package |
| ---- | ------ | ----------- | --------------------------------------- | ------- |
| `js` | `Form` | Form        | ../packages/components/form/src/form.ts |         |

# `../packages/components/form/src/hint.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                       | Package |
| ---- | --------- | ----------- | -------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/form/src/hint.scss.ts |         |

# `../packages/components/form/src/hint.ts`:

## class: `Hint`, `sl-hint`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name   | Privacy | Type       | Default | Description                              | Inherited From |
| ------ | ------- | ---------- | ------- | ---------------------------------------- | -------------- |
| `size` |         | `HintSize` | `'md'`  | The size at which the hint is displayed. |                |

### Attributes

| Name   | Field | Inherited From |
| ------ | ----- | -------------- |
| `size` | size  |                |

### Slots

| Name        | Description          |
| ----------- | -------------------- |
| `hint-text` | The hint to display. |

<hr/>

## Exports

| Kind | Name   | Declaration | Module                                  | Package |
| ---- | ------ | ----------- | --------------------------------------- | ------- |
| `js` | `Hint` | Hint        | ../packages/components/form/src/hint.ts |         |

# `../packages/components/form/src/label.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/form/src/label.scss.ts |         |

# `../packages/components/form/src/label.ts`:

## class: `Label`, `sl-label`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name       | Privacy | Type                     | Default | Description                                                                       | Inherited From |
| ---------- | ------- | ------------------------ | ------- | --------------------------------------------------------------------------------- | -------------- |
| `disabled` |         | `boolean`                | `false` | Whether the form control is disabled; when set no interaction is possible.        |                |
| `for`      |         | `string \| undefined`    |         | The DOM id of the form control this is linked to.                                 |                |
| `mark`     |         | `LabelMark \| undefined` |         | Indicates whether the label should indicate if the field is optional or required. |                |
| `size`     |         | `LabelSize`              | `'md'`  | The size of the label.                                                            |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `disabled` | disabled |                |
| `for`      | for      |                |
| `mark`     | mark     |                |
| `size`     | size     |                |

<hr/>

## Exports

| Kind | Name    | Declaration | Module                                   | Package |
| ---- | ------- | ----------- | ---------------------------------------- | ------- |
| `js` | `Label` | Label       | ../packages/components/form/src/label.ts |         |

# `../packages/components/form/src/update-validity-event.ts`:

## class: `UpdateValidityEvent`

### Superclass

| Name    | Module                                                   | Package |
| ------- | -------------------------------------------------------- | ------- |
| `Event` | ../packages/components/form/src/update-validity-event.ts |         |

### Fields

| Name                | Privacy | Type | Default | Description                                       | Inherited From |
| ------------------- | ------- | ---- | ------- | ------------------------------------------------- | -------------- |
| `showValidity`      |         |      |         | What kind of validity should be shown to the user |                |
| `valid`             |         |      |         | The validity state of the element                 |                |
| `validationMessage` |         |      |         | The validation message of the element             |                |

### Events

| Name                 | Type | Description | Inherited From |
| -------------------- | ---- | ----------- | -------------- |
| `sl-update-validity` |      |             |                |

<hr/>

## Exports

| Kind | Name                  | Declaration         | Module                                                   | Package |
| ---- | --------------------- | ------------------- | -------------------------------------------------------- | ------- |
| `js` | `UpdateValidityEvent` | UpdateValidityEvent | ../packages/components/form/src/update-validity-event.ts |         |

# `../packages/components/form/src/validate-event.ts`:

## class: `ValidateEvent`

### Superclass

| Name    | Module                                            | Package |
| ------- | ------------------------------------------------- | ------- |
| `Event` | ../packages/components/form/src/validate-event.ts |         |

### Events

| Name          | Type | Description | Inherited From |
| ------------- | ---- | ----------- | -------------- |
| `sl-validate` |      |             |                |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                            | Package |
| ---- | --------------- | ------------- | ------------------------------------------------- | ------- |
| `js` | `ValidateEvent` | ValidateEvent | ../packages/components/form/src/validate-event.ts |         |

# `../packages/components/grid/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                     |
| ---- | ---- | ----------- | ------ | --------------------------- |
| `js` | `*`  | *           |        | ./src/column.js             |
| `js` | `*`  | *           |        | ./src/column-group.js       |
| `js` | `*`  | *           |        | ./src/drag-handle-column.js |
| `js` | `*`  | *           |        | ./src/filter-column.js      |
| `js` | `*`  | *           |        | ./src/grid.js               |
| `js` | `*`  | *           |        | ./src/select-column.js      |
| `js` | `*`  | *           |        | ./src/selection-column.js   |
| `js` | `*`  | *           |        | ./src/sort-column.js        |
| `js` | `*`  | *           |        | ./src/text-field-column.js  |

# `../packages/components/grid/register.ts`:

## Exports

| Kind                        | Name                         | Declaration          | Module                                              | Package |
| --------------------------- | ---------------------------- | -------------------- | --------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-grid`                    | Grid                 | /packages/components/grid/src/grid.js               |         |
| `custom-element-definition` | `sl-grid-column`             | GridColumn           | /packages/components/grid/src/column.js             |         |
| `custom-element-definition` | `sl-grid-column-group`       | GridColumnGroup      | /packages/components/grid/src/column-group.js       |         |
| `custom-element-definition` | `sl-grid-drag-handle-column` | GridDragHandleColumn | /packages/components/grid/src/drag-handle-column.js |         |
| `custom-element-definition` | `sl-grid-filter-column`      | GridFilterColumn     | /packages/components/grid/src/filter-column.js      |         |
| `custom-element-definition` | `sl-grid-select-column`      | GridSelectColumn     | /packages/components/grid/src/select-column.js      |         |
| `custom-element-definition` | `sl-grid-selection-column`   | GridSelectionColumn  | /packages/components/grid/src/selection-column.js   |         |
| `custom-element-definition` | `sl-grid-sort-column`        | GridSortColumn       | /packages/components/grid/src/sort-column.js        |         |
| `custom-element-definition` | `sl-grid-text-field-column`  | GridTextFieldColumn  | /packages/components/grid/src/text-field-column.js  |         |

# `../packages/components/grid/src/column-group.ts`:

## class: `GridColumnGroup`, `sl-grid-column-group`

### Superclass

| Name         | Module                                  | Package |
| ------------ | --------------------------------------- | ------- |
| `GridColumn` | /packages/components/grid/src/column.js |         |

### Fields

| Name             | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ---------------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`          |         | `GridColumnAlignment`                             | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth`      |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `columns`        |         | `Array<GridColumn<T>>`                            | `[]`      | The nested columns in the group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| `grid`           |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`           |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`         |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `parts`          |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `path`           |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `renderer`       |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `scopedElements` |         | `Record<string, typeof HTMLElement> \| undefined` |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `sticky`         |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`          |         | `number \| undefined`                             |           | The width of the group column is either manually specified, or the sum of the nested columns.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`     |         |                                                                                                                                                                | `item: T`  | `string[]`          | GridColumn     |
| `itemsChanged` |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              | GridColumn     |
| `renderData`   |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    | GridColumn     |
| `renderHeader` |         |                                                                                                                                                                |            | `TemplateResult`    | GridColumn     |
| `renderStyles` |         |                                                                                                                                                                |            | `CSSResult \| void` | GridColumn     |
| `stateChanged` |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              | GridColumn     |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. | GridColumn     |

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

| Kind | Name              | Declaration     | Module                                          | Package |
| ---- | ----------------- | --------------- | ----------------------------------------------- | ------- |
| `js` | `GridColumnGroup` | GridColumnGroup | ../packages/components/grid/src/column-group.ts |         |

# `../packages/components/grid/src/column.ts`:

## class: `GridColumn`, `sl-grid-column`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name             | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ---------------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`          |         | `GridColumnAlignment`                             | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                |
| `autoWidth`      |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. |                |
| `grid`           |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                |
| `grow`           |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                |
| `header`         |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| `parts`          |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                |
| `path`           |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                |
| `renderer`       |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                |
| `scopedElements` |         | `Record<string, typeof HTMLElement> \| undefined` |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| `sticky`         |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                |
| `width`          |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                |

### Methods

| Name           | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`     |         |                                                                                                                                                                | `item: T`  | `string[]`          |                |
| `itemsChanged` |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              |                |
| `renderData`   |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    |                |
| `renderHeader` |         |                                                                                                                                                                |            | `TemplateResult`    |                |
| `renderStyles` |         |                                                                                                                                                                |            | `CSSResult \| void` |                |
| `stateChanged` |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              |                |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. |                |

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

| Kind | Name         | Declaration | Module                                    | Package |
| ---- | ------------ | ----------- | ----------------------------------------- | ------- |
| `js` | `GridColumn` | GridColumn  | ../packages/components/grid/src/column.ts |         |

# `../packages/components/grid/src/drag-handle-column.ts`:

## class: `GridDragHandleColumn`, `sl-grid-drag-handle-column`

### Superclass

| Name         | Module                                  | Package |
| ------------ | --------------------------------------- | ------- |
| `GridColumn` | /packages/components/grid/src/column.js |         |

### Fields

| Name             | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ---------------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`          |         | `GridColumnAlignment`                             | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth`      |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`           |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`           |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`         |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `parts`          |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `path`           |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `renderer`       |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `scopedElements` |         | `Record<string, typeof HTMLElement> \| undefined` |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `sticky`         |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`          |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`     |         |                                                                                                                                                                | `item: T`  | `string[]`          | GridColumn     |
| `itemsChanged` |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              | GridColumn     |
| `renderData`   |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    | GridColumn     |
| `renderHeader` |         |                                                                                                                                                                |            | `TemplateResult`    | GridColumn     |
| `renderStyles` |         |                                                                                                                                                                |            | `CSSResult \| void` | GridColumn     |
| `stateChanged` |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              | GridColumn     |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. | GridColumn     |

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

| Kind | Name                   | Declaration          | Module                                                | Package |
| ---- | ---------------------- | -------------------- | ----------------------------------------------------- | ------- |
| `js` | `GridDragHandleColumn` | GridDragHandleColumn | ../packages/components/grid/src/drag-handle-column.ts |         |

# `../packages/components/grid/src/filter-column.ts`:

## class: `GridFilterColumn`, `sl-grid-filter-column`

### Superclass

| Name         | Module                                  | Package |
| ------------ | --------------------------------------- | ------- |
| `GridColumn` | /packages/components/grid/src/column.js |         |

### Fields

| Name              | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ----------------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`           |         | `GridColumnAlignment`                             | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth`       |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `filter`          |         | `DataSourceFilterFunction<T> \| undefined`        |           | The filter function if you want to do custom filtering.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                |
| `grid`            |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`            |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`          |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `internalOptions` |         | `GridFilterOption[] \| undefined`                 |           | The internal options if none are provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                |
| `mode`            |         | `select \| text`                                  |           | The mode for the filter:&#xA;\- `select`: The filter will allow you to select from a list of options. If none&#xA;are provided, the filter will create a list of options based on the column's values&#xA;\- `text`: The filter will be a text field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                |
| `options`         |         | `GridFilterOption[] \| undefined`                 |           | The options you can choose from to filter. If not provided,&#xA;the filter will be a text field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| `parts`           |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `path`            |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `renderer`        |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `scopedElements`  |         | `Record<string, typeof HTMLElement> \| undefined` |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `sticky`          |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `value`           |         | `string \| string[] \| undefined`                 |           | The value for this filter column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                |
| `width`           |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`     |         |                                                                                                                                                                | `item: T`  | `string[]`          | GridColumn     |
| `itemsChanged` |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              | GridColumn     |
| `renderData`   |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    | GridColumn     |
| `renderHeader` |         |                                                                                                                                                                |            | `TemplateResult`    | GridColumn     |
| `renderStyles` |         |                                                                                                                                                                |            | `CSSResult \| void` | GridColumn     |
| `stateChanged` |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              | GridColumn     |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. | GridColumn     |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `mode`       | mode      |                |
| `value`      | value     |                |
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

| Kind | Name               | Declaration      | Module                                           | Package |
| ---- | ------------------ | ---------------- | ------------------------------------------------ | ------- |
| `js` | `GridFilterColumn` | GridFilterColumn | ../packages/components/grid/src/filter-column.ts |         |

# `../packages/components/grid/src/filter.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                         | Package |
| ---- | --------- | ----------- | ---------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/grid/src/filter.scss.ts |         |

# `../packages/components/grid/src/filter.ts`:

## class: `GridFilter`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name      | Privacy | Type                                       | Default | Description                         | Inherited From |
| --------- | ------- | ------------------------------------------ | ------- | ----------------------------------- | -------------- |
| `column`  |         | `GridColumn<T>`                            |         | The grid column.                    |                |
| `filter`  |         | `DataSourceFilterFunction<T> \| undefined` |         | The custom filter                   |                |
| `mode`    |         | `GridFilterMode \| undefined`              |         | The mode of the filter.             |                |
| `options` |         | `GridFilterOption[] \| undefined`          |         | The filter options.                 |                |
| `path`    |         | `string \| undefined`                      |         | The path to the field to filter on. |                |
| `value`   |         | `string \| string[] \| undefined`          |         |                                     |                |

### Events

| Name                     | Type                                        | Description                                          | Inherited From |
| ------------------------ | ------------------------------------------- | ---------------------------------------------------- | -------------- |
| `filterChangeEvent`      | `EventEmitter<SlFilterChangeEvent>`         | Emits when the filter has been added or removed.     |                |
| `filterValueChangeEvent` | `EventEmitter<SlFilterValueChangeEvent<T>>` | Emits when the value of the this filter has changed. |                |

### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `mode`  | mode  |                |
| `path`  | path  |                |
| `value` | value |                |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                    | Package |
| ---- | ------------ | ----------- | ----------------------------------------- | ------- |
| `js` | `GridFilter` | GridFilter  | ../packages/components/grid/src/filter.ts |         |

# `../packages/components/grid/src/grid.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                       | Package |
| ---- | --------- | ----------- | -------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/grid/src/grid.scss.ts |         |

# `../packages/components/grid/src/grid.ts`:

## class: `Grid`, `sl-grid`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name            | Privacy | Type                             | Default                            | Description                                                                                                                                                                                                                                                              | Inherited From |
| --------------- | ------- | -------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `activeItem`    |         | `T \| undefined`                 |                                    | The active item in the grid.                                                                                                                                                                                                                                             |                |
| `dataSource`    |         | `DataSource<T> \| undefined`     |                                    | Provide your own implementation for getting the data.                                                                                                                                                                                                                    |                |
| `draggableRows` |         | `GridDraggableRows \| undefined` |                                    | Whether you can drag rows in the grid. If you use the drag-handle column,&#xA;then this property is automatically set by the column to 'between'.                                                                                                                        |                |
| `dropFilter`    |         | `GridDropFilter<T> \| undefined` |                                    | Determines if or what kind of drop target the given item is:&#xA;\- boolean: the item is valid drop target based on the draggableRows value&#xA;\- 'between': the item is a valid drop target between&#xA;\- 'on-top': the item is a valid drop target to drop on top of |                |
| `itemParts`     |         | `GridItemParts<T> \| undefined`  |                                    | Custom parts to be set on the `<tr>` so it can be styled externally.                                                                                                                                                                                                     |                |
| `items`         |         | `T[] \| undefined`               |                                    | An array of items to be displayed in the grid.                                                                                                                                                                                                                           |                |
| `itemsGroupBy`  |         | `string \| undefined`            |                                    | The path to the attribute to group the items on.                                                                                                                                                                                                                         |                |
| `model`         |         |                                  | `new GridViewModel<T>(this)`       | The model used for rendering the grid.                                                                                                                                                                                                                                   |                |
| `noBorder`      |         | `boolean \| undefined`           |                                    | Hide the border around the grid when true.                                                                                                                                                                                                                               |                |
| `noRowBorder`   |         | `boolean \| undefined`           |                                    | Hides the border between rows when true.                                                                                                                                                                                                                                 |                |
| `selection`     |         |                                  | `new SelectionController<T>(this)` | Selection manager.                                                                                                                                                                                                                                                       |                |
| `striped`       |         | `boolean \| undefined`           |                                    | Uses alternating background colors for the rows when set.                                                                                                                                                                                                                |                |
| `tbody`         |         | `HTMLTableSectionElement`        |                                    | The `<tbody>` element.                                                                                                                                                                                                                                                   |                |
| `thead`         |         | `HTMLTableSectionElement`        |                                    | The `<thead>` element.                                                                                                                                                                                                                                                   |                |

### Methods

| Name                      | Privacy | Description                                                              | Parameters                  | Return           | Inherited From |
| ------------------------- | ------- | ------------------------------------------------------------------------ | --------------------------- | ---------------- | -------------- |
| `recalculateColumnWidths` |         | Updates the `width` of all columns which have `autoWidth` set to `true`. |                             | `Promise<void>`  |                |
| `renderGroupRow`          |         |                                                                          | `group: GridViewModelGroup` | `TemplateResult` |                |
| `renderHeader`            |         |                                                                          |                             | `TemplateResult` |                |
| `renderItem`              |         |                                                                          | `item: T, index: number`    | `TemplateResult` |                |
| `renderItemRow`           |         |                                                                          | `item: T, index: number`    | `TemplateResult` |                |
| `renderStyles`            |         |                                                                          |                             | `TemplateResult` |                |

### Events

| Name                    | Type                                       | Description                                   | Inherited From |
| ----------------------- | ------------------------------------------ | --------------------------------------------- | -------------- |
| `activeItemChangeEvent` | `EventEmitter<SlActiveItemChangeEvent<T>>` | Emits when the active item changes            |                |
| `dragStartEvent`        | `EventEmitter<SlDragStartEvent<T>>`        | Emits when a drag operation is starting.      |                |
| `dragEndEvent`          | `EventEmitter<SlDragEndEvent<T>>`          | Emits when a drag operation has finished.     |                |
| `dropEvent`             | `EventEmitter<SlDropEvent<T>>`             | Emits when an item has been dropped.          |                |
| `stateChangeEvent`      | `EventEmitter<SlStateChangeEvent<T>>`      | Emits when the state in the grid has changed. |                |

### Attributes

| Name             | Field         | Inherited From |
| ---------------- | ------------- | -------------- |
| `draggable-rows` | draggableRows |                |
| `items`          | items         |                |
| `items-group-by` | itemsGroupBy  |                |
| `no-border`      | noBorder      |                |
| `no-row-border`  | noRowBorder   |                |
| `striped`        | striped       |                |

<hr/>

## Exports

| Kind | Name   | Declaration | Module                                  | Package |
| ---- | ------ | ----------- | --------------------------------------- | ------- |
| `js` | `Grid` | Grid        | ../packages/components/grid/src/grid.ts |         |

# `../packages/components/grid/src/group-header.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                               | Package |
| ---- | --------- | ----------- | ---------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/grid/src/group-header.scss.ts |         |

# `../packages/components/grid/src/group-header.ts`:

## class: `GridGroupHeader`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name         | Privacy | Type                        | Default  | Description                                 | Inherited From |
| ------------ | ------- | --------------------------- | -------- | ------------------------------------------- | -------------- |
| `expanded`   |         | `boolean \| undefined`      |          | Whether the group is expanded or collapsed. |                |
| `heading`    |         | `string \| undefined`       |          | The group heading.                          |                |
| `selectable` |         | `boolean \| undefined`      |          | Wether you can select the entire group.     |                |
| `selected`   |         | `'all' \| 'some' \| 'none'` | `'none'` | Whether the group is selected.              |                |

### Events

| Name          | Type                                   | Description                                      | Inherited From |
| ------------- | -------------------------------------- | ------------------------------------------------ | -------------- |
| `selectEvent` | `EventEmitter<SlSelectEvent<boolean>>` | Emits when the user changes the group selection. |                |
| `toggleEvent` | `EventEmitter<SlToggleEvent<boolean>>` | Emits when the user collapses/expands the group. |                |

### Attributes

| Name         | Field      | Inherited From |
| ------------ | ---------- | -------------- |
| `expanded`   | expanded   |                |
| `heading`    | heading    |                |
| `selectable` | selectable |                |
| `selected`   | selected   |                |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                          | Package |
| ---- | ----------------- | --------------- | ----------------------------------------------- | ------- |
| `js` | `GridGroupHeader` | GridGroupHeader | ../packages/components/grid/src/group-header.ts |         |

# `../packages/components/grid/src/select-column.ts`:

## class: `GridSelectColumn`, `sl-grid-select-column`

### Superclass

| Name         | Module                                  | Package |
| ------------ | --------------------------------------- | ------- |
| `GridColumn` | /packages/components/grid/src/column.js |         |

### Fields

| Name             | Privacy | Type                                                                | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ---------------- | ------- | ------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`          |         | `GridColumnAlignment`                                               | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth`      |         | `boolean \| undefined`                                              |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`           |         | `Grid<T> \| undefined`                                              |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`           |         | `number`                                                            | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`         |         | `string \| GridColumnHeaderRenderer \| undefined`                   |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `options`        |         | `Array<{ label: string; value: unknown }> \| string[] \| undefined` |           | The options for the select.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                |
| `parts`          |         | `string \| GridColumnParts<T> \| undefined`                         |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `path`           |         | `string \| undefined`                                               |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `renderer`       |         | `GridColumnDataRenderer<T> \| undefined`                            |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `scopedElements` |         | `Record<string, typeof HTMLElement> \| undefined`                   |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `sticky`         |         | `boolean \| undefined`                                              |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`          |         | `number \| undefined`                                               |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`     |         |                                                                                                                                                                | `item: T`  | `string[]`          | GridColumn     |
| `itemsChanged` |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              | GridColumn     |
| `renderData`   |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    | GridColumn     |
| `renderHeader` |         |                                                                                                                                                                |            | `TemplateResult`    | GridColumn     |
| `renderStyles` |         |                                                                                                                                                                |            | `CSSResult \| void` | GridColumn     |
| `stateChanged` |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              | GridColumn     |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. | GridColumn     |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `options`    | options   |                |
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

| Kind | Name               | Declaration      | Module                                           | Package |
| ---- | ------------------ | ---------------- | ------------------------------------------------ | ------- |
| `js` | `GridSelectColumn` | GridSelectColumn | ../packages/components/grid/src/select-column.ts |         |

# `../packages/components/grid/src/selection-column.ts`:

## class: `GridSelectionColumn`, `sl-grid-selection-column`

### Superclass

| Name         | Module                                  | Package |
| ------------ | --------------------------------------- | ------- |
| `GridColumn` | /packages/components/grid/src/column.js |         |

### Fields

| Name             | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ---------------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`          |         | `GridColumnAlignment`                             | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoSelect`     |         | `boolean \| undefined`                            |           | When true, the active rows get selected automatically.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                |
| `autoWidth`      |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`           |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`           |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`         |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `parts`          |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `path`           |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `renderer`       |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `scopedElements` |         | `Record<string, typeof HTMLElement> \| undefined` |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `selectAll`      |         | `boolean \| undefined`                            |           | When true, all items are selected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                |
| `sticky`         |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`          |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name                    | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| ----------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`              |         |                                                                                                                                                                | `item: T`  | `string[]`          | GridColumn     |
| `getSelectedCount`      |         |                                                                                                                                                                |            | `number`            |                |
| `itemsChanged`          |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              | GridColumn     |
| `renderData`            |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    | GridColumn     |
| `renderHeader`          |         |                                                                                                                                                                |            | `TemplateResult`    | GridColumn     |
| `renderSelectionHeader` |         |                                                                                                                                                                |            | `TemplateResult`    |                |
| `renderStyles`          |         |                                                                                                                                                                |            | `CSSResult \| void` | GridColumn     |
| `stateChanged`          |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              | GridColumn     |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. | GridColumn     |

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

| Kind | Name                  | Declaration         | Module                                              | Package |
| ---- | --------------------- | ------------------- | --------------------------------------------------- | ------- |
| `js` | `GridSelectionColumn` | GridSelectionColumn | ../packages/components/grid/src/selection-column.ts |         |

# `../packages/components/grid/src/sort-column.ts`:

## class: `GridSortColumn`, `sl-grid-sort-column`

### Superclass

| Name         | Module                                  | Package |
| ------------ | --------------------------------------- | ------- |
| `GridColumn` | /packages/components/grid/src/column.js |         |

### Fields

| Name             | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ---------------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`          |         | `GridColumnAlignment`                             | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth`      |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `direction`      |         | `DataSourceSortDirection \| undefined`            |           | The direction this columns should be sorted in.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                |
| `grid`           |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`           |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`         |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `parts`          |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `path`           |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `renderer`       |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `scopedElements` |         | `Record<string, typeof HTMLElement> \| undefined` |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `sorter`         |         | `DataSourceSortFunction<T> \| undefined`          |           | If you want to provide a custom sort function, you can via this property.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                |
| `sticky`         |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`          |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`     |         |                                                                                                                                                                | `item: T`  | `string[]`          | GridColumn     |
| `itemsChanged` |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              | GridColumn     |
| `renderData`   |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    | GridColumn     |
| `renderHeader` |         |                                                                                                                                                                |            | `TemplateResult`    | GridColumn     |
| `renderStyles` |         |                                                                                                                                                                |            | `CSSResult \| void` | GridColumn     |
| `stateChanged` |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              | GridColumn     |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. | GridColumn     |

### Attributes

| Name         | Field     | Inherited From |
| ------------ | --------- | -------------- |
| `direction`  | direction |                |
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

| Kind | Name             | Declaration    | Module                                         | Package |
| ---- | ---------------- | -------------- | ---------------------------------------------- | ------- |
| `js` | `GridSortColumn` | GridSortColumn | ../packages/components/grid/src/sort-column.ts |         |

# `../packages/components/grid/src/sorter.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                         | Package |
| ---- | --------- | ----------- | ---------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/grid/src/sorter.scss.ts |         |

# `../packages/components/grid/src/sorter.ts`:

## class: `GridSorter`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name        | Privacy | Type                                     | Default | Description                               | Inherited From |
| ----------- | ------- | ---------------------------------------- | ------- | ----------------------------------------- | -------------- |
| `column`    |         | `GridColumn<T>`                          |         | The grid column.                          |                |
| `direction` |         | `DataSourceSortDirection \| undefined`   |         | The direction in which to sort the items. |                |
| `path`      |         | `string \| undefined`                    |         | The path to the field to sort on.         |                |
| `sorter`    |         | `DataSourceSortFunction<T> \| undefined` |         | An optional custom sort function.         |                |

### Methods

| Name    | Privacy | Description | Parameters | Return | Inherited From |
| ------- | ------- | ----------- | ---------- | ------ | -------------- |
| `reset` |         |             |            | `void` |                |

### Events

| Name                       | Type                                          | Description                                      | Inherited From |
| -------------------------- | --------------------------------------------- | ------------------------------------------------ | -------------- |
| `sorterChangeEvent`        | `EventEmitter<SlSorterChangeEvent>`           | Emits when the sorter has been added or removed. |                |
| `sortDirectionChangeEvent` | `EventEmitter<SlSortDirectionChangeEvent<T>>` | Emits when the direction has changed.            |                |

### Attributes

| Name        | Field     | Inherited From |
| ----------- | --------- | -------------- |
| `direction` | direction |                |
| `path`      | path      |                |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                    | Package |
| ---- | ------------ | ----------- | ----------------------------------------- | ------- |
| `js` | `GridSorter` | GridSorter  | ../packages/components/grid/src/sorter.ts |         |

# `../packages/components/grid/src/text-field-column.ts`:

## class: `GridTextFieldColumn`, `sl-grid-text-field-column`

### Superclass

| Name         | Module                                  | Package |
| ------------ | --------------------------------------- | ------- |
| `GridColumn` | /packages/components/grid/src/column.js |         |

### Fields

| Name             | Privacy | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Inherited From |
| ---------------- | ------- | ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `align`          |         | `GridColumnAlignment`                             | `'start'` | The alignment of the content within the column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | GridColumn     |
| `autoWidth`      |         | `boolean \| undefined`                            |           | Automatically sets the width of the column based on the column contents when this is set to `true`.&#xA;&#xA;For performance reasons the column width is calculated automatically only once when the grid items&#xA;are rendered for the first time and the calculation only considers the rows which are currently&#xA;rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell&#xA;content changes, the column width might not match the contents anymore.&#xA;&#xA;Hidden columns are ignored in the calculation and their widths are not automatically updated when&#xA;you show a column that was initially hidden.&#xA;&#xA;You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.&#xA;&#xA;The column width may still grow larger when `grow` is not 0. | GridColumn     |
| `grid`           |         | `Grid<T> \| undefined`                            |           | The parent grid instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | GridColumn     |
| `grow`           |         | `number`                                          | `1`       | The ratio with which the column will grow relative to the other columns.&#xA;A ratio of 0 means the column width is fixed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | GridColumn     |
| `header`         |         | `string \| GridColumnHeaderRenderer \| undefined` |           | The label for the column header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `parts`          |         | `string \| GridColumnParts<T> \| undefined`       |           | Custom parts to be set on the `<td>` so it can be styled externally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `path`           |         | `string \| undefined`                             |           | The path to the value for this column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | GridColumn     |
| `renderer`       |         | `GridColumnDataRenderer<T> \| undefined`          |           | Renderer function for the column value of each cell.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | GridColumn     |
| `scopedElements` |         | `Record<string, typeof HTMLElement> \| undefined` |           | The custom elements used for rendering this column. Since the rendering the column cells is done&#xA;in the parent grid component, the custom elements need to be registered in the parent grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | GridColumn     |
| `sticky`         |         | `boolean \| undefined`                            |           | Whether this column is sticky when the user scrolls horizontally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | GridColumn     |
| `width`          |         | `number \| undefined`                             |           | Width of the cells for this column in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | GridColumn     |

### Methods

| Name           | Privacy | Description                                                                                                                                                    | Parameters | Return              | Inherited From |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `getParts`     |         |                                                                                                                                                                | `item: T`  | `string[]`          | GridColumn     |
| `itemsChanged` |         | This method is called when the contents of the grid has changed.&#xA;This happens when the items property is directly set or when the data source has changed. |            | `void`              | GridColumn     |
| `renderData`   |         |                                                                                                                                                                | `item: T`  | `TemplateResult`    | GridColumn     |
| `renderHeader` |         |                                                                                                                                                                |            | `TemplateResult`    | GridColumn     |
| `renderStyles` |         |                                                                                                                                                                |            | `CSSResult \| void` | GridColumn     |
| `stateChanged` |         | This method is called when the state of the grid has changed.&#xA;This happens for examples when a filter or sorting changes.                                  |            | `void`              | GridColumn     |

### Events

| Name                | Type                                   | Description                                   | Inherited From |
| ------------------- | -------------------------------------- | --------------------------------------------- | -------------- |
| `columnUpdateEvent` | `EventEmitter<SlColumnUpdateEvent<T>>` | Emits when the column definition has changed. | GridColumn     |

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

| Kind | Name                  | Declaration         | Module                                               | Package |
| ---- | --------------------- | ------------------- | ---------------------------------------------------- | ------- |
| `js` | `GridTextFieldColumn` | GridTextFieldColumn | ../packages/components/grid/src/text-field-column.ts |         |

# `../packages/components/grid/src/view-model.ts`:

## class: `GridViewModel`

### Fields

| Name                | Privacy | Type                          | Default | Description                                                                               | Inherited From |
| ------------------- | ------- | ----------------------------- | ------- | ----------------------------------------------------------------------------------------- | -------------- |
| `columnDefinitions` |         | `Array<GridColumn<T>>`        |         | Sets the available columns. Not all columns may be rendered, depending on the view state. |                |
| `columns`           |         | `Array<GridColumn<T>>`        |         | Returns an array of visible columns.                                                      |                |
| `dataSource`        |         | `DataSource<T> \| undefined`  |         |                                                                                           |                |
| `groups`            |         | `string[]`                    |         |                                                                                           |                |
| `headerRows`        |         | `Array<Array<GridColumn<T>>>` |         |                                                                                           |                |
| `rows`              |         | `T[]`                         |         |                                                                                           |                |

### Methods

| Name                    | Privacy | Description                                                      | Parameters                         | Return                      | Inherited From |
| ----------------------- | ------- | ---------------------------------------------------------------- | ---------------------------------- | --------------------------- | -------------- |
| `getGroupSelection`     |         | Returns the selected state of the group.                         | `value: string`                    | `'all' \| 'some' \| 'none'` |                |
| `getGroupState`         |         | Returns true if the group is expanded, false if collapsed.       | `value: string`                    | `boolean`                   |                |
| `getStickyColumnOffset` |         | Returns the left offset, taking any sticky columns into account. | `index: number`                    | `number`                    |                |
| `toggleColumn`          |         | Toggle the visibility of the column.                             | `id: string, visible: boolean`     | `void`                      |                |
| `toggleGroup`           |         | Toggle the visibility of the group.                              | `value: string, collapse: boolean` | `void`                      |                |

<hr/>

## class: `GridViewModelGroup`

<hr/>

## Exports

| Kind | Name                 | Declaration        | Module                                        | Package |
| ---- | -------------------- | ------------------ | --------------------------------------------- | ------- |
| `js` | `GridViewModelGroup` | GridViewModelGroup | ../packages/components/grid/src/view-model.ts |         |
| `js` | `GridViewModel`      | GridViewModel      | ../packages/components/grid/src/view-model.ts |         |

# `../packages/components/icon/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./src/icon.js   |
| `js` | `*`  | *           |        | ./src/models.js |

# `../packages/components/icon/register.ts`:

## Exports

| Kind                        | Name      | Declaration | Module                                | Package |
| --------------------------- | --------- | ----------- | ------------------------------------- | ------- |
| `custom-element-definition` | `sl-icon` | Icon        | /packages/components/icon/src/icon.js |         |

# `../packages/components/icon/src/icon.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                       | Package |
| ---- | --------- | ----------- | -------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/icon/src/icon.scss.ts |         |

# `../packages/components/icon/src/icon.ts`:

## class: `Icon`, `sl-icon`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Static Methods

| Name       | Privacy | Description                                                                                                                                        | Parameters                                                     | Return | Inherited From |
| ---------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------ | -------------- |
| `register` |         | Add icon(s) to the icon registry                                                                                                                   | `icons: IconDefinition \| IconDefinition[]`                    | `void` |                |
| `register` |         | Store all icons from the IconLibrary of the theme (icons.json) in the icon registry for easy access.&#xA;Is run in the setup method of each theme. | `icons: IconLibrary`                                           | `void` |                |
| `register` |         |                                                                                                                                                    | `icon: IconDefinition \| IconLibrary, icons: IconDefinition[]` | `void` |                |

### Fields

| Name    | Privacy | Type                                                              | Default | Description                                                                                                                              | Inherited From |
| ------- | ------- | ----------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `label` |         | `string \| undefined`                                             |         | The label of the icon; Describes the icon for assistive devices. If not present, the icon is considered&#xA;to be purely presentational. |                |
| `name`  |         | `string \| undefined`                                             |         | The name of the icon; either the name from Font Awesome or the name of the custom icon in Figma.                                         |                |
| `size`  |         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` |         | The size of the icon.                                                                                                                    |                |

### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `label` | label |                |
| `name`  | name  |                |
| `size`  | size  |                |

### CSS Properties

| Name                       | Default | Description                                    |
| -------------------------- | ------- | ---------------------------------------------- |
| `--sl-icon-container-size` |         | The size of the icon container, defaults to md |
| `--sl-icon-fill-accent`    |         | Accent color, only used for multicolor icons   |
| `--sl-icon-fill-default`   |         | Default fill color                             |
| `--sl-icon-size`           |         | The size of the svg element, defaults to md    |

<hr/>

## Exports

| Kind | Name   | Declaration | Module                                  | Package |
| ---- | ------ | ----------- | --------------------------------------- | ------- |
| `js` | `Icon` | Icon        | ../packages/components/icon/src/icon.ts |         |

# `../packages/components/inline-message/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                 |
| ---- | ---- | ----------- | ------ | ----------------------- |
| `js` | `*`  | *           |        | ./src/inline-message.js |

# `../packages/components/inline-message/register.ts`:

## Exports

| Kind                        | Name                | Declaration   | Module                                                    | Package |
| --------------------------- | ------------------- | ------------- | --------------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-inline-message` | InlineMessage | /packages/components/inline-message/src/inline-message.js |         |

# `../packages/components/inline-message/src/inline-message.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                           | Package |
| ---- | --------- | ----------- | ---------------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/inline-message/src/inline-message.scss.ts |         |

# `../packages/components/inline-message/src/inline-message.ts`:

## class: `InlineMessage`, `sl-inline-message`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name          | Privacy | Type                                           | Default  | Description                                                                            | Inherited From |
| ------------- | ------- | ---------------------------------------------- | -------- | -------------------------------------------------------------------------------------- | -------------- |
| `dismissible` |         | `boolean`                                      | `true`   | Determines whether a (default) closing button should be shown in the top right corner. |                |
| `noIcon`      |         | `boolean \| undefined`                         |          | Determines whether the icon should be shown on the left side of the component.         |                |
| `variant`     |         | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | The variant of the inline message.                                                     |                |

### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `dismissible` | dismissible |                |
| `no-icon`     | noIcon      |                |
| `variant`     | variant     |                |

### Slots

| Name           | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `default`      | slot for the main information of the inline-message             |
| `title`        | title content for the inline message                            |
| `details`      | slot for more details of the inline-message like list of errors |
| `icon`         | icon shown on the left side of the component                    |
| `close-button` | Closing button for the inline message                           |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                                      | Package |
| ---- | --------------- | ------------- | ----------------------------------------------------------- | ------- |
| `js` | `InlineMessage` | InlineMessage | ../packages/components/inline-message/src/inline-message.ts |         |

# `../packages/components/menu/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                  |
| ---- | ---- | ----------- | ------ | ------------------------ |
| `js` | `*`  | *           |        | ./src/menu.js            |
| `js` | `*`  | *           |        | ./src/menu-button.js     |
| `js` | `*`  | *           |        | ./src/menu-item.js       |
| `js` | `*`  | *           |        | ./src/menu-item-group.js |

# `../packages/components/menu/register.ts`:

## Exports

| Kind                        | Name                 | Declaration   | Module                                           | Package |
| --------------------------- | -------------------- | ------------- | ------------------------------------------------ | ------- |
| `custom-element-definition` | `sl-menu`            | Menu          | /packages/components/menu/src/menu.js            |         |
| `custom-element-definition` | `sl-menu-button`     | MenuButton    | /packages/components/menu/src/menu-button.js     |         |
| `custom-element-definition` | `sl-menu-item`       | MenuItem      | /packages/components/menu/src/menu-item.js       |         |
| `custom-element-definition` | `sl-menu-item-group` | MenuItemGroup | /packages/components/menu/src/menu-item-group.js |         |

# `../packages/components/menu/src/menu-button.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                              | Package |
| ---- | --------- | ----------- | --------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/menu/src/menu-button.scss.ts |         |

# `../packages/components/menu/src/menu-button.ts`:

## class: `MenuButton`, `sl-menu-button`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name        | Privacy | Type                                     | Default     | Description                                                            | Inherited From |
| ----------- | ------- | ---------------------------------------- | ----------- | ---------------------------------------------------------------------- | -------------- |
| `button`    |         | `Button`                                 |             | The button.                                                            |                |
| `disabled`  |         | `boolean \| undefined`                   |             | Whether the button is disabled; when set no interaction is possible.   |                |
| `fill`      |         | `ButtonFill`                             | `'outline'` | The fill of the button.                                                |                |
| `menu`      |         | `Menu`                                   |             | The menu.                                                              |                |
| `pluralize` |         | `(count: number) => string \| undefined` |             | Returns the string to be used when there is more than 1 item selected. |                |
| `position`  |         | `PopoverPosition \| undefined`           |             | The position of the menu relative to the button.                       |                |
| `selected`  |         | `string \| undefined`                    |             | The text representing the selected menuitem(s).                        |                |
| `selects`   |         | `'single' \| 'multiple' \| undefined`    |             | Determines whether if and how many menu items can be selected.         |                |
| `size`      |         | `ButtonSize`                             | `'md'`      | The size of the button.                                                |                |
| `variant`   |         | `ButtonVariant`                          | `'default'` | The variant of the button.                                             |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `disabled` | disabled |                |
| `fill`     | fill     |                |
| `position` | position |                |
| `selects`  | selects  |                |
| `size`     | size     |                |
| `variant`  | variant  |                |

### Slots

| Name      | Description                                           |
| --------- | ----------------------------------------------------- |
| `default` | The menu items should be slotted in the default slot. |
| `button`  | Any content for the button should be slotted here.    |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                         | Package |
| ---- | ------------ | ----------- | ---------------------------------------------- | ------- |
| `js` | `MenuButton` | MenuButton  | ../packages/components/menu/src/menu-button.ts |         |

# `../packages/components/menu/src/menu-item-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                  | Package |
| ---- | --------- | ----------- | ------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/menu/src/menu-item-group.scss.ts |         |

# `../packages/components/menu/src/menu-item-group.ts`:

## class: `MenuItemGroup`, `sl-menu-item-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name      | Privacy | Type                                  | Default | Description                                                    | Inherited From |
| --------- | ------- | ------------------------------------- | ------- | -------------------------------------------------------------- | -------------- |
| `heading` |         | `string \| undefined`                 |         | The optional heading for the group.                            |                |
| `selects` |         | `'single' \| 'multiple' \| undefined` |         | Determines whether if and how many menu items can be selected. |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `heading` | heading |                |
| `selects` | selects |                |

### Slots

| Name      | Description              |
| --------- | ------------------------ |
| `default` | The menu items.          |
| `header`  | The header of the group. |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                             | Package |
| ---- | --------------- | ------------- | -------------------------------------------------- | ------- |
| `js` | `MenuItemGroup` | MenuItemGroup | ../packages/components/menu/src/menu-item-group.ts |         |

# `../packages/components/menu/src/menu-item.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                            | Package |
| ---- | --------- | ----------- | ------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/menu/src/menu-item.scss.ts |         |

# `../packages/components/menu/src/menu-item.ts`:

## class: `MenuItem`, `sl-menu-item`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Static Fields

| Name            | Privacy | Type     | Default | Description                                         | Inherited From |
| --------------- | ------- | -------- | ------- | --------------------------------------------------- | -------------- |
| `submenuOffset` |         | `number` | `0`     | The default offset of the submenu to the menu item. |                |

### Fields

| Name         | Privacy | Type                   | Default | Description                                      | Inherited From |
| ------------ | ------- | ---------------------- | ------- | ------------------------------------------------ | -------------- |
| `disabled`   |         | `boolean \| undefined` |         | Whether this menu item is disabled.              |                |
| `selectable` |         | `boolean \| undefined` |         | Whether this menu item can be selected.          |                |
| `selected`   |         | `boolean \| undefined` |         | Whether this menu item has been selected.        |                |
| `shortcut`   |         | `string \| undefined`  |         | Keyboard shortcut for activating this menu item. |                |
| `submenu`    |         | `Menu \| undefined`    |         | The sub menu, if present.                        |                |

### Events

| Name          | Type                          | Description                                     | Inherited From |
| ------------- | ----------------------------- | ----------------------------------------------- | -------------- |
| `selectEvent` | `EventEmitter<SlSelectEvent>` | Emits when the user toggles the selected state. |                |

### Attributes

| Name         | Field      | Inherited From |
| ------------ | ---------- | -------------- |
| `disabled`   | disabled   |                |
| `selected`   | selected   |                |
| `selectable` | selectable |                |
| `shortcut`   | shortcut   |                |

### Slots

| Name      | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `default` | Content to display inside the menu item.                           |
| `submenu` | The menu items that will be displayed when the menu item is shown. |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                       | Package |
| ---- | ---------- | ----------- | -------------------------------------------- | ------- |
| `js` | `MenuItem` | MenuItem    | ../packages/components/menu/src/menu-item.ts |         |

# `../packages/components/menu/src/menu.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                       | Package |
| ---- | --------- | ----------- | -------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/menu/src/menu.scss.ts |         |

# `../packages/components/menu/src/menu.ts`:

## class: `Menu`, `sl-menu`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Static Fields

| Name             | Privacy | Type     | Default | Description                                           | Inherited From |
| ---------------- | ------- | -------- | ------- | ----------------------------------------------------- | -------------- |
| `offset`         |         | `number` | `4`     | The default offset of the menu to its anchor.         |                |
| `viewportMargin` |         | `number` | `8`     | The default margin between the menu and the viewport. |                |

### Fields

| Name                 | Privacy | Type                                  | Default         | Description                                                                                                                                                                                                  | Inherited From |
| -------------------- | ------- | ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `offset`             |         | `number \| undefined`                 |                 | The offset of the menu to its anchor. This is a property on this instance so&#xA;that it can be overridden by the menu item in case of a nested menu. You&#xA;should not need to set this property yourself. |                |
| `position`           |         | `PopoverPosition \| undefined`        | `'right-start'` | The position of the menu relative to its anchor.                                                                                                                                                             |                |
| `selectableChildren` |         | `boolean \| undefined`                |                 | Whether this menu has any children that can be selected.                                                                                                                                                     |                |
| `selects`            |         | `'single' \| 'multiple' \| undefined` |                 | Determines whether if and how many menu items can be selected.                                                                                                                                               |                |

### Methods

| Name            | Privacy | Description | Parameters | Return | Inherited From |
| --------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `focusLastItem` |         |             |            | `void` |                |

### Events

| Name          | Type                                | Description                                 | Inherited From |
| ------------- | ----------------------------------- | ------------------------------------------- | -------------- |
| `selectEvent` | `EventEmitter<SlSelectEvent<void>>` | Emits when the menu item selection changes. |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `offset`   | offset   |                |
| `position` | position |                |
| `selects`  | selects  |                |

<hr/>

## Exports

| Kind | Name   | Declaration | Module                                  | Package |
| ---- | ------ | ----------- | --------------------------------------- | ------- |
| `js` | `Menu` | Menu        | ../packages/components/menu/src/menu.ts |         |

# `../packages/components/message-dialog/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                 |
| ---- | ---- | ----------- | ------ | ----------------------- |
| `js` | `*`  | *           |        | ./src/message-dialog.js |

# `../packages/components/message-dialog/register.ts`:

## Exports

| Kind                        | Name                | Declaration   | Module                                                    | Package |
| --------------------------- | ------------------- | ------------- | --------------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-message-dialog` | MessageDialog | /packages/components/message-dialog/src/message-dialog.js |         |

# `../packages/components/message-dialog/src/message-dialog.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                           | Package |
| ---- | --------- | ----------- | ---------------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/message-dialog/src/message-dialog.scss.ts |         |

# `../packages/components/message-dialog/src/message-dialog.ts`:

## class: `MessageDialog`, `sl-message-dialog`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Static Methods

| Name      | Privacy | Description | Parameters                       | Return                          | Inherited From |
| --------- | ------- | ----------- | -------------------------------- | ------------------------------- | -------------- |
| `alert`   |         |             | `message: string, title`         | `Promise<void>`                 |                |
| `confirm` |         |             | `message: string, title`         | `Promise<boolean \| undefined>` |                |
| `show`    |         |             | `config: MessageDialogConfig<T>` | `Promise<T \| undefined>`       |                |

### Fields

| Name     | Privacy | Type                                  | Default | Description | Inherited From |
| -------- | ------- | ------------------------------------- | ------- | ----------- | -------------- |
| `config` |         | `MessageDialogConfig<T> \| undefined` |         |             |                |

### Methods

| Name        | Privacy | Description | Parameters | Return | Inherited From |
| ----------- | ------- | ----------- | ---------- | ------ | -------------- |
| `close`     |         |             |            | `void` |                |
| `showModal` |         |             |            | `void` |                |

<hr/>

## Exports

| Kind | Name            | Declaration   | Module                                                      | Package |
| ---- | --------------- | ------------- | ----------------------------------------------------------- | ------- |
| `js` | `MessageDialog` | MessageDialog | ../packages/components/message-dialog/src/message-dialog.ts |         |

# `../packages/components/popover/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package          |
| ---- | ---- | ----------- | ------ | ---------------- |
| `js` | `*`  | *           |        | ./src/popover.js |

# `../packages/components/popover/register.ts`:

## Exports

| Kind                        | Name         | Declaration | Module                                      | Package |
| --------------------------- | ------------ | ----------- | ------------------------------------------- | ------- |
| `custom-element-definition` | `sl-popover` | Popover     | /packages/components/popover/src/popover.js |         |

# `../packages/components/popover/src/popover.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                             | Package |
| ---- | --------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/popover/src/popover.scss.ts |         |

# `../packages/components/popover/src/popover.ts`:

## class: `Popover`, `sl-popover`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Static Fields

| Name             | Privacy | Type     | Default | Description                                              | Inherited From |
| ---------------- | ------- | -------- | ------- | -------------------------------------------------------- | -------------- |
| `arrowPadding`   |         | `number` | `16`    | The default padding of the arrow.                        |                |
| `offset`         |         | `number` | `12`    | The default offset of the popover to its anchor.         |                |
| `viewportMargin` |         | `number` | `8`     | The default margin between the tooltip and the viewport. |                |

### Fields

| Name       | Privacy | Type                                                                                                                                                                 | Default    | Description                                     | Inherited From |
| ---------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------- | -------------- |
| `position` |         | `'top' \| 'right' \| 'bottom' \| 'left' \| 'top-start' \| 'top-end' \| 'right-start' \| 'right-end' \| 'bottom-start' \| 'bottom-end' \| 'left-start' \| 'left-end'` | `'bottom'` | The position of popover relative to its anchor. |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `position` | position |                |

### CSS Parts

| Name        | Description                   |
| ----------- | ----------------------------- |
| `container` | The container for the popover |

### Slots

| Name      | Description                  |
| --------- | ---------------------------- |
| `default` | Body content for the popover |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `Popover` | Popover     | ../packages/components/popover/src/popover.ts |         |

# `../packages/components/radio-group/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package              |
| ---- | ---- | ----------- | ------ | -------------------- |
| `js` | `*`  | *           |        | ./src/radio.js       |
| `js` | `*`  | *           |        | ./src/radio-group.js |

# `../packages/components/radio-group/register.ts`:

## Exports

| Kind                        | Name             | Declaration | Module                                              | Package |
| --------------------------- | ---------------- | ----------- | --------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-radio`       | Radio       | /packages/components/radio-group/src/radio.js       |         |
| `custom-element-definition` | `sl-radio-group` | RadioGroup  | /packages/components/radio-group/src/radio-group.js |         |

# `../packages/components/radio-group/src/radio-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                     | Package |
| ---- | --------- | ----------- | ---------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/radio-group/src/radio-group.scss.ts |         |

# `../packages/components/radio-group/src/radio-group.ts`:

## class: `RadioGroup`, `sl-radio-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name               | Module | Package                |
| ------------------ | ------ | ---------------------- |
| `FormControlMixin` |        | @sl-design-system/form |

### Fields

| Name                | Privacy | Type                                         | Default | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `customValidity`    |         | `string \| undefined`                        |         | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `disabled`          |         | `boolean \| undefined`                       |         | Whether the group is disabled; when set no interaction is possible.                                                                                                                                                                                                                                                                                     |                  |
| `form`              |         | `HTMLFormElement \| null`                    |         | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                    |         | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `horizontal`        |         | `boolean \| undefined`                       |         | The orientation of the radio options; when true, the radio buttons are displayed next to each other instead of below each other.                                                                                                                                                                                                                        |                  |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null `` |         | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `name`              |         | `string \| undefined`                        |         | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                  |         |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `required`          |         | `boolean \| undefined`                       |         | Whether the user is required to select an option in the group.                                                                                                                                                                                                                                                                                          |                  |
| `showValid`         |         | `boolean`                                    | `false` | When set will cause the control to show it is valid after reportValidity is called.                                                                                                                                                                                                                                                                     | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`          |         | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `size`              |         | `RadioButtonSize \| undefined`               |         | The size of the radio buttons in the group.                                                                                                                                                                                                                                                                                                             |                  |
| `valid`             |         | `boolean`                                    |         | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                     |         | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                              |         | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`          |         | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                       |         | The value for the radio group, to be used in forms.                                                                                                                                                                                                                                                                                                     | FormControlMixin |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | ---------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    | FormControlMixin |

### Events

| Name          | Type                                          | Description                              | Inherited From   |
| ------------- | --------------------------------------------- | ---------------------------------------- | ---------------- |
| `blurEvent`   | `EventEmitter<SlBlurEvent>`                   | Emits when the component loses focus.    |                  |
| `changeEvent` | `EventEmitter<SlChangeEvent<T \| undefined>>` | Emits when the value changes.            |                  |
| `focusEvent`  | `EventEmitter<SlFocusEvent>`                  | Emits when the component receives focus. |                  |
|               | `ValidateEvent`                               |                                          | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `disabled`        | disabled       |                  |
| `horizontal`      | horizontal     |                  |
| `required`        | required       |                  |
| `show-valid`      | showValid      |                  |
| `size`            | size           |                  |
| `value`           | value          |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

### Slots

| Name      | Description                    |
| --------- | ------------------------------ |
| `default` | A list of `sl-radio` elements. |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                                | Package |
| ---- | ------------ | ----------- | ----------------------------------------------------- | ------- |
| `js` | `RadioGroup` | RadioGroup  | ../packages/components/radio-group/src/radio-group.ts |         |

# `../packages/components/radio-group/src/radio.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                               | Package |
| ---- | --------- | ----------- | ---------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/radio-group/src/radio.scss.ts |         |

# `../packages/components/radio-group/src/radio.ts`:

## class: `Radio`, `sl-radio`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name           | Privacy | Type                      | Default | Description                                          | Inherited From |
| -------------- | ------- | ------------------------- | ------- | ---------------------------------------------------- | -------------- |
| `checked`      |         | `boolean \| undefined`    |         | Whether the radio button is checked.                 |                |
| `disabled`     |         | `boolean \| undefined`    |         | Whether this radio button is disabled.               |                |
| `showValidity` |         | `FormControlShowValidity` |         | Indicates if the radio button shows it is (in)valid. |                |
| `size`         |         | `RadioButtonSize`         | `'md'`  | The size of the radio button.                        |                |
| `value`        |         | `T \| undefined`          |         | The value for this radio button.                     |                |

### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `checked`       | checked      |                |
| `disabled`      | disabled     |                |
| `show-validity` | showValidity |                |
| `size`          | size         |                |
| `value`         | value        |                |

<hr/>

## Exports

| Kind | Name    | Declaration | Module                                          | Package |
| ---- | ------- | ----------- | ----------------------------------------------- | ------- |
| `js` | `Radio` | Radio       | ../packages/components/radio-group/src/radio.ts |         |

# `../packages/components/select/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                      |
| ---- | ---- | ----------- | ------ | ---------------------------- |
| `js` | `*`  | *           |        | ./src/select.js              |
| `js` | `*`  | *           |        | ./src/select-option.js       |
| `js` | `*`  | *           |        | ./src/select-option-group.js |

# `../packages/components/select/register.ts`:

## Exports

| Kind                        | Name                     | Declaration       | Module                                                 | Package |
| --------------------------- | ------------------------ | ----------------- | ------------------------------------------------------ | ------- |
| `custom-element-definition` | `sl-select`              | Select            | /packages/components/select/src/select.js              |         |
| `custom-element-definition` | `sl-select-option`       | SelectOption      | /packages/components/select/src/select-option.js       |         |
| `custom-element-definition` | `sl-select-option-group` | SelectOptionGroup | /packages/components/select/src/select-option-group.js |         |

# `../packages/components/select/src/select-button.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                  | Package |
| ---- | --------- | ----------- | ------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/select/src/select-button.scss.ts |         |

# `../packages/components/select/src/select-button.ts`:

## class: `SelectButton`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name           | Privacy | Type                                | Default | Description                                                | Inherited From |
| -------------- | ------- | ----------------------------------- | ------- | ---------------------------------------------------------- | -------------- |
| `disabled`     |         | `boolean \| undefined`              |         | Whether the button is disabled.                            |                |
| `placeholder`  |         | `string \| undefined`               |         | The placeholder for when there is no selected option.s     |                |
| `selected`     |         | `SelectOption \| null \| undefined` |         | The selected option.                                       |                |
| `showValid`    |         | `boolean \| undefined`              |         | Indicates whether the control should indicate it is valid. |                |
| `showValidity` |         | `FormControlShowValidity`           |         | Mirrors the same property on the sl-select parent.         |                |
| `size`         |         | `SelectSize \| undefined`           | `'md'`  | The size of the parent select.                             |                |

### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `disabled`      | disabled     |                |
| `placeholder`   | placeholder  |                |
| `size`          | size         |                |
| `show-valid`    | showValid    |                |
| `show-validity` | showValidity |                |

<hr/>

## Exports

| Kind | Name           | Declaration  | Module                                             | Package |
| ---- | -------------- | ------------ | -------------------------------------------------- | ------- |
| `js` | `SelectButton` | SelectButton | ../packages/components/select/src/select-button.ts |         |

# `../packages/components/select/src/select-option-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                        | Package |
| ---- | --------- | ----------- | ------------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/select/src/select-option-group.scss.ts |         |

# `../packages/components/select/src/select-option-group.ts`:

## class: `SelectOptionGroup`, `sl-select-option-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name      | Privacy | Type                  | Default | Description                | Inherited From |
| --------- | ------- | --------------------- | ------- | -------------------------- | -------------- |
| `heading` |         | `string \| undefined` |         | The heading for the group. |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `heading` | heading |                |

### Slots

| Name      | Description                         |
| --------- | ----------------------------------- |
| `default` | List of `sl-select-option` elements |

<hr/>

## Exports

| Kind | Name                | Declaration       | Module                                                   | Package |
| ---- | ------------------- | ----------------- | -------------------------------------------------------- | ------- |
| `js` | `SelectOptionGroup` | SelectOptionGroup | ../packages/components/select/src/select-option-group.ts |         |

# `../packages/components/select/src/select-option.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                  | Package |
| ---- | --------- | ----------- | ------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/select/src/select-option.scss.ts |         |

# `../packages/components/select/src/select-option.ts`:

## class: `SelectOption`, `sl-select-option`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name       | Privacy | Type                   | Default | Description                                         | Inherited From |
| ---------- | ------- | ---------------------- | ------- | --------------------------------------------------- | -------------- |
| `disabled` |         | `boolean \| undefined` |         | Whether the option item is disabled.                |                |
| `selected` |         | `boolean \| undefined` |         | Whether the option item is selected.                |                |
| `value`    |         | `T \| undefined`       |         | The value for the option item, to be used in forms. |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `disabled` | disabled |                |
| `selected` | selected |                |
| `value`    | value    |                |

<hr/>

## Exports

| Kind | Name           | Declaration  | Module                                             | Package |
| ---- | -------------- | ------------ | -------------------------------------------------- | ------- |
| `js` | `SelectOption` | SelectOption | ../packages/components/select/src/select-option.ts |         |

# `../packages/components/select/src/select.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/select/src/select.scss.ts |         |

# `../packages/components/select/src/select.ts`:

## class: `Select`, `sl-select`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `FormControlMixin`    |        | @sl-design-system/form                  |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Static Fields

| Name             | Privacy | Type     | Default | Description                                              | Inherited From |
| ---------------- | ------- | -------- | ------- | -------------------------------------------------------- | -------------- |
| `offset`         |         | `number` | `6`     | The default offset of the listbox to the button.         |                |
| `viewportMargin` |         | `number` | `8`     | The default margin between the tooltip and the viewport. |                |

### Fields

| Name                | Privacy | Type                                         | Default | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `button`            |         | `SelectButton`                               |         | The button in the light DOM.                                                                                                                                                                                                                                                                                                                            |                  |
| `customValidity`    |         | `string \| undefined`                        |         | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `disabled`          |         | `boolean \| undefined`                       |         | Whether the select is disabled; when set no interaction is possible.                                                                                                                                                                                                                                                                                    |                  |
| `form`              |         | `HTMLFormElement \| null`                    |         | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                    |         | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null `` |         | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `listbox`           |         | `HTMLElement`                                |         | The listbox element.                                                                                                                                                                                                                                                                                                                                    |                  |
| `name`              |         | `string \| undefined`                        |         | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                  |         |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `placeholder`       |         | `string \| undefined`                        |         | The placeholder text to show when no option is chosen.                                                                                                                                                                                                                                                                                                  |                  |
| `required`          |         | `boolean \| undefined`                       |         | Whether the select is a required field.                                                                                                                                                                                                                                                                                                                 |                  |
| `showValid`         |         | `boolean`                                    | `false` | When set will cause the control to show it is valid after reportValidity is called.                                                                                                                                                                                                                                                                     | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`          |         | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `size`              |         | `SelectSize`                                 | `'md'`  | The size of the select.                                                                                                                                                                                                                                                                                                                                 |                  |
| `valid`             |         | `boolean`                                    |         | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                     |         | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                              |         | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`          |         | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                       |         | The value for the select, to be used in forms.                                                                                                                                                                                                                                                                                                          | FormControlMixin |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | ---------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    | FormControlMixin |

### Events

| Name          | Type                                          | Description                                | Inherited From   |
| ------------- | --------------------------------------------- | ------------------------------------------ | ---------------- |
| `blurEvent`   | `EventEmitter<SlBlurEvent>`                   | Emits when the focus leaves the component. |                  |
| `changeEvent` | `EventEmitter<SlChangeEvent<T \| undefined>>` | Emits when the value changes.              |                  |
| `focusEvent`  | `EventEmitter<SlFocusEvent>`                  | Emits when the component gains focus.      |                  |
|               | `ValidateEvent`                               |                                            | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `disabled`        | disabled       |                  |
| `placeholder`     | placeholder    |                  |
| `required`        | required       |                  |
| `show-valid`      | showValid      |                  |
| `size`            | size           |                  |
| `value`           | value          |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

### Slots

| Name      | Description                           |
| --------- | ------------------------------------- |
| `default` | Place for `sl-select-option` elements |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Select` | Select      | ../packages/components/select/src/select.ts |         |

# `../packages/components/shared/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                                |
| ---- | ---- | ----------- | ------ | -------------------------------------- |
| `js` | `*`  | *           |        | ./src/browser.js                       |
| `js` | `*`  | *           |        | ./src/config.js                        |
| `js` | `*`  | *           |        | ./src/controllers/anchor.js            |
| `js` | `*`  | *           |        | ./src/controllers/events.js            |
| `js` | `*`  | *           |        | ./src/controllers/focus-group.js       |
| `js` | `*`  | *           |        | ./src/controllers/roving-tabindex.js   |
| `js` | `*`  | *           |        | ./src/controllers/selection.js         |
| `js` | `*`  | *           |        | ./src/controllers/shortcut.js          |
| `js` | `*`  | *           |        | ./src/css.js                           |
| `js` | `*`  | *           |        | ./src/data-source/array-data-source.js |
| `js` | `*`  | *           |        | ./src/data-source/data-source.js       |
| `js` | `*`  | *           |        | ./src/decorators/base.js               |
| `js` | `*`  | *           |        | ./src/decorators/event.js              |
| `js` | `*`  | *           |        | ./src/decorators/observe.js            |
| `js` | `*`  | *           |        | ./src/directives/anchor.js             |
| `js` | `*`  | *           |        | ./src/path.js                          |
| `js` | `*`  | *           |        | ./src/popover.js                       |
| `js` | `*`  | *           |        | ./src/string.js                        |
| `js` | `*`  | *           |        | ./src/types.js                         |

# `../packages/components/shared/src/breakpoints.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                | Package |
| ---- | --------- | ----------- | ----------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/shared/src/breakpoints.scss.ts |         |

# `../packages/components/shared/src/browser.ts`:

## Variables

| Name       | Description | Type |
| ---------- | ----------- | ---- |
| `isSafari` |             |      |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                       | Package |
| ---- | ---------- | ----------- | -------------------------------------------- | ------- |
| `js` | `isSafari` | isSafari    | ../packages/components/shared/src/browser.ts |         |

# `../packages/components/shared/src/config.ts`:

## class: `Config`

### Static Methods

| Name               | Privacy | Description | Parameters                  | Return       | Inherited From |
| ------------------ | ------- | ----------- | --------------------------- | ------------ | -------------- |
| `getConfigSetting` |         |             | `key: keyof ConfigSettings` | `Promise<T>` |                |
| `setConfig`        |         |             | `settings: ConfigSettings`  | `void`       |                |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Config` | Config      | ../packages/components/shared/src/config.ts |         |

# `../packages/components/shared/src/controllers/anchor.ts`:

## class: `AnchorController`

### Fields

| Name           | Privacy | Type                                 | Default | Description                                                | Inherited From |
| -------------- | ------- | ------------------------------------ | ------- | ---------------------------------------------------------- | -------------- |
| `arrowElement` |         | `string \| HTMLElement \| undefined` |         | The arrow pointing from the popover to the anchor element. |                |
| `arrowPadding` |         | `number \| undefined`                |         | The padding of the arrow.                                  |                |
| `maxWidth`     |         | `number \| undefined`                |         | The max width of the popover.                              |                |
| `offset`       |         | `number \| undefined`                |         | The offset of the popover to its anchor.                   |                |
| `position`     |         | `PopoverPosition \| undefined`       |         | The main position of the popover relative to the anchor.   |                |

### Methods

| Name               | Privacy | Description | Parameters | Return | Inherited From |
| ------------------ | ------- | ----------- | ---------- | ------ | -------------- |
| `hostConnected`    |         |             |            | `void` |                |
| `hostDisconnected` |         |             |            | `void` |                |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                                  | Package |
| ---- | ------------------ | ---------------- | ------------------------------------------------------- | ------- |
| `js` | `AnchorController` | AnchorController | ../packages/components/shared/src/controllers/anchor.ts |         |

# `../packages/components/shared/src/controllers/events.ts`:

## class: `EventsController`

### Methods

| Name               | Privacy | Description | Parameters                                                                                                                                                                                       | Return | Inherited From |
| ------------------ | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------- |
| `hostConnected`    |         |             |                                                                                                                                                                                                  | `void` |                |
| `hostDisconnected` |         |             |                                                                                                                                                                                                  | `void` |                |
| `listen`           |         |             | `window: Window, type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options: boolean \| AddEventListenerOptions`                                                                   | `void` |                |
| `listen`           |         |             | `document: Document, type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options: boolean \| AddEventListenerOptions`                                                           | `void` |                |
| `listen`           |         |             | `element: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options: boolean \| AddEventListenerOptions`                                                   | `void` |                |
| `listen`           |         |             | `element: ShadowRoot, type: K, listener: (this: ShadowRoot, ev: ShadowRootEventMap[K]) => any, options: boolean \| AddEventListenerOptions`                                                      | `void` |                |
| `listen`           |         |             | `element: MediaQueryList, type: K, listener: (this: ShadowRoot, ev: MediaQueryListEventMap[K]) => any, options: boolean \| AddEventListenerOptions`                                              | `void` |                |
| `listen`           |         |             | `element: Element, type: K, listener: (this: Element, ev: GlobalEventHandlersEventMap[K]) => any, options: boolean \| AddEventListenerOptions`                                                   | `void` |                |
| `listen`           |         |             | `element: Window \| Document \| Element \| HTMLElement \| ShadowRoot \| MediaQueryList, type: string, listener: EventListenerOrEventListenerObject, options: boolean \| AddEventListenerOptions` | `void` |                |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                                  | Package |
| ---- | ------------------ | ---------------- | ------------------------------------------------------- | ------- |
| `js` | `EventsController` | EventsController | ../packages/components/shared/src/controllers/events.ts |         |

# `../packages/components/shared/src/controllers/focus-group.ts`:

## class: `FocusGroupController`

### Fields

| Name                 | Privacy   | Type               | Default | Description | Inherited From |
| -------------------- | --------- | ------------------ | ------- | ----------- | -------------- |
| `cachedElements`     | protected | `T[] \| undefined` |         |             |                |
| `currentIndex`       |           | `number`           |         |             |                |
| `direction`          |           | `DirectionTypes`   |         |             |                |
| `directionLength`    |           | `number`           | `5`     |             |                |
| `elementEnterAction` |           |                    |         |             |                |
| `elements`           |           | `T[]`              |         |             |                |
| `focusInElement`     |           | `T`                |         |             |                |
| `focusInIndex`       |           | `number`           |         |             |                |
| `focused`            | protected | `boolean`          |         |             |                |
| `handleFocusin`      |           |                    |         |             |                |
| `handleFocusout`     |           |                    |         |             |                |
| `handleKeydown`      |           |                    |         |             |                |
| `host`               |           | `ReactiveElement`  | `host`  |             |                |
| `isFocusableElement` |           |                    |         |             |                |
| `offset`             |           | `number`           | `0`     |             |                |

### Methods

| Name                         | Privacy | Description | Parameters              | Return    | Inherited From |
| ---------------------------- | ------- | ----------- | ----------------------- | --------- | -------------- |
| `acceptsEventCode`           |         |             | `code: string`          | `boolean` |                |
| `addEventListeners`          |         |             |                         | `void`    |                |
| `clearElementCache`          |         |             | `offset`                | `void`    |                |
| `focus`                      |         |             | `options: FocusOptions` | `void`    |                |
| `focusToElement`             |         |             | `elementIndex: number`  | `void`    |                |
| `hostConnected`              |         |             |                         | `void`    |                |
| `hostContainsFocus`          |         |             |                         | `void`    |                |
| `hostDisconnected`           |         |             |                         | `void`    |                |
| `hostNoLongerContainsFocus`  |         |             |                         | `void`    |                |
| `isEventWithinListenerScope` |         |             | `event: Event`          | `boolean` |                |
| `isRelatedTargetAnElement`   |         |             | `event: FocusEvent`     | `boolean` |                |
| `manage`                     |         |             |                         | `void`    |                |
| `removeEventListeners`       |         |             |                         | `void`    |                |
| `setCurrentIndexCircularly`  |         |             | `diff: number`          | `void`    |                |
| `unmanage`                   |         |             |                         | `void`    |                |

<hr/>

## Exports

| Kind | Name                   | Declaration          | Module                                                       | Package |
| ---- | ---------------------- | -------------------- | ------------------------------------------------------------ | ------- |
| `js` | `FocusGroupController` | FocusGroupController | ../packages/components/shared/src/controllers/focus-group.ts |         |

# `../packages/components/shared/src/controllers/roving-tabindex.ts`:

## class: `RovingTabindexController`

### Superclass

| Name                   | Module                                                     | Package |
| ---------------------- | ---------------------------------------------------------- | ------- |
| `FocusGroupController` | /packages/components/shared/src/controllers/focus-group.js |         |

### Fields

| Name                 | Privacy   | Type               | Default | Description | Inherited From       |
| -------------------- | --------- | ------------------ | ------- | ----------- | -------------------- |
| `cachedElements`     | protected | `T[] \| undefined` |         |             | FocusGroupController |
| `currentIndex`       |           | `number`           |         |             | FocusGroupController |
| `direction`          |           | `DirectionTypes`   |         |             | FocusGroupController |
| `directionLength`    |           | `number`           | `5`     |             | FocusGroupController |
| `elementEnterAction` |           |                    |         |             | FocusGroupController |
| `elements`           |           | `T[]`              |         |             | FocusGroupController |
| `focusInElement`     |           | `T`                |         |             | FocusGroupController |
| `focusInIndex`       |           | `number`           |         |             | FocusGroupController |
| `focused`            | protected | `boolean`          |         |             | FocusGroupController |
| `handleFocusin`      |           |                    |         |             | FocusGroupController |
| `handleFocusout`     |           |                    |         |             | FocusGroupController |
| `handleKeydown`      |           |                    |         |             | FocusGroupController |
| `host`               |           | `ReactiveElement`  | `host`  |             | FocusGroupController |
| `isFocusableElement` |           |                    |         |             | FocusGroupController |
| `offset`             |           | `number`           | `0`     |             | FocusGroupController |

### Methods

| Name                         | Privacy | Description | Parameters                                           | Return    | Inherited From       |
| ---------------------------- | ------- | ----------- | ---------------------------------------------------- | --------- | -------------------- |
| `acceptsEventCode`           |         |             | `code: string`                                       | `boolean` | FocusGroupController |
| `addEventListeners`          |         |             |                                                      | `void`    | FocusGroupController |
| `clearElementCache`          |         |             | `offset`                                             | `void`    | FocusGroupController |
| `focus`                      |         |             | `options: FocusOptions`                              | `void`    | FocusGroupController |
| `focusToElement`             |         |             | `elementIndex: number`                               | `void`    | FocusGroupController |
| `hostConnected`              |         |             |                                                      | `void`    | FocusGroupController |
| `hostContainsFocus`          |         |             |                                                      | `void`    | FocusGroupController |
| `hostDisconnected`           |         |             |                                                      | `void`    | FocusGroupController |
| `hostNoLongerContainsFocus`  |         |             |                                                      | `void`    | FocusGroupController |
| `hostUpdated`                |         |             |                                                      | `void`    |                      |
| `isEventWithinListenerScope` |         |             | `event: Event`                                       | `boolean` | FocusGroupController |
| `isRelatedTargetAnElement`   |         |             | `event: FocusEvent`                                  | `boolean` | FocusGroupController |
| `manage`                     |         |             |                                                      | `void`    | FocusGroupController |
| `manageTabindexes`           |         |             |                                                      | `void`    |                      |
| `removeEventListeners`       |         |             |                                                      | `void`    | FocusGroupController |
| `setCurrentIndexCircularly`  |         |             | `diff: number`                                       | `void`    | FocusGroupController |
| `unmanage`                   |         |             |                                                      | `void`    | FocusGroupController |
| `updateTabindexes`           |         |             | `getTabIndex: (el: HTMLElement) => UpdateTabIndexes` | `void`    |                      |

<hr/>

## Exports

| Kind | Name                       | Declaration              | Module                                                           | Package |
| ---- | -------------------------- | ------------------------ | ---------------------------------------------------------------- | ------- |
| `js` | `RovingTabindexController` | RovingTabindexController | ../packages/components/shared/src/controllers/roving-tabindex.ts |         |

# `../packages/components/shared/src/controllers/selection.ts`:

## class: `SelectionController`

### Fields

| Name        | Privacy | Type      | Default               | Description                                         | Inherited From |
| ----------- | ------- | --------- | --------------------- | --------------------------------------------------- | -------------- |
| `multiple`  |         | `boolean` | `!!options?.multiple` | Whether more than 1 item can be selected at a time. |                |
| `selection` |         | `Set<T>`  |                       |                                                     |                |
| `size`      |         | `number`  | `0`                   | The total number of items in the selection.         |                |

### Methods

| Name                 | Privacy | Description | Parameters | Return    | Inherited From |
| -------------------- | ------- | ----------- | ---------- | --------- | -------------- |
| `areAllSelected`     |         |             |            | `boolean` |                |
| `areSomeSelected`    |         |             |            | `boolean` |                |
| `deselect`           |         |             | `item: T`  | `void`    |                |
| `deselectAll`        |         |             |            | `void`    |                |
| `isSelectAllToggled` |         |             |            | `boolean` |                |
| `isSelected`         |         |             | `item: T`  | `boolean` |                |
| `select`             |         |             | `item: T`  | `void`    |                |
| `selectAll`          |         |             |            | `void`    |                |
| `toggle`             |         |             | `item: T`  | `void`    |                |

<hr/>

## Exports

| Kind | Name                  | Declaration         | Module                                                     | Package |
| ---- | --------------------- | ------------------- | ---------------------------------------------------------- | ------- |
| `js` | `SelectionController` | SelectionController | ../packages/components/shared/src/controllers/selection.ts |         |

# `../packages/components/shared/src/controllers/shortcut.ts`:

## class: `ShortcutController`

### Methods

| Name               | Privacy | Description | Parameters                 | Return | Inherited From |
| ------------------ | ------- | ----------- | -------------------------- | ------ | -------------- |
| `bind`             |         |             | `shortcuts: KeyBindingMap` | `void` |                |
| `hostConnected`    |         |             |                            | `void` |                |
| `hostDisconnected` |         |             |                            | `void` |                |
| `unbind`           |         |             |                            | `void` |                |

<hr/>

## Exports

| Kind | Name                 | Declaration        | Module                                                    | Package |
| ---- | -------------------- | ------------------ | --------------------------------------------------------- | ------- |
| `js` | `ShortcutController` | ShortcutController | ../packages/components/shared/src/controllers/shortcut.ts |         |

# `../packages/components/shared/src/css.ts`:

## Variables

| Name                     | Description | Type     |
| ------------------------ | ----------- | -------- |
| `firstFocusableSelector` |             | `string` |

<hr/>

## Exports

| Kind | Name                     | Declaration            | Module                                   | Package |
| ---- | ------------------------ | ---------------------- | ---------------------------------------- | ------- |
| `js` | `breakpoints`            | breakpoints            | ../packages/components/shared/src/css.ts |         |
| `js` | `firstFocusableSelector` | firstFocusableSelector | ../packages/components/shared/src/css.ts |         |

# `../packages/components/shared/src/data-source/array-data-source.ts`:

## class: `ArrayDataSource`

### Superclass

| Name         | Module                                                     | Package |
| ------------ | ---------------------------------------------------------- | ------- |
| `DataSource` | /packages/components/shared/src/data-source/data-source.js |         |

### Fields

| Name            | Privacy | Type                                | Default | Description                                | Inherited From |
| --------------- | ------- | ----------------------------------- | ------- | ------------------------------------------ | -------------- |
| `filteredItems` |         | `T[]`                               |         | The filtered & sorted array of items.      | DataSource     |
| `filters`       |         | `Map<string, DataSourceFilter<T>>`  |         |                                            | DataSource     |
| `groupBy`       |         | `DataSourceGroupBy<T> \| undefined` |         |                                            | DataSource     |
| `items`         |         | `T[]`                               |         | The array of all items.                    | DataSource     |
| `size`          |         | `number`                            |         | Total number of items in this data source. | DataSource     |
| `sort`          |         | `DataSourceSort<T> \| undefined`    |         |                                            | DataSource     |

### Methods

| Name            | Privacy | Description                                                                                                                                                                                                                                                                         | Parameters                                                                            | Return | Inherited From |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ | -------------- |
| `addFilter`     |         |                                                                                                                                                                                                                                                                                     | `id: string, pathOrFilter: U, value: string \| string[]`                              | `void` | DataSource     |
| `removeFilter`  |         |                                                                                                                                                                                                                                                                                     | `id: string`                                                                          | `void` | DataSource     |
| `removeGroupBy` |         | Remove the groupBy attribute. This will cause the data to be sorted as if it was not grouped.                                                                                                                                                                                       |                                                                                       | `void` | DataSource     |
| `removeSort`    |         |                                                                                                                                                                                                                                                                                     |                                                                                       | `void` | DataSource     |
| `setGroupBy`    |         | Group the items by the given path. Optionally, you can provide a sorter and direction.&#xA;&#xA;This is part of the DataSource interface, because it changes how the data is sorted. You&#xA;may want to pass the groupBy attribute to the server, so it can sort the data for you. | `path: string, sorter: DataSourceSortFunction<T>, direction: DataSourceSortDirection` | `void` | DataSource     |
| `setSort`       |         |                                                                                                                                                                                                                                                                                     | `id: string, pathOrSorter: U, direction: DataSourceSortDirection`                     | `void` | DataSource     |

### Events

| Name        | Type          | Description | Inherited From |
| ----------- | ------------- | ----------- | -------------- |
| `sl-update` | `CustomEvent` |             |                |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                                             | Package |
| ---- | ----------------- | --------------- | ------------------------------------------------------------------ | ------- |
| `js` | `ArrayDataSource` | ArrayDataSource | ../packages/components/shared/src/data-source/array-data-source.ts |         |

# `../packages/components/shared/src/data-source/data-source.ts`:

## class: `DataSource`

### Superclass

| Name          | Module                                                       | Package |
| ------------- | ------------------------------------------------------------ | ------- |
| `EventTarget` | ../packages/components/shared/src/data-source/data-source.ts |         |

### Fields

| Name            | Privacy | Type                                | Default | Description                                | Inherited From |
| --------------- | ------- | ----------------------------------- | ------- | ------------------------------------------ | -------------- |
| `filteredItems` |         | `T[]`                               |         | The filtered & sorted array of items.      |                |
| `filters`       |         | `Map<string, DataSourceFilter<T>>`  |         |                                            |                |
| `groupBy`       |         | `DataSourceGroupBy<T> \| undefined` |         |                                            |                |
| `items`         |         | `T[]`                               |         | The array of all items.                    |                |
| `size`          |         | `number`                            |         | Total number of items in this data source. |                |
| `sort`          |         | `DataSourceSort<T> \| undefined`    |         |                                            |                |

### Methods

| Name            | Privacy | Description                                                                                                                                                                                                                                                                         | Parameters                                                                            | Return | Inherited From |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ | -------------- |
| `addFilter`     |         |                                                                                                                                                                                                                                                                                     | `id: string, pathOrFilter: U, value: string \| string[]`                              | `void` |                |
| `removeFilter`  |         |                                                                                                                                                                                                                                                                                     | `id: string`                                                                          | `void` |                |
| `removeGroupBy` |         | Remove the groupBy attribute. This will cause the data to be sorted as if it was not grouped.                                                                                                                                                                                       |                                                                                       | `void` |                |
| `removeSort`    |         |                                                                                                                                                                                                                                                                                     |                                                                                       | `void` |                |
| `setGroupBy`    |         | Group the items by the given path. Optionally, you can provide a sorter and direction.&#xA;&#xA;This is part of the DataSource interface, because it changes how the data is sorted. You&#xA;may want to pass the groupBy attribute to the server, so it can sort the data for you. | `path: string, sorter: DataSourceSortFunction<T>, direction: DataSourceSortDirection` | `void` |                |
| `setSort`       |         |                                                                                                                                                                                                                                                                                     | `id: string, pathOrSorter: U, direction: DataSourceSortDirection`                     | `void` |                |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                                       | Package |
| ---- | ------------ | ----------- | ------------------------------------------------------------ | ------- |
| `js` | `DataSource` | DataSource  | ../packages/components/shared/src/data-source/data-source.ts |         |

# `../packages/components/shared/src/decorators/base.ts`:

## Functions

| Name               | Description                                                                                                                                                                                                                                                                  | Parameters                                                                                                                                                                                                                                | Return               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `decorateProperty` | Helper for decorating a property that is compatible with both TypeScript&#xA;and Babel decorators. The optional `finisher` can be used to perform work on&#xA;the class. The optional `descriptor` should return a PropertyDescriptor&#xA;to install for the given property. | `{
    finisher,
    descriptor
  }: {
    finisher?: ((ctor: typeof ReactiveElement, property: PropertyKey) => void) \| null;
    descriptor?(property: PropertyKey): PropertyDescriptor;
  }, finisher: function, descriptor: function` | `ClassElement\|void` |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                               | Package |
| ---- | ------------------ | ---------------- | ---------------------------------------------------- | ------- |
| `js` | `decorateProperty` | decorateProperty | ../packages/components/shared/src/decorators/base.ts |         |

# `../packages/components/shared/src/decorators/event.ts`:

## class: `EventEmitter`

### Methods

| Name   | Privacy | Description | Parameters                                       | Return    | Inherited From |
| ------ | ------- | ----------- | ------------------------------------------------ | --------- | -------------- |
| `emit` |         |             | `value: T \| T['detail'], options: EventOptions` | `boolean` |                |

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

| Kind | Name           | Declaration  | Module                                                | Package |
| ---- | -------------- | ------------ | ----------------------------------------------------- | ------- |
| `js` | `EventEmitter` | EventEmitter | ../packages/components/shared/src/decorators/event.ts |         |
| `js` | `event`        | event        | ../packages/components/shared/src/decorators/event.ts |         |

# `../packages/components/shared/src/decorators/observe.ts`:

## Functions

| Name      | Description | Parameters                                          | Return |
| --------- | ----------- | --------------------------------------------------- | ------ |
| `observe` |             | `propertyName: string, lifecycle: ObserveLifecycle` |        |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                                  | Package |
| ---- | --------- | ----------- | ------------------------------------------------------- | ------- |
| `js` | `observe` | observe     | ../packages/components/shared/src/decorators/observe.ts |         |

# `../packages/components/shared/src/directives/anchor.ts`:

## class: `AnchorDirective`

### Superclass

| Name        | Module | Package          |
| ----------- | ------ | ---------------- |
| `Directive` |        | lit/directive.js |

<hr/>

## Variables

| Name     | Description | Type |
| -------- | ----------- | ---- |
| `anchor` |             |      |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                                 | Package |
| ---- | ----------------- | --------------- | ------------------------------------------------------ | ------- |
| `js` | `AnchorDirective` | AnchorDirective | ../packages/components/shared/src/directives/anchor.ts |         |
| `js` | `anchor`          | anchor          | ../packages/components/shared/src/directives/anchor.ts |         |

# `../packages/components/shared/src/events.ts`:

## Exports

| Kind | Name            | Declaration   | Module             | Package |
| ---- | --------------- | ------------- | ------------------ | ------- |
| `js` | `SlBlurEvent`   | SlBlurEvent   | ./events/blur.js   |         |
| `js` | `SlChangeEvent` | SlChangeEvent | ./events/change.js |         |
| `js` | `SlFocusEvent`  | SlFocusEvent  | ./events/focus.js  |         |
| `js` | `SlSelectEvent` | SlSelectEvent | ./events/select.js |         |
| `js` | `SlToggleEvent` | SlToggleEvent | ./events/toggle.js |         |

# `../packages/components/shared/src/path.ts`:

## Functions

| Name              | Description | Parameters                              | Return    |
| ----------------- | ----------- | --------------------------------------- | --------- |
| `getNameByPath`   |             | `path: string`                          | `string`  |
| `getStringByPath` |             | `object: unknown, path`                 | `string`  |
| `getValueByPath`  |             | `object: unknown, path`                 | `unknown` |
| `setValueByPath`  |             | `object: unknown, path, value: unknown` | `void`    |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                    | Package |
| ---- | ----------------- | --------------- | ----------------------------------------- | ------- |
| `js` | `getNameByPath`   | getNameByPath   | ../packages/components/shared/src/path.ts |         |
| `js` | `getStringByPath` | getStringByPath | ../packages/components/shared/src/path.ts |         |
| `js` | `getValueByPath`  | getValueByPath  | ../packages/components/shared/src/path.ts |         |
| `js` | `setValueByPath`  | setValueByPath  | ../packages/components/shared/src/path.ts |         |

# `../packages/components/shared/src/popover.ts`:

## Functions

| Name              | Description | Parameters                                                               | Return         |
| ----------------- | ----------- | ------------------------------------------------------------------------ | -------------- |
| `isPopoverOpen`   |             | `element: HTMLElement`                                                   | `boolean`      |
| `positionPopover` |             | `element: HTMLElement, anchor: Element, options: PositionPopoverOptions` | `(() => void)` |

<hr/>

## Exports

| Kind | Name              | Declaration     | Module                                       | Package |
| ---- | ----------------- | --------------- | -------------------------------------------- | ------- |
| `js` | `isPopoverOpen`   | isPopoverOpen   | ../packages/components/shared/src/popover.ts |         |
| `js` | `positionPopover` | positionPopover | ../packages/components/shared/src/popover.ts |         |

# `../packages/components/shared/src/string.ts`:

## Functions

| Name         | Description                                                                                                                                                                                                                                                                                                                                                                                                    | Parameters    | Return |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| `camelize`   | Returns the lowerCamelCase form of a string.&#xA;&#xA;\```javascript&#xA;camelize('innerHTML')          // 'innerHTML'&#xA;camelize('action_name')        // 'actionName'&#xA;camelize('css-class-name')     // 'cssClassName'&#xA;camelize('object.path.name')   // 'objectPathName'&#xA;camelize('my favorite items')  // 'myFavoriteItems'&#xA;camelize('My Favorite Items')  // 'myFavoriteItems'&#xA;\``` | `str: string` |        |
| `capitalize` | Returns the Capitalized form of a string&#xA;&#xA;\```javascript&#xA;capitalize('innerHTML')         // 'InnerHTML'&#xA;capitalize('action_name')       // 'Action_name'&#xA;capitalize('css-class-name')    // 'Css-class-name'&#xA;capitalize('my favorite items') // 'My favorite items'&#xA;\```                                                                                                           | `str: string` |        |
| `classify`   | Returns the UpperCamelCase form of a string.&#xA;&#xA;\```javascript&#xA;classify('innerHTML')          // 'InnerHTML'&#xA;classify('action_name')        // 'ActionName'&#xA;classify('css-class-name')     // 'CssClassName'&#xA;classify('my favorite items')  // 'MyFavoriteItems'&#xA;\```                                                                                                                | `str: string` |        |
| `dasherize`  | Replaces underscores, spaces, or camelCase with dashes.&#xA;&#xA;\```javascript&#xA;dasherize('innerHTML')         // 'inner-html'&#xA;dasherize('action_name')       // 'action-name'&#xA;dasherize('css-class-name')    // 'css-class-name'&#xA;dasherize('my favorite items') // 'my-favorite-items'&#xA;\```                                                                                               | `str: string` |        |
| `decamelize` | Converts a camelized string into all lower case separated by underscores.&#xA;&#xA;\```javascript&#xA;decamelize('innerHTML')         // 'inner_html'&#xA;decamelize('action_name')       // 'action_name'&#xA;decamelize('css-class-name')    // 'css-class-name'&#xA;decamelize('my favorite items') // 'my favorite items'&#xA;\```                                                                         | `str: string` |        |
| `humanize`   | Returns the Humanized form of a string&#xA;&#xA;\```javascript&#xA;humanize('innerHTML')         // 'Inner html'&#xA;humanize('action_name')       // 'Action name'&#xA;humanize('css-class-name')    // 'Css class name'&#xA;humanize('my favorite items') // 'My favorite items'&#xA;\```                                                                                                                    | `str: string` |        |
| `underscore` | More general than decamelize. Returns the lower\\_case\\_and\\_underscored&#xA;form of a string.&#xA;&#xA;\```javascript&#xA;underscore('innerHTML')          // 'inner_html'&#xA;underscore('action_name')        // 'action_name'&#xA;underscore('css-class-name')     // 'css_class_name'&#xA;underscore('my favorite items')  // 'my_favorite_items'&#xA;\```                                              | `str: string` |        |

<hr/>

## Exports

| Kind | Name         | Declaration | Module                                      | Package |
| ---- | ------------ | ----------- | ------------------------------------------- | ------- |
| `js` | `camelize`   | camelize    | ../packages/components/shared/src/string.ts |         |
| `js` | `capitalize` | capitalize  | ../packages/components/shared/src/string.ts |         |
| `js` | `classify`   | classify    | ../packages/components/shared/src/string.ts |         |
| `js` | `dasherize`  | dasherize   | ../packages/components/shared/src/string.ts |         |
| `js` | `decamelize` | decamelize  | ../packages/components/shared/src/string.ts |         |
| `js` | `humanize`   | humanize    | ../packages/components/shared/src/string.ts |         |
| `js` | `underscore` | underscore  | ../packages/components/shared/src/string.ts |         |

# `../packages/components/shared/src/vendor/tinykeys.ts`:

## Functions

| Name                       | Description                                                                                                                                                                                                     | Parameters                                                                                | Return              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------- |
| `createKeybindingsHandler` | Creates an event listener for handling keybindings.                                                                                                                                                             | `keyBindingMap: KeyBindingMap, options: KeyBindingHandlerOptions`                         | `EventListener`     |
| `parseKeybinding`          | Parses a "Key Binding String" into its parts&#xA;&#xA;grammar    = `<sequence>`&#xA;\<sequence> = `<press> <press> <press> ...`&#xA;\<press>    = `<key>` or `<mods>+<key>`&#xA;\<mods>     = `<mod>+<mod>+...` | `str: string`                                                                             | `KeyBindingPress[]` |
| `tinykeys`                 | Subscribes to keybindings.&#xA;&#xA;Returns an unsubscribe method.                                                                                                                                              | `target: Window \| HTMLElement, keyBindingMap: KeyBindingMap, options: KeyBindingOptions` | `() => void`        |

<hr/>

## Exports

| Kind | Name                       | Declaration              | Module                                               | Package |
| ---- | -------------------------- | ------------------------ | ---------------------------------------------------- | ------- |
| `js` | `parseKeybinding`          | parseKeybinding          | ../packages/components/shared/src/vendor/tinykeys.ts |         |
| `js` | `createKeybindingsHandler` | createKeybindingsHandler | ../packages/components/shared/src/vendor/tinykeys.ts |         |
| `js` | `tinykeys`                 | tinykeys                 | ../packages/components/shared/src/vendor/tinykeys.ts |         |

# `../packages/components/skeleton/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package           |
| ---- | ---- | ----------- | ------ | ----------------- |
| `js` | `*`  | *           |        | ./src/skeleton.js |

# `../packages/components/skeleton/register.ts`:

## Exports

| Kind                        | Name          | Declaration | Module                                        | Package |
| --------------------------- | ------------- | ----------- | --------------------------------------------- | ------- |
| `custom-element-definition` | `sl-skeleton` | Skeleton    | /packages/components/skeleton/src/skeleton.js |         |

# `../packages/components/skeleton/src/skeleton.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                               | Package |
| ---- | --------- | ----------- | ---------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/skeleton/src/skeleton.scss.ts |         |

# `../packages/components/skeleton/src/skeleton.ts`:

## class: `Skeleton`, `sl-skeleton`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name      | Privacy | Type                                        | Default     | Description         | Inherited From |
| --------- | ------- | ------------------------------------------- | ----------- | ------------------- | -------------- |
| `effect`  |         | `'none' \| 'shimmer' \| 'pulse' \| 'sheen'` | `'shimmer'` | Skeleton's effect.  |                |
| `variant` |         | `'circle' \| 'default'`                     | `'default'` | Skeleton's variant. |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `effect`  | effect  |                |
| `variant` | variant |                |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                          | Package |
| ---- | ---------- | ----------- | ----------------------------------------------- | ------- |
| `js` | `Skeleton` | Skeleton    | ../packages/components/skeleton/src/skeleton.ts |         |

# `../packages/components/spinner/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package          |
| ---- | ---- | ----------- | ------ | ---------------- |
| `js` | `*`  | *           |        | ./src/spinner.js |

# `../packages/components/spinner/register.ts`:

## Exports

| Kind                        | Name         | Declaration | Module                                      | Package |
| --------------------------- | ------------ | ----------- | ------------------------------------------- | ------- |
| `custom-element-definition` | `sl-spinner` | Spinner     | /packages/components/spinner/src/spinner.js |         |

# `../packages/components/spinner/src/spinner.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                             | Package |
| ---- | --------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/spinner/src/spinner.scss.ts |         |

# `../packages/components/spinner/src/spinner.ts`:

## class: `Spinner`, `sl-spinner`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name      | Privacy | Type                          | Default | Description                                                | Inherited From |
| --------- | ------- | ----------------------------- | ------- | ---------------------------------------------------------- | -------------- |
| `size`    |         | `SpinnerSize \| undefined`    |         | The size of the spinner. Defaults to md in CSS if not set. |                |
| `variant` |         | `SpinnerVariant \| undefined` |         | The spinner variant.                                       |                |

### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `size`    | size    |                |
| `variant` | variant |                |

### CSS Properties

| Name                | Default | Description                                        |
| ------------------- | ------- | -------------------------------------------------- |
| `--sl-spinner-size` |         | The size of the spinner, defaults to md if not set |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `Spinner` | Spinner     | ../packages/components/spinner/src/spinner.ts |         |

# `../packages/components/switch/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package         |
| ---- | ---- | ----------- | ------ | --------------- |
| `js` | `*`  | *           |        | ./src/switch.js |

# `../packages/components/switch/register.ts`:

## Exports

| Kind                        | Name        | Declaration | Module                                    | Package |
| --------------------------- | ----------- | ----------- | ----------------------------------------- | ------- |
| `custom-element-definition` | `sl-switch` | Switch      | /packages/components/switch/src/switch.js |         |

# `../packages/components/switch/src/switch.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                           | Package |
| ---- | --------- | ----------- | ------------------------------------------------ | ------- |
| `js` | `default` |             | ../packages/components/switch/src/switch.scss.ts |         |

# `../packages/components/switch/src/switch.ts`:

## class: `Switch`, `sl-switch`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `FormControlMixin`    |        | @sl-design-system/form                  |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name                | Privacy | Type                                         | Default | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `checked`           |         | `boolean \| undefined`                       |         | Whether the switch is on or off.                                                                                                                                                                                                                                                                                                                        |                  |
| `customValidity`    |         | `string \| undefined`                        |         | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `disabled`          |         | `boolean \| undefined`                       |         | Whether the switch is disabled; when set no interaction is possible.                                                                                                                                                                                                                                                                                    |                  |
| `form`              |         | `HTMLFormElement \| null`                    |         | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                    |         | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `iconOff`           |         | `string \| undefined`                        |         | Custom icon in "off" state.                                                                                                                                                                                                                                                                                                                             |                  |
| `iconOn`            |         | `string \| undefined`                        |         | Custom icon in "on" state.                                                                                                                                                                                                                                                                                                                              |                  |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null `` |         | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `name`              |         | `string \| undefined`                        |         | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                  |         |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `reverse`           |         | `boolean \| undefined`                       |         | Whether the toggle should be shown *after* the text.                                                                                                                                                                                                                                                                                                    |                  |
| `showValid`         |         | `boolean`                                    | `false` | Optional property to indicate the valid state should be shown.                                                                                                                                                                                                                                                                                          | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`          |         | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `size`              |         | `SwitchSize`                                 | `'md'`  | The size of the switch.                                                                                                                                                                                                                                                                                                                                 |                  |
| `valid`             |         | `boolean`                                    |         | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                     |         | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                              |         | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`          |         | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                       |         | The value of the switch when the switch is checked.&#xA;See the formValue property for easy access.                                                                                                                                                                                                                                                     | FormControlMixin |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | ---------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    | FormControlMixin |

### Events

| Name          | Type                                     | Description                              | Inherited From   |
| ------------- | ---------------------------------------- | ---------------------------------------- | ---------------- |
| `blurEvent`   | `EventEmitter<SlBlurEvent>`              | Emits when the component loses focus.    |                  |
| `changeEvent` | `EventEmitter<SlChangeEvent<T \| null>>` | Emits when the checked state changes.    |                  |
| `focusEvent`  | `EventEmitter<SlFocusEvent>`             | Emits when the component receives focus. |                  |
|               | `ValidateEvent`                          |                                          | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `checked`         | checked        |                  |
| `disabled`        | disabled       |                  |
| `icon-off`        | iconOff        |                  |
| `icon-on`         | iconOn         |                  |
| `reverse`         | reverse        |                  |
| `size`            | size           |                  |
| `value`           | value          |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

### Slots

| Name      | Description                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `default` | Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc. |

<hr/>

## Exports

| Kind | Name     | Declaration | Module                                      | Package |
| ---- | -------- | ----------- | ------------------------------------------- | ------- |
| `js` | `Switch` | Switch      | ../packages/components/switch/src/switch.ts |         |

# `../packages/components/tabs/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package            |
| ---- | ---- | ----------- | ------ | ------------------ |
| `js` | `*`  | *           |        | ./src/tab-group.js |
| `js` | `*`  | *           |        | ./src/tab-panel.js |
| `js` | `*`  | *           |        | ./src/tab.js       |

# `../packages/components/tabs/register.ts`:

## Exports

| Kind                        | Name           | Declaration | Module                                     | Package |
| --------------------------- | -------------- | ----------- | ------------------------------------------ | ------- |
| `custom-element-definition` | `sl-tab`       | Tab         | /packages/components/tabs/src/tab.js       |         |
| `custom-element-definition` | `sl-tab-group` | TabGroup    | /packages/components/tabs/src/tab-group.js |         |
| `custom-element-definition` | `sl-tab-panel` | TabPanel    | /packages/components/tabs/src/tab-panel.js |         |

# `../packages/components/tabs/src/tab-group.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                            | Package |
| ---- | --------- | ----------- | ------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/tabs/src/tab-group.scss.ts |         |

# `../packages/components/tabs/src/tab-group.ts`:

## class: `TabGroup`, `sl-tab-group`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name        | Privacy | Type                   | Default   | Description                                                   | Inherited From |
| ----------- | ------- | ---------------------- | --------- | ------------------------------------------------------------- | -------------- |
| `alignment` |         | `TabsAlignment`        | `'start'` | The alignment of tabs inside sl-tab-group                     |                |
| `listbox`   |         | `HTMLElement`          |           | The listbox element with all tabs list.                       |                |
| `tabs`      |         | `Tab[] \| undefined`   |           | The slotted tabs.                                             |                |
| `vertical`  |         | `boolean \| undefined` |           | Renders the tabs vertically instead of the default horizontal |                |

### Events

| Name        | Type                             | Description                                   | Inherited From |
| ----------- | -------------------------------- | --------------------------------------------- | -------------- |
| `tabChange` | `EventEmitter<SlTabChangeEvent>` | Emits when the tab has been selected/changed. |                |

### Attributes

| Name        | Field     | Inherited From |
| ----------- | --------- | -------------- |
| `vertical`  | vertical  |                |
| `alignment` | alignment |                |

### Slots

| Name      | Description                        |
| --------- | ---------------------------------- |
| `default` | a place for the tab group content. |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                       | Package |
| ---- | ---------- | ----------- | -------------------------------------------- | ------- |
| `js` | `TabGroup` | TabGroup    | ../packages/components/tabs/src/tab-group.ts |         |

# `../packages/components/tabs/src/tab-panel.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                            | Package |
| ---- | --------- | ----------- | ------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/tabs/src/tab-panel.scss.ts |         |

# `../packages/components/tabs/src/tab-panel.ts`:

## class: `TabPanel`, `sl-tab-panel`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Slots

| Name      | Description                        |
| --------- | ---------------------------------- |
| `default` | a place for the tab panel content. |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                       | Package |
| ---- | ---------- | ----------- | -------------------------------------------- | ------- |
| `js` | `TabPanel` | TabPanel    | ../packages/components/tabs/src/tab-panel.ts |         |

# `../packages/components/tabs/src/tab.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                      | Package |
| ---- | --------- | ----------- | ------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/tabs/src/tab.scss.ts |         |

# `../packages/components/tabs/src/tab.ts`:

## class: `Tab`, `sl-tab`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Fields

| Name       | Privacy | Type      | Default | Description                      | Inherited From |
| ---------- | ------- | --------- | ------- | -------------------------------- | -------------- |
| `disabled` |         | `boolean` | `false` | Whether the tab item is disabled |                |
| `selected` |         | `boolean` | `false` | Whether the tab item is selected |                |

### Methods

| Name                    | Privacy   | Description                                                                                               | Parameters | Return | Inherited From |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------- | ---------- | ------ | -------------- |
| `handleSelectionChange` | protected | Apply accessible attributes and values to the tab button.&#xA;Observe the selected property if it changes |            | `void` |                |

### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `selected` | selected |                |
| `disabled` | disabled |                |

### Slots

| Name       | Description                                            |
| ---------- | ------------------------------------------------------ |
| `default`  | a place for the tab group content.                     |
| `icon`     | icon shown on the left side of the component.          |
| `badge`    | a place for badge component.                           |
| `subtitle` | subtitle of the tab, containing additional information |

<hr/>

## Exports

| Kind | Name  | Declaration | Module                                 | Package |
| ---- | ----- | ----------- | -------------------------------------- | ------- |
| `js` | `Tab` | Tab         | ../packages/components/tabs/src/tab.ts |         |

# `../packages/components/text-field/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package             |
| ---- | ---- | ----------- | ------ | ------------------- |
| `js` | `*`  | *           |        | ./src/text-field.js |

# `../packages/components/text-field/register.ts`:

## Exports

| Kind                        | Name            | Declaration | Module                                            | Package |
| --------------------------- | --------------- | ----------- | ------------------------------------------------- | ------- |
| `custom-element-definition` | `sl-text-field` | TextField   | /packages/components/text-field/src/text-field.js |         |

# `../packages/components/text-field/src/text-field.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                                   | Package |
| ---- | --------- | ----------- | -------------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/text-field/src/text-field.scss.ts |         |

# `../packages/components/text-field/src/text-field.ts`:

## class: `TextField`, `sl-text-field`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `FormControlMixin`    |        | @sl-design-system/form                  |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name                | Privacy | Type                                                            | Default  | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | --------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `autocomplete`      |         | `typeof HTMLInputElement.prototype.autocomplete \| undefined`   |          | Specifies which type of data the browser can use to pre-fill the input.&#xA;&#xA;NOTE: Declare the type this way so it is backwards compatible with 4.9.5,&#xA;which we still use in `@sl-design-system/angular`.                                                                                                                                       |                  |
| `customValidity`    |         | `string \| undefined`                                           |          | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `disabled`          |         | `boolean \| undefined`                                          |          | Whether the text field is disabled; when set no interaction is possible.                                                                                                                                                                                                                                                                                |                  |
| `form`              |         | `HTMLFormElement \| null`                                       |          | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                                       |          | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `input`             |         | `HTMLInputElement`                                              |          | The input element in the light DOM.                                                                                                                                                                                                                                                                                                                     |                  |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null ``                    |          | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `maxLength`         |         | `number \| undefined`                                           |          | Maximum length (number of characters).                                                                                                                                                                                                                                                                                                                  |                  |
| `minLength`         |         | `number \| undefined`                                           |          | Minimum length (number of characters).                                                                                                                                                                                                                                                                                                                  |                  |
| `name`              |         | `string \| undefined`                                           |          | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                                     |          |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `pattern`           |         | `string \| undefined`                                           |          | This will validate the value of the input using the given pattern.                                                                                                                                                                                                                                                                                      |                  |
| `placeholder`       |         | `string \| undefined`                                           |          | Placeholder text in the input.                                                                                                                                                                                                                                                                                                                          |                  |
| `readonly`          |         | `boolean \| undefined`                                          |          | Whether you can interact with the input or if it is just a static, readonly display.                                                                                                                                                                                                                                                                    |                  |
| `required`          |         | `boolean \| undefined`                                          |          | Whether the text field is a required field.                                                                                                                                                                                                                                                                                                             |                  |
| `showValid`         |         | `boolean`                                                       | `false`  | When set will cause the control to show it is valid after reportValidity is called.                                                                                                                                                                                                                                                                     | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`                             |          | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `size`              |         | `TextFieldSize`                                                 | `'md'`   | The size of the input.                                                                                                                                                                                                                                                                                                                                  |                  |
| `type`              |         | `'email' \| 'number' \| 'tel' \| 'text' \| 'url' \| 'password'` | `'text'` | The input type. Only text types are valid here. For other types,&#xA;see their respective components.                                                                                                                                                                                                                                                   |                  |
| `valid`             |         | `boolean`                                                       |          | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                                        |          | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                                                 |          | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`                             |          | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                                          | `''`     | The value for the input, to be used in forms.                                                                                                                                                                                                                                                                                                           | FormControlMixin |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | ---------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    | FormControlMixin |

### Events

| Name          | Type                                  | Description                                | Inherited From   |
| ------------- | ------------------------------------- | ------------------------------------------ | ---------------- |
| `blurEvent`   | `EventEmitter<SlBlurEvent>`           | Emits when the focus leaves the component. |                  |
| `changeEvent` | `EventEmitter<SlChangeEvent<string>>` | Emits when the value changes.              |                  |
| `focusEvent`  | `EventEmitter<SlFocusEvent>`          | Emits when the component gains focus.      |                  |
|               | `ValidateEvent`                       |                                            | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `autocomplete`    | autocomplete   |                  |
| `disabled`        | disabled       |                  |
| `maxlength`       | maxLength      |                  |
| `minlength`       | minLength      |                  |
| `pattern`         | pattern        |                  |
| `placeholder`     | placeholder    |                  |
| `readonly`        | readonly       |                  |
| `required`        | required       |                  |
| `show-valid`      | showValid      |                  |
| `size`            | size           |                  |
| `type`            | type           |                  |
| `value`           | value          |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

### CSS Parts

| Name      | Description         |
| --------- | ------------------- |
| `wrapper` | The input's wrapper |

### Slots

| Name     | Description                    |
| -------- | ------------------------------ |
| `prefix` | Content shown before the input |
| `input`  | The slot for the input element |
| `suffix` | Content shown after the input  |

<hr/>

## Exports

| Kind | Name        | Declaration | Module                                              | Package |
| ---- | ----------- | ----------- | --------------------------------------------------- | ------- |
| `js` | `TextField` | TextField   | ../packages/components/text-field/src/text-field.ts |         |

# `../packages/components/textarea/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package           |
| ---- | ---- | ----------- | ------ | ----------------- |
| `js` | `*`  | *           |        | ./src/textarea.js |

# `../packages/components/textarea/register.ts`:

## Exports

| Kind                        | Name          | Declaration | Module                                        | Package |
| --------------------------- | ------------- | ----------- | --------------------------------------------- | ------- |
| `custom-element-definition` | `sl-textarea` | Textarea    | /packages/components/textarea/src/textarea.js |         |

# `../packages/components/textarea/src/textarea.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                               | Package |
| ---- | --------- | ----------- | ---------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/textarea/src/textarea.scss.ts |         |

# `../packages/components/textarea/src/textarea.ts`:

## class: `Textarea`, `sl-textarea`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Mixins

| Name                  | Module | Package                                 |
| --------------------- | ------ | --------------------------------------- |
| `FormControlMixin`    |        | @sl-design-system/form                  |
| `ScopedElementsMixin` |        | @open-wc/scoped-elements/lit-element.js |

### Fields

| Name                | Privacy | Type                                                             | Default      | Description                                                                                                                                                                                                                                                                                                                                             | Inherited From   |
| ------------------- | ------- | ---------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `autocomplete`      |         | `typeof HTMLTextAreaElement.prototype.autocomplete \| undefined` |              | Specifies which type of data the browser can use to pre-fill the textarea.&#xA;&#xA;NOTE: Declare the type this way so it is backwards compatible with 4.9.5,&#xA;which we still use in `@sl-design-system/angular`.                                                                                                                                    |                  |
| `customValidity`    |         | `string \| undefined`                                            |              | The error message to display when the control is invalid.                                                                                                                                                                                                                                                                                               | FormControlMixin |
| `disabled`          |         | `boolean \| undefined`                                           |              | Whether the textarea is disabled; when set no interaction is possible.                                                                                                                                                                                                                                                                                  |                  |
| `form`              |         | `HTMLFormElement \| null`                                        |              | The form associated with the control.                                                                                                                                                                                                                                                                                                                   | FormControlMixin |
| `formValue`         |         | `unknown`                                                        |              | The value used when submitting the form.                                                                                                                                                                                                                                                                                                                | FormControlMixin |
| `labels`            |         | `` `NodeListOf<HTMLLabelElement>` \| null ``                     |              | The labels associated with the control.                                                                                                                                                                                                                                                                                                                 | FormControlMixin |
| `maxLength`         |         | `number \| undefined`                                            |              | Maximum length (number of characters).                                                                                                                                                                                                                                                                                                                  |                  |
| `minLength`         |         | `number \| undefined`                                            |              | Minimum length (number of characters).                                                                                                                                                                                                                                                                                                                  |                  |
| `name`              |         | `string \| undefined`                                            |              | The name of the form control.                                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `nativeFormValue`   |         | `FormValue`                                                      |              |                                                                                                                                                                                                                                                                                                                                                         | FormControlMixin |
| `placeholder`       |         | `string \| undefined`                                            |              | Placeholder text in the input.                                                                                                                                                                                                                                                                                                                          |                  |
| `readonly`          |         | `boolean \| undefined`                                           |              | Whether you can interact with the textarea or if it is just a static, readonly display.                                                                                                                                                                                                                                                                 |                  |
| `required`          |         | `boolean \| undefined`                                           |              | Whether the textarea is a required field.                                                                                                                                                                                                                                                                                                               |                  |
| `resize`            |         | `ResizeType`                                                     | `'vertical'` | The way the textarea can be resized.                                                                                                                                                                                                                                                                                                                    |                  |
| `rows`              |         | `number \| undefined`                                            |              | The number of rows the textarea should initially have.&#xA;If not set, the browser defaults to 2 rows.                                                                                                                                                                                                                                                  |                  |
| `showValid`         |         | `boolean`                                                        | `false`      | When set will cause the control to show it is valid after reportValidity is called.                                                                                                                                                                                                                                                                     | FormControlMixin |
| `showValidity`      |         | `'valid' \| 'invalid' \| undefined`                              |              | Whether to show the validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `size`              |         | `TextareaSize`                                                   | `'md'`       | The size of the textarea.                                                                                                                                                                                                                                                                                                                               |                  |
| `textarea`          |         | `HTMLTextAreaElement`                                            |              | The textarea in the light DOM.                                                                                                                                                                                                                                                                                                                          |                  |
| `valid`             |         | `boolean`                                                        |              | Returns whether the form control is valid or not.                                                                                                                                                                                                                                                                                                       | FormControlMixin |
| `validationMessage` |         | `string`                                                         |              | String representing a localized (by the browser) message that describes the validation&#xA;constraints that the control does not satisfy (if any). The string is empty if the control&#xA;is not a candidate for constraint validation, or it satisfies its constraints.&#xA;&#xA;For true localization, see `getLocalizedValidationMessage()` instead. | FormControlMixin |
| `validity`          |         | `ValidityState`                                                  |              | Returns the validity state the control is in.                                                                                                                                                                                                                                                                                                           | FormControlMixin |
| `validityState`     |         | `'valid' \| 'invalid' \| 'pending'`                              |              | Returns the current validity state.                                                                                                                                                                                                                                                                                                                     | FormControlMixin |
| `value`             |         | `unknown \| undefined`                                           | `''`         | The value for the textarea.                                                                                                                                                                                                                                                                                                                             | FormControlMixin |
| `wrap`              |         | `WrapType`                                                       | `'soft'`     | The way text should be wrapped during form submission.                                                                                                                                                                                                                                                                                                  |                  |

### Methods

| Name                            | Privacy | Description                                                                                                                                                                                                                                     | Parameters                           | Return    | Inherited From   |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- | ---------------- |
| `getLocalizedValidationMessage` |         | This returns a localized validation message. It does not support all `ValidityState` properties,&#xA;since some require more context than we have here. If you need to support more, you can override&#xA;this method in your own form control. |                                      | `string`  | FormControlMixin |
| `reportValidity`                |         | Returns whether the control is valid. If the control is invalid, calling this will&#xA;also cause an `invalid` event to be dispatched. After calling this, the control&#xA;will also report the validity to the user.                           |                                      | `boolean` | FormControlMixin |
| `setCustomValidity`             |         | Sets a custom validation message for the form control. If the message&#xA;is not an empty string, that will make the control invalid. By setting it to&#xA;an empty string again, you can make the control valid again.                         | `message: string \| Promise<string>` | `void`    | FormControlMixin |

### Events

| Name          | Type                                  | Description                                | Inherited From   |
| ------------- | ------------------------------------- | ------------------------------------------ | ---------------- |
| `blurEvent`   | `EventEmitter<SlBlurEvent>`           | Emits when the focus leaves the component. |                  |
| `changeEvent` | `EventEmitter<SlChangeEvent<string>>` | Emits when the value changes.              |                  |
| `focusEvent`  | `EventEmitter<SlFocusEvent>`          | Emits when the component gains focus.      |                  |
|               | `ValidateEvent`                       |                                            | FormControlMixin |

### Attributes

| Name              | Field          | Inherited From   |
| ----------------- | -------------- | ---------------- |
| `autocomplete`    | autocomplete   |                  |
| `disabled`        | disabled       |                  |
| `maxlength`       | maxLength      |                  |
| `minlength`       | minLength      |                  |
| `placeholder`     | placeholder    |                  |
| `readonly`        | readonly       |                  |
| `required`        | required       |                  |
| `resize`          | resize         |                  |
| `rows`            | rows           |                  |
| `show-valid`      | showValid      |                  |
| `size`            | size           |                  |
| `value`           | value          |                  |
| `wrap`            | wrap           |                  |
| `custom-validity` | customValidity | FormControlMixin |
| `name`            | name           | FormControlMixin |
| `show-validity`   | showValidity   | FormControlMixin |

### CSS Properties

| Name                 | Default | Description                                          |
| -------------------- | ------- | ---------------------------------------------------- |
| `--sl-textarea-rows` |         | The number of rows initially visible in the textarea |

### Slots

| Name       | Description                       |
| ---------- | --------------------------------- |
| `textarea` | The slot for the textarea element |

<hr/>

## Exports

| Kind | Name       | Declaration | Module                                          | Package |
| ---- | ---------- | ----------- | ----------------------------------------------- | ------- |
| `js` | `Textarea` | Textarea    | ../packages/components/textarea/src/textarea.ts |         |

# `../packages/components/tooltip/index.ts`:

## Exports

| Kind | Name | Declaration | Module | Package                    |
| ---- | ---- | ----------- | ------ | -------------------------- |
| `js` | `*`  | *           |        | ./src/tooltip.js           |
| `js` | `*`  | *           |        | ./src/tooltip-directive.js |

# `../packages/components/tooltip/register.ts`:

## Exports

| Kind                        | Name         | Declaration | Module                                      | Package |
| --------------------------- | ------------ | ----------- | ------------------------------------------- | ------- |
| `custom-element-definition` | `sl-tooltip` | Tooltip     | /packages/components/tooltip/src/tooltip.js |         |

# `../packages/components/tooltip/src/tooltip-directive.ts`:

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

<hr/>

## Variables

| Name      | Description | Type |
| --------- | ----------- | ---- |
| `tooltip` |             |      |

<hr/>

## Exports

| Kind | Name               | Declaration      | Module                                                  | Package |
| ---- | ------------------ | ---------------- | ------------------------------------------------------- | ------- |
| `js` | `TooltipDirective` | TooltipDirective | ../packages/components/tooltip/src/tooltip-directive.ts |         |
| `js` | `tooltip`          | tooltip          | ../packages/components/tooltip/src/tooltip-directive.ts |         |

# `../packages/components/tooltip/src/tooltip.scss.ts`:

## Exports

| Kind | Name      | Declaration | Module                                             | Package |
| ---- | --------- | ----------- | -------------------------------------------------- | ------- |
| `js` | `default` |             | ../packages/components/tooltip/src/tooltip.scss.ts |         |

# `../packages/components/tooltip/src/tooltip.ts`:

## class: `Tooltip`, `sl-tooltip`

### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

### Static Fields

| Name             | Privacy | Type     | Default | Description                                              | Inherited From |
| ---------------- | ------- | -------- | ------- | -------------------------------------------------------- | -------------- |
| `arrowPadding`   |         | `number` | `16`    | The default padding of the arrow.                        |                |
| `offset`         |         | `number` | `12`    | The default offset of the tooltip to its anchor.         |                |
| `viewportMargin` |         | `number` | `8`     | The default margin between the tooltip and the viewport. |                |

### Static Methods

| Name   | Privacy | Description                                                   | Parameters                                                                      | Return | Inherited From |
| ------ | ------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------ | -------------- |
| `lazy` |         | To attach the `sl-tooltip` to the DOM tree and anchor element | `target: Element, callback: (target: Tooltip) => void, options: TooltipOptions` | `void` |                |

### Fields

| Name       | Privacy | Type                                                                                                                                                                 | Default | Description                                     | Inherited From |
| ---------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------- | -------------- |
| `maxWidth` |         | `number \| undefined`                                                                                                                                                |         | The maximum width of the tooltip.               |                |
| `position` |         | `'top' \| 'right' \| 'bottom' \| 'left' \| 'top-start' \| 'top-end' \| 'right-start' \| 'right-end' \| 'bottom-start' \| 'bottom-end' \| 'left-start' \| 'left-end'` | `'top'` | Position of the tooltip relative to its anchor. |                |

### Attributes

| Name        | Field    | Inherited From |
| ----------- | -------- | -------------- |
| `max-width` | maxWidth |                |
| `position`  | position |                |

### Slots

| Name      | Description                       |
| --------- | --------------------------------- |
| `default` | The slot for the tooltip content. |

<hr/>

## Exports

| Kind | Name      | Declaration | Module                                        | Package |
| ---- | --------- | ----------- | --------------------------------------------- | ------- |
| `js` | `Tooltip` | Tooltip     | ../packages/components/tooltip/src/tooltip.ts |         |
