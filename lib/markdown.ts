import { marked, Renderer } from 'marked';
function escape(value: string) { return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function safeUrl(href: string) {
  try { const url = new URL(href, 'https://www.buildzn.com'); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? escape(href) : ''; } catch { return ''; }
}
export function renderMarkdown(content: string) {
  const renderer = new Renderer();
  renderer.code = function(token) {
    return Renderer.prototype.code.call(this, token).replace('<pre>', '<pre tabindex="0" role="region" aria-label="Code example">');
  };
  renderer.table = function(token) {
    return '<div class="table-scroll" tabindex="0" role="region" aria-label="Data table">' + Renderer.prototype.table.call(this, token) + '</div>';
  };
  renderer.html = ({ text }) => escape(text);
  renderer.link = function({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens); const url = safeUrl(href);
    return url ? `<a href="${url}"${title ? ` title="${escape(title)}"` : ''}>${label}</a>` : label;
  };
  renderer.image = ({ href, text }) => {
    const url = safeUrl(href); return url && !url.startsWith('mailto:') ? `<img src="${url}" alt="${escape(text)}" loading="lazy" />` : escape(text);
  };
  return marked.parse(content, { renderer, async: false });
}
