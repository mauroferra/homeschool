import { DataTypes } from 'sequelize';
import { createConnection, closeConnection } from './db.js';
import './models/index.js';

// Columns that Sequelize.sync() only adds to brand-new tables. Existing dev
// databases need them back-ported idempotently, so we add any that are missing.
const TRANSLATION_COLUMNS = {
  activities: [
    { name: 'title_en', type: DataTypes.STRING },
    { name: 'title_cs', type: DataTypes.STRING },
    { name: 'title_it', type: DataTypes.STRING },
    { name: 'description_en', type: DataTypes.TEXT },
    { name: 'description_cs', type: DataTypes.TEXT },
    { name: 'description_it', type: DataTypes.TEXT },
  ],
  themes: [
    { name: 'name_en', type: DataTypes.STRING },
    { name: 'name_cs', type: DataTypes.STRING },
    { name: 'name_it', type: DataTypes.STRING },
    { name: 'description_en', type: DataTypes.TEXT },
    { name: 'description_cs', type: DataTypes.TEXT },
    { name: 'description_it', type: DataTypes.TEXT },
  ],
};

export async function backfillTranslationColumns() {
  const db = createConnection();
  const qi = db.getQueryInterface();
  for (const [table, columns] of Object.entries(TRANSLATION_COLUMNS)) {
    const existing = await qi.describeTable(table).catch(() => ({}));
    for (const col of columns) {
      if (!existing[col.name]) {
        await qi.addColumn(table, col.name, { type: col.type });
        console.log(`[db] Added column ${table}.${col.name}`);
      }
    }
  }
  return db;
}

async function migrate() {
  const db = createConnection();
  console.log(`[db] Applying models to ${db.getDialect()}...`);
  await db.sync();
  await backfillTranslationColumns();
  console.log('[db] Migration complete.');
  await closeConnection();
}

migrate().catch((err) => {
  console.error('[db] Migration failed:', err.message);
  process.exit(1);
});