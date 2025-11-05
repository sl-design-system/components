/**
 * Backwards Compatibility Check for CSS Variables
 *
 * This script compares CSS variables between the current theme files and reference theme files
 * to ensure backwards compatibility.
 *
 * See backwards-compatibility-check-README.md for setup instructions.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { argv } from 'node:process';

/**
 * Extracts CSS custom properties (variables) from CSS content
 * @param {string} cssContent - The CSS file content
 * @returns {Set<string>} Set of CSS variable names (including --)
 */
function extractCSSVariables(cssContent) {
  const variables = new Set();
  // Match CSS custom properties: --variable-name
  const regex = /--([\w-]+)\s*:/g;
  let match;

  while ((match = regex.exec(cssContent)) !== null) {
    variables.add(`--${match[1]}`);
  }

  return variables;
}

/**
 * Reads and combines CSS variables from light.css and light-deprecated.css (or dark variants)
 * @param {string} themePath - Path to the theme folder
 * @param {string} variant - 'light' or 'dark'
 * @returns {Promise<Set<string>>} Combined set of CSS variables
 */
async function getCombinedVariables(themePath, variant) {
  const variables = new Set();

  try {
    const newFile = await readFile(join(themePath, `${variant}.css`), 'utf-8');
    const newVars = extractCSSVariables(newFile);
    newVars.forEach(v => variables.add(v));
  } catch (err) {
    // File might not exist
  }

  try {
    const oldFile = await readFile(join(themePath, `${variant}-deprecated.css`), 'utf-8');
    const oldVars = extractCSSVariables(oldFile);
    oldVars.forEach(v => variables.add(v));
  } catch (err) {
    // File might not exist
  }

  return variables;
}

/**
 * Gets CSS variables from a reference file
 * @param {string} referencePath - Path to the reference theme folder
 * @param {string} variant - 'light' or 'dark'
 * @returns {Promise<Set<string>>} Set of CSS variables
 */
async function getReferenceVariables(referencePath, variant) {
  try {
    const refFile = await readFile(join(referencePath, `${variant}.css`), 'utf-8');
    return extractCSSVariables(refFile);
  } catch (err) {
    return new Set();
  }
}

/**
 * Compares CSS variables and finds missing ones
 * @param {Set<string>} reference - Reference variables (from old location)
 * @param {Set<string>} current - Current variables (from packages/themes)
 * @returns {string[]} Array of missing variable names
 */
function findMissingVariables(reference, current) {
  const missing = [];

  reference.forEach(variable => {
    if (!current.has(variable)) {
      missing.push(variable);
    }
  });

  return missing.sort();
}

/**
 * Main function to check backwards compatibility
 */
async function checkBackwardsCompatibility() {
  // Get reference path from command line arguments
  const referenceRoot = argv[2];

  if (!referenceRoot) {
    console.error('❌ Error: Please provide a reference path as an argument');
    console.log('\nUsage: node scripts/backwards-compatibility-check.js <reference-path>');
    console.log('Example: node scripts/backwards-compatibility-check.js /path/to/old/themes');
    process.exit(1);
  }

  console.log('🔍 Checking backwards compatibility...\n');
  console.log(`Reference root: ${referenceRoot}`);
  console.log(`Current root: ./packages/themes\n`);

  const themesPath = './packages/themes';
  const themes = await readdir(themesPath, { withFileTypes: true });
  const themeDirectories = themes
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);

  let hasErrors = false;
  const results = [];

  for (const theme of themeDirectories) {
    const currentThemePath = join(themesPath, theme);
    const referenceThemePath = join(referenceRoot, theme);

    // Check both light and dark variants
    for (const variant of ['light', 'dark']) {
      const currentVars = await getCombinedVariables(currentThemePath, variant);
      const referenceVars = await getReferenceVariables(referenceThemePath, variant);

      // Only check if reference file exists
      if (referenceVars.size === 0) {
        continue;
      }

      const missing = findMissingVariables(referenceVars, currentVars);

      if (missing.length > 0) {
        hasErrors = true;
        results.push({
          theme,
          variant,
          missing,
          referenceCount: referenceVars.size,
          currentCount: currentVars.size
        });
      } else {
        console.log(`✅ All variables present for theme ${theme} (${variant})`);
      }
    }
  }

  // Output results
  if (hasErrors) {
    console.log('⚠️  Missing CSS variables detected:\n');

    for (const result of results) {
      console.log(`\n📦 Theme: ${result.theme} (${result.variant})`);
      console.log(`   Reference variables: ${result.referenceCount}`);
      console.log(`   Current variables: ${result.currentCount}`);
      console.log(`   Missing: ${result.missing.length}\n`);

      result.missing.forEach(variable => {
        console.log(`   - ${variable}`);
      });
    }

    console.log('\n⚠️  Some CSS variables are missing from current themes');
  } else {
    console.log('✅ All CSS variables from reference are present in current themes');
  }
}

// Run the check
checkBackwardsCompatibility().catch(err => {
  console.error('❌ Error running backwards compatibility check:', err);
  process.exit(1);
});
