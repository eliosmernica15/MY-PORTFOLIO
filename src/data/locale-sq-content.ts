/**
 * Albanian overlay, part 2: notes bodies, resume data, and the "Now" line.
 * Project data lives in locale-sq.ts.
 */
import type { Note, EducationEntry, ExperienceEntry } from "@/types";

// ---------- Notes ----------
export const SQ_NOTES: Note[] = [
  {
    slug: "designing-a-60fps-particle-field",
    title: "Si të projektosh një fushë grimcash 60fps në shfletues",
    date: "2026-08-15",
    readMin: 7,
    tags: ["webgl", "performancë", "shader-a"],
    summary:
      "Një walkthrough praktik i ndërtimit të një nebule 3D grimcash me WebGL2 të pastër dhe zhurmë FBM — dhe mbajtja e 60fps në një laptop mesatar.",
    body: [
      {
        type: "p",
        text: "Shumica e fushave të grimcave në web janë: ose një canvas 2D me rrathë, ose një skenë e rëndë three.js. Ka një rrugë të mesme që të jep thellësi 3D, shader-a custom dhe një bundle të vogël, gjitha në WebGL2 të pastër.",
      },
      { type: "h2", text: "Pse WebGL2 dhe jo three.js?" },
      {
        type: "p",
        text: "Për punë thjesht grimcash — katrorë të instancuar me një vertex shader që bën punën e rëndë — three.js shton 100KB+ runtime që nuk të duhen. WebGL2 të jep vizatim të instancuar, vertex array objects dhe formatet moderne të teksturave që dëshiron.",
      },
      { type: "h2", text: "Cikli kryesor" },
      {
        type: "list",
        items: [
          "Geometri tampon për N grimca (pozicione, shpejtësi, moshë)",
          "Vizatim i instancuar me një katror të vetëm",
          "Vertex shader zhvendos sipas kohës + mouse",
          "Fragment shader: rënie rrethore e butë me përzierje additive",
          "Ndalet kur document.hidden ose hero jashtë pamjes",
        ],
      },
      { type: "h2", text: "Si ta mbash të shpejtë" },
      {
        type: "p",
        text: 'Fitimi më i madh i vetëm është ndalja kur përdoruesi nuk mund ta shohë canvas-in. IntersectionObserver plus API-ja visibilitychange të çon 90% deri te "falas" kur je jashtë pamjes.',
      },
      {
        type: "callout",
        tone: "info",
        text: "Kapi dpr në 1.5. Në një ekran Retina, dpr i pakufizuar është 2.0+, gjë që dyfishon punën e fragmentit për pothuajse asnjë fitim vizual në grimca të vogla.",
      },
      { type: "h2", text: "Burimi" },
      {
        type: "p",
        text: "Komponenti i plotë është me burim të hapur në këtë repo të portfolios — shiko komponentin ParticleCanvas për implementimin e plotë.",
      },
    ],
  },
  {
    slug: "why-i-built-apl",
    title: "Pse ndërtova një gjuhë programimi në shqip",
    date: "2026-07-02",
    readMin: 9,
    tags: ["kompilues", "dizajn-gjuhësh", "shqip"],
    summary:
      "A++(APL) të lejon të shkruash kod që lexohet si shqip dhe kompilon në Python, React ose FastAPI. Ja pse dhe si.",
    body: [
      {
        type: "p",
        text: 'Shumica e gjuhëve të programimit janë të shkruara në anglisht. Fjalët e çelësit si "if", "for", "function" — dhe gjithë ekosistemi përreth (dokumentacioni, bibliotekat, shembujt) — supozojnë rrjedhshmëri në anglisht. Kjo është një pengesë për shumicën e botës.',
      },
      { type: "h2", text: "Qëllimi" },
      {
        type: "p",
        text: "A++(APL) është një eksperiment: a mund të lejojmë një zhvillues të shkruajë kod në gjuhën e parë të tij — shqip në rastin tonë — dhe ta kompilojë në një objektiv kryesor? Gramatika mapon foljet shqipe në rrjedhë kontrolli të Python, ndërsa emrat shqip në identifikatorë.",
      },
      {
        type: "code",
        lang: "apl",
        code: '// Shqip\nvariabel emri = "Elios"\nper secili nxenes ne klasa:\n    printo nxenes.emri\n\n// kompilon në Python\nfor student in class:\n    print(student.name)',
      },
      { type: "h2", text: "Arkitektura" },
      {
        type: "list",
        items: [
          "Lexues: tokenizon hyrjen shqipe, normalizon hapësirat, trajton Unicode",
          "Parser: prodhon një AST me nyje gjuhë-agnostike",
          "CIL: një përfaqësim i ndërmjetëm i ngjashëm me .NET IL",
          "Backend-e: Python, React TSX, FastAPI (më shumë në punë e sipër)",
        ],
      },
      { type: "h2", text: "Çfarë më befasoi" },
      {
        type: "p",
        text: "Pjesa më e vështirë nuk është kompiluesi — është dokumentacioni. Shkrimi i një specifikimi në shqip që shpjegon një stack frame është më i vështirë se shkrimi i specifikimit në anglisht.",
      },
      {
        type: "quote",
        text: "Nëse mund ta lexosh kodin tënd me zë të lartë dhe të tingëllojë si një fjali, ke një gjuhë të vërtetë — jo vetëm një sheqer sintaktik mbi Python.",
      },
    ],
  },
  {
    slug: "edge-rendering-a-portfolio",
    title: "Edge-Rendering e një Portfolio: Statik, i Zgjuar dhe i Shpejtë",
    date: "2026-05-20",
    readMin: 5,
    tags: ["nextjs", "vercel", "performancë"],
    summary:
      "Si e rindërtova këtë portfolio në Next.js 15 me imazhe OG për çdo faqe, ISR dhe një service worker — dhe pse arkitektura ka më shumë rëndësi se lustrimi vizual.",
    body: [
      {
        type: "p",
        text: "Një portfolio ka një punë të vetme: të largohet dhe të lërë punën të flasë. Kjo do të thotë që faqja të shfaqet nën një sekondë, të duket mirë në telefon dhe të degradojë me hijeshi në një rrjet të dobët.",
      },
      { type: "h2", text: "Statik si parazgjedhje" },
      {
        type: "p",
        text: "Next.js 15 lejon që App Router t’i renderojë të gjitha rrugët në mënyrë statike në kohën e ndërtimit. Faqja e parë është një skedar HTML, ~12KB, i shërbyer nga edge.",
      },
      { type: "h2", text: "Dinamik vetëm ku duhet" },
      {
        type: "p",
        text: "Faqet e projekteve gjenerojnë metadata dhe një imazh OG të personalizuar për çdo projekt në kohën e ndërtimit. Shpërndarja e një lidhjeje te /project/esmp prodhon një kartë reale paralookup në Slack, Twitter dhe LinkedIn — pa ngarkime manuale imazhesh.",
      },
      { type: "h2", text: "Një asistent i skriptuar" },
      {
        type: "p",
        text: "Portofoli përfshin një asistent në stilin e IA-së që e njeh përmbajtjen. Ai nuk është një LLM i vërtetë — është një përputhës mbivendosjeje tokenash mbi të njëjtën të dhëna që renderon faqja. Qëllimi është të tregohet arkitektura: e njëjta burim të dhënash ushqen UI-në, sitemap-in, imazhet OG dhe asistentin.",
      },
      {
        type: "callout",
        tone: "success",
        text: 'Metrika më e mirë e vetme për një portfolio është koha nga klikimi te "e kuptova se çfarë bën". Arkitektura është një shumëzues i çdo zgjedhjeje tjetër.',
      },
    ],
  },
];

// ---------- Resume ----------
export const SQ_EDUCATION: EducationEntry[] = [
  { title: "Unity Tech Hub", period: "2025 - Tani", desc: "Zhvillim Web" },
  {
    title: "Isa Boletini - UBMI",
    period: "2025 - Tani",
    desc: "Shkenca Kompjuterike",
  },
  {
    title: "Kurs zhvilluesi web dhe dizajne",
    period: "2024 - 2026",
    desc: "Kurs i akademisë së inovacionit, drejtimi zhvillim web.",
  },
  {
    title: "Shkenca e Natyrës",
    period: "2022 - 2025",
    desc: 'Shkolla e mesme "Eqrem Çabej"',
  },
  {
    title: "Anglisht e folur",
    period: "2015 - 2024",
    desc: 'Akademia "The Cambridge School" (Anglisht native — American English)',
  },
];

export const SQ_EXPERIENCE: ExperienceEntry[] = [
  { company: "Linkify", period: "2024", desc: "Mbështetje Angleze e Folur" },
];

// ---------- Now ----------
export const SQ_NOW =
  "ESMP v2 + A++(APL) v1.2 në produksion — i hapur për roje me kontratë";
