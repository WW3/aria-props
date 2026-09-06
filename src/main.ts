import './styles.css';
import { AriaApp } from './components/aria-app';
import { AriaDetailDialog } from './components/aria-detail-dialog';
import { AriaQueryForm } from './components/aria-query-form';
import { AriaResultsTable } from './components/aria-results-table';

// Children first so <aria-app> finds upgraded elements when it renders.
customElements.define('aria-query-form', AriaQueryForm);
customElements.define('aria-results-table', AriaResultsTable);
customElements.define('aria-detail-dialog', AriaDetailDialog);
customElements.define('aria-app', AriaApp);
