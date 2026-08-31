import { SITE } from '@/data/site';
import { PROJECTS } from '@/data/projects';
import { NOTES } from '@/data/notes';

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

/**
 * Build a Schema.org BreadcrumbList for the current route.
 *
 * Recognized paths:
 *   /                          → Home
 *   /notes                     → Home › Notes
 *   /notes/<slug>              → Home › Notes › <title>
 *   /project/<id>              → Home › Projects › <title>
 *   anything else              → Home
 */
export function buildBreadcrumbs(pathname: string): BreadcrumbList {
  const base = SITE.url.replace(/\/$/, '');
  const home: BreadcrumbItem = {
    '@type': 'ListItem',
    position: 1,
    name: 'Home',
    item: `${base}/`,
  };

  if (pathname === '/' || pathname === '') {
    return wrap([home]);
  }

  if (pathname === '/notes' || pathname === '/notes/') {
    return wrap([
      home,
      { '@type': 'ListItem', position: 2, name: 'Notes', item: `${base}/notes` },
    ]);
  }

  const noteMatch = pathname.match(/^\/notes\/([^\/]+)\/?$/);
  if (noteMatch) {
    const slug = noteMatch[1];
    const note = NOTES.find((n) => n.slug === slug);
    const title = note?.title ?? slug;
    return wrap([
      home,
      { '@type': 'ListItem', position: 2, name: 'Notes', item: `${base}/notes` },
      { '@type': 'ListItem', position: 3, name: title, item: `${base}/notes/${slug}` },
    ]);
  }

  const projectMatch = pathname.match(/^\/project\/([^\/]+)\/?$/);
  if (projectMatch) {
    const id = projectMatch[1];
    const project = PROJECTS.find((p) => p.id === id);
    const title = project?.title ?? id;
    return wrap([
      home,
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${base}/#projects` },
      { '@type': 'ListItem', position: 3, name: title, item: `${base}/project/${id}` },
    ]);
  }

  return wrap([home]);
}

function wrap(items: BreadcrumbItem[]): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
