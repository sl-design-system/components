import { css } from 'lit';

export default css`
  /**
   * Copyright 2025 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Copyright 2025 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Copyright 2025 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */
  :host {
    --sl-border-radius-none: 0; /** border.radius.none */
    --sl-border-radius-3xs: 2px; /** border.radius.3xs */
    --sl-border-radius-2xs: 4px; /** border.radius.2xs */
    --sl-border-radius-xs: 6px; /** border.radius.xs */
    --sl-border-radius-sm: 8px; /** border.radius.sm */
    --sl-border-radius-md: 10px; /** border.radius.md */
    --sl-border-radius-lg: 12px; /** border.radius.lg */
    --sl-border-radius-xl: 14px; /** border.radius.xl */
    --sl-border-radius-2xl: 16px;
    --sl-border-radius-3xl: 18px; /** border.radius.3xl */
    --sl-border-radius-full: 50rem; /** border.radius.full */
    --sl-border-width-none: 0px; /** border.width.none */
    --sl-border-width-2xs: 0.5px; /** 2xs */
    --sl-border-width-xs: 1px; /** border.width.xs */
    --sl-border-width-sm: 2px; /** border.width.sm */
    --sl-border-width-md: 3px; /** border.width.md */
    --sl-border-width-lg: 4px; /** border.width.lg */
    --sl-border-width-xl: 5px; /** border.width.xl */
    --sl-border-width-2xl: 6px; /** border.width.2xl */
    --sl-opacity-50: 0.02; /** opacity.50 */
    --sl-opacity-100: 0.04; /** opacity.100 */
    --sl-opacity-150: 0.06; /** opacity.150 */
    --sl-opacity-200: 0.08; /** opacity.200 */
    --sl-opacity-300: 0.12; /** opacity.300 */
    --sl-opacity-400: 0.16; /** opacity.400 */
    --sl-opacity-500: 0.2; /** opacity.500 */
    --sl-opacity-600: 0.32; /** opacity.600 */
    --sl-opacity-700: 0.48; /** opacity.700 */
    --sl-opacity-800: 0.64; /** opacity.800 */
    --sl-opacity-900: 0.8; /** opacity.900 */
    --sl-opacity-1000: 1; /** opacity.1000 */
    --sl-opacity-transparent: 0; /** opacity.transparent */
    --sl-opacity-light-interactive-bold-idle: 0;
    --sl-opacity-light-interactive-bold-hover: 0.2;
    --sl-opacity-light-interactive-bold-active: 0.4;
    --sl-opacity-light-interactive-plain-idle: 0;
    --sl-opacity-light-interactive-plain-hover: 0.15;
    --sl-opacity-light-interactive-plain-active: 0.25;
    --sl-opacity-light-muted: 0;
    --sl-opacity-light-subtlest: 0.1;
    --sl-opacity-light-subtle: 0.2;
    --sl-opacity-light-moderate: 0.8;
    --sl-opacity-light-bold: 1;
    --sl-opacity-interactive-reversed-idle: 0.8;
    --sl-opacity-interactive-reversed-hover: 0.9;
    --sl-opacity-interactive-reversed-active: 1;
    --sl-opacity-dark-interactive-bold-idle: 0;
    --sl-opacity-dark-interactive-bold-hover: 0.2;
    --sl-opacity-dark-interactive-bold-active: 0.4;
    --sl-opacity-dark-interactive-plain-idle: 0;
    --sl-opacity-dark-interactive-plain-hover: 0.25;
    --sl-opacity-dark-interactive-plain-active: 0.35;
    --sl-opacity-dark-muted: 0;
    --sl-opacity-dark-subtlest: 0.25;
    --sl-opacity-dark-subtle: 0.35;
    --sl-opacity-dark-moderate: 0.8;
    --sl-opacity-dark-bold: 1;
    --sl-size-100: 8px;
    --sl-size-125: 10px;
    --sl-size-150: 12px;
    --sl-size-175: 14px;
    --sl-size-200: 16px;
    --sl-size-250: 20px;
    --sl-size-300: 24px;
    --sl-size-350: 28px;
    --sl-size-400: 32px;
    --sl-size-450: 36px;
    --sl-size-500: 40px;
    --sl-size-600: 48px;
    --sl-size-700: 56px;
    --sl-size-800: 64px;
    --sl-size-1000: 80px;
    --sl-size-none: 0px;
    --sl-size-4xs: 2px; /** size.4xs */
    --sl-size-3xs: 4px; /** size.3xs */
    --sl-size-2xs: 8px; /** size.2xs */
    --sl-size-xs: 12px; /** size.xs */
    --sl-size-sm: 14px; /** size.sm */
    --sl-size-md: 16px; /** size.md */
    --sl-size-lg: 20px; /** size.lg */
    --sl-size-xl: 24px; /** size.xl */
    --sl-size-2xl: 32px; /** size.2xl */
    --sl-size-3xl: 48px; /** size.3xl */
    --sl-size-4xl: 64px; /** size.4xl */
    --sl-size-icon-3xs: 5px;
    --sl-size-icon-2xs: 10px;
    --sl-size-dialog-min: 400px; /** size.input.md */
    --sl-size-dialog-max: 960px; /** size.input.lg */
    --sl-size-dialog-full: 100%; /** size.input.lg */
    --sl-size-dialog-message-mobile-min: 300px; /** size.input.md */
    --sl-size-avatar-lg: 40px;
    --sl-size-avatar-xl: 52px;
    --sl-size-avatar-3xl: 80px;
    --sl-size-avatar-4xl: 160px;
    --sl-size-paginator-page-button-min-width: 40px; /** we are using a raw value, needs to be changed to a token in the future */
    --sl-size-paginator-select-min-width: 80px; /** we are using a raw value, needs to be changed to a token in the future */
    --sl-size-010: 1px;
    --sl-size-025: 2px;
    --sl-size-050: 4px;
    --sl-size-075: 6px;
    --sl-size-full: 999px;
    --sl-size-borderRadius-full: 50rem; /** Use for pill-shaped elements like badges, and circular rounding for components with equal width and height, such as icon buttons and avatars. */
    --sl-size-outlineOffset-default: 3px;
    --sl-size-tabbar-vertical-maxwidth: 200px;
    --sl-size-accordion-icon-height: 28px;
    --sl-space-2xs: 2px; /** space.2xs */
    --sl-space-xs: 4px; /** space.xs */
    --sl-space-sm: 8px; /** space.sm */
    --sl-space-md: 12px; /** space.md */
    --sl-space-lg: 16px; /** space.lg */
    --sl-space-xl: 24px; /** space.xl */
    --sl-space-2xl: 30px; /** space.2xl */
    --sl-space-3xl: 40px; /** space.3xl */
    --sl-space-dialog-message-mobile-container-inline: 100%;
    --sl-space-badge-icon-inline-lg: 1px;
    --sl-space-badge-icon-block-lg: 1px;
    --sl-space-badge-label-inline-md: 3px;
    --sl-space-badge-label-inline-lg: 3px;
    --sl-space-badge-label-inline-xl: 3px;
    --sl-text-typeset-fontFamily-heading: the-message;
    --sl-text-typeset-fontFamily-body: roboto;
    --sl-text-typeset-font-weight-icon-thin: 100; /** text.typeset.fontWeight.icon-thin */
    --sl-text-typeset-font-weight-icon-light: 300; /** text.typeset.fontWeight.icon-light */
    --sl-text-typeset-font-weight-icon-regular: 400; /** text.typeset.fontWeight.icon-regular */
    --sl-text-typeset-font-weight-icon-solid: solid; /** text.typeset.fontWeight.icon-solid */
    --sl-text-typeset-fontWeight-regular: 400;
    --sl-text-typeset-fontWeight-demibold: 500;
    --sl-text-typeset-font-weight-bold: 700; /** text.typeset.fontWeight.bold */
    --sl-text-typeset-font-size-xs: 10px; /** text.typeset.fontSize.xs */
    --sl-text-typeset-font-size-sm: 12px; /** text.typeset.fontSize.sm */
    --sl-text-typeset-font-size-md: 14px; /** text.typeset.fontSize.md */
    --sl-text-typeset-font-size-lg: 16px; /** text.typeset.fontSize.lg */
    --sl-text-typeset-font-size-xl: 18px; /** text.typeset.fontSize.xl */
    --sl-text-typeset-font-size-2xl: 24px; /** text.typeset.fontSize.2xl */
    --sl-text-typeset-font-size-3xl: 32px; /** text.typeset.fontSize.3xl */
    --sl-text-typeset-font-size-4xl: 48px; /** text.typeset.fontSize.4xl */
    --sl-text-typeset-font-size-5xl: 54px; /** text.typeset.fontSize.5xl */
    --sl-text-typeset-line-height-xxs: 12px; /** text.typeset.lineHeight.xs */
    --sl-text-typeset-line-height-xs: 14px; /** text.typeset.lineHeight.xs */
    --sl-text-typeset-line-height-sm: 16px; /** text.typeset.lineHeight.sm */
    --sl-text-typeset-line-height-md: 20px; /** text.typeset.lineHeight.md */
    --sl-text-typeset-line-height-lg: 24px; /** text.typeset.lineHeight.lg */
    --sl-text-typeset-line-height-xl: 28px; /** text.typeset.lineHeight.xl */
    --sl-text-typeset-line-height-2xl: 34px; /** text.typeset.lineHeight.2xl */
    --sl-text-typeset-line-height-3xl: 42px; /** text.typeset.lineHeight.3xl */
    --sl-text-typeset-line-height-4xl: 58px; /** text.typeset.lineHeight.4xl */
    --sl-text-typeset-line-height-5xl: 64px; /** text.typeset.lineHeight.5xl */
    --sl-text-typeset-paragraph-spacing-none: 0; /** text.typeset.paragraphSpacing.none */
    --sl-text-typeset-paragraph-spacing-xs: 14px; /** text.typeset.paragraphSpacing.xs */
    --sl-text-typeset-paragraph-spacing-sm: 18px; /** text.typeset.paragraphSpacing.sm */
    --sl-text-typeset-paragraph-spacing-md: 22px; /** text.typeset.paragraphSpacing.md */
    --sl-text-typeset-paragraph-spacing-lg: 24px; /** text.typeset.paragraphSpacing.lg */
    --sl-text-typeset-paragraph-spacing-xl: 28px; /** text.typeset.paragraphSpacing.xl */
    --sl-text-typeset-paragraph-spacing-2xl: 34px; /** text.typeset.paragraphSpacing.2xl */
    --sl-text-typeset-paragraph-spacing-3xl: 42px; /** text.typeset.paragraphSpacing.3xl */
    --sl-text-typeset-paragraph-spacing-4xl: 58px; /** text.typeset.paragraphSpacing.4xl */
    --sl-text-typeset-paragraph-spacing-5xl: 64px; /** text.typeset.paragraphSpacing.5xl */
    --sl-text-typeset-text-decoration-none: none; /** text.typeset.textDecoration.none */
    --sl-text-typeset-text-decoration-underline: underline; /** text.typeset.textDecoration.underline */
    --sl-text-typeset-text-decoration-strikethrough: strikethrough; /** text.typeset.textDecoration.strikethrough */
    --sl-text-typeset-text-case-none: none; /** text.typeset.textCase.none */
    --sl-text-typeset-text-case-uppercase: uppercase; /** text.typeset.textCase.uppercase */
    --sl-text-typeset-text-case-lowercase: lowercase; /** text.typeset.textCase.lowercase */
    --sl-text-typeset-text-case-capitalize: capitalize; /** text.typeset.textCase.capitalize */
    --sl-text-typeset-letter-spacing-none: 0em; /** text.typeset.letterSpacing.none */
    --sl-text-typeset-letter-spacing-xs: -0.02em; /** text.typeset.letterSpacing.xs */
    --sl-text-typeset-letter-spacing-sm: -0.01em; /** text.typeset.letterSpacing.sm */
    --sl-text-typeset-letter-spacing-md: 0em; /** text.typeset.letterSpacing.md */
    --sl-text-typeset-letter-spacing-lg: 0.01em; /** text.typeset.letterSpacing.lg */
    --sl-text-typeset-letter-spacing-xl: 0.02em; /** text.typeset.letterSpacing.xl */
    --sl-text-text-field: [object object];
    --sl-icon-font-family-classic: font-awesome-6-pro;
    --sl-icon-font-family-sharp: font-awesome-6-sharp;
    --sl-icon-core-angle-down: angle-down; /** icon.core.angle-down */
    --sl-icon-core-breadcrumb-separator: slash-forward; /** icon.core.breadcrumb-separator */
    --sl-icon-core-calendar: calendar; /** icon.core.calendar */
    --sl-icon-core-caret-down-solid: caret-down; /** icon.core.caret-down-solid */
    --sl-icon-core-caret-left-solid: caret-left; /** icon.core.caret-left-solid */
    --sl-icon-core-caret-right-solid: caret-right; /** icon.core.caret-right-solid */
    --sl-icon-core-check: check; /** icon.core.check */
    --sl-icon-core-check-solid: check; /** icon.core.check-solid */
    --sl-icon-core-chevron-down: chevron-down; /** icon.core.chevron-down */
    --sl-icon-core-chevron-left: chevron-left; /** icon.core.chevron-left */
    --sl-icon-core-chevron-right: chevron-right; /** icon.core.chevron-right */
    --sl-icon-core-circle-check-solid: circle-check; /** icon.core.circle-check-solid */
    --sl-icon-core-circle-exclamation-solid: circle-exclamation; /** icon.core.circle-exclamation-solid */
    --sl-icon-core-circle-solid: circle; /** icon.core.circle */
    --sl-icon-core-circle-xmark: circle-xmark; /** icon.core.circle-xmark */
    --sl-icon-core-circle-xmark-solid: circle-xmark; /** icon.core.circle-xmark-solid */
    --sl-icon-core-dash-solid: dash; /** icon.core.dash-solid */
    --sl-icon-core-diamond-exclamation-solid: diamond-exclamation; /** icon.core.diamond-exclamation-solid */
    --sl-icon-core-ellipsis: ellipsis; /** icon.core.ellipsis */
    --sl-icon-core-ellipsis-vertical: ellipsis-vertical; /** icon.core.ellipsis-vertical */
    --sl-icon-core-face-smile: face-smile; /** icon.core.face-smile */
    --sl-icon-core-fav: star; /** icon.core.fav */
    --sl-icon-core-grip-lines: grip-lines; /** icon.core.grip-lines */
    --sl-icon-core-home-blank: home-blank; /** icon.core.home-blank */
    --sl-icon-core-menu: bars; /** icon.core.menu */
    --sl-icon-core-minus: minus; /** icon.core.minus */
    --sl-icon-core-octagon-exclamation-solid: octagon-exclamation; /** icon.core.octagon-exclamation-solid */
    --sl-icon-core-pinata: pinata; /** icon.core.pinata */
    --sl-icon-core-pinata-solid: pinata; /** icon.core.pinata */
    --sl-icon-core-plus: plus; /** icon.core.plus */
    --sl-icon-core-search: magnifying-glass; /** icon.core.search */
    --sl-icon-core-triangle-exclamation-solid: triangle-exclamation; /** icon.core.triangle-exclamation-solid */
    --sl-icon-core-xmark: xmark; /** icon.core.xmark */
    --sl-icon-typeset-font-size-2xs: 10px; /** icon.typeset.fontSize.xs */
    --sl-icon-typeset-fontFamily-classic: 16px 'Font Awesome 6 Pro';
    --sl-icon-typeset-fontFamily-sharp: 16px 'Font Awesome 6 Sharp';
    --sl-icon-typeset-fontWeight-icon-thin: 100;
    --sl-icon-typeset-fontWeight-icon-light: 300;
    --sl-icon-typeset-fontWeight-icon-regular: 400;
    --sl-icon-typeset-fontWeight-icon-solid: solid;
    --sl-animation-duration-fast: 90ms; /** animation.duration.fast */
    --sl-animation-duration-normal: 200ms; /** animation.duration.normal */
    --sl-animation-duration-slow: 500ms; /** animation.duration.slow */
    --sl-animation-easing-ease-in-out: ease-in-out; /** animation.easing.ease-in-out */
    --sl-flex-direction-column: column;
    --sl-flex-direction-column-reverse: column-reverse;
    --sl-flex-direction-row-reverse: row-reverse;
    --sl-flex-direction-row: row;
    --sl-justify-content-start: start;
    --sl-justify-content-space-between: space-between;
    --sl-justify-content-end: end;
    --sl-space-new-toggleButton-nonActive-sm: 23px;
    --sl-space-new-toggleButton-nonActive-md: 35px;
    --sl-space-new-toggleButton-nonActive-lg: 36px;
    --sl-color-black: #000;
    --sl-color-white: #fff;
    --sl-color-transparant: rgb(0 0 0 / 0%);
    --sl-color-palette-primary-50: #fefefe; /** color.palette.primary.50 */
    --sl-color-palette-primary-100: #eaeaea; /** color.palette.primary.100 */
    --sl-color-palette-primary-150: #d5d5d5; /** color.palette.primary.150 */
    --sl-color-palette-primary-200: #bcbcbc; /** color.palette.primary.200 */
    --sl-color-palette-primary-300: #a2a1a1; /** color.palette.primary.300 */
    --sl-color-palette-primary-400: #898989; /** color.palette.primary.400 */
    --sl-color-palette-primary-500: #737373; /** color.palette.primary.500 */
    --sl-color-palette-primary-600: #605f5f; /** color.palette.primary.600 */
    --sl-color-palette-primary-700: #4e4e4e; /** color.palette.primary.700 */
    --sl-color-palette-primary-800: #3e3d3d; /** color.palette.primary.800 */
    --sl-color-palette-primary-900: #262626; /** color.palette.primary.900 */
    --sl-color-palette-primary-base: #222; /** color.palette.primary.base */
    --sl-color-palette-accent-50: #edf2fc; /** color.palette.accent.50 */
    --sl-color-palette-accent-100: #e0eaff; /** color.palette.accent.100 */
    --sl-color-palette-accent-150: #ccdbff; /** color.palette.accent.150 */
    --sl-color-palette-accent-200: #9ebaff; /** color.palette.accent.200 */
    --sl-color-palette-accent-300: #5985ff; /** color.palette.accent.300 */
    --sl-color-palette-accent-500: #2351db; /** color.palette.accent.500 */
    --sl-color-palette-accent-600: #1138ad; /** color.palette.accent.600 */
    --sl-color-palette-accent-700: #09298e; /** color.palette.accent.700 */
    --sl-color-palette-accent-800: #00175f; /** color.palette.accent.800 */
    --sl-color-palette-accent-900: #000d33; /** color.palette.accent.900 */
    --sl-color-palette-accent-base: #36f; /** color.palette.accent.base */
    --sl-color-palette-neutral-50: #f3f3f3; /** color.palette.neutral.50 */
    --sl-color-palette-neutral-100: #eaeaea; /** color.palette.neutral.100 */
    --sl-color-palette-neutral-150: #d5d5d5; /** color.palette.neutral.150 */
    --sl-color-palette-neutral-200: #bcbcbc; /** color.palette.neutral.200 */
    --sl-color-palette-neutral-300: #a2a1a1; /** color.palette.neutral.300 */
    --sl-color-palette-neutral-400: #898989; /** color.palette.neutral.400 */
    --sl-color-palette-neutral-500: #737373; /** color.palette.neutral.500 */
    --sl-color-palette-neutral-600: #605f5f; /** color.palette.neutral.600 */
    --sl-color-palette-neutral-700: #4e4e4e; /** color.palette.neutral.700 */
    --sl-color-palette-neutral-800: #3e3d3d; /** color.palette.neutral.800 */
    --sl-color-palette-neutral-900: #2e2e2e; /** color.palette.neutral.900 */
    --sl-color-palette-neutral-base: #222; /** color.palette.neutral.base */
    --sl-color-palette-info-50: #f0f5ff; /** color.palette.info.50 */
    --sl-color-palette-info-100: #e0eaff; /** color.palette.info.100 */
    --sl-color-palette-info-150: #ccdbff; /** color.palette.info.150 */
    --sl-color-palette-info-200: #9ebaff; /** color.palette.info.200 */
    --sl-color-palette-info-300: #5985ff; /** color.palette.info.300 */
    --sl-color-palette-info-500: #2351db; /** color.palette.info.500 */
    --sl-color-palette-info-600: #1138ad; /** color.palette.info.600 */
    --sl-color-palette-info-700: #09298e; /** color.palette.info.700 */
    --sl-color-palette-info-800: #00175f; /** color.palette.info.800 */
    --sl-color-palette-info-900: #000d33; /** color.palette.info.900 */
    --sl-color-palette-info-base: #36f; /** color.palette.info.base */
    --sl-color-palette-success-50: #ebf5ee; /** color.palette.success.50 */
    --sl-color-palette-success-100: #d7f5e1; /** color.palette.success.100 */
    --sl-color-palette-success-150: #aeebc4;
    --sl-color-palette-success-200: #70e09d; /** color.palette.success.200 */
    --sl-color-palette-success-400: #39b26c; /** color.palette.success.400 */
    --sl-color-palette-success-500: #28854e; /** color.palette.success.500 */
    --sl-color-palette-success-600: #1b6137; /** color.palette.success.600 */
    --sl-color-palette-success-700: #114224; /** color.palette.success.700 */
    --sl-color-palette-success-800: #0b331a; /** color.palette.success.800 */
    --sl-color-palette-success-900: #082613; /** color.palette.success.900 */
    --sl-color-palette-success-base: #45cc80; /** color.palette.success.base */
    --sl-color-palette-warning-50: #fffdf9; /** color.palette.warning.50 */
    --sl-color-palette-warning-100: #fff8e8; /** color.palette.warning.100 */
    --sl-color-palette-warning-150: #ffefcb; /** color.palette.warning.150 */
    --sl-color-palette-warning-200: #ffe2a3; /** color.palette.warning.200 */
    --sl-color-palette-warning-300: #ffd170; /** color.palette.warning.300 */
    --sl-color-palette-warning-400: #ffae00; /** color.palette.warning.400 */
    --sl-color-palette-warning-500: #c70; /** color.palette.warning.500 */
    --sl-color-palette-warning-600: #a66100; /** color.palette.warning.600 */
    --sl-color-palette-warning-700: #804b00; /** color.palette.warning.700 */
    --sl-color-palette-warning-800: #593400; /** color.palette.warning.800 */
    --sl-color-palette-warning-900: #331e00; /** color.palette.warning.900 */
    --sl-color-palette-warning-base: #ffae00; /** color.palette.warning.base */
    --sl-color-palette-danger-50: #ffedeb; /** color.palette.danger.50 */
    --sl-color-palette-danger-100: #ffd6d1; /** color.palette.danger.100 */
    --sl-color-palette-danger-150: #ffbcb8; /** color.palette.danger.150 */
    --sl-color-palette-danger-200: #ff8e8a; /** color.palette.danger.200 */
    --sl-color-palette-danger-400: #e5454a; /** color.palette.danger.400 */
    --sl-color-palette-danger-500: #c73434; /** color.palette.danger.500 */
    --sl-color-palette-danger-600: #992224; /** color.palette.danger.600 */
    --sl-color-palette-danger-700: #6b1313; /** color.palette.danger.700 */
    --sl-color-palette-danger-800: #470d0d; /** color.palette.danger.800 */
    --sl-color-palette-danger-900: #260808; /** color.palette.danger.900 */
    --sl-color-palette-danger-base: #ff575c; /** color.palette.danger.base */
    --sl-color-palette-black-base: #222; /** color.palette.black.base */
    --sl-color-palette-white-base: #fefefe; /** color.palette.white.base */
    --sl-color-palette-transparent-base: rgb(0 0 0 / 0%); /** color.palette.transparent.base */
    --sl-border-width-input-none: var(--sl-border-width-none); /** border.width.button.default */
    --sl-border-width-input-option: var(--sl-border-width-xs); /** border.width.button.outline */
    --sl-border-width-focusring-default: var(--sl-border-width-sm);
    --sl-border-width-focusring-inside: var(--sl-border-width-xs);
    --sl-border-width-focusring-offset: var(--sl-border-width-sm);
    --sl-border-width-dialog-default: var(--sl-border-width-none);
    --sl-border-width-divider: var(--sl-border-width-xs);
    --sl-border-width-tooltip-none: var(--sl-border-width-none); /** border.width.button.default */
    --sl-border-width-tooltip-border: var(--sl-border-width-xs); /** border.width.button.outline */
    --sl-border-width-popover-none: var(--sl-border-width-none); /** border.width.button.default */
    --sl-border-width-popover-border: var(--sl-border-width-xs); /** border.width.button.outline */
    --sl-border-width-inline-message-start: var(--sl-border-width-lg);
    --sl-border-width-border-tab: var(--sl-border-width-xs);
    --sl-border-width-border-tabbar: var(--sl-border-width-xs);
    --sl-border-width-card-border: var(--sl-border-width-xs);
    --sl-border-width-slds-checklist: var(--sl-border-width-xs);
    --sl-opacity-spinner-shadow: var(--sl-opacity-600);
    --sl-size-input-option-sm: var(--sl-size-lg);
    --sl-size-input-option-md: var(--sl-size-xl); /** size.input.md */
    --sl-size-input-option-lg: var(--sl-size-2xl); /** size.input.lg */
    --sl-size-input-switch-handle-sm: calc(
      var(--sl-size-md) - (2 * var(--sl-space-input-switch-padding-controller))
    ); /** size.input.md */
    --sl-size-input-switch-handle-md: calc(
      var(--sl-size-xl) - (2 * var(--sl-space-input-switch-padding-controller))
    ); /** size.input.md */
    --sl-size-input-switch-handle-lg: calc(
      var(--sl-size-2xl) - (2 * var(--sl-space-input-switch-padding-controller))
    ); /** size.input.md */
    --sl-size-input-switch-controller-height-sm: var(--sl-size-md); /** size.switch.controller.sm */
    --sl-size-input-switch-controller-height-md: var(--sl-size-xl); /** size.switch.controller.md */
    --sl-size-input-switch-controller-height-lg: var(--sl-size-2xl); /** size.switch.controller.lg */
    --sl-size-input-switch-controller-width-sm: var(--sl-size-2xl); /** size.switch.controller.sm */
    --sl-size-input-switch-controller-width-md: var(--sl-size-3xl); /** size.switch.controller.md */
    --sl-size-input-switch-controller-width-lg: var(--sl-size-4xl); /** size.switch.controller.lg */
    --sl-size-icon-xs: var(--sl-size-xs);
    --sl-size-icon-sm: var(--sl-size-sm);
    --sl-size-icon-md: var(--sl-size-md);
    --sl-size-icon-lg: var(--sl-size-lg);
    --sl-size-icon-xl: var(--sl-size-xl);
    --sl-size-icon-2xl: var(--sl-size-2xl);
    --sl-size-icon-3xl: var(--sl-size-3xl);
    --sl-size-icon-4xl: var(--sl-size-4xl);
    --sl-size-button-icon-container-icon-only-sm: var(--sl-size-md);
    --sl-size-button-icon-container-icon-only-md: var(--sl-size-md);
    --sl-size-button-icon-container-icon-only-lg: var(--sl-size-xl);
    --sl-size-button-icon-container-inline-sm: var(--sl-size-xs);
    --sl-size-button-icon-container-inline-md: var(--sl-size-sm);
    --sl-size-button-icon-container-inline-lg: var(--sl-size-md);
    --sl-size-badge-sm: var(--sl-size-2xs);
    --sl-size-badge-md: var(--sl-size-md);
    --sl-size-badge-lg: var(--sl-size-lg);
    --sl-size-avatar-sm: var(--sl-size-xl);
    --sl-size-avatar-md: var(--sl-size-2xl);
    --sl-size-avatar-2xl: var(--sl-size-4xl);
    --sl-size-avatar-badge-sm: var(--sl-size-2xs);
    --sl-size-avatar-badge-md: var(--sl-size-md);
    --sl-size-avatar-badge-lg: var(--sl-size-lg);
    --sl-size-skeleton-min-height: var(--sl-size-2xs);
    --sl-size-spinner-xs: var(--sl-size-xs);
    --sl-size-spinner-sm: var(--sl-size-sm);
    --sl-size-spinner-md: var(--sl-size-md);
    --sl-size-spinner-lg: var(--sl-size-lg);
    --sl-size-spinner-xl: var(--sl-size-xl);
    --sl-size-spinner-2xl: var(--sl-size-2xl);
    --sl-size-spinner-3xl: var(--sl-size-3xl);
    --sl-size-spinner-4xl: var(--sl-size-4xl);
    --sl-size-breadcrumb: var(--sl-size-2xl);
    --sl-size-tab-indicator: var(--sl-size-4xs);
    --sl-size-progressbar: var(--sl-size-3xs);
    --sl-size-tag-md: var(--sl-size-xl);
    --sl-size-tag-lg: var(--sl-size-2xl);
    --sl-size-font-150: var(--sl-size-150);
    --sl-size-font-175: var(--sl-size-175);
    --sl-size-font-200: var(--sl-size-200);
    --sl-size-font-250: var(--sl-size-250);
    --sl-size-font-300: var(--sl-size-300);
    --sl-size-font-400: var(--sl-size-400);
    --sl-size-font-500: var(--sl-size-500);
    --sl-size-font-600: var(--sl-size-600);
    --sl-size-font-800: var(--sl-size-800);
    --sl-size-font-1000: var(--sl-size-1000);
    --sl-size-lineHeight-150: var(--sl-size-150);
    --sl-size-lineHeight-175: var(--sl-size-175);
    --sl-size-lineHeight-200: var(--sl-size-200);
    --sl-size-lineHeight-250: var(--sl-size-250);
    --sl-size-lineHeight-300: var(--sl-size-300);
    --sl-size-lineHeight-400: var(--sl-size-400);
    --sl-size-lineHeight-500: var(--sl-size-500);
    --sl-size-lineHeight-600: var(--sl-size-600);
    --sl-size-lineHeight-800: var(--sl-size-800);
    --sl-size-lineHeight-1000: var(--sl-size-1000);
    --sl-size-borderRadius-none: var(--sl-size-none);
    --sl-size-borderRadius-sm: var(--sl-size-025);
    --sl-size-borderRadius-md: var(--sl-size-050);
    --sl-size-borderRadius-lg: var(--sl-size-100);
    --sl-size-borderRadius-xl: var(--sl-size-150);
    --sl-size-borderRadius-default: var(
      --sl-border-radius-2xs
    ); /** The standard border radius for most components. Use for elements that need subtle rounding without emphasizing their shape. */
    --sl-size-borderRadius-child: calc(
      var(--sl-border-radius-2xs) / 2
    ); /** The standard border radius for most components. Use for elements that need subtle rounding without emphasizing their shape. */
    --sl-size-borderWidth-subtle: var(
      --sl-size-010
    ); /** A subtle border, applied to UI elements where subtle emphasis is needed. */
    --sl-size-borderWidth-bold: var(--sl-size-025); /** A bold border, applied to UI elements that need to stand out. */
    --sl-size-borderWidth-heavy: var(
      --sl-size-050
    ); /** A heavy border for impactful elements where heavy emphasis is needed. */
    --sl-size-borderWidth-none: var(
      --sl-size-none
    ); /** A heavy border for impactful elements where heavy emphasis is needed. */
    --sl-size-select-indicator: var(--sl-size-3xs);
    --sl-size-inline-message-start: var(--sl-size-3xs);
    --sl-space-100: var(--sl-size-100);
    --sl-space-125: var(--sl-size-125);
    --sl-space-150: var(--sl-size-150);
    --sl-space-175: var(--sl-size-175);
    --sl-space-200: var(--sl-size-200);
    --sl-space-250: var(--sl-size-250);
    --sl-space-300: var(--sl-size-300);
    --sl-space-400: var(--sl-size-400);
    --sl-space-500: var(--sl-size-500);
    --sl-space-600: var(--sl-size-600);
    --sl-space-700: var(--sl-size-700);
    --sl-space-800: var(--sl-size-800);
    --sl-space-1000: var(--sl-size-1000);
    --sl-space-none: var(--sl-size-none);
    --sl-border-width-button-solid: var(--sl-conceptual-border-width-default); /** border.width.button.solid */
    --sl-space-button-solid-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.block.sm */
    --sl-space-button-solid-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.block.md */
    --sl-space-button-solid-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.block.lg */
    --sl-space-button-solid-inline-sm: calc(
      var(--sl-space-lg) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.inline.sm */
    --sl-space-button-solid-inline-md: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.inline.md */
    --sl-space-button-solid-inline-lg: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.inline.lg */
    --sl-space-button-solid-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-solid));
    --sl-space-button-solid-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-solid));
    --sl-space-button-solid-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-solid));
    --sl-space-button-outline-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.block.sm */
    --sl-space-button-outline-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.block.md */
    --sl-space-button-outline-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.block.lg */
    --sl-space-button-outline-inline-sm: calc(
      var(--sl-space-lg) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.inline.sm */
    --sl-space-button-outline-inline-md: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.inline.md */
    --sl-space-button-outline-inline-lg: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.inline.lg */
    --sl-space-button-outline-inline-text-only-md: var(--sl-space-2xl);
    --sl-space-button-outline-inline-text-only-lg: var(--sl-space-2xl);
    --sl-space-button-outline-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-outline));
    --sl-space-button-outline-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-outline));
    --sl-space-button-outline-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-outline));
    --sl-space-button-ghost-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.block.sm */
    --sl-space-button-ghost-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.block.md */
    --sl-space-button-ghost-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.block.lg */
    --sl-space-button-ghost-inline-sm: calc(
      var(--sl-space-lg) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.inline.sm */
    --sl-space-button-ghost-inline-md: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.inline.md */
    --sl-space-button-ghost-inline-lg: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.inline.lg */
    --sl-space-button-ghost-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-ghost));
    --sl-space-button-ghost-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-ghost));
    --sl-space-button-ghost-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-ghost));
    --sl-space-button-gap-sm: var(--sl-space-xs); /** 4px */
    --sl-space-button-gap-md: var(--sl-space-xs); /** 4px */
    --sl-space-button-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-button-link-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-link)
    ); /** space.button.solid.block.sm */
    --sl-space-button-link-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-link)
    ); /** space.button.solid.block.md */
    --sl-space-button-link-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-link)
    ); /** space.button.solid.block.lg */
    --sl-space-button-link-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-link));
    --sl-space-button-link-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-link));
    --sl-space-button-link-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-link));
    --sl-space-input-option-block-md: var(--sl-space-xs); /** space.button.solid.block.md */
    --sl-space-input-option-block-lg: var(--sl-space-xs); /** space.button.solid.block.lg */
    --sl-space-input-option-gap-sm: var(--sl-space-sm); /** 4px */
    --sl-space-input-option-gap-md: var(--sl-space-sm); /** 4px */
    --sl-space-input-option-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-input-text-field-block-md: calc(
      var(--sl-space-xs) + var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.block.md */
    --sl-space-input-text-field-block-lg: calc(
      var(--sl-space-sm) - var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.block.lg */
    --sl-space-input-text-field-inline-md: calc(
      var(--sl-space-md) - var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.inline.md */
    --sl-space-input-text-field-inline-lg: calc(
      var(--sl-space-lg) - var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.inline.lg */
    --sl-space-input-text-field-gap-md: var(--sl-space-sm); /** 4px */
    --sl-space-input-text-field-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-input-helper-gap-sm: var(--sl-space-xs); /** 4px */
    --sl-space-input-helper-gap-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-helper-gap-lg: var(--sl-space-xs); /** 8px */
    --sl-space-input-helper-padding-top-sm: var(--sl-space-xs); /** 4px */
    --sl-space-input-helper-padding-top-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-helper-padding-top-lg: var(--sl-space-xs); /** 8px */
    --sl-space-input-field-label-gap-sm: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-gap-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-input-field-label-icon-md: var(--sl-space-2xs); /** 4px */
    --sl-space-input-field-label-icon-lg: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-padding-bottom-sm: var(--sl-space-sm); /** 4px */
    --sl-space-input-field-label-padding-bottom-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-padding-bottom-lg: var(--sl-space-sm); /** 4px */
    --sl-space-input-switch-padding-container: var(--sl-space-xs); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-controller: var(--sl-space-2xs); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-top-sm: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-top-md: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-top-lg: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-left: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-md: var(--sl-space-xs); /** space.switch.padding.outer */
    --sl-space-dialog-desktop-container-padding-top: var(--sl-space-xl); /** space.dialog.desktop.container.paddingTop */
    --sl-space-dialog-desktop-container-inline: var(--sl-space-xl); /** space.dialog.desktop.container.inline */
    --sl-space-dialog-desktop-container-padding-bottom: var(
      --sl-space-xl
    ); /** space.dialog.desktop.container.paddingBottom */
    --sl-space-dialog-desktop-body-block: var(--sl-space-xl); /** space.dialog.desktop.body.block */
    --sl-space-dialog-desktop-body-inline: var(--sl-space-xl); /** space.dialog.desktop.body.inline */
    --sl-space-dialog-desktop-body-gap: var(--sl-space-xl); /** space.dialog.desktop.body.gap */
    --sl-space-dialog-mobile-container-padding-top: calc(var(--sl-space-xl) * 2); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-body-block: var(--sl-space-lg); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-body-inline: var(--sl-space-lg); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-body-gap: var(--sl-space-lg); /** space.button.solid.block.md */
    --sl-space-dialog-subtitle-padding-bottom: var(--sl-space-xs); /** space.button.solid.block.md */
    --sl-space-dialog-message-mobile-container-padding-left: var(--sl-space-xl);
    --sl-space-dialog-message-mobile-container-padding-right: var(--sl-space-xl);
    --sl-space-button-bar-gap-default-block: var(--sl-space-sm);
    --sl-space-button-bar-gap-ghost-icon-block: var(--sl-space-xs);
    --sl-space-group-sm: var(--sl-space-2xs);
    --sl-space-group-md: var(--sl-space-xs);
    --sl-space-group-lg: var(--sl-space-sm);
    --sl-space-group-xl: var(--sl-space-sm);
    --sl-space-select-listbox-block-lg: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-select-listbox-block-md: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-select-listbox-inline-lg: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-select-listbox-inline-md: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-select-listbox-gap-lg: var(--sl-space-xs);
    --sl-space-select-listbox-gap-md: var(--sl-space-xs);
    --sl-space-select-divider-block-lg: var(--sl-space-sm);
    --sl-space-select-divider-block-md: var(--sl-space-sm);
    --sl-space-select-divider-inline-lg: var(--sl-space-md);
    --sl-space-select-divider-inline-md: var(--sl-space-md);
    --sl-space-select-divider-gap-lg: var(--sl-space-sm);
    --sl-space-select-divider-gap-md: var(--sl-space-sm);
    --sl-space-select-divider-line-lg: var(--sl-space-sm);
    --sl-space-select-divider-line-md: var(--sl-space-sm);
    --sl-space-tooltip-block: var(--sl-space-sm); /** space.button.solid.block.md */
    --sl-space-tooltip-inline: var(--sl-space-sm); /** space.button.solid.inline.md */
    --sl-space-tooltip-gap: var(--sl-space-xs);
    --sl-space-tooltip-offset: var(--sl-space-xs);
    --sl-space-tooltip-arrow-offset: var(--sl-space-sm);
    --sl-space-badge-inline-sm: var(--sl-space-2xs);
    --sl-space-badge-inline-md: var(--sl-space-sm);
    --sl-space-badge-inline-lg: var(--sl-space-sm);
    --sl-space-badge-block-sm: var(--sl-space-2xs);
    --sl-space-badge-block-md: var(--sl-space-2xs);
    --sl-space-badge-block-lg: var(--sl-space-2xs);
    --sl-space-badge-gap-sm: var(--sl-space-2xs);
    --sl-space-badge-gap-md: var(--sl-space-xs);
    --sl-space-badge-gap-lg: var(--sl-space-xs);
    --sl-space-badge-icon-inline-xl: var(--sl-space-2xs);
    --sl-space-badge-icon-block-xl: var(--sl-space-2xs);
    --sl-space-badge-label-inline-2xs: var(--sl-space-2xs);
    --sl-space-badge-label-inline-xs: var(--sl-space-2xs);
    --sl-space-badge-label-inline-sm: var(--sl-space-2xs);
    --sl-space-avatar-inline-sm: var(--sl-space-sm);
    --sl-space-avatar-inline-md: var(--sl-space-sm);
    --sl-space-avatar-inline-lg: var(--sl-space-lg);
    --sl-space-avatar-inline-xl: var(--sl-space-lg);
    --sl-space-avatar-inline-2xl: var(--sl-space-lg);
    --sl-space-avatar-inline-3xl: var(--sl-space-lg);
    --sl-space-avatar-block-sm: var(--sl-space-sm);
    --sl-space-avatar-block-md: var(--sl-space-sm);
    --sl-space-avatar-block-lg: var(--sl-space-sm);
    --sl-space-avatar-block-xl: var(--sl-space-sm);
    --sl-space-avatar-block-2xl: var(--sl-space-sm);
    --sl-space-avatar-block-3xl: var(--sl-space-sm);
    --sl-space-avatar-badge-inset-sm: calc(var(--sl-space-2xs) * -1);
    --sl-space-avatar-badge-inset-lg: calc(var(--sl-space-xs) * -1);
    --sl-space-avatar-badge-inset-xl: calc(var(--sl-space-2xs) * -1);
    --sl-space-avatar-badge-inset-2xl: calc(var(--sl-space-2xs) * -1);
    --sl-space-avatar-badge-inset-3xl: var(--sl-space-2xs);
    --sl-space-avatar-badge-inset-4xl: calc(var(--sl-space-md) + 2px);
    --sl-space-avatar-badge-margin: var(--sl-space-2xs);
    --sl-space-popover-block: var(--sl-space-sm); /** space.button.solid.block.md */
    --sl-space-popover-inline: var(--sl-space-md); /** space.button.solid.inline.md */
    --sl-space-popover-gap: var(--sl-space-xs); /** space.popover.gap */
    --sl-space-popover-offset: var(--sl-space-xs);
    --sl-space-popover-links-gap: var(--sl-space-sm);
    --sl-space-popover-links-block: var(--sl-space-xs);
    --sl-space-popover-arrow-offset: var(--sl-space-lg);
    --sl-space-inline-message-block: var(--sl-space-md); /** space.inline-message.block.md */
    --sl-space-inline-message-inline-start: calc(
      var(--sl-space-lg) + var(--sl-size-inline-message-start)
    ); /** space.inline-message.inline.start */
    --sl-space-inline-message-inline-end: var(--sl-space-md); /** space.inline-message.inline.end */
    --sl-space-inline-message-gap: var(--sl-space-lg);
    --sl-space-inline-message-content-gap: var(--sl-space-xs);
    --sl-space-tab-inline: var(--sl-space-xl);
    --sl-space-tab-block: var(--sl-space-md);
    --sl-space-tab-gap: var(--sl-space-sm);
    --sl-space-tab-more-inline: var(--sl-space-md);
    --sl-space-tab-more-block: var(--sl-space-sm);
    --sl-space-tab-content-horizontal-inline: var(--sl-space-xl);
    --sl-space-tab-content-horizontal-block: var(--sl-space-xl);
    --sl-space-tab-content-horizontal-gap: var(--sl-space-xl);
    --sl-space-tab-content-vertical-inline: var(--sl-space-xl);
    --sl-space-tab-content-vertical-block: var(--sl-space-sm);
    --sl-space-tab-content-vertical-gap: var(--sl-space-xl);
    --sl-space-card-media-margins: var(--sl-space-sm);
    --sl-space-card-content-inline: var(--sl-space-xl);
    --sl-space-card-content-block: var(--sl-space-xl);
    --sl-space-card-vertical-block: var(--sl-space-xl);
    --sl-space-card-horizontal-block: var(--sl-space-xl);
    --sl-space-card-slotheader-badges-block: var(--sl-space-xs);
    --sl-space-card-slotheader-badges-gap: var(--sl-space-sm);
    --sl-space-card-gap-content-inline: var(--sl-space-sm);
    --sl-space-card-gap-content-block: var(--sl-space-lg);
    --sl-space-menu-container-block: var(--sl-space-sm);
    --sl-space-menu-container-inline: var(--sl-space-sm);
    --sl-space-menu-container-gap: var(--sl-space-xs);
    --sl-space-menu-item-block: var(--sl-space-sm);
    --sl-space-menu-item-inline: var(--sl-space-sm);
    --sl-space-menu-item-gap: var(--sl-space-sm);
    --sl-space-breadcrumb-gap-full: var(--sl-space-lg);
    --sl-space-breadcrumb-gap-short: var(--sl-space-sm);
    --sl-space-breadcrumb-gap-home: var(--sl-space-xs);
    --sl-space-form-gap: var(--sl-space-xl);
    --sl-space-progressbar-vertical-gap: var(--sl-space-sm);
    --sl-space-progressbar-horizontal-gap: var(--sl-space-lg);
    --sl-space-tag-block-md: var(--sl-space-xs); /** space.button.solid.block.md */
    --sl-space-tag-block-lg: var(--sl-space-sm); /** space.button.solid.block.lg */
    --sl-space-tag-inline-md: var(--sl-space-sm); /** space.button.solid.inline.md */
    --sl-space-tag-inline-lg: var(--sl-space-md); /** space.button.solid.inline.lg */
    --sl-space-tag-gap-md: var(--sl-space-sm); /** 4px */
    --sl-space-tag-gap-lg: var(--sl-space-md); /** 8px */
    --sl-space-tag-list-md: var(--sl-space-xs);
    --sl-space-tag-list-lg: calc(var(--sl-space-xs) + var(--sl-space-2xs));
    --sl-space-paginator-gap: var(--sl-space-sm);
    --sl-space-010: var(--sl-size-010);
    --sl-space-025: var(--sl-size-025);
    --sl-space-050: var(--sl-size-050);
    --sl-space-075: var(--sl-size-075);
    --sl-space-full: var(--sl-size-full);
    --sl-space-accordion-content-inline: var(--sl-space-3xl);
    --sl-space-accordion-content-block: var(--sl-space-lg);
    --sl-space-accordion-title-inline: var(--sl-space-sm);
    --sl-space-accordion-title-block: var(--sl-space-lg);
    --sl-space-accordion-title-gap: var(--sl-space-sm);
    --sl-space-accordion-inline: var(--sl-space-3xl);
    --sl-space-accordion-block: var(--sl-space-lg);
    --sl-space-accordion-gap: var(--sl-space-md);
    --sl-text-typeset-fontFamily-icon: var(--sl-icon-typeset-fontFamily-classic); /** text.typeset.fontFamily.fontIcon */
    --sl-text-badge-text-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body);
    --sl-text-badge-text-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-dialog-message-mobile-heading: var(--sl-text-typeset-fontWeight-demibold)
      var(--sl-icon-typeset-font-size-md) / var(--sl-text-typeset-line-height-md)
      var(--sl-text-typeset-fontFamily-heading);
    --sl-text-dialog-message-mobile-subheading: var(--sl-text-typeset-fontWeight-demibold)
      var(--sl-icon-typeset-font-size-sm) / var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body);
    --sl-text-dialog-heading: var(--sl-text-typeset-fontWeight-demibold) var(--sl-icon-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-fontFamily-heading);
    --sl-text-dialog-subheading: var(--sl-text-typeset-fontWeight-demibold) var(--sl-icon-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-initials-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-xs) /
      var(--sl-text-typeset-line-height-xs) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-initials-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-initials-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-initials-xl: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-initials-2xl: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-2xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-initials-3xl: var(--sl-text-typeset-fontWeight-demibold) var(--sl-icon-typeset-font-size-2xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-initials-4xl: var(--sl-text-typeset-fontWeight-demibold) var(--sl-icon-typeset-font-size-4xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-header-sm: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-header-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-header-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-header-xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-header-2xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-header-3xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-header-4xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-icon-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-subheader-sm: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-subheader-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-sm) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-subheader-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-subheader-xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-subheader-2xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-subheader-3xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-avatar-subheader-4xl: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-heading-0: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-4xl) /
      var(--sl-text-typeset-line-height-4xl) var(--sl-text-typeset-fontFamily-heading); /** text.typeset.heading.0 */
    --sl-text-heading-1: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-3xl) /
      var(--sl-text-typeset-line-height-3xl) var(--sl-text-typeset-fontFamily-heading); /** text.typeset.heading.1 */
    --sl-text-heading-2: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-2xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-fontFamily-heading); /** text.typeset.heading.2 */
    --sl-text-heading-3: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-fontFamily-heading); /** text.typeset.heading.3 */
    --sl-text-heading-4: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-heading); /** text.typeset.heading.4 */
    --sl-text-body-sm-normal: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.sm.normal */
    --sl-text-body-sm-demibold: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.sm.demibold */
    --sl-text-body-sm-bold: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.sm.bold */
    --sl-text-body-md-normal: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.md.normal */
    --sl-text-body-md-demibold: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.md.demibold */
    --sl-text-body-md-bold: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.md.bold */
    --sl-text-body-lg-normal: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.lg.normal */
    --sl-text-body-lg-demibold: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.lg.demibold */
    --sl-text-body-lg-bold: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** text.typeset.body.lg.bold */
    --sl-text-tab-title: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-tab-subtitle: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-list-sm-normal: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-text-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-text-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-text-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-font-icon-sm: var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-xxs) sans-serif;
    --sl-text-button-font-icon-md: var(--sl-text-typeset-line-height-xs) / var(--sl-text-typeset-font-size-md) sans-serif;
    --sl-text-button-font-icon-lg: var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-sm) sans-serif;
    --sl-text-button-link-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-idle-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-idle-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-idle-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-hover-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-hover-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-hover-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-active-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-active-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-active-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-disabled-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      16px var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-disabled-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      16px var(--sl-text-typeset-fontFamily-body);
    --sl-text-button-link-disabled-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      24px var(--sl-text-typeset-fontFamily-body);
    --sl-text-breadcrumb-link: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-breadcrumb-current: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-breadcrumb-disabled: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-tooltip-text-tip: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-tooltip-text-title: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body);
    --sl-text-slds-checklist-heading: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-fontFamily-heading);
    --sl-text-slds-checklist-body: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body);
    --sl-text-slds-checklist-listitem: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body);
    --sl-text-input-text-field-font-icon-md: var(--sl-text-typeset-font-weight-icon-solid) 15px /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-icon);
    --sl-text-input-text-field-text-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-text-field-text-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body);
    --sl-text-input-option-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** Is use in Radio and Checkbox */
    --sl-text-input-option-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** Is use in Radio and Checkbox */
    --sl-text-input-field-label-label-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-label-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-label-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-input-field-label-hint-sm: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-hint-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-hint-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-input-helper-text-sm: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-helper-text-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-helper-text-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-input-switch-input-field-regular-sm: var(--sl-text-typeset-fontWeight-regular)
      var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-switch-input-field-regular-md: var(--sl-text-typeset-fontWeight-regular)
      var(--sl-text-typeset-font-size-lg) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-switch-input-field-regular-lg: var(--sl-text-typeset-fontWeight-regular)
      var(--sl-text-typeset-font-size-xl) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-input-switch-input-field-bold-sm: var(--sl-text-typeset-fontWeight-demibold)
      var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-switch-input-field-bold-md: var(--sl-text-typeset-fontWeight-demibold)
      var(--sl-text-typeset-font-size-lg) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-switch-input-field-bold-lg: var(--sl-text-typeset-fontWeight-demibold)
      var(--sl-text-typeset-font-size-xl) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-select-selectbox-text-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-select-selectbox-text-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-fontFamily-body);
    --sl-text-select-selectbox-title-md: var(--sl-text-typeset-fontWeight-regular)
      var(--sl-text-typeset-line-height-xxs) / var(--sl-icon-typeset-font-size-xs) var(--sl-text-typeset-fontFamily-body);
    --sl-text-select-selectbox-title-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-line-height-xs) /
      var(--sl-icon-typeset-font-size-sm) var(--sl-text-typeset-fontFamily-body);
    --sl-text-popover-text-text: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-popover-text-title: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-sm: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-idle-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-idle-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-idle-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-hover-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-hover-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-hover-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-active-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-active-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-active-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-disabled-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-disabled-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-href-disabled-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-accordion-title: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-fontFamily-heading);
    --sl-text-accordion-body: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-text-tag-label-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-body);
    --sl-text-tag-label-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-body);
    --sl-icon-typeset-font-size-xs: var(--sl-size-xs); /** icon.typeset.fontSize.xs */
    --sl-icon-typeset-font-size-sm: var(--sl-size-sm); /** icon.typeset.fontSize.sm */
    --sl-icon-typeset-font-size-md: var(--sl-size-md); /** icon.typeset.fontSize.md */
    --sl-icon-typeset-font-size-lg: var(--sl-size-lg); /** icon.typeset.fontSize.lg */
    --sl-icon-typeset-font-size-xl: var(--sl-size-xl); /** icon.typeset.fontSize.xl */
    --sl-icon-typeset-font-size-2xl: var(--sl-size-2xl); /** icon.typeset.fontSize.2xl */
    --sl-icon-typeset-font-size-3xl: var(--sl-size-3xl); /** icon.typeset.fontSize.3xl */
    --sl-icon-typeset-font-size-4xl: var(--sl-size-4xl); /** icon.typeset.fontSize.4xl */
    --sl-icon-typeset-fontWeight-regular: var(--sl-icon-typeset-fontWeight-icon-regular);
    --sl-icon-typeset-fontWeight-solid: var(--sl-icon-typeset-fontWeight-icon-solid);
    --sl-icon-style-outline: var(--sl-text-typeset-font-weight-icon-regular);
    --sl-icon-style-solid: var(--sl-text-typeset-font-weight-icon-solid);
    --sl-animation-button-duration: var(--sl-animation-duration-normal); /** animation.button.duration */
    --sl-animation-button-easing: var(--sl-animation-easing-ease-in-out); /** animation.button.easing */
    --sl-button-label-sm: var(--sl-text-typeset-line-height-sm);
    --sl-button-label-md: var(--sl-text-typeset-line-height-sm);
    --sl-button-label-lg: var(--sl-text-typeset-line-height-lg);
    --sl-elevation-shadow-sm:
      0 0 6px 0 rgb(34 34 34 / var(--sl-opacity-50)), 0 2px 4px 0 rgb(34 34 34 / var(--sl-opacity-200));
    --sl-elevation-shadow-md:
      0 0 4px 0 rgb(34 34 34 / var(--sl-opacity-50)), 0 4px 8px 0 rgb(34 34 34 / var(--sl-opacity-150));
    --sl-elevation-shadow-lg:
      0 0 4px 0 rgb(34 34 34 / var(--sl-opacity-100)), 0 8px 16px 0 rgb(34 34 34 / var(--sl-opacity-200));
    --sl-elevation-shadow-none: var(--sl-opacity-transparent) 0 0 0 rgb(34 34 34 / 0%);
    --sl-box-shadow-slds-checklist:
      0 0 4px 0 rgb(34 34 34 / var(--sl-opacity-50)), 0 4px 8px 0 rgb(34 34 34 / var(--sl-opacity-150));
    --sl-border-radius-focusring-full: var(--sl-border-radius-full);
    --sl-border-radius-button-sm: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-md: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-lg: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-icon-only-sm: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-icon-only-md: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-icon-only-lg: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-default: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-circle: var(--sl-border-radius-full); /** borderRadius.button */
    --sl-border-radius-checkbox: var(--sl-border-radius-3xs);
    --sl-border-radius-dialog-mobile: var(--sl-border-radius-none);
    --sl-border-radius-select-listbox: var(--sl-border-radius-2xs);
    --sl-border-radius-select-item: var(--sl-border-radius-3xs);
    --sl-border-radius-select-indicator: var(--sl-border-radius-3xs);
    --sl-border-radius-badge-full: var(--sl-border-radius-full);
    --sl-border-radius-slds-checklist: var(--sl-border-radius-2xl);
    --sl-size-new-icon-xs: var(--sl-size-150);
    --sl-size-new-icon-sm: var(--sl-size-175);
    --sl-size-new-icon-md: var(--sl-size-200);
    --sl-size-new-icon-lg: var(--sl-size-250);
    --sl-size-new-icon-xl: var(--sl-size-300);
    --sl-size-new-icon-2xl: var(--sl-size-400);
    --sl-size-new-icon-3xl: var(--sl-size-600);
    --sl-size-new-icon-4xl: var(--sl-size-800);
    --sl-color-palette-accent-400: var(--sl-color-palette-accent-base); /** color.palette.accent.400 */
    --sl-color-palette-info-400: var(--sl-color-palette-info-base); /** color.palette.info.400 */
    --sl-color-palette-success-300: var(--sl-color-palette-success-base); /** color.palette.success.300 */
    --sl-color-palette-danger-300: var(--sl-color-palette-danger-base); /** color.palette.danger.300 */
    --sl-conceptual-border-width-default: var(--sl-border-width-xs); /** Conceptual Theme Border Token */
    --sl-component-button-lg: [object object];
    --sl-component-button-md: [object object];
    --sl-dialog-header-flex-direction: var(--sl-flex-direction-column);
    --sl-dialog-footer-flex-direction: var(--sl-flex-direction-row);
    --sl-dialog-footer-justify-content: var(--sl-justify-content-end);
    --sl-text-case-badge-text-transform: var(--sl-text-typeset-text-case-uppercase);
    --sl-text-new-body-sm: var(--sl-text-typeset-fontWeight-regular) var(--sl-size-text-body-sm) / 16px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-body-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-size-text-body-md) / 20px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-body-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-size-text-body-lg) / 24px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-input-md: var(--sl-size-text-body-md) / 24px var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-input-lg: var(--sl-size-text-body-md) / 32px var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-icon-outline: var(--sl-icon-typeset-fontWeight-icon-regular) 16px var(--sl-icon-font-family-classic);
    --sl-text-new-icon-solid: var(--sl-icon-typeset-fontWeight-icon-solid) 16px var(--sl-icon-font-family-classic);
    --sl-text-new-heading-sm: var(--sl-text-typeset-fontWeight-demibold) var(--sl-size-text-heading-sm) / 20px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-heading-md: var(--sl-text-typeset-fontWeight-demibold) var(--sl-size-text-heading-md) / 20px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-heading-lg: var(--sl-text-typeset-fontWeight-demibold) var(--sl-size-text-heading-lg) / 32px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-heading-xl: var(--sl-text-typeset-fontWeight-demibold) var(--sl-size-text-heading-xl) / 40px
      var(--sl-text-typeset-fontFamily-body);
    --sl-text-new-heading-2xl: var(--sl-text-typeset-fontWeight-demibold) var(--sl-size-text-heading-2xl) / 48px
      var(--sl-text-typeset-fontFamily-body);
    --sl-border-width-button-outline: var(--sl-conceptual-border-width-default); /** border.width.button.outline */
    --sl-border-width-button-ghost: var(--sl-conceptual-border-width-default); /** border.width.button.ghost */
    --sl-border-width-button-link: var(--sl-conceptual-border-width-default); /** border.width.button.link */
    --sl-border-width-select-listbox: var(--sl-conceptual-border-width-default); /** border.width.button.default */
    --sl-border-width-input-border: var(--sl-conceptual-border-width-default); /** border.width.button.outline */
    --sl-border-width-inline-message-default: var(--sl-conceptual-border-width-default);
    --sl-size-input-option-checkbox-icon-sm: var(--sl-size-icon-xs);
    --sl-size-input-option-checkbox-icon-md: var(--sl-size-icon-md); /** size.input.md */
    --sl-size-input-option-checkbox-icon-lg: var(--sl-size-icon-lg); /** size.input.lg */
    --sl-size-icon-font-xs: var(--sl-size-new-icon-xs);
    --sl-size-icon-font-sm: var(--sl-size-new-icon-sm);
    --sl-size-icon-font-md: var(--sl-size-new-icon-md);
    --sl-size-icon-font-lg: var(--sl-size-new-icon-lg);
    --sl-size-icon-font-xl: var(--sl-size-new-icon-xl);
    --sl-size-icon-font-2xl: var(--sl-size-new-icon-2xl);
    --sl-size-icon-font-3xl: var(--sl-size-new-icon-3xl);
    --sl-size-icon-font-4xl: var(--sl-size-new-icon-4xl);
    --sl-size-tag-counter: calc(var(--sl-border-radius-default) + var(--sl-border-radius-default));
    --sl-size-borderRadius-focusRing-outside: calc(
      var(--sl-size-borderRadius-default) + 2
    ); /** Use for focusring outside of component */
    --sl-size-borderRadius-focusRing-inside: calc(
      var(--sl-size-borderRadius-default) - 1
    ); /** Use for focusring inside of component when outside focus ring is not possible */
    --sl-size-borderWidth-default: var(
      --sl-size-borderWidth-subtle
    ); /** Sets the standard border width for UI elements. */
    --sl-size-borderWidth-action: var(
      --sl-size-borderWidth-subtle
    ); /** Sets the standard border width for action components. */
    --sl-size-borderWidth-focusRing: var(--sl-size-borderWidth-bold);
    --sl-size-outlineWidth-default: var(
      --sl-size-borderWidth-bold
    ); /** Sets the standard outline width for UI elements. */
    --sl-size-text-body-sm: var(--sl-size-font-150);
    --sl-size-text-body-md: var(--sl-size-font-175); /** default text size for body */
    --sl-size-text-body-lg: var(--sl-size-font-200);
    --sl-size-text-heading-sm: var(--sl-size-font-175);
    --sl-size-text-heading-md: var(--sl-size-font-200);
    --sl-size-text-heading-lg: var(--sl-size-font-300);
    --sl-size-text-heading-xl: var(--sl-size-font-400);
    --sl-size-text-heading-2xl: var(--sl-size-font-600);
    --sl-space-button-link-inline-sm: var(--sl-space-none); /** space.button.solid.inline.sm */
    --sl-space-button-link-inline-md: var(--sl-space-none); /** space.button.solid.inline.md */
    --sl-space-button-link-inline-lg: var(--sl-space-none); /** space.button.solid.inline.lg */
    --sl-space-input-option-block-sm: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-input-option-inline-sm: var(--sl-space-none); /** space.button.solid.inline.md */
    --sl-space-input-option-inline-md: var(--sl-space-none); /** space.button.solid.inline.md */
    --sl-space-input-option-inline-lg: var(--sl-space-none); /** space.button.solid.inline.lg */
    --sl-space-input-helper-padding-top-none: var(--sl-space-none); /** 8px */
    --sl-space-input-field-label-gap-none: var(--sl-space-none); /** 8px */
    --sl-space-input-field-label-padding-bottom-none: var(--sl-space-none); /** 8px */
    --sl-space-input-switch-padding-row-sm: calc(
      var(--sl-space-input-switch-margin-left) + var(--sl-size-input-switch-controller-width-sm) +
        (var(--sl-space-input-switch-padding-container) * 2)
    ); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-row-md: calc(
      var(--sl-space-input-switch-margin-left) + var(--sl-size-input-switch-controller-width-md) +
        (var(--sl-space-input-switch-padding-container) * 2)
    ); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-row-lg: calc(
      var(--sl-space-input-switch-margin-left) + var(--sl-size-input-switch-controller-width-lg) +
        (var(--sl-space-input-switch-padding-container) * 2)
    ); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-row-none: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-gap: var(--sl-space-none); /** space.input.switch.padding.gap */
    --sl-space-input-switch-margin-top-none: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-sm: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-lg: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-none: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-dialog-mobile-container-inline: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-container-padding-bottom: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-dialog-gap-header: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-button-bar-gap-default-inline: var(--sl-space-button-bar-gap-default-block);
    --sl-space-button-bar-gap-ghost-icon-inline: var(--sl-space-button-bar-gap-ghost-icon-block);
    --sl-space-select-selectbox-block-md: var(--sl-space-input-text-field-block-md); /** space.button.solid.block.md */
    --sl-space-select-selectbox-block-lg: var(--sl-space-input-text-field-block-lg); /** space.button.solid.block.lg */
    --sl-space-select-selectbox-inline-md: var(--sl-space-input-text-field-inline-md); /** space.button.solid.inline.md */
    --sl-space-select-selectbox-inline-lg: var(--sl-space-input-text-field-inline-lg); /** space.button.solid.inline.lg */
    --sl-space-select-selectbox-gap-md: var(--sl-space-input-text-field-gap-md); /** 4px */
    --sl-space-select-selectbox-gap-lg: var(--sl-space-input-text-field-gap-lg); /** 8px */
    --sl-space-select-item-block-md: var(--sl-space-input-text-field-block-md); /** space.button.solid.block.md */
    --sl-space-select-item-block-lg: var(--sl-space-input-text-field-block-lg); /** space.button.solid.block.lg */
    --sl-space-select-item-inline-md: var(--sl-space-input-text-field-inline-md); /** space.button.solid.inline.md */
    --sl-space-select-item-inline-lg: var(--sl-space-input-text-field-inline-lg); /** space.button.solid.inline.lg */
    --sl-space-select-item-gap-md: var(--sl-space-input-text-field-gap-md); /** 4px */
    --sl-space-select-item-gap-lg: var(--sl-space-input-text-field-gap-lg); /** 8px */
    --sl-space-badge-icon-inline-2xs: var(--sl-space-none);
    --sl-space-badge-icon-inline-xs: var(--sl-space-none);
    --sl-space-badge-icon-inline-sm: var(--sl-space-none);
    --sl-space-badge-icon-inline-md: var(--sl-space-none);
    --sl-space-badge-icon-block-2xs: var(--sl-space-none);
    --sl-space-badge-icon-block-xs: var(--sl-space-none);
    --sl-space-badge-icon-block-sm: var(--sl-space-none);
    --sl-space-badge-icon-block-md: var(--sl-space-none);
    --sl-space-avatar-badge-inset-md: var(--sl-space-none);
    --sl-space-card-media-full: var(--sl-space-none);
    --sl-space-card-vertical-inline: var(--sl-space-none);
    --sl-space-card-vertical-gap: var(--sl-space-none);
    --sl-space-card-horizontal-inline: var(--sl-space-none);
    --sl-space-card-horizontal-gap: var(--sl-space-none);
    --sl-space-card-slotheader-badges-inline: var(--sl-space-none);
    --sl-space-card-gap-header-inline: var(--sl-space-none);
    --sl-space-card-gap-header-block: var(--sl-space-none);
    --sl-space-tag-counter-gap: calc(-1 * var(--sl-border-radius-default) / 2);
    --sl-space-focus-gap: calc(var(--sl-border-width-focusring-default) + var(--sl-border-width-focusring-offset));
    --sl-space-offset-focused: var(--sl-space-025); /** Defines the spacing applied when an element is focused. */
    --sl-space-offset-default: var(--sl-space-075); /** Defines the standard spacing offset. */
    --sl-text-avatar-icon-sm: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-md)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-avatar-icon-md: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-lg)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-avatar-icon-lg: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-xl)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-avatar-icon-xl: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-2xl)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-avatar-icon-2xl: var(--sl-icon-style-outline) var(--sl-icon-typeset-font-size-2xl)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-avatar-icon-3xl: var(--sl-icon-style-outline) var(--sl-icon-typeset-font-size-2xl)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-avatar-icon-4xl: var(--sl-icon-style-outline) var(--sl-icon-typeset-font-size-4xl)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-input-text-field-font-icon-lg: var(--sl-text-typeset-font-weight-icon-solid) 18px /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-icon);
    --sl-text-input-helper-font-icon-md: var(--sl-text-typeset-font-weight-icon-solid) 15px /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-icon);
    --sl-text-input-helper-font-icon-lg: var(--sl-text-typeset-font-weight-icon-solid) 15px /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-icon);
    --sl-text-icon-font-icon-sm: var(--sl-text-typeset-fontWeight-regular) var(--sl-icon-typeset-font-size-xs)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-icon-font-icon-md: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-md)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-icon-font-icon-lg: var(--sl-text-typeset-fontWeight-regular) var(--sl-text-typeset-font-size-lg)
      var(--sl-text-typeset-fontFamily-icon);
    --sl-text-card-title: var(--sl-text-heading-3);
    --sl-text-card-subtitle: var(--sl-text-body-lg-normal);
    --sl-text-card-body: var(--sl-text-body-md-normal);
    --sl-text-tag-close-md: var(--sl-text-typeset-font-weight-icon-solid) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-fontFamily-icon);
    --sl-text-tag-close-lg: var(--sl-text-typeset-font-weight-icon-solid) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-fontFamily-icon);
    --sl-elevation-shadow-overflow: 0 0 15px 0 rgb(var(--sl-elevation-surface-shadow), var(--sl-opacity-subtlest)); /** Use to create a shadow when the content scrolls under other content. */
    --sl-elevation-shadow-overlay:
      0 6px 12px -3px rgb(var(--sl-elevation-surface-shadow), 4%),
      0 6px 18px 0 rgb(var(--sl-elevation-surface-shadow), 12%); /** Use for the box shadow of elements that sit on top of the UI, such as dialogs, cards, menus and drawers. */
    --sl-border-radius-focusring-default: calc(var(--sl-border-radius-default) + 1px);
    --sl-border-radius-focusring-inside: calc(var(--sl-border-radius-default) - 1px);
    --sl-border-radius-focusring-checkbox: calc(var(--sl-border-radius-checkbox) - 1px);
    --sl-border-radius-popover-default: var(--sl-border-radius-default); /** borderRadius.button */
    --sl-border-radius-dialog-desktop: var(--sl-border-radius-default);
    --sl-border-radius-avatar-square: var(--sl-border-radius-default);
    --sl-border-radius-inline-message-default: var(--sl-border-radius-default); /** borderRadius.button */
    --sl-border-radius-skeleton-default: var(--sl-border-radius-default);
    --sl-border-radius-card-default: var(--sl-border-radius-default);
    --sl-border-radius-card-image-margin: var(--sl-border-radius-default);
    --sl-space-new-none: var(--sl-space-none);
    --sl-space-new-2xs: var(--sl-space-025);
    --sl-space-new-xs: var(--sl-space-050);
    --sl-space-new-sm: var(--sl-space-075); /** Use when components are 'besties' */
    --sl-space-new-md: var(--sl-space-100); /** Use when components are 'family' */
    --sl-space-new-lg: var(--sl-space-200); /** Use when components are 'casual friends' */
    --sl-space-new-xl: var(--sl-space-300); /** Use when components are 'acquaintances' */
    --sl-space-new-2xl: var(--sl-space-400); /** Use when components are 'strangers' */
    --sl-space-new-3xl: var(--sl-space-800);
    --sl-space-new-grid-vertical: var(--sl-space-175);
    --sl-space-new-grid-horizontal: var(--sl-space-200);
    --sl-space-new-input-vertical: calc(var(--sl-space-new-xs) - var(--sl-size-010));
    --sl-space-new-input-horizontal: calc(var(--sl-space-new-md) - var(--sl-size-010));
  }

  @media (prefers-color-scheme: light) {
    :host {
      --sl-opacity-interactive-reversed-idle: 0.8;
      --sl-opacity-interactive-reversed-hover: 0.9;
      --sl-opacity-interactive-reversed-active: 1;
      --sl-opacity-interactive-bold-idle: 0;
      --sl-opacity-interactive-bold-hover: 0.2;
      --sl-opacity-interactive-bold-active: 0.4;
      --sl-opacity-interactive-plain-idle: 0;
      --sl-opacity-interactive-plain-hover: 0.15;
      --sl-opacity-interactive-plain-active: 0.25;
      --sl-opacity-muted: 0;
      --sl-opacity-subtlest: 0.1;
      --sl-opacity-subtle: 0.2;
      --sl-opacity-moderate: 0.8;
      --sl-opacity-bold: 1;
      --sl-color-palette-blue-100: #d9e5ff;
      --sl-color-palette-blue-150: #bcd2ff;
      --sl-color-palette-blue-200: #8eb6ff;
      --sl-color-palette-blue-300: #598eff;
      --sl-color-palette-blue-400: #36f;
      --sl-color-palette-blue-500: #1b43f5;
      --sl-color-palette-blue-600: #142fe1;
      --sl-color-palette-blue-700: #1727b6;
      --sl-color-palette-blue-800: #19288f;
      --sl-color-palette-blue-900: #141a57;
      --sl-color-palette-blue-050: #eef4ff;
      --sl-color-palette-green-100: #d3f8de;
      --sl-color-palette-green-150: #abefc3;
      --sl-color-palette-green-200: #75e0a1;
      --sl-color-palette-green-300: #45cc80;
      --sl-color-palette-green-400: #1aaf60;
      --sl-color-palette-green-500: #0d8e4c;
      --sl-color-palette-green-600: #0b7140;
      --sl-color-palette-green-700: #0b5a34;
      --sl-color-palette-green-800: #0a4a2c;
      --sl-color-palette-green-900: #042a19;
      --sl-color-palette-green-050: #edfcf2;
      --sl-color-palette-grey-100: #f0f2f5;
      --sl-color-palette-grey-150: #e0e6ea;
      --sl-color-palette-grey-200: #dae0e7;
      --sl-color-palette-grey-300: #d0d9e0;
      --sl-color-palette-grey-400: #c8d1da;
      --sl-color-palette-grey-500: #818b98;
      --sl-color-palette-grey-600: #59636e;
      --sl-color-palette-grey-700: #393f46;
      --sl-color-palette-grey-800: #25292f;
      --sl-color-palette-grey-900: #222;
      --sl-color-palette-grey-050: #f6f8fa;
      --sl-color-palette-grey-000: #fff;
      --sl-color-palette-orange-100: #fff0d4;
      --sl-color-palette-orange-150: #ffdda8;
      --sl-color-palette-orange-200: #ffc471;
      --sl-color-palette-orange-300: #ff9d33;
      --sl-color-palette-orange-400: #fe8211;
      --sl-color-palette-orange-500: #ef6707;
      --sl-color-palette-orange-600: #c64c08;
      --sl-color-palette-orange-700: #9d3d0f;
      --sl-color-palette-orange-800: #7e3410;
      --sl-color-palette-orange-900: #441706;
      --sl-color-palette-orange-050: #fff8ed;
      --sl-color-palette-purple-100: #ece7ff;
      --sl-color-palette-purple-150: #d9d2ff;
      --sl-color-palette-purple-200: #bfaeff;
      --sl-color-palette-purple-300: #9f80ff;
      --sl-color-palette-purple-400: #824dff;
      --sl-color-palette-purple-500: #7b33ff;
      --sl-color-palette-purple-600: #6616eb;
      --sl-color-palette-purple-700: #5512c5;
      --sl-color-palette-purple-800: #4711a1;
      --sl-color-palette-purple-900: #29076e;
      --sl-color-palette-purple-050: #f4f2ff;
      --sl-color-palette-red-100: #ffe1e2;
      --sl-color-palette-red-150: #ffc7c9;
      --sl-color-palette-red-200: #ffa0a3;
      --sl-color-palette-red-300: #ff575c;
      --sl-color-palette-red-400: #f83b41;
      --sl-color-palette-red-500: #e51d23;
      --sl-color-palette-red-600: #c11419;
      --sl-color-palette-red-700: #a01418;
      --sl-color-palette-red-800: #84181b;
      --sl-color-palette-red-900: #480709;
      --sl-color-palette-red-050: #fff1f1;
      --sl-color-palette-teal-100: #c5fffa;
      --sl-color-palette-teal-150: #8bfff5;
      --sl-color-palette-teal-200: #4afef0;
      --sl-color-palette-teal-300: #15ece2;
      --sl-color-palette-teal-400: #00d0c9;
      --sl-color-palette-teal-500: #00a8a5;
      --sl-color-palette-teal-600: #008080;
      --sl-color-palette-teal-700: #066769;
      --sl-color-palette-teal-800: #0a5757;
      --sl-color-palette-teal-900: #003235;
      --sl-color-palette-teal-050: #eefffc;
      --sl-color-palette-yellow-100: #fff7c5;
      --sl-color-palette-yellow-150: #fff085;
      --sl-color-palette-yellow-200: #ffe146;
      --sl-color-palette-yellow-300: #ffcf1b;
      --sl-color-palette-yellow-400: #ffae00;
      --sl-color-palette-yellow-500: #e28400;
      --sl-color-palette-yellow-600: #bb5c02;
      --sl-color-palette-yellow-700: #984708;
      --sl-color-palette-yellow-800: #7c3a0b;
      --sl-color-palette-yellow-900: #481d00;
      --sl-color-palette-yellow-050: #fffdea;
      --sl-color-field-button-default-hover-background: rgb(34 34 34 / 7%); /** color.button.default.hover.background */
      --sl-color-field-button-default-active-background: rgb(
        34 34 34 / 13%
      ); /** color.button.default.active.background */
      --sl-elevation-surface-base-default: var(
        --sl-color-palette-grey-000
      ); /** The default, flat surface level. Used for primary content backgrounds or non-interactive UI regions. */
      --sl-elevation-surface-raised-default: var(
        --sl-color-palette-grey-000
      ); /** Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-inverted: var(
        --sl-color-palette-grey-900
      ); /** Background of elevated components with an inverted background color like tooltips that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-alternative: var(
        --sl-color-palette-grey-100
      ); /** An alternate surface color used for visual differentiation in components like tables or lists, providing contrast between consecutive items (e.g., zebra striping). */
      --sl-elevation-surface-raised-sunken: var(
        --sl-color-palette-grey-050
      ); /** Background for components that create a sunken effect, typically used for grouping related items. */
      --sl-elevation-surface-shadow: var(--sl-color-palette-grey-900); /** Used as color for shadows. */
      --sl-box-shadow-slds-checklist:
        0 0 4px 0 rgb(34 34 34 / var(--sl-opacity-50)), 0 4px 8px 0 rgb(34 34 34 / var(--sl-opacity-150));
      --sl-box-shadow-focus: 0 0 0 3px rgb(51 102 255 / var(--sl-opacity-500)); /** boxShadow.focus */
      --sl-box-shadow-none: 0 0 0 0 var(--sl-color-palette-transparent-base); /** boxShadow.none */
      --sl-color-avatar-background: var(--sl-color-palette-accent-base);
      --sl-color-avatar-foreground: var(--sl-color-palette-white-base);
      --sl-color-badge-bold-info-foreground: var(--sl-color-palette-white-base);
      --sl-color-badge-bold-danger-background: var(--sl-color-palette-danger-500);
      --sl-color-badge-bold-danger-foreground: var(--sl-color-palette-white-base);
      --sl-color-badge-bold-success-background: var(--sl-color-palette-success-500);
      --sl-color-badge-bold-success-foreground: var(--sl-color-palette-white-base);
      --sl-color-badge-bold-warning-background: var(--sl-color-palette-warning-600);
      --sl-color-badge-bold-warning-foreground: var(--sl-color-palette-white-base);
      --sl-color-badge-bold-accent-background: var(--sl-color-palette-accent-base);
      --sl-color-badge-bold-accent-foreground: var(--sl-color-palette-white-base);
      --sl-color-badge-bold-neutral-background: var(--sl-color-palette-neutral-200);
      --sl-color-badge-bold-neutral-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-primary-background: var(--sl-color-palette-primary-base);
      --sl-color-badge-bold-primary-foreground: var(--sl-color-palette-white-base);
      --sl-color-badge-subtle-info-background: var(--sl-color-palette-info-100);
      --sl-color-badge-subtle-info-foreground: var(--sl-color-palette-info-500);
      --sl-color-badge-subtle-danger-background: var(--sl-color-palette-danger-100);
      --sl-color-badge-subtle-danger-foreground: var(--sl-color-palette-danger-600);
      --sl-color-badge-subtle-success-background: var(--sl-color-palette-success-100);
      --sl-color-badge-subtle-success-foreground: var(--sl-color-palette-success-600);
      --sl-color-badge-subtle-warning-background: var(--sl-color-palette-warning-100);
      --sl-color-badge-subtle-warning-foreground: var(--sl-color-palette-warning-700);
      --sl-color-badge-subtle-accent-background: var(--sl-color-palette-accent-100);
      --sl-color-badge-subtle-accent-foreground: var(--sl-color-palette-accent-500);
      --sl-color-badge-subtle-neutral-background: var(--sl-color-palette-neutral-100);
      --sl-color-badge-subtle-neutral-foreground: var(--sl-color-palette-neutral-600);
      --sl-color-badge-subtle-primary-background: var(--sl-color-palette-primary-100);
      --sl-color-badge-subtle-primary-foreground: var(--sl-color-palette-neutral-600);
      --sl-color-button-default-solid-idle-background: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.idle.background */
      --sl-color-button-default-solid-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.default.idle.foreground */
      --sl-color-button-default-solid-idle-border: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.idle.border */
      --sl-color-button-default-solid-hover-background: var(
        --sl-color-palette-white-base
      ); /** color.button.default.hover.background */
      --sl-color-button-default-solid-hover-foreground: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.hover.foreground */
      --sl-color-button-default-solid-hover-border: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.hover.border */
      --sl-color-button-default-solid-active-background: var(
        --sl-color-palette-primary-100
      ); /** color.button.default.active.background */
      --sl-color-button-default-solid-active-foreground: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.active.foreground */
      --sl-color-button-default-solid-active-border: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.active.border */
      --sl-color-button-default-solid-disabled-background: var(
        --sl-color-palette-neutral-300
      ); /** color.button.default.disabled.background */
      --sl-color-button-default-solid-disabled-foreground: var(
        --sl-color-palette-neutral-100
      ); /** color.button.default.disabled.foreground */
      --sl-color-button-default-solid-disabled-border: var(
        --sl-color-palette-neutral-300
      ); /** color.button.default.disabled.border */
      --sl-color-button-default-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-outline-idle-foreground: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-outline-idle-border: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-outline-hover-background: var(
        --sl-color-palette-primary-100
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-outline-hover-foreground: var(
        --sl-color-palette-neutral-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-outline-hover-border: var(
        --sl-color-palette-neutral-base
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-outline-active-background: var(
        --sl-color-palette-primary-150
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-outline-active-foreground: var(
        --sl-color-palette-neutral-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-outline-active-border: var(
        --sl-color-palette-neutral-base
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-outline-disabled-background: var(
        --sl-color-palette-neutral-100
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-outline-disabled-foreground: var(
        --sl-color-palette-neutral-300
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-outline-disabled-border: var(
        --sl-color-palette-neutral-300
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-default-outline-selected-idle-background: var(
        --sl-color-palette-accent-150
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-outline-selected-hover-background: var(
        --sl-color-palette-accent-200
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-outline-selected-active-background: var(
        --sl-color-palette-accent-300
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-outline-selected-disabled-background: var(
        --sl-color-palette-neutral-100
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-outline-selected-disabled-foreground: var(
        --sl-color-palette-neutral-300
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-outline-selected-disabled-border: var(
        --sl-color-palette-neutral-300
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-default-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-ghost-idle-foreground: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-ghost-hover-background: var(
        --sl-color-palette-neutral-100
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-ghost-hover-foreground: var(
        --sl-color-palette-neutral-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-ghost-hover-border: var(
        --sl-color-palette-neutral-100
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-ghost-active-background: var(
        --sl-color-palette-neutral-150
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-ghost-active-foreground: var(
        --sl-color-palette-neutral-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-ghost-active-border: var(
        --sl-color-palette-neutral-150
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-ghost-disabled-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-ghost-disabled-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-default-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-link-idle-foreground: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-link-hover-foreground: var(
        --sl-color-palette-accent-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-link-active-foreground: var(
        --sl-color-palette-accent-500
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-link-disabled-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-link-disabled-foreground: var(
        --sl-color-palette-neutral-300
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-link-disabled-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-primary-solid-idle-background: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.solid.idle.background */
      --sl-color-button-primary-solid-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.solid.idle.foreground */
      --sl-color-button-primary-solid-idle-border: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.solid.idle.border */
      --sl-color-button-primary-solid-hover-background: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.solid.hover.background */
      --sl-color-button-primary-solid-hover-foreground: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.solid.hover.foreground */
      --sl-color-button-primary-solid-hover-border: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.default.hover.border */
      --sl-color-button-primary-solid-active-background: var(
        --sl-color-palette-accent-50
      ); /** color.button.primary.solid.active.background */
      --sl-color-button-primary-solid-active-foreground: var(
        --sl-color-palette-accent-500
      ); /** color.button.primary.solid.active.foreground */
      --sl-color-button-primary-solid-active-border: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.default.active.border */
      --sl-color-button-primary-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-primary-outline-idle-foreground: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-primary-outline-idle-border: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-primary-outline-hover-background: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-primary-outline-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-primary-outline-hover-border: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-primary-outline-active-background: var(
        --sl-color-palette-accent-500
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-primary-outline-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-primary-outline-active-border: var(
        --sl-color-palette-accent-500
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-primary-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-primary-ghost-idle-foreground: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-primary-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-primary-ghost-hover-background: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-primary-ghost-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-primary-ghost-hover-border: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-primary-ghost-active-background: var(
        --sl-color-palette-accent-500
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-primary-ghost-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-primary-ghost-active-border: var(
        --sl-color-palette-accent-500
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-primary-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-primary-link-idle-foreground: var(
        --sl-color-palette-accent-base
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-primary-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-primary-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-primary-link-hover-foreground: var(
        --sl-color-palette-accent-500
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-primary-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-primary-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-primary-link-active-foreground: var(
        --sl-color-palette-accent-600
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-primary-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-success-solid-idle-background: var(
        --sl-color-palette-success-700
      ); /** color.button.success.solid.idle.background */
      --sl-color-button-success-solid-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.success.solid.idle.foreground */
      --sl-color-button-success-solid-idle-border: var(
        --sl-color-palette-success-700
      ); /** color.button.success.solid.idle.border */
      --sl-color-button-success-solid-hover-background: var(
        --sl-color-palette-white-base
      ); /** color.button.success.solid.hover.background */
      --sl-color-button-success-solid-hover-foreground: var(
        --sl-color-palette-success-700
      ); /** color.button.success.solid.hover.foreground */
      --sl-color-button-success-solid-hover-border: var(
        --sl-color-palette-success-700
      ); /** color.button.success.solid.hover.border */
      --sl-color-button-success-solid-active-background: var(
        --sl-color-palette-success-50
      ); /** color.button.success.solid.active.background */
      --sl-color-button-success-solid-active-foreground: var(
        --sl-color-palette-success-800
      ); /** color.button.success.solid.active.foreground */
      --sl-color-button-success-solid-active-border: var(
        --sl-color-palette-success-800
      ); /** color.button.success.solid.active.border */
      --sl-color-button-success-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.background */
      --sl-color-button-success-outline-idle-foreground: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.idle.foreground */
      --sl-color-button-success-outline-idle-border: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.idle.border */
      --sl-color-button-success-outline-hover-background: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.hover.background */
      --sl-color-button-success-outline-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.success.outline.hover.foreground */
      --sl-color-button-success-outline-hover-border: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.hover.border */
      --sl-color-button-success-outline-active-background: var(
        --sl-color-palette-success-800
      ); /** color.button.success.outline.active.background */
      --sl-color-button-success-outline-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.success.outline.active.foreground */
      --sl-color-button-success-outline-active-border: var(
        --sl-color-palette-success-800
      ); /** color.button.success.outline.active.border */
      --sl-color-button-success-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.background */
      --sl-color-button-success-ghost-idle-foreground: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.idle.foreground */
      --sl-color-button-success-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.border */
      --sl-color-button-success-ghost-hover-background: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.hover.background */
      --sl-color-button-success-ghost-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.success.outline.hover.foreground */
      --sl-color-button-success-ghost-hover-border: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.hover.border */
      --sl-color-button-success-ghost-active-background: var(
        --sl-color-palette-success-800
      ); /** color.button.success.outline.active.background */
      --sl-color-button-success-ghost-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.success.outline.active.foreground */
      --sl-color-button-success-ghost-active-border: var(
        --sl-color-palette-success-800
      ); /** color.button.success.outline.active.border */
      --sl-color-button-success-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.background */
      --sl-color-button-success-link-idle-foreground: var(
        --sl-color-palette-success-700
      ); /** color.button.success.outline.idle.foreground */
      --sl-color-button-success-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.border */
      --sl-color-button-success-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.hover.background */
      --sl-color-button-success-link-hover-foreground: var(
        --sl-color-palette-success-800
      ); /** color.button.success.outline.hover.foreground */
      --sl-color-button-success-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.hover.border */
      --sl-color-button-success-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.active.background */
      --sl-color-button-success-link-active-foreground: var(
        --sl-color-palette-success-900
      ); /** color.button.success.outline.active.foreground */
      --sl-color-button-success-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.active.border */
      --sl-color-button-warning-solid-idle-background: var(
        --sl-color-palette-warning-700
      ); /** color.button.info.warning.idle.background */
      --sl-color-button-warning-solid-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.warning.solid.idle.foreground */
      --sl-color-button-warning-solid-idle-border: var(
        --sl-color-palette-warning-700
      ); /** color.button.info.warning.idle.border */
      --sl-color-button-warning-solid-hover-background: var(
        --sl-color-palette-white-base
      ); /** color.button.warning.solid.hover.background */
      --sl-color-button-warning-solid-hover-foreground: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.solid.hover.foreground */
      --sl-color-button-warning-solid-hover-border: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.solid.hover.border */
      --sl-color-button-warning-solid-active-background: var(
        --sl-color-palette-warning-100
      ); /** color.button.warning.solid.active.background */
      --sl-color-button-warning-solid-active-foreground: var(
        --sl-color-palette-warning-800
      ); /** color.button.warning.solid.active.foreground */
      --sl-color-button-warning-solid-active-border: var(
        --sl-color-palette-warning-800
      ); /** color.button.warning.solid.active.border */
      --sl-color-button-warning-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.background */
      --sl-color-button-warning-outline-idle-foreground: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.idle.foreground */
      --sl-color-button-warning-outline-idle-border: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.idle.border */
      --sl-color-button-warning-outline-hover-background: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.hover.background */
      --sl-color-button-warning-outline-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.warning.outline.hover.foreground */
      --sl-color-button-warning-outline-hover-border: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.hover.border */
      --sl-color-button-warning-outline-active-background: var(
        --sl-color-palette-warning-800
      ); /** color.button.warning.outline.active.background */
      --sl-color-button-warning-outline-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.warning.outline.active.foreground */
      --sl-color-button-warning-outline-active-border: var(
        --sl-color-palette-warning-800
      ); /** color.button.warning.outline.active.border */
      --sl-color-button-warning-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.background */
      --sl-color-button-warning-ghost-idle-foreground: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.idle.foreground */
      --sl-color-button-warning-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.border */
      --sl-color-button-warning-ghost-hover-background: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.hover.background */
      --sl-color-button-warning-ghost-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.warning.outline.hover.foreground */
      --sl-color-button-warning-ghost-hover-border: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.hover.border */
      --sl-color-button-warning-ghost-active-background: var(
        --sl-color-palette-warning-800
      ); /** color.button.warning.outline.active.background */
      --sl-color-button-warning-ghost-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.warning.outline.active.foreground */
      --sl-color-button-warning-ghost-active-border: var(
        --sl-color-palette-warning-800
      ); /** color.button.warning.outline.active.border */
      --sl-color-button-warning-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.background */
      --sl-color-button-warning-link-idle-foreground: var(
        --sl-color-palette-warning-700
      ); /** color.button.warning.outline.idle.foreground */
      --sl-color-button-warning-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.border */
      --sl-color-button-warning-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.hover.background */
      --sl-color-button-warning-link-hover-foreground: var(
        --sl-color-palette-warning-800
      ); /** color.button.warning.outline.hover.foreground */
      --sl-color-button-warning-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.hover.border */
      --sl-color-button-warning-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.active.background */
      --sl-color-button-warning-link-active-foreground: var(
        --sl-color-palette-warning-900
      ); /** color.button.warning.outline.active.foreground */
      --sl-color-button-warning-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.active.border */
      --sl-color-button-danger-solid-idle-background: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.warning.idle.background */
      --sl-color-button-danger-solid-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.danger.solid.idle.foreground */
      --sl-color-button-danger-solid-idle-border: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.warning.idle.border */
      --sl-color-button-danger-solid-hover-background: var(
        --sl-color-palette-white-base
      ); /** color.button.danger.solid.hover.background */
      --sl-color-button-danger-solid-hover-foreground: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.solid.hover.foreground */
      --sl-color-button-danger-solid-hover-border: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.solid.hover.border */
      --sl-color-button-danger-solid-active-background: var(
        --sl-color-palette-danger-50
      ); /** color.button.danger.solid.active.background */
      --sl-color-button-danger-solid-active-foreground: var(
        --sl-color-palette-danger-700
      ); /** color.button.danger.solid.active.foreground */
      --sl-color-button-danger-solid-active-border: var(
        --sl-color-palette-danger-700
      ); /** color.button.danger.solid.active.border */
      --sl-color-button-danger-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.background */
      --sl-color-button-danger-outline-idle-foreground: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.idle.foreground */
      --sl-color-button-danger-outline-idle-border: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.idle.border */
      --sl-color-button-danger-outline-hover-background: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.hover.background */
      --sl-color-button-danger-outline-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.danger.outline.hover.foreground */
      --sl-color-button-danger-outline-hover-border: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.hover.border */
      --sl-color-button-danger-outline-active-background: var(
        --sl-color-palette-danger-700
      ); /** color.button.danger.outline.active.background */
      --sl-color-button-danger-outline-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.danger.outline.active.foreground */
      --sl-color-button-danger-outline-active-border: var(
        --sl-color-palette-danger-700
      ); /** color.button.danger.outline.active.border */
      --sl-color-button-danger-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.background */
      --sl-color-button-danger-ghost-idle-foreground: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.idle.foreground */
      --sl-color-button-danger-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.border */
      --sl-color-button-danger-ghost-hover-background: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.hover.background */
      --sl-color-button-danger-ghost-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.danger.outline.hover.foreground */
      --sl-color-button-danger-ghost-hover-border: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.hover.border */
      --sl-color-button-danger-ghost-active-background: var(
        --sl-color-palette-danger-700
      ); /** color.button.danger.outline.active.background */
      --sl-color-button-danger-ghost-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.danger.outline.active.foreground */
      --sl-color-button-danger-ghost-active-border: var(
        --sl-color-palette-danger-700
      ); /** color.button.danger.outline.active.border */
      --sl-color-button-danger-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.background */
      --sl-color-button-danger-link-idle-foreground: var(
        --sl-color-palette-danger-600
      ); /** color.button.danger.outline.idle.foreground */
      --sl-color-button-danger-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.border */
      --sl-color-button-danger-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.hover.background */
      --sl-color-button-danger-link-hover-foreground: var(
        --sl-color-palette-danger-700
      ); /** color.button.danger.outline.hover.foreground */
      --sl-color-button-danger-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.hover.border */
      --sl-color-button-danger-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.active.background */
      --sl-color-button-danger-link-active-foreground: var(
        --sl-color-palette-danger-800
      ); /** color.button.danger.outline.active.foreground */
      --sl-color-button-danger-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.active.border */
      --sl-color-button-info-solid-idle-background: var(
        --sl-color-palette-info-600
      ); /** color.button.info.warning.idle.background */
      --sl-color-button-info-solid-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.info.solid.idle.foreground */
      --sl-color-button-info-solid-idle-border: var(
        --sl-color-palette-info-600
      ); /** color.button.info.warning.idle.border */
      --sl-color-button-info-solid-hover-background: var(
        --sl-color-palette-white-base
      ); /** color.button.info.solid.hover.background */
      --sl-color-button-info-solid-hover-foreground: var(
        --sl-color-palette-info-600
      ); /** color.button.info.solid.hover.foreground */
      --sl-color-button-info-solid-hover-border: var(
        --sl-color-palette-info-600
      ); /** color.button.info.solid.hover.border */
      --sl-color-button-info-solid-active-background: var(
        --sl-color-palette-info-50
      ); /** color.button.info.solid.active.background */
      --sl-color-button-info-solid-active-foreground: var(
        --sl-color-palette-info-700
      ); /** color.button.info.solid.active.foreground */
      --sl-color-button-info-solid-active-border: var(
        --sl-color-palette-info-700
      ); /** color.button.info.solid.active.border */
      --sl-color-button-info-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.idle.background */
      --sl-color-button-info-outline-idle-foreground: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.idle.foreground */
      --sl-color-button-info-outline-idle-border: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.idle.border */
      --sl-color-button-info-outline-hover-background: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.hover.background */
      --sl-color-button-info-outline-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.info.outline.hover.foreground */
      --sl-color-button-info-outline-hover-border: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.hover.border */
      --sl-color-button-info-outline-active-background: var(
        --sl-color-palette-info-700
      ); /** color.button.info.outline.active.background */
      --sl-color-button-info-outline-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.info.outline.active.foreground */
      --sl-color-button-info-outline-active-border: var(
        --sl-color-palette-info-700
      ); /** color.button.info.outline.active.border */
      --sl-color-button-info-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.idle.background */
      --sl-color-button-info-ghost-idle-foreground: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.idle.foreground */
      --sl-color-button-info-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.idle.border */
      --sl-color-button-info-ghost-hover-background: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.hover.background */
      --sl-color-button-info-ghost-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.info.outline.hover.foreground */
      --sl-color-button-info-ghost-hover-border: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.hover.border */
      --sl-color-button-info-ghost-active-background: var(
        --sl-color-palette-info-700
      ); /** color.button.info.outline.active.background */
      --sl-color-button-info-ghost-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.info.outline.active.foreground */
      --sl-color-button-info-ghost-active-border: var(
        --sl-color-palette-info-700
      ); /** color.button.info.outline.active.border */
      --sl-color-button-info-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.idle.background */
      --sl-color-button-info-link-idle-foreground: var(
        --sl-color-palette-info-600
      ); /** color.button.info.outline.idle.foreground */
      --sl-color-button-info-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.idle.border */
      --sl-color-button-info-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.hover.background */
      --sl-color-button-info-link-hover-foreground: var(
        --sl-color-palette-info-700
      ); /** color.button.info.outline.hover.foreground */
      --sl-color-button-info-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.hover.border */
      --sl-color-button-info-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.active.background */
      --sl-color-button-info-link-active-foreground: var(
        --sl-color-palette-info-800
      ); /** color.button.info.outline.active.foreground */
      --sl-color-button-info-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.info.outline.active.border */
      --sl-color-surface-solid-primary-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-surface-solid-primary-foreground: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.foreground */
      --sl-color-surface-solid-secondary-background: var(
        --sl-color-palette-neutral-200
      ); /** color.surface.solid.secondary.background */
      --sl-color-surface-solid-secondary-foreground: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.secondary.foreground */
      --sl-color-surface-solid-accent-background: var(
        --sl-color-palette-accent-base
      ); /** color.surface.solid.accent.backgorund */
      --sl-color-surface-solid-accent-foreground: var(
        --sl-color-palette-accent-50
      ); /** color.surface.solid.accent.foreground */
      --sl-color-input-option-default-unchecked-default-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-default-border: var(
        --sl-color-palette-neutral-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-default-icon: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-hover-background: var(
        --sl-color-palette-accent-50
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-hover-border: var(
        --sl-color-palette-accent-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-hover-icon: var(
        --sl-color-palette-accent-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-active-background: var(
        --sl-color-palette-accent-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-active-border: var(
        --sl-color-palette-accent-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-active-icon: var(
        --sl-color-palette-accent-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-disabled-background: var(
        --sl-color-palette-neutral-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-disabled-border: var(
        --sl-color-palette-neutral-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-disabled-label: var(
        --sl-color-palette-neutral-500
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-disabled-icon: var(
        --sl-color-palette-neutral-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-default-background: var(
        --sl-color-palette-accent-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-default-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-hover-background: var(
        --sl-color-palette-accent-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-hover-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-active-background: var(
        --sl-color-palette-accent-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-active-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-focus-background: var(
        --sl-color-palette-accent-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-focus-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-disabled-background: var(
        --sl-color-palette-neutral-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-disabled-label: var(
        --sl-color-palette-neutral-500
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-disabled-icon: var(
        --sl-color-palette-neutral-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-default-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-default-border: var(
        --sl-color-palette-danger-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-default-icon: var(
        --sl-color-palette-danger-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-hover-background: var(
        --sl-color-palette-danger-50
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-hover-border: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-hover-icon: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-active-background: var(
        --sl-color-palette-danger-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-active-border: var(
        --sl-color-palette-danger-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-active-icon: var(
        --sl-color-palette-danger-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-default-background: var(
        --sl-color-palette-danger-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-default-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-hover-background: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-hover-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-active-background: var(
        --sl-color-palette-danger-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-active-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-focus-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-default-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-default-border: var(
        --sl-color-palette-success-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-default-icon: var(
        --sl-color-palette-success-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-hover-background: var(
        --sl-color-palette-success-50
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-hover-border: var(
        --sl-color-palette-success-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-hover-icon: var(
        --sl-color-palette-success-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-active-background: var(
        --sl-color-palette-success-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-active-border: var(
        --sl-color-palette-success-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-active-icon: var(
        --sl-color-palette-success-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-focus-border: var(
        --sl-color-palette-success-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-focus-icon: var(
        --sl-color-palette-success-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-default-background: var(
        --sl-color-palette-success-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-default-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-hover-background: var(
        --sl-color-palette-success-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-hover-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-active-background: var(
        --sl-color-palette-success-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-active-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-focus-icon: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-background: var(
        --sl-color-palette-neutral-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-handle: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-hover-background: var(
        --sl-color-palette-neutral-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-hover-handle: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-active-background: var(
        --sl-color-palette-neutral-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-active-handle: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-disabled-background: var(
        --sl-color-palette-neutral-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-disabled-text: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-disabled-icon: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-disabled-handle: var(
        --sl-color-palette-neutral-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-background: var(
        --sl-color-palette-success-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-handle: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-hover-background: var(
        --sl-color-palette-success-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-hover-handle: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-active-background: var(
        --sl-color-palette-success-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-active-handle: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-focus-handle: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-border: var(
        --sl-color-palette-neutral-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-icon: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-placeholder: var(
        --sl-color-palette-neutral-500
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-background: var(
        --sl-color-palette-accent-50
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-hover-icon: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-active-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-active-border: var(
        --sl-color-palette-accent-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-background: var(
        --sl-color-palette-neutral-100
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-border: var(
        --sl-color-palette-neutral-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-label: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-disabled-icon: var(
        --sl-color-palette-neutral-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-input-text: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-disabled-placeholder: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-default-border: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-default-icon: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-background: var(
        --sl-color-palette-danger-50
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-border: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-placeholder: var(
        --sl-color-palette-neutral-600
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-icon: var(
        --sl-color-palette-success-500
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-hover-background: var(
        --sl-color-palette-success-50
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-background: var(
        --sl-color-palette-white-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-helper-text-default: var(
        --sl-color-palette-neutral-600
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-text-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-text-invalid: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-icon-default: var(
        --sl-color-palette-neutral-600
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-icon-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-text-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-text-invalid: var(
        --sl-color-palette-danger-500
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-icon-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-select-item-default-foreground: var(--sl-color-palette-neutral-600);
      --sl-color-select-item-default-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-hover-background: var(--sl-color-palette-accent-100);
      --sl-color-select-item-hover-foreground: var(--sl-color-palette-neutral-600);
      --sl-color-select-item-hover-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-active-background: var(--sl-color-palette-accent-150);
      --sl-color-select-item-active-foreground: var(--sl-color-palette-neutral-600);
      --sl-color-select-item-active-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-focus-foreground: var(--sl-color-palette-neutral-600);
      --sl-color-select-item-focus-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-disabled-background: var(--sl-color-palette-neutral-100);
      --sl-color-select-item-disabled-foreground: var(--sl-color-palette-neutral-400);
      --sl-color-select-item-disabled-border: var(--sl-color-palette-neutral-100);
      --sl-color-select-item-disabled-indicator: var(--sl-color-palette-neutral-200);
      --sl-color-select-item-divider-line: var(--sl-color-palette-neutral-200);
      --sl-color-select-item-group-title-foreground: var(--sl-color-palette-neutral-200);
      --sl-color-select-selectbox-default-active-border: var(--sl-color-palette-primary-base);
      --sl-color-select-selectbox-default-focus-border: var(--sl-color-palette-primary-base);
      --sl-color-select-listbox-background: var(--sl-color-palette-white-base);
      --sl-color-tooltip-background: var(--sl-color-palette-black-base);
      --sl-color-tooltip-foreground: var(--sl-color-palette-white-base);
      --sl-color-tooltip-border: var(--sl-color-palette-transparent-base);
      --sl-color-focusring-default: var(--sl-color-palette-accent-base);
      --sl-color-focusring-inversed: var(--sl-color-palette-white-base);
      --sl-color-focusring-inversed-copy: var(--sl-color-palette-white-base);
      --sl-color-popover-background: var(--sl-color-palette-white-base);
      --sl-color-popover-border: var(--sl-color-palette-neutral-200);
      --sl-color-inline-message-info-background: var(--sl-color-palette-info-50);
      --sl-color-inline-message-info-foreground: var(--sl-color-palette-info-600);
      --sl-color-inline-message-info-border: var(--sl-color-palette-info-600);
      --sl-color-inline-message-info-icon: var(--sl-color-palette-info-600);
      --sl-color-inline-message-success-background: var(--sl-color-palette-success-50);
      --sl-color-inline-message-success-foreground: var(--sl-color-palette-success-700);
      --sl-color-inline-message-success-border: var(--sl-color-palette-success-700);
      --sl-color-inline-message-success-icon: var(--sl-color-palette-success-700);
      --sl-color-inline-message-warning-background: var(--sl-color-palette-warning-100);
      --sl-color-inline-message-warning-foreground: var(--sl-color-palette-warning-700);
      --sl-color-inline-message-warning-border: var(--sl-color-palette-warning-700);
      --sl-color-inline-message-warning-icon: var(--sl-color-palette-warning-700);
      --sl-color-inline-message-danger-background: var(--sl-color-palette-danger-50);
      --sl-color-inline-message-danger-foreground: var(--sl-color-palette-danger-600);
      --sl-color-inline-message-danger-border: var(--sl-color-palette-danger-600);
      --sl-color-inline-message-danger-icon: var(--sl-color-palette-danger-600);
      --sl-color-tab-default-border: var(--sl-color-palette-neutral-200);
      --sl-color-tab-indicator: var(--sl-color-palette-accent-base);
      --sl-color-tab-hover-background: var(--sl-color-palette-accent-100);
      --sl-color-tab-hover-border: var(--sl-color-palette-neutral-200);
      --sl-color-tab-disabled-foreground: var(--sl-color-palette-neutral-200);
      --sl-color-tab-disabled-border: var(--sl-color-palette-neutral-200);
      --sl-color-tab-tabbar-border: var(--sl-color-palette-neutral-200);
      --sl-color-tab-active-background: var(--sl-color-palette-accent-150);
      --sl-color-tab-active-border: var(--sl-color-palette-neutral-200);
      --sl-color-skeleton-base: var(--sl-color-palette-neutral-100); /** body.surface.100 */
      --sl-color-skeleton-effect: var(--sl-color-palette-neutral-150); /** body.surface.100 */
      --sl-color-skeleton-pulse: var(--sl-color-palette-neutral-100); /** body.surface.100 */
      --sl-color-spinner-default: var(--sl-color-palette-primary-500);
      --sl-color-spinner-white: var(--sl-color-palette-white-base);
      --sl-color-spinner-accent: var(--sl-color-palette-accent-base);
      --sl-color-spinner-info: var(--sl-color-palette-info-base);
      --sl-color-spinner-success: var(--sl-color-palette-success-base);
      --sl-color-spinner-warning: var(--sl-color-palette-warning-base);
      --sl-color-spinner-danger: var(--sl-color-palette-danger-base);
      --sl-color-card-border: var(--sl-color-palette-neutral-200);
      --sl-color-href-idle-foreground: var(
        --sl-color-palette-neutral-500
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-href-hover-foreground: var(
        --sl-color-palette-accent-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-href-active-foreground: var(
        --sl-color-palette-accent-900
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-href-disabled-foreground: var(
        --sl-color-palette-neutral-200
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-breadcrumb-divider: var(
        --sl-color-palette-neutral-200
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-accordion-default-border: var(--sl-color-palette-neutral-200);
      --sl-color-accordion-hover-header: var(--sl-color-palette-accent-50);
      --sl-color-accordion-hover-foreground: var(--sl-color-palette-accent-500);
      --sl-color-accordion-hover-icon: var(--sl-color-palette-accent-500);
      --sl-color-accordion-disabled-background: var(--sl-color-palette-neutral-100);
      --sl-color-accordion-disabled-header: var(--sl-color-palette-neutral-100);
      --sl-color-accordion-disabled-foreground: var(--sl-color-palette-neutral-400);
      --sl-color-accordion-disabled-icon: var(--sl-color-palette-neutral-200);
      --sl-color-accordion-active-header: var(--sl-color-palette-accent-150);
      --sl-color-accordion-active-foreground: var(--sl-color-palette-accent-800);
      --sl-color-accordion-active-icon: var(--sl-color-palette-accent-800);
      --sl-color-slds-checklist-border: var(--sl-color-palette-neutral-200);
      --sl-color-slds-checklist-divider: var(--sl-color-palette-neutral-200);
      --sl-color-slds-checklist-icon-success: var(--sl-color-palette-success-500);
      --sl-color-slds-checklist-icon-danger: var(--sl-color-palette-danger-400);
      --sl-color-slds-checklist-link-hover: var(--sl-color-palette-info-500);
      --sl-color-slds-checklist-link-active: var(--sl-color-palette-info-600);
      --sl-color-field-button-default-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.idle.background */
      --sl-color-field-button-default-idle-foreground: var(--sl-color-palette-neutral-400);
      --sl-color-field-button-default-hover-foreground: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.hover.foreground */
      --sl-color-field-button-default-active-foreground: var(
        --sl-color-palette-primary-base
      ); /** color.button.default.active.foreground */
      --sl-color-field-button-default-disabled-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.disabled.background */
      --sl-color-field-button-default-disabled-foreground: var(
        --sl-color-palette-neutral-100
      ); /** color.button.default.disabled.foreground */
      --sl-color-progressbar-active-track: var(--sl-color-palette-accent-base);
      --sl-color-progressbar-success-track: var(--sl-color-palette-success-500);
      --sl-color-progressbar-error-track: var(--sl-color-palette-danger-500);
      --sl-color-progressbar-indeterminate-track: var(--sl-color-palette-accent-base);
      --sl-color-progressbar-warning-track: var(--sl-color-palette-warning-500);
      --sl-color-progressbar-background: var(--sl-color-palette-neutral-150);
      --sl-color-tag-subtle-idle-background: var(--sl-color-palette-info-100);
      --sl-color-tag-subtle-idle-foreground: var(--sl-color-palette-accent-500);
      --sl-color-tag-subtle-idle-border: var(--sl-color-palette-info-150);
      --sl-color-tag-subtle-hover-background: var(--sl-color-palette-info-150);
      --sl-color-tag-subtle-hover-foreground: var(--sl-color-palette-accent-500);
      --sl-color-tag-subtle-hover-border: var(--sl-color-palette-info-200);
      --sl-color-tag-subtle-active-foreground: var(--sl-color-palette-white-base);
      --sl-color-tag-subtle-active-border: var(--sl-color-palette-info-500);
      --sl-color-tag-subtle-disabled-background: var(--sl-color-palette-neutral-100);
      --sl-color-tag-subtle-disabled-foreground: var(--sl-color-palette-neutral-300);
      --sl-color-tag-subtle-disabled-border: var(--sl-color-palette-neutral-150);
      --sl-color-tag-subtle-close-active-background: var(--sl-color-palette-accent-200);
      --sl-color-tag-subtle-close-active-foreground: var(--sl-color-palette-accent-500);
      --sl-color-tag-bold-idle-foreground: var(--sl-color-palette-white-base);
      --sl-color-tag-bold-idle-border: var(--sl-color-palette-info-500);
      --sl-color-tag-bold-hover-background: var(--sl-color-palette-info-500);
      --sl-color-tag-bold-hover-foreground: var(--sl-color-palette-white-base);
      --sl-color-tag-bold-hover-border: var(--sl-color-palette-info-600);
      --sl-color-tag-bold-active-background: var(--sl-color-palette-info-100);
      --sl-color-tag-bold-active-foreground: var(--sl-color-palette-info-500);
      --sl-color-tag-bold-active-border: var(--sl-color-palette-info-150);
      --sl-color-tag-bold-disabled-background: var(--sl-color-palette-neutral-300);
      --sl-color-tag-bold-disabled-foreground: var(--sl-color-palette-neutral-100);
      --sl-color-tag-bold-disabled-border: var(--sl-color-palette-neutral-400);
      --sl-color-tag-bold-close-active-background: var(--sl-color-palette-accent-600);
      --sl-color-foreground-disabled: var(--sl-color-palette-grey-500); /** Use for text in a disabled state. */
      --sl-color-foreground-inverted-plain: var(--sl-color-palette-grey-000); /** Use for plain inverted text. */
      --sl-color-foreground-inverted-bold: var(
        --sl-color-palette-grey-000
      ); /** Use for inverted text on 'color.background.inverted.subtlest', and 'color.background.inverted.subtle'. */
      --sl-color-foreground-inverted-onBold: var(
        --sl-color-palette-grey-900
      ); /** Use for inverted text on 'color.background.inverted.bold'. */
      --sl-color-foreground-accent-blue-bold: var(
        --sl-color-palette-blue-700
      ); /** Use for blue text on 'color.background.accent.blue.muted' or 'color.background.accent.blue.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-bold: var(
        --sl-color-palette-green-700
      ); /** Use for green text on 'color.background.accent.green.muted' or 'color.background.accent.green.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-faint: var(
        --sl-color-palette-grey-300
      ); /** Use for faint text on neutral backgrounds, providing low contrast. Not intended for primary content, as it does not meet WCAG 2.2 AA contrast requirements. Use sparingly where accessibility isn't a critical concern. */
      --sl-color-foreground-accent-grey-subtlest: var(
        --sl-color-palette-grey-600
      ); /** Use for muted grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtle: var(
        --sl-color-palette-grey-700
      ); /** Use for subtle grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-plain: var(
        --sl-color-palette-grey-800
      ); /** Use for plain grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-bold: var(
        --sl-color-palette-grey-900
      ); /** Use for bold grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-orange-bold: var(
        --sl-color-palette-orange-800
      ); /** Use for orange text on 'color.background.accent.orange.muted' or 'color.background.accent.orange.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-bold: var(
        --sl-color-palette-purple-800
      ); /** Use for purple text on 'color.background.accent.purple.muted' or 'color.background.accent.purple.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-red-bold: var(
        --sl-color-palette-red-800
      ); /** Use for red text on 'color.background.accent.red.muted' or 'color.background.accent.red.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-bold: var(
        --sl-color-palette-teal-800
      ); /** Use for teal text on 'color.background.accent.teal.muted' or 'color.background.accent.teal.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-plain: var(
        --sl-color-palette-yellow-600
      ); /** Use for yellow text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-yellow-bold: var(
        --sl-color-palette-yellow-800
      ); /** Use for yellow text on 'color.background.accent.yellow.muted' or 'color.background.accent.yellow.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-link-hover: var(--sl-color-palette-blue-600); /** Use for links in hover state. */
      --sl-color-link-active: var(--sl-color-palette-blue-700); /** Use for links in active state. */
      --sl-color-link-inverted-hover: var(--sl-color-palette-blue-100); /** Use for inverted links in hover state. */
      --sl-color-link-inverted-active: var(--sl-color-palette-blue-150); /** Use for inverted links in active state. */
      --sl-color-link-focused-idle: var(
        --sl-color-palette-blue-700
      ); /** Used for the linkcolor of navigation aids in idle state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-hover: var(
        --sl-color-palette-blue-800
      ); /** Used for the linkcolor of navigation aids in hovered state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-active: var(
        --sl-color-palette-blue-900
      ); /** Used for the linkcolor of navigation aids in pressed state, such as skip links, when they are focused or visible. */
      --sl-color-border-inverted: var(--sl-color-palette-grey-000); /** Use for borders on bold backgrounds. */
      --sl-color-border-focused: var(
        --sl-color-palette-blue-400
      ); /** Use for focus rings of elements in a focus state. */
      --sl-color-border-neutral-subtle: var(
        --sl-color-palette-grey-200
      ); /** Use for subtle borders on color.background.neutral background colors. */
      --sl-color-border-info-subtle: var(
        --sl-color-palette-blue-100
      ); /** Use for subtle borders on color.background.info background colors. */
      --sl-color-border-accent-grey-faint: var(
        --sl-color-palette-grey-150
      ); /** Use for faint grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-plain: var(
        --sl-color-palette-grey-300
      ); /** Use for plain grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-bold: var(
        --sl-color-palette-grey-500
      ); /** Use for bold grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-heavy: var(
        --sl-color-palette-grey-900
      ); /** Use for heavy grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-background-disabled: var(
        --sl-color-palette-grey-100
      ); /** Use for backgrounds of elements in disabled state. */
      --sl-color-background-input-plain: var(
        --sl-color-palette-grey-000
      ); /** Use for backgrounds of form UI elements, such as text fields, checkboxes, and radio buttons. */
      --sl-color-background-neutral-subtlest: var(
        --sl-color-palette-grey-050
      ); /** The subtlest background in the neutral action color. */
      --sl-color-background-accent-blue-bold: var(
        --sl-color-palette-blue-400
      ); /** A vibrant blue background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-interactive-bold: var(
        --sl-color-palette-blue-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-interactive-plain: var(
        --sl-color-palette-accent-300
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-green-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest green background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-green-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle green background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-bold: var(
        --sl-color-palette-green-600
      ); /** A vibrant green background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-interactive-bold: var(
        --sl-color-palette-green-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-interactive-plain: var(
        --sl-color-palette-green-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest grey background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle grey background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-bold: var(
        --sl-color-palette-grey-150
      ); /** A vibrant grey background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-interactive-bold: var(
        --sl-color-palette-grey-500
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-interactive-plain: var(
        --sl-color-palette-grey-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-orange-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest orange background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-orange-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle orange background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-bold: var(
        --sl-color-palette-orange-600
      ); /** A vibrant orange background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-interactive-bold: var(
        --sl-color-palette-orange-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-interactive-plain: var(
        --sl-color-palette-orange-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-purple-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest purple background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-purple-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle purple background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-bold: var(
        --sl-color-palette-purple-600
      ); /** A vibrant purple background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-interactive-bold: var(
        --sl-color-palette-purple-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-interactive-plain: var(
        --sl-color-palette-purple-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-red-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest red background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-red-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle red background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-bold: var(
        --sl-color-palette-red-500
      ); /** A vibrant red background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-interactive-bold: var(
        --sl-color-palette-red-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-interactive-plain: var(
        --sl-color-palette-red-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-teal-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest teal background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-teal-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle teal background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-bold: var(
        --sl-color-palette-teal-600
      ); /** A vibrant teal background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-interactive-bold: var(
        --sl-color-palette-teal-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-interactive-plain: var(
        --sl-color-palette-teal-400
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest yellow background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle yellow background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-bold: var(
        --sl-color-palette-yellow-400
      ); /** A vibrant yellow background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-interactive-bold: var(
        --sl-color-palette-yellow-800
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-interactive-plain: var(
        --sl-color-palette-yellow-400
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-inverted-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest inverted background option. */
      --sl-color-background-inverted-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle inverted background option. */
      --sl-color-background-inverted-bold: var(--sl-color-palette-grey-000); /** A solid inverted background option. */
      --sl-color-background-inverted-interactive-bold: var(
        --sl-color-palette-grey-800
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-inverted-interactive-plain: var(
        --sl-color-palette-grey-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-blanket-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-light-moderate) * 100%),
        transparent
      ); /** Use for screen overlay that appears with dialogs or drawers. */
      --sl-body-background: var(--sl-color-palette-white-base); /** color.body.background */
      --sl-body-foreground: var(--sl-color-palette-primary-base); /** color.body.foreground */
      --sl-body-surface-100: var(--sl-color-palette-neutral-100); /** body.surface.100 */
      --sl-body-surface-200: var(--sl-color-palette-neutral-150); /** body.surface.100 */
      --sl-body-surface-overlay: color-mix(
        in srgb,
        var(--sl-color-palette-primary-base) calc(var(--sl-opacity-700) * 100%),
        transparent
      ); /** body.surface.200 */
      --sl-color-avatar-subheader: var(--sl-color-input-helper-text-default);
      --sl-color-badge-bold-info-background: var(--sl-color-palette-info-400);
      --sl-color-button-default-outline-selected-idle-foreground: var(
        --sl-color-button-default-outline-idle-foreground
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-outline-selected-idle-border: var(
        --sl-color-button-default-outline-idle-border
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-outline-selected-active-foreground: var(
        --sl-color-button-default-outline-hover-foreground
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-outline-selected-active-border: var(
        --sl-color-button-default-outline-hover-border
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-ghost-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-ghost-selected-idle-background: var(
        --sl-color-button-default-outline-selected-idle-background
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-ghost-selected-idle-border: var(
        --sl-color-button-default-outline-selected-idle-background
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-ghost-selected-hover-background: var(
        --sl-color-button-default-outline-selected-hover-background
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-ghost-selected-hover-border: var(
        --sl-color-button-default-outline-selected-hover-background
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-ghost-selected-active-background: var(
        --sl-color-button-default-outline-selected-active-background
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-ghost-selected-active-border: var(
        --sl-color-button-default-outline-selected-active-background
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-ghost-selected-disabled-background: var(
        --sl-color-button-default-outline-selected-disabled-background
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-ghost-selected-disabled-foreground: var(
        --sl-color-button-default-outline-selected-disabled-foreground
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-ghost-selected-disabled-border: var(
        --sl-color-button-default-outline-selected-disabled-background
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-primary-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.primary.solid.disabled.background */
      --sl-color-button-primary-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.primary.solid.disabled.foreground */
      --sl-color-button-primary-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.primary.default.disabled.border */
      --sl-color-button-primary-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-primary-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-primary-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-primary-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-primary-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-primary-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-primary-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-primary-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-success-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.success.solid.disabled.background */
      --sl-color-button-success-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.success.solid.disabled.foreground */
      --sl-color-button-success-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.success.solid.disabled.border */
      --sl-color-button-success-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.success.outline.disabled.background */
      --sl-color-button-success-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.success.outline.disabled.foreground */
      --sl-color-button-success-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.success.outline.disabled.border */
      --sl-color-button-success-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.success.outline.disabled.background */
      --sl-color-button-success-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.success.outline.disabled.border */
      --sl-color-button-success-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.success.outline.disabled.background */
      --sl-color-button-success-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.success.outline.disabled.foreground */
      --sl-color-button-success-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.success.outline.disabled.border */
      --sl-color-button-warning-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.warning.solid.disabled.background */
      --sl-color-button-warning-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.warning.solid.disabled.foreground */
      --sl-color-button-warning-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.warning.default.disabled.border */
      --sl-color-button-warning-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.warning.outline.disabled.background */
      --sl-color-button-warning-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.warning.outline.disabled.foreground */
      --sl-color-button-warning-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.warning.outline.disabled.border */
      --sl-color-button-warning-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.warning.outline.disabled.background */
      --sl-color-button-warning-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.warning.outline.disabled.border */
      --sl-color-button-warning-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.warning.outline.disabled.background */
      --sl-color-button-warning-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.warning.outline.disabled.foreground */
      --sl-color-button-warning-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.warning.outline.disabled.border */
      --sl-color-button-danger-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.danger.solid.disabled.background */
      --sl-color-button-danger-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.danger.solid.disabled.foreground */
      --sl-color-button-danger-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.danger.default.disabled.border */
      --sl-color-button-danger-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.danger.outline.disabled.background */
      --sl-color-button-danger-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.danger.outline.disabled.foreground */
      --sl-color-button-danger-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.danger.outline.disabled.border */
      --sl-color-button-danger-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.danger.outline.disabled.background */
      --sl-color-button-danger-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.danger.outline.disabled.border */
      --sl-color-button-danger-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.danger.outline.disabled.background */
      --sl-color-button-danger-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.danger.outline.disabled.foreground */
      --sl-color-button-danger-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.danger.outline.disabled.border */
      --sl-color-button-info-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.info.solid.disabled.background */
      --sl-color-button-info-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.info.solid.disabled.foreground */
      --sl-color-button-info-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.info.default.disabled.border */
      --sl-color-button-info-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-info-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-info-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-info-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-info-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-info-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-info-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-info-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.info.outline.disabled.border */
      --sl-color-input-option-default-unchecked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-focus-background: var(
        --sl-color-input-option-default-unchecked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-focus-border: var(
        --sl-color-input-option-default-unchecked-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-focus-icon: var(
        --sl-color-input-option-default-unchecked-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-default-border: var(
        --sl-color-input-option-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-hover-border: var(
        --sl-color-input-option-default-checked-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-active-border: var(
        --sl-color-input-option-default-checked-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-focus-border: var(
        --sl-color-input-option-default-checked-focus-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-disabled-border: var(
        --sl-color-input-option-default-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-focus-background: var(
        --sl-color-input-option-invalid-unchecked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-focus-border: var(
        --sl-color-input-option-invalid-unchecked-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-focus-icon: var(
        --sl-color-input-option-invalid-unchecked-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-disabled-background: var(
        --sl-color-input-option-default-unchecked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-disabled-border: var(
        --sl-color-input-option-default-unchecked-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-disabled-label: var(
        --sl-color-input-option-default-unchecked-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-disabled-icon: var(
        --sl-color-input-option-default-unchecked-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-default-border: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-hover-border: var(
        --sl-color-input-option-invalid-checked-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-active-border: var(
        --sl-color-input-option-invalid-checked-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-focus-background: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-disabled-background: var(
        --sl-color-input-option-default-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-disabled-label: var(
        --sl-color-input-option-default-checked-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-disabled-icon: var(
        --sl-color-input-option-default-checked-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-focus-background: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-100) * 100%),
        transparent
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-disabled-background: var(
        --sl-color-input-option-default-unchecked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-disabled-border: var(
        --sl-color-input-option-default-unchecked-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-disabled-label: var(
        --sl-color-input-option-default-unchecked-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-disabled-icon: var(
        --sl-color-input-option-default-unchecked-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-default-border: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-hover-border: var(
        --sl-color-input-option-valid-checked-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-active-border: var(
        --sl-color-input-option-valid-checked-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-focus-background: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-disabled-background: var(
        --sl-color-input-option-default-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-disabled-label: var(
        --sl-color-input-option-default-checked-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-disabled-icon: var(
        --sl-color-input-option-default-checked-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-icon: var(
        --sl-color-input-switch-default-unchecked-default-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-hover-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-hover-icon: var(
        --sl-color-input-switch-default-unchecked-hover-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-active-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-active-icon: var(
        --sl-color-input-switch-default-unchecked-active-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-focus-background: var(
        --sl-color-input-switch-default-unchecked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-focus-handle: var(
        --sl-color-input-switch-default-unchecked-default-handle
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-icon: var(
        --sl-color-input-switch-default-checked-default-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-hover-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-hover-icon: var(
        --sl-color-input-switch-default-checked-hover-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-active-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-active-icon: var(
        --sl-color-input-switch-default-checked-active-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-focus-background: var(
        --sl-color-input-switch-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-focus-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-disabled-background: var(
        --sl-color-input-switch-default-unchecked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-disabled-text: var(
        --sl-color-input-switch-default-unchecked-disabled-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-disabled-icon: var(
        --sl-color-input-switch-default-unchecked-disabled-icon
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-disabled-handle: var(
        --sl-color-input-switch-default-unchecked-disabled-handle
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-default-input-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-border: var(
        --sl-color-input-text-field-default-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-active-icon: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-active-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-focus-background: var(
        --sl-color-input-text-field-default-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-focus-border: var(
        --sl-color-input-text-field-default-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-focus-icon: var(
        --sl-color-input-text-field-default-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-focus-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-hover-icon: var(
        --sl-color-input-text-field-invalid-hover-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-border: var(
        --sl-color-input-text-field-default-active-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-active-icon: var(
        --sl-color-input-text-field-invalid-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-background: var(
        --sl-color-input-text-field-invalid-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-border: var(
        --sl-color-input-text-field-invalid-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-focus-icon: var(
        --sl-color-input-text-field-invalid-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-background: var(
        --sl-color-input-text-field-default-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-border: var(
        --sl-color-input-text-field-default-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-label: var(
        --sl-color-input-text-field-default-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-disabled-icon: var(
        --sl-color-input-text-field-default-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-input-text: var(
        --sl-color-input-text-field-default-disabled-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-placeholder: var(
        --sl-color-input-text-field-default-disabled-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-background: var(
        --sl-color-input-text-field-default-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-border: var(
        --sl-color-input-text-field-default-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-hover-icon: var(
        --sl-color-input-text-field-valid-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-border: var(
        --sl-color-input-text-field-default-active-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-active-icon: var(
        --sl-color-input-text-field-valid-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-background: var(
        --sl-color-input-text-field-valid-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-focus-icon: var(
        --sl-color-input-text-field-valid-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-background: var(
        --sl-color-input-text-field-default-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-border: var(
        --sl-color-input-text-field-default-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-label: var(
        --sl-color-input-text-field-default-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-disabled-icon: var(
        --sl-color-input-text-field-default-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-input-text: var(
        --sl-color-input-text-field-default-disabled-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-helper-icon-invalid: var(
        --sl-color-input-text-field-invalid-default-icon
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-text-default: var(--sl-body-foreground); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-icon-default: var(--sl-body-foreground); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-icon-invalid: var(
        --sl-color-input-text-field-invalid-default-icon
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-hint-disabled: var(
        --sl-color-input-field-label-text-disabled
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-hint-invalid: var(
        --sl-color-input-field-label-text-invalid
      ); /** color.surface.solid.primary.foreground */
      --sl-color-select-item-default-background: var(--sl-body-background);
      --sl-color-select-item-default-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-hover-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-active-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-focus-background: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-100) * 100%),
        transparent
      );
      --sl-color-select-item-focus-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-selectbox-default-default-background: var(--sl-color-input-text-field-default-default-background);
      --sl-color-select-selectbox-default-default-border: var(--sl-color-input-text-field-default-default-border);
      --sl-color-select-selectbox-default-default-icon: var(--sl-color-input-text-field-default-default-icon);
      --sl-color-select-selectbox-default-default-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      );
      --sl-color-select-selectbox-default-hover-background: var(--sl-color-input-text-field-default-hover-background);
      --sl-color-select-selectbox-default-hover-icon: var(--sl-color-input-text-field-default-hover-icon);
      --sl-color-select-selectbox-default-active-background: var(--sl-color-input-text-field-default-active-background);
      --sl-color-select-selectbox-default-disabled-background: var(
        --sl-color-input-text-field-default-disabled-background
      );
      --sl-color-select-selectbox-default-disabled-border: var(--sl-color-input-text-field-default-disabled-border);
      --sl-color-select-selectbox-default-disabled-label: var(--sl-color-input-text-field-default-disabled-label);
      --sl-color-select-selectbox-default-disabled-icon: var(--sl-color-input-text-field-default-disabled-icon);
      --sl-color-select-selectbox-default-disabled-input-text: var(
        --sl-color-input-text-field-default-disabled-input-text
      );
      --sl-color-select-selectbox-default-disabled-placeholder: var(
        --sl-color-input-text-field-default-disabled-placeholder
      );
      --sl-color-select-selectbox-invalid-default-background: var(--sl-color-input-text-field-invalid-default-background);
      --sl-color-select-selectbox-invalid-default-border: var(--sl-color-input-text-field-invalid-default-border);
      --sl-color-select-selectbox-invalid-default-icon: var(--sl-color-input-text-field-invalid-default-icon);
      --sl-color-select-selectbox-invalid-hover-background: var(--sl-color-input-text-field-invalid-hover-background);
      --sl-color-select-selectbox-invalid-hover-border: var(--sl-color-input-text-field-invalid-hover-border);
      --sl-color-select-selectbox-invalid-hover-placeholder: var(--sl-color-input-text-field-invalid-hover-placeholder);
      --sl-color-select-selectbox-invalid-active-background: var(--sl-color-input-text-field-invalid-active-background);
      --sl-color-select-selectbox-valid-default-icon: var(--sl-color-input-text-field-valid-default-icon);
      --sl-color-select-selectbox-valid-hover-background: var(--sl-color-input-text-field-valid-hover-background);
      --sl-color-select-selectbox-valid-active-background: var(--sl-color-input-text-field-valid-active-background);
      --sl-color-select-selectbox-valid-disabled-placeholder: var(
        --sl-color-input-text-field-default-disabled-placeholder
      );
      --sl-color-dialog-background: var(--sl-body-background); /** color.surface.solid.primary.background */
      --sl-color-dialog-foreground: var(--sl-body-foreground); /** color.surface.solid.primary.background */
      --sl-color-dialog-border: var(--sl-body-background); /** color.surface.solid.primary.background */
      --sl-color-popover-foreground: var(--sl-body-foreground);
      --sl-color-tab-default-background: var(--sl-body-background);
      --sl-color-tab-default-foreground: var(--sl-body-foreground);
      --sl-color-tab-hover-foreground: var(--sl-body-foreground);
      --sl-color-tab-disabled-background: var(--sl-body-background);
      --sl-color-tab-tabbar-background: var(--sl-body-background);
      --sl-color-tab-tabbar-foreground: var(--sl-body-foreground);
      --sl-color-tab-active-foreground: var(--sl-body-foreground);
      --sl-color-tab-content-background: var(--sl-body-background);
      --sl-color-tab-content-foreground: var(--sl-body-foreground);
      --sl-color-skeleton-shimmer: linear-gradient
        (
          90deg,
          var(--sl-color-skeleton-base) 0%,
          var(--sl-color-skeleton-base) 10%,
          var(--sl-color-skeleton-effect) 50%,
          var(--sl-color-skeleton-base) 90%,
          var(--sl-color-skeleton-base) 100%
        ); /** body.surface.100 */
      --sl-color-skeleton-plain: var(--sl-color-background-accent-grey-subtlest); /** Use for skeleton loading states. */
      --sl-color-skeleton-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for the pulse or shimmer effect in skeleton loading states. */
      --sl-color-card-background: var(--sl-body-background);
      --sl-color-card-foreground: var(--sl-body-foreground);
      --sl-color-accordion-default-background: var(--sl-body-background);
      --sl-color-accordion-default-header: var(--sl-body-background);
      --sl-color-accordion-default-foreground: var(--sl-body-foreground);
      --sl-color-accordion-default-icon: var(--sl-body-foreground);
      --sl-color-accordion-hover-background: var(--sl-body-background);
      --sl-color-accordion-hover-border: var(--sl-color-accordion-default-border);
      --sl-color-accordion-disabled-border: var(--sl-color-accordion-default-border);
      --sl-color-accordion-active-background: var(--sl-body-background);
      --sl-color-accordion-active-border: var(--sl-color-accordion-default-border);
      --sl-color-slds-checklist-background: var(--sl-body-background);
      --sl-color-slds-checklist-foreground: var(--sl-body-foreground);
      --sl-color-slds-checklist-link-idle: var(--sl-color-palette-info-400);
      --sl-color-tag-subtle-active-background: var(--sl-color-focusring-default);
      --sl-color-tag-subtle-close-hover-background: var(--sl-color-tag-subtle-hover-background);
      --sl-color-tag-subtle-close-hover-foreground: var(--sl-color-tag-subtle-hover-foreground);
      --sl-color-tag-subtle-close-active-border: var(--sl-color-tag-subtle-close-active-background);
      --sl-color-tag-bold-idle-background: var(--sl-color-palette-info-400);
      --sl-color-tag-bold-close-hover-background: var(--sl-color-tag-bold-hover-background);
      --sl-color-tag-bold-close-hover-foreground: var(--sl-color-tag-bold-hover-foreground);
      --sl-color-tag-bold-close-active-border: var(--sl-color-tag-bold-close-active-background);
      --sl-color-foreground-bold: var(--sl-color-foreground-accent-grey-bold); /** Use for headers and labels. */
      --sl-color-foreground-plain: var(--sl-color-foreground-accent-grey-plain); /** Use for body copy and menu items. */
      --sl-color-foreground-subtle: var(--sl-color-foreground-accent-grey-subtle); /** Use for subheadings. */
      --sl-color-foreground-subtlest: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for placeholders and hints. */
      --sl-color-foreground-selected-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-primary-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for primary actions on 'color.background.primary.muted' and 'color.background.primary.subtle'. */
      --sl-color-foreground-secondary-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-plain: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-info-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-positive-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
      --sl-color-foreground-caution-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for text that communicates caution to prevent mistakes or errors on neutral backgrounds. */
      --sl-color-foreground-caution-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for text that communicates caution to prevent mistakes or errors on caution backgrounds, such as 'color.background.caution.muted', and 'color.background.caution.subtle'. */
      --sl-color-foreground-negative-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-accent-blue-plain: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for blue text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-blue-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-plain: var(
        --sl-color-background-accent-green-bold
      ); /** Use for green text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-green-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.green.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-plain: var(
        --sl-color-background-accent-orange-bold
      ); /** Use for orange text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-orange-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.orange.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-plain: var(
        --sl-color-background-accent-purple-bold
      ); /** Use for purple text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-purple-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.purple.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-red-plain: var(
        --sl-color-background-accent-red-bold
      ); /** Use for red text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-red-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.red.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-plain: var(
        --sl-color-background-accent-teal-bold
      ); /** Use for teal text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-link-muted-idle: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for muted links in idle state. */
      --sl-color-link-muted-hover: var(--sl-color-link-hover); /** Use for muted links in hover state. */
      --sl-color-link-muted-active: var(--sl-color-link-active); /** Use for muted links in active state. */
      --sl-color-link-inverted-idle: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for inverted links in idle state. */
      --sl-color-border-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use to visually group or seperate UI elements, such as card, tabs or side panel dividers. */
      --sl-color-border-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** A neutral border option that passes min 3:1 contrast ratios. */
      --sl-color-border-disabled: var(
        --sl-color-border-accent-grey-faint
      ); /** Use for borders of elements in a disabled state. */
      --sl-color-border-secondary-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight secondary actions or messages on elevation.surface background colors. */
      --sl-color-border-secondary-bold: var(
        --sl-color-border-accent-grey-heavy
      ); /** Use for borders that highlight secondary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-neutral-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight neutral actions or messages on elevation.surface background colors. */
      --sl-color-border-neutral-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** Use for borders that highlight neutral actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-accent-blue-plain: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for plain blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for bold blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-plain: var(
        --sl-color-background-accent-green-bold
      ); /** Use for plain green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for bold green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-plain: var(
        --sl-color-background-accent-orange-bold
      ); /** Use for plain orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-bold: var(
        --sl-color-foreground-accent-orange-bold
      ); /** Use for bold orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-plain: var(
        --sl-color-background-accent-purple-bold
      ); /** Use for plain purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-bold: var(
        --sl-color-foreground-accent-purple-bold
      ); /** Use for bold purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-red-plain: var(
        --sl-color-background-accent-red-bold
      ); /** Use for plain red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-red-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for bold red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-plain: var(
        --sl-color-background-accent-teal-bold
      ); /** Use for plain teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-bold: var(
        --sl-color-foreground-accent-teal-bold
      ); /** Use for bold teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for plain yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for bold yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-background-input-interactive: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the input background to indicate the hover state. */
      --sl-color-background-selected-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for backgrounds of elements in selected state with bold emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-selected-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-primary-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** A vibrant background option used for primary actions. */
      --sl-color-background-primary-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-primary-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-secondary-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the secondary action color. */
      --sl-color-background-secondary-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the secondary action color. */
      --sl-color-background-secondary-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for secondary actions. */
      --sl-color-background-secondary-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-secondary-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the neutral action color. */
      --sl-color-background-neutral-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for neutral actions. */
      --sl-color-background-neutral-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-neutral-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-info-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for the background of actions with bold emphasis related to informative messages. */
      --sl-color-background-info-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-info-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-positive-subtlest: var(
        --sl-color-background-accent-green-subtlest
      ); /** The subtlest background option for communicating a positive outcome. */
      --sl-color-background-positive-subtle: var(
        --sl-color-background-accent-green-subtle
      ); /** A subtle background option for communicating a positive outcome. */
      --sl-color-background-positive-bold: var(
        --sl-color-background-accent-green-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate a positive outcome. */
      --sl-color-background-positive-interactive-bold: var(
        --sl-color-background-accent-green-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-positive-interactive-plain: var(
        --sl-color-background-accent-green-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-caution-subtlest: var(
        --sl-color-background-accent-yellow-subtlest
      ); /** The subtlest background option to communicate caution to prevent errors. */
      --sl-color-background-caution-subtle: var(
        --sl-color-background-accent-yellow-subtle
      ); /** A subtle background option to communicate caution to prevent errors. */
      --sl-color-background-caution-bold: var(
        --sl-color-background-accent-yellow-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate caution. */
      --sl-color-background-caution-interactive-bold: var(
        --sl-color-background-accent-yellow-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-caution-interactive-plain: var(
        --sl-color-background-accent-yellow-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-negative-subtlest: var(
        --sl-color-background-accent-red-subtlest
      ); /** The subtlest background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtle: var(
        --sl-color-background-accent-red-subtle
      ); /** A subtle background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-bold: var(
        --sl-color-background-accent-red-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-interactive-bold: var(
        --sl-color-background-accent-red-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-negative-interactive-plain: var(
        --sl-color-background-accent-red-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-subtlest: color-mix(
        in srgb,
        var(--sl-color-background-accent-blue-bold) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest blue background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtle: color-mix(
        in srgb,
        var(--sl-color-background-accent-blue-bold) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle blue background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for backgrounds of elements in a neutral state with subtle emphasis. */
      --sl-color-avatar-header: var(--sl-color-input-field-label-text-default);
      --sl-color-button-default-outline-selected-hover-foreground: var(
        --sl-color-button-default-outline-selected-idle-foreground
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-outline-selected-hover-border: var(
        --sl-color-button-default-outline-selected-idle-border
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-ghost-selected-idle-foreground: var(
        --sl-color-button-default-outline-selected-idle-foreground
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-ghost-selected-active-foreground: var(
        --sl-color-button-default-outline-selected-active-foreground
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-primary-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-success-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.success.outline.disabled.foreground */
      --sl-color-button-warning-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.warning.outline.disabled.foreground */
      --sl-color-button-danger-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.danger.outline.disabled.foreground */
      --sl-color-button-info-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-input-option-default-unchecked-focus-label: var(
        --sl-color-input-option-default-unchecked-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-focus-border: var(
        --sl-color-input-option-invalid-checked-focus-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-disabled-border: var(
        --sl-color-input-option-invalid-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-focus-border: var(
        --sl-color-input-option-valid-checked-focus-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-disabled-border: var(
        --sl-color-input-option-default-checked-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-focus-text: var(
        --sl-color-input-switch-default-unchecked-default-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-focus-icon: var(
        --sl-color-input-switch-default-unchecked-default-icon
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-focus-icon: var(
        --sl-color-input-switch-default-checked-default-icon
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-active-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-focus-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-focus-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-hover-border: var(
        --sl-color-input-text-field-default-hover-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-hover-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-border: var(
        --sl-color-input-text-field-valid-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-field-label-hint-default: var(
        --sl-color-input-field-label-text-default
      ); /** color.surface.solid.primary.foreground */
      --sl-color-select-selectbox-default-default-label: var(--sl-color-input-text-field-default-default-label);
      --sl-color-select-selectbox-default-default-input-text: var(--sl-color-input-text-field-default-default-input-text);
      --sl-color-select-selectbox-default-hover-border: var(--sl-color-input-text-field-default-hover-border);
      --sl-color-select-selectbox-default-hover-label: var(--sl-color-input-text-field-default-hover-label);
      --sl-color-select-selectbox-default-hover-placeholder: var(--sl-color-input-text-field-default-hover-placeholder);
      --sl-color-select-selectbox-default-active-label: var(--sl-color-input-text-field-default-active-label);
      --sl-color-select-selectbox-default-active-icon: var(--sl-color-input-text-field-default-active-icon);
      --sl-color-select-selectbox-default-active-placeholder: var(--sl-color-input-text-field-default-active-placeholder);
      --sl-color-select-selectbox-default-focus-background: var(--sl-color-input-text-field-default-focus-background);
      --sl-color-select-selectbox-default-focus-icon: var(--sl-color-input-text-field-default-focus-icon);
      --sl-color-select-selectbox-default-focus-placeholder: var(--sl-color-input-text-field-default-focus-placeholder);
      --sl-color-select-selectbox-invalid-default-label: var(--sl-color-input-text-field-invalid-default-label);
      --sl-color-select-selectbox-invalid-default-placeholder: var(
        --sl-color-input-text-field-invalid-default-placeholder
      );
      --sl-color-select-selectbox-invalid-hover-label: var(--sl-color-input-text-field-invalid-hover-label);
      --sl-color-select-selectbox-invalid-hover-icon: var(--sl-color-input-text-field-invalid-hover-icon);
      --sl-color-select-selectbox-invalid-active-border: var(--sl-color-input-text-field-invalid-active-border);
      --sl-color-select-selectbox-invalid-active-label: var(--sl-color-input-text-field-invalid-active-label);
      --sl-color-select-selectbox-invalid-active-icon: var(--sl-color-input-text-field-invalid-active-icon);
      --sl-color-select-selectbox-invalid-active-placeholder: var(--sl-color-input-text-field-invalid-active-placeholder);
      --sl-color-select-selectbox-invalid-focus-background: var(--sl-color-input-text-field-invalid-focus-background);
      --sl-color-select-selectbox-invalid-focus-border: var(--sl-color-input-text-field-invalid-focus-border);
      --sl-color-select-selectbox-invalid-focus-label: var(--sl-color-input-text-field-invalid-focus-label);
      --sl-color-select-selectbox-invalid-focus-icon: var(--sl-color-input-text-field-invalid-focus-icon);
      --sl-color-select-selectbox-invalid-focus-placeholder: var(--sl-color-input-text-field-invalid-focus-placeholder);
      --sl-color-select-selectbox-invalid-disabled-background: var(
        --sl-color-input-text-field-invalid-disabled-background
      );
      --sl-color-select-selectbox-invalid-disabled-border: var(--sl-color-input-text-field-invalid-disabled-border);
      --sl-color-select-selectbox-invalid-disabled-label: var(--sl-color-input-text-field-invalid-disabled-label);
      --sl-color-select-selectbox-invalid-disabled-icon: var(--sl-color-input-text-field-invalid-disabled-icon);
      --sl-color-select-selectbox-invalid-disabled-input-text: var(
        --sl-color-input-text-field-invalid-disabled-input-text
      );
      --sl-color-select-selectbox-invalid-disabled-placeholder: var(
        --sl-color-input-text-field-invalid-disabled-placeholder
      );
      --sl-color-select-selectbox-valid-default-background: var(--sl-color-input-text-field-valid-default-background);
      --sl-color-select-selectbox-valid-default-border: var(--sl-color-input-text-field-valid-default-border);
      --sl-color-select-selectbox-valid-default-label: var(--sl-color-input-text-field-valid-default-label);
      --sl-color-select-selectbox-valid-default-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-hover-label: var(--sl-color-input-text-field-valid-hover-label);
      --sl-color-select-selectbox-valid-hover-icon: var(--sl-color-input-text-field-valid-hover-icon);
      --sl-color-select-selectbox-valid-hover-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-active-border: var(--sl-color-input-text-field-valid-active-border);
      --sl-color-select-selectbox-valid-active-label: var(--sl-color-input-text-field-valid-active-label);
      --sl-color-select-selectbox-valid-active-icon: var(--sl-color-input-text-field-valid-active-icon);
      --sl-color-select-selectbox-valid-active-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-focus-background: var(--sl-color-input-text-field-valid-focus-background);
      --sl-color-select-selectbox-valid-focus-label: var(--sl-color-input-text-field-valid-focus-label);
      --sl-color-select-selectbox-valid-focus-icon: var(--sl-color-input-text-field-valid-focus-icon);
      --sl-color-select-selectbox-valid-focus-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-disabled-background: var(--sl-color-input-text-field-valid-disabled-background);
      --sl-color-select-selectbox-valid-disabled-border: var(--sl-color-input-text-field-valid-disabled-border);
      --sl-color-select-selectbox-valid-disabled-label: var(--sl-color-input-text-field-valid-disabled-label);
      --sl-color-select-selectbox-valid-disabled-icon: var(--sl-color-input-text-field-valid-disabled-icon);
      --sl-color-select-selectbox-valid-disabled-input-text: var(--sl-color-input-text-field-valid-disabled-input-text);
      --sl-color-select-listbox-border: var(--sl-color-select-selectbox-default-default-border);
      --sl-color-tag-subtle-close-hover-border: var(--sl-color-tag-subtle-close-hover-background);
      --sl-color-tag-bold-close-hover-border: var(--sl-color-tag-bold-close-hover-background);
      --sl-color-tag-bold-close-active-foreground: var(--sl-color-tag-bold-close-hover-foreground);
      --sl-color-foreground-brand: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for non-interactive brand-reinforcing text. */
      --sl-color-foreground-selected-plain: var(--sl-color-foreground-accent-blue-plain);
      --sl-color-foreground-selected-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-primary-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for primary actions on 'color.background.primary.bold' */
      --sl-color-foreground-info-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for text that communicates informative messages the user needs to be aware of on neutral backgrounds. */
      --sl-color-foreground-info-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.bold'. */
      --sl-color-foreground-positive-plain: var(
        --sl-color-foreground-accent-green-plain
      ); /** Use for text that communicates a favorable outcome on neutral backgrounds.' */
      --sl-color-foreground-positive-onBold: var(
        --sl-color-foreground-accent-green-onBold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.bold'. */
      --sl-color-foreground-negative-plain: var(
        --sl-color-foreground-accent-red-plain
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on neutral backgrounds. */
      --sl-color-foreground-negative-onBold: var(
        --sl-color-foreground-accent-red-onBold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.bold'. */
      --sl-color-foreground-accent-grey-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.grey.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-onInverted: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.inverted', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.yellow.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-link-idle: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for links in their default or hovered state. */
      --sl-color-border-selected: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that emphasize selected states, such as tabs or menu items. */
      --sl-color-border-input: var(
        --sl-color-border-bold
      ); /** Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons. */
      --sl-color-border-primary-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight primary actions or messages on elevation.surface background colors. */
      --sl-color-border-primary-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight primary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-info-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight informative actions or messages on elevation.surface background colors. */
      --sl-color-border-info-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight informative actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-positive-plain: var(
        --sl-color-border-accent-green-plain
      ); /** Use for borders that highlight a favorable outcome on elevation.surface background colors. */
      --sl-color-border-positive-bold: var(
        --sl-color-border-accent-green-bold
      ); /** Use for borders that highlight a favorable outcome on muted, subtlest and subtle background colors. */
      --sl-color-border-caution-plain: var(
        --sl-color-border-accent-yellow-plain
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on elevation.surface background colors. */
      --sl-color-border-caution-bold: var(
        --sl-color-border-accent-yellow-bold
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on muted, subtlest and subtle background colors. */
      --sl-color-border-negative-plain: var(
        --sl-color-border-accent-red-plain
      ); /** Use for borders that highlight negative or serious error states on elevation.surface background colors. */
      --sl-color-border-negative-bold: var(
        --sl-color-border-accent-red-bold
      ); /** Use for borders that highlight negative or serious error states on muted, subtlest and subtle background colors. */
      --sl-color-background-selected-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-selected-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** Use for backgrounds of elements in selected state with subtle emphasis, such as in opened dropdowns. */
      --sl-color-background-primary-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-primary-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background in the primary action color. */
      --sl-color-background-info-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background for informative messages. */
      --sl-color-background-info-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background for informative messages. */
      --sl-color-background-bold: var(
        --sl-color-border-bold
      ); /** Use for backgrounds of elements in a neutral state that require a bold emphasis or a minimum color contrast of 3:1, such as switch backgrounds. */
      --sl-color-background-interactive-bold: var(
        --sl-color-background-neutral-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-interactive-plain: var(
        --sl-color-background-neutral-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-button-default-ghost-selected-hover-foreground: var(
        --sl-color-button-default-outline-selected-hover-foreground
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-select-selectbox-default-hover-input-text: var(--sl-color-input-text-field-default-hover-input-text);
      --sl-color-select-selectbox-default-active-input-text: var(--sl-color-input-text-field-default-active-input-text);
      --sl-color-select-selectbox-default-focus-label: var(--sl-color-input-text-field-default-focus-label);
      --sl-color-select-selectbox-default-focus-input-text: var(--sl-color-input-text-field-default-focus-input-text);
      --sl-color-select-selectbox-invalid-default-input-text: var(--sl-color-input-text-field-invalid-default-input-text);
      --sl-color-select-selectbox-invalid-hover-input-text: var(--sl-color-input-text-field-invalid-hover-input-text);
      --sl-color-select-selectbox-invalid-active-input-text: var(--sl-color-input-text-field-invalid-active-input-text);
      --sl-color-select-selectbox-invalid-focus-input-text: var(--sl-color-input-text-field-invalid-focus-input-text);
      --sl-color-select-selectbox-valid-default-input-text: var(--sl-color-input-text-field-valid-default-input-text);
      --sl-color-select-selectbox-valid-hover-border: var(--sl-color-input-text-field-valid-hover-border);
      --sl-color-select-selectbox-valid-hover-input-text: var(--sl-color-input-text-field-valid-hover-input-text);
      --sl-color-select-selectbox-valid-active-input-text: var(--sl-color-input-text-field-valid-active-input-text);
      --sl-color-select-selectbox-valid-focus-border: var(--sl-color-input-text-field-valid-focus-border);
      --sl-color-select-selectbox-valid-focus-input-text: var(--sl-color-input-text-field-valid-focus-input-text);
      --sl-color-foreground-secondary-onBold: var(
        --sl-color-foreground-accent-grey-onBold
      ); /** Use for secondary actions on 'color.background.secondary.bold' */
      --sl-color-foreground-neutral-onBold: var(
        --sl-color-foreground-accent-grey-onBold
      ); /** Use for neutral actions on 'color.background.neutral.bold' */
      --sl-color-foreground-caution-onBold: var(
        --sl-color-foreground-accent-yellow-onBold
      ); /** Use for text that communicates caution to prevent mistakes or errors on 'color.background.caution.bold'. */
    }
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --sl-opacity-interactive-bold-idle: 0;
      --sl-opacity-interactive-bold-hover: 0.2;
      --sl-opacity-interactive-bold-active: 0.4;
      --sl-opacity-interactive-plain-idle: 0;
      --sl-opacity-interactive-plain-hover: 0.25;
      --sl-opacity-interactive-plain-active: 0.35;
      --sl-opacity-muted: 0;
      --sl-opacity-subtlest: 0.25;
      --sl-opacity-subtle: 0.35;
      --sl-opacity-moderate: 0.8;
      --sl-opacity-bold: 1;
      --sl-color-palette-blue-100: #19288f;
      --sl-color-palette-blue-150: #1727b6;
      --sl-color-palette-blue-200: #142fe1;
      --sl-color-palette-blue-300: #1b43f5;
      --sl-color-palette-blue-400: #36f;
      --sl-color-palette-blue-500: #598eff;
      --sl-color-palette-blue-600: #8eb6ff;
      --sl-color-palette-blue-700: #bcd2ff;
      --sl-color-palette-blue-800: #d9e5ff;
      --sl-color-palette-blue-900: #eef4ff;
      --sl-color-palette-blue-050: #141a57;
      --sl-color-palette-green-100: #0a4a2c;
      --sl-color-palette-green-150: #0b5a34;
      --sl-color-palette-green-200: #0b7140;
      --sl-color-palette-green-300: #0d8e4c;
      --sl-color-palette-green-400: #1aaf60;
      --sl-color-palette-green-500: #45cc80;
      --sl-color-palette-green-600: #75e0a1;
      --sl-color-palette-green-700: #abefc3;
      --sl-color-palette-green-800: #d3f8de;
      --sl-color-palette-green-900: #edfcf2;
      --sl-color-palette-green-050: #042a19;
      --sl-color-palette-grey-100: #393f46;
      --sl-color-palette-grey-150: #59636e;
      --sl-color-palette-grey-200: #818b98;
      --sl-color-palette-grey-300: #c8d1da;
      --sl-color-palette-grey-400: #d0d9e0;
      --sl-color-palette-grey-500: #dae0e7;
      --sl-color-palette-grey-600: #e0e6ea;
      --sl-color-palette-grey-700: #f0f2f5;
      --sl-color-palette-grey-800: #f6f8fa;
      --sl-color-palette-grey-900: #fff;
      --sl-color-palette-grey-050: #25292f;
      --sl-color-palette-grey-000: #222;
      --sl-color-palette-orange-100: #7e3410;
      --sl-color-palette-orange-150: #9d3d0f;
      --sl-color-palette-orange-200: #c64c08;
      --sl-color-palette-orange-300: #ef6707;
      --sl-color-palette-orange-400: #fe8211;
      --sl-color-palette-orange-500: #ff9d33;
      --sl-color-palette-orange-600: #ffc471;
      --sl-color-palette-orange-700: #ffdda8;
      --sl-color-palette-orange-800: #fff0d4;
      --sl-color-palette-orange-900: #fff8ed;
      --sl-color-palette-orange-050: #441706;
      --sl-color-palette-purple-100: #4711a1;
      --sl-color-palette-purple-150: #5512c5;
      --sl-color-palette-purple-200: #6616eb;
      --sl-color-palette-purple-300: #7b33ff;
      --sl-color-palette-purple-400: #824dff;
      --sl-color-palette-purple-500: #9f80ff;
      --sl-color-palette-purple-600: #bfaeff;
      --sl-color-palette-purple-700: #d9d2ff;
      --sl-color-palette-purple-800: #ece7ff;
      --sl-color-palette-purple-900: #f4f2ff;
      --sl-color-palette-purple-050: #29076e;
      --sl-color-palette-red-100: #84181b;
      --sl-color-palette-red-150: #a01418;
      --sl-color-palette-red-200: #c11419;
      --sl-color-palette-red-300: #e51d23;
      --sl-color-palette-red-400: #f83b41;
      --sl-color-palette-red-500: #ff575c;
      --sl-color-palette-red-600: #ffa0a3;
      --sl-color-palette-red-700: #ffc7c9;
      --sl-color-palette-red-800: #ffe1e2;
      --sl-color-palette-red-900: #fff1f1;
      --sl-color-palette-red-050: #480709;
      --sl-color-palette-teal-100: #0a5757;
      --sl-color-palette-teal-150: #066769;
      --sl-color-palette-teal-200: #008080;
      --sl-color-palette-teal-300: #00a8a5;
      --sl-color-palette-teal-400: #00d0c9;
      --sl-color-palette-teal-500: #15ece2;
      --sl-color-palette-teal-600: #4afef0;
      --sl-color-palette-teal-700: #8bfff5;
      --sl-color-palette-teal-800: #c5fffa;
      --sl-color-palette-teal-900: #eefffc;
      --sl-color-palette-teal-050: #003235;
      --sl-color-palette-yellow-100: #7c3a0b;
      --sl-color-palette-yellow-150: #984708;
      --sl-color-palette-yellow-200: #bb5c02;
      --sl-color-palette-yellow-300: #e28400;
      --sl-color-palette-yellow-400: #ffae00;
      --sl-color-palette-yellow-500: #ffcf1b;
      --sl-color-palette-yellow-600: #ffe146;
      --sl-color-palette-yellow-700: #fff085;
      --sl-color-palette-yellow-800: #fff7c5;
      --sl-color-palette-yellow-900: #fffdea;
      --sl-color-palette-yellow-050: #481d00;
      --sl-color-field-button-default-hover-background: rgb(
        255 255 255 / 7%
      ); /** color.button.default.hover.background */
      --sl-color-field-button-default-active-background: rgb(
        255 255 255 / 13%
      ); /** color.button.default.active.background */
      --sl-elevation-surface-base-default: var(
        --sl-color-palette-grey-000
      ); /** The default, flat surface level. Used for primary content backgrounds or non-interactive UI regions. */
      --sl-elevation-surface-raised-default: var(
        --sl-color-palette-grey-050
      ); /** Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-alternative: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 10%,
        transparent
      ); /** An alternate surface color used for visual differentiation in components like tables or lists, providing contrast between consecutive items (e.g., zebra striping). */
      --sl-elevation-surface-raised-sunken: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 5%,
        transparent
      ); /** Background for components that create a sunken effect, typically used for grouping related items. */
      --sl-elevation-surface-raised-inverted: var(
        --sl-color-palette-grey-500
      ); /** Background of elevated components with an inverted background color like tooltips that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-shadow: var(--sl-color-transparant); /** Used as color for shadows. */
      --sl-box-shadow-focus: 0 0 0 3px rgb(51 102 255 / var(--sl-opacity-800));
      --sl-box-shadow-none: 0 0 0 0 var(--sl-color-palette-transparent-base); /** boxShadow.none */
      --sl-color-avatar-background: var(--sl-color-palette-accent-300);
      --sl-color-avatar-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-info-background: var(--sl-color-palette-info-300);
      --sl-color-badge-bold-info-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-danger-background: var(--sl-color-palette-danger-base);
      --sl-color-badge-bold-danger-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-success-background: var(--sl-color-palette-success-base);
      --sl-color-badge-bold-success-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-warning-background: var(--sl-color-palette-warning-base);
      --sl-color-badge-bold-warning-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-accent-background: var(--sl-color-palette-accent-300);
      --sl-color-badge-bold-accent-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-neutral-background: var(--sl-color-palette-neutral-400);
      --sl-color-badge-bold-neutral-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-bold-primary-background: var(--sl-color-palette-primary-50);
      --sl-color-badge-bold-primary-foreground: var(--sl-color-palette-black-base);
      --sl-color-badge-subtle-info-background: var(--sl-color-palette-info-800);
      --sl-color-badge-subtle-info-foreground: var(--sl-color-palette-info-300);
      --sl-color-badge-subtle-danger-background: var(--sl-color-palette-danger-800);
      --sl-color-badge-subtle-danger-foreground: var(--sl-color-palette-danger-base);
      --sl-color-badge-subtle-success-background: var(--sl-color-palette-success-800);
      --sl-color-badge-subtle-warning-background: var(--sl-color-palette-warning-900);
      --sl-color-badge-subtle-warning-foreground: var(--sl-color-palette-warning-400);
      --sl-color-badge-subtle-accent-background: var(--sl-color-palette-accent-800);
      --sl-color-badge-subtle-accent-foreground: var(--sl-color-palette-accent-300);
      --sl-color-badge-subtle-neutral-background: var(--sl-color-palette-neutral-800);
      --sl-color-badge-subtle-neutral-foreground: var(--sl-color-palette-neutral-200);
      --sl-color-badge-subtle-primary-background: var(--sl-color-palette-primary-800);
      --sl-color-badge-subtle-primary-foreground: var(--sl-color-palette-neutral-200);
      --sl-color-button-default-solid-idle-background: var(
        --sl-color-palette-white-base
      ); /** color.button.default.idle.background */
      --sl-color-button-default-solid-idle-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.default.idle.foreground */
      --sl-color-button-default-solid-idle-border: var(
        --sl-color-palette-white-base
      ); /** color.button.default.idle.border */
      --sl-color-button-default-solid-hover-background: var(
        --sl-color-palette-neutral-100
      ); /** color.button.default.hover.background */
      --sl-color-button-default-solid-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.default.hover.foreground */
      --sl-color-button-default-solid-hover-border: var(
        --sl-color-palette-primary-100
      ); /** color.button.default.hover.border */
      --sl-color-button-default-solid-active-background: var(
        --sl-color-palette-primary-150
      ); /** color.button.default.active.background */
      --sl-color-button-default-solid-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.default.active.foreground */
      --sl-color-button-default-solid-active-border: var(
        --sl-color-palette-primary-150
      ); /** color.button.default.active.border */
      --sl-color-button-default-solid-disabled-background: var(
        --sl-color-palette-neutral-500
      ); /** color.button.default.disabled.background */
      --sl-color-button-default-solid-disabled-foreground: var(
        --sl-color-palette-neutral-800
      ); /** color.button.default.disabled.foreground */
      --sl-color-button-default-solid-disabled-border: var(
        --sl-color-palette-neutral-500
      ); /** color.button.default.disabled.border */
      --sl-color-button-default-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-outline-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-outline-idle-border: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-outline-hover-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-outline-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-outline-hover-border: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-outline-active-background: var(
        --sl-color-palette-neutral-700
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-outline-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-outline-active-border: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-outline-disabled-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-outline-disabled-foreground: var(
        --sl-color-palette-neutral-500
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-outline-disabled-border: var(
        --sl-color-palette-neutral-500
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-default-outline-selected-idle-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-outline-selected-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-outline-selected-idle-border: var(
        --sl-color-palette-primary-50
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-outline-selected-hover-background: var(
        --sl-color-palette-neutral-700
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-outline-selected-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-outline-selected-hover-border: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-outline-selected-active-background: var(
        --sl-color-palette-primary-600
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-outline-selected-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-outline-selected-active-border: var(
        --sl-color-palette-primary-50
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-ghost-idle-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-ghost-hover-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-ghost-hover-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-ghost-hover-border: var(
        --sl-color-palette-neutral-800
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-ghost-active-background: var(
        --sl-color-palette-neutral-700
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-ghost-active-foreground: var(
        --sl-color-palette-white-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-ghost-active-border: var(
        --sl-color-palette-neutral-700
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-ghost-disabled-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-ghost-disabled-foreground: var(
        --sl-color-palette-neutral-500
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-ghost-disabled-border: var(
        --sl-color-palette-neutral-800
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-default-ghost-selected-idle-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-ghost-selected-idle-foreground: var(
        --sl-color-palette-primary-50
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-ghost-selected-idle-border: var(
        --sl-color-palette-neutral-800
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-ghost-selected-hover-background: var(
        --sl-color-palette-neutral-700
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-ghost-selected-hover-foreground: var(
        --sl-color-palette-primary-50
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-ghost-selected-hover-border: var(
        --sl-color-palette-neutral-700
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-ghost-selected-active-background: var(
        --sl-color-palette-neutral-600
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-ghost-selected-active-foreground: var(
        --sl-color-palette-primary-50
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-ghost-selected-active-border: var(
        --sl-color-palette-neutral-600
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-ghost-selected-disabled-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-ghost-selected-disabled-foreground: var(
        --sl-color-palette-neutral-500
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-ghost-selected-disabled-border: var(
        --sl-color-palette-neutral-800
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-default-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.background */
      --sl-color-button-default-link-idle-foreground: var(
        --sl-color-palette-primary-200
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-button-default-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.idle.border */
      --sl-color-button-default-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.hover.background */
      --sl-color-button-default-link-hover-foreground: var(
        --sl-color-palette-neutral-150
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-button-default-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.hover.border */
      --sl-color-button-default-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.active.background */
      --sl-color-button-default-link-active-foreground: var(
        --sl-color-palette-neutral-100
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-default-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.outline.active.border */
      --sl-color-button-default-link-disabled-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-link-disabled-foreground: var(
        --sl-color-palette-neutral-500
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-link-disabled-border: var(
        --sl-color-palette-neutral-800
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-primary-solid-idle-background: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.solid.idle.background */
      --sl-color-button-primary-solid-idle-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.solid.idle.foreground */
      --sl-color-button-primary-solid-idle-border: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.solid.idle.border */
      --sl-color-button-primary-solid-hover-background: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.solid.hover.background */
      --sl-color-button-primary-solid-hover-foreground: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.solid.hover.foreground */
      --sl-color-button-primary-solid-hover-border: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.default.hover.border */
      --sl-color-button-primary-solid-active-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.primary.solid.active.background */
      --sl-color-button-primary-solid-active-foreground: var(
        --sl-color-palette-accent-200
      ); /** color.button.primary.solid.active.foreground */
      --sl-color-button-primary-solid-active-border: var(
        --sl-color-palette-accent-200
      ); /** color.button.primary.default.active.border */
      --sl-color-button-primary-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-primary-outline-idle-foreground: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-primary-outline-idle-border: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-primary-outline-hover-background: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-primary-outline-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-primary-outline-hover-border: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-primary-outline-active-background: var(
        --sl-color-palette-accent-200
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-primary-outline-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-primary-outline-active-border: var(
        --sl-color-palette-accent-200
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-primary-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-primary-ghost-idle-foreground: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-primary-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-primary-ghost-hover-background: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-primary-ghost-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-primary-ghost-hover-border: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-primary-ghost-active-background: var(
        --sl-color-palette-accent-200
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-primary-ghost-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-primary-ghost-active-border: var(
        --sl-color-palette-accent-200
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-primary-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-primary-link-idle-foreground: var(
        --sl-color-palette-accent-300
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-primary-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-primary-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-primary-link-hover-foreground: var(
        --sl-color-palette-accent-200
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-primary-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-primary-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-primary-link-active-foreground: var(
        --sl-color-palette-accent-150
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-primary-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-success-solid-idle-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.success.solid.idle.foreground */
      --sl-color-button-success-solid-hover-background: var(
        --sl-color-palette-black-base
      ); /** color.button.success.solid.hover.background */
      --sl-color-button-success-solid-active-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.success.solid.active.background */
      --sl-color-button-success-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.background */
      --sl-color-button-success-outline-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.success.outline.hover.foreground */
      --sl-color-button-success-outline-active-background: var(
        --sl-color-palette-success-200
      ); /** color.button.success.outline.active.background */
      --sl-color-button-success-outline-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.success.outline.active.foreground */
      --sl-color-button-success-outline-active-border: var(
        --sl-color-palette-success-200
      ); /** color.button.success.outline.active.border */
      --sl-color-button-success-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.background */
      --sl-color-button-success-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.border */
      --sl-color-button-success-ghost-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.success.outline.hover.foreground */
      --sl-color-button-success-ghost-active-background: var(
        --sl-color-palette-success-200
      ); /** color.button.success.outline.active.background */
      --sl-color-button-success-ghost-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.success.outline.active.foreground */
      --sl-color-button-success-ghost-active-border: var(
        --sl-color-palette-success-200
      ); /** color.button.success.outline.active.border */
      --sl-color-button-success-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.background */
      --sl-color-button-success-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.idle.border */
      --sl-color-button-success-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.hover.background */
      --sl-color-button-success-link-hover-foreground: var(
        --sl-color-palette-success-200
      ); /** color.button.success.outline.hover.foreground */
      --sl-color-button-success-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.hover.border */
      --sl-color-button-success-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.active.background */
      --sl-color-button-success-link-active-foreground: var(
        --sl-color-palette-success-150
      ); /** color.button.success.outline.active.foreground */
      --sl-color-button-success-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.success.outline.active.border */
      --sl-color-button-warning-solid-idle-background: var(
        --sl-color-palette-warning-400
      ); /** color.button.info.warning.idle.background */
      --sl-color-button-warning-solid-idle-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.warning.solid.idle.foreground */
      --sl-color-button-warning-solid-idle-border: var(
        --sl-color-palette-warning-400
      ); /** color.button.info.warning.idle.border */
      --sl-color-button-warning-solid-hover-background: var(
        --sl-color-palette-black-base
      ); /** color.button.warning.solid.hover.background */
      --sl-color-button-warning-solid-hover-foreground: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.solid.hover.foreground */
      --sl-color-button-warning-solid-hover-border: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.solid.hover.border */
      --sl-color-button-warning-solid-active-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.warning.solid.active.background */
      --sl-color-button-warning-solid-active-foreground: var(
        --sl-color-palette-warning-300
      ); /** color.button.warning.solid.active.foreground */
      --sl-color-button-warning-solid-active-border: var(
        --sl-color-palette-warning-300
      ); /** color.button.warning.solid.active.border */
      --sl-color-button-warning-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.background */
      --sl-color-button-warning-outline-idle-foreground: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.idle.foreground */
      --sl-color-button-warning-outline-idle-border: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.idle.border */
      --sl-color-button-warning-outline-hover-background: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.hover.background */
      --sl-color-button-warning-outline-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.warning.outline.hover.foreground */
      --sl-color-button-warning-outline-hover-border: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.hover.border */
      --sl-color-button-warning-outline-active-background: var(
        --sl-color-palette-warning-300
      ); /** color.button.warning.outline.active.background */
      --sl-color-button-warning-outline-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.warning.outline.active.foreground */
      --sl-color-button-warning-outline-active-border: var(
        --sl-color-palette-warning-300
      ); /** color.button.warning.outline.active.border */
      --sl-color-button-warning-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.background */
      --sl-color-button-warning-ghost-idle-foreground: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.idle.foreground */
      --sl-color-button-warning-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.border */
      --sl-color-button-warning-ghost-hover-background: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.hover.background */
      --sl-color-button-warning-ghost-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.warning.outline.hover.foreground */
      --sl-color-button-warning-ghost-hover-border: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.hover.border */
      --sl-color-button-warning-ghost-active-background: var(
        --sl-color-palette-warning-300
      ); /** color.button.warning.outline.active.background */
      --sl-color-button-warning-ghost-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.warning.outline.active.foreground */
      --sl-color-button-warning-ghost-active-border: var(
        --sl-color-palette-warning-300
      ); /** color.button.warning.outline.active.border */
      --sl-color-button-warning-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.background */
      --sl-color-button-warning-link-idle-foreground: var(
        --sl-color-palette-warning-400
      ); /** color.button.warning.outline.idle.foreground */
      --sl-color-button-warning-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.idle.border */
      --sl-color-button-warning-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.hover.background */
      --sl-color-button-warning-link-hover-foreground: var(
        --sl-color-palette-warning-300
      ); /** color.button.warning.outline.hover.foreground */
      --sl-color-button-warning-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.hover.border */
      --sl-color-button-warning-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.active.background */
      --sl-color-button-warning-link-active-foreground: var(
        --sl-color-palette-warning-200
      ); /** color.button.warning.outline.active.foreground */
      --sl-color-button-warning-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.warning.outline.active.border */
      --sl-color-button-danger-solid-idle-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.danger.solid.idle.foreground */
      --sl-color-button-danger-solid-hover-background: var(
        --sl-color-palette-black-base
      ); /** color.button.danger.solid.hover.background */
      --sl-color-button-danger-solid-active-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.danger.solid.active.background */
      --sl-color-button-danger-solid-active-foreground: var(
        --sl-color-palette-danger-200
      ); /** color.button.danger.solid.active.foreground */
      --sl-color-button-danger-solid-active-border: var(
        --sl-color-palette-danger-200
      ); /** color.button.danger.solid.active.border */
      --sl-color-button-danger-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.background */
      --sl-color-button-danger-outline-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.danger.outline.hover.foreground */
      --sl-color-button-danger-outline-active-background: var(
        --sl-color-palette-danger-200
      ); /** color.button.danger.outline.active.background */
      --sl-color-button-danger-outline-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.danger.outline.active.foreground */
      --sl-color-button-danger-outline-active-border: var(
        --sl-color-palette-danger-200
      ); /** color.button.danger.outline.active.border */
      --sl-color-button-danger-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.background */
      --sl-color-button-danger-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.border */
      --sl-color-button-danger-ghost-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.danger.outline.hover.foreground */
      --sl-color-button-danger-ghost-active-background: var(
        --sl-color-palette-danger-200
      ); /** color.button.danger.outline.active.background */
      --sl-color-button-danger-ghost-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.danger.outline.active.foreground */
      --sl-color-button-danger-ghost-active-border: var(
        --sl-color-palette-danger-200
      ); /** color.button.danger.outline.active.border */
      --sl-color-button-danger-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.background */
      --sl-color-button-danger-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.idle.border */
      --sl-color-button-danger-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.hover.background */
      --sl-color-button-danger-link-hover-foreground: var(
        --sl-color-palette-danger-200
      ); /** color.button.danger.outline.hover.foreground */
      --sl-color-button-danger-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.hover.border */
      --sl-color-button-danger-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.active.background */
      --sl-color-button-danger-link-active-foreground: var(
        --sl-color-palette-danger-150
      ); /** color.button.danger.outline.active.foreground */
      --sl-color-button-danger-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.danger.outline.active.border */
      --sl-color-button-info-solid-idle-background: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.solid.idle.background */
      --sl-color-button-info-solid-idle-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.solid.idle.foreground */
      --sl-color-button-info-solid-idle-border: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.solid.idle.border */
      --sl-color-button-info-solid-hover-background: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.solid.hover.background */
      --sl-color-button-info-solid-hover-foreground: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.solid.hover.foreground */
      --sl-color-button-info-solid-hover-border: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.default.hover.border */
      --sl-color-button-info-solid-active-background: var(
        --sl-color-palette-neutral-800
      ); /** color.button.primary.solid.active.background */
      --sl-color-button-info-solid-active-foreground: var(
        --sl-color-palette-info-200
      ); /** color.button.primary.solid.active.foreground */
      --sl-color-button-info-solid-active-border: var(
        --sl-color-palette-info-200
      ); /** color.button.primary.default.active.border */
      --sl-color-button-info-outline-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-info-outline-idle-foreground: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-info-outline-idle-border: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-info-outline-hover-background: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-info-outline-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-info-outline-hover-border: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-info-outline-active-background: var(
        --sl-color-palette-info-200
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-info-outline-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-info-outline-active-border: var(
        --sl-color-palette-info-200
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-info-ghost-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-info-ghost-idle-foreground: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-info-ghost-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-info-ghost-hover-background: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-info-ghost-hover-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-info-ghost-hover-border: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-info-ghost-active-background: var(
        --sl-color-palette-info-200
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-info-ghost-active-foreground: var(
        --sl-color-palette-black-base
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-info-ghost-active-border: var(
        --sl-color-palette-info-200
      ); /** color.button.primary.outline.active.border */
      --sl-color-button-info-link-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.background */
      --sl-color-button-info-link-idle-foreground: var(
        --sl-color-palette-info-300
      ); /** color.button.primary.outline.idle.foreground */
      --sl-color-button-info-link-idle-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.idle.border */
      --sl-color-button-info-link-hover-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.hover.background */
      --sl-color-button-info-link-hover-foreground: var(
        --sl-color-palette-info-200
      ); /** color.button.primary.outline.hover.foreground */
      --sl-color-button-info-link-hover-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.hover.border */
      --sl-color-button-info-link-active-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.active.background */
      --sl-color-button-info-link-active-foreground: var(
        --sl-color-palette-info-150
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-button-info-link-active-border: var(
        --sl-color-palette-transparent-base
      ); /** color.button.primary.outline.active.border */
      --sl-color-surface-solid-primary-background: var(
        --sl-color-palette-primary-base
      ); /** color.surface.solid.primary.background */
      --sl-color-surface-solid-primary-foreground: var(
        --sl-color-palette-primary-50
      ); /** color.surface.solid.primary.foreground */
      --sl-color-surface-solid-secondary-foreground: var(
        --sl-color-palette-accent-50
      ); /** color.surface.solid.secondary.foreground */
      --sl-color-surface-solid-accent-background: var(
        --sl-color-palette-accent-base
      ); /** color.surface.solid.accent.background */
      --sl-color-surface-solid-accent-foreground: var(
        --sl-color-palette-accent-50
      ); /** color.surface.solid.accent.foreground */
      --sl-color-input-option-default-unchecked-default-border: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-hover-background: var(
        --sl-color-palette-neutral-900
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-hover-border: var(
        --sl-color-palette-accent-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-active-background: var(
        --sl-color-palette-neutral-800
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-active-border: var(
        --sl-color-palette-accent-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-disabled-background: var(
        --sl-color-palette-neutral-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-disabled-border: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-disabled-label: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-disabled-icon: var(
        --sl-color-palette-neutral-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-default-background: var(
        --sl-color-palette-accent-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-hover-background: var(
        --sl-color-palette-accent-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-active-background: var(
        --sl-color-palette-accent-150
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-focus-background: var(
        --sl-color-palette-accent-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-disabled-background: var(
        --sl-color-palette-neutral-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-disabled-label: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-disabled-icon: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-hover-background: var(
        --sl-color-palette-neutral-900
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-active-background: var(
        --sl-color-palette-neutral-800
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-hover-background: var(
        --sl-color-palette-danger-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-active-background: var(
        --sl-color-palette-danger-150
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-default-border: var(
        --sl-color-palette-success-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-hover-border: var(
        --sl-color-palette-success-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-active-border: var(
        --sl-color-palette-success-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-default-background: var(
        --sl-color-palette-success-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-active-background: var(
        --sl-color-palette-success-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-disabled-label: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-disabled-icon: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-background: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-handle: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-hover-background: var(
        --sl-color-palette-neutral-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-hover-handle: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-active-background: var(
        --sl-color-palette-neutral-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-active-handle: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-disabled-background: var(
        --sl-color-palette-neutral-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-disabled-text: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-disabled-icon: var(
        --sl-color-palette-neutral-700
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-disabled-handle: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-background: var(
        --sl-color-palette-success-200
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-handle: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-hover-handle: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-active-background: var(
        --sl-color-palette-success-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-active-handle: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-focus-handle: var(
        --sl-color-palette-black-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-border: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-placeholder: var(
        --sl-color-palette-neutral-300
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-background: var(
        --sl-color-palette-neutral-900
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-active-border: var(
        --sl-color-palette-accent-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-focus-border: var(
        --sl-color-palette-primary-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-background: var(
        --sl-color-palette-neutral-700
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-border: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-label: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-disabled-icon: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-disabled-input-text: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-disabled-placeholder: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-border: var(
        --sl-color-palette-danger-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-background: var(
        --sl-color-palette-neutral-900
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-icon: var(
        --sl-color-palette-success-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-hover-icon: var(
        --sl-color-palette-success-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-icon: var(
        --sl-color-palette-success-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-icon: var(
        --sl-color-palette-success-base
      ); /** color.surface.solid.primary.background */
      --sl-color-input-helper-text-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-text-invalid: var(
        --sl-color-palette-danger-200
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-icon-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-icon-invalid: var(
        --sl-color-palette-danger-200
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-text-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-text-invalid: var(
        --sl-color-palette-danger-200
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-icon-disabled: var(
        --sl-color-palette-neutral-400
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-icon-invalid: var(
        --sl-color-palette-danger-200
      ); /** color.surface.solid.primary.foreground */
      --sl-color-tooltip-background: var(--sl-color-palette-white-base);
      --sl-color-tooltip-foreground: var(--sl-color-palette-black-base);
      --sl-color-tooltip-border: var(--sl-color-palette-transparent-base);
      --sl-color-focusring-default: var(--sl-color-palette-accent-300);
      --sl-color-focusring-inversed: var(--sl-color-palette-black-base);
      --sl-color-popover-border: var(--sl-color-palette-neutral-400);
      --sl-color-inline-message-info-foreground: var(--sl-color-palette-info-300);
      --sl-color-inline-message-info-border: var(--sl-color-palette-info-300);
      --sl-color-inline-message-info-icon: var(--sl-color-palette-info-300);
      --sl-color-inline-message-success-foreground: var(--sl-color-palette-success-base);
      --sl-color-inline-message-success-border: var(--sl-color-palette-success-base);
      --sl-color-inline-message-success-icon: var(--sl-color-palette-success-base);
      --sl-color-inline-message-warning-foreground: var(--sl-color-palette-warning-base);
      --sl-color-inline-message-warning-border: var(--sl-color-palette-warning-base);
      --sl-color-inline-message-warning-icon: var(--sl-color-palette-warning-base);
      --sl-color-inline-message-danger-foreground: var(--sl-color-palette-danger-base);
      --sl-color-inline-message-danger-border: var(--sl-color-palette-danger-base);
      --sl-color-inline-message-danger-icon: var(--sl-color-palette-danger-base);
      --sl-color-select-item-default-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-hover-background: color-mix(
        in srgb,
        var(--sl-color-palette-accent-base) calc(var(--sl-opacity-500) * 100%),
        transparent
      );
      --sl-color-select-item-hover-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-active-background: color-mix(
        in srgb,
        var(--sl-color-palette-accent-base) calc(var(--sl-opacity-700) * 100%),
        transparent
      );
      --sl-color-select-item-active-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-focus-foreground: var(--sl-color-palette-neutral-600)
        var(--sl-color-input-text-field-default-default-input-text);
      --sl-color-select-item-focus-indicator: var(--sl-color-palette-accent-base);
      --sl-color-select-item-disabled-foreground: var(--sl-color-palette-neutral-300);
      --sl-color-select-item-disabled-indicator: var(--sl-color-palette-neutral-300);
      --sl-color-select-item-divider-line: var(--sl-color-palette-neutral-700);
      --sl-color-select-item-group-title-foreground: var(--sl-color-palette-neutral-200);
      --sl-color-select-selectbox-default-active-border: var(--sl-color-palette-primary-base);
      --sl-color-select-selectbox-default-focus-border: var(--sl-color-palette-primary-base);
      --sl-color-select-listbox-border: var(--sl-color-palette-neutral-400);
      --sl-color-skeleton-base: var(--sl-color-palette-neutral-700); /** body.surface.100 */
      --sl-color-skeleton-effect: var(--sl-color-palette-neutral-800); /** body.surface.100 */
      --sl-color-skeleton-pulse: var(--sl-color-palette-neutral-700); /** body.surface.100 */
      --sl-color-tab-default-border: var(--sl-color-palette-neutral-700);
      --sl-color-tab-default-indicator: var(--sl-color-palette-accent-base);
      --sl-color-tab-hover-background: var(--sl-color-palette-neutral-900);
      --sl-color-tab-hover-border: var(--sl-color-palette-neutral-700);
      --sl-color-tab-disabled-background: var(--sl-color-palette-neutral-700);
      --sl-color-tab-disabled-foreground: var(--sl-color-palette-neutral-400);
      --sl-color-tab-disabled-border: var(--sl-color-palette-neutral-700);
      --sl-color-tab-tabbar-border: var(--sl-color-palette-neutral-700);
      --sl-color-tab-active-background: var(--sl-color-palette-neutral-800);
      --sl-color-tab-active-border: var(--sl-color-palette-neutral-700);
      --sl-color-slds-checklist-border: var(--sl-color-palette-neutral-800);
      --sl-color-slds-checklist-divider: var(--sl-color-palette-neutral-800);
      --sl-color-slds-checklist-icon-success: var(--sl-color-palette-success-400);
      --sl-color-slds-checklist-link-idle: var(--sl-color-palette-info-300);
      --sl-color-slds-checklist-link-hover: var(--sl-color-palette-info-200);
      --sl-color-slds-checklist-link-active: var(--sl-color-palette-info-150);
      --sl-color-accordion-default-border: var(--sl-color-palette-neutral-700);
      --sl-color-accordion-hover-header: color-mix(
        in srgb,
        var(--sl-color-palette-accent-base) calc(var(--sl-opacity-200) * 100%),
        transparent
      );
      --sl-color-accordion-hover-foreground: var(--sl-color-palette-accent-200);
      --sl-color-accordion-hover-icon: var(--sl-color-palette-accent-200);
      --sl-color-accordion-disabled-background: var(--sl-color-palette-neutral-900);
      --sl-color-accordion-disabled-header: var(--sl-color-palette-neutral-900);
      --sl-color-accordion-disabled-foreground: var(--sl-color-palette-neutral-400);
      --sl-color-accordion-disabled-icon: var(--sl-color-palette-neutral-400);
      --sl-color-accordion-active-header: color-mix(
        in srgb,
        var(--sl-color-palette-accent-base) calc(var(--sl-opacity-400) * 100%),
        transparent
      );
      --sl-color-accordion-active-foreground: var(--sl-color-palette-accent-200);
      --sl-color-accordion-active-icon: var(--sl-color-palette-accent-200);
      --sl-color-card-border: var(--sl-color-palette-neutral-800);
      --sl-color-breadcrumb-divider: var(
        --sl-color-palette-neutral-200
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-href-idle-foreground: var(
        --sl-color-palette-neutral-500
      ); /** color.button.default.outline.idle.foreground */
      --sl-color-href-hover-foreground: var(
        --sl-color-palette-accent-base
      ); /** color.button.default.outline.hover.foreground */
      --sl-color-href-active-foreground: var(
        --sl-color-palette-accent-900
      ); /** color.button.primary.outline.active.foreground */
      --sl-color-href-disabled-foreground: var(
        --sl-color-palette-neutral-200
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-field-button-default-idle-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.idle.background */
      --sl-color-field-button-default-disabled-background: var(
        --sl-color-palette-transparent-base
      ); /** color.button.default.disabled.background */
      --sl-color-field-button-default-disabled-foreground: var(
        --sl-color-palette-neutral-100
      ); /** color.button.default.disabled.foreground */
      --sl-color-progressbar-active-track: var(--sl-color-palette-accent-base);
      --sl-color-progressbar-success-track: var(--sl-color-palette-success-500);
      --sl-color-progressbar-error-track: var(--sl-color-palette-danger-500);
      --sl-color-progressbar-indeterminate-track: var(--sl-color-palette-accent-base);
      --sl-color-progressbar-warning-track: var(--sl-color-palette-warning-500);
      --sl-color-progressbar-background: var(--sl-color-palette-neutral-150);
      --sl-color-tag-subtle-idle-background: var(--sl-color-palette-info-900);
      --sl-color-tag-subtle-idle-foreground: var(--sl-color-palette-accent-300);
      --sl-color-tag-subtle-idle-border: var(--sl-color-palette-info-800);
      --sl-color-tag-subtle-hover-background: var(--sl-color-palette-info-800);
      --sl-color-tag-subtle-hover-foreground: var(--sl-color-palette-accent-300);
      --sl-color-tag-subtle-hover-border: var(--sl-color-palette-info-700);
      --sl-color-tag-subtle-active-background: var(--sl-color-palette-info-300);
      --sl-color-tag-subtle-active-foreground: var(--sl-color-palette-black-base);
      --sl-color-tag-subtle-disabled-background: var(--sl-color-palette-neutral-500);
      --sl-color-tag-subtle-disabled-foreground: var(--sl-color-palette-neutral-800);
      --sl-color-tag-subtle-disabled-border: var(--sl-color-palette-neutral-800);
      --sl-color-tag-subtle-close-active-background: var(--sl-color-palette-accent-700);
      --sl-color-tag-subtle-close-active-foreground: var(--sl-color-palette-accent-300);
      --sl-color-tag-bold-idle-background: var(--sl-color-palette-info-300);
      --sl-color-tag-bold-idle-foreground: var(--sl-color-palette-black-base);
      --sl-color-tag-bold-hover-background: var(--sl-color-palette-info-200);
      --sl-color-tag-bold-hover-foreground: var(--sl-color-palette-black-base);
      --sl-color-tag-bold-hover-border: var(--sl-color-palette-info-300);
      --sl-color-tag-bold-active-background: var(--sl-color-palette-info-900);
      --sl-color-tag-bold-active-foreground: var(--sl-color-palette-info-300);
      --sl-color-tag-bold-active-border: var(--sl-color-palette-info-800);
      --sl-color-tag-bold-disabled-background: var(--sl-color-palette-neutral-500);
      --sl-color-tag-bold-disabled-foreground: var(--sl-color-palette-neutral-800);
      --sl-color-tag-bold-disabled-border: var(--sl-color-palette-neutral-800);
      --sl-color-tag-bold-close-active-background: var(--sl-color-palette-info-500);
      --sl-color-foreground-selected-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-secondary-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-inverted-plain: var(--sl-color-palette-grey-000); /** Use for plain inverted text. */
      --sl-color-foreground-inverted-bold: var(
        --sl-color-palette-grey-000
      ); /** Use for inverted text on 'color.background.inverted.subtlest', and 'color.background.inverted.subtle'. */
      --sl-color-foreground-accent-blue-plain: var(
        --sl-color-palette-blue-600
      ); /** Use for blue text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-blue-bold: var(
        --sl-color-palette-blue-700
      ); /** Use for blue text on 'color.background.accent.blue.muted' or 'color.background.accent.blue.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-plain: var(
        --sl-color-palette-green-500
      ); /** Use for green text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-green-bold: var(
        --sl-color-palette-green-700
      ); /** Use for green text on 'color.background.accent.green.muted' or 'color.background.accent.green.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-faint: var(
        --sl-color-palette-grey-300
      ); /** Use for faint text on neutral backgrounds, providing low contrast. Not intended for primary content, as it does not meet WCAG 2.2 AA contrast requirements. Use sparingly where accessibility isn't a critical concern. */
      --sl-color-foreground-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 47%,
        transparent
      ); /** Use for subtlest grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 60%,
        transparent
      ); /** Use for subtle grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 80%,
        transparent
      ); /** Use for plain grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-bold: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 87%,
        transparent
      ); /** Use for bold grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text on 'color.background.accent.grey.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-plain: var(
        --sl-color-palette-orange-500
      ); /** Use for orange text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-orange-bold: var(
        --sl-color-palette-orange-700
      ); /** Use for orange text on 'color.background.accent.orange.muted' or 'color.background.accent.orange.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-plain: var(
        --sl-color-palette-purple-600
      ); /** Use for purple text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-purple-bold: var(
        --sl-color-palette-purple-600
      ); /** Use for purple text on 'color.background.accent.purple.muted' or 'color.background.accent.purple.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-red-plain: var(
        --sl-color-palette-red-500
      ); /** Use for red text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-red-bold: var(
        --sl-color-palette-red-600
      ); /** Use for red text on 'color.background.accent.red.muted' or 'color.background.accent.red.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-plain: var(
        --sl-color-palette-teal-400
      ); /** Use for teal text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-bold: var(
        --sl-color-palette-teal-500
      ); /** Use for teal text on 'color.background.accent.teal.muted' or 'color.background.accent.teal.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-plain: var(
        --sl-color-palette-yellow-400
      ); /** Use for yellow text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-yellow-bold: var(
        --sl-color-palette-yellow-500
      ); /** Use for yellow text on 'color.background.accent.yellow.muted' or 'color.background.accent.yellow.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text on 'color.background.accent.yellow.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-link-hover: var(--sl-color-palette-blue-700); /** Use for links in hover state. */
      --sl-color-link-active: var(--sl-color-palette-blue-800); /** Use for links in active state. */
      --sl-color-link-inverted-hover: var(--sl-color-palette-blue-400); /** Use for inverted links in hover state. */
      --sl-color-link-inverted-active: var(--sl-color-palette-blue-300); /** Use for inverted links in active state. */
      --sl-color-link-focused-idle: var(
        --sl-color-palette-blue-700
      ); /** Used for the linkcolor of navigation aids in idle state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-hover: var(
        --sl-color-palette-blue-800
      ); /** Used for the linkcolor of navigation aids in hovered state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-active: var(
        --sl-color-palette-blue-900
      ); /** Used for the linkcolor of navigation aids in pressed state, such as skip links, when they are focused or visible. */
      --sl-color-border-inverted: var(--sl-color-palette-grey-000); /** Use for borders on bold backgrounds. */
      --sl-color-border-accent-blue-plain: var(
        --sl-color-palette-blue-500
      ); /** Use for plain blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-plain: var(
        --sl-color-palette-green-400
      ); /** Use for plain green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-faint: var(
        --sl-color-palette-grey-100
      ); /** Use for faint grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-plain: var(
        --sl-color-palette-grey-100
      ); /** Use for plain grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-bold: var(
        --sl-color-palette-grey-200
      ); /** Use for bold grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-plain: var(
        --sl-color-palette-orange-300
      ); /** Use for plain orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-plain: var(
        --sl-color-palette-purple-500
      ); /** Use for plain purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-red-plain: var(
        --sl-color-palette-red-400
      ); /** Use for plain red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-plain: var(
        --sl-color-palette-teal-300
      ); /** Use for plain teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-plain: var(
        --sl-color-palette-yellow-300
      ); /** Use for plain yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-background-disabled: var(
        --sl-color-palette-grey-100
      ); /** Use for backgrounds of elements in disabled state. */
      --sl-color-background-input-plain: var(
        --sl-color-palette-grey-050
      ); /** Use for backgrounds of form UI elements, such as text fields, checkboxes, and radio buttons. */
      --sl-color-background-selected-bold: var(
        --sl-color-palette-blue-500
      ); /** Use for backgrounds of elements in selected state with bold emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-interactive-bold: var(
        --sl-color-palette-blue-700
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-neutral-bold: var(
        --sl-color-palette-grey-100
      ); /** A vibrant background option used for neutral actions. */
      --sl-color-background-neutral-interactive-plain: var(
        --sl-color-palette-grey-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-blue-400) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest blue background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-blue-300) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle blue background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-bold: var(
        --sl-color-palette-blue-300
      ); /** A vibrant blue background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-interactive-bold: var(
        --sl-color-palette-grey-000
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-interactive-plain: var(
        --sl-color-palette-blue-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-green-200) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest green background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-green-200) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle green background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-bold: var(
        --sl-color-palette-green-200
      ); /** A vibrant green background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-interactive-bold: var(
        --sl-color-palette-green-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-interactive-plain: var(
        --sl-color-palette-green-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest grey background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle grey background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-bold: var(
        --sl-color-palette-grey-300
      ); /** A vibrant grey background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-interactive-bold: var(
        --sl-color-palette-grey-150
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-interactive-plain: var(
        --sl-color-palette-grey-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-orange-200) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest orange background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-orange-200) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle orange background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-bold: var(
        --sl-color-palette-orange-150
      ); /** A vibrant orange background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-interactive-bold: var(
        --sl-color-palette-orange-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-interactive-plain: var(
        --sl-color-palette-orange-300
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-purple-200) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest purple background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-purple-200) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle purple background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-bold: var(
        --sl-color-palette-purple-200
      ); /** A vibrant purple background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-interactive-bold: var(
        --sl-color-palette-purple-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-interactive-plain: var(
        --sl-color-palette-purple-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-red-150) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest red background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-red-150) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle red background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-bold: var(
        --sl-color-palette-red-200
      ); /** A vibrant red background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-interactive-bold: var(
        --sl-color-palette-red-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-interactive-plain: var(
        --sl-color-palette-red-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-teal-150) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest teal background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-teal-150) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle teal background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-bold: var(
        --sl-color-palette-teal-150
      ); /** A vibrant teal background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-interactive-bold: var(
        --sl-color-palette-teal-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-interactive-plain: var(
        --sl-color-palette-teal-200
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-150) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest yellow background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-150) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle yellow background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-bold: var(
        --sl-color-palette-yellow-400
      ); /** A vibrant yellow background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-interactive-bold: var(
        --sl-color-palette-yellow-100
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-interactive-plain: var(
        --sl-color-palette-yellow-300
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-inverted-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-dark-subtlest) * 100%),
        transparent
      ); /** The subtlest inverted background option. */
      --sl-color-background-inverted-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-dark-subtle) * 100%),
        transparent
      ); /** A subtle inverted background option. */
      --sl-color-background-inverted-bold: var(--sl-color-palette-grey-000); /** A solid inverted background option. */
      --sl-color-background-inverted-interactive-bold: var(
        --sl-color-palette-grey-150
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-inverted-interactive-plain: var(
        --sl-color-palette-grey-900
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-blanket-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) calc(var(--sl-opacity-dark-moderate) * 100%),
        transparent
      ); /** Use for screen overlay that appears with dialogs or drawers. */
      --sl-body-background: var(--sl-color-palette-black-base); /** color.body.default.background */
      --sl-body-foreground: var(--sl-color-palette-white-base); /** color.body.default.foreground */
      --sl-body-surface-100: var(--sl-color-palette-neutral-900); /** color.body.default.foreground */
      --sl-body-surface-200: var(--sl-color-palette-neutral-800); /** color.body.default.foreground */
      --sl-body-surface-overlay: color-mix(
        in srgb,
        var(--sl-color-palette-white-base) calc(var(--sl-opacity-500) * 100%),
        transparent
      ); /** body.surface.200 */
      --sl-color-avatar-header: var(--sl-body-foreground);
      --sl-color-avatar-subheader: var(--sl-body-foreground);
      --sl-color-badge-subtle-success-foreground: var(--sl-color-palette-success-300);
      --sl-color-button-default-outline-selected-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.info.outline.disabled.background */
      --sl-color-button-default-outline-selected-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.info.outline.disabled.foreground */
      --sl-color-button-default-outline-selected-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.info.outline.disabled.border */
      --sl-color-button-primary-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.primary.solid.disabled.background */
      --sl-color-button-primary-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.primary.solid.disabled.foreground */
      --sl-color-button-primary-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.primary.default.disabled.border */
      --sl-color-button-primary-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-primary-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-primary-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-primary-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-primary-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-primary-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-primary-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-primary-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-primary-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-success-solid-idle-background: var(
        --sl-color-palette-success-300
      ); /** color.button.success.solid.idle.background */
      --sl-color-button-success-solid-idle-border: var(
        --sl-color-palette-success-300
      ); /** color.button.success.solid.idle.border */
      --sl-color-button-success-solid-hover-foreground: var(
        --sl-color-palette-success-300
      ); /** color.button.success.solid.hover.foreground */
      --sl-color-button-success-solid-hover-border: var(
        --sl-color-palette-success-300
      ); /** color.button.success.solid.hover.border */
      --sl-color-button-success-solid-active-foreground: var(
        --sl-color-palette-success-300
      ); /** color.button.success.solid.active.foreground */
      --sl-color-button-success-solid-active-border: var(
        --sl-color-palette-success-300
      ); /** color.button.success.solid.active.border */
      --sl-color-button-success-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.success.solid.disabled.background */
      --sl-color-button-success-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.success.solid.disabled.foreground */
      --sl-color-button-success-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.success.solid.disabled.border */
      --sl-color-button-success-outline-idle-foreground: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.idle.foreground */
      --sl-color-button-success-outline-idle-border: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.idle.border */
      --sl-color-button-success-outline-hover-background: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.hover.background */
      --sl-color-button-success-outline-hover-border: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.hover.border */
      --sl-color-button-success-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.success.outline.disabled.background */
      --sl-color-button-success-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.success.outline.disabled.foreground */
      --sl-color-button-success-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.success.outline.disabled.border */
      --sl-color-button-success-ghost-idle-foreground: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.idle.foreground */
      --sl-color-button-success-ghost-hover-background: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.hover.background */
      --sl-color-button-success-ghost-hover-border: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.hover.border */
      --sl-color-button-success-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.success.outline.disabled.background */
      --sl-color-button-success-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.success.outline.disabled.foreground */
      --sl-color-button-success-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.success.outline.disabled.border */
      --sl-color-button-success-link-idle-foreground: var(
        --sl-color-palette-success-300
      ); /** color.button.success.outline.idle.foreground */
      --sl-color-button-success-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.success.outline.disabled.background */
      --sl-color-button-success-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.success.outline.disabled.foreground */
      --sl-color-button-success-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.success.outline.disabled.border */
      --sl-color-button-warning-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.warning.solid.disabled.background */
      --sl-color-button-warning-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.warning.solid.disabled.foreground */
      --sl-color-button-warning-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.warning.default.disabled.border */
      --sl-color-button-warning-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.warning.outline.disabled.background */
      --sl-color-button-warning-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.warning.outline.disabled.foreground */
      --sl-color-button-warning-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.warning.outline.disabled.border */
      --sl-color-button-warning-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.warning.outline.disabled.background */
      --sl-color-button-warning-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.warning.outline.disabled.foreground */
      --sl-color-button-warning-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.warning.outline.disabled.border */
      --sl-color-button-warning-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.warning.outline.disabled.background */
      --sl-color-button-warning-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.warning.outline.disabled.foreground */
      --sl-color-button-warning-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.warning.outline.disabled.border */
      --sl-color-button-danger-solid-idle-background: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.warning.idle.background */
      --sl-color-button-danger-solid-idle-border: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.warning.idle.border */
      --sl-color-button-danger-solid-hover-foreground: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.solid.hover.foreground */
      --sl-color-button-danger-solid-hover-border: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.solid.hover.border */
      --sl-color-button-danger-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.danger.solid.disabled.background */
      --sl-color-button-danger-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.danger.solid.disabled.foreground */
      --sl-color-button-danger-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.danger.default.disabled.border */
      --sl-color-button-danger-outline-idle-foreground: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.idle.foreground */
      --sl-color-button-danger-outline-idle-border: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.idle.border */
      --sl-color-button-danger-outline-hover-background: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.hover.background */
      --sl-color-button-danger-outline-hover-border: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.hover.border */
      --sl-color-button-danger-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.danger.outline.disabled.background */
      --sl-color-button-danger-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.danger.outline.disabled.foreground */
      --sl-color-button-danger-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.danger.outline.disabled.border */
      --sl-color-button-danger-ghost-idle-foreground: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.idle.foreground */
      --sl-color-button-danger-ghost-hover-background: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.hover.background */
      --sl-color-button-danger-ghost-hover-border: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.hover.border */
      --sl-color-button-danger-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.danger.outline.disabled.background */
      --sl-color-button-danger-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.danger.outline.disabled.foreground */
      --sl-color-button-danger-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.danger.outline.disabled.border */
      --sl-color-button-danger-link-idle-foreground: var(
        --sl-color-palette-danger-300
      ); /** color.button.danger.outline.idle.foreground */
      --sl-color-button-danger-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.danger.outline.disabled.background */
      --sl-color-button-danger-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.danger.outline.disabled.foreground */
      --sl-color-button-danger-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.danger.outline.disabled.border */
      --sl-color-button-info-solid-disabled-background: var(
        --sl-color-button-default-solid-disabled-background
      ); /** color.button.primary.solid.disabled.background */
      --sl-color-button-info-solid-disabled-foreground: var(
        --sl-color-button-default-solid-disabled-foreground
      ); /** color.button.primary.solid.disabled.foreground */
      --sl-color-button-info-solid-disabled-border: var(
        --sl-color-button-default-solid-disabled-border
      ); /** color.button.primary.default.disabled.border */
      --sl-color-button-info-outline-disabled-background: var(
        --sl-color-button-default-outline-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-info-outline-disabled-foreground: var(
        --sl-color-button-default-outline-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-info-outline-disabled-border: var(
        --sl-color-button-default-outline-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-info-ghost-disabled-background: var(
        --sl-color-button-default-ghost-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-info-ghost-disabled-foreground: var(
        --sl-color-button-default-ghost-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-info-ghost-disabled-border: var(
        --sl-color-button-default-ghost-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-button-info-link-disabled-background: var(
        --sl-color-button-default-link-disabled-background
      ); /** color.button.primary.outline.disabled.background */
      --sl-color-button-info-link-disabled-foreground: var(
        --sl-color-button-default-link-disabled-foreground
      ); /** color.button.primary.outline.disabled.foreground */
      --sl-color-button-info-link-disabled-border: var(
        --sl-color-button-default-link-disabled-border
      ); /** color.button.primary.outline.disabled.border */
      --sl-color-surface-solid-secondary-background: var(
        --sl-color-palette-accent-400
      ); /** color.surface.solid.secondary.background */
      --sl-color-input-option-default-unchecked-default-background: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-default-icon: var(
        --sl-color-input-option-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-hover-icon: var(
        --sl-color-input-option-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-unchecked-active-icon: var(
        --sl-color-input-option-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-focus-border: var(
        --sl-color-input-option-default-unchecked-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-focus-icon: var(
        --sl-color-input-option-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-default-border: var(
        --sl-color-input-option-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-default-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-hover-border: var(
        --sl-color-input-option-default-checked-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-hover-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-active-border: var(
        --sl-color-input-option-default-checked-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-active-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-focus-border: var(
        --sl-color-input-option-default-checked-focus-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-default-checked-focus-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-checked-disabled-border: var(
        --sl-color-input-option-default-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-default-background: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-default-border: var(
        --sl-color-palette-danger-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-hover-border: var(
        --sl-color-palette-danger-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-active-border: var(
        --sl-color-palette-danger-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-disabled-background: var(
        --sl-color-input-option-default-unchecked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-disabled-border: var(
        --sl-color-input-option-default-unchecked-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-disabled-label: var(
        --sl-color-input-option-default-unchecked-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-disabled-icon: var(
        --sl-color-input-option-default-unchecked-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-default-background: var(
        --sl-color-palette-danger-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-default-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-hover-border: var(
        --sl-color-input-option-invalid-checked-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-hover-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-active-border: var(
        --sl-color-input-option-invalid-checked-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-active-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-disabled-background: var(
        --sl-color-input-option-default-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-disabled-label: var(
        --sl-color-input-option-default-checked-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-disabled-icon: var(
        --sl-color-input-option-default-checked-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-default-icon: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-hover-background: var(
        --sl-color-input-option-default-unchecked-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-hover-icon: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-active-background: var(
        --sl-color-input-option-default-unchecked-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-active-icon: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-focus-border: var(
        --sl-color-input-option-valid-unchecked-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-focus-icon: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-disabled-background: var(
        --sl-color-input-option-default-unchecked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-disabled-border: var(
        --sl-color-input-option-default-unchecked-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-disabled-label: var(
        --sl-color-input-option-default-unchecked-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-unchecked-disabled-icon: var(
        --sl-color-input-option-default-unchecked-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-default-border: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-default-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-hover-background: var(
        --sl-color-palette-success-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-hover-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-hover-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-active-border: var(
        --sl-color-input-option-valid-checked-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-active-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-active-icon: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-focus-background: var(
        --sl-color-input-option-valid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-focus-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-valid-checked-disabled-background: var(
        --sl-color-input-option-default-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-default-icon: var(
        --sl-color-input-switch-default-unchecked-default-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-hover-icon: var(
        --sl-color-input-switch-default-unchecked-hover-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-active-icon: var(
        --sl-color-input-switch-default-unchecked-active-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-unchecked-focus-background: var(
        --sl-color-input-switch-default-unchecked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-focus-handle: var(
        --sl-color-input-switch-default-unchecked-default-handle
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-default-icon: var(
        --sl-color-input-switch-default-checked-default-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-hover-background: var(
        --sl-color-palette-success-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-hover-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-active-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-active-icon: var(
        --sl-color-input-switch-default-checked-active-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-focus-background: var(
        --sl-color-input-switch-default-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-focus-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-disabled-background: var(
        --sl-color-input-switch-default-unchecked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-disabled-text: var(
        --sl-color-input-switch-default-unchecked-disabled-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-checked-disabled-icon: var(
        --sl-color-input-switch-default-unchecked-disabled-icon
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-disabled-handle: var(
        --sl-color-input-switch-default-unchecked-disabled-handle
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-background: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-label: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-default-icon: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-default-input-text: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-border: var(
        --sl-color-input-text-field-default-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-hover-icon: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-hover-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-active-background: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-active-icon: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-active-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-focus-icon: var(
        --sl-body-foreground
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-focus-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-background: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-default-icon: var(
        --sl-color-input-text-field-invalid-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-default-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-border: var(
        --sl-color-palette-danger-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-icon: var(
        --sl-color-palette-danger-300
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-background: var(
        --sl-body-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-background: var(
        --sl-color-input-text-field-default-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-border: var(
        --sl-color-input-text-field-default-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-label: var(
        --sl-color-input-text-field-default-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-disabled-icon: var(
        --sl-color-input-text-field-default-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-input-text: var(
        --sl-color-input-text-field-default-disabled-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-disabled-placeholder: var(
        --sl-color-input-text-field-default-disabled-placeholder
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-border: var(
        --sl-color-input-text-field-default-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-hover-background: var(
        --sl-color-input-text-field-default-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-border: var(
        --sl-color-input-text-field-default-active-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-border: var(
        --sl-color-input-text-field-default-focus-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-background: var(
        --sl-color-input-text-field-default-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-border: var(
        --sl-color-input-text-field-default-disabled-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-label: var(
        --sl-color-input-text-field-default-disabled-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-disabled-icon: var(
        --sl-color-input-text-field-default-disabled-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-disabled-input-text: var(
        --sl-color-input-text-field-default-disabled-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-helper-text-default: var(--sl-body-foreground); /** color.surface.solid.primary.foreground */
      --sl-color-input-helper-icon-default: var(--sl-body-foreground); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-text-default: var(--sl-body-foreground); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-icon-default: var(--sl-body-foreground); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-hint-disabled: var(
        --sl-color-input-field-label-text-disabled
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-field-label-hint-invalid: var(
        --sl-color-input-field-label-text-invalid
      ); /** color.surface.solid.primary.foreground */
      --sl-color-dialog-background: var(--sl-body-background); /** color.surface.solid.primary.background */
      --sl-color-dialog-foreground: var(--sl-body-foreground); /** color.surface.solid.primary.background */
      --sl-color-dialog-border: var(--sl-body-background); /** color.surface.solid.primary.background */
      --sl-color-popover-background: var(--sl-body-background);
      --sl-color-popover-foreground: var(--sl-body-foreground);
      --sl-color-inline-message-info-background: var(--sl-body-background);
      --sl-color-inline-message-success-background: var(--sl-body-background);
      --sl-color-inline-message-warning-background: var(--sl-body-background);
      --sl-color-inline-message-danger-background: var(--sl-body-background);
      --sl-color-select-item-default-background: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-default-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-hover-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-active-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-focus-background: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-100) * 100%),
        transparent
      );
      --sl-color-select-item-focus-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-disabled-background: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-item-disabled-border: color-mix(
        in srgb,
        var(--sl-body-background) calc(var(--sl-opacity-transparent) * 100%),
        transparent
      );
      --sl-color-select-selectbox-default-default-border: var(--sl-color-input-text-field-default-default-border);
      --sl-color-select-selectbox-default-default-placeholder: var(
        --sl-color-input-text-field-default-default-placeholder
      );
      --sl-color-select-selectbox-default-hover-background: var(--sl-color-input-text-field-default-hover-background);
      --sl-color-select-selectbox-default-disabled-background: var(
        --sl-color-input-text-field-default-disabled-background
      );
      --sl-color-select-selectbox-default-disabled-border: var(--sl-color-input-text-field-default-disabled-border);
      --sl-color-select-selectbox-default-disabled-label: var(--sl-color-input-text-field-default-disabled-label);
      --sl-color-select-selectbox-default-disabled-icon: var(--sl-color-input-text-field-default-disabled-icon);
      --sl-color-select-selectbox-default-disabled-input-text: var(
        --sl-color-input-text-field-default-disabled-input-text
      );
      --sl-color-select-selectbox-default-disabled-placeholder: var(
        --sl-color-input-text-field-default-disabled-placeholder
      );
      --sl-color-select-selectbox-invalid-default-border: var(--sl-color-input-text-field-invalid-default-border);
      --sl-color-select-selectbox-invalid-hover-background: var(--sl-color-input-text-field-invalid-hover-background);
      --sl-color-select-selectbox-valid-default-icon: var(--sl-color-input-text-field-valid-default-icon);
      --sl-color-select-selectbox-valid-hover-icon: var(--sl-color-input-text-field-valid-hover-icon);
      --sl-color-select-selectbox-valid-active-icon: var(--sl-color-input-text-field-valid-active-icon);
      --sl-color-select-selectbox-valid-focus-icon: var(--sl-color-input-text-field-valid-focus-icon);
      --sl-color-select-selectbox-valid-disabled-placeholder: var(
        --sl-color-input-text-field-default-disabled-placeholder
      );
      --sl-color-select-listbox-background: var(--sl-body-background);
      --sl-color-skeleton-shimmer: linear-gradient
        (
          90deg,
          var(--sl-color-skeleton-base) 0%,
          var(--sl-color-skeleton-base) 10%,
          var(--sl-color-skeleton-effect) 50%,
          var(--sl-color-skeleton-base) 90%,
          var(--sl-color-skeleton-base) 100%
        ); /** body.surface.100 */
      --sl-color-skeleton-plain: var(--sl-color-background-accent-grey-subtlest); /** Use for skeleton loading states. */
      --sl-color-skeleton-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for the pulse or shimmer effect in skeleton loading states. */
      --sl-color-tab-default-background: var(--sl-body-background);
      --sl-color-tab-default-foreground: var(--sl-body-foreground);
      --sl-color-tab-hover-foreground: var(--sl-body-foreground);
      --sl-color-tab-tabbar-background: var(--sl-body-background);
      --sl-color-tab-tabbar-foreground: var(--sl-body-foreground);
      --sl-color-tab-active-foreground: var(--sl-body-foreground);
      --sl-color-tab-content-background: var(--sl-body-background);
      --sl-color-tab-content-foreground: var(--sl-body-foreground);
      --sl-color-slds-checklist-background: var(--sl-body-background);
      --sl-color-slds-checklist-foreground: var(--sl-body-foreground);
      --sl-color-slds-checklist-icon-danger: var(--sl-color-palette-danger-300);
      --sl-color-accordion-default-background: var(--sl-body-background);
      --sl-color-accordion-default-header: var(--sl-body-background);
      --sl-color-accordion-default-foreground: var(--sl-body-foreground);
      --sl-color-accordion-default-icon: var(--sl-body-foreground);
      --sl-color-accordion-hover-background: var(--sl-body-background);
      --sl-color-accordion-hover-border: var(--sl-color-accordion-default-border);
      --sl-color-accordion-disabled-border: var(--sl-color-accordion-default-border);
      --sl-color-accordion-active-background: var(--sl-body-background);
      --sl-color-accordion-active-border: var(--sl-color-accordion-default-border);
      --sl-color-card-background: var(--sl-body-background);
      --sl-color-card-foreground: var(--sl-body-foreground);
      --sl-color-field-button-default-idle-foreground: var(--sl-body-foreground);
      --sl-color-field-button-default-hover-foreground: var(
        --sl-body-foreground
      ); /** color.button.default.hover.foreground */
      --sl-color-field-button-default-active-foreground: var(
        --sl-body-foreground
      ); /** color.button.default.active.foreground */
      --sl-color-tag-subtle-active-border: var(--sl-color-palette-info-400);
      --sl-color-tag-subtle-close-hover-background: var(--sl-color-tag-subtle-hover-background);
      --sl-color-tag-subtle-close-hover-foreground: var(--sl-color-tag-subtle-hover-foreground);
      --sl-color-tag-subtle-close-active-border: var(--sl-color-tag-subtle-close-active-background);
      --sl-color-tag-bold-idle-border: var(--sl-color-palette-info-400);
      --sl-color-tag-bold-close-hover-background: var(--sl-color-palette-info-400);
      --sl-color-tag-bold-close-hover-foreground: var(--sl-color-tag-bold-hover-foreground);
      --sl-color-tag-bold-close-active-border: var(--sl-color-tag-bold-close-active-background);
      --sl-color-foreground-bold: var(--sl-color-foreground-accent-grey-bold); /** Use for headers and labels. */
      --sl-color-foreground-plain: var(--sl-color-foreground-accent-grey-plain); /** Use for body copy and menu items. */
      --sl-color-foreground-subtle: var(--sl-color-foreground-accent-grey-subtle); /** Use for subheadings. */
      --sl-color-foreground-subtlest: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for placeholders and hints. */
      --sl-color-foreground-disabled: var(
        --sl-color-foreground-accent-grey-faint
      ); /** Use for foreground in a disabled state. */
      --sl-color-foreground-brand: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for non-interactive brand-reinforcing text. */
      --sl-color-foreground-primary-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for primary actions on 'color.background.primary.muted' and 'color.background.primary.subtle'. */
      --sl-color-foreground-selected-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-selected-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Used as selected foreground color on white backgrounds. */
      --sl-color-foreground-secondary-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-plain: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-info-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for text that communicates informative messages the user needs to be aware of on neutral backgrounds. */
      --sl-color-foreground-info-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-positive-plain: var(
        --sl-color-foreground-accent-green-plain
      ); /** Use for text that communicates a favorable outcome on neutral backgrounds.' */
      --sl-color-foreground-positive-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
      --sl-color-foreground-caution-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for text that communicates caution to prevent mistakes or errors on neutral backgrounds. */
      --sl-color-foreground-caution-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for text that communicates caution to prevent mistakes or errors on caution backgrounds, such as 'color.background.caution.muted', and 'color.background.caution.subtle'. */
      --sl-color-foreground-caution-onBold: var(
        --sl-color-foreground-accent-yellow-onBold
      ); /** Use for text that communicates caution to prevent mistakes or errors on 'color.background.caution.bold'. */
      --sl-color-foreground-negative-plain: var(
        --sl-color-foreground-accent-red-plain
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on neutral backgrounds. */
      --sl-color-foreground-negative-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-inverted-onBold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for inverted text on 'color.background.inverted.bold'. */
      --sl-color-link-idle: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for links in their default or hovered state. */
      --sl-color-link-muted-idle: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for muted links in idle state. */
      --sl-color-link-muted-hover: var(--sl-color-link-hover); /** Use for muted links in hover state. */
      --sl-color-link-muted-active: var(--sl-color-link-active); /** Use for muted links in active state. */
      --sl-color-link-inverted-idle: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for inverted links in idle state. */
      --sl-color-border-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use to visually group or seperate UI elements, such as card, tabs or side panel dividers. */
      --sl-color-border-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** A neutral border option that passes min 3:1 contrast ratios. */
      --sl-color-border-focused: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for focus rings of elements in a focus state. */
      --sl-color-border-selected: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that emphasize selected states, such as tabs or menu items. */
      --sl-color-border-primary-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight primary actions or messages on elevation.surface background colors. */
      --sl-color-border-secondary-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight secondary actions or messages on elevation.surface background colors. */
      --sl-color-border-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for subtle borders on color.background.neutral background colors. */
      --sl-color-border-neutral-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight neutral actions or messages on elevation.surface background colors. */
      --sl-color-border-neutral-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** Use for borders that highlight neutral actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-info-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight informative actions or messages on elevation.surface background colors. */
      --sl-color-border-positive-plain: var(
        --sl-color-border-accent-green-plain
      ); /** Use for borders that highlight a favorable outcome on elevation.surface background colors. */
      --sl-color-border-caution-plain: var(
        --sl-color-border-accent-yellow-plain
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on elevation.surface background colors. */
      --sl-color-border-negative-plain: var(
        --sl-color-border-accent-red-plain
      ); /** Use for borders that highlight negative or serious error states on elevation.surface background colors. */
      --sl-color-border-accent-blue-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for bold blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for bold green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-bold: var(
        --sl-color-foreground-accent-orange-bold
      ); /** Use for bold orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-bold: var(
        --sl-color-foreground-accent-purple-bold
      ); /** Use for bold purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-red-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for bold red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-bold: var(
        --sl-color-foreground-accent-teal-bold
      ); /** Use for bold teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for bold yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-background-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for backgrounds of elements in a neutral state with subtle emphasis. */
      --sl-color-background-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-input-interactive: var(
        --sl-color-background-neutral-interactive-plain
      ); /** Used as transparent layer on top of the input background to indicate the hover state. */
      --sl-color-background-selected-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-selected-subtle: var(
        --sl-color-background-accent-blue-subtlest
      ); /** Use for backgrounds of elements in selected state with subtle emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-primary-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-primary-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background in the primary action color. */
      --sl-color-background-primary-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** A vibrant background option used for primary actions. */
      --sl-color-background-primary-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-primary-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-secondary-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the secondary action color. */
      --sl-color-background-secondary-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the secondary action color. */
      --sl-color-background-secondary-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for secondary actions. */
      --sl-color-background-secondary-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-secondary-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the neutral action color. */
      --sl-color-background-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the neutral action color. */
      --sl-color-background-neutral-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-info-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background for informative messages. */
      --sl-color-background-info-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background for informative messages. */
      --sl-color-background-info-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for the background of actions with bold emphasis related to informative messages. */
      --sl-color-background-info-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-info-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-positive-subtlest: var(
        --sl-color-background-accent-green-subtlest
      ); /** The subtlest background option for communicating a positive outcome. */
      --sl-color-background-positive-subtle: var(
        --sl-color-background-accent-green-subtle
      ); /** A subtle background option for communicating a positive outcome. */
      --sl-color-background-positive-bold: var(
        --sl-color-background-accent-green-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate a positive outcome. */
      --sl-color-background-positive-interactive-bold: var(
        --sl-color-background-accent-green-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-positive-interactive-plain: var(
        --sl-color-background-accent-green-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-caution-subtlest: var(
        --sl-color-background-accent-yellow-subtlest
      ); /** The subtlest background option to communicate caution to prevent errors. */
      --sl-color-background-caution-subtle: var(
        --sl-color-background-accent-yellow-subtle
      ); /** A subtle background option to communicate caution to prevent errors. */
      --sl-color-background-caution-bold: var(
        --sl-color-background-accent-yellow-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate caution. */
      --sl-color-background-caution-interactive-bold: var(
        --sl-color-background-accent-yellow-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-caution-interactive-plain: var(
        --sl-color-background-accent-yellow-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-negative-subtlest: var(
        --sl-color-background-accent-red-subtlest
      ); /** The subtlest background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtle: var(
        --sl-color-background-accent-red-subtle
      ); /** A subtle background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-bold: var(
        --sl-color-background-accent-red-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-interactive-bold: var(
        --sl-color-background-accent-red-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-negative-interactive-plain: var(
        --sl-color-background-accent-red-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-input-option-default-unchecked-focus-background: var(
        --sl-color-input-option-default-unchecked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-default-unchecked-focus-label: var(
        --sl-color-input-option-default-unchecked-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-default-icon: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-hover-icon: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-active-icon: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-focus-background: var(
        --sl-color-input-option-invalid-unchecked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-focus-border: var(
        --sl-color-input-option-invalid-unchecked-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-unchecked-focus-label: var(
        --sl-color-input-option-invalid-unchecked-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-unchecked-focus-icon: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-default-border: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-focus-background: var(
        --sl-color-input-option-invalid-checked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-focus-label: var(
        --sl-color-input-option-invalid-checked-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-option-invalid-checked-focus-icon: var(
        --sl-color-input-option-invalid-checked-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-invalid-checked-disabled-border: var(
        --sl-color-input-option-invalid-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-default-background: var(
        --sl-color-input-option-default-unchecked-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-hover-border: var(
        --sl-color-input-option-valid-checked-hover-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-focus-border: var(
        --sl-color-input-option-valid-checked-focus-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-focus-icon: var(
        --sl-color-input-option-valid-checked-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-checked-disabled-border: var(
        --sl-color-input-option-valid-checked-disabled-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-hover-text: var(
        --sl-color-input-switch-default-unchecked-default-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-active-text: var(
        --sl-color-input-switch-default-unchecked-default-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-focus-text: var(
        --sl-color-input-switch-default-unchecked-default-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-switch-default-unchecked-focus-icon: var(
        --sl-color-input-switch-default-unchecked-default-icon
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-hover-icon: var(
        --sl-color-input-switch-default-checked-hover-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-switch-default-checked-focus-icon: var(
        --sl-color-input-switch-default-checked-focus-background
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-hover-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-active-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-active-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-focus-background: var(
        --sl-color-input-text-field-default-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-default-focus-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-default-focus-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-default-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-hover-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-hover-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-border: var(
        --sl-color-input-text-field-invalid-hover-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-active-icon: var(
        --sl-color-input-text-field-invalid-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-active-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-background: var(
        --sl-color-input-text-field-invalid-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-border: var(
        --sl-color-input-text-field-invalid-hover-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-invalid-focus-icon: var(
        --sl-color-input-text-field-invalid-default-icon
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-invalid-focus-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-background: var(
        --sl-color-input-text-field-default-default-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-default-label: var(
        --sl-color-input-text-field-default-default-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-default-input-text: var(
        --sl-color-input-text-field-default-default-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-hover-border: var(
        --sl-color-input-text-field-default-hover-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-background: var(
        --sl-color-input-text-field-default-active-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-field-label-hint-default: var(
        --sl-color-input-field-label-text-default
      ); /** color.surface.solid.primary.foreground */
      --sl-color-select-item-default-foreground: var(--sl-color-input-text-field-default-default-input-text);
      --sl-color-select-item-hover-foreground: var(--sl-color-input-text-field-default-default-input-text);
      --sl-color-select-item-active-foreground: var(--sl-color-input-text-field-default-default-input-text);
      --sl-color-select-selectbox-default-default-background: var(--sl-color-input-text-field-default-default-background);
      --sl-color-select-selectbox-default-default-label: var(--sl-color-input-text-field-default-default-label);
      --sl-color-select-selectbox-default-default-icon: var(--sl-color-input-text-field-default-default-icon);
      --sl-color-select-selectbox-default-default-input-text: var(--sl-color-input-text-field-default-default-input-text);
      --sl-color-select-selectbox-default-hover-border: var(--sl-color-input-text-field-default-hover-border);
      --sl-color-select-selectbox-default-hover-icon: var(--sl-color-input-text-field-default-hover-icon);
      --sl-color-select-selectbox-default-hover-placeholder: var(--sl-color-input-text-field-default-hover-placeholder);
      --sl-color-select-selectbox-default-active-background: var(--sl-color-input-text-field-default-active-background);
      --sl-color-select-selectbox-default-active-icon: var(--sl-color-input-text-field-default-active-icon);
      --sl-color-select-selectbox-default-active-placeholder: var(--sl-color-input-text-field-default-active-placeholder);
      --sl-color-select-selectbox-default-focus-icon: var(--sl-color-input-text-field-default-focus-icon);
      --sl-color-select-selectbox-default-focus-placeholder: var(--sl-color-input-text-field-default-focus-placeholder);
      --sl-color-select-selectbox-invalid-default-background: var(--sl-color-input-text-field-invalid-default-background);
      --sl-color-select-selectbox-invalid-default-icon: var(--sl-color-input-text-field-invalid-default-icon);
      --sl-color-select-selectbox-invalid-default-placeholder: var(
        --sl-color-input-text-field-invalid-default-placeholder
      );
      --sl-color-select-selectbox-invalid-hover-border: var(--sl-color-input-text-field-invalid-hover-border);
      --sl-color-select-selectbox-invalid-hover-icon: var(--sl-color-input-text-field-invalid-hover-icon);
      --sl-color-select-selectbox-invalid-hover-placeholder: var(--sl-color-input-text-field-invalid-hover-placeholder);
      --sl-color-select-selectbox-invalid-active-background: var(--sl-color-input-text-field-invalid-active-background);
      --sl-color-select-selectbox-invalid-active-placeholder: var(--sl-color-input-text-field-invalid-active-placeholder);
      --sl-color-select-selectbox-invalid-focus-placeholder: var(--sl-color-input-text-field-invalid-focus-placeholder);
      --sl-color-select-selectbox-invalid-disabled-background: var(
        --sl-color-input-text-field-invalid-disabled-background
      );
      --sl-color-select-selectbox-invalid-disabled-border: var(--sl-color-input-text-field-invalid-disabled-border);
      --sl-color-select-selectbox-invalid-disabled-label: var(--sl-color-input-text-field-invalid-disabled-label);
      --sl-color-select-selectbox-invalid-disabled-icon: var(--sl-color-input-text-field-invalid-disabled-icon);
      --sl-color-select-selectbox-invalid-disabled-input-text: var(
        --sl-color-input-text-field-invalid-disabled-input-text
      );
      --sl-color-select-selectbox-invalid-disabled-placeholder: var(
        --sl-color-input-text-field-invalid-disabled-placeholder
      );
      --sl-color-select-selectbox-valid-default-border: var(--sl-color-input-text-field-valid-default-border);
      --sl-color-select-selectbox-valid-default-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-hover-background: var(--sl-color-input-text-field-valid-hover-background);
      --sl-color-select-selectbox-valid-hover-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-active-border: var(--sl-color-input-text-field-valid-active-border);
      --sl-color-select-selectbox-valid-active-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-focus-border: var(--sl-color-input-text-field-valid-focus-border);
      --sl-color-select-selectbox-valid-focus-placeholder: var(--sl-color-input-text-field-invalid-default-placeholder);
      --sl-color-select-selectbox-valid-disabled-background: var(--sl-color-input-text-field-valid-disabled-background);
      --sl-color-select-selectbox-valid-disabled-border: var(--sl-color-input-text-field-valid-disabled-border);
      --sl-color-select-selectbox-valid-disabled-label: var(--sl-color-input-text-field-valid-disabled-label);
      --sl-color-select-selectbox-valid-disabled-icon: var(--sl-color-input-text-field-valid-disabled-icon);
      --sl-color-select-selectbox-valid-disabled-input-text: var(--sl-color-input-text-field-valid-disabled-input-text);
      --sl-color-tag-subtle-close-hover-border: var(--sl-color-tag-subtle-close-hover-background);
      --sl-color-tag-bold-close-hover-border: var(--sl-color-tag-bold-close-hover-background);
      --sl-color-tag-bold-close-active-foreground: var(--sl-color-tag-bold-close-hover-foreground);
      --sl-color-foreground-neutral-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for neutral actions on 'color.background.neutral.bold' */
      --sl-color-foreground-accent-blue-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.green.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.orange.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.purple.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-red-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.red.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-border-disabled: var(
        --sl-color-foreground-disabled
      ); /** Use for borders of elements in a disabled state. */
      --sl-color-border-input: var(
        --sl-color-border-bold
      ); /** Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons. */
      --sl-color-border-primary-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight primary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-secondary-bold: var(
        --sl-color-background-secondary-bold
      ); /** Use for borders that highlight secondary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-info-subtle: var(
        --sl-color-background-info-subtle
      ); /** Use for subtle borders on color.background.info background colors. */
      --sl-color-border-info-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight informative actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-positive-bold: var(
        --sl-color-border-accent-green-bold
      ); /** Use for borders that highlight a favorable outcome on muted, subtlest and subtle background colors. */
      --sl-color-border-caution-bold: var(
        --sl-color-border-accent-yellow-bold
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on muted, subtlest and subtle background colors. */
      --sl-color-border-negative-bold: var(
        --sl-color-border-accent-red-bold
      ); /** Use for borders that highlight negative or serious error states on muted, subtlest and subtle background colors. */
      --sl-color-border-accent-grey-heavy: var(
        --sl-color-foreground-bold
      ); /** Use for heavy grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-background-bold: var(
        --sl-color-border-bold
      ); /** Use for backgrounds of elements in a neutral state that require a bold emphasis or a minimum color contrast of 3:1, such as switch backgrounds. */
      --sl-color-input-option-invalid-checked-focus-border: var(
        --sl-color-input-option-invalid-checked-default-border
      ); /** color.surface.solid.primary.background */
      --sl-color-input-option-valid-unchecked-focus-background: var(
        --sl-color-input-option-default-unchecked-focus-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-hover-label: var(
        --sl-color-input-text-field-default-hover-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-hover-input-text: var(
        --sl-color-input-text-field-default-hover-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-active-label: var(
        --sl-color-input-text-field-default-active-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-active-input-text: var(
        --sl-color-input-text-field-default-active-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-background: var(
        --sl-color-input-text-field-default-focus-background
      ); /** color.surface.solid.primary.background */
      --sl-color-input-text-field-valid-focus-label: var(
        --sl-color-input-text-field-default-focus-label
      ); /** color.surface.solid.primary.foreground */
      --sl-color-input-text-field-valid-focus-input-text: var(
        --sl-color-input-text-field-default-focus-input-text
      ); /** color.surface.solid.primary.background */
      --sl-color-select-selectbox-default-hover-label: var(--sl-color-input-text-field-default-hover-label);
      --sl-color-select-selectbox-default-hover-input-text: var(--sl-color-input-text-field-default-hover-input-text);
      --sl-color-select-selectbox-default-active-label: var(--sl-color-input-text-field-default-active-label);
      --sl-color-select-selectbox-default-active-input-text: var(--sl-color-input-text-field-default-active-input-text);
      --sl-color-select-selectbox-default-focus-background: var(--sl-color-input-text-field-default-focus-background);
      --sl-color-select-selectbox-default-focus-label: var(--sl-color-input-text-field-default-focus-label);
      --sl-color-select-selectbox-default-focus-input-text: var(--sl-color-input-text-field-default-focus-input-text);
      --sl-color-select-selectbox-invalid-default-label: var(--sl-color-input-text-field-invalid-default-label);
      --sl-color-select-selectbox-invalid-default-input-text: var(--sl-color-input-text-field-invalid-default-input-text);
      --sl-color-select-selectbox-invalid-hover-label: var(--sl-color-input-text-field-invalid-hover-label);
      --sl-color-select-selectbox-invalid-hover-input-text: var(--sl-color-input-text-field-invalid-hover-input-text);
      --sl-color-select-selectbox-invalid-active-border: var(--sl-color-input-text-field-invalid-active-border);
      --sl-color-select-selectbox-invalid-active-label: var(--sl-color-input-text-field-invalid-active-label);
      --sl-color-select-selectbox-invalid-active-icon: var(--sl-color-input-text-field-invalid-active-icon);
      --sl-color-select-selectbox-invalid-active-input-text: var(--sl-color-input-text-field-invalid-active-input-text);
      --sl-color-select-selectbox-invalid-focus-background: var(--sl-color-input-text-field-invalid-focus-background);
      --sl-color-select-selectbox-invalid-focus-border: var(--sl-color-input-text-field-invalid-focus-border);
      --sl-color-select-selectbox-invalid-focus-label: var(--sl-color-input-text-field-invalid-focus-label);
      --sl-color-select-selectbox-invalid-focus-icon: var(--sl-color-input-text-field-invalid-focus-icon);
      --sl-color-select-selectbox-invalid-focus-input-text: var(--sl-color-input-text-field-invalid-focus-input-text);
      --sl-color-select-selectbox-valid-default-background: var(--sl-color-input-text-field-valid-default-background);
      --sl-color-select-selectbox-valid-default-label: var(--sl-color-input-text-field-valid-default-label);
      --sl-color-select-selectbox-valid-default-input-text: var(--sl-color-input-text-field-valid-default-input-text);
      --sl-color-select-selectbox-valid-hover-border: var(--sl-color-input-text-field-valid-hover-border);
      --sl-color-select-selectbox-valid-active-background: var(--sl-color-input-text-field-valid-active-background);
      --sl-color-foreground-primary-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for primary actions on 'color.background.primary.bold' */
      --sl-color-foreground-info-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-positive-onBold: var(
        --sl-color-foreground-accent-green-onBold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
      --sl-color-foreground-negative-onBold: var(
        --sl-color-foreground-accent-red-onBold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-select-selectbox-valid-hover-label: var(--sl-color-input-text-field-valid-hover-label);
      --sl-color-select-selectbox-valid-hover-input-text: var(--sl-color-input-text-field-valid-hover-input-text);
      --sl-color-select-selectbox-valid-active-label: var(--sl-color-input-text-field-valid-active-label);
      --sl-color-select-selectbox-valid-active-input-text: var(--sl-color-input-text-field-valid-active-input-text);
      --sl-color-select-selectbox-valid-focus-background: var(--sl-color-input-text-field-valid-focus-background);
      --sl-color-select-selectbox-valid-focus-label: var(--sl-color-input-text-field-valid-focus-label);
      --sl-color-select-selectbox-valid-focus-input-text: var(--sl-color-input-text-field-valid-focus-input-text);
    }
  }
`;
