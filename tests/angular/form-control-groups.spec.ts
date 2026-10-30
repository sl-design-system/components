import { expect, test } from '@playwright/test';

test('reactive groups initialize on direct load and reload, update and reset', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    '/iframe.html?id=components-forms--groups-reactive-initial-values&viewMode=story'
  );

  const host = page.locator('sla-form-control-groups-reactive');
  const checkboxes = host.locator('sl-checkbox');
  const radios = host.locator('sl-radio');

  for (let load = 0; load < 2; load++) {
    await expect(host).toContainText('Form status: VALID');
    await expect(checkboxes.nth(0)).toHaveJSProperty('checked', true);
    await expect(checkboxes.nth(1)).toHaveJSProperty('checked', false);
    await expect(radios.nth(0)).toHaveJSProperty('checked', false);
    await expect(radios.nth(1)).toHaveJSProperty('checked', true);
    if (load === 0) await page.reload();
  }

  await checkboxes.nth(1).click();
  await radios.nth(0).click();
  await expect(host.locator('pre')).toContainText('"radioGroup": "1"');
  await expect(checkboxes.nth(1)).toHaveJSProperty('checked', true);

  await checkboxes.nth(0).click();
  await checkboxes.nth(1).click();
  await expect(host).toContainText('Form status: INVALID');

  await host.getByRole('button', { name: 'Reset' }).click();
  await expect(host).toContainText('Form status: VALID');
  await expect(checkboxes.nth(0)).toHaveJSProperty('checked', true);
  await expect(checkboxes.nth(1)).toHaveJSProperty('checked', false);
  await expect(radios.nth(1)).toHaveJSProperty('checked', true);
  expect(errors).toEqual([]);
});
