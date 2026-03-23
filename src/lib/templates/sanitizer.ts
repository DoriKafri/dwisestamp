import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'a', 'img', 'p', 'br', 'hr', 'span', 'div',
  'b', 'strong', 'i', 'em', 'u',
  'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'width', 'height', 'style',
  'cellpadding', 'cellspacing', 'border', 'align', 'valign',
  'bgcolor', 'color', 'face', 'size', 'target', 'role',
];

export function sanitizeSignatureHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

export function stripAllHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}