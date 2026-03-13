import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import urls from '../../changed-urls.json';

urls.forEach((url, index, arr) => {
  test(`Website accessibility test on ${url}`, async ({ page }) => {
    const projectName = test.info().project.name;

    await page.goto(url);

    const safeName = url === '/' ? 'home' : url.replace(/\//g, '_').replace(/^\_/, '');

    let accessibilityScanResults;
    if (url === '/') {
      accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    } else {
      accessibilityScanResults = await new AxeBuilder({ page }).include('.ds-container').analyze();
    }

    const report = createHtmlReport({
      results: {
        violations: accessibilityScanResults.violations
      },
      options: {
        projectKey: `${projectName}-${safeName}`,
        outputDir: `reports/${projectName}`,
        reportFileName: `${safeName}_a11y_report.html`
      }
    });

    const summary = {
      url,
      violations: accessibilityScanResults.violations.length
    };

    if (index === 0) {
      fs.writeFileSync('reports/summary.json', '[\n' + JSON.stringify(summary, null, 2) + ', \n');
    } else if (index < arr.length - 1) {
      fs.appendFileSync('reports/summary.json', JSON.stringify(summary, null, 2) + ', \n');
    } else {
      fs.appendFileSync('reports/summary.json', JSON.stringify(summary, null, 2) + '\n]\n');
    }
  });
});
