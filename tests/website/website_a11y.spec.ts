import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AxeResults } from 'axe-core';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import urls from '../../changed-urls.json';

let summary = '';
let currentUrl: string;
let axe: AxeBuilder;
let results: AxeResults;
let firstTest = true;

test.beforeEach(async ({ page }, testInfo) => {
  currentUrl = testInfo.title.replace('Website accessibility test on ', '');
  await page.goto(currentUrl, { waitUntil: 'load' });
  axe = new AxeBuilder({ page });

  // tests should be run on the whole page only for the first URL, then we can limit it to the main container to speed up the tests
  if (!firstTest) {
    axe = axe.include('.ds-container');
  }
  firstTest = false;
});

test.afterEach(async ({ page }) => {
  summary = `Tested page: ${currentUrl},\nNumber of violations: ${results.violations.length}\n\n`;
  fs.mkdirSync('reports/website', { recursive: true });
  fs.appendFileSync('reports/website/a11y_test_summary.txt', summary);

  createHtmlReport({
    results: {
      violations: results.violations
    },
    options: {
      projectKey: `${currentUrl}`,
      outputDir: 'reports/website',
      reportFileName: `${currentUrl.replaceAll('/', '_')}a11y_report.html`
    }
  });
});

urls.forEach(url => {
  test(`Website accessibility test on ${url}`, async ({ page }) => {
    results = await axe.analyze();
    expect(results.violations).toHaveLength(0);
  });
});
