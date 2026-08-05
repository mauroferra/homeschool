import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import config from '../../src/config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const backupDir = process.env.BACKUP_DIR || path.resolve(__dirname, '../../data/backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const db = config.db;

  if (db.dialect === 'sqlite') {
    const dest = path.join(backupDir, `app-${stamp}.db`);
    try {
      fs.copyFileSync(db.storage, dest);
      console.log(`[backup] sqlite copied to ${dest}`);
    } catch {
      // The .db may be journaled; fall back to sqlite3 .backup if available
      execSync(`sqlite3 ${db.storage} ".backup '${dest}'"`);
      console.log(`[backup] sqlite3 backup to ${dest}`);
    }
  } else {
    const dest = path.join(backupDir, `${db.database}-${stamp}.sql`);
    execSync(`pg_dump --no-owner -p ${db.port} -U ${db.username} ${db.database} > ${dest}`, {
      env: { ...process.env, PGPASSWORD: db.password },
    });
    console.log(`[backup] postgres dump to ${dest}`);
  }
  console.log(`[backup] done. Backups in ${backupDir}`);
}

run().catch((err) => {
  console.error('[backup] failed:', err);
  process.exit(1);
});