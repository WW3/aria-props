import { html, join, raw, type Raw } from '../lib/html';
import {
  RELATION_LABEL,
  RELATIONS,
  sortRows,
  summarize,
  type Query,
  type Relation,
  type Row,
  type SortDirection,
  type SortKey,
} from '../lib/query';

export interface DetailRequest {
  type: 'role' | 'attribute';
  name: string;
  /** Element to return focus to when the dialog closes. */
  trigger?: HTMLElement | null;
}

/**
 * <aria-results-table> — sortable results with one row per (attribute, role) pair.
 * Emits `show-detail` (detail: DetailRequest) when a name is activated.
 */
export class AriaResultsTable extends HTMLElement {
  #rows: Row[] = [];
  #query: Query = { view: 'attribute' };
  #sortKey: SortKey | null = null;
  #sortDir: SortDirection = 'ascending';
  #pendingFocus = false;

  connectedCallback(): void {
    this.addEventListener('click', (e) => this.#onClick(e));
  }

  /** Replace rows for a new query. Focus moves to the results heading once rendered. */
  show(rows: Row[], query: Query): void {
    this.#rows = rows;
    this.#query = query;
    this.#sortKey = null;
    this.#sortDir = 'ascending';
    this.#pendingFocus = true;
    this.#render();
  }

  clear(): void {
    this.#rows = [];
    this.innerHTML = '';
  }

  #onClick(e: Event): void {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-detail-type], [data-sort]');
    if (!target) return;
    if (target.dataset.sort) {
      this.#toggleSort(target.dataset.sort as SortKey);
      return;
    }
    const detail: DetailRequest = {
      type: target.dataset.detailType as DetailRequest['type'],
      name: target.dataset.detailName!,
      trigger: target,
    };
    this.dispatchEvent(new CustomEvent<DetailRequest>('show-detail', { detail, bubbles: true }));
  }

  #toggleSort(key: SortKey): void {
    if (this.#sortKey === key) this.#sortDir = this.#sortDir === 'ascending' ? 'descending' : 'ascending';
    else {
      this.#sortKey = key;
      this.#sortDir = 'ascending';
    }
    this.#render();
    this.querySelector<HTMLButtonElement>(`[data-sort="${key}"]`)?.focus();
  }

  #render(): void {
    const q = this.#query;
    const summary = summarize(this.#rows);
    const hideAttribute = Boolean(q.attribute);
    const hideRole = Boolean(q.role);
    const rows = this.#sortKey ? sortRows(this.#rows, this.#sortKey, this.#sortDir) : this.#rows;

    const headline = this.#headline(q);
    const summaryText =
      summary.total === 0
        ? 'No matches.'
        : `${summary.total} match${summary.total === 1 ? '' : 'es'} · ${summary.attributes} ${plural(summary.attributes, 'attribute')} · ${summary.roles} ${plural(summary.roles, 'role')}`;

    const counts = join(
      RELATIONS.filter((rel) => summary.byRelation[rel] > 0).map(
        (rel) => html`<li><span class="badge badge-${rel}">${RELATION_LABEL[rel]}: ${summary.byRelation[rel]}</span></li>`,
      ),
    );

    const table =
      summary.total === 0
        ? html`<p class="empty-state">Nothing in WAI-ARIA ${raw('&nbsp;')}matches these criteria. Try widening the relationship or clearing the name filter.</p>`
        : html`
            <div class="table-wrap">
              <table>
                <caption>
                  ${hideAttribute ? html`Results for <code>${q.attribute}</code>. ` : ''}
                  ${hideRole ? html`Results for role <code>${q.role}</code>. ` : ''}
                  Activate a name for its spec description and characteristics.
                </caption>
                <thead>
                  <tr>
                    ${hideAttribute ? '' : this.#sortableHeader('attribute', 'State / property')}
                    ${hideRole ? '' : this.#sortableHeader('role', 'Role')}
                    ${join(RELATIONS.map((rel) => html`<th scope="col" class="col-flag">${RELATION_LABEL[rel]}</th>`))}
                  </tr>
                </thead>
                <tbody>
                  ${join(rows.map((row) => this.#row(row, hideAttribute, hideRole)))}
                </tbody>
              </table>
            </div>
          `;

    this.innerHTML = html`
      <div class="results-head">
        <h2 id="results-heading" tabindex="-1">${headline}</h2>
        <p class="results-summary" role="status">${summaryText}</p>
      </div>
      ${summary.total ? html`<ul class="relation-counts" aria-label="Matches by relationship">${counts}</ul>` : ''}
      ${table}
    `.html;

    if (this.#pendingFocus) {
      this.#pendingFocus = false;
      this.querySelector<HTMLElement>('#results-heading')?.focus({ preventScroll: false });
    }
  }

  #headline(q: Query): string {
    const parts: string[] = [];
    if (q.view === 'role') {
      parts.push(q.role ? `States and properties for ${q.role}` : 'States and properties by role');
    } else {
      parts.push(q.attribute ? `Roles for ${q.attribute}` : 'Roles by state and property');
    }
    if (q.relation) parts.push(RELATION_LABEL[q.relation].toLowerCase());
    if (q.kind) parts.push(q.kind === 'state' ? 'states only' : 'properties only');
    if (q.text) parts.push(`matching “${q.text}”`);
    return parts.join(' · ');
  }

  #sortableHeader(key: SortKey, label: string): Raw {
    const active = this.#sortKey === key;
    const ariaSort = active ? ` aria-sort="${this.#sortDir}"` : '';
    const arrow = active ? (this.#sortDir === 'ascending' ? '▲' : '▼') : '↕';
    return html`
      <th scope="col"${raw(ariaSort)}>
        <button type="button" class="sort-btn" data-sort="${key}">
          ${label} <span class="arrow" aria-hidden="true">${arrow}</span>
          <span class="sr-only">, sort ${active && this.#sortDir === 'ascending' ? 'descending' : 'ascending'}</span>
        </button>
      </th>
    `;
  }

  #row(row: Row, hideAttribute: boolean, hideRole: boolean): Raw {
    return html`
      <tr>
        ${hideAttribute ? '' : html`<td class="col-name">${this.#nameButton('attribute', row.attribute)}</td>`}
        ${hideRole ? '' : html`<td class="col-name">${this.#nameButton('role', row.role)}</td>`}
        ${join(RELATIONS.map((rel) => this.#flagCell(rel, row[rel])))}
      </tr>
    `;
  }

  #nameButton(type: DetailRequest['type'], name: string): Raw {
    return html`<button type="button" class="btn-link mono" data-detail-type="${type}" data-detail-name="${name}" aria-haspopup="dialog">${name}</button>`;
  }

  #flagCell(rel: Relation, on: boolean): Raw {
    return on
      ? html`<td class="col-flag"><span class="mark mark-yes mark-${rel}"><span aria-hidden="true">✓</span><span class="sr-only">${RELATION_LABEL[rel]}</span></span></td>`
      : html`<td class="col-flag"><span class="mark mark-no"><span aria-hidden="true">–</span><span class="sr-only">Not ${RELATION_LABEL[rel].toLowerCase()}</span></span></td>`;
  }
}

function plural(n: number, word: string): string {
  return n === 1 ? word : `${word}s`;
}
