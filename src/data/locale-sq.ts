/**
 * Albanian content overlay — the same datasets as the English source-of-truth
 * files, with every human-facing string translated into Albanian.
 * Components select the right dataset via `useLocale()`; technical proper
 * nouns (project names, tech names) stay in their original form.
 */
import type { Project, Note } from "@/types";

export const SQ_PROJECTS: Project[] = [
  {
    id: "esmp",
    title: "ESMP",
    category: "Zhvillim Web",
    description:
      "Sistemi operativ i tregut për bizneset moderne — vitrinë, pagesa, faturime dhe analiza në një vend.",
    longDescription:
      "ESMP është sistemi operativ për mikro-biznese, agjenci dhe ofrues shërbimesh. Ai unifikon menaxhimin e vitrinës, pagesat, faturimet dhe analizat në një panel të vetëm të shpejtë dhe të rafinuar. Faqe ulëse e produktit dhe ndërfaqja e produktit shfaqin një dizajn monokrom të pastër me pamje të shtresuara të panelit, ndërrim temash dhe modele UX të nivelit ndërmarrës të ndërtuara për shpejtësi.",
    image: "/projects/esmp.png",
    link: "https://esmp-cloud.vercel.app/",
    color: "#171717",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Vercel"],
    year: "2026",
    challenge:
      "Unifikimi i vitrinës, pagesave, faturimeve dhe analizave në një panel të vetëm të shpejtë",
    outcome:
      "Sistemi operativ i tregtisë ndërmarrëse — vitrina, pagesat, faturimet dhe analizat të unifikuara në një panel të vetëm produktiv",
    role: "Inxhinier produkti (i vetëm)",
    duration: "4 muaj",
    metrics: [],
    highlights: [
      "Panel i vetëm OS për SMB",
      "Stripe + faturim + analiza",
      "Ndërrim temash sipas preferencës së sistemit",
      "Dizajnuar, ndërtuar dhe dërguar nga fillimi deri në fund",
    ],
    techRationale: [
      {
        name: "React",
        reason: "Modeli i komponentëve përputhet 1:1 me strukturën e panelit.",
      },
      {
        name: "Vite",
        reason:
          "Cikli i zhvillimit nën sekondë për iterim të shpejtë të UI-së.",
      },
      {
        name: "Tailwind CSS",
        reason: "Tokena dizajnesh si klasa — tematizim i lehtë.",
      },
    ],
  },
  {
    id: "apl",
    title: "A++(APL)",
    category: "Zhvillim Web",
    description:
      "Gjuhë programimi në shqip me sintaksë natyrale — kompilon në Python, React dhe FastAPI.",
    longDescription:
      "A++(APL) është një gjuhë programimi e shkruar në shqip që lexohet si gjuhë natyrale. Platforma përfshin një demo transpiluesi live, një playground interaktiv, mjete CLI dhe dokumentacion të plotë. Zhvilluesit shkruajnë skedarë .apl me sintaksë të thjeshtë shqipe dhe kompilojnë në Python, React TSX ose FastAPI me një komandë të vetme — me hot reload, një arkitekturë CIL dhe instalues ndër-platform.",
    image: "/projects/apl.png",
    link: "https://aplplus.vercel.app/",
    color: "#2e2e2e",
    tech: ["Python", "React", "FastAPI", "TypeScript", "Vite", "CIL"],
    year: "2026",
    challenge:
      "T’u mundësosh zhvilluesve të shkruajnë kod në shqip dhe të kompilojnë në objektiva kryesore (Python, React, FastAPI)",
    outcome:
      "Një transpilues live me arkitekturë CIL, një playground dhe një zinxhir mjetesh CLI",
    role: "Dizajnues, inxhinier kompiluesi dhe inxhinier produkti",
    duration: "5 muaj",
    metrics: [{ label: "Objektiva", value: "3", suffix: "" }],
    highlights: [
      "Sintaksë shqipe në gjuhë natyrale",
      "Zinxhir kompiluesi i bazuar në CIL",
      "Backend-e Python / React / FastAPI",
      "Playground live në shfletues",
    ],
    techRationale: [
      {
        name: "Python",
        reason: "Ekosistemi më i mirë për mjete gjuhe dhe manipulim AST.",
      },
      {
        name: "FastAPI",
        reason:
          "Mënyra më e shpejtë për një API transpileje të qëndrueshëm për playground-in.",
      },
      {
        name: "React",
        reason:
          "Jep rezultatet e transpilimit live dhe faqen e dokumentacionit.",
      },
    ],
  },
  {
    id: "em-motors",
    title: "EM Motors",
    category: "Zhvillim Web",
    description:
      "Faqja moderne dhe interaktive për prezantimin dhe shitjen e makinave.",
    longDescription:
      "EM Motors është një faqe interaktive me performancë të lartë për shfaqjen e makinave. Ajo shfaq një dizajn modern të ndërtuar me HTML, CSS, JavaScript dhe Bootstrap, duke siguruar një përvojë përdoruesi responzive dhe angazhuese në të gjitha pajisjet. Platforma ofron listime të detajuara makinash, animacione të buta dhe një ndërfaqe intuitive.",
    image: "/projects/em-motors.png",
    link: "https://em-motors.vercel.app/",
    color: "#262626",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    year: "2026",
    challenge:
      "Ndërtimi i një faqeje shitje makine responzive dhe moderne që ngarkohet shpejt në celular",
    outcome:
      "Një faqe e rafinuar dhe e shpejtë me animacione të buta dhe listime të detajuara mjetesh",
    role: "Inxhinier frontend i vetëm",
    duration: "3 javë",
    metrics: [],
    highlights: [
      "Layout responziv mobile-first",
      "Listime dinamike mjetesh",
      "Rrjetë komponentësh e bazuar në Bootstrap",
      "Pa bllokim framework",
    ],
    techRationale: [
      {
        name: "Bootstrap",
        reason: "Rrjetë + komponentë të provuar për një afat të shkurtër.",
      },
      {
        name: "Vanilla JS",
        reason: "S’duhet pipeline ndërtimi për një faqe të vogël marketingu.",
      },
    ],
  },
  {
    id: "forexpulse",
    title: "ForexPulse",
    category: "Zhvillim Web",
    description:
      "Platformë tregtimi forex dhe prop me kurse live, grafikë, mjete dhe panel.",
    longDescription:
      "ForexPulse është një platformë tregtimi e ndërtuar për tregtarët forex dhe prop. Ajo ofron kurse reale forex për 50+ çifte përmes API-së Frankfurter, faqe çiftesh me grafikë të plotë, një faqe Mjetesh me vlerën e pip-it, kalkulator madhësie pozicioni dhe konvertues valutash, plus një panel me snapshot portofoli dhe listë vëzhgimi. Faqe ulëse dhe aplikacioni ndajnë një UI të errët dhe moderne me thekse qelibar — falas për t’u përdorur, me hyrje opsionale për ruajtjen e preferencave.",
    image: "/forexpulse-hero.png",
    link: "https://forexpulse-trading.vercel.app/",
    color: "#1f1f1f",
    tech: ["HTML", "JavaScript", "Tailwind CSS", "Frankfurter API", "Vercel"],
    year: "2025",
    challenge:
      "T’u japë tregtarëve një vend të vetëm për kurse live, grafikë dhe matematikën e madhësisë së pozicionit",
    outcome:
      "Një aplikacion shumëfaqësor i fokusuar me 50+ çifte, kalkulatorë dhe një panel liste vëzhgimi",
    role: "Inxhinier produkti i vetëm",
    duration: "6 javë",
    metrics: [
      { label: "Çifte", value: "50+", suffix: "" },
      { label: "Rifreskim", value: "30", suffix: "s" },
      { label: "Faqe", value: "6", suffix: "" },
    ],
    highlights: [
      "Kurse live për 50+ çifte",
      "Kalkulator vlerë pip + madhësi pozicioni",
      "Panel liste vëzhgimi + portofoli",
      "UI i errët me thekse qelibar",
    ],
    techRationale: [
      {
        name: "Frankfurter API",
        reason: "Të dhëna FX falas dhe të besueshme pa çelës API.",
      },
      {
        name: "Tailwind CSS",
        reason: "Shpejton iterimin në një UI të dendur dhe të dhënabazuar.",
      },
    ],
  },
  {
    id: "eltrix-cloud",
    title: "Eltrix Cloud",
    category: "Aplikacione",
    description:
      "Platformë krijuese me IA për krijim përmbajtjeje, ndarje skedarësh dhe menaxhim asetesh digjitale.",
    longDescription:
      "Eltrix Cloud është një platformë gjithë-në-një e fuqizuar nga IA që kombinon krijimin e përmbajtjes, ndarjen e skedarëve dhe menaxhimin e aseteve digjitale në një përvojë të pandërprerë. Ajo ofron gjenerim përmbajtjeje të asistuar nga IA, ruajtje të sigurt cloud, mjete bashkëpunimi në kohë reale dhe një panel intuitiv për menaxhimin e aseteve digjitale. Platforma jep një UI premium dhe zhytëse me pamje 3D dhe ndërveprime të buta.",
    image: "/projects/eltrix-cloud.png",
    link: "https://eltrixcloud.netlify.app/",
    color: "#232323",
    tech: [
      "React",
      "TypeScript",
      "AI Integration",
      "Cloud Storage",
      "Tailwind CSS",
    ],
    year: "2025",
    challenge:
      "Kombinimi i mjeteve të përmbajtjes IA, ndarjes së skedarëve dhe menaxhimit të aseteve në një UI premium",
    outcome:
      "Një platformë e rafinuar dhe zhytëse me pamje 3D dhe rrjedha pune përmbajtjeje të asistuara nga IA",
    role: "Inxhinier produkti i vetëm",
    duration: "3 muaj",
    metrics: [],
    highlights: [
      "Gjenerim përmbajtjeje i asistuar nga IA",
      "Ruajtje e sigurt cloud",
      "Bashkëpunim në kohë reale",
      "Pamje 3D dhe ndërveprime të buta",
    ],
    techRationale: [
      {
        name: "React + TS",
        reason: "Llojet strikte kapin mospërputhjet e formës IA/aseteve herët.",
      },
      {
        name: "Cloud Storage",
        reason:
          "Akses i qëndrueshëm, me URL të nënshkruar për skedarë të mëdhenj mediash.",
      },
    ],
  },
  {
    id: "flixverse",
    title: "FlixVerse",
    category: "Zhvillim Web",
    description:
      "Një platformë transmetimi premium me zbulim përmbajtjeje në kohë reale dhe UI zhytëse.",
    longDescription:
      "FlixVerse është një platformë transmetimi e plotë e frymëzuar nga Netflix, e ndërtuar me fokus në performancë dhe përvojë përdoruesi. Ajo ofron karusele dinamike përmbajtjeje, kërkim në kohë reale me autoplotësim, autentikim përdoruesish, menaxhim liste vëzhgimi dhe riprodhim video të gatshme për HD. UI-ja jep një ndjesi kinematografike me animacione të buta dhe paraqitje responzive në të gjitha pajisjet.",
    image: "/flixverse-hero.png",
    link: "https://flixverse-streaming-pro.vercel.app/",
    color: "#191919",
    tech: ["React", "TypeScript", "TMDB API", "Tailwind CSS", "Vercel"],
    year: "2025",
    challenge:
      "Krijimi i një përvoje transmetimi kinematografike me zbulim përmbajtjeje në kohë reale",
    outcome:
      "Një UI transmetimi me ndjesi premium me karusele, kërkim të menjëhershëm dhe listë vëzhgimi",
    role: "Inxhinier produkti i vetëm",
    duration: "5 javë",
    metrics: [{ label: "Katalog", value: "10k+", suffix: "tituj" }],
    highlights: [
      "Karusele dinamike përmbajtjeje",
      "Kërkim i menjëhershëm me autoplotësim",
      "Menaxhim liste vëzhgimi",
      "Riprodhim i gatshëm për HD",
    ],
    techRationale: [
      {
        name: "TMDB API",
        reason: "Metadata të pasura dhe CDN poster-ash jashtë kutisë.",
      },
      {
        name: "Tailwind CSS",
        reason: "Tema e errët kinematografike me hapësirë konsistente.",
      },
    ],
  },
  {
    id: "foodery",
    title: "Foodery",
    category: "Dizajn Web",
    description:
      "Një platformë gjithëpërfshirëse shpërndarje ushqimi dhe porosie me UI moderne.",
    longDescription:
      "Foodery është një ekosistem shpërndarje ushqimi: një panel reaktiv për pronarët e restoranteve, një aplikacion shoferësh me gjurmim GPS në kohë reale dhe një treg konsumatorësh. Next.js shërben faqet e produktit dhe SEO-në, ndërsa Supabase fuqizon vendndodhjet live të shoferëve dhe Redis ruan meny dhe gjendjen e porosive në cache.",
    image: "/projects/project-7.jpg",
    link: "https://fooderydelivery.netlify.app",
    color: "#2b2b2b",
    tech: ["Next.js", "Supabase", "Redis", "Framer Motion", "Tailwind CSS"],
    year: "2024",
    challenge:
      "Ndërtimi i një ekosistemi shpërndarjeje me një panel reaktiv, një aplikacion shoferësh dhe një treg",
    outcome:
      "Një ekosistem shpërndarje ushqimi — panel restoranti, aplikacion shoferësh me GPS live dhe treg konsumatorësh",
    role: "Inxhinier full-stack",
    duration: "4 muaj",
    metrics: [{ label: "Rolë", value: "3", suffix: "" }],
    highlights: [
      "Panel restoranti reaktiv",
      "Aplikacion shoferësh me GPS live",
      "Autentikim shumë-rolësh",
    ],
    techRationale: [
      {
        name: "Next.js",
        reason: "SSR + ISR për faqe produkti të shpejta dhe SEO.",
      },
      {
        name: "Supabase",
        reason: "Abonime në kohë reale për rrjedhën e gjurmimit të shoferëve.",
      },
      {
        name: "Redis",
        reason: "Cache të ngrohta për meny dhe gjendje porosie.",
      },
    ],
  },
  {
    id: "calista",
    title: "Calista",
    category: "Zhvillim Web",
    description:
      "Përvojë shitjeje e lartë me modele ndërveprimi të personalizuara.",
    longDescription:
      "Calista ripërkufizon përvojën e blerjeve në internet për modën e lartë. Projekti fokusohet në mikro-ndërveprime, kalime pa ndërprerje dhe dorëzim asetesh me cilësi të lartë. Ai përfshin një integrim custom headless CMS për menaxhimin dinamik të inventarit.",
    image: "/projects/project-8.png",
    link: "https://calista-bake.netlify.app",
    color: "#282828",
    tech: ["React", "Shopify Hydrogen", "Three.js", "GSAP"],
    year: "2023",
    challenge:
      "Dorëzimi i një vitrine të modës së lartë me mikro-ndërveprime të personalizuara",
    outcome:
      "Një përvojë shitjeje premium me kalime custom dhe integrim headless CMS",
    role: "Inxhinier frontend",
    duration: "2 muaj",
    metrics: [],
    highlights: [
      "Mikro-ndërveprime të personalizuara",
      "Kalime faqeje pa ndërprerje",
      "Skena produktesh Three.js",
      "Inventar headless CMS",
    ],
    techRationale: [
      {
        name: "Shopify Hydrogen",
        reason: "Native për Shopify Storefront API + React.",
      },
      { name: "GSAP", reason: "Kalime të bazuara në timeline të besueshme." },
      { name: "Three.js", reason: "Skena hero produktesh me ndriçim real." },
    ],
  },
];
