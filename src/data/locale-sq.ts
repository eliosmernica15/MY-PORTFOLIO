/**
 * Albanian content overlay — the same datasets as the English source-of-truth
 * files, with every human-facing string translated into Albanian.
 * Components select the right dataset via `useLocale()`; technical proper
 * nouns (project names, tech names) stay in their original form.
 */
import type { Project, Note } from "@/types";

/** Renditja: më i riu i pari (sipas CV-së). */
export const SQ_PROJECTS: Project[] = [
  {
    id: "genpact-hackathon-2026",
    title: "Genpact Hackathon 2026",
    category: "IA & Shëndetësi",
    description:
      "Triage diagnostik AI i nivelit ndërmarrësor — regjistra në transmetim, FHIR, mbështetje vendimmarrjeje nën sekondë.",
    longDescription:
      "Genpact Hackathon 2026 (Kosovë) — Vendi i 3-të. Një platformë diagnostike e nivelit ndërmarrësor me IA për triage të kujdesit shëndetësor, me marrjen e regjistrave klinikë në transmetim, pajtueshmëri FHIR dhe mbështetje vendimmarrjeje nën sekondë. Ndërtuar gjatë hackathonit nga fillimi deri në fund: pipeline i marrjes së të dhënave, integrimi i modelit të triage-it, UI për mjekët dhe një vendosje e dockerizuar.",
    image: "/projects/genpact-hackathon-2026.svg",
    link: "",
    color: "#1a1611",
    tech: ["Python", "FastAPI", "React", "PostgreSQL", "LLMs", "Docker"],
    year: "2026",
    awards: ["Vendi i 3-të — Genpact Hackathon 2026, Kosovë"],
    challenge:
      "Triage i regjistrave klinikë të çfarëdo vëllimi deri te rekomandime të shpjegueshme dhe nën sekondë për mjekët",
    outcome:
      "Një pipeline triage FHIR-i në transmetim me mbështetje vendimmarrjeje nën sekondë, nga zero në demo pune gjatë hackathonit",
    role: "Arkitekt sistemesh IA & inxhinier full-stack",
    duration: "Hackathon",
    metrics: [{ label: "Renditja", value: "3-të", suffix: "" }],
    highlights: [
      "Vendi i 3-të, Genpact Hackathon 2026 (Kosovë)",
      "Marrje e regjistrave klinikë në transmetim, e përputhshme me FHIR",
      "Mbështetje vendimmarrjeje diagnostike nën sekondë",
      "Inxhinieruar nga fillimi deri në fund gjatë hackathonit",
    ],
    techRationale: [
      {
        name: "FastAPI",
        reason:
          "Runtime async i përshtatshëm për transmetim për pipeline-in e regjistrave.",
      },
      {
        name: "PostgreSQL",
        reason:
          "Ruajtje klinike e qëndrueshme me JSONB për payload-et e ndryshueshme.",
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
    id: "eltrix-cloud",
    title: "Eltrix Cloud",
    category: "IA & Cloud",
    description:
      "Platformë e shpërndarë për përmbajtje kreative — Claude API, RAG me LangChain & LangGraph, indeksim semantik pgvector.",
    longDescription:
      "Eltrix Cloud është një platformë e shpërndarë për krijimin e përmbajtjes, e fuqizuar nga Anthropic Claude API, LangChain dhe LangGraph, me indeksim semantik pgvector dhe rrjedha pune automatike RAG. Kombinon gjenerimin e përmbajtjes së asistuar nga IA, ruajtje të sigurt cloud, mjete bashkëpunimi në kohë reale dhe një UI premium me pamje 3D.",
    image: "/projects/eltrix-cloud.png",
    link: "https://eltrixcloud.netlify.app/",
    color: "#232323",
    tech: [
      "FastAPI",
      "Python",
      "React",
      "TypeScript",
      "LangChain",
      "Claude API",
      "PostgreSQL",
    ],
    year: "2025",
    awards: ["Vendi i 1-rë (IA) — Innovation Academy Hackathon, Qershor 2025"],
    challenge:
      "Kombinimi i mjeteve të përmbajtjes IA, ndarjes së skedarëve dhe menaxhimit të aseteve në një UI premium",
    outcome:
      "Një platformë e shpërndarë për përmbajtje kreative me RAG automatik — fituese, Innovation Academy Hackathon, Qershor 2025",
    role: "Inxhinier produkti i vetëm",
    duration: "Hackathon — Qershor 2025",
    metrics: [],
    highlights: [
      "Vendi i 1-rë (IA) — Innovation Academy Hackathon, Qershor 2025",
      "Claude API + LangChain & LangGraph agjentë",
      "Indeksim semantik pgvector",
      "Rrjedha pune përmbajtjeje me RAG automatik",
      "Pamje 3D dhe ndërveprime të buta",
    ],
    techRationale: [
      {
        name: "Claude API",
        reason:
          "Modeli më i mirë i klasës për arsyetim përmbajtjeje brenda pipeline-eve RAG.",
      },
      {
        name: "pgvector",
        reason:
          "Gjetja semantike për asete dhe përmbajtje të gjeneruar — brenda Postgres.",
      },
      {
        name: "LangChain / LangGraph",
        reason:
          "Graph RAG dhe agjentë të përbëshëm, të inspektuar me hapa human-in-the-loop.",
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
    id: "apl",
    title: "A++(APL)",
    category: "Gjuhë & Vegla",
    description:
      "Gjuhë programimi e shkruar në shqip — lexohet si gjuhë natyrale; transpiluesi live i asistuar nga IA, analizues AST dhe sandbox i kontejnerizuar.",
    longDescription:
      "A++(APL) është një gjuhë programimi e shkruar në shqip që lexohet si gjuhë natyrale. Platforma përfshin një demo transpiluesi live të asistuar nga IA, një analizues AST, një playground interaktiv web, një sandbox ekzekutimi të kontejnerizuar të sigurt dhe një zinxhir mjetesh CLI. Zhvilluesit shkruajnë skedarë .apl me sintaksë të thjeshtë shqipe dhe kompilojnë në Python ose në TypeScript me një komandë të vetme.",
    image: "/projects/apl.png",
    link: "https://aplplus.vercel.app/",
    color: "#2e2e2e",
    tech: ["Python", "FastAPI", "React", "Node.js", "WebGL"],
    year: "2024 – 2025",
    challenge:
      "T’u mundësosh zhvilluesve të shkruajnë kod në shqip dhe të kompilojnë në objektiva kryesore (Python, React, FastAPI)",
    outcome:
      "Një transpilues live me arkitekturë CIL, një playground dhe një zinxhir mjetesh CLI",
    role: "Dizajnues, inxhinier kompiluesi dhe inxhinier produkti",
    duration: "5 muaj",
    metrics: [{ label: "Objektiva", value: "3", suffix: "" }],
    highlights: [
      "Transpiluesi live i asistuar nga IA",
      "Analizues AST + pipeline kompiluesi CIL",
      "Playground interaktiv web",
      "Zinxhir mjetesh CLI",
      "Sandbox ekzekutimi i kontejnerizuar",
    ],
    techRationale: [
      {
        name: "Python",
        reason: "Ekosistemi më i mirë për mjete gjuhe dhe manipulim AST.",
      },
      {
        name: "WebGL",
        reason:
          "Renderim i përshpejtuar nga hardware për playground-in live dhe pamjet e diagnostikimit.",
      },
      {
        name: "FastAPI",
        reason:
          "Mënyra më e shpejtë për një API transpileje të qëndrueshëm për playground-in.",
      },
    ],
  },
  {
    id: "esmp",
    title: "ESMP",
    category: "OS i tregtisë",
    description:
      "Infrastrukturë tregtie me shpejtësi të lartë — analitikë në transmetim, faturim në nivel ledger dhe bllokim i shpërndarë i inventarit.",
    longDescription:
      "ESMP është infrastruktura e tregtisë me shpejtësi të lartë. Unifikon menaxhimin e vitrinës, faturimin automatik në nivel ledger, analitikën në transmetim në kohë reale dhe bllokimin e shpërndarë të inventarit në një panel të vetëm — me webhooks të sigurt të Stripe-it që lëvizin paratë nga fillimi në fund.",
    image: "/projects/esmp.png",
    link: "https://esmp-cloud.vercel.app/",
    color: "#171717",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Redis"],
    year: "2024",
    challenge:
      "Unifikimi i vitrinës, pagesave, faturimeve dhe analizave në një panel të vetëm të shpejtë",
    outcome:
      "Sistemi operativ i tregtisë ndërmarrëse — vitrina, pagesat, faturimet dhe analizat të unifikuara në një panel të vetëm produktiv",
    role: "Inxhinier produkti (i vetëm)",
    duration: "4 muaj",
    metrics: [],
    highlights: [
      "Performancë e lartë e runtime-it të tregtisë",
      "Analitikë në transmetim në kohë reale",
      "Faturim automatik në nivel ledger",
      "Bllokim i shpërndarë i inventarit",
      "Webhooks të sigurt të Stripe-it",
    ],
    techRationale: [
      {
        name: "Redis",
        reason:
          "Cache të nxehta, kufizim shpejtësie dhe bllokime të shpërndara inventari.",
      },
      {
        name: "PostgreSQL",
        reason:
          "E vërteta transaksionale e nivelit ledger — faturim dhe pagesa.",
      },
      {
        name: "Node.js",
        reason:
          "Shtresa API e drejtuar nga ngjarjet për transmetimin e analitikës.",
      },
    ],
  },
  {
    id: "foodery",
    title: "Foodery",
    category: "Dizajn Web",
    description:
      "Ekosistem i shkallëzueshëm mikroshërbimesh shpërndarje — panel restoranti, gjurmim GPS live i shoferëve dhe treg konsumatorësh.",
    longDescription:
      "Foodery është një ekosistem i shkallëzueshëm mikroshërbimësh për shpërndarjen e ushqimit: një panel reaktiv ekzekutiv për pronarët e restoranteve, një aplikacion shoferësh me gjurmim GPS live WebSocket dhe një treg konsumatorësh. Algoritme gjeohapësinore të rrugëtimit dispeçerësh çiftëzojnë porositë me shoferët; Supabase fuqizon vendndodhjet dhe autentikimin në kohë reale; Postgres mban të vërtetën e porosive.",
    image: "/projects/project-7.jpg",
    link: "https://fooderydelivery.netlify.app",
    color: "#2b2b2b",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "WebSockets"],
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
    id: "forexpulse",
    title: "ForexPulse",
    category: "Zhvillim Web",
    description:
      "Motor telemetrie tregjesh financiare — kurse WebSocket me frekuencë të lartë për 50+ çifte.",
    longDescription:
      "ForexPulse është një motor telemetrie tregjesh financiare me ushqime kursesh WebSocket me frekuencë të lartë. 50+ çifte kunreadash me rifreskim 30-sekondësh — kalkulatorë vlerë pip dhe madhësi pozicioni, një faqe Mjetesh dhe një panel liste vëzhgimi.",
    image: "/forexpulse-hero.png",
    link: "https://forexpulse-trading.vercel.app/",
    color: "#1f1f1f",
    tech: [
      "JavaScript",
      "React",
      "Tailwind CSS",
      "WebSockets",
      "Frankfurter API",
    ],
    year: "2024",
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
    id: "calista",
    title: "Calista",
    category: "Zhvillim Web",
    description:
      "Portal tregtie luksoze — renderim Three.js i përshpejtuar nga GPU dhe mikro-ndërveprime të personalizuara.",
    longDescription:
      "Calista është një portal tregtie luksoze me performancë të lartë me renderim 3D WebGL të përshpejtuar nga GPU, mikro-ndërveprime të personalizuara, kalime të pandërprera dhe një headless CMS që drejton inventarin dinamik.",
    image: "/projects/project-8.png",
    link: "https://calista-bake.netlify.app",
    color: "#282828",
    tech: ["React", "Shopify Hydrogen", "Three.js", "GSAP"],
    year: "2024",
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
