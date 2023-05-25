import { themes } from '../../.storybook/themes';
import { html } from 'lit';

export const setTheme = (name: string, mode = 'light') => {
  const fonts = themes.find(theme => theme.id===name)?.fonts || [];
  
  return html`
    <link href="/themes/${name}/base.css" rel="stylesheet">
    <link href="/themes/${name}/${mode}.css" rel="stylesheet">
    ${fonts.map(font => html`<link href="${font}" rel="stylesheet">`)}
  `;
}
