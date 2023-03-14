import { Icon } from '@sanomalearning/slds-core/icon';
import { resolveIcon } from '../../icon-resolver.js';
import { icons } from './icons.js';

Icon.registerResolver(name => name ?? resolveIcon(name, icons));
