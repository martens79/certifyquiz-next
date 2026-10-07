import { AUDITED_TOPIC_REDIRECTS } from "./audited-topic-redirects";

export function auditedContentLink(href: string): string {
  try {
    const url = new URL(href, "https://www.certifyquiz.com");
    if (!["https:", "http:"].includes(url.protocol) ||
        !["www.certifyquiz.com", "certifyquiz.com"].includes(url.hostname)) return href;
    const target = AUDITED_TOPIC_REDIRECTS[url.pathname];
    return target ? `${target}${url.search}${url.hash}` : href;
  } catch {
    return href;
  }
}
