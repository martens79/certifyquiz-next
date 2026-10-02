const HTML_TAG =
  /<\/?(?:p|div|span|section|article|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|br|hr|strong|em|b|i|u|a|blockquote|pre|code|img|figure|figcaption|details|summary)(?:\s[^<>]*)?\/?>/i;

// Markdown routinely contains angle-bracket placeholders (`<password>`) inside
// code, so only real HTML tags outside code spans count as HTML.
export function looksLikeHtml(value: string) {
  const withoutCode = value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  return HTML_TAG.test(withoutCode);
}
