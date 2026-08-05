import { createConnection, closeConnection } from './db.js';
import './models/index.js';

async function migrate() {
  const db = createConnection();
  console.log(`[db] Applying models to ${db.getDialect()}...`);
  await db.sync();
  console.log('[db] Migration complete.');
  await closeConnection();
}

migrate().catch((err) => {
  console.error('[db] Migration failed:', err.message);
  process.exit(1);
});