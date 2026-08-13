// The category→block_type mapping was not consistently applied when seeding
// ActivityInstances: the rotation logic assigned box colours by day-of-week
// position rather than by the activity template's category (issue #31).
//
// This migration re-derives block_type from the category (template-based
// instances via activities.category, ad-hoc instances via ad_hoc_category)
// using the same mapping as backend/src/utils/constants.js.  It is idempotent:
// rows that already match are left unchanged.
const MAPPING = {
  Language: 'Italian Micro-Immersion',
  Culture: 'Italian Cultural Activity',
  'School Alignment': 'Czech School Alignment',
  Ritual: 'Bonding Ritual',
  Project: 'Italian Cultural Activity',
  Professional: 'External Activity',
};

function caseWhen(column) {
  let sql = 'CASE ';
  for (const [cat, block] of Object.entries(MAPPING)) {
    sql += `WHEN ${column} = '${cat}' THEN '${block}' `;
  }
  sql += `ELSE block_type END`;
  return sql;
}

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('activity_instances'))) return;
  const cols = await queryInterface.describeTable('activity_instances').catch(() => ({}));
  if (!cols.block_type) return;

  // Template-based instances: derive block_type from the linked activity's category
  if (cols.activity_id) {
    await queryInterface.sequelize.query(
      `UPDATE activity_instances
         SET block_type = ${caseWhen('activities.category')}
         FROM activities
        WHERE activity_instances.activity_id = activities.id`,
      { raw: true },
    );
  }

  // Ad-hoc instances: derive block_type from ad_hoc_category
  if (cols.ad_hoc_category) {
    await queryInterface.sequelize.query(
      `UPDATE activity_instances
         SET block_type = ${caseWhen('ad_hoc_category')}
         WHERE activity_id IS NULL
           AND ad_hoc_category IS NOT NULL`,
      { raw: true },
    );
  }
};

export const down = async () => {};
