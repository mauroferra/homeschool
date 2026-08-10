export const CATEGORIES = ['Language', 'Culture', 'School Alignment', 'Ritual', 'Project', 'Professional'];

export const BLOCK_TYPES = [
  'Italian Micro-Immersion',
  'Czech School Alignment',
  'Italian Cultural Activity',
  'Bonding Ritual',
  'External Activity',
];

export const CURRICULUM_BLOCK_TYPES = BLOCK_TYPES.filter((bt) => bt !== 'External Activity');

export const STATUSES = ['Not started', 'In progress', 'Completed', 'Skipped'];

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const BLOCK_LABELS = {
  'Italian Micro-Immersion': 'Italian Micro-Immersion',
  'Czech School Alignment': 'Czech School Alignment',
  'Italian Cultural Activity': 'Italian Cultural Activity',
  'Bonding Ritual': 'Bonding Ritual',
  'External Activity': 'External Activity',
};

export const BLOCK_COLORS = {
  'Italian Micro-Immersion': 'var(--block-imi)',
  'Czech School Alignment': 'var(--block-csa)',
  'Italian Cultural Activity': 'var(--block-ica)',
  'Bonding Ritual': 'var(--block-br)',
  'External Activity': 'var(--block-ext)',
};

export const STATIC_ROUTES = { week: '/week', themes: '/themes', progress: '/progress', settings: '/settings' };