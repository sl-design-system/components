import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AxeResults } from 'axe-core';
import { createHtmlReport } from 'axe-html-reporter';
import urls from '../../changed-urls.json';

let axe: AxeBuilder;
let results: AxeResults;
const homePageUrl = '/';
const domainName = 'http://localhost:8000/';

function createNumberedList<T>(items: T[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

test.beforeEach(async ({ page }) => {
  axe = new AxeBuilder({ page });
});

test.afterEach(async ({ page }) => {
  if (!results || !results.violations) {
    return;
  }

  if (results.violations.length > 0) {
    const violationDetails = results.violations
      .map(violation => {
        const nodeDetails = createNumberedList(violation.nodes.flatMap(node => node.target));
        return `${violation.id} (${violation.impact}) \n${violation.description}\n${nodeDetails} \n`;
      })
      .join('\n\n');
    console.error(`Accessibility violations found for ${page.url()}:\n\n${violationDetails}`);
  }

  createHtmlReport({
    results: {
      violations: results.violations
    },
    options: {
      outputDir: 'reports/website',
      reportFileName: `${page.url().replace(domainName, '').replaceAll('/', '_')}a11y_report.html`
    }
  });
});

// Test only the homepage scanning the full page including <header> and <nav>
test.describe('Full test for homepage', () => {
  if (urls.includes(homePageUrl)) {
    test('A11y test on home page', async ({ page }) => {
      await page.goto(homePageUrl, { waitUntil: 'load' });
      results = await axe.analyze();
      expect(results.violations.length, 'Accessibility violations found, see details above').toBe(0);
    });
  }
});

// Test all other pages scanning only <main> content
test.describe('Limited to <main> test on other pages', () => {
  urls
    .filter(url => url !== homePageUrl)
    .forEach(url => {
      test(`A11y test on ${url}`, async ({ page }) => {
        await page.goto(url, { waitUntil: 'load' });
        results = await axe.include('main').analyze();
        expect(results.violations.length, 'Accessibility violations found, see details above').toBe(0);
      });
    });
});
