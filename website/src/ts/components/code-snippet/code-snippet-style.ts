import { css } from 'lit';

export const codeSnippetStyles = css`
  :host {
    margin: 1.6rem 0 2.4rem;
    position: relative;
    display: block;
    background: var(--control-color-surface-100-surface);
    overflow: hidden;
    border: 1px solid var(--control-color-surface-200-surface);
    border-radius: 0.6rem;
    border-top: 0;
    margin: 0;
  }

  sl-button {
    position: absolute;
    right: 1.6rem;
    top: 1.6rem;
  }

  pre {
    margin: 0;
  }

  code {
    /* background-color: var(--table-code-background); */
    border-radius: 0.6rem;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    font-family: 'source-code-pro', monospace;
    font-size: 1.2rem;
    line-height: 1rem;
    padding: 0.2rem 0.8rem;
  }

  code[class*='language-'] {
    background: none;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    color: var(--text-color);
    display: block;
    font-family: 'source-code-pro', monospace;
    font-size: 1.2rem;
    hyphens: none;
    line-height: 1.5;
    padding: 2.4rem 2rem;
    tab-size: 4;
    text-align: left;
    text-shadow: none;
    word-break: normal;
    word-spacing: normal;
    word-wrap: normal;
  }

  pre[class*='language-'] {
    overflow: auto;
    padding: 0;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: var(--control-color-code-text-neutral);
  }

  .token.punctuation {
    color: var(--text-color);
  }

  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: var(--control-color-code-text-danger);
  }

  .token.keyword,
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string,
  .token.variable,
  .token.boolean,
  .token.number {
    color: var(--control-color-code-text-success);
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: var(--control-color-code-text-accent);
  }

  .token.atrule,
  .token.attr-value,
  .token.function {
    color: var(--text-color);
  }

  .token.regex,
  .token.important {
    color: var(--control-color-code-text-warning);
  }

  .token.important,
  .token.bold {
    font-weight: 700;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  @media screen and (-ms-high-contrast: active) {
    code[class*='language-'],
    pre[class*='language-'] {
      background: window;
      color: windowText;
    }

    :not(pre) > code[class*='language-'],
    pre[class*='language-'] {
      background: window;
    }

    .token.important {
      background: highlight;
      color: window;
      font-weight: normal;
    }

    .token.atrule,
    .token.attr-value,
    .token.function,
    .token.keyword,
    .token.operator,
    .token.selector {
      font-weight: bold;
    }

    .token.attr-value,
    .token.comment,
    .token.doctype,
    .token.function,
    .token.keyword,
    .token.operator,
    .token.property,
    .token.string {
      color: highlight;
    }

    .token.attr-value,
    .token.url {
      font-weight: normal;
    }
  }
`;
