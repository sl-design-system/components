import { withTheme } from './decorator';

export const decorators = [withTheme];
export const globals = {
  themes: [
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
