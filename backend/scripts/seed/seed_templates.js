import bcrypt from 'bcryptjs';
import { User, Activity, Theme, Week, ActivityInstance } from '../../src/db/models/index.js';
import { categories } from '../../src/utils/constants.js';

// Demo templates. Base title/description are English; Czech and Italian
// translations are stored explicitly (English falls back to the base).
const templates = [
  {
    title: 'Italian Storytime',
    title_it: 'Lettura in italiano',
    title_cs: 'Italské čtení',
    category: categories[0],
    description: 'Read a short Italian picture book together and ask one question about it.',
    description_it: 'Leggete insieme un breve libro illustrato in italiano e fate una domanda su di esso.',
    description_cs: 'Přečtěte společně krátkou italskou obrázkovou knížku a položte o ní jednu otázku.',
    estimatedDuration: 10,
    links: ['https://example.com/story-books'],
  },
  {
    title: 'Italian Breakfast Ritual',
    title_it: 'Rituale della colazione italiana',
    title_cs: 'Italský rituál snidaně',
    category: categories[3],
    description: 'Share a simple Italian breakfast and name the foods in Italian.',
    description_it: 'Condividete una semplice colazione italiana e nominate i cibi in italiano.',
    description_cs: 'Sdílejte jednoduchou italskou snidan a pojmenujte jídlo italsky.',
    estimatedDuration: 15,
  },
  {
    title: 'Colour Hunt',
    title_it: 'Caccia ai colori',
    title_cs: 'Hledání barev',
    category: categories[0],
    description: 'Find objects around the house matching an Italian colour word.',
    description_it: 'Trova in casa oggetti che corrispondono a un colore detto in italiano.',
    description_cs: 'Najděte kolem domu předměty, které odpovídají italskému názvu barvy.',
    estimatedDuration: 10,
  },
  {
    title: 'Pasta Shapes Charades',
    title_it: 'Sciarada delle forme di pasta',
    title_cs: 'Šaráda s tvary těstovin',
    category: categories[1],
    description: 'Act out and name different pasta shapes in Italian.',
    description_it: 'Mima e nomina in italiano diverse forme di pasta.',
    description_cs: 'Zahrajte a pojmenujte různé tvary těstovin italsky.',
    estimatedDuration: 12,
  },
  {
    title: 'Number Walk',
    title_it: 'Camminata dei numeri',
    title_cs: 'Procházka s čísly',
    category: categories[2],
    description: 'Practise counting to ten in Czech and Italian on a short walk.',
    description_it: 'Esercitatevi a contare fino a dieci in ceco e in italiano durante una breve passeggiata.',
    description_cs: 'Za procházky si procvičte počítání do deseti česky a italsky.',
    estimatedDuration: 15,
  },
  {
    title: 'Evening Check-in Cuddle',
    title_it: 'Amoretto del check-in serale',
    title_cs: 'Večerní objetí a check-in',
    category: categories[3],
    description: 'Five minutes of calm, one thing each that was good today.',
    description_it: 'Cinque minuti di calma e una cosa bella di oggi per ciascuno.',
    description_cs: 'Pět minut klidu, každý řekne jednu dobrou věc, která se dnes stala.',
    estimatedDuration: 5,
  },
  {
    title: 'Cartoon Dubbing',
    title_it: 'Doppiaggio di cartoni',
    title_cs: 'Dabing k pohádce',
    category: categories[0],
    description: 'Watch a short cartoon segment and repeat a favourite line.',
    description_it: 'Guarda un breve cartoon e ripeti una battuta preferita.',
    description_cs: 'Sledujte krátkou část pohádky a zopakujte oblíbenou větu.',
    estimatedDuration: 15,
  },
  {
    title: 'Family Album Scrapbook',
    title_it: 'Album di famiglia',
    title_cs: 'Rodinné fotoalbum',
    category: categories[1],
    description: 'Add one photo and label it in Italian and Czech.',
    description_it: 'Aggiungi una foto e scrivine la didascalia in italiano e in ceco.',
    description_cs: 'Přidejte jednu fotografii a popište ji italsky a česky.',
    estimatedDuration: 20,
    links: [],
  },
];

const sampleThemes = [
  {
    name: 'Italian Cities', description: 'Rome, Venice, Milan and their landmarks.',
    name_cs: 'Italská města', name_it: 'Città italiane',
    description_cs: 'Řím, Benátky, Milán a jejich památky.',
    description_it: 'Roma, Venezia, Milano e i loro famosi monumenti.',
  },
  {
    name: 'Italian Foods', description: 'Seasonal foods and their Italian names.',
    name_cs: 'Italská jídla', name_it: 'Cibi italiani',
    description_cs: 'Sezónní jídla a jejich italské názvy.',
    description_it: 'I cibi di stagione e i loro nomi italiani.',
  },
  {
    name: 'Italian Holidays', description: 'Traditional celebrations throughout the year.',
    name_cs: 'Italské svátky', name_it: 'Le feste italiane',
description_cs: 'Tradiční oslavy v průběhu roku.',
    description_it: 'Le celebrazioni tradizionali durante tutto l’anno.',
  },
];

// ---------------------------------------------------------------------------
// First-grade Italian curriculum (reading, writing, grammar).
// Milestones are represented as monthly Theme records across the academic
// year Sep 2026 – Jun 2027. Each milestone groups several lesson templates.
// The child already has some spoken Italian, so the milestones front-load
// reading & writing and shift explicit grammar into the second half.
// The base `name`/`description` are Italian; English and Czech are stored in
// the `_en`/`_cs` fields and selected client-side by the app language.
// ---------------------------------------------------------------------------

const curriculumThemes = [
  {
    name: 'Milestone I · Suoni e Vocali',
    name_en: 'Milestone I · Sounds and Vowels',
    name_cs: 'Milestone I · Hlásky a samohlásky',
    description: 'Riconoscere e riprodurre i cinque suoni vocalici e i principali suoni consonantici nelle parole. Base per lettura e scrittura.',
    description_en: 'Recognise and reproduce the five Italian vowel sounds and the main consonant sounds in spoken words. The foundation for reading and writing.',
    description_cs: 'Rozpoznat a reprodukovat pět italských samohlásek a hlavní souhlásky ve slyšených slovech. Základ pro čtení a psaní.',
    startDate: '2026-09-01', endDate: '2026-09-30',
  },
  {
    name: 'Milestone II · Sillabe Aperte',
    name_en: 'Milestone II · Open Syllables',
    name_cs: 'Milestone II · Otevřené slabiky',
    description: 'Leggere e unire le sillabe aperte (pa-pe-pi...) per costruire le prime parole di due sillabe.',
    description_en: 'Read and blend open syllables (pa-pe-pi...) to build the first two-syllable words.',
    description_cs: 'Číst a spojovat otevřené slabiky (pa-pe-pi...) a vytvořit díky nim první dvouslabičná slova.',
    startDate: '2026-10-01', endDate: '2026-10-31',
  },
  {
    name: 'Milestone III · Sillabe Chiuse e Gruppi',
    name_en: 'Milestone III · Closed Syllables and Groups',
    name_cs: 'Milestone III · Zavřené slabiky a skupiny',
    description: 'Riconoscere sillabe chiuse, doppie e i gruppi C/G duri e dolci in parole semplici.',
    description_en: 'Recognise closed syllables, double consonants and the hard/soft C–G groups in simple words.',
    description_cs: 'Rozpoznávat zavřené slabiky, zdvojené souhlásky a tvrdé/měkké skupiny C–G v jednoduchých slovech.',
    startDate: '2026-11-01', endDate: '2026-11-30',
  },
  {
    name: 'Milestone IV · Prime Parole Bisillabe',
    name_en: 'Milestone IV · First Two-Syllable Words',
    name_cs: 'Milestone IV · První dvouslabičná slova',
    description: 'Leggere e riconoscere le parole bisillabiche comuni e le prime parole ad alta frequenza.',
    description_en: 'Read and recognise common two-syllable words and the first high-frequency words.',
    description_cs: 'Číst a rozpoznávat běžná dvouslabičná slova a první slova s vysokou frekvencí.',
    startDate: '2026-12-01', endDate: '2026-12-23',
  },
  {
    name: 'Milestone V · Scrittura',
    name_en: 'Milestone V · Writing',
    name_cs: 'Milestone V · Psaní',
    description: 'Formare le lettere maiuscole e minuscole, poi copiare e scrivere semplici sillabe e parole.',
    description_en: 'Form capital and lower-case letters, then copy and write simple syllables and words.',
    description_cs: 'Vytvořit velká a malá písmena, pak opsat a napsat jednoduché slabiky a slova.',
    startDate: '2027-01-07', endDate: '2027-01-31',
  },
  {
    name: 'Milestone VI · Articoli e Genere',
    name_en: 'Milestone VI · Articles and Gender',
    name_cs: 'Milestone VI · Členy a rod',
    description: 'Usare gli articoli (il/lo/la/le) e riconoscere il maschile/femminile.',
    description_en: 'Use the articles (il/lo/la/le) and recognise masculine and feminine.',
    description_cs: 'Používat členy (il/lo/la/le) a rozpoznat mužský a ženský rod.',
    startDate: '2027-02-01', endDate: '2027-02-28',
  },
  {
    name: 'Milestone VII · Singolare/Plurale e Frase',
    name_en: 'Milestone VII · Singular/Plural and the Sentence',
    name_cs: 'Milestone VII · Jednotné a množné číslo a věta',
    description: 'Formare singolare/plurale e costruire una frase minima (chi è? che fa?).',
    description_en: 'Form singular and plural, and build a minimal sentence (chi è? che fa?).',
    description_cs: 'Tvořit jednotné a množné číslo a stavět krátkou větu (kdo je? co dělá?).',
    startDate: '2027-03-01', endDate: '2027-03-31',
  },
  {
    name: 'Milestone VIII · Verbi',
    name_en: 'Milestone VIII · Verbs',
    name_cs: 'Milestone VIII · Slovesa',
    description: 'Usare i verbi essere, avere e i comuni verbi in -are alla prima/seconda/terza persona.',
    description_en: 'Use essere, avere and common -are verbs in the first, second and third persons.',
    description_cs: 'Používat slovesa essere, avere a běžná slovesa na -are v první, druhé a třetí osobě.',
    startDate: '2027-04-01', endDate: '2027-04-30',
  },
  {
    name: 'Milestone IX · Lettura e Comprensione',
    name_en: 'Milestone IX · Reading and Comprehension',
    name_cs: 'Milestone IX · Čtení a porozumění',
    description: 'Leggere ad alta voce brevi testi scritti e rispondere a semplici domande di comprensione.',
    description_en: 'Read short written texts aloud and answer simple comprehension questions.',
    description_cs: 'Číst nahlas krátké psané texty a odpovídat na jednoduché otázky porozumění.',
    startDate: '2027-05-01', endDate: '2027-05-31',
  },
  {
    name: 'Milestone X · Revisione e Librino',
    name_en: 'Milestone X · Revision and Little Book',
    name_cs: 'Milestone X · Opakování a knížka',
    description: 'Consolidare l’anno con giochi di ripasso e realizzare un librino personale ("il mio librino").',
    description_en: 'Consolidate the year with review games and assemble a personal mini-book (“il mio librino”).',
    description_cs: 'Upevnit celý rok opakovacími hrami a sestavit osobní mini-knížku („il mio librino“).',
    startDate: '2027-06-01', endDate: '2027-06-30',
  },
];

const curriculumTemplates = [
  // --- Milestone I · Suoni e Vocali (Sep) ---
  {
    title: 'Giochi con i Suoni e le Vocali',
    title_en: 'Vowel and Sound Games',
    title_cs: 'Hry s hláskami a samohláskami',
    category: categories[0], milestone: 'Milestone I · Suoni e Vocali', estimatedDuration: 15,
    description: 'Lezione: esploriamo le vocali A E I O U, le diciamo più volte con la bocca "grande o piccola" e le associamo a un gesto.\nAttività: caccia alle vocali in casa, cartellone delle 5 vocali, indovinelli sonori in auto.\nFonti: L\'Albero Azzurro (RaiPlay), schede vocaliche per la prima classe.',
    description_en: 'Lesson: we explore the vowels A E I O U, say them several times with the mouth "big or small" and link each one to a gesture.\nActivity: vowel hunt around the house, a poster of the five vowels, sound riddles in the car.\nSources: L\'Albero Azzurro (RaiPlay), vowel worksheets for first grade.',
    description_cs: 'Lekce: prozkoumáme samohlásky A E I O U, vyslovíme je několikrát s ústy "velkými nebo malými" a každou spojíme s gestem.\nAktivita: lov na samohlásky po domě, plakát pěti samohlásek, zvukové hádanky v autě.\nZdroje: L\'Albero Azzurro (RaiPlay), pracovní listy na samohlásky pro první třídu.',
    links: ['https://www.raiplay.it'],
  },
  {
    title: 'Caccia alle Vocali in Casa',
    title_en: 'Vowel Hunt at Home',
    title_cs: 'Lov na samohlásky v domě',
    category: categories[2], milestone: 'Milestone I · Suoni e Vocali', estimatedDuration: 12,
    description: 'Lezione: cerchiamo oggetti il cui nome inizia con la vocale scelta (A come ape, E come elefante) e li fotografiamo.\nAttività: mentre cucini o cammini, chiedi "con quale vocale inizia?".\nFonti: flashcards vocali e oggetti, cartellone "la famiglia delle vocali".',
    description_en: 'Lesson: we look for objects whose name starts with the chosen vowel (A as ape, E as elefante) and photograph them.\nActivity: while cooking or walking, ask "with which vowel does it start?".\nSources: vowel flashcards and objects, a "vowel family" poster.',
    description_cs: 'Lekce: hledáme předměty, jejichž jméno začíná zvolenou samohláskou (A jako ape, E jako elefante), a fotografujeme je.\nAktivita: při vaření nebo procházce se ptáme "na kterou samohlásku to začíná?".\nZdroje: kartičky a předměty se samohláskami, plakát "rodina samohlásek".',
    links: [],
  },
  {
    title: 'Rime e Filastrocche delle Vocali',
    title_en: 'Vowel Rhymes and Nursery Rhymes',
    title_cs: 'Rýmy a říkanky se samohláskami',
    category: categories[0], milestone: 'Milestone I · Suoni e Vocali', estimatedDuration: 12,
    description: 'Lezione: cantiamo e ripetiamo filastrocche tradizionali sottolineando con la voce la "lettera della settimana".\nAttività: inventiamo una rima con i nomi di famiglia e battiamo le mani a tempo.\nFonti: Antologia di filastrocche per l\'infanzia.',
    description_en: 'Lesson: we sing and repeat traditional nursery rhymes, stressing the "letter of the week" with our voice.\nActivity: we invent a rhyme with our family names and clap in time.\nSources: an anthology of nursery rhymes for early childhood.',
    description_cs: 'Lekce: zpíváme a opakujeme tradiční říkanky a hlasem zdůrazňujeme "písmeno týdne".\nAktivita: vymyslíme rým s rodinnými jmény a tleskáme do rytmu.\nZdroje: antologie říkanek pro raný dětský věk.',
    links: [],
  },

  // --- Milestone II · Sillabe Aperte (Oct) ---
  {
    title: 'La Casa delle Sillabe Aperte',
    title_en: 'The House of Open Syllables',
    title_cs: 'Dům otevřených slabik',
    category: categories[0], milestone: 'Milestone II · Sillabe Aperte', estimatedDuration: 15,
    description: 'Lezione: costruiamo le sillabe PA-PE-PI-PO-PU con lettere e carte, leggiamo la "casa delle sillabe" cambiando la vocale.\nAttività: staffetta delle sillabe con la gola, percorso sillabico in salotto.\nFonti: La Casa delle Parole (RaiPlay), schede di segmentazione.',
    description_en: 'Lesson: we build the syllables PA-PE-PI-PO-PU with letters and cards, reading the "syllable house" while changing the vowel.\nActivity: a syllable relay running around, a syllable path in the living room.\nSources: La Casa delle Parole (RaiPlay), segmentation worksheets.',
    description_cs: 'Lekce: stavíme slabiky PA-PE-PI-PO-PU z písmen a karet a čteme "dům slabik", přičemž měníme samohlásku.\nAktivita: štafeta slabik s obíháním, cesta ze slabik v obývacím pokoji.\nZdroje: La Casa delle Parole (RaiPlay), pracovní listy na dělení slov.',
    links: ['https://www.raiplay.it'],
  },
  {
    title: 'Costruisco Parole con le Sillabe',
    title_en: 'I Build Words with Syllables',
    title_cs: 'Skládám slova ze slabik',
    category: categories[0], milestone: 'Milestone II · Sillabe Aperte', estimatedDuration: 15,
    description: 'Lezione: uniamo "sillaba + sillaba" come mattoncini (MA-MA -> mamma, PA-NA -> banana) e leggiamole ad alta voce.\nAttività: costruiamo parole-scritte da appendere in cucina.\nFonti: sillabario illustrato, gioco delle parole a mattoncini.',
    description_en: 'Lesson: we join "syllable + syllable" like bricks (MA-MA -> mamma, PA-NA -> banana) and read them aloud.\nActivity: we build written words to hang up in the kitchen.\nSources: an illustrated syllabary, a brick-word game.',
    description_cs: 'Lekce: spojujeme "slabiku + slabiku" jako kostky (MA-MA -> mamma, PA-NA -> banana) a čteme je nahlas.\nAktivita: skládáme napsaná slova, která pověsíme v kuchyni.\nZdroje: obrázkový slabikář, hra se slovy z kostek.',
    links: [],
  },
  {
    title: 'Staffetta delle Sillabe',
    title_en: 'Syllable Relay',
    title_cs: 'Štafeta slabik',
    category: categories[2], milestone: 'Milestone II · Sillabe Aperte', estimatedDuration: 12,
    description: 'Lezione: a turno scegliamo una carta-sillaba, la diciamo a voce alta e la "consegniamo" a una parola della giornata.\nAttività: gioco a squadre con la famiglia, segniamo i tempi.\nFonti: giochi da tavolo di lettura per la prima classe.',
    description_en: 'Lesson: in turn we pick a syllable card, say it aloud and "hand it over" to a word of the day.\nActivity: a family team game, we time ourselves.\nSources: board games for first-grade reading.',
    description_cs: 'Lekce: postupně vybereme kartu se slabikou, vyslovíme ji nahlas a "předáme" ji slovu dne.\nAktivita: týmová hra s rodinou, měříme čas.\nZdroje: deskové hry na čtení pro první třídu.',
    links: [],
  },

  // --- Milestone III · Sillabe Chiuse e Gruppi (Nov) ---
  {
    title: 'Sillabe Chiuse a Fine Parola',
    title_en: 'Closed Syllables at the End of a Word',
    title_cs: 'Zavřené slabiky na konci slova',
    category: categories[0], milestone: 'Milestone III · Sillabe Chiuse e Gruppi', estimatedDuration: 15,
    description: 'Lezione: riconosciamo le sillabe che finiscono in consonante (PAN, DON, MAR) e leggiamo parole semplici che le contengono.\nAttività: "indovina la parola": diciamo inizio e fine, il bambino completa.\nFonti: liste di parole con sillaba chiusa, lavagna sonora.',
    description_en: 'Lesson: we recognise syllables ending in a consonant (PAN, DON, MAR) and read simple words containing them.\nActivity: "guess the word": we say the beginning and the end, the child completes it.\nSources: lists of words with a closed syllable, a sound board.',
    description_cs: 'Lekce: rozpoznáváme slabiky končící souhláskou (PAN, DON, MAR) a čteme jednoduchá slova, která je obsahují.\nAktivita: "uhodni slovo": řekneme začátek a konec, dítě slovo doplní.\nZdroje: seznamy slov se zavřenou slabikou, zvuková tabule.',
    links: [],
  },
  {
    title: 'Ca-Ga-Co, Ci e Gi: suoni amici',
    title_en: 'Ca-Ga-Co, Ci and Gi: Friendly Sounds',
    title_cs: 'Ca-Ga-Co, Ci a Gi: kamarádi zvuky',
    category: categories[0], milestone: 'Milestone III · Sillabe Chiuse e Gruppi', estimatedDuration: 15,
    description: 'Lezione: scopriamo che C e G cambiano suono con A-O-U rispetto a E-I (casa, Paolo), confrontando coppie disegnate.\nAttività: giochiamo "oggetto del suono amico" con gli oggetti di casa.\nFonti: schede suoni duri e dolci per la prima classe.',
    description_en: 'Lesson: we discover that C and G change sound with A-O-U compared to E-I (casa, Paolo), comparing drawn pairs.\nActivity: we play "friendly sound object" with objects at home.\nSources: hard and soft sound worksheets for first grade.',
    description_cs: 'Lekce: zjistíme, že C a G mění zvuk u A-O-U oproti E-I (casa, Paolo), a porovnáváme nakreslené dvojice.\nAktivita: hrajeme "předmět kamarádského zvuku" s předměty doma.\nZdroje: pracovní listy na tvrdé a měkké hlásky pro první třídu.',
    links: [],
  },
  {
    title: 'Consonanti Doppie in Festa',
    title_en: 'Double Consonants Party',
    title_cs: 'Slavnost zdvojených souhlásek',
    category: categories[0], milestone: 'Milestone III · Sillabe Chiuse e Gruppi', estimatedDuration: 12,
    description: 'Lezione: scopriamo che "pala" e "palla" sono diverse e allunghiamo la voce sulle doppie.\nAttività: battiamo le mani per ogni doppia (PAL - LA).\nFonti: coppie minime illustrate, schede sulle geminate.',
    description_en: 'Lesson: we discover that "pala" and "palla" are different and lengthen our voice on the double letters.\nActivity: we clap for each double (PAL - LA).\nSources: illustrated minimal pairs, geminate worksheets.',
    description_cs: 'Lekce: zjistíme, že "pala" a "palla" se liší, a prodlužujeme hlas u zdvojených písmen.\nAktivita: tleskáme na každou zdvojenou souhlásku (PAL - LA).\nZdroje: obrázkové minimální dvojice, pracovní listy na zdvojené souhlásky.',
    links: [],
  },

  // --- Milestone IV · Prime Parole Bisillabe (Dec) ---
  {
    title: 'Corsa alla Lettura di Parole Bisillabe',
    title_en: 'Reading Race for Two-Syllable Words',
    title_cs: 'Závod ve čtení dvouslabičných slov',
    category: categories[0], milestone: 'Milestone IV · Prime Parole Bisillabe', estimatedDuration: 15,
    description: 'Lezione: leggiamo parole di due sillabe alzando piano piano la velocità come una corsa a tappe.\nAttività: cambiamo il ritmo (lento-veloce-lento) mentre camminiamo.\nFonti: flash-card di parole bisillabe progressive.',
    description_en: 'Lesson: we read two-syllable words, slowly raising the speed like a stage race.\nActivity: we change the rhythm (slow-fast-slow) while walking.\nSources: progressive two-syllable flashcards.',
    description_cs: 'Lekce: čteme dvouslabičná slova a pomalu zvyšujeme rychlost jako v etapovém závodě.\nAktivita: při chůzi měníme rytmus (pomalu-rychle-pomalu).\nZdroje: postupné kartičky s dvouslabičnými slovy.',
    links: [],
  },
  {
    title: 'Parole che Vedo Sempre',
    title_en: 'Words I Always See',
    title_cs: 'Slova, která vidím pořád',
    category: categories[0], milestone: 'Milestone IV · Prime Parole Bisillabe', estimatedDuration: 12,
    description: 'Lezione: riconosciamo "d\'acchito" parole di uso frequentissimo (e, il, la, un, è, io) senza decodificare.\nAttività: le cerchiamo sulle etichette e nei libri.\nFonti: schedario di "parole servizio" ad alta frequenza.',
    description_en: 'Lesson: we recognise very frequent words at first glance (e, il, la, un, è, io) without decoding.\nActivity: we look for them on labels and in books.\nSources: a card file of high-frequency "service words".',
    description_cs: 'Lekce: poznáváme na první pohled velmi častá slova (e, il, la, un, è, io) bez hláskování.\nAktivita: hledáme je na etiketách a v knihách.\nZdroje: kartotéka vysoce frekventovaných "služebních slov".',
    links: [],
  },
  {
    title: 'La Prima Frase che Leggo',
    title_en: 'The First Sentence I Read',
    title_cs: 'První věta, kterou čtu',
    category: categories[2], milestone: 'Milestone IV · Prime Parole Bisillabe', estimatedDuration: 12,
    description: 'Lezione: leggiamo le primissime frasi di 3-4 parole con l\'aiuto delle immagini.\nAttività: la "frase del giorno" da leggere e illustrare.\nFonti: libricini "prima lettura" della biblioteca.',
    description_en: 'Lesson: we read the very first 3-4 word sentences with the help of pictures.\nActivity: the "sentence of the day" to read and illustrate.\nSources: "first reading" booklets from the library.',
    description_cs: 'Lekce: čteme úplně první věty o 3-4 slovech s pomocí obrázků.\nAktivita: "věta dne", kterou přečteme a nakreslíme.\nZdroje: knížečky "první čtení" z knihovny.',
    links: [],
  },

  // --- Milestone V · Scrittura (Jan) ---
  {
    title: 'Scrivo le Lettere nell\'Aria',
    title_en: 'I Write Letters in the Air',
    title_cs: 'Píšu písmena do vzduchu',
    category: categories[0], milestone: 'Milestone V · Scrittura', estimatedDuration: 15,
    description: 'Lezione: disegniamo le lettere nell\'aria e poi nella sabbia per sentire la direzione del tratto.\nAttività: scriviamo col dito nella farina, lettere arcobaleno.\nFonti: percorsi pre-grafici dello stampatello.',
    description_en: 'Lesson: we draw letters in the air and then in sand to feel the direction of the stroke.\nActivity: we write with a finger in flour, rainbow letters.\nSources: pre-writing paths for block capitals.',
    description_cs: 'Lekce: kreslíme písmena do vzduchu a pak do písku, abychom cítili směr tahu.\nAktivita: píšeme prstem do mouky, duhová písmena.\nZdroje: předpisové dráhy pro tiskací písmena.',
    links: [],
  },
  {
    title: 'Lettere Grandi e Piccole',
    title_en: 'Big and Small Letters',
    title_cs: 'Velká a malá písmena',
    category: categories[0], milestone: 'Milestone V · Scrittura', estimatedDuration: 12,
    description: 'Lezione: confrontiamo stampatello maiuscolo e minuscolo abbinando le coppie (A-a).\nAttività: memory delle lettere, ordinare le lettere del proprio nome.\nFonti: alfabetiere murale, flashcards.',
    description_en: 'Lesson: we compare capital and lower-case print letters, matching the pairs (A-a).\nActivity: letter memory, ordering the letters of our name.\nSources: wall alphabet, flashcards.',
    description_cs: 'Lekce: porovnáváme tiskací velká a malá písmena a přiřazujeme dvojice (A-a).\nAktivita: písmenkové pexeso, řazení písmen vlastního jména.\nZdroje: nástěnná abeceda, kartičky.',
    links: [],
  },
  {
    title: 'Dettato di Vocali e Sillabe',
    title_en: 'Vowel and Syllable Dictation',
    title_cs: 'Diktát samohlásek a slabik',
    category: categories[2], milestone: 'Milestone V · Scrittura', estimatedDuration: 12,
    description: 'Lezione: un gioco-dettato: dico una vocale o sillaba e il bambino la scrive senza guardare.\nAttività: solo poche voci brevi, come un gioco con punti.\nFonti: quaderno a rigatura grande.',
    description_en: 'Lesson: a dictation game: I say a vowel or syllable and the child writes it without looking.\nActivity: only a few short words, like a game with points.\nSources: a notebook with large ruling.',
    description_cs: 'Lekce: hra na diktát: řeknu samohlásku nebo slabiku a dítě ji napíše, aniž by se dívalo.\nAktivita: jen pár krátkých slov, jako hra s body.\nZdroje: sešit s velkou linkou.',
    links: [],
  },

  // --- Milestone VI · Articoli e Genere (Feb) ---
  {
    title: 'Gli Articoli: Il - Lo - La - Le',
    title_en: 'The Articles: Il - Lo - La - Le',
    title_cs: 'Členy: Il - Lo - La - Le',
    category: categories[0], milestone: 'Milestone VI · Articoli e Genere', estimatedDuration: 12,
    description: 'Lezione: accoppiamo un articolo a un nome (la mela, il lupo, lo zoo) scoprendo dove compare LO.\nAttività: a tavola "il pane, la mela...", la spesa a voce.\nFonti: giochi con le carte articolo + nome.',
    description_en: 'Lesson: we match an article to a noun (la mela, il lupo, lo zoo), discovering where LO appears.\nActivity: at the table "il pane, la mela...", shopping aloud.\nSources: article + noun card games.',
    description_cs: 'Lekce: přiřazujeme člen k podstatnému jménu (la mela, il lupo, lo zoo) a zjišťujeme, kde se objevuje LO.\nAktivita: u stolu "il pane, la mela...", nákup nahlas.\nZdroje: hry s kartami člen + podstatné jméno.',
    links: [],
  },
  {
    title: 'Maschile o Femminile?',
    title_en: 'Masculine or Feminine?',
    title_cs: 'Mužský nebo ženský rod?',
    category: categories[0], milestone: 'Milestone VI · Articoli e Genere', estimatedDuration: 15,
    description: 'Lezione: scopriamo il genere guardando le parole (il/la) con tanti esempi, senza regole difficili.\nAttività: caccia all\'articolo in casa, "il pupazzo che dice il-la".\nFonti: giochi con immagini che abbiano il/la.',
    description_en: 'Lesson: we discover gender by looking at the words (il/la) with many examples, without difficult rules.\nActivity: an article hunt at home, "the puppet that says il-la".\nSources: games with pictures pairing il/la.',
    description_cs: 'Lekce: zjišťujeme rod podle slov (il/la) na mnoha příkladech, bez složitých pravidel.\nAktivita: lov na členy po domě, "loutka, která říká il-la".\nZdroje: hry s obrázky spojující il/la.',
    links: [],
  },
  {
    title: 'Indovino del Genere',
    title_en: 'Gender Guessing Game',
    title_cs: 'Hádání rodu',
    category: categories[0], milestone: 'Milestone VI · Articoli e Genere', estimatedDuration: 10,
    description: 'Lezione: un gioco "io dico LA, tu trovi un nome femminile" e viceversa.\nAttività: giochi di rime sul genere (il pane, la mamma, lo zio).\nPiano: l\'obiettivo è il gioco, non la regola perfetta.',
    description_en: 'Lesson: a game "I say LA, you find a feminine noun" and the other way round.\nActivity: gender rhymes (il pane, la mamma, lo zio).\nPlan: the goal is the game, not the perfect rule.',
    description_cs: 'Lekce: hra "řeknu LA, ty najdeš ženské podstatné jméno" a naopak.\nAktivita: říkanky o rodu (il pane, la mamma, lo zio).\nPlán: cílem je hra, ne dokonalé pravidlo.',
    links: [],
  },

  // --- Milestone VII · Singolare/Plurale e Frase (Mar) ---
  {
    title: 'Uno e Tanti',
    title_en: 'One and Many',
    title_cs: 'Jeden a mnoho',
    category: categories[0], milestone: 'Milestone VII · Singolare/Plurale e Frase', estimatedDuration: 12,
    description: 'Lezione: uno/più (cane-cani, casa-case) con gesti e immagini che aggiungono.\nAttività: a tavola contiamo "un pane, tre pani" e cerchiamo il plurale.\nFonti: schede singolare/plurale per la prima classe.',
    description_en: 'Lesson: one/more (cane-cani, casa-case) with gestures and images that add.\nActivity: at the table we count "un pane, tre pani" and look for the plural.\nSources: singular/plural worksheets for first grade.',
    description_cs: 'Lekce: jeden/více (cane-cani, casa-case) s gesty a obrázky, které přidávají.\nAktivita: u stolu počítáme "un pane, tre pani" a hledáme množné číslo.\nZdroje: pracovní listy na jednotné a množné číslo pro první třídu.',
    links: [],
  },
  {
    title: 'La Frase Semplice: Chi fa?',
    title_en: 'The Simple Sentence: Who Does What?',
    title_cs: 'Jednoduchá věta: Kdo to dělá?',
    category: categories[0], milestone: 'Milestone VII · Singolare/Plurale e Frase', estimatedDuration: 15,
    description: 'Lezione: costruiamo la frase minima con chi (il gatto) e che cosa fa (dorme): "Il gatto dorme".\nAttività: drammatizziamo le frasi raccontando la giornata.\nFonti: immagini da abbinare per comporre frasi.',
    description_en: 'Lesson: we build the minimal sentence with who (il gatto) and what it does (dorme): "Il gatto dorme".\nActivity: we act out the sentences while telling the day.\nSources: images to match to compose sentences.',
    description_cs: 'Lekce: stavíme minimální větu s tím, kdo (il gatto) a co dělá (dorme): "Il gatto dorme".\nAktivita: dramatizujeme věty při vyprávění dne.\nZdroje: obrázky k přiřazení pro sestavení vět.',
    links: [],
  },

  // --- Milestone VIII · Verbi (Apr) ---
  {
    title: 'Sono e Ho: i Verbi Speciali',
    title_en: 'Sono and Ho: The Special Verbs',
    title_cs: 'Sono a Ho: zvláštní slovesa',
    category: categories[0], milestone: 'Milestone VIII · Verbi', estimatedDuration: 15,
    description: 'Lezione: usiamo essere e avere in prima persona ("io sono", "io ho") e alla terza ("lui è", "lei ha").\nAttività: gioco "io ho... e tu?" a passeggio e a tavola.\nFonti: carta dei pronomi personali.',
    description_en: 'Lesson: we use essere and avere in the first person ("io sono", "io ho") and the third ("lui è", "lei ha").\nActivity: a game "io ho... e tu?" on walks and at the table.\nSources: a personal pronouns card.',
    description_cs: 'Lekce: používáme essere a avere v první osobě ("io sono", "io ho") a ve třetí ("lui è", "lei ha").\nAktivita: hra "io ho... e tu?" na procházkách a u stolu.\nZdroje: karta osobních zájmen.',
    links: [],
  },
  {
    title: 'I Verbi in -are: correre, cantare, giocare',
    title_en: '-are Verbs: correre, cantare, giocare',
    title_cs: 'Slovesa na -are: correre, cantare, giocare',
    category: categories[2], milestone: 'Milestone VIII · Verbi', estimatedDuration: 12,
    description: 'Lezione: coniughiamo verbi comuni in -are (io gioco, tu giochi, lui gioca) muovendo il corpo.\nAttività: mimiamo il significato di ogni verbo mentre lo diciamo.\nFonti: fogli di coniugazione illustrati per bambini.',
    description_en: 'Lesson: we conjugate common -are verbs (io gioco, tu giochi, lui gioca) while moving our body.\nActivity: we mime the meaning of each verb as we say it.\nSources: illustrated conjugation sheets for children.',
    description_cs: 'Lekce: časujeme běžná slovesa na -are (io gioco, tu giochi, lui gioca) a přitom pohybujeme tělem.\nAktivita: mimicky ztvárníme význam každého slovesa, když ho vyslovíme.\nZdroje: obrázkové listy s časováním pro děti.',
    links: [],
  },

  // --- Milestone IX · Lettura e Comprensione (May) ---
  {
    title: 'Leggo e Disegno la Storia',
    title_en: 'I Read and Draw the Story',
    title_cs: 'Čtu a kreslím příběh',
    category: categories[0], milestone: 'Milestone IX · Lettura e Comprensione', estimatedDuration: 15,
    description: 'Lezione: leggiamo un piccolissimo testo e ne disegniamo i personaggi, capire senza test.\nAttività: i disegni diventano una mostra di famiglia.\nFonti: primi libri "io leggo da solo".',
    description_en: 'Lesson: we read a tiny text and draw its characters, understanding without tests.\nActivity: the drawings become a family exhibition.\nSources: first "I read alone" books.',
    description_cs: 'Lekce: čteme malinký text a kreslíme jeho postavy, rozumíme bez testů.\nAktivita: kresby se stanou rodinnou výstavou.\nZdroje: první knížky "čtu sám".',
    links: [],
  },
  {
    title: 'Le Tre Domande della Storia',
    title_en: 'The Three Questions of the Story',
    title_cs: 'Tři otázky o příběhu',
    category: categories[2], milestone: 'Milestone IX · Lettura e Comprensione', estimatedDuration: 12,
    description: 'Lezione: dopo la lettura rispondiamo a chi? che cosa? dove?\nAttività: lasciamo che sia anche lui a fare domande.\nPiano: semplici domande di comprensione degli eventi.',
    description_en: 'Lesson: after reading we answer chi? che cosa? dove?\nActivity: we also let him ask questions.\nPlan: simple comprehension questions about the events.',
    description_cs: 'Lekce: po čtení odpovídáme na chi? che cosa? dove?\nAktivita: necháme i jeho klást otázky.\nPlán: jednoduché otázky na porozumění událostem.',
    links: [],
  },
  {
    title: 'La Scatola delle Storie',
    title_en: 'The Story Box',
    title_cs: 'Krabice příběhů',
    category: categories[0], milestone: 'Milestone IX · Lettura e Comprensione', estimatedDuration: 15,
    description: 'Lezione: tiriamo a sorte 3 elementi (chi/dove/oggetto) e inventiamo la nostra storia in due.\nAttività: la registriamo e la riascoltiamo la sera.\nFonti: scatola con carte a scenari e personaggi.',
    description_en: 'Lesson: we draw 3 elements by lot (who/where/object) and invent our story together.\nActivity: we record it and listen to it again in the evening.\nSources: a box with scenario and character cards.',
    description_cs: 'Lekce: losujeme 3 prvky (kdo/kde/předmět) a společně vymyslíme vlastní příběh.\nAktivita: nahráváme si ho a večer si ho znovu poslechneme.\nZdroje: krabice s kartami scén a postav.',
    links: [],
  },

  // --- Milestone X · Revisione e Librino (Jun) ---
  {
    title: 'Il Mio Librino: progetto dell\'anno',
    title_en: 'My Little Book: Project of the Year',
    title_cs: 'Moje knížečka: projekt roku',
    category: categories[4], milestone: 'Milestone X · Revisione e Librino', estimatedDuration: 30,
    description: 'Lezione: durante l\'anno raccogliamo parole, disegni e piccole storie per rilegare un libretto personale.\nAttività: è il prodotto conclusivo delle parole imparate.\nFonti: cartellino, spillatrice, tasca per i disegni.',
    description_en: 'Lesson: during the year we collect words, drawings and little stories to bind into a personal booklet.\nActivity: it is the final product of the words learned.\nSources: card, stapler, a pocket for drawings.',
    description_cs: 'Lekce: během roku sbíráme slova, kresby a malé příběhy, abychom svázali osobní knížečku.\nAktivita: je to závěrečný produkt naučených slov.\nZdroje: tvrdý papír, sešívačka, kapsa na kresby.',
    links: [],
  },
  {
    title: 'Giochi di Revisione dell\'anno',
    title_en: 'End-of-Year Review Games',
    title_cs: 'Závěrečné opakovací hry',
    category: categories[0], milestone: 'Milestone X · Revisione e Librino', estimatedDuration: 15,
    description: 'Lezione: giochi di ripasso (indovina la sillaba, cerchia le parole, con fiducia) con fiducia.\nAttività: "quante parole so oggi?" crescente checklist felice.\nPiano: l\'obiettivo è il divertimento.',
    description_en: 'Lesson: review games (guess the syllable, circle the words) with confidence.\nActivity: a growing happy checklist "how many words do I know today?".\nPlan: the goal is fun.',
    description_cs: 'Lekce: opakovací hry (uhodni slabiku, zakroužkuj slova) s důvěrou.\nAktivita: rostoucí veselý seznam "kolik slov dnes umím?".\nPlán: cílem je zábava.',
    links: [],
  },
  {
    title: 'Festa delle Parole',
    title_en: 'Word Party',
    title_cs: 'Slavnost slov',
    category: categories[1], milestone: 'Milestone X · Revisione e Librino', estimatedDuration: 20,
    description: 'Lezione: una piccola festa di fine anno con parole, piccoli cibi e una mostra del libretto.\nAttività: invitiamo la famiglia ad ascoltare le nostre parole.\nFonti: ricette italiane semplici da preparare insieme.',
    description_en: 'Lesson: a small end-of-year party with words, little snacks and a booklet exhibition.\nActivity: we invite the family to listen to our words.\nSources: simple Italian recipes to prepare together.',
    description_cs: 'Lekce: malá slavnost na konci roku se slovy, malým občerstvením a výstavou knížeček.\nAktivita: pozveme rodinu, aby si poslechla naše slova.\nZdroje: jednoduché italské recepty k přípravě společně.',
    links: [],
  },
];

async function createUserIfMissing(email, password, role) {
  const hash = await bcrypt.hash(password, 10);
  const [user] = await User.findOrCreate({ where: { email }, defaults: { email, passwordHash: hash, role, active: true } });
  return user;
}

async function upsertTheme(userId, t) {
  const [theme] = await Theme.findOrCreate({
    where: { name: t.name, userId },
    defaults: {
      name: t.name, name_en: t.name_en, name_cs: t.name_cs, name_it: t.name_it,
      description: t.description, description_en: t.description_en, description_cs: t.description_cs, description_it: t.description_it,
      startDate: t.startDate, endDate: t.endDate, userId,
    },
  });
  await theme.update({
    name_en: t.name_en, name_cs: t.name_cs, name_it: t.name_it,
    description: t.description, description_en: t.description_en, description_cs: t.description_cs, description_it: t.description_it,
    startDate: t.startDate, endDate: t.endDate,
  });
  return theme;
}

async function upsertActivity(userId, tmpl, themeId = null) {
  const [activity] = await Activity.findOrCreate({
    where: { title: tmpl.title, userId },
    defaults: {
      title: tmpl.title, title_en: tmpl.title_en, title_cs: tmpl.title_cs, title_it: tmpl.title_it,
      category: tmpl.category,
      description: tmpl.description,
      description_en: tmpl.description_en, description_cs: tmpl.description_cs, description_it: tmpl.description_it,
      estimatedDuration: tmpl.estimatedDuration,
      links: tmpl.links || [],
      themeId,
      userId,
    },
  });
  await activity.update({
    title_en: tmpl.title_en, title_cs: tmpl.title_cs, title_it: tmpl.title_it,
    category: tmpl.category,
    description: tmpl.description,
    description_en: tmpl.description_en, description_cs: tmpl.description_cs, description_it: tmpl.description_it,
    estimatedDuration: tmpl.estimatedDuration,
    links: tmpl.links || [],
    themeId,
  });
  return activity;
}

async function seedCurriculum(parent) {
  const themes = {};
  for (const t of curriculumThemes) {
    const theme = await upsertTheme(parent.id, t);
    themes[t.name] = theme;
  }

  const byTitle = {};
  for (const tmpl of curriculumTemplates) {
    const theme = tmpl.milestone ? themes[tmpl.milestone] : null;
    const activity = await upsertActivity(parent.id, tmpl, theme ? theme.id : null);
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
    const theme = await upsertTheme(parent.id, { ...t, startDate: '2026-09-01', endDate: '2026-09-30' });
    themes[t.name] = theme;
  }

  for (const tmpl of templates) {
    await upsertActivity(parent.id, tmpl);
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