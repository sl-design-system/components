import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { DocExample } from './example.js';

type Story = StoryObj;

try {
  customElements.define('doc-example', DocExample);
} catch {
  /* empty */
}

/** Helper to create a template element with a data-lang attribute. */
function langTemplate(lang: string, code: string): HTMLTemplateElement {
  const template = document.createElement('template');

  template.dataset['lang'] = lang;
  template.innerHTML = code;

  return template;
}

const exampleHTML = '<button type="button" class="primary">Click me</button>',
  exampleCSS = `.primary {
  background: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 16px;
}

.primary:hover {
  background: #0056b3;
}`,
  exampleTS = `const button = document.querySelector('.primary');

button?.addEventListener('click', () => {
  console.log('Button clicked!');
});`,
  cardHTML = `<div class="card">
  <h3>Card title</h3>
  <p>Card content goes here.</p>
</div>`,
  cardCSS = `.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.card h3 {
  margin-block-start: 0;
}`,
  onlyCSS = `:root {
  --primary: #007bff;
  --secondary: #6c757d;
  --font-family: system-ui, sans-serif;
}

body {
  font-family: var(--font-family);
  margin: 0;
  padding: 16px;
}`,
  onlyTS = `interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);

  if (!response.ok) {
    throw new Error(\`Failed to fetch user \${id}\`);
  }

  return response.json() as Promise<User>;
}`,
  paragraphHTML = `<h3>Hello world</h3>
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>`;

export default {
  title: 'Example'
} satisfies Meta;

export const Basic: Story = {
  render: () => {
    const el = document.createElement('doc-example');

    el.append(langTemplate('html', exampleHTML), langTemplate('css', exampleCSS), langTemplate('ts', exampleTS));

    return el;
  }
};

export const HTMLOnly: Story = {
  render: () => {
    const el = document.createElement('doc-example');

    el.append(langTemplate('html', paragraphHTML));

    return el;
  }
};

export const HTMLAndCSS: Story = {
  render: () => {
    const el = document.createElement('doc-example');

    el.append(langTemplate('html', cardHTML), langTemplate('css', cardCSS));

    return el;
  }
};

export const CSSOnly: Story = {
  render: () => {
    const el = document.createElement('doc-example');

    el.append(langTemplate('css', onlyCSS));

    return el;
  }
};

export const TypeScriptOnly: Story = {
  render: () => {
    const el = document.createElement('doc-example');

    el.append(langTemplate('ts', onlyTS));

    return el;
  }
};
