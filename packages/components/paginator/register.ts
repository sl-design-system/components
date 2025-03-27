import { PaginatorPageSize } from './src/page-size.js';
import { Paginator } from './src/paginator.js';
import { PaginatorStatus } from './src/status.js';

customElements.define('sl-paginator', Paginator);
customElements.define('sl-paginator-page-size', PaginatorPageSize);
customElements.define('sl-paginator-status', PaginatorStatus);
