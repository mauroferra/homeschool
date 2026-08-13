import bcrypt from 'bcryptjs';
import { User, Activity, Theme, Week, ActivityInstance, ExternalActivityType } from '../../src/db/models/index.js';
import { categories, blockTypes, categoryToBlockType } from '../../src/utils/constants.js';

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
    startTime: '17:30',
    endTime: '18:00',
    links: ['https://example.com/story-books'],
  },
  {
    title: 'Italian Breakfast Ritual',
    title_it: 'Colazione italiana',
    title_cs: 'Italský rituál snidaně',
    category: categories[3],
    description: 'Share a simple Italian breakfast and name the foods in Italian.',
    description_it: 'Condividete una semplice colazione italiana e nominate i cibi in italiano.',
    description_cs: 'Sdílejte jednoduchou italskou snidan a pojmenujte jídlo italsky.',
    estimatedDuration: 15,
    startTime: '08:00',
    endTime: '08:30',
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
    title_it: 'Mimo delle forme di pasta',
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
    description_it: 'Esercitati a contare fino a dieci in ceco e in italiano durante una passeggiata.',
    description_cs: 'Za procházky si procvičte počítání do deseti česky a italsky.',
    estimatedDuration: 15,
  },
  {
    title: 'Evening Check-in Cuddle',
    title_it: 'Coccola serale',
    title_cs: 'Večerní objetí a check-in',
    category: categories[3],
    description: 'Five minutes of calm, one thing each that was good today.',
    description_it: 'Cinque minuti di calma e una cosa bella di oggi per ciascuno.',
    description_cs: 'Pět minut klidu, každý řekne jednu dobrou věc, která se dnes stala.',
    estimatedDuration: 5,
    startTime: '19:00',
    endTime: '19:10',
  },
  {
    title: 'Cartoon Dubbing',
    title_it: 'Doppiaggio di cartoni',
    title_cs: 'Dabing k pohádce',
    category: categories[0],
    description: 'Watch a short cartoon segment and repeat a favourite line.',
    description_it: 'Guarda un cartone animato e ripeti una battuta che ti è piaciuta.',
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

// Monthly theme planning (issue #12). Mirrors the three September themes
// (Italian Cities, Italian Foods, Italian Holidays): one theme per cultural
// area, with English as the base name/description and explicit Czech/Italian
// translations. Each month of the seeded year after September gets 2-3 themes.
const monthlyThemes = [
  // --- October 2026 · Milestone II · Sillabe Aperte ---
  {
    name: 'Autumn Colours', name_cs: 'Podzimní barvy', name_it: 'I colori dell’autunno',
    description: 'Leaves turn red, orange and yellow; collect them and name the colours in Italian.',
    description_cs: 'Listí se barví do červena, oranžova a do žluta; sbírejte je a pojmenujte barvy italsky.',
    description_it: 'Le foglie diventano rosse, arancioni e gialle; raccogli e dai un nome ai colori in italiano.',
    startDate: '2026-10-01', endDate: '2026-10-31',
  },
  {
    name: 'The Harvest', name_cs: 'Sklizeň', name_it: 'La raccolta',
    description: 'Grapes, apples, chestnuts and pumpkins — autumn foods and their Italian names.',
    description_cs: 'Hrozny, jablka, kaštany a dýně — podzimní plodiny a jejich italské názvy.',
    description_it: 'Uva, mele, castagne e zucche — i cibi dell’autunno e i loro nomi italiani.',
    startDate: '2026-10-01', endDate: '2026-10-31',
  },
  {
    name: 'My Family', name_cs: 'Moje rodina', name_it: 'La mia famiglia',
    description: 'Mother, father, grandparents and cousins — name everyone in Italian and Czech.',
    description_cs: 'Máma, táta, prarodiče a bratranci — pojmenujte všechny italsky a česky.',
    description_it: 'Mamma, papà, nonni e cugini — chiama tutti per nome in italiano e in ceco.',
    startDate: '2026-10-01', endDate: '2026-10-31',
  },

  // --- November 2026 · Milestone III · Sillabe Chiuse e Gruppi ---
  {
    name: 'Remembering and Candles', name_cs: 'Vzpomínky a svíčky', name_it: 'Ricordi e candele',
    description: 'At the start of November we remember family; light a candle and share a memory in Italian.',
    description_cs: 'Na začátku listopadu vzpomínáme na rodinu; zapalte svíčku a podělte se o vzpomínku italsky.',
    description_it: 'Ai primi di novembre ricordiamo i familiari; accendi una candela e condividi un ricordo in italiano.',
    startDate: '2026-11-01', endDate: '2026-11-30',
  },
  {
    name: 'The Farm', name_cs: 'Statek', name_it: 'La fattoria',
    description: 'Farm animals and their sounds — cow, pig, hen, horse — in Italian and Czech.',
    description_cs: 'Zvířata na statku a jejich zvuky — kráva, prase, slepice, kůň — italsky a česky.',
    description_it: 'Gli animali della fattoria e i loro versi — mucca, maiale, gallina, cavallo — in italiano e in ceco.',
    startDate: '2026-11-01', endDate: '2026-11-30',
  },
  {
    name: 'Rainy Days', name_cs: 'Deštivé dny', name_it: 'Giorni di pioggia',
    description: 'Umbrella, boots and raincoat — weather and clothing words for rainy days.',
    description_cs: 'Deštník, holínky a pláštěnka — slova o počasí a oblečení pro deštivé dny.',
    description_it: 'Ombrello, stivali e impermeabile — parole di meteo e vestiti per i giorni di pioggia.',
    startDate: '2026-11-01', endDate: '2026-11-30',
  },

  // --- December 2026 · Milestone IV · Prime Parole Bisillabe ---
  {
    name: 'Christmas in Italy', name_cs: 'Vánoce v Itálii', name_it: 'Natale in Italia',
    description: 'The tree, the crib and the stockings — Italian Christmas words and traditions.',
    description_cs: 'Stromeček, betlém a punčochy — italská vánoční slova a tradice.',
    description_it: 'L’albero, il presepe e le calze — parole e tradizioni del Natale italiano.',
    startDate: '2026-12-01', endDate: '2026-12-23',
  },
  {
    name: 'Winter Words', name_cs: 'Zimní slova', name_it: 'Parole d’inverno',
    description: 'Snow, ice, scarf and gloves — winter words to use on cold walks.',
    description_cs: 'Sníh, led, šála a rukavice — zimní slova pro procházky v mrazu.',
    description_it: 'Neve, ghiaccio, sciarpa e guanti — parole d’inverno per le passeggiate al freddo.',
    startDate: '2026-12-01', endDate: '2026-12-23',
  },
  {
    name: 'Gifts and Kindness', name_cs: 'Dárky a laskavost', name_it: 'Regali e gentilezza',
    description: 'Giving and receiving — words for gifts and kind gestures during the holidays.',
    description_cs: 'Dávat a dostávat — slova pro dárky a laskavá gesta během svátků.',
    description_it: 'Dare e ricevere — parole per i regali e i gesti gentili durante le feste.',
    startDate: '2026-12-01', endDate: '2026-12-23',
  },

  // --- January 2027 · Milestone V · Scrittura ---
  {
    name: 'Befana and Epiphany', name_cs: 'Befana a Tři králové', name_it: 'La Befana e l’Epifania',
    description: 'On 6 January the Befana brings gifts; tell the rhyme and look for the stocking.',
    description_cs: '6. ledna přináší dárky Befana; převyprávějte říkadlo a hledejte punčošku.',
    description_it: 'Il 6 gennaio arriva la Befana con i doni; racconta la filastrocca e cerca la calza.',
    startDate: '2027-01-07', endDate: '2027-01-31',
  },
  {
    name: 'Winter Games', name_cs: 'Zimní hry', name_it: 'Giochi d’inverno',
    description: 'Sledging, snowballs and ice — play outside and name the games in Italian.',
    description_cs: 'Sáňky, sněhové koule a led — hrajte si venku a pojmenujte hry italsky.',
    description_it: 'Slitta, palle di neve e ghiaccio — gioca all’aperto e dai un nome ai giochi in italiano.',
    startDate: '2027-01-07', endDate: '2027-01-31',
  },
  {
    name: 'The Months of the Year', name_cs: 'Měsíce v roce', name_it: 'I mesi dell’anno',
    description: 'Twelve months, four seasons — learn the names of the months in Italian and Czech.',
    description_cs: 'Dvanáct měsíců, čtyři roční období — naučte se názvy měsíců italsky a česky.',
    description_it: 'Dodici mesi, quattro stagioni — impara i nomi dei mesi in italiano e in ceco.',
    startDate: '2027-01-07', endDate: '2027-01-31',
  },

  // --- February 2027 · Milestone VI · Articoli e Genere ---
  {
    name: 'Carnival of Masks', name_cs: 'Karneval masek', name_it: 'Carnevale delle maschere',
    description: 'Arlecchino, Colombina and homemade masks — the colours and words of Carnival.',
    description_cs: 'Arlecchino, Colombina a masky vyrobené doma — barvy a slova karnevalu.',
    description_it: 'Arlecchino, Colombina e maschere fatte in casa — i colori e le parole del Carnevale.',
    startDate: '2027-02-01', endDate: '2027-02-28',
  },
  {
    name: 'Words of Friendship', name_cs: 'Slova přátelství', name_it: 'Parole dell’amicizia',
    description: 'Friend, thank you, sharing — kind words to say and to write this month.',
    description_cs: 'Přítel, děkuji, sdílení — laskavá slova, která tento měsíc vyslovíme a napíšeme.',
    description_it: 'Amico, grazie, condividere — parole gentili da dire e scrivere questo mese.',
    startDate: '2027-02-01', endDate: '2027-02-28',
  },
  {
    name: 'From Winter to Spring', name_cs: 'Od zimy k jaru', name_it: 'Dall’inverno alla primavera',
    description: 'The days get longer; notice the first signs of spring and give them a name.',
    description_cs: 'Dny se prodlužují; všímejte si prvních jarních znamení a pojmenujte je.',
    description_it: 'Le giornate si allungano; osserva i primi segni della primavera e dai loro un nome.',
    startDate: '2027-02-01', endDate: '2027-02-28',
  },

  // --- March 2027 · Milestone VII · Singolare/Plurale e Frase ---
  {
    name: 'Fathers Day', name_cs: 'Den otců', name_it: 'La festa del papà',
    description: 'On 19 March Italy celebrates fathers; make a card with a sentence for dad.',
    description_cs: '19. března se v Itálii slaví Den otců; vyrobte pro tátu kartičku s větou.',
    description_it: 'Il 19 marzo in Italia si festeggia il papà; prepara un biglietto con una frase per lui.',
    startDate: '2027-03-01', endDate: '2027-03-31',
  },
  {
    name: 'Spring Is Coming', name_cs: 'Přichází jaro', name_it: 'Arriva la primavera',
    description: 'Flowers, birds and longer walks — spring words for the first warm days.',
    description_cs: 'Květiny, ptáci a delší procházky — jarní slova pro první teplé dny.',
    description_it: 'Fiori, uccelli e passeggiate più lunghe — parole di primavera per i primi giorni caldi.',
    startDate: '2027-03-01', endDate: '2027-03-31',
  },
  {
    name: 'The Garden in March', name_cs: 'Březnová zahrádka', name_it: 'L’orto di marzo',
    description: 'Plant a seed and watch it grow; name the vegetables in Italian and Czech.',
    description_cs: 'Zasaďte semínko a sledujte, jak roste; pojmenujte zeleninu italsky a česky.',
    description_it: 'Pianta un seme e guardalo crescere; dai un nome agli ortaggi in italiano e in ceco.',
    startDate: '2027-03-01', endDate: '2027-03-31',
  },

  // --- April 2027 · Milestone VIII · Verbi ---
  {
    name: 'Easter', name_cs: 'Velikonoce', name_it: 'La Pasqua',
    description: 'Eggs, the basket and the Easter bunny — hunt for paper eggs while speaking Italian.',
    description_cs: 'Vejce, košíček a velikonoční zajíček — hledejte papírová vejce a mluvte italsky.',
    description_it: 'Uova, cestino e coniglietto — cerca uova di carta parlando in italiano.',
    startDate: '2027-04-01', endDate: '2027-04-30',
  },
  {
    name: 'Spring Flowers', name_cs: 'Jarní květiny', name_it: 'I fiori di primavera',
    description: 'Tulips, daisies and the first flowers of the balcony and the garden.',
    description_cs: 'Tulipány, sedmikrásky a první květiny na balkoně i na zahradě.',
    description_it: 'Tulipani, margherite e i primi fiori di balcone e di giardino.',
    startDate: '2027-04-01', endDate: '2027-04-30',
  },
  {
    name: 'Italy in April', name_cs: 'Itálie v dubnu', name_it: 'L’Italia ad aprile',
    description: 'Spring holidays and celebrations across Italy, from the south to the north.',
    description_cs: 'Jarní svátky a oslavy v Itálii, od jihu k severu.',
    description_it: 'Feste e celebrazioni di primavera in Italia, dal sud al nord.',
    startDate: '2027-04-01', endDate: '2027-04-30',
  },

  // --- May 2027 · Milestone IX · Lettura e Comprensione ---
  {
    name: 'Mothers Day', name_cs: 'Den matek', name_it: 'La festa della mamma',
    description: 'In May we celebrate mothers; prepare a bouquet of words for mamma.',
    description_cs: 'V květnu slavíme Den matek; připravte pro maminku kytici slov.',
    description_it: 'A maggio si festeggia la mamma; prepara un mazzo di parole per lei.',
    startDate: '2027-05-01', endDate: '2027-05-31',
  },
  {
    name: 'Nature and the Garden', name_cs: 'Příroda a zahrada', name_it: 'La natura e il giardino',
    description: 'Insects, flowers and plants — discover nature and give it a name in Italian.',
    description_cs: 'Hmyz, květiny a rostliny — objevujte přírodu a pojmenujte ji italsky.',
    description_it: 'Insetti, fiori e piante — scopri la natura e dai un nome in italiano.',
    startDate: '2027-05-01', endDate: '2027-05-31',
  },
  {
    name: 'The Sea and the Beach', name_cs: 'Moře a pláž', name_it: 'Il mare e la spiaggia',
    description: 'Shells, sand and the sea — summer holiday words to dream about early.',
    description_cs: 'Mušle, písek a moře — slova o letních prázdninách, o kterých si budeme zdát.',
    description_it: 'Conchiglie, sabbia e mare — parole di vacanza estiva per sognare in anticipo.',
    startDate: '2027-05-01', endDate: '2027-05-31',
  },

  // --- June 2027 · Milestone X · Revisione e Libretto ---
  {
    name: 'Summer Is Here', name_cs: 'Přišlo léto', name_it: 'Ecco l’estate',
    description: 'The sun, the sea and the gelato — welcome summer with Italian words.',
    description_cs: 'Slunce, moře a zmrzlina — přivítejte léto italskými slovy.',
    description_it: 'Sole, mare e gelato — accogli l’estate con le parole italiane.',
    startDate: '2027-06-01', endDate: '2027-06-30',
  },
  {
    name: 'Travelling in Italy', name_cs: 'Cestování po Itálii', name_it: 'Viaggiare in Italia',
    description: 'By train, by car or on foot — travel words for a summer trip.',
    description_cs: 'Vlakem, autem nebo pěšky — cestovní slova pro letní výlet.',
    description_it: 'In treno, in macchina o a piedi — parole di viaggio per una gita estiva.',
    startDate: '2027-06-01', endDate: '2027-06-30',
  },
  {
    name: 'My Book of Words', name_cs: 'Moje knížečka slov', name_it: 'Il mio libretto delle parole',
    description: 'Collect the best words of the year into the little book — the final project.',
    description_cs: 'Sesbírejte nejhezčí slova roku do knížečky — závěrečný projekt.',
    description_it: 'Raccogli le parole più belle dell’anno nel libretto — il progetto finale.',
    startDate: '2027-06-01', endDate: '2027-06-30',
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
    name: 'Milestone X · Revisione e Libretto',
    name_en: 'Milestone X · Revision and Little Book',
    name_cs: 'Milestone X · Opakování a knížka',
    description: 'Consolidare l’anno con giochi di ripasso e realizzare un librino personale ("il mio librino").',
    description_en: 'Consolidate the year with review games and assemble a personal mini-book (“il mio librino”).',
    description_cs: 'Upevnit celý rok opakovacími hrami a sestavit osobní mini-knížku („il mio librino“).',
    startDate: '2027-06-01', endDate: '2027-06-30',
  },
  {
    name: 'Ponteggio 2026 · Ritorno in Italiano',
    name_en: 'August 2026 · Getting Ready in Italian',
    name_cs: 'Srpen 2026 · Návrat k italštině',
    description: 'Ponte leggero di agosto: riprendiamo vocali, sillabe e parole amiche, così il primo giorno di elementare potrai partirmi tranquillo.',
    description_en: 'A light August bridge: we pick up vowels, sounds and friendly words again, so you can start first grade relaxed.',
    description_cs: 'Lehký srpnový most: vrátíme se k samohláskám, hláskám a přátelským slovům, abys do první třídy vstoupil v klidu.',
    startDate: '2026-08-01', endDate: '2026-08-31',
  },
  {
    name: 'Estate delle Parole 2027',
    name_en: 'Summer of Words 2027',
    name_cs: 'Léto slov 2027',
    description: 'Ponte estivo: tenere vivo l’italiano con giochi, canzonette, gelato, storie e una piccola passeggiata ogni settimana. Niente stress, solo piacere.',
    description_en: 'Summer bridge: keep Italian alive with games, little songs, gelato, stories and a short walk each week. No stress, only pleasure.',
    description_cs: 'Letní mostíček: udržet italštinu při životě hrou, písničkami, zmrzlinou, příběhy a malou procházkou každý týden. Bez tlaku, jen s radostí.',
    startDate: '2027-07-01', endDate: '2027-08-31',
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

  // --- Seasonal and cultural tangents (woven into the milestones) ---
  {
    title: 'L\'Ognissanti e i Colori dell\'Autunno',
    title_en: 'All Saints Day and Autumn Colours',
    title_cs: 'Dušičky a podzimní barvy',
    category: categories[1], milestone: 'Milestone III · Sillabe Chiuse e Gruppi', estimatedDuration: 12,
    description: 'Lezione: il primo novembre si celebra l\'Ognissanti; ricordiamo i nonni e la famiglia e proviamo le sillabe delle parole dell\'autunno (mel-la, pe-so, mon-ta-gna).\nAttività: raccolta di foglie e castagne: ogni cosa ha un colore e un nome in italiano.\nFonti: parole dell\'autunno illustrate.',
    description_en: 'Lesson: on 1 November we talk about All Saints Day and remember family; we try the closed syllables of autumn words (mel-la, pe-so, mon-ta-gna).\nActivity: collect leaves and chestnuts; everything has an Italian colour and name.\nSources: illustrated autumn words.',
    description_cs: 'Lekce: 1. listopadu si připomínáme Dušičky a rodinu; zkoušíme zavřené slabiky podzimních slov (mel-la, pe-so, mon-ta-gna).\nAktivita: sbírejme listí a kaštany; všechno má italskou barvu a název.\nZdroje: obrázková slova podzimu.',
    links: [],
  },
  {
    title: 'Natale di parole',
    title_en: 'A Christmas of Words',
    title_cs: 'Vánoce slov',
    category: categories[1], milestone: 'Milestone IV · Prime Parole Bisillabe', estimatedDuration: 15,
    description: 'Lezione: giochiamo con le parole del Natale: albero, stella, regalo, nonna — e aggiungiamo sempre l\'articolo giusto (lo, la, il).\nAttività: appendiamo le parole all\'immagine dell\'albero e ogni giorno scopriamo una parola nuova.\nFonti: il calendario dell\'avvento delle parole.',
    description_en: 'Lesson: we play with Christmas words: albero, stella, regalo, nonna — and we always add the right article (lo, la, il).\nActivity: we hang the words on the tree picture and discover one new word each day.\nSources: an advent calendar of words.',
    description_cs: 'Lekce: hrajeme si s vánočními slovy: albero, stella, regalo, nonna – a vždy přidáváme správný člen (lo, la, il).\nAktivita: zavěšujeme slova na obrázek stromečku a každý den objevíme nové slovo.\nZdroje: adventní kalendář slov.',
    links: [],
  },
  {
    title: 'La Befana porta le lettere',
    title_en: 'Befana Brings the Letters',
    title_cs: 'Befana přináší písmena',
    category: categories[0], milestone: 'Milestone V · Scrittura', estimatedDuration: 15,
    description: 'Lezione: raccontiamo la filastrocca "La Befana vien di notte" e scriviamo le lettere di BEFANA con il dito nell\'aria e nella sabbia.\nAttività: prepariamo la calza della Befana con i bigliettini delle lettere scritte.\nFonti: la filastrocca tradizionale della calza.',
    description_en: 'Lesson: we tell the rhyme "La BEFANA vien di notte" and write the letters of B-E-F-A-N-A in the air and in the sand.\nActivity: we fill the Befana stocking with the little letters we have written.\nSources: the traditional stocking rhyme.',
    description_cs: 'Lekce: vyprávíme tradiční říkadlo o Befaně a prstem píšeme písmena B-E-F-A-N-A ve vzduchu a v písku.\nAktivita: naplníme befánovu punčochu malými napsanými písmenky.\nZdroje: tradiční říkadlo o zimní návštěvě.',
    links: [],
  },
  {
    title: 'Carnevale delle maschere',
    title_en: 'Carnival of Masks',
    title_cs: 'Karneval masek',
    category: categories[1], milestone: 'Milestone VI · Articoli e Genere', estimatedDuration: 15,
    description: 'Lezione: Carnevale italiano: la maschera, il pagliaccio, la piuma e i personaggi Arlecchino e Colombina; giochiamo con gli articoli e i generi.\nAttività: creiamo una mascherina di casa e le diamo un nome con il suo articolo (la fata, il cavaliere).\nFonti: immagini delle masche tradizionali italiane.',
    description_en: 'Lesson: Italian Carnival: la maschera, il pagliaccio and the mask characters Arlecchino and Colombina; we play with articles and gender.\nActivity: we make a home mask and give it a name with its article (la fata, il cavaliere).\nSources: pictures of traditional Italian masks.',
    description_cs: 'Lekce: italský karnevel: la maschera, il pagliaccio a postavy Arlecchino a Colombina; hrajeme si se členy a rody.\nAktivita: vyrobíme si masku a dáme jí jméno s členem (la fata, il cavaliere).\nZdroje: obrázky tradičních italských masek.',
    links: [],
  },
  {
    title: 'La Festa del Papà',
    title_en: 'Fathers Day',
    title_cs: 'Den otců',
    category: categories[1], milestone: 'Milestone VII · Singolare/Plurale e Frase', estimatedDuration: 12,
    description: 'Lezione: il 19 marzo in Italia è la Festa del Papà; leggiamo e trasformiamo frasi semplici: "Il papà legge", "Il papà suona", "Il papà cucina".\nAttività: prepariamo un piccolo biglietto con la frase scritta e illustrata per papà.\nFonti: le foto di famiglia e la giostra delle frasi della giornata.',
    description_en: 'Lesson: on 19 March in Italy we celebrate Fathers Day; we read and change short sentences: "Il papà legge", "Il papà suona", "Il papà cucina".\nActivity: we make a small card with a written and illustrated sentence for dad.\nSources: family photos and sentence games.',
    description_cs: 'Lekce: 19. března se v Itálii oslavuje Den otců; čteme a měníme krátké věstky: "Il papà legge", "Il papà suona", "Il papà cucina".\nAktivita: vyrobíme kartičku s napsanou a obrázkovou větou pro tátu.\nZdroje: rodinné fotografie a věty ke hříčce.',
    links: [],
  },
  {
    title: 'Le Uova di Pasqua',
    title_en: 'The Easter Eggs',
    title_cs: 'Velikonoční vejce',
    category: categories[1], milestone: 'Milestone VII · Singolare/Plurale e Frase', estimatedDuration: 15,
    description: 'Lezione: a Pasqua cerchiamo le uova: un uovo, un cestino, tre uova, un coniglio; proviamo le frasi "Cerco l\'uovo!" e "Ho trovato l\'uovo!"\nAttività: mettiamo in giro per casa uova di carta con le lettere e le cerchiamo parlando in italiano.\nPiano: singolare, plurale e verbi in movimento.',
    description_en: 'Lesson: at Easter we look for eggs: un uovo, un cestino, tre uova, un coniglio; we try "Cerco l\'uovo!" and "Ho trovato l\'uovo!"\nActivity: we hide paper eggs around the house and find them while speaking Italian.\nPlan: singular, plural and verbs in motion.',
    description_cs: 'Lekce: o Velikonocích hledáme vejce: un uovo, un cestino, tre uova, un coniglio; zkoušíme věty "Cerco l\'uovo!" a "Ho trovato l\'uovo!"\nAktivita: schováváme po domě papírová vejce a hledáme je, přičemž mluvíme italsky.\nPlán: jednotné číslo, množné číslo a slovesa v pohybu.',
    links: [],
  },

  // --- Summer 2027 bridge templates ---
  {
    title: 'Il Gelato e l\'Estate',
    title_en: 'Ice Cream and Summer',
    title_cs: 'Zmrzlina a léto',
    category: categories[1], milestone: 'Estate delle Parole 2027', estimatedDuration: 12,
    description: 'Lezione: il gelato è italiano: la fragola, il limone, il cioccolato, il cono; al bar si dice "Un cono di fragola, per favore!"\nAttività: al chiosco o a casa diamo il nome al gelato in italiano e diciamo grazie.\nFonti: il piccolo menù del gelato.',
    description_en: 'Lesson: gelato is Italian: fragola, limone, cioccolato, cono; at the bar we order in Italian.\nActivity: at the kiosk or at home we order gelato in Italian and say thanks.\nSources: the gelato menu.',
    description_cs: 'Lekce: zmrzlina je italská: fragola, limone, cioccolato, cono; ve zmrzlinárně řekneme objednávku italsky.\nAktivita: u stánku nebo doma si objednáme zmrzlinu italsky a poděkujeme.\nZdroje: lístek zmrzlinárny.',
    links: [],
  },
  {
    title: 'Il Picnic Italiano',
    title_en: 'An Italian Picnic',
    title_cs: 'Italský piknik',
    category: categories[2], milestone: 'Estate delle Parole 2027', estimatedDuration: 20,
    description: 'Lezione: prepariamo il picnic: la mela, il pane, il formaggio, l\'acqua — ogni cibo ha un nome e un articolo.\nAttività: andiamo dal giardino al prato e proviamo a nominare le cose lungo il camino.\nFonti: la nostra cucina come vocabolario vivente.',
    description_en: 'Lesson: we prepare the picnic: la mela, il pane, il formaggio, l\'acqua — every food has a name and an article.\nActivity: we walk from the garden to the lawn and name things along the way in Italian.\nSources: the kitchen as a living vocabulary.',
    description_cs: 'Lekce: připravíme piknik: la mela, il pane, il formaggio, l\'acqua – každé jídlo má jméno a člen.\nAktivita: jdeme ze zahrady na louku a po cestě pojmenováváme věci italsky pojmenováváme věci italsky.\nZdroje: kuchyně jako živý slovníček.',
    links: [],
  },
{
    title: 'La Canzonetta Italiana',
    title_en: 'The Italian Little Song',
    title_cs: 'Italská písnička',
    category: categories[0], milestone: 'Estate delle Parole 2027', estimatedDuration: 10,
    description: 'Lezioni: cantiamo insieme una canzonetta corta in italiano (es. "Girotondo") e la animiamo con i gesti e il ritmo delle mani.\nAttività: la canzonetta della settimana si aggiunge al nostro libro dei canti.\nFonti: canzoni per bambini italiane (RaiPlay, YouTube Kids).',
    description_en: 'Lesson: we sing a short Italian song together (e.g. "Girotondo") and animate it with gestures and a hand beat.\nActivity: the song of the week goes into our family songbook.\nSources: Italian children\'s songs (RaiPlay, YouTube Kids).',
    description_cs: 'Lekce: zpíváme společně krátkou italskou písničku (např. "Girotondo") a doplníme ji gesty a rytmem.\nAktivita: píseň týdne si zavedeme do zpěvníčku.\nZdroje: italské dětské písně (RaiPlay, YouTube Kids).',
    links: ['https://www.raiplay.it'],
  },
];

// Weekend-specific activities — scheduled on Saturdays/Sundays so the
// weekend isn't just a gap in the curriculum. Base title/description are
// English; Italian and Czech translations are stored explicitly.
const weekendTemplates = [
  {
    title: 'Weekend Walk',
    title_it: 'Passeggiata del fine settimana',
    title_cs: 'Víkendová procházka',
    category: categories[1],
    description: 'A relaxed family walk; name everything you see in Italian (diagons: colours, shop signs, animals).',
    description_it: 'Una passeggiata tranquilla in famiglia; nomina in italiano quello che vedi (colori, insegne, animali).',
    description_cs: 'Poklidná rodinná procházka; pojmenuj italsky vše, co vidíš (barvy, vývěsní štíty, zvířata).',
    estimatedDuration: 20,
  },
  {
    title: 'Family Breakfast Ritual',
    title_it: 'Rituale della colazione in famiglia',
    title_cs: 'Rodinný rituál snidaně',
    category: categories[3],
    description: 'Slow weekend breakfast together; each person says one good thing to share in Italian.',
    description_it: 'Colazione lenta del weekend insieme; ognuno dice una cosa bella da condividere in italiano.',
    description_cs: 'Pomalá víkendová snidaně; každý řekne italsky jednu hezkou věc, kterou chce sdílet.',
    estimatedDuration: 15,
  },
  {
    title: 'Weekend Garden Hunt',
    title_it: 'Caccia nel giardino del weekend',
    title_cs: 'Víkendová zahradní honička',
    category: categories[0],
    description: 'Find things in the garden or street matching Italian colours and numbers.',
    description_it: 'Trova in giardino o per strada cose che corrispondono a colori e numeri in italiano.',
    description_cs: 'Najdi na zahradě nebo venku věci, které odpovídají italským barvám a číslům.',
    estimatedDuration: 15,
  },
  {
    title: 'Grandparents Video Call',
    title_it: 'Videochiamata con i nonni',
    title_cs: 'Videohovor s prarodiči',
    category: categories[2],
    description: 'A short video call with grandparents; show them one Italian word or story learned this week.',
    description_it: 'Una breve videochiamata con i nonni; mostra loro una parola o una storia italiana imparata questa settimana.',
    description_cs: 'Krátký videohovor s prarodiči; ukaž jim jedno italské slovo nebo příběh z tohoto týdne.',
    estimatedDuration: 10,
  },
  {
    title: 'Weekend Story Tents',
    title_it: 'Tenda di storie del weekend',
    title_cs: 'Víkendový stan plný příběhů',
    category: categories[0],
    description: 'Build a blanket fort and read or tell a short Italian story inside it.',
    description_it: 'Costruisci una tenda con le coperte e leggi o racconta al suo interno una breve storia in italiano.',
    description_cs: 'Postav stan z dek a uvnitř si přečti nebo vyprávěj krátký italský příběh.',
    estimatedDuration: 20,
  },
  {
    title: 'Lunch Table Words',
    title_it: 'Parole a tavola',
    title_cs: 'Slova u oběda',
    category: categories[1],
    description: 'At lunch at the weekend, name each dish and item on the table in Italian.',
    description_it: 'A pranzo nel weekend, nomina in italiano ogni piatto e oggetto sulla tavola.',
    description_cs: 'U víkendového oběda pojmenuj italsky každé jídlo a věc na stole.',
    estimatedDuration: 10,
  },
];

async function createUserIfMissing(email, password, role) {
  const hash = await bcrypt.hash(password, 10);
  const [user] = await User.findOrCreate({ where: { email }, defaults: { email, passwordHash: hash, role, active: true } });
  return user;
}

// Default externally-scheduled activity types (issue #7): swimming, speech
// therapy, physiotherapy. Add/rename/remove via the API afterwards.
const DEFAULT_EXTERNAL_TYPES = [
  { name: 'Swimming class', name_en: 'Swimming class', name_cs: 'Plavecký kurz', name_it: 'Corso di nuoto' },
  { name: 'Speech therapy', name_en: 'Speech therapy', name_cs: 'Logopedie', name_it: 'Logopedia' },
  { name: 'Physiotherapy', name_en: 'Physiotherapy', name_cs: 'Fyzioterapie', name_it: 'Fisioterapia' },
];

async function seedDefaultExternalTypes(userId) {
  for (const t of DEFAULT_EXTERNAL_TYPES) {
    const [type] = await ExternalActivityType.findOrCreate({
      where: { userId, name: t.name },
      defaults: { userId, name: t.name, nameEn: t.name_en, nameCs: t.name_cs, nameIt: t.name_it },
    });
    await type.update({ nameEn: t.name_en, nameCs: t.name_cs, nameIt: t.name_it });
  }
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
      startTime: tmpl.startTime ?? null,
      endTime: tmpl.endTime ?? null,
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
    startTime: tmpl.startTime,
    endTime: tmpl.endTime,
    links: tmpl.links || [],
    themeId,
  });
  return activity;
}

// ---------------------------------------------------------------------------
// Full-year scheduler. Per week (Monday start): Mon = main lesson, Tue =
// micro-immersion, Wed = Czech-school alignment, Thu = culture hook, Fri =
// extra immersion. Every weekend gets its own weekend-specific activities,
// and the evening cuddle (bonding ritual) rotates across the week so it does
// not always fall on Thursday.
// September keeps its handcrafted plan (enriched with weekends + rotating
// cuddle); Oct 2026 – Jun 2027 rotate each month's lesson templates; August
// 2026 and summer 2027 are light bridges that keep a weekend activity too.
// ---------------------------------------------------------------------------

const BONDING_RITUAL_TITLE = 'Evening Check-in Cuddle';

// Vary the cuddle day so it is not always Thursday (day 4 when zero-indexed
// Monday, i.e. JS day 3); the rotation also dips into the weekends.
const CUDDLE_DAYS = [3, 4, 5, 2, 6, 1, 0];

function bondingForWeek(weekIndex) {
  return { day: CUDDLE_DAYS[weekIndex % CUDDLE_DAYS.length], block: blockTypes.BONDING_RITUAL, title: BONDING_RITUAL_TITLE };
}

// Pools of demo/curriculum titles reused for the culture-hook (Thu), the
// Friday immersion slot and the weekend slots. All titles are guaranteed to
// exist in `byTitle` (they come from the base or curriculum templates).
const WEEKEND_TITLES = weekendTemplates.map((t) => t.title);

const CULTURE_HOOK_POOL = [
  'L\'Ognissanti e i Colori dell\'Autunno',
  'Natale di parole',
  'La Befana porta le lettere',
  'Carnevale delle maschere',
  'La Festa del Papà',
  'Le Uova di Pasqua',
  'Italian Storytime',
  'Pasta Shapes Charades',
  'Family Album Scrapbook',
];

const FRIDAY_IMMERSION_POOL = [
  'Colour Hunt',
  'Number Walk',
  'Cartoon Dubbing',
  'Italian Breakfast Ritual',
  'Rime e Filastrocche delle Vocali',
  'La Canzonetta Italiana',
];

// Core Tue/Wed rhythm used by the rotating academic months.
const WEEK_RHYTHM = [
  { day: 0, block: blockTypes.ITALIAN_CULTURAL_ACTIVITY },
  { day: 1, block: blockTypes.ITALIAN_MICRO_IMMERSION },
  { day: 2, block: blockTypes.CZECH_SCHOOL_ALIGNMENT },
];

// October 2026 → June 2027, Monday-start weeks per milestone (from the syllabus).
const MONTH_WEEK_STARTS = {
  'Milestone II · Sillabe Aperte': ['2026-09-28', '2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26'],
  'Milestone III · Sillabe Chiuse e Gruppi': ['2026-11-02', '2026-11-09', '2026-11-16', '2026-11-23'],
  'Milestone IV · Prime Parole Bisillabe': ['2026-11-30', '2026-12-07', '2026-12-14', '2026-12-21'],
  'Milestone V · Scrittura': ['2027-01-04', '2027-01-11', '2027-01-18', '2027-01-25'],
  'Milestone VI · Articoli e Genere': ['2027-02-01', '2027-02-08', '2027-02-15', '2027-02-22'],
  'Milestone VII · Singolare/Plurale e Frase': ['2027-03-01', '2027-03-08', '2027-03-15', '2027-03-22', '2027-03-29'],
  'Milestone VIII · Verbi': ['2027-04-05', '2027-04-12', '2027-04-19', '2027-04-26'],
  'Milestone IX · Lettura e Comprensione': ['2027-05-03', '2027-05-10', '2027-05-17', '2027-05-24'],
  'Milestone X · Revisione e Librino': ['2027-05-31', '2027-06-07', '2027-06-14', '2027-06-21', '2027-06-28'],
};

function rotatedWeeks(weekStartDates, titles) {
  const n = titles.length;
  const c = CULTURE_HOOK_POOL.length;
  const f = FRIDAY_IMMERSION_POOL.length;
  const w = WEEKEND_TITLES.length;
  return weekStartDates.map((startDate, wi) => {
    const plan = WEEK_RHYTHM.map((slot, si) => ({
      day: slot.day,
      block: slot.block,
      title: titles[(wi + si) % n],
    }));
    plan.push(
      { day: 3, block: blockTypes.ITALIAN_CULTURAL_ACTIVITY, title: CULTURE_HOOK_POOL[wi % c] },
      { day: 4, block: blockTypes.ITALIAN_MICRO_IMMERSION, title: FRIDAY_IMMERSION_POOL[wi % f] },
      { day: 5, block: blockTypes.ITALIAN_CULTURAL_ACTIVITY, title: WEEKEND_TITLES[(wi * 2) % w] },
      { day: 6, block: blockTypes.ITALIAN_MICRO_IMMERSION, title: WEEKEND_TITLES[(wi * 2 + 1) % w] },
      bondingForWeek(wi),
    );
    return { startDate, plan };
  });
}

function lightWeeks(weekStartDates, culturalTitles, immersionTitles) {
  const w = WEEKEND_TITLES.length;
  return weekStartDates.map((startDate, wi) => {
    const plan = [
      { day: 0, block: blockTypes.ITALIAN_CULTURAL_ACTIVITY, title: culturalTitles[wi % culturalTitles.length] },
      { day: 1, block: blockTypes.ITALIAN_MICRO_IMMERSION, title: immersionTitles[wi % immersionTitles.length] },
      { day: 5, block: blockTypes.ITALIAN_CULTURAL_ACTIVITY, title: WEEKEND_TITLES[wi % w] },
      bondingForWeek(wi),
    ];
    return { startDate, plan };
  });
}

// August 2026 warm-up (the seed's own demo week uses 2026-08-03, so start after
// it) and the July–August 2027 summer bridge.
const PONTEGGIO_PLAN = lightWeeks(
  ['2026-08-10', '2026-08-17', '2026-08-24'],
  ['Giochi con i Suoni e le Vocali', 'Italian Storytime', 'Caccia alle Vocali in Casa'],
  ['Rime e Filastrocche delle Vocali', 'Colour Hunt', 'Number Walk'],
);

const ESTATE_PLAN = lightWeeks(
  ['2027-07-05', '2027-07-12', '2027-07-19', '2027-07-26', '2027-08-02', '2027-08-09', '2027-08-16', '2027-08-23', '2027-08-30'],
  ['Il Gelato e l\'Estate', 'Il Picnic Italiano', 'La Canzonetta Italiana', 'Italian Storytime', 'Pasta Shapes Charades'],
  ['Cartoon Dubbing', 'Colour Hunt', 'Italian Breakfast Ritual', 'Number Walk', 'Family Album Scrapbook'],
);

async function scheduleWeekInstances(userId, startDate, plan, byTitle) {
  const [week] = await Week.findOrCreate({
    where: { startDate, userId },
    defaults: { startDate, userId },
  });
  for (const p of plan) {
    const activity = byTitle[p.title];
    if (!activity) {
      console.warn(`[seed] curriculum activity not found: ${p.title}`);
      continue;
    }
    // Derive block_type from the activity's category so that the box colour
    // always matches the activity template type (issue #31). The plan's `block`
    // field is kept only for documentation and is superseded by the mapping.
    const blockType = categoryToBlockType[activity.category] || p.block;
    const existing = await ActivityInstance.findOne({
      where: { weekId: week.id, dayOfWeek: p.day, activityId: activity.id, homeTag: 'Home A' },
    });
    if (existing) {
      if (existing.blockType !== blockType) await existing.update({ blockType });
    } else {
      await ActivityInstance.create({
        weekId: week.id,
        dayOfWeek: p.day,
        blockType,
        activityId: activity.id,
        homeTag: 'Home A',
        status: 'Not started',
      });
    }
  }
  return week;
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

  // Merge in the demo (bridge) + weekend templates so bridge/weekend slots can
  // reuse them as activities.
  const extraTemplates = [...templates, ...weekendTemplates];
  for (const tmpl of extraTemplates) {
    const activity = await upsertActivity(parent.id, tmpl);
    byTitle[activity.title] = byTitle[activity.title] || activity;
  }

  // Pre-built sample month: September 2026 (four weeks), 3 Italian blocks/week.
  // Every week also gets weekend activities and a rotating evening cuddle.
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
  const w = WEEKEND_TITLES.length;
  for (let wi = 0; wi < septemberWeeks.length; wi++) {
    const plan = [
      ...sepPlan,
      { day: 5, block: 'Italian Cultural Activity', title: WEEKEND_TITLES[(wi * 2) % w] },
      { day: 6, block: 'Italian Micro-Immersion', title: WEEKEND_TITLES[(wi * 2 + 1) % w] },
      bondingForWeek(wi),
    ];
    await scheduleWeekInstances(parent.id, septemberWeeks[wi], plan, byTitle);
  }

  // Generated months October 2026 – June 2027 (rotating weekly rhythm).
  for (const [milestoneName, weekStartDates] of Object.entries(MONTH_WEEK_STARTS)) {
    const titles = curriculumTemplates.filter((t) => t.milestone === milestoneName).map((t) => t.title);
    for (const { startDate, plan } of rotatedWeeks(weekStartDates, titles)) {
      await scheduleWeekInstances(parent.id, startDate, plan, byTitle);
    }
  }

  // August 2026 warm-up and summer 2027 bridge (light weeks).
  for (const { startDate, plan } of [...PONTEGGIO_PLAN, ...ESTATE_PLAN]) {
    await scheduleWeekInstances(parent.id, startDate, plan, byTitle);
  }

  return { themes, activities: byTitle };
}

export async function seedDemo() {
  const admin = await createUserIfMissing('admin@faro.app', 'admin123', 'admin');
  const parent = await createUserIfMissing('parent@faro.app', 'parent123', 'parent');

  let demo = [admin, parent];
  if (process.env.SEED_DEMO_USER === 'on') {
    demo = [admin];
  }

  const themes = {};
  for (const t of sampleThemes) {
    const theme = await upsertTheme(parent.id, { ...t, startDate: '2026-09-01', endDate: '2026-09-30' });
    themes[t.name] = theme;
  }

  for (const t of monthlyThemes) {
    await upsertTheme(parent.id, t);
  }

  for (const tmpl of templates) {
    await upsertActivity(parent.id, tmpl);
  }

  for (const user of demo) {
    await seedDefaultExternalTypes(user.id);
  }

  const weekStart = '2026-08-03';
  const demoPlan = [
    { day: 0, title: 'Italian Storytime' },
    { day: 0, title: 'Evening Check-in Cuddle' },
    { day: 1, title: 'Number Walk' },
    { day: 2, title: 'Pasta Shapes Charades' },
    { day: 2, title: 'Colour Hunt' },
    { day: 3, title: 'Evening Check-in Cuddle' },
    { day: 4, title: 'Cartoon Dubbing' },
    { day: 5, title: 'Family Album Scrapbook' },
  ];
  const demoActivities = await Activity.findAll({ where: { userId: parent.id } });
  const demoByTitle = Object.fromEntries(demoActivities.map((a) => [a.title, a]));
  await scheduleWeekInstances(parent.id, weekStart, demoPlan, demoByTitle);

  // First-grade Italian curriculum (milestones, lessons, September sample plan).
  await seedCurriculum(parent);

  return { admin, parent, seededWeekCreated: true };
}

export async function ensureDemoUser() {
  return createUserIfMissing('parent@faro.app', 'parent123', 'parent');
}