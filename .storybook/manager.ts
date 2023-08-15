import { addons } from '@storybook/manager-api';

addons.setConfig({
  enableShortcuts: false
});

addons.register('sizeName', ()=>{console.log('bla')});
