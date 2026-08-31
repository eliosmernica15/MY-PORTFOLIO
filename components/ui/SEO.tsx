'use client';

import * as React from 'react';

export interface SEOProps {
  /**
   * Array of JSON-LD objects to inject. Each object should include
   * `@context` (typically `https://schema.org`) and `@type`.
   */
  jsonLd: Array<Record<string, unknown>>;
  /** ID used on each <script> tag. Defaults to a stable slug. */
  idPrefix?: string;
}

/**
 * SEO — client component that injects JSON-LD structured data into
 * the document <head>. Safe to render multiple times; each entry is
 * de-duplicated by an id generated from its `@type`.
 *
 * Usage:
 *   <SEO jsonLd={[{
 *     '@context': 'https://schema.org',
 *     '@type': 'Person',
 *     name: 'Elios Mernica',
 *   }]} />
 */
export default function SEO({ jsonLd, idPrefix = 'jsonld' }: SEOProps) {
  const scripts = React.useMemo(() => {
    return jsonLd
      .filter((obj) => obj && typeof obj === 'object')
      .map((obj, i) => {
        const type = typeof obj['@type'] === 'string' ? (obj['@type'] as string) : `item-${i}`;
        const slug = type.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const id = `${idPrefix}-${slug}-${i}`;
        return { id, payload: JSON.stringify(obj) };
      });
  }, [jsonLd, idPrefix]);

  return (
    <>
      {scripts.map(({ id, payload }) => (
        <script
          key={id}
          type="application/ld+json"
          id={id}
          dangerouslySetInnerHTML={{ __html: payload }}
        />
      ))}
    </>
  );
}
