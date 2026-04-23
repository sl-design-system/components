import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { defineConfig } from 'tsdown';

// Check if this is a CSS import with type: 'css' attribute
const cssImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+\.css)['"]\s+with\s+\{\s*type:\s*['"]css['"]\s*\}/g;

// This plugin handles CSS imports with { type: 'css' } and converts them to CSSStyleSheet
const cssPlugin = {
  name: 'css-stylesheet',
  transform(code, id) {
    let transformedCode = code,
      hasTransformations = false;

    transformedCode = transformedCode.replace(cssImportRegex, (match, varName, cssPath) => {
      hasTransformations = true;

      // Resolve the CSS file path relative to the current file
      const resolvedPath = new URL(cssPath, `file://${id}`).pathname;

      try {
        const cssContent = readFileSync(resolvedPath, 'utf-8');

        this.addWatchFile(resolvedPath); // Watch the CSS file for changes

        // Create a CSSStyleSheet with the CSS content
        return `
  const ${varName} = new CSSStyleSheet();
  ${varName}.replaceSync(${JSON.stringify(cssContent)});
`;
      } catch (error) {
        this.error(`Failed to read CSS file ${resolvedPath}: ${error.message}`);
      }
    });

    return hasTransformations ? { code: transformedCode, map: null } : null;
  }
};

export default defineConfig({
  workspace: '*',
  entry: ['src/index.ts', 'src/register.ts'],
  plugins: [cssPlugin],

  clean: !process.argv.includes('--watch'),
  deps: {
    skipNodeModulesBundle: true
  },
  dts: {
    tsgo: true
  },
  exports: {
    devExports: true,
    extensions: true
  },
  hash: false,
  platform: 'browser',
  sourcemap: true,
  treeshake: false,
  unbundle: true
});
