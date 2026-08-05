# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/tests/website_a11y.spec.ts >> Limited to <main> test on other pages >> A11y test on categories/getting-started/developers/
- Location: website/tests/website_a11y.spec.ts:76:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8000/categories/getting-started/developers/
Call log:
  - navigating to "http://localhost:8000/categories/getting-started/developers/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | import { AxeResults } from 'axe-core';
  4  | import { createHtmlReport } from 'axe-html-reporter';
  5  | import { readFileSync } from 'node:fs';
  6  |
  7  | let axe: AxeBuilder;
  8  | let results: AxeResults;
  9  | const homePageUrl = '/';
  10 | const domainName = 'http://localhost:8000/';
  11 |
  12 | function getArgumentValue(name: string): string | undefined {
  13 |   const arg = process.argv.find(arg => arg.startsWith(`--${name}=`));
  14 |   return arg ? arg.split('=')[1] : undefined;
  15 | }
  16 |
  17 | const cliUrl = getArgumentValue('url');
  18 | let urls: string[];
  19 |
  20 | if (cliUrl) {
  21 |   urls = cliUrl.split(',');
  22 | } else {
  23 |   urls = JSON.parse(readFileSync(new URL('../../changed-urls.json', import.meta.url), 'utf-8')) as string[];
  24 | }
  25 |
  26 | function createNumberedList<T>(items: T[]): string {
  27 |   return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  28 | }
  29 |
  30 | test.beforeEach(async ({ page }) => {
  31 |   axe = new AxeBuilder({ page });
  32 | });
  33 |
  34 | test.afterEach(async ({ page }) => {
  35 |   if (!results || !results.violations) {
  36 |     return;
  37 |   }
  38 |
  39 |   if (results.violations.length > 0) {
  40 |     const violationDetails = results.violations
  41 |       .map(violation => {
  42 |         const nodeDetails = createNumberedList(violation.nodes.flatMap(node => node.target));
  43 |         return `${violation.id} (${violation.impact}) \n${violation.description}\n${nodeDetails} \n`;
  44 |       })
  45 |       .join('\n\n');
  46 |     console.error(`Accessibility violations found for ${page.url()}:\n\n${violationDetails}`);
  47 |
  48 |     createHtmlReport({
  49 |       results: {
  50 |         violations: results.violations
  51 |       },
  52 |       options: {
  53 |         outputDir: 'reports/website',
  54 |         reportFileName: `${page.url().replace(domainName, '').replaceAll('/', '_')}a11y_report.html`
  55 |       }
  56 |     });
  57 |   }
  58 | });
  59 |
  60 | // Test only the homepage scanning the full page including <header> and <nav>
  61 | test.describe('Full test for homepage', () => {
  62 |   if (urls.includes(homePageUrl)) {
  63 |     test('A11y test on home page', async ({ page }) => {
  64 |       await page.goto(homePageUrl, { waitUntil: 'load' });
  65 |       results = await axe.analyze();
  66 |       expect(results.violations.length, 'Accessibility violations found, see details above').toBe(0);
  67 |     });
  68 |   }
  69 | });
  70 |
  71 | // Test all other pages scanning only <main> content
  72 | test.describe('Limited to <main> test on other pages', () => {
  73 |   urls
  74 |     .filter(url => url !== homePageUrl)
  75 |     .forEach(url => {
  76 |       test(`A11y test on ${url}`, async ({ page }) => {
> 77 |         await page.goto(url, { waitUntil: 'load' });
     |                    ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8000/categories/getting-started/developers/
  78 |         results = await axe
  79 |           .include('main')
  80 |           // Exclude known Axe violation(s) in DS tab group tabs; keep this scoped and remove when fixed.
  81 |           .exclude('sl-tab-group.ds-tab-group > sl-tab')
  82 |           .analyze();
  83 |         expect(results.violations.length, 'Accessibility violations found, see details above').toBe(0);
  84 |       });
  85 |     });
  86 | });
  87 |
```
