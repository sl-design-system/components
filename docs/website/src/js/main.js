import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import './icons.js';
import { InstallInfo } from '@sl-design-system/doc-components/install-info/install-info';
import { PageToc } from '@sl-design-system/doc-components/page-toc/page-toc';
import { Sidebar } from '@sl-design-system/doc-components/sidebar/sidebar';
import { NavGroup } from '@sl-design-system/doc-components/site-nav/nav-group';
import { NavItem } from '@sl-design-system/doc-components/site-nav/nav-item';
import { SiteNav } from '@sl-design-system/doc-components/site-nav/site-nav';

customElements.define('doc-install-info', InstallInfo);
customElements.define('doc-nav-group', NavGroup);
customElements.define('doc-nav-item', NavItem);
customElements.define('doc-page-toc', PageToc);
customElements.define('doc-sidebar', Sidebar);
customElements.define('doc-site-nav', SiteNav);
