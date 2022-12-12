import { Icon } from '@sanomalearning/slds-core/icon';

Icon.registerResolver(name => {
  console.log('resolver', { name });

  return 'Hello world';
});
