import { readFileSync, writeFileSync } from 'node:fs';

const enPath = 'src/messages/en.json';
const sqPath = 'src/messages/sq.json';
const en = JSON.parse(readFileSync(enPath, 'utf8'));
const sq = JSON.parse(readFileSync(sqPath, 'utf8'));

// ---------- prune namespaces that belonged to the removed OS layer ----------
const PRUNE = [
  'desktop', 'boot', 'menubar', 'dock', 'os', 'finder', 'preview', 'notesApp',
  'aboutSystem', 'prefs', 'mail', 'stats', 'testimonials',
];
for (const ns of PRUNE) { delete en[ns]; delete sq[ns]; }

// resume: keep only downloadCV (used by About)
en.resume = { downloadCV: en.resume.downloadCV };
sq.resume = { downloadCV: sq.resume.downloadCV };

// navigation: prune dead
for (const k of ['home', 'services', 'resume', 'hireMe', 'getInTouch']) {
  delete en.navigation[k]; delete sq.navigation[k];
}

// about: keep the lean set
en.about = {
  title: en.about.title,
  subtitle: en.about.subtitle,
  description: en.about.description,
  availability: en.about.availability,
  values: [en.about.values[2]],
  based: 'Based',
  basedValue: 'Vushtrri, Kosovo',
  languages: 'Languages',
  languagesValue: 'English · Albanian',
  experience: 'Experience',
  experienceValue: '4+ years shipping production products',
  contact: 'Contact',
};
sq.about = {
  title: sq.about.title,
  subtitle: sq.about.subtitle,
  description: sq.about.description,
  availability: sq.about.availability,
  values: [sq.about.values[2]],
  based: 'Vendndodhja',
  basedValue: 'Vushtrri, Kosovë',
  languages: 'Gjuhët',
  languagesValue: 'Anglisht · Shqip',
  experience: 'Përvoja',
  experienceValue: '4+ vjet produkte në produksion',
  contact: 'Kontakti',
};

// hero: rebuild
en.hero = {
  kicker: 'KOS — ENGINEER · DESIGNER · PRODUCT BUILDER',
  headline: 'I build the systems,\nthe interfaces,\nand the tools underneath them.',
  lede: 'Elios Mernica — from first sketch to production. Design, frontend, backend and AI in one pair of hands.',
  ctaWork: 'See the work',
  ctaHire: 'Hire me',
  proofLine: '8 products shipped — A++(APL) · ESMP · Eltrix Cloud',
  aplImageAlt: "A++(APL) — screenshot of the live transpiler",
  aplCaption: 'a programming language with Albanian syntax',
  aplLinkLabel: 'Open the A++(APL) case study',
};
sq.hero = {
  kicker: 'KOS — INXHINIER · DIZAJNER · NDËRTUES PRODUKTESH',
  headline: 'Ndërtoj sistemet,\nndërfaqet,\ndhe mjetet që qëndrojnë poshtë tyre.',
  lede: 'Elios Mernica — nga skica e parë në produksion. Dizajn, frontend, backend dhe IA në një palë duar.',
  ctaWork: 'Shiko punën',
  ctaHire: 'Më punëso',
  proofLine: '8 produkte të dërguara — A++(APL) · ESMP · Eltrix Cloud',
  aplImageAlt: "A++(APL) — pamje e transpiluesit live",
  aplCaption: 'një gjuhë programimi me sintaksë shqipe',
  aplLinkLabel: 'Hap studimin e rastit A++(APL)',
};

// work namespace
en.work = {
  kicker: '01 — Work',
  title: 'Selected work.',
  count: '{count} products, shipped end-to-end',
};
sq.work = {
  kicker: '01 — Puna',
  title: 'Punë të zgjedhura.',
  count: '{count} produkte, të dërguara nga fillimi deri në fund',
};

// notes: add viewAll
en.notes.viewAll = 'All notes';
sq.notes.viewAll = 'Të gjitha shënimet';

// contact: add rateLimited, reference, detailsToggle
en.contact.rateLimited = 'Too many messages — give it a minute and try again.';
sq.contact.rateLimited = 'Shumë mesazhe — prit një minutë dhe provo sërish.';
en.contact.reference = 'Reference';
sq.contact.reference = 'Referenca';
en.contact.detailsToggle = 'Add project details (optional)';
sq.contact.detailsToggle = 'Shto detaje të projektit (opsionale)';

// footer: rebuild
en.footer = {
  tagline: 'Based in Kosovo. Building for the world.',
  rights: 'All rights reserved.',
  email: 'eliosmernica@gmail.com',
  colophon: 'Set in Fraunces & Plus Jakarta · paper & terracotta',
};
sq.footer = {
  tagline: 'Me bazë në Kosovë. Duke ndërtuar për botën.',
  rights: 'Të gjitha të drejtat e rezervuara.',
  email: 'eliosmernica@gmail.com',
  colophon: 'Vendosur në Fraunces & Plus Jakarta · letër & terakotë',
};

// navigation also needs notes/about/contact/projects/main/logo — all kept

// palette: prune unused, add new
en.palette.short && delete en.palette.short;
sq.palette.short && delete sq.palette.short;
for (const k of ['navHome', 'navProjects']) {
  delete en.palette[k]; delete sq.palette[k];
}
for (const k of ['apps', 'skills']) {
  delete en.palette.groups[k]; delete sq.palette.groups[k];
}
en.palette.actions = { hire: 'Hire me — start a project', cv: 'Download CV' };
sq.palette.actions = { hire: 'Më punëso — nis një projekt', cv: 'Shkarko CV-në' };
en.palette.groups.actions = 'Actions';
sq.palette.groups.actions = 'Veprimet';
en.palette.navWork = 'Work';
sq.palette.navWork = 'Puna';
en.palette.navServices = 'Services';
sq.palette.navServices = 'Shërbimet';
en.palette.navAbout = 'About';
sq.palette.navAbout = 'Rreth meje';

// accessibility: prune dead keys if present
for (const k of ['openMenu', 'closeMenu']) {
  delete en.accessibility[k]; delete sq.accessibility[k];
}

writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
writeFileSync(sqPath, JSON.stringify(sq, null, 2) + '\n');

const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => v && typeof v === 'object' && !Array.isArray(v) ? flat(v, p + k + '.') : [p + k]);
const fa = new Set(flat(en)), fb = new Set(flat(sq));
let m = 0;
for (const k of fa) if (!fb.has(k)) { m++; console.log('missing sq:', k); }
for (const k of fb) if (!fa.has(k)) { m++; console.log('missing en:', k); }
console.log('en', fa.size, 'sq', fb.size, 'missing', m);
