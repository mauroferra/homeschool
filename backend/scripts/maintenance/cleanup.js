import { createConnection, closeConnection } from '../../src/db/db.js';
import '../../src/db/models/index.js';
import { ActivityInstance, Week } from '../../src/db/models/index.js';

async function run() {
  const days = parseInt(process.env.CLEANUP_OLDER_THAN_DAYS || '365', 10);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  await createConnection();
  const weeks = await Week.findAll({ where: { createdAt: { [require('sequelize').Op.lt]: cutoff } } });
  for (const week of weeks) {
    await ActivityInstance.destroy({ where: { weekId: week.id } });
    await week.destroy();
    console.log(`[cleanup] removed week ${week.id} (${week.startDate})`);
  }
  console.log(`[cleanup] done. Removed ${weeks.length} old weeks.`);
  await closeConnection();
}

run().catch((err) => {
  console.error('[cleanup] failed:', err);
  process.exit(1);
});