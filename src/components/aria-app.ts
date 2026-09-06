import { dataset } from '../data';
import { html } from '../lib/html';
import { buildHash, parseHash, runQuery, sanitizeQuery, type Query } from '../lib/query';
import type { AriaDetailDialog } from './aria-detail-dialog';
import type { AriaQueryForm } from './aria-query-form';
import type { AriaResultsTable, DetailRequest } from './aria-results-table';

/**
 * <aria-app> — page shell and state owner. The URL hash is the single source of truth for the
 * query; the form and results are derived from it, so every result set is a shareable link.
 */
export class AriaApp extends HTMLElement {
  #form!: AriaQueryForm;
  #results!: AriaResultsTable;
  #dialog!: AriaDetailDialog;
  #query: Query = { view: 'attribute' };

  connectedCallback(): void {
    const { spec } = dataset;
    const concrete = dataset.roles.filter((r) => !r.abstract).length;
    this.innerHTML = html`
      <a class="skip-link" href="#results-region">Skip to results</a>
      <header class="app-header">
        <div>
          <h1>WAI-ARIA query tool</h1>
          <p class="tagline">Which states and properties apply to which roles, straight from the ${spec.versionLine} specification.</p>
        </div>
        <p class="data-version">
          Data: ${spec.versionLine} ${spec.status}, upstream ${spec.upstreamUpdated}
          (<a href="https://github.com/w3c/aria/commit/${spec.upstreamCommit}" target="_blank" rel="noopener noreferrer"><code>${spec.upstreamCommit.slice(0, 8)}</code></a>)
          · ${concrete} roles · ${dataset.attributes.length} states and properties
        </p>
      </header>
      <main>
        <section class="panel" aria-labelledby="query-heading">
          <h2 id="query-heading" class="sr-only">Query</h2>
          <aria-query-form></aria-query-form>
        </section>
        <section class="panel" id="results-region" aria-labelledby="results-heading" hidden>
          <aria-results-table></aria-results-table>
        </section>
      </main>
      <aria-detail-dialog></aria-detail-dialog>
      <footer class="app-footer">
        <p>
          Spec text and characteristics © W3C, reproduced under the W3C Document License. Dataset generated from the
          <code>${spec.corpusRepo}</code> corpus${spec.corpusCommit ? html` (<code>${spec.corpusCommit.slice(0, 8)}</code>)` : ''}.
          Abstract roles are listed for completeness; authors must not use them in content.
        </p>
      </footer>
    `.html;

    this.#form = this.querySelector('aria-query-form') as AriaQueryForm;
    this.#results = this.querySelector('aria-results-table') as AriaResultsTable;
    this.#dialog = this.querySelector('aria-detail-dialog') as AriaDetailDialog;

    this.addEventListener('query-change', (e) => this.#onQueryChange((e as CustomEvent<Query>).detail));
    this.addEventListener('show-detail', (e) => {
      const detail = (e as CustomEvent<DetailRequest>).detail;
      this.#dialog.open(detail, detail.trigger ?? null);
    });
    window.addEventListener('hashchange', () => this.#applyHash(true));
    this.#applyHash(false);
  }

  #onQueryChange(q: Query): void {
    const hash = buildHash(q);
    if (hash === location.hash.replace(/^#/, '')) {
      this.#run(q, true);
      return;
    }
    // history.pushState-free: assigning the hash creates a history entry and fires hashchange
    location.hash = hash;
  }

  #applyHash(focusResults: boolean): void {
    const q = sanitizeQuery(dataset, parseHash(location.hash));
    this.#form.query = q;
    this.#run(q, focusResults);
  }

  #run(q: Query, focusResults: boolean): void {
    this.#query = q;
    const region = this.querySelector<HTMLElement>('#results-region')!;
    const rows = runQuery(dataset, q);
    if (rows.length === 0 && !hasCriteria(q)) {
      region.hidden = true;
      this.#results.clear();
      return;
    }
    region.hidden = false;
    this.#results.show(rows, q);
    if (!focusResults) this.querySelector<HTMLElement>('#results-heading')?.blur();
  }

  get query(): Query {
    return this.#query;
  }
}

function hasCriteria(q: Query): boolean {
  return Boolean(q.attribute || q.role || q.relation || q.kind || q.text);
}
