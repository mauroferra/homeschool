const categories = ['Language', 'Culture', 'School Alignment', 'Ritual', 'Project', 'Professional'];

const blockTypes = {
  ITALIAN_MICRO_IMMERSION: 'Italian Micro-Immersion',
  CZECH_SCHOOL_ALIGNMENT: 'Czech School Alignment',
  ITALIAN_CULTURAL_ACTIVITY: 'Italian Cultural Activity',
  BONDING_RITUAL: 'Bonding Ritual',
  EXTERNAL_ACTIVITY: 'External Activity',
};

const blockKeys = [
  'ITALIAN_MICRO_IMMERSION',
  'CZECH_SCHOOL_ALIGNMENT',
  'ITALIAN_CULTURAL_ACTIVITY',
  'BONDING_RITUAL',
  'EXTERNAL_ACTIVITY',
];

// Mapping from activity template category to the box block_type that drives the
// week-view colour. Derived from seed data: each category's templates most
// consistently land in the matching block (e.g. Ritual→Bonding Ritual 114/182).
// Categories without a one-to-one curriculum block reuse the closest semantic
// block; 'Professional' maps to External Activity (handled in its own tab).
const categoryToBlockType = {
  Language: 'Italian Micro-Immersion',
  Culture: 'Italian Cultural Activity',
  'School Alignment': 'Czech School Alignment',
  Ritual: 'Bonding Ritual',
  Project: 'Italian Cultural Activity',
  Professional: 'External Activity',
};

const householdTags = ['Home A', 'Home B', 'Both'];

const statuses = ['Not started', 'In progress', 'Completed', 'Skipped'];

const roles = ['admin', 'parent'];

const defaultWeekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export { categories, blockTypes, blockKeys, householdTags, statuses, roles, defaultWeekdays, categoryToBlockType };