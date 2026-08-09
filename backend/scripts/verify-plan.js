// node scripts/verify-plan.js
//
// Prints the scheduled weekly grid for the demo parent from the database,
// grouped by month, plus per-month and total summaries. Read-only: it only
// queries the DB and never writes anything.
//
// Run after `npm run db:seed` (or `npm run deploy`) to sanity-check that the
// whole academic year + bridges have populated weeks and instances.

import { createConnection, closeConnection } from '../src/db/db.js';
import '../src/db/models/index.js';
import { Week, Activity, ActivityInstance } from '../src/db/models/index.js';
import { ensureDemoUser } from './seed/seed_templates.js';
import { dateOnlyISO, addDays } from '../src/utils/date.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

async function main() {
  await createConnection();
  const parent = await ensureDemoUser();

  const weeks = await Week.findAll({ where: { userId: parent.id }, order: [['startDate', 'ASC']] });
  if (!weeks.length) {
    console.log('No weeks seeded for the demo parent.');
    await closeConnection();
    return;
  }

  const weeksById = new Map(weeks.map((w) => [w.id, w]));
  const instances = await ActivityInstance.findAll({
    where: { weekId: [...weeksById.keys()] },
    include: [{ model: Activity, as: 'Activity', required: false }],
    order: [['dayOfWeek', 'ASC'], ['blockType', 'ASC']],
  });

  const byWeek = new Map();
  for (const inst of instances) {
    const list = byWeek.get(inst.weekId) || [];
    list.push(inst);
    byWeek.set(inst.weekId, list);
  }

  const monthSummary = new Map(); // month -> { weeks:Set, instances }
  let totalInstances = 0;
  let emptyWeeks = 0;

  for (const week of weeks) {
    const rows = byWeek.get(week.id) || [];
    const month = week.startDate.slice(0, 7);
    if (!monthSummary.has(month)) monthSummary.set(month, { weeks: new Set(), instances: 0 });
    const ms = monthSummary.get(month);
    ms.weeks.add(week.startDate);
    ms.instances += rows.length;
    totalInstances += rows.length;
    if (!rows.length) emptyWeeks += 1;

    console.log(`\n== Week ${week.startDate} (${rows.length} instances${rows.length ? '' : '  <-- empty'}) ==`);
    const rowsSorted = [...rows].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.blockType.localeCompare(b.blockType));
    for (const r of rowsSorted) {
      const date = dateOnlyISO(addDays(week.startDate, r.dayOfWeek));
      const title = r.Activity ? r.Activity.title : r.adHocTitle || '(none)';
      console.log(`  [${date}] ${DAYS[r.dayOfWeek] || '?'} | ${r.blockType} | ${title}`);
    }
  }

  console.log('\n--- Monthly summary ---');
  for (const [month, m] of monthSummary) {
    console.log(`${month}: ${m.weeks.size} week(s), ${m.instances} instance(s)`);
  }
  console.log(`\nTotal: ${weeks.length} weeks, ${totalInstances} instances${emptyWeeks ? `, ${emptyWeeks} empty week(s)` : ''}`);

  await closeConnection();
}

main().catch((err) => {
  console.error('[verify-plan] Failed:', err);
  process.exit(1);
});