import bcrypt from 'bcryptjs';
import { User, Activity, Theme, Week, ActivityInstance } from '../../src/db/models/index.js';
import { categories } from '../../src/utils/constants.js';

const templates = [
  {
    title: 'Italian Storytime',
    category: categories[0],
    description: 'Read a short Italian picture book together and ask one question about it.',
    estimatedDuration: 10,
    links: ['https://example.com/story-books'],
  },
  {
    title: 'Italian Breakfast Ritual',
    category: categories[3],
    description: 'Share a simple Italian breakfast and name the foods in Italian.',
    estimatedDuration: 15,
  },
  {
    title: 'Colour Hunt',
    category: categories[0],
    description: 'Find objects around the house matching an Italian colour word.',
    estimatedDuration: 10,
  },
  {
    title: 'Pasta Shapes Charades',
    category: categories[1],
    description: 'Act out and name different pasta shapes in Italian.',
    estimatedDuration: 12,
  },
  {
    title: 'Number Walk',
    category: categories[2],
    description: 'Practise counting to ten in Czech and Italian on a short walk.',
    estimatedDuration: 15,
  },
  {
    title: 'Evening Check-in Cuddle',
    category: categories[3],
    description: 'Five minutes of calm, one thing each that was good today.',
    estimatedDuration: 5,
  },
  {
    title: 'Cartoon Dubbing',
    category: categories[0],
    description: 'Watch a short cartoon segment and repeat a favourite line.',
    estimatedDuration: 15,
  },
  {
    title: 'Family Album Scrapbook',
    category: categories[1],
    description: 'Add one photo and label it in Italian and Czech.',
    estimatedDuration: 20,
    links: [],
  },
];

const sampleThemes = [
  { name: 'Italian Cities', description: 'Rome, Venice, Milan and their landmarks.' },
  { name: 'Italian Foods', description: 'Seasonal foods and their Italian names.' },
  { name: 'Italian Holidays', description: 'Traditional celebrations throughout the year.' },
];

// ---------------------------------------------------------------------------
// First-grade Italian curriculum (reading, writing, grammar).
// Milestones are represented as monthly Theme records across the academic
// year Sep 2026 – Jun 2027. Each milestone groups several lesson templates.
// The child already has some spoken Italian, so the milestones front-load
// reading & writing and move explicit grammar into the second half of the
// year. Every lesson description carries a three-part plan:
//   Lezione  = the guided class/lesson
//   Attivit. = extra-curricular expansion
//   Fonti    = reference material (books, shows, printables)
// ---------------------------------------------------------------------------

const curriculumThemes = [
  {
    name: 'Milestone I · Suoni e Vocali',
    description: 'Recognise and reproduce the five Italian vowel sounds and the main consonant sounds in spoken words. Foundation for reading and writing.',
    startDate: '2026-09-01', endDate: '2026-09-30',
  },
  {
    name: 'Milestone II · Sillabe Aperte',
    description: 'Read and blend open syllables (pa-pe-pi...) to build first two-syllable words.',
    startDate: '2026-10-01', endDate: '2026-10-31',
  },
  {
    name: 'Milestone III · Sillabe Chiuse e Gruppi',
    description: 'Recognise closed syllables, double consonants and the hard/soft C-G groups in simple words.',
    startDate: '2026-11-01', endDate: '2026-11-30',
  },
  {
    name: 'Milestone IV · Prime Parole Bisillabe',
    description: 'Read and recognise common bisyllabic words and the first high-frequency words.',
    startDate: '2026-12-01', endDate: '2026-12-23',
  },
  {
    name: 'Milestone V · Scrittura',
    description: 'Form capital and lower-case letters, then copy and write simple syllables and words.',
    startDate: '2027-01-07', endDate: '2027-01-31',
  },
  {
    name: 'Milestone VI · Articoli e Genere',
    description: 'Use the articles (il/lo/la/le) and recognise masculine/feminine.',
    startDate: '2027-02-01', endDate: '2027-02-28',
  },
  {
    name: 'Milestone VII · Singolare/Plurale e Frase',
    description: 'Form singular/plural and build a minimal sentence (chi è? che fa?).',
    startDate: '2027-03-01', endDate: '2027-03-31',
  },
  {
    name: 'Milestone VIII · Verbi',
    description: 'Use the verbs essere, avere and common -are verbs in the first/second/third persons.',
    startDate: '2027-04-01', endDate: '2027-04-30',
  },
  {
    name: 'Milestone IX · Lettura e Comprensione',
    description: 'Read short written texts aloud and answer simple comprehension questions.',
    startDate: '2027-05-01', endDate: '2027-05-31',
  },
  {
    name: 'Milestone X · Revisione e Librino',
    description: 'Consolidate the year with review games and assemble a personal mini-book ("il mio librino").',
    startDate: '2027-06-01', endDate: '2027-06-30',
  },
];

const curriculumTemplates = [
  // --- Milestone I · Suoni e Vocali (Sep) ---
  {
    title: 'Giochi con i Suoni e le Vocali',
    category: categories[0], milestone: 'Milestone I · Suoni e Vocali', estimatedDuration: 15,
    description: 'Lezione: esploriamo le vocali A E I O U, le diciamo più volte con la bocca "grande o piccola" e le associamo a un gesto.\nAttività: caccia alle vocali in casa, cartellone delle 5 vocali, indovinelli sonori in auto.\nFonti: L\'Albero Azzurro (RaiPlay), schede vocaliche per la prima classe.',
    links: ['https://www.raiplay.it'],
  },
  {
    title: 'Caccia alle Vocali in Casa',
    category: categories[2], milestone: 'Milestone I · Suoni e Vocali', estimatedDuration: 12,
    description: 'Lezione: cerchiamo oggetti il cui nome inizia con la vocale scelta (A come ape, E come elefante) e li fotografiamo.\nAttività: mentre cucini o cammini, chiedi "con quale vocale inizia?".\nFonti: flashcards vocali e oggetti, cartellone "la famiglia delle vocali".',
    links: [],
  },
  {
    title: 'Rime e Filastrocche delle Vocali',
    category: categories[0], milestone: 'Milestone I · Suoni e Vocali', estimatedDuration: 12,
    description: 'Lezione: cantiamo e ripetiamo filastrocche tradizionali sottolineando con la voce la "lettera della settimana".\nAttività: inventiamo una rima con i nomi di famiglia e battiamo le mani a tempo.\nFonti: Antologia di filastrocche per l\'infanzia.',
    links: [],
  },

  // --- Milestone II · Sillabe Aperte (Oct) ---
  {
    title: 'La Casa delle Sillabe Aperte',
    category: categories[0], milestone: 'Milestone II · Sillabe Aperte', estimatedDuration: 15,
    description: 'Lezione: costruiamo le sillabe PA-PE-PI-PO-PU con lettere e carte, leggiamo la "casa delle sillabe" cambiando la vocale.\nAttività: staffetta delle sillabe con la gola, percorso sillabico in salotto.\nFonti: La Casa delle Parole (RaiPlay), schede di segmentazione.',
    links: ['https://www.raiplay.it'],
  },
  {
    title: 'Costruisco Parole con le Sillabe',
    category: categories[0], milestone: 'Milestone II · Sillabe Aperte', estimatedDuration: 15,
    description: 'Lezione: uniamo "sillaba + sillaba" come mattoncini (MA-MA -> mamma, PA-NA -> banana) e leggiamole ad alta voce.\nAttività: costruiamo parole-scritte da appendere in cucina.\nFonti: sillabario illustrato, gioco delle parole a mattoncini.',
    links: [],
  },
  {
    title: 'Staffetta delle Sillabe',
    category: categories[2], milestone: 'Milestone II · Sillabe Aperte', estimatedDuration: 12,
    description: 'Lezione: a turno scegliamo una carta-sillaba, la diciamo a voce alta e la "consegniamo" a una parola della giornata.\nAttività: gioco a squadre con la famiglia, segniamo i tempi.\nFonti: giochi da tavolo di lettura per la prima classe.',
    links: [],
  },

  // --- Milestone III · Sillabe Chiuse e Gruppi (Nov) ---
  {
    title: 'Sillabe Chiuse a Fine Parola',
    category: categories[0], milestone: 'Milestone III · Sillabe Chiuse e Gruppi', estimatedDuration: 15,
    description: 'Lezione: riconosciamo le sillabe che finiscono in consonante (PAN, DON, MAR) e leggiamo parole semplici che le contengono.\nAttività: "indovina la parola": ditian inizio e fine, il bambino completa.\nFonti: liste di parole con sillaba chiusa, lavagna sonora.',
    links: [],
  },
  {
    title: 'Ca-Ga-Co, Ci e Gi: suoni amici',
    category: categories[0], milestone: 'Milestone III · Sillabe Chiuse e Gruppi', estimatedDuration: 15,
    description: 'Lezione: scopriamo che C e G cambiano suono con A-O-U rispetto a E-I (casa, Paolo), confrontando coppie disegnate.\nAttività: giochiamo "oggetto del suono amico" con gli oggetti di casa.\nFonti: schede suoni duri e dolci per la prima classe.',
    links: [],
  },
  {
    title: 'Consonanti Doppie in Festa',
    category: categories[0], milestone: 'Milestone III · Sillabe Chiuse e Gruppi', estimatedDuration: 12,
    description: 'Lezione: scopriamo che "pala" e "palla" sono diverse e allunghiamo la voce sulle doppie.\nAttività: battiamo le mani per ogni doppia (PAL - LA).\nFonti: coppie minime illustrate, schede sulle geminate.',
    links: [],
  },

  // --- Milestone IV · Prime Parole Bisillabe (Dec) ---
  {
    title: 'Corsa alla Lettura di Parole Bisillabe',
    category: categories[0], milestone: 'Milestone IV · Prime Parole Bisillabe', estimatedDuration: 15,
    description: 'Lezione: leggiamo parole di due sillabe alzando piano piano la velocità come una corsa a tappe.\nAttività: cambiamo il ritmo (lento-veloce-lento) mentre camminiamo.\nFonti: flash-card di parole bisillabe progressive.',
    links: [],
  },
  {
    title: 'Parole che Vedo Sempre',
    category: categories[0], milestone: 'Milestone IV · Prime Parole Bisillabe', estimatedDuration: 12,
    description: 'Lezione: riconosciamo "d\'acchito" parole di uso frequentissimo (e, il, la, un, è, io) senza decodificare.\nAttività: le cerchiamo sulle etichette e nei libri.\nFonti: schedario di "parole servizio" ad alta frequenza.',
    links: [],
  },
  {
    title: 'La Prima Frase che Leggo',
    category: categories[2], milestone: 'Milestone IV · Prime Parole Bisillabe', estimatedDuration: 12,
    description: 'Lezione: leggiamo le primissime frasi di 3-4 parole con l\'aiuto delle immagini.\nAttività: la "frase del giorno" da leggere e illustrare.\nFonti: libricini "prima lettura" della biblioteca.',
    links: [],
  },

  // --- Milestone V · Scrittura (Jan) ---
  {
    title: 'Scrivo le Lettere nell\'Aria',
    category: categories[0], milestone: 'Milestone V · Scrittura', estimatedDuration: 15,
    description: 'Lezione: disegniamo le lettere nell\'aria e poi nella sabbia per sentire la direzione del tratto.\nAttività: scriviamo col dito nella farina, lettere arcobaleno.\nFonti: percorsi pre-grafici dello stampatello.',
    links: [],
  },
  {
    title: 'Lettere Grandi e Piccole',
    category: categories[0], milestone: 'Milestone V · Scrittura', estimatedDuration: 12,
    description: 'Lezione: confrontiamo stampatello maiuscolo e minuscolo abbinando le coppie (A-a).\nAttività: memory delle lettere, ordinare le lettere del proprio nome.\nFonti: alfabetiere murale, flashcards.',
    links: [],
  },
  {
    title: 'Dettato di Vocali e Sillabe',
    category: categories[2], milestone: 'Milestone V · Scrittura', estimatedDuration: 12,
    description: 'Lezione: un gioco-dettato: dico una vocale o sillaba e il bambino la scrive senza guardare.\nAttività: solo poche voci brevi, come un gioco con punti.\nFonti: quaderno a rigatura grande.',
    links: [],
  },

  // --- Milestone VI · Articoli e Genere (Feb) ---
  {
    title: 'Gli Articoli: Il - Lo - La - Le',
    category: categories[0], milestone: 'Milestone VI · Articoli e Genere', estimatedDuration: 12,
    description: 'Lezione: accoppiamo un articolo a un nome (la mela, il lupo, lo zoo) scoprendo dove compare LO.\nAttività: a tavola "il pane, la mela...", la spesa a voce.\nFonti: giochi con le carte articolo + nome.',
    links: [],
  },
  {
    title: 'Maschile o Femminile?',
    category: categories[0], milestone: 'Milestone VI · Articoli e Genere', estimatedDuration: 15,
    description: 'Lezione: scopriamo il genere guardando le parole (il/la) con tanti esempi, senza regole difficili.\nAttività: caccia all\'articolo in casa, "il pupazzo che dice il-la".\nFonti: giochi con immagini che abbiamano il/la.',
    links: [],
  },
  {
    title: 'Indovino del Genere',
    category: categories[0], milestone: 'Milestone VI · Articoli e Genere', estimatedDuration: 10,
    description: 'Lezione: un gioco "io dico LA, tu trovi un nome femminile" e viceversa.\nAttività: giochi di rime sul genere (il pane, la mamma, lo zio).\nPiano: l\'obiettivo è il gioco, non la regola perfetta.',
    links: [],
  },

  // --- Milestone VII · Singolare/Plurale e Frase (Mar) ---
  {
    title: 'Uno e Tanti',
    category: categories[0], milestone: 'Milestone VII · Singolare/Plurale e Frase', estimatedDuration: 12,
    description: 'Lezione: uno/più (cane-cani, casa-case) con gesti e immagini che aggiungono.\nAttività: a tavola contiamo "un pane, tre pani" e cerchiamo il plurale.\nFonti: schede singolare/plurale per la prima classe.',
    links: [],
  },
  {
    title: 'La Frase Semplice: Chi fa?',
    category: categories[0], milestone: 'Milestone VII · Singolare/Plurale e Frase', estimatedDuration: 15,
    description: 'Lezione: costruiamo la frase minima con chi (il gatto) e che cosa fa (dorme): "Il gatto dorme".\nAttività: drammatizziamo le frasi raccontando la giornata.\nFonti: immagini da abbinare per comporre frasi.',
    links: [],
  },

  // --- Milestone VIII · Verbi (Apr) ---
  {
    title: 'Sono e Ho: i Verbi Speciali',
    category: categories[0], milestone: 'Milestone VIII · Verbi', estimatedDuration: 15,
    description: 'Lezione: usiamo essere e avere in prima persona ("io sono", "io ho") e alla terza ("lui è", "lei ha").\nAttività: gioco "io ho... e tu?" a passeggio e a tavola.\nFonti: carta dei pronomi personali.',
    links: [],
  },
  {
    title: 'I Verbi in -are: correre, cantare, giocare',
    category: categories[2], milestone: 'Milestone VIII · Verbi', estimatedDuration: 12,
    description: 'Lezione: coniughiamo verbi comuni in -are (io gioco, tu giochi, lui gioca) muovendo il corpo.\nAttività: mimiamo il significato di ogni verbo mentre lo diciamo.\nFonti: fogli di coniugazione illustrati per bambini.',
    links: [],
  },

  // --- Milestone IX · Lettura e Comprensione (May) ---
  {
    title: 'Leggo e Disegno la Storia',
    category: categories[0], milestone: 'Milestone IX · Lettura e Comprensione', estimatedDuration: 15,
    description: 'Lezione: leggiamo un piccolissimo testo e ne disegniamo i personaggi, capire senza test.\nAttività: i disegni diventano una mostra di famiglia.\nFonti: primi libri "io leggo da solo".',
    links: [],
  },
  {
    title: 'Le Tre Domande della Storia',
    category: categories[2], milestone: 'Milestone IX · Lettura e Comprensione', estimatedDuration: 12,
    description: 'Lezione: dopo la lettura rispondiamo a chi? che cosa? dove?\nAttività: lasciamo che sia anche lui a fare domande.\nPiano: semplici domande di comprensione degli eventi.',
    links: [],
  },
  {
    title: 'La Scatola delle Storie',
    category: categories[0], milestone: 'Milestone IX · Lettura e Comprensione', estimatedDuration: 15,
    description: 'Lezione: tiriamo a sorte 3 elementi (chi/dove/oggetto) e inventiamo la nostra storia in due.\nAttività: la registriamo e la riascoltiamo la sera.\nFonti: scatola con carte a scenari e personaggi.',
    links: [],
  },

  // --- Milestone X · Revisione e Librino (Jun) ---
  {
    title: 'Il Mio Librino: progetto dell\'anno',
    category: categories[4], milestone: 'Milestone X · Revisione e Librino', estimatedDuration: 30,
    description: 'Lezione: durante l\'anno raccogliamo parole, disegni e piccole storie per rilegare un libretto personale.\nAttività: è il prodotto conclusivo delle parole imparate.\nFonti: cartellino, spillatrice, tasca per i disegni.',
    links: [],
  },
  {
    title: 'Giochi di Revisione dell\'anno',
    category: categories[0], milestone: 'Milestone X · Revisione e Librino', estimatedDuration: 15,
    description: 'Lezione: giochi di ripasso (indovina la sillaba, cerchia le parole, con fiducia) con fiducia.\nAttività: "quante parole so oggi?" crescente checklist felice.\nPiano: l\'obiettivo è il divertimento.',
    links: [],
  },
  {
    title: 'Festa delle Parole',
    category: categories[1], milestone: 'Milestone X · Revisione e Librino', estimatedDuration: 20,
    description: 'Lezione: una piccola festa di fine anno con parole, piccoli cibi e una mostra del libretto.\nAttività: invitiamo la famiglia ad ascoltare le nostre parole.\nFonti: ricette italiane semplici da preparare insieme.',
    links: [],
  },
];

async function createUserIfMissing(email, password, role) {
  const hash = await bcrypt.hash(password, 10);
  const [user] = await User.findOrCreate({ where: { email }, defaults: { email, passwordHash: hash, role, active: true } });
  return user;
}

async function seedCurriculum(parent) {
  const themes = {};
  for (const t of curriculumThemes) {
    const [theme] = await Theme.findOrCreate({
      where: { name: t.name, userId: parent.id },
      defaults: { ...t, userId: parent.id },
    });
    themes[t.name] = theme;
  }

  const byTitle = {};
  for (const tmpl of curriculumTemplates) {
    const theme = tmpl.milestone ? themes[tmpl.milestone] : null;
    const [activity] = await Activity.findOrCreate({
      where: { title: tmpl.title, userId: parent.id },
      defaults: {
        title: tmpl.title,
        category: tmpl.category,
        description: tmpl.description,
        estimatedDuration: tmpl.estimatedDuration,
        links: tmpl.links || [],
        themeId: theme ? theme.id : null,
        userId: parent.id,
      },
    });
    byTitle[activity.title] = activity;
  }

  // Pre-built sample month: September 2026 (four weeks), 3 Italian blocks/week.
  const septemberWeeks = ['2026-08-31', '2026-09-07', '2026-09-14', '2026-09-21'];
  const sepPlan = [
    { day: 0, block: 'Italian Cultural Activity', title: 'Giochi con i Suoni e le Vocali' },
    { day: 1, block: 'Italian Micro-Immersion', title: 'Rime e Filastrocche delle Vocali' },
    { day: 2, block: 'Czech School Alignment', title: 'Caccia alle Vocali in Casa' },
    { day: 0, block: 'Italian Cultural Activity', title: 'Giochi con i Suoni e le Vocali' },
    { day: 2, block: 'Italian Micro-Immersion', title: 'Scrivo le Lettere nell\'Aria' },
    { day: 3, block: 'Czech School Alignment', title: 'Caccia alle Vocali in Casa' },
    { day: 0, block: 'Italian Micro-Immersion', title: 'La Casa delle Sillabe Aperte' },
    { day: 1, block: 'Italian Cultural Activity', title: 'Rime e Filastrocche delle Vocali' },
    { day: 4, block: 'Czech School Alignment', title: 'Caccia alle Vocali in Casa' },
    { day: 0, block: 'Italian Micro-Immersion', title: 'La Casa delle Sillabe Aperte' },
    { day: 2, block: 'Italian Cultural Activity', title: 'Giochi con i Suoni e le Vocali' },
    { day: 4, block: 'Italian Cultural Activity', title: 'Scrivo le Lettere nell\'Aria' },
  ];

  for (const startDate of septemberWeeks) {
    const [week] = await Week.findOrCreate({
      where: { startDate, userId: parent.id },
      defaults: { startDate, userId: parent.id },
    });
    for (const p of sepPlan) {
      const activity = byTitle[p.title];
      if (!activity) {
        console.warn(`[seed] curriculum activity not found: ${p.title}`);
        continue;
      }
      await ActivityInstance.findOrCreate({
        where: { weekId: week.id, dayOfWeek: p.day, blockType: p.block, activityId: activity.id, homeTag: 'Home A' },
        defaults: { weekId: week.id, dayOfWeek: p.day, blockType: p.block, activityId: activity.id, homeTag: 'Home A' },
      });
    }
  }

  return { themes, activities: byTitle };
}

export async function seedDemo() {
  const admin = await createUserIfMissing('admin@homeschool.app', 'admin123', 'admin');
  const parent = await createUserIfMissing('parent@homeschool.app', 'parent123', 'parent');

  let demo = [admin, parent];
  if (process.env.SEED_DEMO_USER === 'on') {
    demo = [admin];
  }

  const themes = {};
  for (const t of sampleThemes) {
    const [theme] = await Theme.findOrCreate({
      where: { name: t.name, userId: parent.id },
      defaults: { ...t, userId: parent.id, startDate: '2026-09-01', endDate: '2026-09-30' },
    });
    themes[t.name] = theme;
  }

  for (const tmpl of templates) {
    const [activity] = await Activity.findOrCreate({
      where: { title: tmpl.title, userId: parent.id },
      defaults: { ...tmpl, userId: parent.id },
    });
  }

  const weekStart = '2026-08-03';
  const [week, created] = await Week.findOrCreate({ where: { startDate: weekStart, userId: parent.id }, defaults: { startDate: weekStart, userId: parent.id } });

  if (created !== false || true) {
    const allActivities = await Activity.findAll({ where: { userId: parent.id } });
    const byTitle = Object.fromEntries(allActivities.map((a) => [a.title, a]));
    const plan = [
      { day: 0, block: 'Italian Micro-Immersion', title: 'Italian Storytime' },
      { day: 0, block: 'Bonding Ritual', title: 'Evening Check-in Cuddle' },
      { day: 1, block: 'Czech School Alignment', title: 'Number Walk' },
      { day: 2, block: 'Italian Cultural Activity', title: 'Pasta Shapes Charades' },
      { day: 2, block: 'Italian Micro-Immersion', title: 'Colour Hunt' },
      { day: 3, block: 'Bonding Ritual', title: 'Evening Check-in Cuddle' },
      { day: 4, block: 'Italian Micro-Immersion', title: 'Cartoon Dubbing' },
      { day: 5, block: 'Italian Cultural Activity', title: 'Family Album Scrapbook' },
    ];
    for (const p of plan) {
      const activity = byTitle[p.title];
      if (!activity) continue;
      await ActivityInstance.findOrCreate({
        where: { weekId: week.id, dayOfWeek: p.day, blockType: p.block, activityId: activity.id, homeTag: 'Home A' },
        defaults: { weekId: week.id, dayOfWeek: p.day, blockType: p.block, activityId: activity.id, homeTag: 'Home A' },
      });
    }
  }

  // First-grade Italian curriculum (milestones, lessons, September sample plan).
  await seedCurriculum(parent);

  return { admin, parent, seededWeekCreated: created !== false };
}

export async function ensureDemoUser() {
  return createUserIfMissing('parent@homeschool.app', 'parent123', 'parent');
}