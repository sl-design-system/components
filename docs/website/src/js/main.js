import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import './icons.js';
import { InstallInfo } from '@sl-design-system/doc-components/install-info/install-info.js';
import { PageToc } from '@sl-design-system/doc-components/page-toc/page-toc.js';
import { Sidebar } from '@sl-design-system/doc-components/sidebar/sidebar.js';
import { NavGroup } from '@sl-design-system/doc-components/site-nav/nav-group.js';
import { NavItem } from '@sl-design-system/doc-components/site-nav/nav-item.js';
import { SiteNav } from '@sl-design-system/doc-components/site-nav/site-nav.js';

customElements.define('doc-install-info', InstallInfo);
customElements.define('doc-nav-group', NavGroup);
customElements.define('doc-nav-item', NavItem);
customElements.define('doc-page-toc', PageToc);
customElements.define('doc-sidebar', Sidebar);
customElements.define('doc-site-nav', SiteNav);
