import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import 'invokers-polyfill';
import './theme.js';
import './icons.js';
import {
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faArrowUpShortWide,
  faBold,
  faBug,
  faCircleExclamation,
  faClipboard,
  faCode,
  faCopy,
  faFileLines,
  faGear,
  faItalic,
  faList,
  faBook,
  faPen,
  faRectanglesMixed,
  faRocket,
  faRotateLeft,
  faRotateRight,
  faScissors,
  faTableCells,
  faTableRows,
  faTrash,
  faUnderline
} from '@fortawesome/pro-regular-svg-icons';
import {
  faAlignJustify as fasAlignJustify,
  faAlignLeft as fasAlignLeft,
  faAlignRight as fasAlignRight,
  faBold as fasBold,
  faGear as fasGear,
  faItalic as fasItalic,
  faMoonStars as fasMoonStars,
  faSunBright as fasSunBright,
  faUnderline as fasUnderline
} from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/accordion/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/breadcrumbs/register.js';
import '@sl-design-system/callout/register.js';
import '@sl-design-system/card/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/combobox/register.js';
import '@sl-design-system/date-field/register.js';
import '@sl-design-system/dialog/register.js';
import '@sl-design-system/drawer/register.js';
import '@sl-design-system/editor/register.js';
import '@sl-design-system/ellipsize-text/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/format-date/register.js';
import '@sl-design-system/format-number/register.js';
import '@sl-design-system/icon/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/infotip/register.js';
import '@sl-design-system/inline-message/register.js';
import '@sl-design-system/listbox/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/message-dialog/register.js';
import '@sl-design-system/number-field/register.js';
import '@sl-design-system/paginator/register.js';
import '@sl-design-system/panel/register.js';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/progress-bar/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/scrollbar/register.js';
import '@sl-design-system/search-field/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/skeleton/register.js';
import '@sl-design-system/spinner/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/tabs/register.js';
import '@sl-design-system/tag/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/time-field/register.js';
import '@sl-design-system/tree/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import '@sl-design-system/tooltip/register.js';
import { setup } from '@sl-design-system/sanoma-learning';
import { Code } from '@sl-design-system/doc-components/code/code.js';
import { Code as CodeBlock } from '@sl-design-system/doc-components/code-block/code-block.js';
import { CodeExample } from '@sl-design-system/doc-components/code-example/code-example.js';
import { CopyButton } from '@sl-design-system/doc-components/copy-button/copy-button.js';
import { Heading } from '@sl-design-system/doc-components/heading/heading.js';
import { InstallInfo } from '@sl-design-system/doc-components/install-info/install-info.js';
import { OpenIssueCount } from '@sl-design-system/doc-components/open-issue-count/open-issue-count.js';
import { PageToc } from '@sl-design-system/doc-components/page-toc/page-toc.js';
import { Sidebar } from '@sl-design-system/doc-components/sidebar/sidebar.js';
import { NavGroup } from '@sl-design-system/doc-components/site-nav/nav-group.js';
import { NavItem } from '@sl-design-system/doc-components/site-nav/nav-item.js';
import { SiteNav } from '@sl-design-system/doc-components/site-nav/site-nav.js';

// Register the theme's system icons (e.g. the infotip's `info` icon) and config.
setup();

// Icons used in the documentation templates
Icon.register(faBug, faCircleExclamation, faCode, faFileLines);

// Icons used in the code examples
Icon.register(
  faAlignLeft,
  faAlignJustify,
  faAlignRight,
  faArrowUpShortWide,
  faBook,
  faBold,
  faClipboard,
  faCopy,
  faGear,
  faItalic,
  faList,
  faPen,
  faRectanglesMixed,
  faRocket,
  faRotateLeft,
  faRotateRight,
  faScissors,
  faTableCells,
  faTableRows,
  faTrash,
  faUnderline,
  fasAlignLeft,
  fasAlignJustify,
  fasAlignRight,
  fasBold,
  fasGear,
  fasItalic,
  fasMoonStars,
  fasSunBright,
  fasUnderline
);

customElements.define('doc-code', Code);
customElements.define('doc-code-block', CodeBlock);
customElements.define('doc-code-example', CodeExample);
customElements.define('doc-copy-button', CopyButton);
customElements.define('doc-heading', Heading);
customElements.define('doc-install-info', InstallInfo);
customElements.define('doc-nav-group', NavGroup);
customElements.define('doc-nav-item', NavItem);
customElements.define('doc-open-issue-count', OpenIssueCount);
customElements.define('doc-page-toc', PageToc);
customElements.define('doc-sidebar', Sidebar);
customElements.define('doc-site-nav', SiteNav);
