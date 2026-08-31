import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${SITE.url.replace(/\/$/, '')}/sitemap.xml`,
    host: SITE.url,
  };
}
