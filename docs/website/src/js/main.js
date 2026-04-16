import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import './theme.js';
import './icons.js';
import { faBars, faBug, faCircleExclamation, faCode, faFileLines } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/callout/register.js';
import '@sl-design-system/dialog/register.js';
import '@sl-design-system/drawer/register.js';
import '@sl-design-system/icon/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/tooltip/register.js';
import { Code } from '@sl-design-system/doc-components/code/code.js';
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

Icon.register(faBars, faBug, faCircleExclamation, faCode, faFileLines);

customElements.define('doc-code', Code);
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

const hamburger = document.querySelector('.mobile-header__hamburger');
const drawer = document.querySelector('#mobile-drawer');

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    drawer.showModal();
    hamburger.setAttribute('aria-expanded', 'true');
  });

  drawer.addEventListener('sl-close', () => {
    hamburger.setAttribute('aria-expanded', 'false');
  });

  drawer.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && drawer.contains(link)) {
      drawer.close();
    }
  });
}
