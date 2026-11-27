import { Icon } from '@sl-design-system/icon';

/**
 * The themes don't have a bell icon (yet), so register a fallback. A theme that does have one wins,
 * because theme icons are registered over the existing ones.
 */
export const registerFallbackIcons = (): void => {
  if (window.SLDS?.icons?.['bell']) {
    return;
  }

  Icon.register({
    bell: {
      svg: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9zM10 20a2 2 0 0 0 4 0"
            fill="none"
            stroke="var(--sl-icon-fill-default, currentColor)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"></path>
        </svg>
      `
    }
  });
};
