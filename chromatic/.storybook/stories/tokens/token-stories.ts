import { type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { themes } from '../../../../.storybook/themes';
import {
  type ThemeContexts,
  type TokenBucket,
  type TokenBuckets,
  appliesToUserGroup,
  classifyTokens,
  contextKey,
  normalizeValue
} from './token-buckets';

let bucketsPromise: Promise<TokenBuckets> | undefined;

const parseThemeCss = (css: string): ThemeContexts => {
  const sheet = new CSSStyleSheet(),
    contexts: ThemeContexts = new Map();

  const walk = (rules: CSSRuleList, conditions: string[]): void => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        const key = contextKey(rule.selectorText, conditions),
          declarations = contexts.get(key) ?? new Map<string, string>();

        contexts.set(key, declarations);
        for (const property of Array.from(rule.style)) {
          if (property.startsWith('--sl-')) {
            declarations.set(property, normalizeValue(rule.style.getPropertyValue(property)));
          }
        }
      } else if (rule instanceof CSSGroupingRule) {
        walk(rule.cssRules, [
          ...conditions,
          rule.cssText.slice(0, rule.cssText.indexOf('{')).trim()
        ]);
      }
    }
  };

  sheet.replaceSync(css);
  walk(sheet.cssRules, []);

  return contexts;
};

/**
 * Fetches every theme's `theme.css` once and sorts all tokens into shared, user group and themed
 * buckets.
 */
export const loadTokenBuckets = (): Promise<TokenBuckets> =>
  (bucketsPromise ??= (async () => {
    const entries = await Promise.all(
      themes.map(async ({ id }) => {
        const response = await fetch(`/themes/${id}/theme.css`);
        if (!response.ok) {
          throw new Error(`Failed to load the ${id} theme CSS: ${response.status}`);
        }

        return [id, parseThemeCss(await response.text())] as const;
      })
    );

    return classifyTokens(new Map(entries));
  })());

export const isTypographyToken = (name: string): boolean =>
  (/font|lineheight|line-height|letterspacing|typography|textrisers/i.test(name) &&
    !/icon-font/i.test(name)) ||
  /^--sl-(brand-)?size-text-/i.test(name);

export const isBorderToken = (name: string): boolean =>
  /borderradius|borderwidth|outline(width|offset)/i.test(name);

const fontWeightAliases: Record<string, string> = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  solid: '900'
};

const createPreview = (
  parent: HTMLElement,
  className: string,
  styles: Record<string, string> = {},
  text?: string
): HTMLElement => {
  const preview = document.createElement('span');

  preview.className = className;
  preview.setAttribute('aria-hidden', 'true');
  Object.entries(styles).forEach(([property, value]) => preview.style.setProperty(property, value));
  if (text) {
    preview.textContent = text;
  }
  parent.append(preview);

  return preview;
};

/** Picks a visual representation based on the token name and its resolved value. */
const appendTokenPreview = (sample: HTMLElement, name: string, value: string): void => {
  const lowerName = name.toLowerCase(),
    token = `var(${name})`,
    textSample = (property: string, propertyValue = token) =>
      createPreview(
        sample,
        'token-text',
        { [property]: propertyValue },
        'Learn something new every day'
      );

  if (lowerName.includes('icon-font') || /size-(new-)?icon/.test(lowerName)) {
    createPreview(sample, 'token-square', {
      'block-size': token,
      'inline-size': token
    });
  } else if (lowerName.includes('elevation-shadow')) {
    createPreview(sample, 'token-box', { 'box-shadow': token });
  } else if (lowerName.includes('borderradius')) {
    createPreview(sample, 'token-box token-box-outlined', {
      'border-radius': token
    });
  } else if (lowerName.includes('borderwidth')) {
    createPreview(sample, 'token-box token-box-outlined', {
      'border-width': token
    });
  } else if (lowerName.includes('outlinewidth')) {
    createPreview(sample, 'token-box', {
      outline: `${token} solid #1f2328`,
      'outline-offset': '2px'
    });
  } else if (lowerName.includes('outlineoffset')) {
    createPreview(sample, 'token-box', {
      outline: '2px solid #1f2328',
      'outline-offset': token
    });
  } else if (lowerName.includes('opacity')) {
    createPreview(sample, 'token-square token-opacity', { opacity: token });
  } else if (lowerName.includes('fontfamily')) {
    textSample('font-family');
  } else if (lowerName.includes('fontweight')) {
    textSample('font-weight', fontWeightAliases[value.toLowerCase()] ?? token);
  } else if (/lineheight|line-height/.test(lowerName)) {
    const preview = textSample('line-height');

    preview.classList.add('token-text-wrapped');
    preview.textContent = 'Learn\nnew';
  } else if (lowerName.includes('letterspacing')) {
    textSample('letter-spacing');
  } else if (
    /fontsize|font-size|size-font|size-text/.test(lowerName) ||
    /^--sl-(brand-)?text-new-.*size/.test(lowerName)
  ) {
    textSample('font-size');
  } else if (value && CSS.supports('color', value)) {
    createPreview(sample, 'token-swatch', { background: token });
  } else if (/^-?[\d.]+(px|rem|em|%)$/.test(value)) {
    createPreview(sample, 'token-bar', { 'inline-size': token });
  } else if (/^[\d.]+m?s$/.test(value)) {
    const milliseconds = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
    createPreview(sample, 'token-bar', {
      'inline-size': `${milliseconds / 2}px`
    });
  }
};

const groupName = (name: string): string => {
  const segments = name.replace(/^--sl-/, '').split('-');

  return segments.slice(0, ['brand', 'subtheme'].includes(segments[0]) ? 2 : 1).join('-');
};

const renderTokenCards = (container: HTMLElement, names: string[]): void => {
  const grids = new Map<string, HTMLElement>(),
    computedStyle = getComputedStyle(document.body);

  for (const name of names) {
    const group = groupName(name);
    let grid = grids.get(group);

    if (!grid) {
      const section = document.createElement('section'),
        heading = document.createElement('h2');

      section.className = 'token-group';
      heading.textContent = group;
      grid = document.createElement('div');
      grid.className = 'token-grid';
      section.append(heading, grid);
      container.append(section);
      grids.set(group, grid);
    }

    const card = document.createElement('div'),
      tokenName = document.createElement('code'),
      tokenValue = document.createElement('code'),
      sample = document.createElement('div'),
      value = computedStyle.getPropertyValue(name).trim();

    card.className = 'token-card';
    tokenName.className = 'token-name';
    tokenName.textContent = name;
    tokenValue.className = 'token-value';
    tokenValue.textContent = value || 'Not defined';
    sample.className = 'token-sample';
    appendTokenPreview(sample, name, value);
    card.append(tokenName, tokenValue, sample);
    grid.append(card);
  }
};

const renderTokenList = (container: HTMLElement, names: string[]): void => {
  const computedStyle = getComputedStyle(document.body),
    groups = new Map<string, string[]>();

  for (const name of names) {
    const group = name.replace(/^--sl-/, '').split('-')[0];

    groups.set(group, [...(groups.get(group) ?? []), name]);
  }

  const summary = document.createElement('p');
  summary.className = 'token-summary';
  summary.textContent = `${names.length} tokens · ${[...groups]
    .map(([group, tokens]) => `${group}: ${tokens.length}`)
    .join(' · ')}`;
  container.append(summary);

  for (const [group, tokens] of groups) {
    const section = document.createElement('section'),
      heading = document.createElement('h2'),
      list = document.createElement('div');

    section.className = 'token-group';
    heading.textContent = `${group} (${tokens.length})`;
    list.className = 'token-list';
    section.append(heading, list);
    container.append(section);

    for (const name of tokens) {
      const row = document.createElement('div'),
        preview = document.createElement('span'),
        tokenName = document.createElement('code'),
        tokenValue = document.createElement('code'),
        value = computedStyle.getPropertyValue(name).trim();

      row.className = 'token-row';
      preview.className = 'token-row-preview';
      preview.setAttribute('aria-hidden', 'true');
      tokenName.textContent = name;
      tokenValue.textContent = value || 'Not defined';
      tokenValue.title = value;

      if (value && CSS.supports('color', value)) {
        preview.classList.add('token-row-color');
        preview.style.background = value;
      } else if (/^-?[\d.]+(px|rem|em)$/.test(value)) {
        preview.classList.add('token-row-length');
        preview.style.inlineSize = value;
      }

      row.append(preview, tokenName, tokenValue);
      list.append(row);
    }
  }
};

/** Lists tokens that other themes define but the active theme doesn't, as names only. */
const renderMissingTokens = (container: HTMLElement, names: string[]): void => {
  const section = document.createElement('section'),
    heading = document.createElement('h2'),
    list = document.createElement('div');

  section.className = 'token-group';
  heading.textContent = `Not defined in this theme (${names.length})`;
  list.className = 'token-list token-missing';
  list.append(
    ...names.map(name => {
      const tokenName = document.createElement('code');

      tokenName.textContent = name;

      return tokenName;
    })
  );
  section.append(heading, list);
  container.append(section);
};

// The gallery chrome deliberately uses fixed colors and fonts instead of theme tokens, so a
// theme change only shows up in the previews of the tokens that actually changed.
const tokenStyles = html`
  <style>
    .token-gallery {
      color: #1f2328;
      display: grid;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      gap: 10px;
      line-height: 1.4;
    }
    .token-gallery code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      overflow-wrap: anywhere;
    }
    .token-gallery h2 {
      font-size: 16px;
      margin: 0;
    }
    .token-group {
      display: grid;
      gap: 4px;
    }
    .token-grid {
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    }
    .token-card {
      border: 1px solid #d0d7de;
      border-radius: 6px;
      display: grid;
      align-content: start;
      grid-template-rows: repeat(3, auto);
      min-inline-size: 0;
      padding: 4px;
      row-gap: 4px;
    }
    .token-name {
      font-size: 10px;
      font-weight: 600;
      grid-column: 1 / -1;
      line-height: 14px;
    }
    .token-value {
      color: #59636e;
      font-size: 10px;
      grid-column: 1;
      line-height: 14px;
    }
    .token-sample {
      align-items: center;
      display: flex;
      min-block-size: 32px;
      min-inline-size: 0;
      overflow: hidden;
    }
    .token-sample:empty {
      display: none;
    }
    .token-bar {
      background: #0969da;
      block-size: 12px;
      display: block;
      max-inline-size: 100%;
    }
    .token-square,
    .token-swatch {
      background: #0969da;
      display: block;
      flex: none;
      max-block-size: 160px;
      max-inline-size: 100%;
    }
    .token-swatch {
      block-size: 16px;
      border: 1px solid #d0d7de;
      flex: 1 1 auto;
    }
    .token-opacity {
      block-size: 30px;
      inline-size: 30px;
    }
    .token-text {
      white-space: nowrap;
    }
    .token-text-wrapped {
      background: repeating-linear-gradient(
        transparent 0 calc(1lh - 1px),
        #d0d7de calc(1lh - 1px) 1lh
      );
      white-space: pre;
    }
    .token-box {
      background: #fff;
      block-size: 46px;
      box-sizing: border-box;
      display: block;
      inline-size: 54px;
      margin: 12px;
    }
    .token-box-outlined {
      border: 2px solid #0969da;
    }
    .token-summary {
      margin: 0;
    }
    .token-list {
      column-gap: 16px;
      columns: 3;
      font-size: 11px;
    }
    .token-missing code {
      color: #59636e;
      display: block;
      line-height: 16px;
    }
  </style>
`;

/**
 * Renders the tokens of one bucket. The gallery is rebuilt every time `globalsKey` changes, because
 * switching the theme, subtheme or user group in the toolbar rerenders the story without rerunning
 * its `play` function, and the computed values have to be read again.
 */
class TokenGallery extends HTMLElement {
  bucket: TokenBucket = 'shared';
  filter: (name: string) => boolean = () => true;
  layout: 'cards' | 'list' = 'cards';
  userGroup = 'superuser';

  #globalsKey?: string;
  #ready: Promise<void> = Promise.resolve();
  #refreshScheduled = false;
  #run = 0;

  get globalsKey(): string | undefined {
    return this.#globalsKey;
  }

  set globalsKey(value: string | undefined) {
    if (value !== this.#globalsKey) {
      this.#globalsKey = value;
      this.#scheduleRefresh();
    }
  }

  connectedCallback(): void {
    this.#scheduleRefresh();
  }

  /** Resolves once the gallery reflects the latest globals. */
  async whenReady(): Promise<void> {
    // Let a refresh that was scheduled in the same task start first
    await Promise.resolve();

    let current: Promise<void>;
    do {
      current = this.#ready;
      await current;
    } while (current !== this.#ready);
  }

  // Coalesces the property updates of a single render into one refresh. It runs in a microtask,
  // so the decorators have already applied the subtheme and user group attributes to `<body>`.
  #scheduleRefresh(): void {
    if (this.#refreshScheduled) {
      return;
    }

    this.#refreshScheduled = true;
    queueMicrotask(() => {
      this.#refreshScheduled = false;

      if (this.isConnected) {
        this.#ready = this.#refresh(++this.#run);
      }
    });
  }

  async #refresh(run: number): Promise<void> {
    const names = (await loadTokenBuckets())[this.bucket]
      .filter(this.filter)
      .filter(name => this.bucket !== 'userGroup' || appliesToUserGroup(name, this.userGroup));

    // A newer refresh started while the buckets were loading
    if (run !== this.#run) {
      return;
    }

    this.replaceChildren();

    if (!names.length) {
      this.textContent = 'No tokens in this bucket.';
      await document.fonts.ready;
      return;
    }

    // The themed bucket holds tokens from every theme, so some don't exist in the active theme
    const computedStyle = getComputedStyle(document.body),
      defined = names.filter(name => computedStyle.getPropertyValue(name).trim()),
      definedNames = new Set(defined),
      missing = names.filter(name => !definedNames.has(name));

    if (this.layout === 'list') {
      renderTokenList(this, defined);
    } else {
      renderTokenCards(this, defined);
    }

    if (missing.length) {
      renderMissingTokens(this, missing);
    }

    await document.fonts.ready;
  }
}

if (!customElements.get('token-gallery')) {
  customElements.define('token-gallery', TokenGallery);
}

/** Creates a story that renders the tokens of one bucket, optionally narrowed down by `filter`. */
export const tokenStory = ({
  bucket,
  filter = () => true,
  layout = 'cards'
}: {
  bucket: TokenBucket;
  filter?: (name: string) => boolean;
  layout?: 'cards' | 'list';
}): StoryObj => ({
  // Only waits for the gallery, so Chromatic snapshots it once it's filled in
  play: async ({ canvasElement }) => {
    const gallery = canvasElement.querySelector<TokenGallery>('token-gallery');
    if (!gallery) {
      throw new Error('The token gallery was not rendered');
    }

    await gallery.whenReady();
  },
  render: (_, { globals }) => html`
    ${tokenStyles}
    <token-gallery
      class="token-gallery"
      .bucket=${bucket}
      .filter=${filter}
      .layout=${layout}
      .userGroup=${globals.userGroup ?? 'superuser'}
      .globalsKey=${JSON.stringify(globals)}></token-gallery>
  `
});
