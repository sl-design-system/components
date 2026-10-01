# SLDS API snapshot — a3-myportal-digital-exercises

Extracted from `packages/components/*/src/*.ts` on 2026-10-01. Use these exact property/slot/part
names. Anything not listed here must be read from the source before use — do not guess an API.

Available packages: accordion announcer avatar badge breadcrumbs button button-bar calendar callout
card checkbox combobox data-source date-field dialog drawer editor ellipsize-text emoji form
format-date format-number grid icon infotip inline-message link listbox menu message-dialog
number-field paginator panel popover progress-bar radio-group scrollbar search-field select shared
skeleton spinner switch tabs tag text-area text-field time-field toggle-button toggle-group tool-bar
tooltip tree virtual-list

Register an SLDS element with a side-effect import, once per module that renders it:
`import '@sl-design-system/button/register.js';`

| Element                                                              | Properties                                                                                                       | Slots / parts / events                                                                                                                                           |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sl-button`                                                          | `disabled` `fill` `shape` `size` `type` `variant` `tooltip` `command` `commandfor`                               | slot default (label, may contain `sl-icon`); parts `button`, `tooltip`                                                                                           |
| `sl-icon`                                                            | `name` `size` `label`                                                                                            | —                                                                                                                                                                |
| `sl-badge`                                                           | `color` `emphasis` `size` `variant`                                                                              | slot default                                                                                                                                                     |
| `sl-breadcrumbs`                                                     | `no-home` `home-url` `hide-home-label` `inverted`                                                                | slots default, `home`                                                                                                                                            |
| `sl-progress-bar`                                                    | `value` (0-100) `indeterminate` `label` `variant` `color`                                                        | slot default = helper text                                                                                                                                       |
| `sl-tag` / `sl-tag-list`                                             | `disabled` `removable` `size` `variant` `tooltip`                                                                | event `sl-remove`; parts `label`, `button`                                                                                                                       |
| `sl-avatar`                                                          | `display-name` `display-initials` `picture-url` `size` `shape` `color` `emphasis` `href` `image-only` `vertical` | slots default (subheading), `badge`, `fallback`; parts `avatar` `initials` `name` `picture` `wrapper`                                                            |
| `sl-tool-bar` (+ `sl-tool-bar-divider`)                              | `align` `contained` `disabled` `fill` `inverted`                                                                 | slot default; part `wrapper`                                                                                                                                     |
| `sl-menu` / `sl-menu-button` / `sl-menu-item` / `sl-menu-item-group` | `selects` `position` `offset` `emphasis`                                                                         | event `sl-select`; part `menu`                                                                                                                                   |
| `sl-link`                                                            | `fill` `icon-position` `shape` `size` `type` `variant` `no-icon`                                                 | slot default must contain a single `<a>`; part `icon`                                                                                                            |
| `sl-tab-group` / `sl-tab` / `sl-tab-panel`                           | `activation` `align-tabs` `vertical`                                                                             | event `sl-tab-change`; slots default (panels), `tabs`; parts `container` `wrapper` `scroller` `tablist` `panels`                                                 |
| `sl-card`                                                            | `orientation` `fit-image` `media-margin` `image-backdrop` `subgrid`                                              | slots default (title), `media`, `header`, `body`, `actions`, `menu-button`                                                                                       |
| `sl-checkbox` / `sl-checkbox-group`                                  | `checked` `indeterminate` `disabled` `required` `size` `value` `description` `tooltip` `show-valid`              | events `sl-change` `sl-focus` `sl-blur`; parts `outer` `inner` `content` `label` `description`                                                                   |
| `sl-select`                                                          | `value` `placeholder` `clearable` `disabled` `required` `size` `shape` `fill` `show-valid`                       | events `sl-change` `sl-clear` `sl-focus` `sl-blur`; slot default takes `sl-option`/`sl-option-group`; parts `listbox` `selected` `selected-option` `placeholder` |

## Known traps (measured on earlier runs in this batch)

- **`sl-card`'s `setTitle` only inspects direct assigned elements** and force-colours a slotted title
  link with an `!important` rule. Two runs were bitten. For a card with a custom surface (dashed
  border, dimmed/locked state, bespoke media ratio) a plain `<article>` is simpler and correct.
- **`sl-progress-bar` ships the shorthand-trap bug** (`font: var(--sl-text-new-…)` where only
  longhands exist). Do not copy its CSS.
- `sl-icon` renders nothing for a name the theme does not register, and nothing is logged.
