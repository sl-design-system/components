import fg from 'fast-glob';
import { readFileSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const generateWrapper = async (tagName) => {
  const wrapper = `
    import { LitElement, html, css } from 'lit';
    import { customElement } from 'lit/decorators.js';
    import { ${tagName} } from '@bolt/core';

    @customElement('${tagName}')
    export class ${tagName}Wrapper extends LitElement {
      static styles = css\`
        :host {
          display: block;
        }
      \`;

      render() {
        return html\`
          <${tagName}>
            <slot></slot>
          </${tagName}>
        \`;
      }
    }
  `;

  const path = join(cwd, `../packages/angular/src/wrappers/generated/${tagName}.ts`);
  await mkdir(dirname(path), { recursive: true });
  writeFileSync(path, wrapper);
};

const generateWrappers = async () => {
  const files = (await fg(`./packages/components/*/custom-elements.json`))
    .map(file => readFileSync(file, 'utf-8'))
    .map(contents => JSON.parse(contents));

  const customElements = files
    .map(manifest => manifest.modules.find(mod => mod.path === 'register.ts'))
    .filter(mod => mod !== undefined)
    .map(mod => mod.exports.filter(e => e.kind === 'custom-element-definition'))
    .flat(2);

  console.log(customElements);

  customElements
    .map(({ name }) => name.split('sl-').at(1))
    .filter(tagName => tagName !== undefined)
    .forEach(tagName => generateWrapper(tagName));
};

await generateWrappers();
