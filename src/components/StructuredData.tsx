// src/components/StructuredData.tsx
'use client';
import Script from 'next/script';

export default function StructuredData({ id, data }: { id: string; data: any }) {
  return (
    <Script id={id} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
