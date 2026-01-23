import { css } from 'lit';

export default css`
  /**
   * Copyright 2026 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Copyright 2026 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Copyright 2026 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */
  :host {
    --sl-icon-typeset-fontFamily-sharp: font-awesome-7-sharp;
    --sl-icon-typeset-fontFamily-classic: font-awesome-7-pro;
    --sl-icon-typeset-fontWeight-icon-thin: 100;
    --sl-icon-typeset-fontWeight-icon-light: 300;
    --sl-icon-typeset-fontWeight-icon-solid: solid;
    --sl-icon-typeset-fontWeight-icon-regular: 400;
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
    --sl-size-010: 1px;
    --sl-size-025: 2px;
    --sl-size-050: 4px;
    --sl-size-075: 6px;
    --sl-size-full: 50rem;
    --sl-size-none: 0px;
    --sl-color-black: #000; /** Solid black */
    --sl-color-white: #fff; /** Solid White */
    --sl-color-transparent: rgb(0 0 0 / 0%);
    --sl-space-new-toggleButton-nonActive-lg: 36px;
    --sl-space-new-toggleButton-nonActive-md: 27px;
    --sl-space-new-toggleButton-nonActive-sm: 23px;
    --sl-fontWeight-100: 100; /** hairline, thin */
    --sl-fontWeight-200: 200; /** extra light, ultra, light */
    --sl-fontWeight-300: 300; /** light */
    --sl-fontWeight-400: 400; /** regular, normal, book */
    --sl-fontWeight-500: 500; /** medium */
    --sl-fontWeight-600: 600; /** semi bold, demi bold */
    --sl-fontWeight-700: 700; /** bold */
    --sl-fontWeight-800: 800; /** extra bold, ultra bold */
    --sl-fontWeight-900: 900; /** black, heavy, super */
    --sl-fontWeight-950: 950; /** ultra, ultra black, extra black */
    --sl-opacity-new-50: 0.02; /** opacity.50 */
    --sl-opacity-new-100: 0.04; /** opacity.100 */
    --sl-opacity-new-150: 0.06; /** opacity.150 */
    --sl-opacity-new-200: 0.08; /** opacity.200 */
    --sl-opacity-new-300: 0.12; /** opacity.300 */
    --sl-opacity-new-400: 0.16; /** opacity.400 */
    --sl-opacity-new-500: 0.2; /** opacity.500 */
    --sl-opacity-new-600: 0.32; /** opacity.600 */
    --sl-opacity-new-700: 0.48; /** opacity.700 */
    --sl-opacity-new-800: 0.64; /** opacity.800 */
    --sl-opacity-new-900: 0.8; /** opacity.900 */
    --sl-opacity-new-1000: 1; /** opacity.1000 */
    --sl-opacity-new-transparent: 0; /** opacity.transparent */
    --sl-text-new-typeset-fontFamily-body: roboto;
    --sl-text-new-typeset-fontFamily-heading: roboto;
    --sl-icon-typeset-fontWeight-solid: var(--sl-icon-typeset-fontWeight-icon-solid);
    --sl-icon-typeset-fontWeight-regular: var(--sl-icon-typeset-fontWeight-icon-regular);
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
    --sl-size-borderWidth-bold: var(--sl-size-025); /** A bold border, applied to UI elements that need to stand out. */
    --sl-size-borderWidth-none: var(
      --sl-size-none
    ); /** A heavy border for impactful elements where heavy emphasis is needed. */
    --sl-size-borderWidth-heavy: var(
      --sl-size-050
    ); /** A heavy border for impactful elements where heavy emphasis is needed. */
    --sl-size-borderWidth-subtle: var(
      --sl-size-010
    ); /** A subtle border, applied to UI elements where subtle emphasis is needed. */
    --sl-size-borderWidth-focusRing: var(--sl-size-025);
    --sl-size-borderRadius-lg: var(--sl-size-100); /** size.borderRadius.lg */
    --sl-size-borderRadius-md: var(--sl-size-050); /** size.borderRadius.md */
    --sl-size-borderRadius-sm: var(--sl-size-025); /** size.borderRadius.sm */
    --sl-size-borderRadius-xl: var(--sl-size-150); /** size.borderRadius.xl */
    --sl-size-borderRadius-full: var(
      --sl-size-full
    ); /** Use for pill-shaped elements like badges, and circular rounding for components with equal width and height, such as icon buttons and avatars. */
    --sl-size-borderRadius-none: var(--sl-size-none); /** size.borderRadius.none */
    --sl-size-outlineOffset-default: calc(
      var(--sl-size-050) - var(--sl-size-010)
    ); /** Defines the default offset for focus indicators. */
    --sl-size-new-icon-lg: var(--sl-size-250);
    --sl-size-new-icon-md: var(--sl-size-200);
    --sl-size-new-icon-sm: var(--sl-size-175);
    --sl-size-new-icon-xl: var(--sl-size-300);
    --sl-size-new-icon-xs: var(--sl-size-150);
    --sl-size-new-icon-2xl: var(--sl-size-400);
    --sl-size-new-icon-2xs: var(--sl-size-125);
    --sl-size-new-icon-3xl: var(--sl-size-600);
    --sl-size-new-icon-4xl: var(--sl-size-800);
    --sl-elevation-shadow-overlay:
      0 var(--sl-size-075) var(--sl-size-150) -3px var(--sl-color-shadow-overlay1),
      0 var(--sl-size-150) var(--sl-size-200) var(--sl-color-shadow-overlay2);
    --sl-elevation-shadow-overflow: 0 0 var(--sl-size-200) var(--sl-color-shadow-overflow1);
    --sl-space-new-toggleButton-nonActive-lg-2: var(--sl-size-300) + ((var(--sl-size-100) + var(--sl-size-new-icon-md))/2);
    --sl-space-new-toggleButton-nonActive-md-2: var(--sl-size-200) + ((var(--sl-size-100) + var(--sl-size-new-icon-md))/2);
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
    --sl-space-010: var(--sl-size-010);
    --sl-space-025: var(--sl-size-025);
    --sl-space-050: var(--sl-size-050);
    --sl-space-075: var(--sl-size-075);
    --sl-space-full: var(--sl-size-full);
    --sl-space-none: var(--sl-size-none);
    --sl-text-new-icon-solid: var(--sl-icon-typeset-fontWeight-icon-solid) 16px var(--sl-icon-typeset-fontFamily-classic);
    --sl-text-new-icon-outline: var(--sl-icon-typeset-fontWeight-icon-regular) 16px
      var(--sl-icon-typeset-fontFamily-classic);
    --sl-text-new-typeset-fontFamily-icon: var(--sl-icon-typeset-fontFamily-classic);
    --sl-text-new-typeset-fontWeight-regular: var(--sl-fontWeight-400);
    --sl-text-new-typeset-fontWeight-semiBold: var(--sl-fontWeight-500);
    --sl-size-borderWidth-action: var(
      --sl-size-borderWidth-subtle
    ); /** Sets the standard border width for action components. */
    --sl-size-borderWidth-default: var(
      --sl-size-borderWidth-subtle
    ); /** Sets the standard border width for UI elements. */
    --sl-size-borderRadius-child: calc(
      var(--sl-size-borderRadius-md) / 2
    ); /** The standard border radius for most components. Use for elements that need subtle rounding without emphasizing their shape. */
    --sl-size-borderRadius-default: var(
      --sl-size-borderRadius-md
    ); /** The standard border radius for most components. Use for elements that need subtle rounding without emphasizing their shape. */
    --sl-size-outlineWidth-default: var(
      --sl-size-borderWidth-bold
    ); /** Sets the standard outline width for UI elements. */
    --sl-size-icon-font-lg: var(--sl-size-new-icon-lg);
    --sl-size-icon-font-md: var(--sl-size-new-icon-md);
    --sl-size-icon-font-sm: var(--sl-size-new-icon-sm);
    --sl-size-icon-font-xl: var(--sl-size-new-icon-xl);
    --sl-size-icon-font-xs: var(--sl-size-new-icon-xs);
    --sl-size-icon-font-2xl: var(--sl-size-new-icon-2xl);
    --sl-size-icon-font-3xl: var(--sl-size-new-icon-3xl);
    --sl-size-icon-font-4xl: var(--sl-size-new-icon-4xl);
    --sl-size-text-new-body-lg: var(--sl-size-font-200);
    --sl-size-text-new-body-md: var(--sl-size-font-175); /** default text size for body */
    --sl-size-text-new-body-sm: var(--sl-size-font-150);
    --sl-size-text-new-heading-lg: var(--sl-size-font-300);
    --sl-size-text-new-heading-md: var(--sl-size-font-200);
    --sl-size-text-new-heading-sm: var(--sl-size-font-175);
    --sl-size-text-new-heading-xl: var(--sl-size-font-400);
    --sl-size-text-new-heading-2xl: var(--sl-size-font-600);
    --sl-color-shadow-overlay1: color-mix(in srgb, var(--sl-elevation-surface-shadow) 4%, transparent);
    --sl-color-shadow-overlay2: color-mix(in srgb, var(--sl-elevation-surface-shadow) 12%, transparent);
    --sl-color-shadow-overflow1: color-mix(in srgb, var(--sl-elevation-surface-shadow) 16%, transparent);
    --sl-space-new-lg: var(--sl-space-200); /** Use when components are 'casual friends' */
    --sl-space-new-md: var(--sl-space-100); /** Use when components are 'family' */
    --sl-space-new-sm: var(--sl-space-075); /** Use when components are 'besties' */
    --sl-space-new-xl: var(--sl-space-300); /** Use when components are 'acquaintances' */
    --sl-space-new-xs: var(--sl-space-050);
    --sl-space-new-2xl: var(--sl-space-400); /** Use when components are 'strangers' */
    --sl-space-new-2xs: var(--sl-space-025);
    --sl-space-new-3xl: var(--sl-space-800);
    --sl-space-new-grid-vertical: var(--sl-space-175);
    --sl-space-new-grid-horizontal: var(--sl-space-200);
    --sl-space-new-none: var(--sl-space-none);
    --sl-space-offset-default: var(--sl-space-075); /** Defines the standard spacing offset. */
    --sl-size-borderRadius-focusRing-inside: calc(
      var(--sl-size-borderRadius-default) - 1px
    ); /** Use for focusring inside of component when outside focus ring is not possible */
    --sl-size-borderRadius-focusRing-outside: calc(
      var(--sl-size-borderRadius-default) + 2px
    ); /** Use for focusring outside of component */
    --sl-space-new-input-vertical: calc(var(--sl-space-new-xs) - var(--sl-size-010));
    --sl-space-new-input-horizontal: calc(var(--sl-space-new-md) - var(--sl-size-010));
    --sl-text-new-body-lg: var(--sl-text-new-typeset-fontWeight-regular) var(--sl-size-text-new-body-lg) / 24px
      var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-body-md: var(--sl-text-new-typeset-fontWeight-regular) var(--sl-size-text-new-body-md) / 20px
      var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-body-sm: var(--sl-text-new-typeset-fontWeight-regular) var(--sl-size-text-new-body-sm) / 16px
      var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-input-lg: var(--sl-size-text-new-body-md) / 32px var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-input-md: var(--sl-size-text-new-body-md) / 24px var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-heading-lg: var(--sl-size-text-new-heading-lg) / 32px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-md: var(--sl-size-text-new-heading-md) / 20px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-sm: var(--sl-size-text-new-heading-sm) / 20px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-xl: var(--sl-size-text-new-heading-xl) / 40px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-2xl: var(--sl-size-text-new-heading-2xl) / 48px var(--sl-text-new-typeset-fontFamily-heading);
  }

  @media (prefers-color-scheme: light) {
    :host {
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
      --sl-color-palette-grey-000: #fff;
      --sl-color-palette-grey-050: #f6f8fa;
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
      --sl-opacity-bold: 1;
      --sl-opacity-muted: 0;
      --sl-opacity-subtle: 0.2;
      --sl-opacity-moderate: 0.8;
      --sl-opacity-subtlest: 0.1;
      --sl-opacity-interactive-bold-idle: 0;
      --sl-opacity-interactive-bold-hover: 0.2;
      --sl-opacity-interactive-bold-active: 0.4;
      --sl-opacity-interactive-plain-idle: 0;
      --sl-opacity-interactive-plain-hover: 0.15;
      --sl-opacity-interactive-plain-active: 0.25;
      --sl-opacity-interactive-reversed-idle: 0.8;
      --sl-opacity-interactive-reversed-hover: 0.9;
      --sl-opacity-interactive-reversed-active: 1;
      --sl-theme-name: sanoma learning light;
      --sl-color-link-hover: var(--sl-color-palette-blue-600); /** Use for links in hover state. */
      --sl-color-link-active: var(--sl-color-palette-blue-700); /** Use for links in active state. */
      --sl-color-link-focused-idle: var(
        --sl-color-palette-blue-700
      ); /** Used for the linkcolor of navigation aids in idle state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-hover: var(
        --sl-color-palette-blue-800
      ); /** Used for the linkcolor of navigation aids in hovered state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-active: var(
        --sl-color-palette-blue-900
      ); /** Used for the linkcolor of navigation aids in pressed state, such as skip links, when they are focused or visible. */
      --sl-color-link-inverted-hover: var(--sl-color-palette-blue-100); /** Use for inverted links in hover state. */
      --sl-color-link-inverted-active: var(--sl-color-palette-blue-150); /** Use for inverted links in active state. */
      --sl-color-border-info-subtle: var(
        --sl-color-palette-blue-100
      ); /** Use for subtle borders on color.background.info background colors. */
      --sl-color-border-accent-grey-bold: var(
        --sl-color-palette-grey-500
      ); /** Use for bold grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-faint: var(
        --sl-color-palette-grey-150
      ); /** Use for faint grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-heavy: var(
        --sl-color-palette-grey-900
      ); /** Use for heavy grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-plain: var(
        --sl-color-palette-grey-300
      ); /** Use for plain grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-focused: var(
        --sl-color-palette-blue-400
      ); /** Use for focus rings of elements in a focus state. */
      --sl-color-border-neutral-subtle: var(
        --sl-color-palette-grey-200
      ); /** Use for subtle borders on color.background.neutral background colors. */
      --sl-color-border-inverted: var(--sl-color-palette-grey-000); /** Use for borders on bold backgrounds. */
      --sl-color-blanket-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-moderate) * 100%),
        transparent
      ); /** Use for screen overlay that appears with dialogs or drawers. */
      --sl-color-skeleton-plain: var(--sl-color-palette-grey-100); /** Use for skeleton loading states. */
      --sl-color-skeleton-subtle: var(
        --sl-color-palette-grey-050
      ); /** Use for the pulse or shimmer effect in skeleton loading states. */
      --sl-color-background-input-plain: var(
        --sl-color-palette-grey-000
      ); /** Use for backgrounds of form UI elements, such as text fields, checkboxes, and radio buttons. */
      --sl-color-background-accent-red-bold: var(
        --sl-color-palette-red-500
      ); /** A vibrant red background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-red-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle red background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-red-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest red background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-interactive-bold: var(
        --sl-color-palette-red-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-interactive-plain: var(
        --sl-color-palette-red-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-bold: var(
        --sl-color-palette-blue-400
      ); /** A vibrant blue background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-interactive-bold: var(
        --sl-color-palette-blue-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-interactive-plain: var(
        --sl-color-palette-blue-300
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-bold: var(
        --sl-color-palette-grey-150
      ); /** A vibrant grey background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle grey background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest grey background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-interactive-bold: var(
        --sl-color-palette-grey-500
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-interactive-plain: var(
        --sl-color-palette-grey-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-bold: var(
        --sl-color-palette-teal-600
      ); /** A vibrant teal background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-teal-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle teal background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-teal-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest teal background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-interactive-bold: var(
        --sl-color-palette-teal-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-interactive-plain: var(
        --sl-color-palette-teal-400
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-bold: var(
        --sl-color-palette-green-600
      ); /** A vibrant green background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-green-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle green background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-green-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest green background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-interactive-bold: var(
        --sl-color-palette-green-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-interactive-plain: var(
        --sl-color-palette-green-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-bold: var(
        --sl-color-palette-orange-600
      ); /** A vibrant orange background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-orange-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle orange background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-orange-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest orange background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-interactive-bold: var(
        --sl-color-palette-orange-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-interactive-plain: var(
        --sl-color-palette-orange-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-bold: var(
        --sl-color-palette-purple-600
      ); /** A vibrant purple background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-purple-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle purple background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-purple-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest purple background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-interactive-bold: var(
        --sl-color-palette-purple-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-interactive-plain: var(
        --sl-color-palette-purple-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-bold: var(
        --sl-color-palette-yellow-400
      ); /** A vibrant yellow background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle yellow background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest yellow background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-interactive-bold: var(
        --sl-color-palette-yellow-800
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-interactive-plain: var(
        --sl-color-palette-yellow-400
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-subtlest: var(
        --sl-color-palette-grey-050
      ); /** The subtlest background in the neutral action color. */
      --sl-color-background-disabled: var(
        --sl-color-palette-grey-100
      ); /** Use for backgrounds of elements in disabled state. */
      --sl-color-background-inverted-bold: var(--sl-color-palette-grey-000); /** A solid inverted background option. */
      --sl-color-background-inverted-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle inverted background option. */
      --sl-color-background-inverted-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest inverted background option. */
      --sl-color-background-inverted-interactive-bold: var(
        --sl-color-palette-grey-800
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-inverted-interactive-plain: var(
        --sl-color-palette-grey-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-accent-red-bold: var(
        --sl-color-palette-red-800
      ); /** Use for red text on 'color.background.accent.red.muted' or 'color.background.accent.red.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-bold: var(
        --sl-color-palette-blue-700
      ); /** Use for blue text on 'color.background.accent.blue.muted' or 'color.background.accent.blue.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-bold: var(
        --sl-color-palette-grey-900
      ); /** Use for bold grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-faint: var(
        --sl-color-palette-grey-300
      ); /** Use for faint text on neutral backgrounds, providing low contrast. Not intended for primary content, as it does not meet WCAG 2.2 AA contrast requirements. Use sparingly where accessibility isn't a critical concern. */
      --sl-color-foreground-accent-grey-plain: var(
        --sl-color-palette-grey-800
      ); /** Use for plain grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtle: var(
        --sl-color-palette-grey-700
      ); /** Use for subtle grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtlest: var(
        --sl-color-palette-grey-600
      ); /** Use for muted grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-bold: var(
        --sl-color-palette-teal-800
      ); /** Use for teal text on 'color.background.accent.teal.muted' or 'color.background.accent.teal.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-bold: var(
        --sl-color-palette-green-700
      ); /** Use for green text on 'color.background.accent.green.muted' or 'color.background.accent.green.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-bold: var(
        --sl-color-palette-orange-800
      ); /** Use for orange text on 'color.background.accent.orange.muted' or 'color.background.accent.orange.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-bold: var(
        --sl-color-palette-purple-800
      ); /** Use for purple text on 'color.background.accent.purple.muted' or 'color.background.accent.purple.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-bold: var(
        --sl-color-palette-yellow-800
      ); /** Use for yellow text on 'color.background.accent.yellow.muted' or 'color.background.accent.yellow.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-plain: var(
        --sl-color-palette-yellow-600
      ); /** Use for yellow text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-disabled: var(--sl-color-palette-grey-500); /** Use for text in a disabled state. */
      --sl-color-foreground-inverted-bold: var(
        --sl-color-palette-grey-000
      ); /** Use for inverted text on 'color.background.inverted.subtlest', and 'color.background.inverted.subtle'. */
      --sl-color-foreground-inverted-plain: var(--sl-color-palette-grey-000); /** Use for plain inverted text. */
      --sl-color-foreground-inverted-onBold: var(
        --sl-color-palette-grey-900
      ); /** Use for inverted text on 'color.background.inverted.bold'. */
      --sl-elevation-surface-base-default: var(
        --sl-color-palette-grey-000
      ); /** The default, flat surface level. Used for primary content backgrounds or non-interactive UI regions. */
      --sl-elevation-surface-raised-sunken: var(
        --sl-color-palette-grey-050
      ); /** Background for components that create a sunken effect, typically used for grouping related items. */
      --sl-elevation-surface-raised-default: var(
        --sl-color-palette-grey-000
      ); /** Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-inverted: var(
        --sl-color-palette-grey-900
      ); /** Background of elevated components with an inverted background color like tooltips that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-alternative: var(
        --sl-color-palette-grey-100
      ); /** An alternate surface color used for visual differentiation in components like tables or lists, providing contrast between consecutive items (e.g., zebra striping). */
      --sl-elevation-surface-shadow: var(--sl-color-palette-grey-900); /** Used as color for shadows. */
      --sl-color-link-muted-idle: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for muted links in idle state. */
      --sl-color-link-muted-hover: var(--sl-color-link-hover); /** Use for muted links in hover state. */
      --sl-color-link-muted-active: var(--sl-color-link-active); /** Use for muted links in active state. */
      --sl-color-link-inverted-idle: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for inverted links in idle state. */
      --sl-color-border-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** A neutral border option that passes min 3:1 contrast ratios. */
      --sl-color-border-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use to visually group or seperate UI elements, such as card, tabs or side panel dividers. */
      --sl-color-border-accent-red-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for bold red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-red-plain: var(
        --sl-color-background-accent-red-bold
      ); /** Use for plain red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for bold blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-plain: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for plain blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-bold: var(
        --sl-color-foreground-accent-teal-bold
      ); /** Use for bold teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-plain: var(
        --sl-color-background-accent-teal-bold
      ); /** Use for plain teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for bold green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-plain: var(
        --sl-color-background-accent-green-bold
      ); /** Use for plain green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-bold: var(
        --sl-color-foreground-accent-orange-bold
      ); /** Use for bold orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-plain: var(
        --sl-color-background-accent-orange-bold
      ); /** Use for plain orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-bold: var(
        --sl-color-foreground-accent-purple-bold
      ); /** Use for bold purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-plain: var(
        --sl-color-background-accent-purple-bold
      ); /** Use for plain purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for bold yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for plain yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-neutral-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** Use for borders that highlight neutral actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-neutral-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight neutral actions or messages on elevation.surface background colors. */
      --sl-color-border-disabled: var(
        --sl-color-border-accent-grey-faint
      ); /** Use for borders of elements in a disabled state. */
      --sl-color-border-secondary-bold: var(
        --sl-color-border-accent-grey-heavy
      ); /** Use for borders that highlight secondary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-secondary-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight secondary actions or messages on elevation.surface background colors. */
      --sl-color-background-info-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for the background of actions with bold emphasis related to informative messages. */
      --sl-color-background-info-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-info-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-input-interactive: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the input background to indicate the hover state. */
      --sl-color-background-accent-blue-subtle: color-mix(
        in srgb,
        var(--sl-color-background-accent-blue-bold) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle blue background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtlest: color-mix(
        in srgb,
        var(--sl-color-background-accent-blue-bold) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest blue background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for backgrounds of elements in a neutral state with subtle emphasis. */
      --sl-color-background-caution-bold: var(
        --sl-color-background-accent-yellow-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate caution. */
      --sl-color-background-caution-subtle: var(
        --sl-color-background-accent-yellow-subtle
      ); /** A subtle background option to communicate caution to prevent errors. */
      --sl-color-background-caution-subtlest: var(
        --sl-color-background-accent-yellow-subtlest
      ); /** The subtlest background option to communicate caution to prevent errors. */
      --sl-color-background-caution-interactive-bold: var(
        --sl-color-background-accent-yellow-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-caution-interactive-plain: var(
        --sl-color-background-accent-yellow-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for neutral actions. */
      --sl-color-background-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the neutral action color. */
      --sl-color-background-neutral-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-neutral-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
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
      --sl-color-background-negative-bold: var(
        --sl-color-background-accent-red-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtle: var(
        --sl-color-background-accent-red-subtle
      ); /** A subtle background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtlest: var(
        --sl-color-background-accent-red-subtlest
      ); /** The subtlest background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-interactive-bold: var(
        --sl-color-background-accent-red-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-negative-interactive-plain: var(
        --sl-color-background-accent-red-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-positive-bold: var(
        --sl-color-background-accent-green-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate a positive outcome. */
      --sl-color-background-positive-subtle: var(
        --sl-color-background-accent-green-subtle
      ); /** A subtle background option for communicating a positive outcome. */
      --sl-color-background-positive-subtlest: var(
        --sl-color-background-accent-green-subtlest
      ); /** The subtlest background option for communicating a positive outcome. */
      --sl-color-background-positive-interactive-bold: var(
        --sl-color-background-accent-green-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-positive-interactive-plain: var(
        --sl-color-background-accent-green-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-selected-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for backgrounds of elements in selected state with bold emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-selected-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-secondary-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for secondary actions. */
      --sl-color-background-secondary-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the secondary action color. */
      --sl-color-background-secondary-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the secondary action color. */
      --sl-color-background-secondary-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-secondary-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-bold: var(--sl-color-foreground-accent-grey-bold); /** Use for headers and labels. */
      --sl-color-foreground-info-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-plain: var(--sl-color-foreground-accent-grey-plain); /** Use for body copy and menu items. */
      --sl-color-foreground-accent-red-plain: var(
        --sl-color-background-accent-red-bold
      ); /** Use for red text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-red-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.red.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-plain: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for blue text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-blue-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-plain: var(
        --sl-color-background-accent-teal-bold
      ); /** Use for teal text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-onBold: var(
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
      --sl-color-foreground-subtle: var(--sl-color-foreground-accent-grey-subtle); /** Use for subheadings. */
      --sl-color-foreground-caution-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for text that communicates caution to prevent mistakes or errors on caution backgrounds, such as 'color.background.caution.muted', and 'color.background.caution.subtle'. */
      --sl-color-foreground-caution-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for text that communicates caution to prevent mistakes or errors on neutral backgrounds. */
      --sl-color-foreground-neutral-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-plain: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-primary-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for primary actions on 'color.background.primary.muted' and 'color.background.primary.subtle'. */
      --sl-color-foreground-negative-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-positive-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
      --sl-color-foreground-selected-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-subtlest: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for placeholders and hints. */
      --sl-color-foreground-secondary-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-link-idle: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for links in their default or hovered state. */
      --sl-color-border-info-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight informative actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-info-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight informative actions or messages on elevation.surface background colors. */
      --sl-color-border-input: var(
        --sl-color-border-bold
      ); /** Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons. */
      --sl-color-border-caution-bold: var(
        --sl-color-border-accent-yellow-bold
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on muted, subtlest and subtle background colors. */
      --sl-color-border-caution-plain: var(
        --sl-color-border-accent-yellow-plain
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on elevation.surface background colors. */
      --sl-color-border-primary-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight primary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-primary-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight primary actions or messages on elevation.surface background colors. */
      --sl-color-border-negative-bold: var(
        --sl-color-border-accent-red-bold
      ); /** Use for borders that highlight negative or serious error states on muted, subtlest and subtle background colors. */
      --sl-color-border-negative-plain: var(
        --sl-color-border-accent-red-plain
      ); /** Use for borders that highlight negative or serious error states on elevation.surface background colors. */
      --sl-color-border-positive-bold: var(
        --sl-color-border-accent-green-bold
      ); /** Use for borders that highlight a favorable outcome on muted, subtlest and subtle background colors. */
      --sl-color-border-positive-plain: var(
        --sl-color-border-accent-green-plain
      ); /** Use for borders that highlight a favorable outcome on elevation.surface background colors. */
      --sl-color-border-selected: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that emphasize selected states, such as tabs or menu items. */
      --sl-color-background-bold: var(
        --sl-color-border-bold
      ); /** Use for backgrounds of elements in a neutral state that require a bold emphasis or a minimum color contrast of 3:1, such as switch backgrounds. */
      --sl-color-background-info-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background for informative messages. */
      --sl-color-background-info-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background for informative messages. */
      --sl-color-background-primary-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background in the primary action color. */
      --sl-color-background-primary-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-selected-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** Use for backgrounds of elements in selected state with subtle emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-interactive-bold: var(
        --sl-color-background-neutral-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-interactive-plain: var(
        --sl-color-background-neutral-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-info-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for text that communicates informative messages the user needs to be aware of on neutral backgrounds. */
      --sl-color-foreground-info-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.bold'. */
      --sl-color-foreground-brand: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for non-interactive brand-reinforcing text. */
      --sl-color-foreground-accent-grey-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.grey.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-onInverted: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.inverted', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.yellow.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-primary-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for primary actions on 'color.background.primary.bold' */
      --sl-color-foreground-negative-plain: var(
        --sl-color-foreground-accent-red-plain
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on neutral backgrounds. */
      --sl-color-foreground-negative-onBold: var(
        --sl-color-foreground-accent-red-onBold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.bold'. */
      --sl-color-foreground-positive-plain: var(
        --sl-color-foreground-accent-green-plain
      ); /** Use for text that communicates a favorable outcome on neutral backgrounds.' */
      --sl-color-foreground-positive-onBold: var(
        --sl-color-foreground-accent-green-onBold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.bold'. */
      --sl-color-foreground-selected-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Used as selected foreground color on white backgrounds. */
      --sl-color-foreground-selected-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-caution-onBold: var(
        --sl-color-foreground-accent-yellow-onBold
      ); /** Use for text that communicates caution to prevent mistakes or errors on 'color.background.caution.bold'. */
      --sl-color-foreground-neutral-onBold: var(
        --sl-color-foreground-accent-grey-onBold
      ); /** Use for neutral actions on 'color.background.neutral.bold' */
      --sl-color-foreground-secondary-onBold: var(
        --sl-color-foreground-accent-grey-onBold
      ); /** Use for secondary actions on 'color.background.secondary.bold' */
    }
  }

  @media (prefers-color-scheme: dark) {
    :host {
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
      --sl-color-palette-grey-000: #222;
      --sl-color-palette-grey-050: #25292f;
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
      --sl-opacity-bold: 1;
      --sl-opacity-muted: 0;
      --sl-opacity-subtle: 0.35;
      --sl-opacity-moderate: 0.8;
      --sl-opacity-subtlest: 0.25;
      --sl-opacity-interactive-bold-idle: 0;
      --sl-opacity-interactive-bold-hover: 0.2;
      --sl-opacity-interactive-bold-active: 0.4;
      --sl-opacity-interactive-plain-idle: 0;
      --sl-opacity-interactive-plain-hover: 0.25;
      --sl-opacity-interactive-plain-active: 0.35;
      --sl-opacity-interactive-reversed-idle: 0.8;
      --sl-opacity-interactive-reversed-hover: 0.9;
      --sl-opacity-interactive-reversed-active: 1;
      --sl-theme-name: sanoma learning dark;
      --sl-color-link-hover: var(--sl-color-palette-blue-700); /** Use for links in hover state. */
      --sl-color-link-active: var(--sl-color-palette-blue-800); /** Use for links in active state. */
      --sl-color-link-focused-idle: var(
        --sl-color-palette-blue-700
      ); /** Used for the linkcolor of navigation aids in idle state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-hover: var(
        --sl-color-palette-blue-800
      ); /** Used for the linkcolor of navigation aids in hovered state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-active: var(
        --sl-color-palette-blue-900
      ); /** Used for the linkcolor of navigation aids in pressed state, such as skip links, when they are focused or visible. */
      --sl-color-link-inverted-hover: var(--sl-color-palette-blue-400); /** Use for inverted links in hover state. */
      --sl-color-link-inverted-active: var(--sl-color-palette-blue-300); /** Use for inverted links in active state. */
      --sl-color-border-accent-red-plain: var(
        --sl-color-palette-red-400
      ); /** Use for plain red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-plain: var(
        --sl-color-palette-blue-500
      ); /** Use for plain blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-bold: var(
        --sl-color-palette-grey-200
      ); /** Use for bold grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-faint: var(
        --sl-color-palette-grey-100
      ); /** Use for faint grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-plain: var(
        --sl-color-palette-grey-100
      ); /** Use for plain grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-plain: var(
        --sl-color-palette-teal-300
      ); /** Use for plain teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-plain: var(
        --sl-color-palette-green-400
      ); /** Use for plain green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-plain: var(
        --sl-color-palette-orange-300
      ); /** Use for plain orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-plain: var(
        --sl-color-palette-purple-500
      ); /** Use for plain purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-plain: var(
        --sl-color-palette-yellow-300
      ); /** Use for plain yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-inverted: var(--sl-color-palette-grey-000); /** Use for borders on bold backgrounds. */
      --sl-color-blanket-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) calc(var(--sl-opacity-moderate) * 100%),
        transparent
      ); /** Use for screen overlay that appears with dialogs or drawers. */
      --sl-color-skeleton-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 5%,
        transparent
      ); /** Use for skeleton loading states. */
      --sl-color-skeleton-subtle: var(
        --sl-color-palette-grey-000
      ); /** Use for the pulse or shimmer effect in skeleton loading states. */
      --sl-color-background-input-plain: var(
        --sl-color-palette-grey-050
      ); /** Use for backgrounds of form UI elements, such as text fields, checkboxes, and radio buttons. */
      --sl-color-background-accent-red-bold: var(
        --sl-color-palette-red-200
      ); /** A vibrant red background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-red-150) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle red background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-red-150) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest red background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-interactive-bold: var(
        --sl-color-palette-red-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-interactive-plain: var(
        --sl-color-palette-red-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-bold: var(
        --sl-color-palette-blue-300
      ); /** A vibrant blue background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-blue-300) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle blue background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-blue-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest blue background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-interactive-bold: var(
        --sl-color-palette-grey-000
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-interactive-plain: var(
        --sl-color-palette-blue-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-bold: var(
        --sl-color-palette-grey-300
      ); /** A vibrant grey background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle grey background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest grey background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-interactive-bold: var(
        --sl-color-palette-grey-150
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-interactive-plain: var(
        --sl-color-palette-grey-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-bold: var(
        --sl-color-palette-teal-150
      ); /** A vibrant teal background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-teal-150) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle teal background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-teal-150) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest teal background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-interactive-bold: var(
        --sl-color-palette-teal-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-interactive-plain: var(
        --sl-color-palette-teal-200
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-bold: var(
        --sl-color-palette-green-200
      ); /** A vibrant green background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-green-200) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle green background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-green-200) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest green background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-interactive-bold: var(
        --sl-color-palette-green-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-interactive-plain: var(
        --sl-color-palette-green-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-bold: var(
        --sl-color-palette-orange-150
      ); /** A vibrant orange background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-orange-200) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle orange background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-orange-200) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest orange background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-interactive-bold: var(
        --sl-color-palette-orange-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-interactive-plain: var(
        --sl-color-palette-orange-300
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-bold: var(
        --sl-color-palette-purple-200
      ); /** A vibrant purple background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-purple-200) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle purple background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-purple-200) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest purple background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-interactive-bold: var(
        --sl-color-palette-purple-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-interactive-plain: var(
        --sl-color-palette-purple-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-bold: var(
        --sl-color-palette-yellow-400
      ); /** A vibrant yellow background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-150) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle yellow background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-150) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest yellow background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-interactive-bold: var(
        --sl-color-palette-yellow-100
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-interactive-plain: var(
        --sl-color-palette-yellow-300
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-bold: var(
        --sl-color-palette-grey-100
      ); /** A vibrant background option used for neutral actions. */
      --sl-color-background-neutral-interactive-plain: var(
        --sl-color-palette-grey-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-disabled: var(
        --sl-color-palette-grey-100
      ); /** Use for backgrounds of elements in disabled state. */
      --sl-color-background-inverted-bold: var(--sl-color-palette-grey-000); /** A solid inverted background option. */
      --sl-color-background-inverted-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle inverted background option. */
      --sl-color-background-inverted-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest inverted background option. */
      --sl-color-background-inverted-interactive-bold: var(
        --sl-color-palette-grey-150
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-inverted-interactive-plain: var(
        --sl-color-palette-grey-900
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-selected-bold: var(
        --sl-color-palette-blue-500
      ); /** Use for backgrounds of elements in selected state with bold emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-interactive-bold: var(
        --sl-color-palette-blue-700
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-foreground-accent-red-bold: var(
        --sl-color-palette-red-600
      ); /** Use for red text on 'color.background.accent.red.muted' or 'color.background.accent.red.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-red-plain: var(
        --sl-color-palette-red-500
      ); /** Use for red text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-blue-bold: var(
        --sl-color-palette-blue-700
      ); /** Use for blue text on 'color.background.accent.blue.muted' or 'color.background.accent.blue.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-plain: var(
        --sl-color-palette-blue-600
      ); /** Use for blue text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-bold: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 87%,
        transparent
      ); /** Use for bold grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-faint: var(
        --sl-color-palette-grey-300
      ); /** Use for faint text on neutral backgrounds, providing low contrast. Not intended for primary content, as it does not meet WCAG 2.2 AA contrast requirements. Use sparingly where accessibility isn't a critical concern. */
      --sl-color-foreground-accent-grey-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 80%,
        transparent
      ); /** Use for plain grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text on 'color.background.accent.grey.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 60%,
        transparent
      ); /** Use for subtle grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 47%,
        transparent
      ); /** Use for subtlest grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-bold: var(
        --sl-color-palette-teal-500
      ); /** Use for teal text on 'color.background.accent.teal.muted' or 'color.background.accent.teal.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-plain: var(
        --sl-color-palette-teal-400
      ); /** Use for teal text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-green-bold: var(
        --sl-color-palette-green-700
      ); /** Use for green text on 'color.background.accent.green.muted' or 'color.background.accent.green.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-plain: var(
        --sl-color-palette-green-500
      ); /** Use for green text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-orange-bold: var(
        --sl-color-palette-orange-700
      ); /** Use for orange text on 'color.background.accent.orange.muted' or 'color.background.accent.orange.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-plain: var(
        --sl-color-palette-orange-500
      ); /** Use for orange text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-purple-bold: var(
        --sl-color-palette-purple-600
      ); /** Use for purple text on 'color.background.accent.purple.muted' or 'color.background.accent.purple.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-plain: var(
        --sl-color-palette-purple-600
      ); /** Use for purple text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-yellow-bold: var(
        --sl-color-palette-yellow-500
      ); /** Use for yellow text on 'color.background.accent.yellow.muted' or 'color.background.accent.yellow.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-plain: var(
        --sl-color-palette-yellow-400
      ); /** Use for yellow text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-yellow-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text on 'color.background.accent.yellow.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-inverted-bold: var(
        --sl-color-palette-grey-000
      ); /** Use for inverted text on 'color.background.inverted.subtlest', and 'color.background.inverted.subtle'. */
      --sl-color-foreground-inverted-plain: var(--sl-color-palette-grey-000); /** Use for plain inverted text. */
      --sl-color-foreground-selected-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-secondary-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-elevation-surface-base-default: var(
        --sl-color-palette-grey-000
      ); /** The default, flat surface level. Used for primary content backgrounds or non-interactive UI regions. */
      --sl-elevation-surface-raised-sunken: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 5%,
        transparent
      ); /** Background for components that create a sunken effect, typically used for grouping related items. */
      --sl-elevation-surface-raised-default: var(
        --sl-color-palette-grey-050
      ); /** Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-inverted: var(
        --sl-color-palette-grey-500
      ); /** Background of elevated components with an inverted background color like tooltips that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-alternative: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 10%,
        transparent
      ); /** An alternate surface color used for visual differentiation in components like tables or lists, providing contrast between consecutive items (e.g., zebra striping). */
      --sl-elevation-surface-shadow: var(--sl-color-transparent); /** Used as color for shadows. */
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
      --sl-color-border-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** A neutral border option that passes min 3:1 contrast ratios. */
      --sl-color-border-info-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight informative actions or messages on elevation.surface background colors. */
      --sl-color-border-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use to visually group or seperate UI elements, such as card, tabs or side panel dividers. */
      --sl-color-border-accent-red-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for bold red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for bold blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-bold: var(
        --sl-color-foreground-accent-teal-bold
      ); /** Use for bold teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for bold green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-bold: var(
        --sl-color-foreground-accent-orange-bold
      ); /** Use for bold orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-bold: var(
        --sl-color-foreground-accent-purple-bold
      ); /** Use for bold purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for bold yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-caution-plain: var(
        --sl-color-border-accent-yellow-plain
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on elevation.surface background colors. */
      --sl-color-border-focused: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for focus rings of elements in a focus state. */
      --sl-color-border-neutral-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** Use for borders that highlight neutral actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-neutral-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight neutral actions or messages on elevation.surface background colors. */
      --sl-color-border-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for subtle borders on color.background.neutral background colors. */
      --sl-color-border-primary-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight primary actions or messages on elevation.surface background colors. */
      --sl-color-border-negative-plain: var(
        --sl-color-border-accent-red-plain
      ); /** Use for borders that highlight negative or serious error states on elevation.surface background colors. */
      --sl-color-border-positive-plain: var(
        --sl-color-border-accent-green-plain
      ); /** Use for borders that highlight a favorable outcome on elevation.surface background colors. */
      --sl-color-border-selected: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that emphasize selected states, such as tabs or menu items. */
      --sl-color-border-secondary-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight secondary actions or messages on elevation.surface background colors. */
      --sl-color-background-info-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for the background of actions with bold emphasis related to informative messages. */
      --sl-color-background-info-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background for informative messages. */
      --sl-color-background-info-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background for informative messages. */
      --sl-color-background-info-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-info-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-input-interactive: var(
        --sl-color-background-neutral-interactive-plain
      ); /** Used as transparent layer on top of the input background to indicate the hover state. */
      --sl-color-background-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for backgrounds of elements in a neutral state with subtle emphasis. */
      --sl-color-background-caution-bold: var(
        --sl-color-background-accent-yellow-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate caution. */
      --sl-color-background-caution-subtle: var(
        --sl-color-background-accent-yellow-subtle
      ); /** A subtle background option to communicate caution to prevent errors. */
      --sl-color-background-caution-subtlest: var(
        --sl-color-background-accent-yellow-subtlest
      ); /** The subtlest background option to communicate caution to prevent errors. */
      --sl-color-background-caution-interactive-bold: var(
        --sl-color-background-accent-yellow-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-caution-interactive-plain: var(
        --sl-color-background-accent-yellow-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the neutral action color. */
      --sl-color-background-neutral-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the neutral action color. */
      --sl-color-background-neutral-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-primary-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** A vibrant background option used for primary actions. */
      --sl-color-background-primary-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background in the primary action color. */
      --sl-color-background-primary-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-primary-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-primary-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-negative-bold: var(
        --sl-color-background-accent-red-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtle: var(
        --sl-color-background-accent-red-subtle
      ); /** A subtle background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtlest: var(
        --sl-color-background-accent-red-subtlest
      ); /** The subtlest background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-interactive-bold: var(
        --sl-color-background-accent-red-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-negative-interactive-plain: var(
        --sl-color-background-accent-red-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-positive-bold: var(
        --sl-color-background-accent-green-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate a positive outcome. */
      --sl-color-background-positive-subtle: var(
        --sl-color-background-accent-green-subtle
      ); /** A subtle background option for communicating a positive outcome. */
      --sl-color-background-positive-subtlest: var(
        --sl-color-background-accent-green-subtlest
      ); /** The subtlest background option for communicating a positive outcome. */
      --sl-color-background-positive-interactive-bold: var(
        --sl-color-background-accent-green-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-positive-interactive-plain: var(
        --sl-color-background-accent-green-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-selected-subtle: var(
        --sl-color-background-accent-blue-subtlest
      ); /** Use for backgrounds of elements in selected state with subtle emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-selected-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-secondary-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for secondary actions. */
      --sl-color-background-secondary-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the secondary action color. */
      --sl-color-background-secondary-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the secondary action color. */
      --sl-color-background-secondary-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-secondary-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-bold: var(--sl-color-foreground-accent-grey-bold); /** Use for headers and labels. */
      --sl-color-foreground-info-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-info-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for text that communicates informative messages the user needs to be aware of on neutral backgrounds. */
      --sl-color-foreground-brand: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for non-interactive brand-reinforcing text. */
      --sl-color-foreground-plain: var(--sl-color-foreground-accent-grey-plain); /** Use for body copy and menu items. */
      --sl-color-foreground-subtle: var(--sl-color-foreground-accent-grey-subtle); /** Use for subheadings. */
      --sl-color-foreground-caution-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for text that communicates caution to prevent mistakes or errors on caution backgrounds, such as 'color.background.caution.muted', and 'color.background.caution.subtle'. */
      --sl-color-foreground-caution-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for text that communicates caution to prevent mistakes or errors on neutral backgrounds. */
      --sl-color-foreground-caution-onBold: var(
        --sl-color-foreground-accent-yellow-onBold
      ); /** Use for text that communicates caution to prevent mistakes or errors on 'color.background.caution.bold'. */
      --sl-color-foreground-neutral-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-plain: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-primary-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for primary actions on 'color.background.primary.muted' and 'color.background.primary.subtle'. */
      --sl-color-foreground-disabled: var(
        --sl-color-foreground-accent-grey-faint
      ); /** Use for foreground in a disabled state. */
      --sl-color-foreground-inverted-onBold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for inverted text on 'color.background.inverted.bold'. */
      --sl-color-foreground-negative-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-negative-plain: var(
        --sl-color-foreground-accent-red-plain
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on neutral backgrounds. */
      --sl-color-foreground-positive-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
      --sl-color-foreground-positive-plain: var(
        --sl-color-foreground-accent-green-plain
      ); /** Use for text that communicates a favorable outcome on neutral backgrounds.' */
      --sl-color-foreground-selected-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-selected-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Used as selected foreground color on white backgrounds. */
      --sl-color-foreground-subtlest: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for placeholders and hints. */
      --sl-color-foreground-secondary-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-border-info-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight informative actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-info-subtle: var(
        --sl-color-background-info-subtle
      ); /** Use for subtle borders on color.background.info background colors. */
      --sl-color-border-input: var(
        --sl-color-border-bold
      ); /** Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons. */
      --sl-color-border-accent-grey-heavy: var(
        --sl-color-foreground-bold
      ); /** Use for heavy grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-caution-bold: var(
        --sl-color-border-accent-yellow-bold
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on muted, subtlest and subtle background colors. */
      --sl-color-border-primary-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight primary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-disabled: var(
        --sl-color-foreground-disabled
      ); /** Use for borders of elements in a disabled state. */
      --sl-color-border-negative-bold: var(
        --sl-color-border-accent-red-bold
      ); /** Use for borders that highlight negative or serious error states on muted, subtlest and subtle background colors. */
      --sl-color-border-positive-bold: var(
        --sl-color-border-accent-green-bold
      ); /** Use for borders that highlight a favorable outcome on muted, subtlest and subtle background colors. */
      --sl-color-border-secondary-bold: var(
        --sl-color-background-secondary-bold
      ); /** Use for borders that highlight secondary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-background-bold: var(
        --sl-color-border-bold
      ); /** Use for backgrounds of elements in a neutral state that require a bold emphasis or a minimum color contrast of 3:1, such as switch backgrounds. */
      --sl-color-foreground-accent-red-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.red.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-onInverted: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.inverted', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-onBold: var(
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
      --sl-color-foreground-neutral-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for neutral actions on 'color.background.neutral.bold' */
      --sl-color-foreground-info-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-primary-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for primary actions on 'color.background.primary.bold' */
      --sl-color-foreground-negative-onBold: var(
        --sl-color-foreground-accent-red-onBold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-positive-onBold: var(
        --sl-color-foreground-accent-green-onBold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
    }
  }
`;
