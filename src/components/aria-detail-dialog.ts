import { attributeByName, dataset, roleByName } from '../data';
import { html, join, raw, type Raw } from '../lib/html';
import { renderInline } from '../lib/markdown';
import { RELATION_LABEL, relationsOf, type Query, type Relation } from '../lib/query';
import type { Attribute, Role } from '../types';
import type { DetailRequest } from './aria-results-table';

/**
 * <aria-detail-dialog> — spec-grounded details for a role or an attribute in a native <dialog>.
 * Cross-links navigate inside the dialog (with a Back button). "Show in results" emits `query-change`.
 */
export class AriaDetailDialog extends HTMLElement {
  #dialog!: HTMLDialogElement;
  #trigger: HTMLElement | null = null;
  #stack: DetailRequest[] = [];

  connectedCallback(): void {
    if (this.#dialog) return;
    this.innerHTML = '<dialog aria-labelledby="detail-title"><div class="dialog-body"></div></dialog>';
    this.#dialog = this.querySelector('dialog')!;
    this.#dialog.addEventListener('close', () => {
      this.#stack = [];
      this.#trigger?.focus();
      this.#trigger = null;
    });
    this.#dialog.addEventListener('click', (e) => this.#onClick(e));
  }

  open(request: DetailRequest, trigger: HTMLElement | null): void {
    if (!this.#dialog.open) {
      this.#trigger = trigger;
      this.#stack = [];
    }
    this.#stack.push(request);
    this.#render(request);
    if (!this.#dialog.open) this.#dialog.showModal();
    this.querySelector<HTMLElement>('#detail-title')?.focus();
  }

  #onClick(e: Event): void {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-action], [data-detail-type]');
    if (!el) {
      // click on the backdrop closes
      if (e.target === this.#dialog) this.#dialog.close();
      return;
    }
    if (el.dataset.detailType) {
      this.open({ type: el.dataset.detailType as DetailRequest['type'], name: el.dataset.detailName! }, this.#trigger);
      return;
    }
    switch (el.dataset.action) {
      case 'close':
        this.#dialog.close();
        break;
      case 'back': {
        this.#stack.pop();
        const prev = this.#stack.pop();
        if (prev) this.open(prev, this.#trigger);
        break;
      }
      case 'query': {
        const current = this.#stack[this.#stack.length - 1];
        if (!current) break;
        const q: Query =
          current.type === 'role' ? { view: 'role', role: current.name, abstract: roleByName.get(current.name)?.abstract } : { view: 'attribute', attribute: current.name };
        this.#dialog.close();
        this.dispatchEvent(new CustomEvent<Query>('query-change', { detail: q, bubbles: true }));
        break;
      }
    }
  }

  #render(request: DetailRequest): void {
    const body = this.querySelector<HTMLElement>('.dialog-body')!;
    const content = request.type === 'role' ? this.#role(roleByName.get(request.name)) : this.#attribute(attributeByName.get(request.name));
    const canGoBack = this.#stack.length > 1;
    body.innerHTML = html`
      <div class="dialog-toolbar">
        <div>${canGoBack ? html`<button type="button" class="btn btn-sm" data-action="back">← Back</button>` : ''}</div>
        <button type="button" class="btn btn-sm" data-action="close" aria-label="Close dialog">✕</button>
      </div>
      ${content}
    `.html;
  }

  // ----- role ------------------------------------------------------------------

  #role(role: Role | undefined): Raw {
    if (!role) return html`<h2 id="detail-title" tabindex="-1">Unknown role</h2>`;
    const rel = (key: keyof Role, relation: Relation) =>
      role[key] && (role[key] as string[]).length
        ? html`<h3>${RELATION_LABEL[relation]}${relation === 'deprecated' ? '' : ' states and properties'}</h3>${this.#chips('attribute', role[key] as string[])}`
        : '';
    return html`
      <h2 id="detail-title" class="dialog-title" tabindex="-1">
        <code>${role.name}</code>
        <span class="badge badge-neutral">role</span>
        ${role.abstract ? html`<span class="badge badge-inherited">abstract</span>` : ''}
        ${role.deprecated ? html`<span class="badge badge-deprecated">deprecated in ${role.deprecated}</span>` : ''}
      </h2>
      <p class="dialog-description">${renderInline(role.description ?? 'Abstract role. Authors must not use abstract roles in content.')}</p>

      <h3>Characteristics</h3>
      <dl class="dl">
        ${this.#dlRoles('Superclass', role.superclass)}
        ${this.#dlRoles('Subclasses', role.subclasses)}
        ${this.#dlText('Base concepts', role.baseConcepts)}
        ${this.#dlText('Related concepts', role.relatedConcepts)}
        ${this.#dlText('Name from', role.nameFrom)}
        ${role.accessibleNameRequired !== undefined ? this.#dlText('Accessible name required', [role.accessibleNameRequired ? 'Yes' : 'No']) : ''}
        ${role.childrenPresentational !== undefined ? this.#dlText('Children presentational', [role.childrenPresentational ? 'Yes' : 'No']) : ''}
        ${this.#dlRoles('Required context roles', role.requiredParents)}
        ${this.#dlRoles('Required owned roles', role.allowedChildren)}
        ${this.#dlText('Implicit values', role.implicitValues)}
      </dl>

      ${rel('required', 'required')}
      ${rel('supported', 'supported')}
      ${rel('prohibited', 'prohibited')}
      ${rel('deprecatedOn', 'deprecated')}
      ${rel('inherited', 'inherited')}

      ${this.#actions(role.sourceUrl, role.abstract ? 'Show abstract role in results' : 'Show in results')}
    `;
  }

  // ----- attribute -------------------------------------------------------------

  #attribute(attr: Attribute | undefined): Raw {
    if (!attr) return html`<h2 id="detail-title" tabindex="-1">Unknown attribute</h2>`;
    const usage: Record<Relation, string[]> = { required: [], supported: [], inherited: [], prohibited: [], deprecated: [] };
    for (const role of dataset.roles) {
      if (role.abstract) continue;
      const r = relationsOf(role, attr.name);
      if (r.required) usage.required.push(role.name);
      if (r.supported) usage.supported.push(role.name);
      if (r.inherited) usage.inherited.push(role.name);
      if (r.prohibited) usage.prohibited.push(role.name);
      if (r.deprecated) usage.deprecated.push(role.name);
    }
    const section = (relation: Relation, title: string) =>
      usage[relation].length ? html`<h3>${title} (${usage[relation].length})</h3>${this.#chips('role', usage[relation])}` : '';

    const values = attr.values?.length
      ? html`
          <h3>Values</h3>
          <div class="table-wrap">
            <table class="values-table">
              <thead><tr><th scope="col">Value</th><th scope="col">Description</th></tr></thead>
              <tbody>
                ${join(
                  attr.values.map(
                    (v) => html`<tr><td>${v.value}${v.isDefault ? html` <span class="badge badge-neutral">default</span>` : ''}</td><td>${renderInline(v.description)}</td></tr>`,
                  ),
                )}
              </tbody>
            </table>
          </div>
        `
      : '';

    return html`
      <h2 id="detail-title" class="dialog-title" tabindex="-1">
        <code>${attr.name}</code>
        <span class="badge badge-neutral">${attr.kind}</span>
        ${attr.isGlobal ? html`<span class="badge badge-global">global${attr.globalDeprecated ? html` · global use deprecated in ${attr.globalDeprecated}` : ''}</span>` : ''}
        ${attr.deprecated ? html`<span class="badge badge-deprecated">deprecated in ${attr.deprecated}</span>` : ''}
      </h2>
      <p class="dialog-description">${renderInline(attr.description)}</p>

      <h3>Characteristics</h3>
      <dl class="dl">
        ${this.#dlText('Value type', [attr.valueType])}
        ${this.#dlText('Related concepts', attr.relatedConcepts)}
        ${attr.isGlobal ? this.#dlText('Scope', ['Global: usable on all elements of the base markup unless a role prohibits it']) : ''}
      </dl>
      ${values}

      ${section('required', 'Required on roles')}
      ${section('supported', 'Supported on roles')}
      ${section('prohibited', 'Prohibited on roles')}
      ${section('deprecated', 'Deprecated on roles')}
      ${section('inherited', 'Inherited by roles')}

      ${this.#actions(attr.sourceUrl, 'Show in results')}
    `;
  }

  // ----- fragments -------------------------------------------------------------

  #chips(type: DetailRequest['type'], names: string[]): Raw {
    return html`<ul class="chips">${join(
      names.map((n) => html`<li><button type="button" class="chip" data-detail-type="${type}" data-detail-name="${n}">${n}</button></li>`),
    )}</ul>`;
  }

  #dlRoles(label: string, names: string[] | undefined): Raw | '' {
    if (!names?.length) return '';
    return html`<dt>${label}</dt><dd>${this.#chips('role', names)}</dd>`;
  }

  #dlText(label: string, values: string[] | undefined): Raw | '' {
    if (!values?.length) return '';
    return html`<dt>${label}</dt><dd>${join(values.map((v) => html`<code>${v}</code>`), ', ')}</dd>`;
  }

  #actions(sourceUrl: string, queryLabel: string): Raw {
    return html`
      <div class="dialog-actions">
        <a class="btn" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Open in the spec ${raw('<span aria-hidden="true">↗</span>')}<span class="sr-only">(opens in a new tab)</span></a>
        <button type="button" class="btn" data-action="query">${queryLabel}</button>
        <span class="spacer"></span>
        <button type="button" class="btn btn-primary" data-action="close">Close</button>
      </div>
      <p class="source-note">Text © W3C, ${dataset.spec.versionLine} ${dataset.spec.status} (${dataset.spec.upstreamUpdated}), reproduced under the W3C Document License.</p>
    `;
  }
}
