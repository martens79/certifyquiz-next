'use client';
import React from 'react';

type StructuredDataProps = {
  id?: string;
  /** Qualsiasi JSON serializzabile */
  data: unknown;
};

export default function StructuredData({ id, data }: StructuredDataProps) {
  const json = JSON.stringify(data);
  return (
    <script
      id={id}
      type="application/ld+json"
      // OK: script inline per JSON-LD
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
