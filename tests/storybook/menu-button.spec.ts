import { expect, test } from '@playwright/test';

test.describe('menu-button storybook interactions', () => {
  test('opens on click and closes on Escape', async ({ page }) => {
    await page.goto('/iframe.html?id=actions-menu-menu-button--basic&viewMode=story');

    const menuButton = page.locator('sl-menu-button').first();
    await expect(menuButton).toBeVisible();

    const triggerButton = menuButton.locator('sl-button').first();
    const menu = menuButton.locator('sl-menu').first();

    await triggerButton.click();

    await expect.poll(async () => menu.evaluate(node => node.matches(':popover-open'))).toBe(true);

    await menu.focus();
    await page.keyboard.press('Escape');

    await expect.poll(async () => menu.evaluate(node => node.matches(':popover-open'))).toBe(false);
  });
});
