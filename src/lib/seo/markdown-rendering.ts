export type PortableTextTextBlock = {
  children?: unknown[];
};

export function portableTextBlockText(block: PortableTextTextBlock): string {
  return (block.children ?? [])
    .map((child) => {
      if (!child || typeof child !== "object" || !("text" in child)) return "";
      return typeof child.text === "string" ? child.text : "";
    })
    .join("");
}

export function containsRawMarkdown(text: string): boolean {
  return (
    /(^|\n)\s{0,3}(#{1,6}\s|---+\s*$|[-*+]\s+|\d+\.\s+|```|\|.+\|\s*$)/m.test(text) ||
    /\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|(^|\s)_[^_\n]+_(?=\s|[.,;:!?]|$)/m.test(text)
  );
}
