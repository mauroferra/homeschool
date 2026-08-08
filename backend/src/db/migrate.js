import path from 'path';
import { fileURLToPath } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';
import { createConnection, closeConnection } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

export function createMigrator() {
  const sequelize = createConnection();
  const migrator = new Umzug({
    migrations: {
      glob: ['*.js', { cwd: migrationsDir }],
    },
    // Each migration receives `context` (the QueryInterface) to run DDL.
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
  return { sequelize, migrator };
}

async function migrate() {
  const { sequelize, migrator } = createMigrator();
  const applied = await migrator.up();
  console.log(`[db] Migration complete (${applied.length} applied).`);
  await closeConnection();
}

export default migrate;

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isDirectRun) {
  migrate().catch((err) => {
    console.error('[db] Migration failed:', err.stack || err.message);
    process.exit(1);
  });
}