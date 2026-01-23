//src/components/PortableTextComponents.tsx
import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-800">
        {children}
      </p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc pl-6 text-gray-800">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal pl-6 text-gray-800">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,

    link: ({ value, children }) => {
      const href = value?.href || "#";
      const openInNewTab = Boolean(value?.openInNewTab);
      const isExternal = /^https?:\/\//.test(href);

      if (isExternal) {
        return (
          <a
            href={href}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </Link>
      );
    },
  },

  types: {
    // se non usi immagini/callout/code, non succede nulla: ignora
    callout: ({ value }) => (
      <div className="my-6 rounded-xl border-l-4 border-blue-400 bg-blue-50 p-4 text-blue-900">
        <p className="m-0">{value?.text}</p>
      </div>
    ),

    // code-input plugin: value.code / value.language (dipende)
    code: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">
        <code>{value?.code}</code>
      </pre>
    ),
  },
};
