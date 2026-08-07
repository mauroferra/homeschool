# First-Grade Italian Curriculum — Syllabus

**Target:** 1st grade (6–7 years) · **School year:** Sep 2026 – Jun 2027
**Child profile:** some spoken Italian at home; reading/writing start from scratch.

This document is the reference syllabus for the first-grade Italian curriculum that is
**seeded into the app** (`backend/scripts/seed/seed_templates.js`). It maps 1:1 to the data:

| App concept       | Syllabus term                                  |
| ----------------- | ---------------------------------------------- |
| `Theme`           | Milestone (one per month)                      |
| `Activity` (tpl)  | Lesson / class unit                            |
| `Week` + instance | Scheduled class in a day's block               |

Milestones are anchored Sep 2026 – Jun 2027. The companion `specs/API-SPEC.md` documents
the API; this file documents *what* to teach and *how* to run it.

---

## 1. Principles

1. **Short, joyful, daily.** 3–4 Italian blocks per week, 10–15 min each, never more than
   ~30 min in one sitting. Stop while it's fun.
2. **Speaking first.** The child already speaks some Italian — every reading/writing lesson
   starts from oral language, then connects sounds to letters.
3. **From sound → syllable → word → sentence → text.** No skipping; this is the classic
   Italian "sillabico" progression used in Italian first grade.
4. **Grammar is playful and implicit** until mid-year, then lightly named (articles, gender,
   singular/plural, verbs).
5. **Every lesson has an extra-curricular hook** (home, street, kitchen, garden) so Italian
   lives outside the "lesson".

---

## 2. Year overview (milestones)

| #  | Milestone (Theme)                  | Window      | Focus                                                        |
| -- | ---------------------------------- | ----------- | ------------------------------------------------------------ |
| I  | Suoni e Vocali                     | Sep 2026    | Vowels A-E-I-O-U, consonant awareness, sound games           |
| II | Sillabe Aperte                     | Oct 2026    | Blend consonants + vowel: PA-PE-PI-PO-PU; first 2-syllable words |
| III| Sillabe Chiuse e Gruppi            | Nov 2026    | Closed syllables, double consonants, hard/soft C-G           |
| IV | Prime Parole Bisillabe             | Dec 2026    | Read high-frequency bisyllabic words, sight words, first phrase |
| V  | Scrittura                          | Jan 2027    | Handwriting: capital + lower-case letters, write syllables   |
| VI | Articoli e Genere                  | Feb 2027    | il/lo/la/le, masculine/feminine                              |
| VII| Singolare/Plurale e Frase          | Mar 2027    | one/many, minimal sentence (chi? che fa?)                    |
| VIII| Verbi                             | Apr 2027    | essere, avere, common -are verbs                             |
| IX | Lettura e Comprensione             | May 2027    | Read short texts, answer chi/che cosa/dove                    |
| X  | Revisione e Librino                | Jun 2027    | Review games + personal mini-book ("il mio librino")         |

> Dec ends 23rd (Christmas break); Jan resumes 7th. The milestone dates in the DB reflect this.

---

## 3. Weekly rhythm

A sustainable default (adapt to family calendar):

| Day | Block            | Focus                                        |
| --- | ---------------- | -------------------------------------------- |
| Mon | Italian Cultural Activity | Main reading/writing lesson of the week |
| Tue | Italian Micro-Immersion  | Sound game, song, or rhythm round       |
| Wed | Czech School Alignment   | Transfer skill to Czech school content  |
| Thu | *(rest / bonding ritual)*|                                     |
| Fri | Italian Cultural Activity | Story, recipe, or culture hook          |

The **September 2026 sample month is pre-scheduled** in the seed (3 blocks/week). For the
remaining months, add instances from the lesson templates in the planner.

---

## 4. Lesson templates (classes) by milestone

Each template carries a three-part description: **Lezione** (guided class),
**Attività** (extra-curricular expansion), **Fonti** (reference material).

### Milestone I — Suoni e Vocali (Sep)
- **Giochi con i Suoni e le Vocali** (15′): vowels with mouth-shape games + a gesture per vowel.
  - *Extra:* vowel hunt at home, vowel poster, car sound riddles.
  - *Refs:* L'Albero Azzurro (RaiPlay), vowel worksheets.
- **Caccia alle Vocali in Casa** (12′): find objects starting with a chosen vowel.
  - *Extra:* "which vowel starts this?" while cooking/walking.
  - *Refs:* vowel+object flashcards.
- **Rime e Filastrocche delle Vocali** (12′): nursery rhymes, underline the letter of the week.
  - *Extra:* invent a family rhyme, clap the beat.
  - *Refs:* children's nursery-rhyme anthologies.

### Milestone II — Sillabe Aperte (Oct)
- **La Casa delle Sillabe Aperte** (15′): build PA-PE-PI-PO-PU, read the "syllable house".
  - *Extra:* syllable relay with a ball.
  - *Refs:* La Casa delle Parole (RaiPlay).
- **Costruisco Parole con le Sillabe** (15′): syllable + syllable → word (mamma, banana).
  - *Extra:* word labels pinned in the kitchen.
- **Staffetta delle Sillabe** (12′): turn-based syllable cards into daily words.

### Milestone III — Sillabe Chiuse e Gruppi (Nov)
- **Sillabe Chiuse a Fine Parola** (15′): PAN/DON/MAR reading.
  - *Extra:* "guess the word" from start+end.
- **Ca-Ga-Co, Ci e Gi: suoni amici** (15′): hard/soft C and G with drawn pairs.
- **Consonanti Doppie in Festa** (12′): pala vs palla, lengthen the double sound.

### Milestone IV — Prime Parole Bisillabe (Dec)
- **Corsa alla Lettura di Parole Bisillabe** (15′): read two-syllable words, speed up.
- **Parole che Vedo Sempre** (12′): sight words (e, il, la, un, è, io).
- **La Prima Frase che Leggo** (12′): first 3–4-word sentences with picture support.

### Milestone V — Scrittura (Jan)
- **Scrivo le Lettere nell'Aria** (15′): air-writing, then sand-tray, stroke direction.
  - *Extra:* finger-writing in flour, rainbow letters.
- **Lettere Grandi e Piccole** (12′): match capital/lower-case (A–a), memory game.
- **Dettato di Vocali e Sillabe** (12′): short playful dictation (game, not test).

### Milestone VI — Articoli e Genere (Feb)
- **Gli Articoli: Il-Lo-La-Le** (12′): match article + noun (la mela, lo zoo).
  - *Extra:* name foods with articles at the table.
- **Maschile o Femminile?** (15′): discover gender through il/la, plenty of examples.
- **Indovino del Genere** (10′): "I say LA, you find a feminine noun".

### Milestone VII — Singolare/Plurale e Frase (Mar)
- **Uno e Tanti** (12′): cane/cani, casa/case with gestures.
  - *Extra:* count plurals at meals.
- **La Frase Semplice: Chi fa?** (15′): minimal sentence — "Il gatto dorme".

### Milestone VIII — Verbi (Apr)
- **Sono e Ho: i Verbi Speciali** (15′): io sono / io ho / lui è / lei ha.
- **I Verbi in -are: correre, cantare, giocare** (12′): conjugate with the body.
  - *Extra:* mime each verb while saying it.

### Milestone IX — Lettura e Comprensione (May)
- **Leggo e Disegno la Storia** (15′): read a tiny text, draw the characters.
- **Le Tre Domande della Storia** (12′): chi? che cosa? dove?
- **La Scatola delle Storie** (15′): draw 3 story elements, invent a story in two.

### Milestone X — Revisione e Librino (Jun)
- **Il Mio Librino: progetto dell'anno** (30′): collect the year's words/drawings, bind a booklet.
- **Giochi di Revisione dell'anno** (15′): syllable guessing, word circles, happy checklists.
- **Festa delle Parole** (20′): end-of-year celebration with words, food, and a "recital".

---

## 5. Reference material (Fonti)

- **RaiPlay** — *L'Albero Azzurro*, *La Casa delle Parole* (sound/syllable segments).
- **Printed** — alphabet poster, syllable cards, sight-word packs, nursery-rhyme anthologies,
  "io leggo da solo" first readers from the library.
- **Home-made** — vowel cards, syllable "bricks", story box (who/where/object cards),
  sand tray / flour for letter-writing.
- **Czech-Italian bridge** — when a concept is new in Italian, first secure it in the child's
  spoken language, then connect to the Italian word (e.g. syllable games in both languages).

---

## 6. Extra-curricular expansion (general ideas)

- **Kitchen:** cook an Italian dish, name each ingredient with its article (la farina, il latte).
- **Street & garden:** number walk, vowel hunt, "which syllable starts this thing?".
- **Music:** clap syllables to songs; perform nursery rhymes for the family.
- **Screen (short, guided):** a 5-minute RaiPlay segment watched *after* the lesson, not instead.
- **Reading aloud:** 10 minutes of Italian picture book every evening as a bonding ritual.
- **Projects:** the family scrapbook, the kitchen word-wall, and finally *il mio librino*.

---

## 7. Progress tracking in the app

Mark each scheduled instance **Completed** after a lesson and leave a one-line reflection
(what clicked / what to repeat). The **Progress dashboard** then shows category coverage and
weekly reflections — use it to slow down or speed up between milestones. Skipping a milestone
is fine; the milestone (Theme) dates are guides, not gates.
