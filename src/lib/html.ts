/** Minimal escaping template helper. Interpolations are escaped unless wrapped with `raw()`. */

export class Raw {
  constructor(public readonly html: string) {}
}

export const raw = (s: string): Raw => new Raw(s);

export function escapeHtml(s: unknown): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stringify(v: unknown): string {
  if (v === null || v === undefined || v === false) return '';
  if (v instanceof Raw) return v.html;
  if (Array.isArray(v)) return v.map(stringify).join('');
  return escapeHtml(v);
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): Raw {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < values.length) out += stringify(values[i]);
  });
  return new Raw(out);
}

/** Join a list with a separator inside a template without escaping already-rendered fragments. */
export function join(items: Raw[], separator = ''): Raw {
  return new Raw(items.map((i) => i.html).join(separator));
}
