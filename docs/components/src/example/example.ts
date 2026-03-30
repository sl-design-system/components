import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-typescript.js';
import styles from './example.css' with { type: 'css' };

type Language = 'html' | 'css' | 'ts';

const LANGUAGE_LABELS: Record<Language, string> = {
  html: 'HTML',
  css: 'CSS',
  ts: 'TypeScript'
};

const PRISM_GRAMMARS: Record<Language, Prism.Grammar> = {
  html: Prism.languages['markup'],
  css: Prism.languages['css'],
  ts: Prism.languages['typescript']
};

const PRISM_LANGUAGE_IDS: Record<Language, string> = {
  html: 'markup',
  css: 'css',
  ts: 'typescript'
};

/** Dedent code by removing common leading whitespace from all non-empty lines. */
function dedent(code: string): string {
  const lines = code.split('\n');

  // Remove leading/trailing blank lines
  while (lines.length && lines[0].trim() === '') {
    lines.shift();
  }
  while (lines.length && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  const indents = lines.filter(l => l.trim().length > 0).map(l => l.match(/^(\s*)/)?.[1].length ?? 0),
    minIndent = indents.length ? Math.min(...indents) : 0;

  return minIndent > 0 ? lines.map(l => l.slice(minIndent)).join('\n') : lines.join('\n');
}

export class DocExample extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  /** The available code snippets keyed by language. */
  #snippets = new Map<Language, string>();

  /** The ordered list of available languages. */
  #languages: Language[] = [];

  /** The currently selected tab. */
  @state() selected?: Language;

  /** A dynamic stylesheet for user-provided preview CSS. */
  #previewSheet = new CSSStyleSheet();

  override connectedCallback(): void {
    super.connectedCallback();
    this.#parseTemplates();
    this.#applyPreviewStyles();
  }

  override render(): TemplateResult {
    const hasPreview = this.#snippets.has('html'),
      hasTabs = this.#languages.length > 1,
      code = this.selected ? this.#snippets.get(this.selected) : undefined;

    return html`
      ${hasPreview ? this.#renderPreview() : nothing} ${hasTabs ? this.#renderTabs() : nothing}
      ${code !== undefined && this.selected
        ? html`
            <div
              id="panel-${this.selected}"
              class="panel"
              role="tabpanel"
              aria-labelledby=${hasTabs ? `tab-${this.selected}` : nothing}
            >
              <pre><code .innerHTML=${this.#highlight(code, this.selected)}></code></pre>
              <button class="copy" type="button" aria-label="Copy to clipboard" @click=${() => this.#copy(code)}>
                Copy
              </button>
            </div>
          `
        : nothing}
    `;
  }

  #renderPreview(): TemplateResult {
    const htmlCode = this.#snippets.get('html') ?? '';

    return html`
      <div class="preview">
        <div .innerHTML=${htmlCode}></div>
      </div>
    `;
  }

  #renderTabs(): TemplateResult {
    return html`
      <div class="tabs" role="tablist" aria-label="Code language" @keydown=${this.#onTabKeydown}>
        ${this.#languages.map(
          lang => html`
            <sl-button
              id="tab-${lang}"
              role="tab"
              size="sm"
              fill=${this.selected === lang ? 'outline' : 'ghost'}
              aria-selected=${this.selected === lang ? 'true' : 'false'}
              aria-controls="panel-${lang}"
              tabindex=${this.selected === lang ? '0' : '-1'}
              @click=${() => this.#select(lang)}
            >
              ${LANGUAGE_LABELS[lang]}
            </sl-button>
          `
        )}
      </div>
    `;
  }

  #parseTemplates(): void {
    const templates = this.querySelectorAll<HTMLTemplateElement>('template[data-lang]');

    for (const template of templates) {
      const lang = template.dataset['lang'] as Language;

      if (!LANGUAGE_LABELS[lang]) {
        continue;
      }

      const raw = lang === 'html' ? template.innerHTML : (template.content.textContent ?? '');

      this.#snippets.set(lang, dedent(raw));
    }

    // Maintain a consistent order: html, css, ts
    this.#languages = (['html', 'css', 'ts'] as Language[]).filter(l => this.#snippets.has(l));
    this.selected = this.#languages[0];
  }

  #applyPreviewStyles(): void {
    const cssCode = this.#snippets.get('css');

    if (cssCode) {
      this.#previewSheet.replaceSync(`.preview { ${cssCode} }`);
      this.shadowRoot!.adoptedStyleSheets = [...this.shadowRoot!.adoptedStyleSheets, this.#previewSheet];
    }
  }

  #highlight(code: string, lang: Language): string {
    return Prism.highlight(code, PRISM_GRAMMARS[lang], PRISM_LANGUAGE_IDS[lang]);
  }

  #select(lang: Language): void {
    this.selected = lang;

    void this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLElement>(`#tab-${lang}`)?.focus();
    });
  }

  #onTabKeydown(event: KeyboardEvent): void {
    const index = this.#languages.indexOf(this.selected!);
    let next: number | undefined;

    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % this.#languages.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + this.#languages.length) % this.#languages.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = this.#languages.length - 1;
        break;
    }

    if (next !== undefined) {
      event.preventDefault();
      this.#select(this.#languages[next]);
    }
  }

  async #copy(code: string): Promise<void> {
    await navigator.clipboard.writeText(code);
  }
}
