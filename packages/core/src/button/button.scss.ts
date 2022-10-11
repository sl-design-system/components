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
    color: var(--_color);
    cursor: pointer;
    display: inline-flex;
    font: var(--_font);
    padding-block: var(--_padding-block);
    padding-inline: var(--_padding-inline);
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
    --_color: var(--sl-color-button-default-default-idle-foreground);
  }

  :host([fill='default'][variant='default']:focus) {
    --_background: var(--sl-color-button-default-default-focus-background);
    --_border-color: var(--sl-color-button-default-default-focus-border);
    --_color: var(--sl-color-button-default-default-focus-foreground);
  }

  :host([fill='default'][variant='default']:hover) {
    --_background: var(--sl-color-button-default-default-hover-background);
    --_border-color: var(--sl-color-button-default-default-hover-border);
    --_color: var(--sl-color-button-default-default-hover-foreground);
  }

  :host([fill='default'][variant='default']:active) {
    --_background: var(--sl-color-button-default-default-active-background);
    --_border-color: var(--sl-color-button-default-default-active-border);
    --_color: var(--sl-color-button-default-default-active-foreground);
  }

  :host([fill='default'][variant='default'][disabled]) {
    --_background: var(--sl-color-button-default-default-disabled-background);
    --_border-color: var(--sl-color-button-default-default-disabled-border);
    --_color: var(--sl-color-button-default-default-disabled-foreground);
  }

  :host([fill='default'][variant='primary']) {
    --_background: var(--sl-color-button-primary-default-idle-background);
    --_border-color: var(--sl-color-button-primary-default-idle-border);
    --_color: var(--sl-color-button-primary-default-idle-foreground);
  }

  :host([fill='default'][variant='primary']:focus) {
    --_background: var(--sl-color-button-primary-default-focus-background);
    --_border-color: var(--sl-color-button-primary-default-focus-border);
    --_color: var(--sl-color-button-primary-default-focus-foreground);
  }

  :host([fill='default'][variant='primary']:hover) {
    --_background: var(--sl-color-button-primary-default-hover-background);
    --_border-color: var(--sl-color-button-primary-default-hover-border);
    --_color: var(--sl-color-button-primary-default-hover-foreground);
  }

  :host([fill='default'][variant='primary']:active) {
    --_background: var(--sl-color-button-primary-default-active-background);
    --_border-color: var(--sl-color-button-primary-default-active-border);
    --_color: var(--sl-color-button-primary-default-active-foreground);
  }

  :host([fill='default'][variant='primary'][disabled]) {
    --_background: var(--sl-color-button-primary-default-disabled-background);
    --_border-color: var(--sl-color-button-primary-default-disabled-border);
    --_color: var(--sl-color-button-primary-default-disabled-foreground);
  }

  :host([fill='default'][variant='success']) {
    --_background: var(--sl-color-button-success-default-idle-background);
    --_border-color: var(--sl-color-button-success-default-idle-border);
    --_color: var(--sl-color-button-success-default-idle-foreground);
  }

  :host([fill='default'][variant='success']:focus) {
    --_background: var(--sl-color-button-success-default-focus-background);
    --_border-color: var(--sl-color-button-success-default-focus-border);
    --_color: var(--sl-color-button-success-default-focus-foreground);
  }

  :host([fill='default'][variant='success']:hover) {
    --_background: var(--sl-color-button-success-default-hover-background);
    --_border-color: var(--sl-color-button-success-default-hover-border);
    --_color: var(--sl-color-button-success-default-hover-foreground);
  }

  :host([fill='default'][variant='success']:active) {
    --_background: var(--sl-color-button-success-default-active-background);
    --_border-color: var(--sl-color-button-success-default-active-border);
    --_color: var(--sl-color-button-success-default-active-foreground);
  }

  :host([fill='default'][variant='success'][disabled]) {
    --_background: var(--sl-color-button-success-default-disabled-background);
    --_border-color: var(--sl-color-button-success-default-disabled-border);
    --_color: var(--sl-color-button-success-default-disabled-foreground);
  }

  :host([fill='default'][variant='warning']) {
    --_background: var(--sl-color-button-warning-default-idle-background);
    --_border-color: var(--sl-color-button-warning-default-idle-border);
    --_color: var(--sl-color-button-warning-default-idle-foreground);
  }

  :host([fill='default'][variant='warning']:focus) {
    --_background: var(--sl-color-button-warning-default-focus-background);
    --_border-color: var(--sl-color-button-warning-default-focus-border);
    --_color: var(--sl-color-button-warning-default-focus-foreground);
  }

  :host([fill='default'][variant='warning']:hover) {
    --_background: var(--sl-color-button-warning-default-hover-background);
    --_border-color: var(--sl-color-button-warning-default-hover-border);
    --_color: var(--sl-color-button-warning-default-hover-foreground);
  }

  :host([fill='default'][variant='warning']:active) {
    --_background: var(--sl-color-button-warning-default-active-background);
    --_border-color: var(--sl-color-button-warning-default-active-border);
    --_color: var(--sl-color-button-warning-default-active-foreground);
  }

  :host([fill='default'][variant='warning'][disabled]) {
    --_background: var(--sl-color-button-warning-default-disabled-background);
    --_border-color: var(--sl-color-button-warning-default-disabled-border);
    --_color: var(--sl-color-button-warning-default-disabled-foreground);
  }

  :host([fill='default'][variant='danger']) {
    --_background: var(--sl-color-button-danger-default-idle-background);
    --_border-color: var(--sl-color-button-danger-default-idle-border);
    --_color: var(--sl-color-button-danger-default-idle-foreground);
  }

  :host([fill='default'][variant='danger']:focus) {
    --_background: var(--sl-color-button-danger-default-focus-background);
    --_border-color: var(--sl-color-button-danger-default-focus-border);
    --_color: var(--sl-color-button-danger-default-focus-foreground);
  }

  :host([fill='default'][variant='danger']:hover) {
    --_background: var(--sl-color-button-danger-default-hover-background);
    --_border-color: var(--sl-color-button-danger-default-hover-border);
    --_color: var(--sl-color-button-danger-default-hover-foreground);
  }

  :host([fill='default'][variant='danger']:active) {
    --_background: var(--sl-color-button-danger-default-active-background);
    --_border-color: var(--sl-color-button-danger-default-active-border);
    --_color: var(--sl-color-button-danger-default-active-foreground);
  }

  :host([fill='default'][variant='danger'][disabled]) {
    --_background: var(--sl-color-button-danger-default-disabled-background);
    --_border-color: var(--sl-color-button-danger-default-disabled-border);
    --_color: var(--sl-color-button-danger-default-disabled-foreground);
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
    --_color: var(--sl-color-button-default-outline-idle-foreground);
  }

  :host([fill='outline'][variant='default']:focus) {
    --_background: var(--sl-color-button-default-outline-focus-background);
    --_border-color: var(--sl-color-button-default-outline-focus-border);
    --_color: var(--sl-color-button-default-outline-focus-foreground);
  }

  :host([fill='outline'][variant='default']:hover) {
    --_background: var(--sl-color-button-default-outline-hover-background);
    --_border-color: var(--sl-color-button-default-outline-hover-border);
    --_color: var(--sl-color-button-default-outline-hover-foreground);
  }

  :host([fill='outline'][variant='default']:active) {
    --_background: var(--sl-color-button-default-outline-active-background);
    --_border-color: var(--sl-color-button-default-outline-active-border);
    --_color: var(--sl-color-button-default-outline-active-foreground);
  }

  :host([fill='outline'][variant='default'][disabled]) {
    --_background: var(--sl-color-button-default-outline-disabled-background);
    --_border-color: var(--sl-color-button-default-outline-disabled-border);
    --_color: var(--sl-color-button-default-outline-disabled-foreground);
  }

  :host([fill='outline'][variant='primary']) {
    --_background: var(--sl-color-button-primary-outline-idle-background);
    --_border-color: var(--sl-color-button-primary-outline-idle-border);
    --_color: var(--sl-color-button-primary-outline-idle-foreground);
  }

  :host([fill='outline'][variant='primary']:focus) {
    --_background: var(--sl-color-button-primary-outline-focus-background);
    --_border-color: var(--sl-color-button-primary-outline-focus-border);
    --_color: var(--sl-color-button-primary-outline-focus-foreground);
  }

  :host([fill='outline'][variant='primary']:hover) {
    --_background: var(--sl-color-button-primary-outline-hover-background);
    --_border-color: var(--sl-color-button-primary-outline-hover-border);
    --_color: var(--sl-color-button-primary-outline-hover-foreground);
  }

  :host([fill='outline'][variant='primary']:active) {
    --_background: var(--sl-color-button-primary-outline-active-background);
    --_border-color: var(--sl-color-button-primary-outline-active-border);
    --_color: var(--sl-color-button-primary-outline-active-foreground);
  }

  :host([fill='outline'][variant='primary'][disabled]) {
    --_background: var(--sl-color-button-primary-outline-disabled-background);
    --_border-color: var(--sl-color-button-primary-outline-disabled-border);
    --_color: var(--sl-color-button-primary-outline-disabled-foreground);
  }

  :host([fill='outline'][variant='success']) {
    --_background: var(--sl-color-button-success-outline-idle-background);
    --_border-color: var(--sl-color-button-success-outline-idle-border);
    --_color: var(--sl-color-button-success-outline-idle-foreground);
  }

  :host([fill='outline'][variant='success']:focus) {
    --_background: var(--sl-color-button-success-outline-focus-background);
    --_border-color: var(--sl-color-button-success-outline-focus-border);
    --_color: var(--sl-color-button-success-outline-focus-foreground);
  }

  :host([fill='outline'][variant='success']:hover) {
    --_background: var(--sl-color-button-success-outline-hover-background);
    --_border-color: var(--sl-color-button-success-outline-hover-border);
    --_color: var(--sl-color-button-success-outline-hover-foreground);
  }

  :host([fill='outline'][variant='success']:active) {
    --_background: var(--sl-color-button-success-outline-active-background);
    --_border-color: var(--sl-color-button-success-outline-active-border);
    --_color: var(--sl-color-button-success-outline-active-foreground);
  }

  :host([fill='outline'][variant='success'][disabled]) {
    --_background: var(--sl-color-button-success-outline-disabled-background);
    --_border-color: var(--sl-color-button-success-outline-disabled-border);
    --_color: var(--sl-color-button-success-outline-disabled-foreground);
  }

  :host([fill='outline'][variant='warning']) {
    --_background: var(--sl-color-button-warning-outline-idle-background);
    --_border-color: var(--sl-color-button-warning-outline-idle-border);
    --_color: var(--sl-color-button-warning-outline-idle-foreground);
  }

  :host([fill='outline'][variant='warning']:focus) {
    --_background: var(--sl-color-button-warning-outline-focus-background);
    --_border-color: var(--sl-color-button-warning-outline-focus-border);
    --_color: var(--sl-color-button-warning-outline-focus-foreground);
  }

  :host([fill='outline'][variant='warning']:hover) {
    --_background: var(--sl-color-button-warning-outline-hover-background);
    --_border-color: var(--sl-color-button-warning-outline-hover-border);
    --_color: var(--sl-color-button-warning-outline-hover-foreground);
  }

  :host([fill='outline'][variant='warning']:active) {
    --_background: var(--sl-color-button-warning-outline-active-background);
    --_border-color: var(--sl-color-button-warning-outline-active-border);
    --_color: var(--sl-color-button-warning-outline-active-foreground);
  }

  :host([fill='outline'][variant='warning'][disabled]) {
    --_background: var(--sl-color-button-warning-outline-disabled-background);
    --_border-color: var(--sl-color-button-warning-outline-disabled-border);
    --_color: var(--sl-color-button-warning-outline-disabled-foreground);
  }

  :host([fill='outline'][variant='danger']) {
    --_background: var(--sl-color-button-danger-outline-idle-background);
    --_border-color: var(--sl-color-button-danger-outline-idle-border);
    --_color: var(--sl-color-button-danger-outline-idle-foreground);
  }

  :host([fill='outline'][variant='danger']:focus) {
    --_background: var(--sl-color-button-danger-outline-focus-background);
    --_border-color: var(--sl-color-button-danger-outline-focus-border);
    --_color: var(--sl-color-button-danger-outline-focus-foreground);
  }

  :host([fill='outline'][variant='danger']:hover) {
    --_background: var(--sl-color-button-danger-outline-hover-background);
    --_border-color: var(--sl-color-button-danger-outline-hover-border);
    --_color: var(--sl-color-button-danger-outline-hover-foreground);
  }

  :host([fill='outline'][variant='danger']:active) {
    --_background: var(--sl-color-button-danger-outline-active-background);
    --_border-color: var(--sl-color-button-danger-outline-active-border);
    --_color: var(--sl-color-button-danger-outline-active-foreground);
  }

  :host([fill='outline'][variant='danger'][disabled]) {
    --_background: var(--sl-color-button-danger-outline-disabled-background);
    --_border-color: var(--sl-color-button-danger-outline-disabled-border);
    --_color: var(--sl-color-button-danger-outline-disabled-foreground);
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
