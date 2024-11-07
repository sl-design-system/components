import { PaginatorSize } from './src/paginator-size';
import { PaginatorStatus } from './src/paginator-status';
import { Paginator } from './src/paginator.js';

customElements.define('sl-paginator', Paginator);
customElements.define('sl-paginator-size', PaginatorSize);
customElements.define('sl-paginator-status', PaginatorStatus);
