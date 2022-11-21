import { withTheme } from './decorator.js';
import { updateTheme } from './theme.js';

export const decorators = [withTheme];
export const globals = {
  themes: [
    {
      id: 'bingel/light',
      name: 'Bingel (light)',
      color: '#0074df',
      fonts: 'https://use.typekit.net/xrr8gdw.css'
    },
    {
      id: 'magister/light',
      name: 'Magister (light)',
      color: '#1f97f9',
      fonts: 'https://use.typekit.net/zkq0zzv.css'
    },
    {
      id: 'max-online/light',
      name: 'MAX Online (light)',
      color: '#253646',
      fonts: 'https://use.typekit.net/doq6twb.css'
    },
    {
      id: 'sanoma-learning/light',
      name: 'Sanoma Learning (light)',
      color: '#56CC8A',
      fonts: '/themes/sanoma-learning/fonts.css'
    },
    {
      id: 'sanoma-learning/dark',
      name: 'Sanoma Learning (dark)',
      color: '#1E2922',
      fonts: '/themes/sanoma-learning/fonts.css'
    }
  ],
  selectedTheme: 'sanoma-learning/light'
};

updateTheme(globals.themes.find(t => t.id === globals.selectedTheme));
