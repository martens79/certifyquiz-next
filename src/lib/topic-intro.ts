const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

/**
 * Se il primo paragrafo Markdown (dopo un eventuale titolo "## ...") e'
 * IDENTICO all'intro gia' renderizzata nella stessa pagina, lo toglie.
 * In ogni altro caso restituisce il contenuto invariato.
 */
export function stripDuplicateIntro(content: string, intro?: string | null): string {
  if (!intro) return content;
  const target = normalizeText(intro);
  if (!target) return content;
  const blocks = content.split(/\n{2,}/);
  const firstParagraph = blocks.findIndex((block) => block.trim() && !/^#{1,6}\s/.test(block.trim()));
  if (firstParagraph < 0 || normalizeText(blocks[firstParagraph]) !== target) return content;
  return blocks.filter((_, index) => index !== firstParagraph).join("\n\n");
}
