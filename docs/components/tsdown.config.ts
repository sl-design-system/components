import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { compile } from 'sass-embedded';
import { defineConfig } from 'tsdown'

// This plugin handles CSS imports with { type: 'css' } and converts them to CSSStyleSheet
const cssPlugin = {
  name: 'css-stylesheet',
  transform(code, id) {
    // Check if this is a CSS import with type: 'css' attribute
    const cssImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+\.css)['"]\s+with\s+\{\s*type:\s*['"]css['"]\s*\}/g;

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
  deps: {
    onlyBundle: false
  },
  dts: {
    tsgo: true,
  },
  entry: [
    'src/code/code.ts',
    'src/code-example/code-example.ts',
    'src/copy-button/copy-button.ts',
    'src/heading/heading.ts',
    'src/install-info/install-info.ts',
    'src/page-toc/page-toc.ts',
    'src/search/search.ts',
    'src/sidebar/sidebar.ts',
    'src/site-nav/nav-group.ts',
    'src/site-nav/nav-item.ts',
    'src/site-nav/site-nav.ts',
    'src/theme-switch/theme-switch.ts'
  ],
  exports: {
    customExports(exports) {
      return Object.fromEntries(
        Object.entries(exports).map(([key, value]) => {
          // Skip the root export and keys that already have a file extension (e.g. './foo.js')
          if (key === '.' || /\.[^/]+$/.test(key)) {
            return [key, value];
          }

          return [`${key}.js`, value];
        })
      );
    }
  },
  platform: 'browser',
  plugins: [cssPlugin]
})
