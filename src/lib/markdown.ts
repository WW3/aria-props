import { escapeHtml, Raw } from './html';

/**
 * Render the markdown-lite produced by scripts/build-dataset.mjs: inline `code`, *em*, **strong**
 * and absolute [text](https://…) links. Everything else is plain text. Output is safe HTML.
 */
export function renderInline(md: string): Raw {
  let s = escapeHtml(md);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_m, text: string, url: string) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s.,;:)]|$)/g, '$1<em>$2</em>');
  return new Raw(s);
}
