import { dataset } from '../data';
import { html, join } from '../lib/html';
import { isEmptyQuery, RELATION_LABEL, RELATIONS, type Query, type Relation, type View } from '../lib/query';

/**
 * <aria-query-form> — criteria form. Emits `query-change` (detail: Query) on submit, on view switch
 * and on reset. Light DOM so labels, errors and focus work like a plain form.
 */
export class AriaQueryForm extends HTMLElement {
  #query: Query = { view: 'attribute' };
  #rendered = false;

  connectedCallback(): void {
    if (!this.#rendered) {
      this.#render();
      this.#rendered = true;
    }
    this.#syncControls();
  }

  set query(q: Query) {
    this.#query = { ...q };
    if (this.#rendered) this.#syncControls();
  }

  get query(): Query {
    return this.#read();
  }

  #render(): void {
    const states = dataset.attributes.filter((a) => a.kind === 'state');
    const properties = dataset.attributes.filter((a) => a.kind === 'property');
    const concrete = dataset.roles.filter((r) => !r.abstract);
    const abstract = dataset.roles.filter((r) => r.abstract);
    const opt = (name: string, suffix = '') => html`<option value="${name}">${name}${suffix}</option>`;

    this.innerHTML = html`
      <form novalidate>
        <fieldset class="view-switch">
          <legend>What are you looking for?</legend>
          <label><input type="radio" name="view" value="attribute" checked /> Roles for a state or property</label>
          <label><input type="radio" name="view" value="role" /> States and properties for a role</label>
        </fieldset>

        <div class="form-grid">
          <div class="field">
            <label for="qf-attribute">State / property</label>
            <select id="qf-attribute" name="attribute">
              <option value="">Any</option>
              <optgroup label="States">${join(states.map((a) => opt(a.name, a.deprecated ? ' (deprecated)' : '')))}</optgroup>
              <optgroup label="Properties">${join(properties.map((a) => opt(a.name, a.deprecated ? ' (deprecated)' : '')))}</optgroup>
            </select>
          </div>

          <div class="field">
            <label for="qf-role">Role</label>
            <select id="qf-role" name="role">
              <option value="">Any</option>
              <optgroup label="Roles">${join(concrete.map((r) => opt(r.name, r.deprecated ? ' (deprecated)' : '')))}</optgroup>
              <optgroup label="Abstract roles (not for authors)">${join(abstract.map((r) => opt(r.name)))}</optgroup>
            </select>
          </div>

          <div class="field">
            <label for="qf-relation">Relationship</label>
            <select id="qf-relation" name="relation">
              <option value="">Any</option>
              ${join(RELATIONS.map((rel) => html`<option value="${rel}">${RELATION_LABEL[rel]}</option>`))}
            </select>
          </div>

          <div class="field">
            <label for="qf-kind">Kind</label>
            <select id="qf-kind" name="kind">
              <option value="">States and properties</option>
              <option value="state">States only</option>
              <option value="property">Properties only</option>
            </select>
          </div>

          <div class="field">
            <label for="qf-text">Name contains</label>
            <input id="qf-text" name="text" type="search" autocomplete="off" spellcheck="false" placeholder="e.g. row, label, value" />
          </div>

          <div class="field field-check">
            <input id="qf-abstract" name="abstract" type="checkbox" />
            <label for="qf-abstract">Include abstract roles</label>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Search</button>
          <button type="button" class="btn" data-action="reset">Reset</button>
          <span class="hint" id="qf-hint">Pick at least one criterion. Results update the page address, so you can share the link.</span>
        </div>
        <p class="form-error" id="qf-error" role="alert" hidden></p>
      </form>
    `.html;

    const form = this.querySelector('form')!;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.#submit();
    });
    form.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name === 'view') this.#applyView(target.value as View, true);
    });
    this.querySelector('[data-action="reset"]')!.addEventListener('click', () => {
      form.reset();
      this.#applyView('attribute', false);
      this.#setError(null);
      this.#emit({ view: 'attribute' });
    });
  }

  #submit(): void {
    const q = this.#read();
    if (isEmptyQuery(q)) {
      this.#setError('Choose at least one criterion: a state or property, a role, a relationship, a kind, or a name filter.');
      (this.querySelector(q.view === 'role' ? '#qf-role' : '#qf-attribute') as HTMLSelectElement).focus();
      return;
    }
    this.#setError(null);
    this.#emit(q);
  }

  #emit(q: Query): void {
    this.dispatchEvent(new CustomEvent<Query>('query-change', { detail: q, bubbles: true }));
  }

  #read(): Query {
    const form = this.querySelector('form')!;
    const data = new FormData(form);
    const q: Query = { view: (data.get('view') as View) || 'attribute' };
    const attribute = String(data.get('attribute') ?? '');
    const role = String(data.get('role') ?? '');
    const relation = String(data.get('relation') ?? '') as Relation | '';
    const kind = String(data.get('kind') ?? '');
    const text = String(data.get('text') ?? '').trim();
    if (attribute) q.attribute = attribute;
    if (role) q.role = role;
    if (relation) q.relation = relation;
    if (kind === 'state' || kind === 'property') q.kind = kind;
    if (text) q.text = text;
    if (data.get('abstract')) q.abstract = true;
    return q;
  }

  #syncControls(): void {
    const q = this.#query;
    this.#applyView(q.view, false);
    (this.querySelector('#qf-attribute') as HTMLSelectElement).value = q.attribute ?? '';
    (this.querySelector('#qf-role') as HTMLSelectElement).value = q.role ?? '';
    (this.querySelector('#qf-relation') as HTMLSelectElement).value = q.relation ?? '';
    (this.querySelector('#qf-kind') as HTMLSelectElement).value = q.kind ?? '';
    (this.querySelector('#qf-text') as HTMLInputElement).value = q.text ?? '';
    (this.querySelector('#qf-abstract') as HTMLInputElement).checked = Boolean(q.abstract);
    this.#setError(null);
  }

  /** The view only changes the emphasis of the form; role view makes the role select first. */
  #applyView(view: View, emit: boolean): void {
    const radio = this.querySelector<HTMLInputElement>(`input[name="view"][value="${view}"]`);
    if (radio) radio.checked = true;
    const grid = this.querySelector('.form-grid')!;
    const attrField = this.querySelector('#qf-attribute')!.closest('.field')!;
    const roleField = this.querySelector('#qf-role')!.closest('.field')!;
    grid.prepend(view === 'role' ? roleField : attrField);
    if (emit) {
      const q = this.#read();
      if (!isEmptyQuery(q)) this.#emit(q);
    }
  }

  #setError(message: string | null): void {
    const el = this.querySelector<HTMLElement>('#qf-error')!;
    el.hidden = !message;
    el.textContent = message ?? '';
  }
}

