import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AxeResults } from 'axe-core';
import { createHtmlReport } from 'axe-html-reporter';
import urls from '../../changed-urls.json';

let url: string;
let axe: AxeBuilder;
let results: AxeResults;
const homePageUrl = '/';

function createNumberedList<T>(items: T[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

test.beforeEach(async ({ page }) => {
  url = page.url();
  axe = new AxeBuilder({ page });

  // We want to only test whole page with <header> and <nav> while testing the homepage. For other pages we limit tests to only <main> content.
  if (url !== homePageUrl) {
    axe = axe.include('main');
  }
});

test.afterEach(async ({ page }) => {
  if (results.violations.length > 0) {
    const violationDetails = results.violations
      .map(violation => {
        const nodeDetails = createNumberedList(violation.nodes.flatMap(node => node.target));
        return `${violation.id} (${violation.impact}) \n${violation.description}\n${nodeDetails}`;
      })
      .join('\n\n');
    console.error(`Accessibility violations found:\n\n${violationDetails}`);
  }

  createHtmlReport({
    results: {
      violations: results.violations
    },
    options: {
      projectKey: `${url}`,
      outputDir: 'reports/website',
      reportFileName: `${url.replaceAll('/', '_')}a11y_report.html`
    }
  });
});

urls.forEach(url => {
  test(`Website accessibility test on ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'load' });
    results = await axe.analyze();
    expect(results.violations.length, 'Accessibility violations found, see details above').toBe(0);
  });
});
