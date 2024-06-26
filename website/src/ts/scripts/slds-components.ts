import '@oddbird/popover-polyfill';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import '@sl-design-system/accordion/register.js';
import '@sl-design-system/avatar/register.js';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/breadcrumbs/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/card/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/dialog/register.js';
import '@sl-design-system/drawer/register.js';
import '@sl-design-system/editor/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/grid/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/inline-message/register.js';
import '@sl-design-system/message-dialog/register.js';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/search-field/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/skeleton/register.js';
import '@sl-design-system/spinner/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/tabs/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/tooltip/register.js';
import { MessageDialog } from '@sl-design-system/message-dialog';
import { setup } from '@sl-design-system/sanoma-learning';
import { Icon } from '@sl-design-system/icon';
import {
  faArrowUpRightFromSquare,
  faBug,
  faCode,
  faCopy,
  faFileEdit,
  faFloppyDisk,
  faMessagesQuestion,
  faPenToSquare,
  faPencilRuler,
  faTrash,
  faTruckFast,
  faXmark
} from '@fortawesome/pro-regular-svg-icons';
import { faEnvelope, faHandBackPointUp, faSchool, faScreenUsers } from '@fortawesome/pro-solid-svg-icons';
import { faGithub, faSlack } from '@fortawesome/free-brands-svg-icons';

setup();

Icon.register(
  faArrowUpRightFromSquare,
  faBug,
  faCode,
  faCopy,
  faEnvelope,
  faFileEdit,
  faFloppyDisk,
  faGithub,
  faHandBackPointUp,
  faMessagesQuestion,
  faPenToSquare,
  faPencilRuler,
  faSchool,
  faScreenUsers,
  faSlack,
  faTrash,
  faTruckFast,
  faXmark
);

declare global {
  interface Window {
    MessageDialog: typeof MessageDialog;
  }
}

// This is a hack so we can access the MessageDialog class from markdown files
window.MessageDialog = MessageDialog;
