import { setup } from '@sanomalearning/slds-sanoma-learning';
import { setup as setupBingel } from '@sanomalearning/slds-bingel';
import { setup as setupBingelDC } from '@sanomalearning/slds-bingel-dc';
import { setup as setupBingelInt } from '@sanomalearning/slds-bingel-int';
import { setup as setupClickEdu } from '@sanomalearning/slds-clickedu';
import { setup as setupItsLearning } from '@sanomalearning/slds-itslearning';
import { setup as setupKampus } from '@sanomalearning/slds-kampus';
import { setup as setupMagister } from '@sanomalearning/slds-magister';
import { setup as setupMax } from '@sanomalearning/slds-max';
import { setup as setupNeon } from '@sanomalearning/slds-neon';
import { setup as setupSL } from '@sanomalearning/slds-sanoma-learning';
import { withTheme } from './decorator.js';
import { updateTheme } from './theme.js';


export const decorators = [withTheme];
export const globalTypes = {
  mode: {
    default: 'light',
    toolbar:{
      icon: 'mirror',
        // Array of plain string values or MenuItem shape (see below)
        items: [
          {
            title:'Light mode',
            left: '🌞',
            value:'light'
          }, 
          {
            title:'Dark mode',
            left: '🌛',
            value:'dark'
          }
        ],
        // Change title based on selected value
        dynamicTitle: true
    }
  }
};
export const globals = {
  themes: [
    {
      id: 'bingel',
      name: 'Bingel',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: setupBingel
    },
    {
      id: 'bingel-dc',
      name: 'Bingel DC',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: setupBingelDC
    },
    {
      id: 'bingel-int',
      name: 'Bingel INT',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: setupBingelInt
    },
    {
      id: 'clickedu',
      name: 'Clickedu',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: setupClickEdu
    },
    {
      id: 'itslearning',
      name: 'itslearning',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: setupItsLearning
    },
    {
      id: 'kampus',
      name: 'Kampus',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: setupKampus
    },
    {
      id: 'magister',
      name: 'Magister',
      color: '#1f97f9',
      fonts: [
        'https://use.typekit.net/zkq0zzv.css',
        '/themes/sanoma-learning/fonts.css'
      ],
      setup: setupMagister
    },
    {
      id: 'max',
      name: 'MAX Online',
      color: '#253646',
      fonts: ['https://use.typekit.net/doq6twb.css'],
      setup: setupMax
    },
    {
      id: 'neon',
      name: 'NEON',
      color: '#1E2922',
      fonts: ['https://use.typekit.net/kes1hoh.css'],
      setup: setupNeon
    },
    {
      id: 'sanoma-learning',
      name: 'Sanoma Learning',
      color: '#56CC8A',
      fonts: [
        'https://use.typekit.net/kes1hoh.css',
        '/themes/sanoma-learning/fonts.css'
      ],
      setup: setupSL
    },
  ],
  selectedTheme: 'sanoma-learning'
};

updateTheme(globals.themes.find(t => t.id === globals.selectedTheme));


