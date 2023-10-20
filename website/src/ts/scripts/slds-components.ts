import 'element-internals-polyfill';
import '@oddbird/popover-polyfill';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/dialog/register.js';
import '@sl-design-system/drawer/register.js';
import '@sl-design-system/editor/register.js';
import '@sl-design-system/grid/register.js';
import '@sl-design-system/label/register.js';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/skeleton/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-input/register.js';
import '@sl-design-system/textarea/register.js';
import '@sl-design-system/tooltip/register.js';
import { Tab, TabGroup, TabPanel } from '@sl-design-system/tabs';
import { setup } from '@sl-design-system/sanoma-learning';
import { Icon } from '@sl-design-system/icon';
import { faBug, faCode, faMessagesQuestion, faPenToSquare, faPencilRuler } from '@fortawesome/pro-regular-svg-icons';
import { faHandBackPointUp } from '@fortawesome/pro-solid-svg-icons';
import { faGithub, faSlack } from '@fortawesome/free-brands-svg-icons';

setup();
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Icon.registerIcon(
  faBug,
  faCode,
  faGithub,
  faHandBackPointUp,
  faMessagesQuestion,
  faPenToSquare,
  faPencilRuler,
  faSlack
);
console.log('blaaaaal', faCode);

/** Workaround for the error:
 * Uncaught DOMException: "Failed to execute 'define' on 'CustomElementRegistry': the name "sl-tab-panel" has already been used with this registry"
 * Import "import @sl-design-system/tabs/register.js" caused the error above */
customElements.define('sl-tab-panel', TabPanel);
customElements.define('sl-tab', Tab);
customElements.define('sl-tab-group', TabGroup);
