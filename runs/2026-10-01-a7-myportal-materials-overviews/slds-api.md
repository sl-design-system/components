# SLDS public APIs the A7 run may compose

Extracted mechanically from `packages/components/*/src/*.ts` — `@slot`, `@csspart`, `@cssprop`, exported
class name, and every `@property`. Use this instead of guessing an API. Where a component does not
fit, say so and use plain markup + CSS rather than forcing it.

## `accordion` — `@sl-design-system/accordion`

### `accordion-item.spec.ts`

```

```

### `accordion-item.ts`

```
 * @csspart details - Details element of the accordion-item
 * @csspart summary - Header element of the accordion-item
 * @csspart icon - The icon in the header of the accordion-item
 * @csspart panel - The body of the accordion-item
 * @slot default - Body content for the accordion
 * @slot summary - Header content for the accordion; use this if the `summary` property is not enough
 * @slot summary-extras - Extra content in the header of the accordion item
export class AccordionItem extends LitElement {
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ attribute: 'icon-type', reflect: true }) iconType?: AccordionIconType;
  @property({ type: Boolean, reflect: true }) open?: boolean;
  @property() summary?: string;
```

### `accordion.spec.ts`

```

```

### `accordion.ts`

```
export type AccordionIconType = 'chevron' | 'plusminus';
 * @slot default - The place for multiple `<sl-accordion-item>`
export class Accordion extends LitElement {
  @property({ attribute: 'icon-type' }) iconType?: AccordionIconType = Accordion.iconType;
  @property({ type: Boolean, reflect: true }) single?: boolean;
```

## `avatar` — `@sl-design-system/avatar`

### `avatar.spec.ts`

```

```

### `avatar.ts`

```
export type AvatarColor =
export type AvatarEmphasis = 'subtle' | 'bold';
export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
 * @slot - The subheading of the avatar.
 * @slot badge - The badge to display on the avatar.
 * @slot fallback - The fallback content to display when no picture is set.
 * @csspart avatar - The container for positioning the badge.
 * @csspart initials - The initials to display when no picture is set.
 * @csspart name - The display name, either a `<span>` or `<a>` if `href` is set.
 * @csspart picture - The element containing the image, initials or fallback content.
 * @csspart tooltip - The tooltip that is shown when the display name overflows.
 * @csspart wrapper - The wrapper element around the image and name.
export class Avatar extends ScopedElementsMixin(LitElement) {
  @property({ reflect: true }) color?: AvatarColor;
  @property({ attribute: 'display-initials' }) displayInitials?: string;
  @property({ attribute: 'display-name' }) displayName?: string;
  @property({ reflect: true }) emphasis?: AvatarEmphasis;
  @property() href?: string;
  @property({ type: Boolean, reflect: true, attribute: 'image-only' }) imageOnly?: boolean;
  @property({ attribute: 'picture-url' }) pictureUrl?: string;
  @property({ reflect: true }) shape?: AvatarShape;
  @property({ reflect: true }) size: AvatarSize = 'md';
  @property({ type: Boolean, reflect: true }) vertical?: boolean;
```

## `badge` — `@sl-design-system/badge`

### `badge.spec.ts`

```

```

### `badge.ts`

```
export type BadgeColor =
export type BadgeEmphasis = 'subtle' | 'bold';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant =
 * @slot default - Contents of the badge
export class Badge extends LitElement {
  @property({ reflect: true }) color?: BadgeColor;
  @property({ reflect: true }) emphasis?: BadgeEmphasis;
  @property({ reflect: true }) size?: BadgeSize;
  @property({ reflect: true }) variant?: BadgeVariant;
```

## `breadcrumbs` — `@sl-design-system/breadcrumbs`

### `breadcrumbs.spec.ts`

```

```

### `breadcrumbs.ts`

```
 * @slot default - The breadcrumbs to display.
 * @slot home - Custom home link element.
 * @slot tooltips - Internal slot for tooltip elements managed by the component.
export class Breadcrumbs extends ScopedElementsMixin(LitElement) {
  @property({ type: Boolean, attribute: 'hide-home-label' }) hideHomeLabel =
  @property({ type: Boolean, reflect: true }) inverted?: boolean;
  @property({ attribute: 'home-url' }) homeUrl = Breadcrumbs.homeUrl;
  @property({ type: Boolean, attribute: 'no-home' }) noHome = Breadcrumbs.noHome;
```

## `button` — `@sl-design-system/button`

### `button.spec.ts`

```

```

### `button.ts`

```
export type ButtonFill = 'solid' | 'outline' | 'link' | 'ghost';
export type ButtonShape = 'rect' | 'pill';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'reset' | 'submit';
export type ButtonVariant =
 * @slot - Text label of the button. Optionally an <code>sl-icon</code> can be added
 * @csspart button - The internal <code>&lt;button&gt;</code> element.
 * @csspart tooltip - The tooltip element that is shown when the <code>tooltip</code> attribute is set.
export class Button extends ForwardAriaMixin(
  @property() command?: string;
  @property({ attribute: 'commandfor' }) commandFor?: string;
  @property({ attribute: false }) commandForElement?: Element;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ reflect: true }) fill?: ButtonFill;
  @property({ reflect: true }) shape?: ButtonShape;
  @property({ reflect: true }) size?: ButtonSize;
  @property() tooltip?: string;
  @property() type?: ButtonType;
  @property({ reflect: true }) variant?: ButtonVariant;
```

## `card` — `@sl-design-system/card`

### `card.spec.ts`

```

```

### `card.ts`

```
export type CardOrientation = 'horizontal' | 'vertical';
 * @cssprop --sl-card-media-size - Depending on the orientation, this will set the height or width of the media. Can be set in pixels, percentage or `fr`.
 * @cssprop --sl-card-horizontal-breakpoint - When card is smaller than this size it will switch from horizontal (when set) to vertical layout.
 * @cssprop --sl-card-image-backdrop - Color of the image backdrop when `fit-image` is set.
 * @slot default - Title of the card
 * @slot media - Image of the card.
 * @slot header - Subtitle or badges
 * @slot body - Body text of the card
 * @slot actions - Main actions of the card, these will be displayed at the bottom of the card, This can be a single button or a button-bar.
 * @slot menu-button - A menu button to display additional actions or a toggle button. This will be displayed in the header of the card.
export class Card extends ScopedElementsMixin(LitElement) {
  @property({ reflect: true, attribute: 'fit-image', type: Boolean }) fitImage?: boolean;
  @property({ reflect: true, attribute: 'media-margin', type: Boolean }) mediaMargin?: boolean;
  @property({ reflect: true, attribute: 'image-backdrop', type: Boolean }) imageBackdrop?: boolean;
  @property({ type: Boolean }) subgrid?: boolean;
  @property({ reflect: true }) orientation: CardOrientation = 'horizontal';
```

## `icon` — `@sl-design-system/icon`

### `icon.spec.ts`

```

```

### `icon.ts`

```
export type IconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
 * @cssprop --sl-icon-fill-accent - Accent color, only used for multicolor icons
 * @cssprop --sl-icon-fill-default - Default fill color
 * @cssprop --sl-icon-size - The size of the icon, defaults to md
export class Icon extends LitElement {
  @property() label?: string;
  @property({ reflect: true }) name?: string;
  @property({ reflect: true }) size?: IconSize;
```

### `models.ts`

```
export type IconResolver = (name: string) => string;
export type IconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands' | 'semibold';
export type IconPrefix =
export type IconPathData = string | string[];
```

## `panel` — `@sl-design-system/panel`

### `panel.spec.ts`

```

```

### `panel.ts`

```
export type PanelDensity = 'default' | 'relaxed' | 'plain' | 'comfortable'; // 'plain' and 'comfortable' are deprecated, should be removed in the future
export type PanelElevation = 'none' | 'raised' | 'sunken';
export type TogglePlacement = 'start' | 'end';
 * @csspart header - The header of the panel.
 * @csspart wrapper - The wrapper around the heading.
 * @csspart body - The body of the panel.
 * @csspart inner - The inner container of the panel.
 * @csspart content - The content container of the panel.
 * @csspart titles - The container for the heading.
 * @cssprop --sl-panel-content-padding - The padding for the panel content, e.g. set to 0 to have content without any padding.
 * @slot heading - The panel's heading. Use this if the `heading` property does not suffice.
 * @slot aside - Additional content to show in the header; replaces the button bar.
 * @slot actions - The panel's actions; will slot in a tool bar by default.
 * @slot default - The panel's content.
 * @slot prefix - Content to show before the heading.
 * @slot suffix - Content to show after the heading.
export class Panel extends ScopedElementsMixin(LitElement) {
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;
  @property({ reflect: true }) density?: PanelDensity;
  @property({ type: Boolean, reflect: true }) divider?: boolean;
  @property({ reflect: true }) elevation?: PanelElevation;
  @property() fill: Extract<ButtonFill, 'ghost' | 'outline'> = 'ghost';
  @property() heading?: string;
  @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;
  @property({ reflect: true, attribute: 'toggle-placement' }) togglePlacement?: TogglePlacement;
```

## `search-field` — `@sl-design-system/search-field`

### `search-field.spec.ts`

```

```

### `search-field.ts`

```
export type SlSearchEvent = CustomEvent<string>;
export type SearchFieldShape = 'rect' | 'pill';
export type SearchFieldSize = 'md' | 'lg';
 * @slot input - The slot for the input element
export class SearchField extends TextField {
  @property({ reflect: true }) override shape?: SearchFieldShape;
  @property({ reflect: true }) override size?: SearchFieldSize;
```

---

## Icon availability inside the SLDS components themselves

No `@sl-design-system/*` component imports `@fortawesome/*` at runtime (only `icon.spec.ts` does, and
specs do not run here). Each renders its chrome icons **by name** from the theme registry, so whether
they appear depends on `bingel-dc`'s 34-entry registry:

| component                                                       | icon it renders                      | in `bingel-dc`?                      |
| --------------------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| `sl-breadcrumbs`                                                | `home-blank`, `breadcrumb-separator` | **yes, both**                        |
| `sl-accordion-item`                                             | `chevron-down`                       | **yes**                              |
| `sl-search-field`                                               | `search`                             | **NO** — the magnifier will be blank |
| `sl-badge` / `sl-avatar` / `sl-panel` / `sl-button` / `sl-card` | none of their own                    | n/a                                  |

So composing `sl-breadcrumbs` and `sl-accordion-item` is safe; composing `sl-search-field` costs a
missing magnifier, which is a **theme gap** to record as a Stage 4 discrepancy, not a reason to
hand-draw one.
