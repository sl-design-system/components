import type { Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { updateTheme, themes } from '../../.storybook/themes';
import { html } from 'lit';

const preview: Preview = {
  decorators: [

    (story, { globals: { mode = 'light', theme = 'sanoma-learning' } }) => {
      updateTheme(theme, mode);

      return story();
    },
    (story, data) => {
      return html`
      <style>
        h1:not(:first-of-type) {
          margin-top: 40px;
          border-top: 1px solid currentColor;
          padding-top: 24px;
        }
      </style>
      ${setTheme(data.args.theme, data.args.mode)}
      <h1>State: Default <small>(including "disabled")</small></h1>
      ${story()}
      <h1>State: Hover</h1>
      <div class="sb-fake-hover">
        ${story()}
      </div>
      <h1>State: Active</h1>
      <div class="sb-fake-active">
        ${story()}
      </div>
      <h1>State: Focus</h1>
      <div class="sb-fake-focus-visible">
        ${story()}
      </div>
      ${setPseudoStates()}`
    }
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical'
      }
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    }
  }
};

export default preview;

export const setTheme = (name: string, mode = 'light') => {
  const fonts = themes.find(theme => theme.id===name)?.fonts || [];

  return html`
    <link href="/themes/${name}/base.css" rel="stylesheet">
    <link href="/themes/${name}/${mode}.css" rel="stylesheet">
    ${fonts.map(font => html`<link href="${font}" rel="stylesheet">`)}
  `;
}

export const setPseudoStates = () =>{
  setTimeout(() => {
    setStyle('hover');
    setStyle('active');
    setStyle('focus-visible');
  }, 100);
}

const matches = function (element: Element, selector:string, pseudoClass: string): boolean{
  const selectors = selector.split(':host').filter(empty=>!!empty).map(s=>`:host${s}`.replace(new RegExp(/,\s+$/, 'g'),''));
  const newSelectors = selectors.map(selectorPart => {
    selectorPart = selectorPart.replace(new RegExp(/:host\(((?:(.*).)*)(\))(.*)/, 'g'), `${element.nodeName}$1$4`);
    selectorPart = selectorPart.replace(new RegExp(`.wrapper:${pseudoClass}`, 'g'), '');
    selectorPart = selectorPart.replace(new RegExp(`:${pseudoClass}`, 'g'), '');
    return selectorPart;
  });

  for (const part of newSelectors) {
    try {
      if (element.matches(part)) {
        return true;
      }
    } catch { }
  }
  return false;
}

const setStyle = async (state:string):Promise<void> => {
  const elements = document.querySelectorAll(`.sb-fake-${state} [data-mock-state]`);
  elements.forEach(element => {
    if(!element.shadowRoot?.adoptedStyleSheets){
      return;
    }
    const rules = element.shadowRoot?.adoptedStyleSheets.flat().map(sheet => Array.from(sheet.cssRules)).flat();
    const matchedRules = Array.from(rules).filter(rule => rule instanceof CSSStyleRule && rule.selectorText.indexOf(`:${state}`)>0 && matches(element,rule?.selectorText,state)
    );
    matchedRules.forEach(match =>{
      const newRule = match as CSSStyleRule;
      newRule.selectorText = `:host-context(.sb-fake-${state})${newRule.selectorText.replace(`:${state}`,'')}`
    })
  });
}
