import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { PageToc } from '@sl-design-system/doc-components/page-toc/page-toc';
import { Sidebar } from '@sl-design-system/doc-components/sidebar/sidebar';
import { NavGroup, NavItem, SiteNav } from '@sl-design-system/doc-components/site-nav/site-nav';

customElements.define('doc-page-toc', PageToc);
customElements.define('doc-sidebar', Sidebar);
customElements.define('doc-site-nav', SiteNav);
customElements.define('doc-nav-group', NavGroup);
customElements.define('doc-nav-item', NavItem);
