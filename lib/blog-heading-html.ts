import type { BlogTocItem } from '@/lib/types/blog';

function stripHtmlTags(s: string): string {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Menambahkan id pada h2/h3 untuk anchor & TOC; output mengikuti urutan dokumen.
 */
export function addHeadingIdsToHtml(html: string): { html: string; toc: BlogTocItem[] } {
  const toc: BlogTocItem[] = [];
  const used = new Set<string>();

  const makeId = (text: string): string => {
    let base = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section';
    let id = base;
    let n = 1;
    while (used.has(id)) {
      n += 1;
      id = `${base}-${n}`;
    }
    used.add(id);
    return id;
  };

  const out = html.replace(
    /<h(2|3)(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (full, level: string, attrs: string | undefined, inner: string) => {
      const text = stripHtmlTags(inner);
      if (!text) return full;
      const attrsStr = attrs ?? '';
      const existing = attrsStr.match(/\sid\s*=\s*["']([^"']+)["']/i)?.[1];
      const id = existing ?? makeId(text);
      if (existing) used.add(existing);
      const lv = (level === '2' ? 2 : 3) as 2 | 3;
      toc.push({ id, title: text, level: lv });
      if (existing) return full;
      return `<h${level}${attrsStr} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: out, toc };
}
