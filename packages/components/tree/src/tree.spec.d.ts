import '../register.js';
declare global {
  interface ARIAMixin {
    ariaControlsElements: readonly Element[] | null;
  }
}
