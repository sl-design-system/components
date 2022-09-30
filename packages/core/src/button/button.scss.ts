import { css } from 'lit';

export default css`
  :host {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  :host {
    --_background: var(--sl-color-button-default-idle-background);
    --_border-radius: var(--sl-border-radius-button);
    --_animation: var(--sl-animation-button);
  }

  :host {
    background: var(--_background);
    border: var(--_border-width) solid var(--_border-color);
    border-radius: var(--_border-radius);
    box-shadow: var(--_box-shadow);
    color: var(--_color);
    cursor: pointer;
    display: inline-flex;
    font: var(--_font);
    padding-block: var(--_padding-block);
    padding-inline: var(--_padding-inline);
    transform: var(--_transform);
    transition: var(--_animation);
    transition-property: background, border-color, border-radius, box-shadow, color;
  }

  :host([disabled]) {
    cursor: default;
    pointer-events: none;
  }

  :host(:focus) {
    box-shadow: var(--sl-box-shadow-button-default);
    outline: none;
  }

  :host([fill='default']) {
    --_border-width: var(--sl-border-width-button-default, var(--sl-border-width-button));
  }

  :host([fill='default'][size='sm']) {
    --_padding-block: var(--sl-space-button-default-sm-block, var(--sl-space-button-sm-block));
    --_padding-inline: var(--sl-space-button-default-sm-inline, var(--sl-space-button-sm-inline));
  }

  :host([fill='default'][size='md']) {
    --_padding-block: var(--sl-space-button-default-md-block, var(--sl-space-button-md-block));
    --_padding-inline: var(--sl-space-button-default-md-inline, var(--sl-space-button-md-inline));
  }

  :host([fill='default'][size='lg']) {
    --_padding-block: var(--sl-space-button-default-lg-block, var(--sl-space-button-lg-block));
    --_padding-inline: var(--sl-space-button-default-lg-inline, var(--sl-space-button-lg-inline));
  }

  :host([fill='default'][variant='default']) {
    --_background: var(--sl-color-button-default-default-idle-background);
    --_border-color: var(--sl-color-button-default-default-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-default-default-idle);
    --_color: var(--sl-color-button-default-default-idle-foreground);
    --_transform: var(--sl-transform-button-default-default-idle);
  }

  :host([fill='default'][variant='default']:focus) {
    --_background: var(--sl-color-button-default-default-focus-background);
    --_border-color: var(--sl-color-button-default-default-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-default-default-focus, var(--sl-box-shadow-button-default-default-idle));
    --_color: var(--sl-color-button-default-default-focus-foreground);
    --_transform: var(--sl-transform-button-default-default-focus);
  }

  :host([fill='default'][variant='default']:hover) {
    --_background: var(--sl-color-button-default-default-hover-background);
    --_border-color: var(--sl-color-button-default-default-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-default-default-hover, var(--sl-box-shadow-button-default-default-idle));
    --_color: var(--sl-color-button-default-default-hover-foreground);
    --_transform: var(--sl-transform-button-default-default-hover);
  }

  :host([fill='default'][variant='default']:active) {
    --_background: var(--sl-color-button-default-default-active-background);
    --_border-color: var(--sl-color-button-default-default-active-border);
    --_box-shadow: var(--sl-box-shadow-button-default-default-active, var(--sl-box-shadow-button-default-default-idle));
    --_color: var(--sl-color-button-default-default-active-foreground);
    --_transform: var(--sl-transform-button-default-default-active);
  }

  :host([fill='default'][variant='default'][disabled]) {
    --_background: var(--sl-color-button-default-default-disabled-background);
    --_border-color: var(--sl-color-button-default-default-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-default-default-disabled, var(--sl-box-shadow-button-default-default-idle));
    --_color: var(--sl-color-button-default-default-disabled-foreground);
    --_transform: var(--sl-transform-button-default-default-disabled);
  }

  :host([fill='default'][variant='primary']) {
    --_background: var(--sl-color-button-primary-default-idle-background);
    --_border-color: var(--sl-color-button-primary-default-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-default-idle);
    --_color: var(--sl-color-button-primary-default-idle-foreground);
    --_transform: var(--sl-transform-button-primary-default-idle);
  }

  :host([fill='default'][variant='primary']:focus) {
    --_background: var(--sl-color-button-primary-default-focus-background);
    --_border-color: var(--sl-color-button-primary-default-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-default-focus, var(--sl-box-shadow-button-primary-default-idle));
    --_color: var(--sl-color-button-primary-default-focus-foreground);
    --_transform: var(--sl-transform-button-primary-default-focus);
  }

  :host([fill='default'][variant='primary']:hover) {
    --_background: var(--sl-color-button-primary-default-hover-background);
    --_border-color: var(--sl-color-button-primary-default-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-default-hover, var(--sl-box-shadow-button-primary-default-idle));
    --_color: var(--sl-color-button-primary-default-hover-foreground);
    --_transform: var(--sl-transform-button-primary-default-hover);
  }

  :host([fill='default'][variant='primary']:active) {
    --_background: var(--sl-color-button-primary-default-active-background);
    --_border-color: var(--sl-color-button-primary-default-active-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-default-active, var(--sl-box-shadow-button-primary-default-idle));
    --_color: var(--sl-color-button-primary-default-active-foreground);
    --_transform: var(--sl-transform-button-primary-default-active);
  }

  :host([fill='default'][variant='primary'][disabled]) {
    --_background: var(--sl-color-button-primary-default-disabled-background);
    --_border-color: var(--sl-color-button-primary-default-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-default-disabled, var(--sl-box-shadow-button-primary-default-idle));
    --_color: var(--sl-color-button-primary-default-disabled-foreground);
    --_transform: var(--sl-transform-button-primary-default-disabled);
  }

  :host([fill='default'][variant='success']) {
    --_background: var(--sl-color-button-success-default-idle-background);
    --_border-color: var(--sl-color-button-success-default-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-success-default-idle);
    --_color: var(--sl-color-button-success-default-idle-foreground);
    --_transform: var(--sl-transform-button-success-default-idle);
  }

  :host([fill='default'][variant='success']:focus) {
    --_background: var(--sl-color-button-success-default-focus-background);
    --_border-color: var(--sl-color-button-success-default-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-success-default-focus, var(--sl-box-shadow-button-success-default-idle));
    --_color: var(--sl-color-button-success-default-focus-foreground);
    --_transform: var(--sl-transform-button-success-default-focus);
  }

  :host([fill='default'][variant='success']:hover) {
    --_background: var(--sl-color-button-success-default-hover-background);
    --_border-color: var(--sl-color-button-success-default-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-success-default-hover, var(--sl-box-shadow-button-success-default-idle));
    --_color: var(--sl-color-button-success-default-hover-foreground);
    --_transform: var(--sl-transform-button-success-default-hover);
  }

  :host([fill='default'][variant='success']:active) {
    --_background: var(--sl-color-button-success-default-active-background);
    --_border-color: var(--sl-color-button-success-default-active-border);
    --_box-shadow: var(--sl-box-shadow-button-success-default-active, var(--sl-box-shadow-button-success-default-idle));
    --_color: var(--sl-color-button-success-default-active-foreground);
    --_transform: var(--sl-transform-button-success-default-active);
  }

  :host([fill='default'][variant='success'][disabled]) {
    --_background: var(--sl-color-button-success-default-disabled-background);
    --_border-color: var(--sl-color-button-success-default-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-success-default-disabled, var(--sl-box-shadow-button-success-default-idle));
    --_color: var(--sl-color-button-success-default-disabled-foreground);
    --_transform: var(--sl-transform-button-success-default-disabled);
  }

  :host([fill='default'][variant='warning']) {
    --_background: var(--sl-color-button-warning-default-idle-background);
    --_border-color: var(--sl-color-button-warning-default-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-default-idle);
    --_color: var(--sl-color-button-warning-default-idle-foreground);
    --_transform: var(--sl-transform-button-warning-default-idle);
  }

  :host([fill='default'][variant='warning']:focus) {
    --_background: var(--sl-color-button-warning-default-focus-background);
    --_border-color: var(--sl-color-button-warning-default-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-default-focus, var(--sl-box-shadow-button-warning-default-idle));
    --_color: var(--sl-color-button-warning-default-focus-foreground);
    --_transform: var(--sl-transform-button-warning-default-focus);
  }

  :host([fill='default'][variant='warning']:hover) {
    --_background: var(--sl-color-button-warning-default-hover-background);
    --_border-color: var(--sl-color-button-warning-default-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-default-hover, var(--sl-box-shadow-button-warning-default-idle));
    --_color: var(--sl-color-button-warning-default-hover-foreground);
    --_transform: var(--sl-transform-button-warning-default-hover);
  }

  :host([fill='default'][variant='warning']:active) {
    --_background: var(--sl-color-button-warning-default-active-background);
    --_border-color: var(--sl-color-button-warning-default-active-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-default-active, var(--sl-box-shadow-button-warning-default-idle));
    --_color: var(--sl-color-button-warning-default-active-foreground);
    --_transform: var(--sl-transform-button-warning-default-active);
  }

  :host([fill='default'][variant='warning'][disabled]) {
    --_background: var(--sl-color-button-warning-default-disabled-background);
    --_border-color: var(--sl-color-button-warning-default-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-default-disabled, var(--sl-box-shadow-button-warning-default-idle));
    --_color: var(--sl-color-button-warning-default-disabled-foreground);
    --_transform: var(--sl-transform-button-warning-default-disabled);
  }

  :host([fill='default'][variant='danger']) {
    --_background: var(--sl-color-button-danger-default-idle-background);
    --_border-color: var(--sl-color-button-danger-default-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-default-idle);
    --_color: var(--sl-color-button-danger-default-idle-foreground);
    --_transform: var(--sl-transform-button-danger-default-idle);
  }

  :host([fill='default'][variant='danger']:focus) {
    --_background: var(--sl-color-button-danger-default-focus-background);
    --_border-color: var(--sl-color-button-danger-default-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-default-focus, var(--sl-box-shadow-button-danger-default-idle));
    --_color: var(--sl-color-button-danger-default-focus-foreground);
    --_transform: var(--sl-transform-button-danger-default-focus);
  }

  :host([fill='default'][variant='danger']:hover) {
    --_background: var(--sl-color-button-danger-default-hover-background);
    --_border-color: var(--sl-color-button-danger-default-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-default-hover, var(--sl-box-shadow-button-danger-default-idle));
    --_color: var(--sl-color-button-danger-default-hover-foreground);
    --_transform: var(--sl-transform-button-danger-default-hover);
  }

  :host([fill='default'][variant='danger']:active) {
    --_background: var(--sl-color-button-danger-default-active-background);
    --_border-color: var(--sl-color-button-danger-default-active-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-default-active, var(--sl-box-shadow-button-danger-default-idle));
    --_color: var(--sl-color-button-danger-default-active-foreground);
    --_transform: var(--sl-transform-button-danger-default-active);
  }

  :host([fill='default'][variant='danger'][disabled]) {
    --_background: var(--sl-color-button-danger-default-disabled-background);
    --_border-color: var(--sl-color-button-danger-default-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-default-disabled, var(--sl-box-shadow-button-danger-default-idle));
    --_color: var(--sl-color-button-danger-default-disabled-foreground);
    --_transform: var(--sl-transform-button-danger-default-disabled);
  }

  :host([fill='outline']) {
    --_border-width: var(--sl-border-width-button-outline, var(--sl-border-width-button));
  }

  :host([fill='outline'][size='sm']) {
    --_padding-block: var(--sl-space-button-outline-sm-block, var(--sl-space-button-sm-block));
    --_padding-inline: var(--sl-space-button-outline-sm-inline, var(--sl-space-button-sm-inline));
  }

  :host([fill='outline'][size='md']) {
    --_padding-block: var(--sl-space-button-outline-md-block, var(--sl-space-button-md-block));
    --_padding-inline: var(--sl-space-button-outline-md-inline, var(--sl-space-button-md-inline));
  }

  :host([fill='outline'][size='lg']) {
    --_padding-block: var(--sl-space-button-outline-lg-block, var(--sl-space-button-lg-block));
    --_padding-inline: var(--sl-space-button-outline-lg-inline, var(--sl-space-button-lg-inline));
  }

  :host([fill='outline'][variant='default']) {
    --_background: var(--sl-color-button-default-outline-idle-background);
    --_border-color: var(--sl-color-button-default-outline-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-default-outline-idle);
    --_color: var(--sl-color-button-default-outline-idle-foreground);
    --_transform: var(--sl-transform-button-default-outline-idle);
  }

  :host([fill='outline'][variant='default']:focus) {
    --_background: var(--sl-color-button-default-outline-focus-background);
    --_border-color: var(--sl-color-button-default-outline-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-default-outline-focus, var(--sl-box-shadow-button-default-outline-idle));
    --_color: var(--sl-color-button-default-outline-focus-foreground);
    --_transform: var(--sl-transform-button-default-outline-focus);
  }

  :host([fill='outline'][variant='default']:hover) {
    --_background: var(--sl-color-button-default-outline-hover-background);
    --_border-color: var(--sl-color-button-default-outline-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-default-outline-hover, var(--sl-box-shadow-button-default-outline-idle));
    --_color: var(--sl-color-button-default-outline-hover-foreground);
    --_transform: var(--sl-transform-button-default-outline-hover);
  }

  :host([fill='outline'][variant='default']:active) {
    --_background: var(--sl-color-button-default-outline-active-background);
    --_border-color: var(--sl-color-button-default-outline-active-border);
    --_box-shadow: var(--sl-box-shadow-button-default-outline-active, var(--sl-box-shadow-button-default-outline-idle));
    --_color: var(--sl-color-button-default-outline-active-foreground);
    --_transform: var(--sl-transform-button-default-outline-active);
  }

  :host([fill='outline'][variant='default'][disabled]) {
    --_background: var(--sl-color-button-default-outline-disabled-background);
    --_border-color: var(--sl-color-button-default-outline-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-default-outline-disabled, var(--sl-box-shadow-button-default-outline-idle));
    --_color: var(--sl-color-button-default-outline-disabled-foreground);
    --_transform: var(--sl-transform-button-default-outline-disabled);
  }

  :host([fill='outline'][variant='primary']) {
    --_background: var(--sl-color-button-primary-outline-idle-background);
    --_border-color: var(--sl-color-button-primary-outline-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-outline-idle);
    --_color: var(--sl-color-button-primary-outline-idle-foreground);
    --_transform: var(--sl-transform-button-primary-outline-idle);
  }

  :host([fill='outline'][variant='primary']:focus) {
    --_background: var(--sl-color-button-primary-outline-focus-background);
    --_border-color: var(--sl-color-button-primary-outline-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-outline-focus, var(--sl-box-shadow-button-primary-outline-idle));
    --_color: var(--sl-color-button-primary-outline-focus-foreground);
    --_transform: var(--sl-transform-button-primary-outline-focus);
  }

  :host([fill='outline'][variant='primary']:hover) {
    --_background: var(--sl-color-button-primary-outline-hover-background);
    --_border-color: var(--sl-color-button-primary-outline-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-outline-hover, var(--sl-box-shadow-button-primary-outline-idle));
    --_color: var(--sl-color-button-primary-outline-hover-foreground);
    --_transform: var(--sl-transform-button-primary-outline-hover);
  }

  :host([fill='outline'][variant='primary']:active) {
    --_background: var(--sl-color-button-primary-outline-active-background);
    --_border-color: var(--sl-color-button-primary-outline-active-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-outline-active, var(--sl-box-shadow-button-primary-outline-idle));
    --_color: var(--sl-color-button-primary-outline-active-foreground);
    --_transform: var(--sl-transform-button-primary-outline-active);
  }

  :host([fill='outline'][variant='primary'][disabled]) {
    --_background: var(--sl-color-button-primary-outline-disabled-background);
    --_border-color: var(--sl-color-button-primary-outline-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-primary-outline-disabled, var(--sl-box-shadow-button-primary-outline-idle));
    --_color: var(--sl-color-button-primary-outline-disabled-foreground);
    --_transform: var(--sl-transform-button-primary-outline-disabled);
  }

  :host([fill='outline'][variant='success']) {
    --_background: var(--sl-color-button-success-outline-idle-background);
    --_border-color: var(--sl-color-button-success-outline-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-success-outline-idle);
    --_color: var(--sl-color-button-success-outline-idle-foreground);
    --_transform: var(--sl-transform-button-success-outline-idle);
  }

  :host([fill='outline'][variant='success']:focus) {
    --_background: var(--sl-color-button-success-outline-focus-background);
    --_border-color: var(--sl-color-button-success-outline-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-success-outline-focus, var(--sl-box-shadow-button-success-outline-idle));
    --_color: var(--sl-color-button-success-outline-focus-foreground);
    --_transform: var(--sl-transform-button-success-outline-focus);
  }

  :host([fill='outline'][variant='success']:hover) {
    --_background: var(--sl-color-button-success-outline-hover-background);
    --_border-color: var(--sl-color-button-success-outline-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-success-outline-hover, var(--sl-box-shadow-button-success-outline-idle));
    --_color: var(--sl-color-button-success-outline-hover-foreground);
    --_transform: var(--sl-transform-button-success-outline-hover);
  }

  :host([fill='outline'][variant='success']:active) {
    --_background: var(--sl-color-button-success-outline-active-background);
    --_border-color: var(--sl-color-button-success-outline-active-border);
    --_box-shadow: var(--sl-box-shadow-button-success-outline-active, var(--sl-box-shadow-button-success-outline-idle));
    --_color: var(--sl-color-button-success-outline-active-foreground);
    --_transform: var(--sl-transform-button-success-outline-active);
  }

  :host([fill='outline'][variant='success'][disabled]) {
    --_background: var(--sl-color-button-success-outline-disabled-background);
    --_border-color: var(--sl-color-button-success-outline-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-success-outline-disabled, var(--sl-box-shadow-button-success-outline-idle));
    --_color: var(--sl-color-button-success-outline-disabled-foreground);
    --_transform: var(--sl-transform-button-success-outline-disabled);
  }

  :host([fill='outline'][variant='warning']) {
    --_background: var(--sl-color-button-warning-outline-idle-background);
    --_border-color: var(--sl-color-button-warning-outline-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-outline-idle);
    --_color: var(--sl-color-button-warning-outline-idle-foreground);
    --_transform: var(--sl-transform-button-warning-outline-idle);
  }

  :host([fill='outline'][variant='warning']:focus) {
    --_background: var(--sl-color-button-warning-outline-focus-background);
    --_border-color: var(--sl-color-button-warning-outline-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-outline-focus, var(--sl-box-shadow-button-warning-outline-idle));
    --_color: var(--sl-color-button-warning-outline-focus-foreground);
    --_transform: var(--sl-transform-button-warning-outline-focus);
  }

  :host([fill='outline'][variant='warning']:hover) {
    --_background: var(--sl-color-button-warning-outline-hover-background);
    --_border-color: var(--sl-color-button-warning-outline-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-outline-hover, var(--sl-box-shadow-button-warning-outline-idle));
    --_color: var(--sl-color-button-warning-outline-hover-foreground);
    --_transform: var(--sl-transform-button-warning-outline-hover);
  }

  :host([fill='outline'][variant='warning']:active) {
    --_background: var(--sl-color-button-warning-outline-active-background);
    --_border-color: var(--sl-color-button-warning-outline-active-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-outline-active, var(--sl-box-shadow-button-warning-outline-idle));
    --_color: var(--sl-color-button-warning-outline-active-foreground);
    --_transform: var(--sl-transform-button-warning-outline-active);
  }

  :host([fill='outline'][variant='warning'][disabled]) {
    --_background: var(--sl-color-button-warning-outline-disabled-background);
    --_border-color: var(--sl-color-button-warning-outline-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-warning-outline-disabled, var(--sl-box-shadow-button-warning-outline-idle));
    --_color: var(--sl-color-button-warning-outline-disabled-foreground);
    --_transform: var(--sl-transform-button-warning-outline-disabled);
  }

  :host([fill='outline'][variant='danger']) {
    --_background: var(--sl-color-button-danger-outline-idle-background);
    --_border-color: var(--sl-color-button-danger-outline-idle-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-outline-idle);
    --_color: var(--sl-color-button-danger-outline-idle-foreground);
    --_transform: var(--sl-transform-button-danger-outline-idle);
  }

  :host([fill='outline'][variant='danger']:focus) {
    --_background: var(--sl-color-button-danger-outline-focus-background);
    --_border-color: var(--sl-color-button-danger-outline-focus-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-outline-focus, var(--sl-box-shadow-button-danger-outline-idle));
    --_color: var(--sl-color-button-danger-outline-focus-foreground);
    --_transform: var(--sl-transform-button-danger-outline-focus);
  }

  :host([fill='outline'][variant='danger']:hover) {
    --_background: var(--sl-color-button-danger-outline-hover-background);
    --_border-color: var(--sl-color-button-danger-outline-hover-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-outline-hover, var(--sl-box-shadow-button-danger-outline-idle));
    --_color: var(--sl-color-button-danger-outline-hover-foreground);
    --_transform: var(--sl-transform-button-danger-outline-hover);
  }

  :host([fill='outline'][variant='danger']:active) {
    --_background: var(--sl-color-button-danger-outline-active-background);
    --_border-color: var(--sl-color-button-danger-outline-active-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-outline-active, var(--sl-box-shadow-button-danger-outline-idle));
    --_color: var(--sl-color-button-danger-outline-active-foreground);
    --_transform: var(--sl-transform-button-danger-outline-active);
  }

  :host([fill='outline'][variant='danger'][disabled]) {
    --_background: var(--sl-color-button-danger-outline-disabled-background);
    --_border-color: var(--sl-color-button-danger-outline-disabled-border);
    --_box-shadow: var(--sl-box-shadow-button-danger-outline-disabled, var(--sl-box-shadow-button-danger-outline-idle));
    --_color: var(--sl-color-button-danger-outline-disabled-foreground);
    --_transform: var(--sl-transform-button-danger-outline-disabled);
  }

  :host([size='sm']) {
    --_font: var(--sl-text-button-sm);
    --_padding: var(--sl-space-button-sm);
  }

  :host([size='md']) {
    --_font: var(--sl-text-button-md);
    --_padding: var(--sl-space-button-md);
  }

  :host([size='lg']) {
    --_font: var(--sl-text-button-lg);
    --_padding: var(--sl-space-button-lg);
  }
`;
