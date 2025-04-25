import { describe, test } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

// Get the directory name for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all rule tests
const rulesDir = path.join(__dirname, 'lib', 'rules');

// Load and run all test files
describe('ESLint Plugin SLDS Rules', async () => {
  const testFiles = fs.readdirSync(rulesDir)
    .filter(file => file.endsWith('.test.js'));

  for (const testFile of testFiles) {
    test(`Rule: ${testFile.replace('.test.js', '')}`, async () => {
      // Dynamic import of the test file
      await import(path.join(rulesDir, testFile));
      // The RuleTester in the imported file will throw if tests fail
      // If we get here, the tests passed
      assert.ok(true);
    });
  }
});
