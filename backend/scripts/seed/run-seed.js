import { createConnection, closeConnection } from '../../src/db/db.js';
import '../../src/db/models/index.js';
import { upsertAdmin } from './seed_users.js';
import { seedDemo } from './seed_templates.js';

async function run() {
  await createConnection();
  await upsertAdmin();
  await seedDemo();
  console.log('[seed] Demo data ready.');
  await closeConnection();
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});