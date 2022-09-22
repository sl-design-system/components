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
    --_border-radius: var(--sl-border-radius-button);
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
  }

  :host([disabled]) {
    cursor: default;
    pointer-events: none;
  }

  :host([fill='ghost']) {
    --_border-width: var(--sl-border-width-button-ghost, var(--sl-border-width-button));
  }

  :host([fill='ghost'][size='sm']) {
    --_padding-block: var(--sl-space-button-ghost-sm-block, var(--sl-space-button-sm-block));
    --_padding-inline: var(--sl-space-button-ghost-sm-inline, var(--sl-space-button-sm-inline));
  }

  :host([fill='ghost'][size='md']) {
    --_padding-block: var(--sl-space-button-ghost-md-block, var(--sl-space-button-md-block));
    --_padding-inline: var(--sl-space-button-ghost-md-inline, var(--sl-space-button-md-inline));
  }

  :host([fill='ghost'][size='lg']) {
    --_padding-block: var(--sl-space-button-ghost-lg-block, var(--sl-space-button-lg-block));
    --_padding-inline: var(--sl-space-button-ghost-lg-inline, var(--sl-space-button-lg-inline));
  }

  :host([fill='ghost'][variant='primary']) {
    --_background: var(--sl-color-button-primary-ghost-idle-background);
    --_border-color: var(--sl-color-button-primary-ghost-idle-border);
    --_color: var(--sl-color-button-primary-ghost-idle-foreground);
  }

  :host([fill='ghost'][variant='primary']:hover) {
    --_background: var(--sl-color-button-primary-ghost-hover-background);
    --_border-color: var(--sl-color-button-primary-ghost-hover-border);
    --_color: var(--sl-color-button-primary-ghost-hover-foreground);
  }

  :host([fill='ghost'][variant='primary']:active) {
    --_background: var(--sl-color-button-primary-ghost-active-background);
    --_border-color: var(--sl-color-button-primary-ghost-active-border);
    --_color: var(--sl-color-button-primary-ghost-active-foreground);
  }

  :host([fill='ghost'][variant='primary'][disabled]) {
    --_background: var(--sl-color-button-primary-ghost-disabled-background);
    --_border-color: var(--sl-color-button-primary-ghost-disabled-border);
    --_color: var(--sl-color-button-primary-ghost-disabled-foreground);
  }

  :host([fill='ghost'][variant='secondary']) {
    --_background: var(--sl-color-button-secondary-ghost-idle-background);
    --_border-color: var(--sl-color-button-secondary-ghost-idle-border);
    --_color: var(--sl-color-button-secondary-ghost-idle-foreground);
  }

  :host([fill='ghost'][variant='secondary']:hover) {
    --_background: var(--sl-color-button-secondary-ghost-hover-background);
    --_border-color: var(--sl-color-button-secondary-ghost-hover-border);
    --_color: var(--sl-color-button-secondary-ghost-hover-foreground);
  }

  :host([fill='ghost'][variant='secondary']:active) {
    --_background: var(--sl-color-button-secondary-ghost-active-background);
    --_border-color: var(--sl-color-button-secondary-ghost-active-border);
    --_color: var(--sl-color-button-secondary-ghost-active-foreground);
  }

  :host([fill='ghost'][variant='secondary'][disabled]) {
    --_background: var(--sl-color-button-secondary-ghost-disabled-background);
    --_border-color: var(--sl-color-button-secondary-ghost-disabled-border);
    --_color: var(--sl-color-button-secondary-ghost-disabled-foreground);
  }

  :host([fill='ghost'][variant='accent']) {
    --_background: var(--sl-color-button-accent-ghost-idle-background);
    --_border-color: var(--sl-color-button-accent-ghost-idle-border);
    --_color: var(--sl-color-button-accent-ghost-idle-foreground);
  }

  :host([fill='ghost'][variant='accent']:hover) {
    --_background: var(--sl-color-button-accent-ghost-hover-background);
    --_border-color: var(--sl-color-button-accent-ghost-hover-border);
    --_color: var(--sl-color-button-accent-ghost-hover-foreground);
  }

  :host([fill='ghost'][variant='accent']:active) {
    --_background: var(--sl-color-button-accent-ghost-active-background);
    --_border-color: var(--sl-color-button-accent-ghost-active-border);
    --_color: var(--sl-color-button-accent-ghost-active-foreground);
  }

  :host([fill='ghost'][variant='accent'][disabled]) {
    --_background: var(--sl-color-button-accent-ghost-disabled-background);
    --_border-color: var(--sl-color-button-accent-ghost-disabled-border);
    --_color: var(--sl-color-button-accent-ghost-disabled-foreground);
  }

  :host([fill='ghost'][variant='success']) {
    --_background: var(--sl-color-button-success-ghost-idle-background);
    --_border-color: var(--sl-color-button-success-ghost-idle-border);
    --_color: var(--sl-color-button-success-ghost-idle-foreground);
  }

  :host([fill='ghost'][variant='success']:hover) {
    --_background: var(--sl-color-button-success-ghost-hover-background);
    --_border-color: var(--sl-color-button-success-ghost-hover-border);
    --_color: var(--sl-color-button-success-ghost-hover-foreground);
  }

  :host([fill='ghost'][variant='success']:active) {
    --_background: var(--sl-color-button-success-ghost-active-background);
    --_border-color: var(--sl-color-button-success-ghost-active-border);
    --_color: var(--sl-color-button-success-ghost-active-foreground);
  }

  :host([fill='ghost'][variant='success'][disabled]) {
    --_background: var(--sl-color-button-success-ghost-disabled-background);
    --_border-color: var(--sl-color-button-success-ghost-disabled-border);
    --_color: var(--sl-color-button-success-ghost-disabled-foreground);
  }

  :host([fill='ghost'][variant='danger']) {
    --_background: var(--sl-color-button-danger-ghost-idle-background);
    --_border-color: var(--sl-color-button-danger-ghost-idle-border);
    --_color: var(--sl-color-button-danger-ghost-idle-foreground);
  }

  :host([fill='ghost'][variant='danger']:hover) {
    --_background: var(--sl-color-button-danger-ghost-hover-background);
    --_border-color: var(--sl-color-button-danger-ghost-hover-border);
    --_color: var(--sl-color-button-danger-ghost-hover-foreground);
  }

  :host([fill='ghost'][variant='danger']:active) {
    --_background: var(--sl-color-button-danger-ghost-active-background);
    --_border-color: var(--sl-color-button-danger-ghost-active-border);
    --_color: var(--sl-color-button-danger-ghost-active-foreground);
  }

  :host([fill='ghost'][variant='danger'][disabled]) {
    --_background: var(--sl-color-button-danger-ghost-disabled-background);
    --_border-color: var(--sl-color-button-danger-ghost-disabled-border);
    --_color: var(--sl-color-button-danger-ghost-disabled-foreground);
  }

  :host([fill='ghost'][variant='info']) {
    --_background: var(--sl-color-button-info-ghost-idle-background);
    --_border-color: var(--sl-color-button-info-ghost-idle-border);
    --_color: var(--sl-color-button-info-ghost-idle-foreground);
  }

  :host([fill='ghost'][variant='info']:hover) {
    --_background: var(--sl-color-button-info-ghost-hover-background);
    --_border-color: var(--sl-color-button-info-ghost-hover-border);
    --_color: var(--sl-color-button-info-ghost-hover-foreground);
  }

  :host([fill='ghost'][variant='info']:active) {
    --_background: var(--sl-color-button-info-ghost-active-background);
    --_border-color: var(--sl-color-button-info-ghost-active-border);
    --_color: var(--sl-color-button-info-ghost-active-foreground);
  }

  :host([fill='ghost'][variant='info'][disabled]) {
    --_background: var(--sl-color-button-info-ghost-disabled-background);
    --_border-color: var(--sl-color-button-info-ghost-disabled-border);
    --_color: var(--sl-color-button-info-ghost-disabled-foreground);
  }

  :host([fill='ghost'][variant='warning']) {
    --_background: var(--sl-color-button-warning-ghost-idle-background);
    --_border-color: var(--sl-color-button-warning-ghost-idle-border);
    --_color: var(--sl-color-button-warning-ghost-idle-foreground);
  }

  :host([fill='ghost'][variant='warning']:hover) {
    --_background: var(--sl-color-button-warning-ghost-hover-background);
    --_border-color: var(--sl-color-button-warning-ghost-hover-border);
    --_color: var(--sl-color-button-warning-ghost-hover-foreground);
  }

  :host([fill='ghost'][variant='warning']:active) {
    --_background: var(--sl-color-button-warning-ghost-active-background);
    --_border-color: var(--sl-color-button-warning-ghost-active-border);
    --_color: var(--sl-color-button-warning-ghost-active-foreground);
  }

  :host([fill='ghost'][variant='warning'][disabled]) {
    --_background: var(--sl-color-button-warning-ghost-disabled-background);
    --_border-color: var(--sl-color-button-warning-ghost-disabled-border);
    --_color: var(--sl-color-button-warning-ghost-disabled-foreground);
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

  :host([fill='outline'][variant='primary']) {
    --_background: var(--sl-color-button-primary-outline-idle-background);
    --_border-color: var(--sl-color-button-primary-outline-idle-border);
    --_color: var(--sl-color-button-primary-outline-idle-foreground);
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

  :host([fill='outline'][variant='secondary']) {
    --_background: var(--sl-color-button-secondary-outline-idle-background);
    --_border-color: var(--sl-color-button-secondary-outline-idle-border);
    --_color: var(--sl-color-button-secondary-outline-idle-foreground);
  }

  :host([fill='outline'][variant='secondary']:hover) {
    --_background: var(--sl-color-button-secondary-outline-hover-background);
    --_border-color: var(--sl-color-button-secondary-outline-hover-border);
    --_color: var(--sl-color-button-secondary-outline-hover-foreground);
  }

  :host([fill='outline'][variant='secondary']:active) {
    --_background: var(--sl-color-button-secondary-outline-active-background);
    --_border-color: var(--sl-color-button-secondary-outline-active-border);
    --_color: var(--sl-color-button-secondary-outline-active-foreground);
  }

  :host([fill='outline'][variant='secondary'][disabled]) {
    --_background: var(--sl-color-button-secondary-outline-disabled-background);
    --_border-color: var(--sl-color-button-secondary-outline-disabled-border);
    --_color: var(--sl-color-button-secondary-outline-disabled-foreground);
  }

  :host([fill='outline'][variant='accent']) {
    --_background: var(--sl-color-button-accent-outline-idle-background);
    --_border-color: var(--sl-color-button-accent-outline-idle-border);
    --_color: var(--sl-color-button-accent-outline-idle-foreground);
  }

  :host([fill='outline'][variant='accent']:hover) {
    --_background: var(--sl-color-button-accent-outline-hover-background);
    --_border-color: var(--sl-color-button-accent-outline-hover-border);
    --_color: var(--sl-color-button-accent-outline-hover-foreground);
  }

  :host([fill='outline'][variant='accent']:active) {
    --_background: var(--sl-color-button-accent-outline-active-background);
    --_border-color: var(--sl-color-button-accent-outline-active-border);
    --_color: var(--sl-color-button-accent-outline-active-foreground);
  }

  :host([fill='outline'][variant='accent'][disabled]) {
    --_background: var(--sl-color-button-accent-outline-disabled-background);
    --_border-color: var(--sl-color-button-accent-outline-disabled-border);
    --_color: var(--sl-color-button-accent-outline-disabled-foreground);
  }

  :host([fill='outline'][variant='success']) {
    --_background: var(--sl-color-button-success-outline-idle-background);
    --_border-color: var(--sl-color-button-success-outline-idle-border);
    --_color: var(--sl-color-button-success-outline-idle-foreground);
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

  :host([fill='outline'][variant='danger']) {
    --_background: var(--sl-color-button-danger-outline-idle-background);
    --_border-color: var(--sl-color-button-danger-outline-idle-border);
    --_color: var(--sl-color-button-danger-outline-idle-foreground);
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

  :host([fill='outline'][variant='info']) {
    --_background: var(--sl-color-button-info-outline-idle-background);
    --_border-color: var(--sl-color-button-info-outline-idle-border);
    --_color: var(--sl-color-button-info-outline-idle-foreground);
  }

  :host([fill='outline'][variant='info']:hover) {
    --_background: var(--sl-color-button-info-outline-hover-background);
    --_border-color: var(--sl-color-button-info-outline-hover-border);
    --_color: var(--sl-color-button-info-outline-hover-foreground);
  }

  :host([fill='outline'][variant='info']:active) {
    --_background: var(--sl-color-button-info-outline-active-background);
    --_border-color: var(--sl-color-button-info-outline-active-border);
    --_color: var(--sl-color-button-info-outline-active-foreground);
  }

  :host([fill='outline'][variant='info'][disabled]) {
    --_background: var(--sl-color-button-info-outline-disabled-background);
    --_border-color: var(--sl-color-button-info-outline-disabled-border);
    --_color: var(--sl-color-button-info-outline-disabled-foreground);
  }

  :host([fill='outline'][variant='warning']) {
    --_background: var(--sl-color-button-warning-outline-idle-background);
    --_border-color: var(--sl-color-button-warning-outline-idle-border);
    --_color: var(--sl-color-button-warning-outline-idle-foreground);
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

  :host([fill='solid']) {
    --_border-width: var(--sl-border-width-button-solid, var(--sl-border-width-button));
  }

  :host([fill='solid'][size='sm']) {
    --_padding-block: var(--sl-space-button-solid-sm-block, var(--sl-space-button-sm-block));
    --_padding-inline: var(--sl-space-button-solid-sm-inline, var(--sl-space-button-sm-inline));
  }

  :host([fill='solid'][size='md']) {
    --_padding-block: var(--sl-space-button-solid-md-block, var(--sl-space-button-md-block));
    --_padding-inline: var(--sl-space-button-solid-md-inline, var(--sl-space-button-md-inline));
  }

  :host([fill='solid'][size='lg']) {
    --_padding-block: var(--sl-space-button-solid-lg-block, var(--sl-space-button-lg-block));
    --_padding-inline: var(--sl-space-button-solid-lg-inline, var(--sl-space-button-lg-inline));
  }

  :host([fill='solid'][variant='primary']) {
    --_background: var(--sl-color-button-primary-solid-idle-background);
    --_border-color: var(--sl-color-button-primary-solid-idle-border);
    --_color: var(--sl-color-button-primary-solid-idle-foreground);
  }

  :host([fill='solid'][variant='primary']:hover) {
    --_background: var(--sl-color-button-primary-solid-hover-background);
    --_border-color: var(--sl-color-button-primary-solid-hover-border);
    --_color: var(--sl-color-button-primary-solid-hover-foreground);
  }

  :host([fill='solid'][variant='primary']:active) {
    --_background: var(--sl-color-button-primary-solid-active-background);
    --_border-color: var(--sl-color-button-primary-solid-active-border);
    --_color: var(--sl-color-button-primary-solid-active-foreground);
  }

  :host([fill='solid'][variant='primary'][disabled]) {
    --_background: var(--sl-color-button-primary-solid-disabled-background);
    --_border-color: var(--sl-color-button-primary-solid-disabled-border);
    --_color: var(--sl-color-button-primary-solid-disabled-foreground);
  }

  :host([fill='solid'][variant='secondary']) {
    --_background: var(--sl-color-button-secondary-solid-idle-background);
    --_border-color: var(--sl-color-button-secondary-solid-idle-border);
    --_color: var(--sl-color-button-secondary-solid-idle-foreground);
  }

  :host([fill='solid'][variant='secondary']:hover) {
    --_background: var(--sl-color-button-secondary-solid-hover-background);
    --_border-color: var(--sl-color-button-secondary-solid-hover-border);
    --_color: var(--sl-color-button-secondary-solid-hover-foreground);
  }

  :host([fill='solid'][variant='secondary']:active) {
    --_background: var(--sl-color-button-secondary-solid-active-background);
    --_border-color: var(--sl-color-button-secondary-solid-active-border);
    --_color: var(--sl-color-button-secondary-solid-active-foreground);
  }

  :host([fill='solid'][variant='secondary'][disabled]) {
    --_background: var(--sl-color-button-secondary-solid-disabled-background);
    --_border-color: var(--sl-color-button-secondary-solid-disabled-border);
    --_color: var(--sl-color-button-secondary-solid-disabled-foreground);
  }

  :host([fill='solid'][variant='accent']) {
    --_background: var(--sl-color-button-accent-solid-idle-background);
    --_border-color: var(--sl-color-button-accent-solid-idle-border);
    --_color: var(--sl-color-button-accent-solid-idle-foreground);
  }

  :host([fill='solid'][variant='accent']:hover) {
    --_background: var(--sl-color-button-accent-solid-hover-background);
    --_border-color: var(--sl-color-button-accent-solid-hover-border);
    --_color: var(--sl-color-button-accent-solid-hover-foreground);
  }

  :host([fill='solid'][variant='accent']:active) {
    --_background: var(--sl-color-button-accent-solid-active-background);
    --_border-color: var(--sl-color-button-accent-solid-active-border);
    --_color: var(--sl-color-button-accent-solid-active-foreground);
  }

  :host([fill='solid'][variant='accent'][disabled]) {
    --_background: var(--sl-color-button-accent-solid-disabled-background);
    --_border-color: var(--sl-color-button-accent-solid-disabled-border);
    --_color: var(--sl-color-button-accent-solid-disabled-foreground);
  }

  :host([fill='solid'][variant='success']) {
    --_background: var(--sl-color-button-success-solid-idle-background);
    --_border-color: var(--sl-color-button-success-solid-idle-border);
    --_color: var(--sl-color-button-success-solid-idle-foreground);
  }

  :host([fill='solid'][variant='success']:hover) {
    --_background: var(--sl-color-button-success-solid-hover-background);
    --_border-color: var(--sl-color-button-success-solid-hover-border);
    --_color: var(--sl-color-button-success-solid-hover-foreground);
  }

  :host([fill='solid'][variant='success']:active) {
    --_background: var(--sl-color-button-success-solid-active-background);
    --_border-color: var(--sl-color-button-success-solid-active-border);
    --_color: var(--sl-color-button-success-solid-active-foreground);
  }

  :host([fill='solid'][variant='success'][disabled]) {
    --_background: var(--sl-color-button-success-solid-disabled-background);
    --_border-color: var(--sl-color-button-success-solid-disabled-border);
    --_color: var(--sl-color-button-success-solid-disabled-foreground);
  }

  :host([fill='solid'][variant='danger']) {
    --_background: var(--sl-color-button-danger-solid-idle-background);
    --_border-color: var(--sl-color-button-danger-solid-idle-border);
    --_color: var(--sl-color-button-danger-solid-idle-foreground);
  }

  :host([fill='solid'][variant='danger']:hover) {
    --_background: var(--sl-color-button-danger-solid-hover-background);
    --_border-color: var(--sl-color-button-danger-solid-hover-border);
    --_color: var(--sl-color-button-danger-solid-hover-foreground);
  }

  :host([fill='solid'][variant='danger']:active) {
    --_background: var(--sl-color-button-danger-solid-active-background);
    --_border-color: var(--sl-color-button-danger-solid-active-border);
    --_color: var(--sl-color-button-danger-solid-active-foreground);
  }

  :host([fill='solid'][variant='danger'][disabled]) {
    --_background: var(--sl-color-button-danger-solid-disabled-background);
    --_border-color: var(--sl-color-button-danger-solid-disabled-border);
    --_color: var(--sl-color-button-danger-solid-disabled-foreground);
  }

  :host([fill='solid'][variant='info']) {
    --_background: var(--sl-color-button-info-solid-idle-background);
    --_border-color: var(--sl-color-button-info-solid-idle-border);
    --_color: var(--sl-color-button-info-solid-idle-foreground);
  }

  :host([fill='solid'][variant='info']:hover) {
    --_background: var(--sl-color-button-info-solid-hover-background);
    --_border-color: var(--sl-color-button-info-solid-hover-border);
    --_color: var(--sl-color-button-info-solid-hover-foreground);
  }

  :host([fill='solid'][variant='info']:active) {
    --_background: var(--sl-color-button-info-solid-active-background);
    --_border-color: var(--sl-color-button-info-solid-active-border);
    --_color: var(--sl-color-button-info-solid-active-foreground);
  }

  :host([fill='solid'][variant='info'][disabled]) {
    --_background: var(--sl-color-button-info-solid-disabled-background);
    --_border-color: var(--sl-color-button-info-solid-disabled-border);
    --_color: var(--sl-color-button-info-solid-disabled-foreground);
  }

  :host([fill='solid'][variant='warning']) {
    --_background: var(--sl-color-button-warning-solid-idle-background);
    --_border-color: var(--sl-color-button-warning-solid-idle-border);
    --_color: var(--sl-color-button-warning-solid-idle-foreground);
  }

  :host([fill='solid'][variant='warning']:hover) {
    --_background: var(--sl-color-button-warning-solid-hover-background);
    --_border-color: var(--sl-color-button-warning-solid-hover-border);
    --_color: var(--sl-color-button-warning-solid-hover-foreground);
  }

  :host([fill='solid'][variant='warning']:active) {
    --_background: var(--sl-color-button-warning-solid-active-background);
    --_border-color: var(--sl-color-button-warning-solid-active-border);
    --_color: var(--sl-color-button-warning-solid-active-foreground);
  }

  :host([fill='solid'][variant='warning'][disabled]) {
    --_background: var(--sl-color-button-warning-solid-disabled-background);
    --_border-color: var(--sl-color-button-warning-solid-disabled-border);
    --_color: var(--sl-color-button-warning-solid-disabled-foreground);
  }

  :host([fill='subtle']) {
    --_border-width: var(--sl-border-width-button-subtle, var(--sl-border-width-button));
  }

  :host([fill='subtle'][size='sm']) {
    --_padding-block: var(--sl-space-button-subtle-sm-block, var(--sl-space-button-sm-block));
    --_padding-inline: var(--sl-space-button-subtle-sm-inline, var(--sl-space-button-sm-inline));
  }

  :host([fill='subtle'][size='md']) {
    --_padding-block: var(--sl-space-button-subtle-md-block, var(--sl-space-button-md-block));
    --_padding-inline: var(--sl-space-button-subtle-md-inline, var(--sl-space-button-md-inline));
  }

  :host([fill='subtle'][size='lg']) {
    --_padding-block: var(--sl-space-button-subtle-lg-block, var(--sl-space-button-lg-block));
    --_padding-inline: var(--sl-space-button-subtle-lg-inline, var(--sl-space-button-lg-inline));
  }

  :host([fill='subtle'][variant='primary']) {
    --_background: var(--sl-color-button-primary-subtle-idle-background);
    --_border-color: var(--sl-color-button-primary-subtle-idle-border);
    --_color: var(--sl-color-button-primary-subtle-idle-foreground);
  }

  :host([fill='subtle'][variant='primary']:hover) {
    --_background: var(--sl-color-button-primary-subtle-hover-background);
    --_border-color: var(--sl-color-button-primary-subtle-hover-border);
    --_color: var(--sl-color-button-primary-subtle-hover-foreground);
  }

  :host([fill='subtle'][variant='primary']:active) {
    --_background: var(--sl-color-button-primary-subtle-active-background);
    --_border-color: var(--sl-color-button-primary-subtle-active-border);
    --_color: var(--sl-color-button-primary-subtle-active-foreground);
  }

  :host([fill='subtle'][variant='primary'][disabled]) {
    --_background: var(--sl-color-button-primary-subtle-disabled-background);
    --_border-color: var(--sl-color-button-primary-subtle-disabled-border);
    --_color: var(--sl-color-button-primary-subtle-disabled-foreground);
  }

  :host([fill='subtle'][variant='secondary']) {
    --_background: var(--sl-color-button-secondary-subtle-idle-background);
    --_border-color: var(--sl-color-button-secondary-subtle-idle-border);
    --_color: var(--sl-color-button-secondary-subtle-idle-foreground);
  }

  :host([fill='subtle'][variant='secondary']:hover) {
    --_background: var(--sl-color-button-secondary-subtle-hover-background);
    --_border-color: var(--sl-color-button-secondary-subtle-hover-border);
    --_color: var(--sl-color-button-secondary-subtle-hover-foreground);
  }

  :host([fill='subtle'][variant='secondary']:active) {
    --_background: var(--sl-color-button-secondary-subtle-active-background);
    --_border-color: var(--sl-color-button-secondary-subtle-active-border);
    --_color: var(--sl-color-button-secondary-subtle-active-foreground);
  }

  :host([fill='subtle'][variant='secondary'][disabled]) {
    --_background: var(--sl-color-button-secondary-subtle-disabled-background);
    --_border-color: var(--sl-color-button-secondary-subtle-disabled-border);
    --_color: var(--sl-color-button-secondary-subtle-disabled-foreground);
  }

  :host([fill='subtle'][variant='accent']) {
    --_background: var(--sl-color-button-accent-subtle-idle-background);
    --_border-color: var(--sl-color-button-accent-subtle-idle-border);
    --_color: var(--sl-color-button-accent-subtle-idle-foreground);
  }

  :host([fill='subtle'][variant='accent']:hover) {
    --_background: var(--sl-color-button-accent-subtle-hover-background);
    --_border-color: var(--sl-color-button-accent-subtle-hover-border);
    --_color: var(--sl-color-button-accent-subtle-hover-foreground);
  }

  :host([fill='subtle'][variant='accent']:active) {
    --_background: var(--sl-color-button-accent-subtle-active-background);
    --_border-color: var(--sl-color-button-accent-subtle-active-border);
    --_color: var(--sl-color-button-accent-subtle-active-foreground);
  }

  :host([fill='subtle'][variant='accent'][disabled]) {
    --_background: var(--sl-color-button-accent-subtle-disabled-background);
    --_border-color: var(--sl-color-button-accent-subtle-disabled-border);
    --_color: var(--sl-color-button-accent-subtle-disabled-foreground);
  }

  :host([fill='subtle'][variant='success']) {
    --_background: var(--sl-color-button-success-subtle-idle-background);
    --_border-color: var(--sl-color-button-success-subtle-idle-border);
    --_color: var(--sl-color-button-success-subtle-idle-foreground);
  }

  :host([fill='subtle'][variant='success']:hover) {
    --_background: var(--sl-color-button-success-subtle-hover-background);
    --_border-color: var(--sl-color-button-success-subtle-hover-border);
    --_color: var(--sl-color-button-success-subtle-hover-foreground);
  }

  :host([fill='subtle'][variant='success']:active) {
    --_background: var(--sl-color-button-success-subtle-active-background);
    --_border-color: var(--sl-color-button-success-subtle-active-border);
    --_color: var(--sl-color-button-success-subtle-active-foreground);
  }

  :host([fill='subtle'][variant='success'][disabled]) {
    --_background: var(--sl-color-button-success-subtle-disabled-background);
    --_border-color: var(--sl-color-button-success-subtle-disabled-border);
    --_color: var(--sl-color-button-success-subtle-disabled-foreground);
  }

  :host([fill='subtle'][variant='danger']) {
    --_background: var(--sl-color-button-danger-subtle-idle-background);
    --_border-color: var(--sl-color-button-danger-subtle-idle-border);
    --_color: var(--sl-color-button-danger-subtle-idle-foreground);
  }

  :host([fill='subtle'][variant='danger']:hover) {
    --_background: var(--sl-color-button-danger-subtle-hover-background);
    --_border-color: var(--sl-color-button-danger-subtle-hover-border);
    --_color: var(--sl-color-button-danger-subtle-hover-foreground);
  }

  :host([fill='subtle'][variant='danger']:active) {
    --_background: var(--sl-color-button-danger-subtle-active-background);
    --_border-color: var(--sl-color-button-danger-subtle-active-border);
    --_color: var(--sl-color-button-danger-subtle-active-foreground);
  }

  :host([fill='subtle'][variant='danger'][disabled]) {
    --_background: var(--sl-color-button-danger-subtle-disabled-background);
    --_border-color: var(--sl-color-button-danger-subtle-disabled-border);
    --_color: var(--sl-color-button-danger-subtle-disabled-foreground);
  }

  :host([fill='subtle'][variant='info']) {
    --_background: var(--sl-color-button-info-subtle-idle-background);
    --_border-color: var(--sl-color-button-info-subtle-idle-border);
    --_color: var(--sl-color-button-info-subtle-idle-foreground);
  }

  :host([fill='subtle'][variant='info']:hover) {
    --_background: var(--sl-color-button-info-subtle-hover-background);
    --_border-color: var(--sl-color-button-info-subtle-hover-border);
    --_color: var(--sl-color-button-info-subtle-hover-foreground);
  }

  :host([fill='subtle'][variant='info']:active) {
    --_background: var(--sl-color-button-info-subtle-active-background);
    --_border-color: var(--sl-color-button-info-subtle-active-border);
    --_color: var(--sl-color-button-info-subtle-active-foreground);
  }

  :host([fill='subtle'][variant='info'][disabled]) {
    --_background: var(--sl-color-button-info-subtle-disabled-background);
    --_border-color: var(--sl-color-button-info-subtle-disabled-border);
    --_color: var(--sl-color-button-info-subtle-disabled-foreground);
  }

  :host([fill='subtle'][variant='warning']) {
    --_background: var(--sl-color-button-warning-subtle-idle-background);
    --_border-color: var(--sl-color-button-warning-subtle-idle-border);
    --_color: var(--sl-color-button-warning-subtle-idle-foreground);
  }

  :host([fill='subtle'][variant='warning']:hover) {
    --_background: var(--sl-color-button-warning-subtle-hover-background);
    --_border-color: var(--sl-color-button-warning-subtle-hover-border);
    --_color: var(--sl-color-button-warning-subtle-hover-foreground);
  }

  :host([fill='subtle'][variant='warning']:active) {
    --_background: var(--sl-color-button-warning-subtle-active-background);
    --_border-color: var(--sl-color-button-warning-subtle-active-border);
    --_color: var(--sl-color-button-warning-subtle-active-foreground);
  }

  :host([fill='subtle'][variant='warning'][disabled]) {
    --_background: var(--sl-color-button-warning-subtle-disabled-background);
    --_border-color: var(--sl-color-button-warning-subtle-disabled-border);
    --_color: var(--sl-color-button-warning-subtle-disabled-foreground);
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
