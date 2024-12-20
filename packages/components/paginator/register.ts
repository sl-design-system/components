import { PaginatorPageSize } from './src/paginator-page-size.js';
import { PaginatorStatus } from './src/paginator-status.js';
import { Paginator } from './src/paginator.js';

customElements.define('sl-paginator', Paginator);
customElements.define('sl-paginator-page-size', PaginatorPageSize);
customElements.define('sl-paginator-status', PaginatorStatus);
