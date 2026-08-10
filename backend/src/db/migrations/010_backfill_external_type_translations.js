// Migration 009 added the translation columns, but rows that already existed
// (seeded before 009) kept NULL translations, so the UI fell back to English.
// Backfill the default external activity types by their base (English) name so
// existing installations display localized names without a full re-seed.
const DEFAULT_TYPE_TRANSLATIONS = [
  { name: 'Swimming class', name_en: 'Swimming class', name_cs: 'Plavecký kurz', name_it: 'Corso di nuoto' },
  { name: 'Speech therapy', name_en: 'Speech therapy', name_cs: 'Logopedie', name_it: 'Logopedia' },
  { name: 'Physiotherapy', name_en: 'Physiotherapy', name_cs: 'Fyzioterapie', name_it: 'Fisioterapia' },
];

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('external_activity_types'))) return;
  for (const t of DEFAULT_TYPE_TRANSLATIONS) {
    await queryInterface.sequelize.query(
      `UPDATE external_activity_types
         SET name_en = COALESCE(name_en, ?),
             name_cs = COALESCE(name_cs, ?),
             name_it = COALESCE(name_it, ?)
       WHERE name = ?`,
      { replacements: [t.name_en, t.name_cs, t.name_it, t.name] },
    );
  }
};

export const down = async () => {};