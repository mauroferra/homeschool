import bcrypt from 'bcryptjs';
import { User, Activity, Theme, Week, ActivityInstance } from '../../src/db/models/index.js';
import { categories } from '../../src/utils/constants.js';

const templates = [
  {
    title: 'Italian Storytime',
    category: categories[0],
    description: 'Read a short Italian picture book together and ask one question about it.',
    estimatedDuration: 10,
    links: ['https://example.com/story-books'],
  },
  {
    title: 'Italian Breakfast Ritual',
    category: categories[3],
    description: 'Share a simple Italian breakfast and name the foods in Italian.',
    estimatedDuration: 15,
  },
  {
    title: 'Colour Hunt',
    category: categories[0],
    description: 'Find objects around the house matching an Italian colour word.',
    estimatedDuration: 10,
  },
  {
    title: 'Pasta Shapes Charades',
    category: categories[1],
    description: 'Act out and name different pasta shapes in Italian.',
    estimatedDuration: 12,
  },
  {
    title: 'Number Walk',
    category: categories[2],
    description: 'Practise counting to ten in Czech and Italian on a short walk.',
    estimatedDuration: 15,
  },
  {
    title: 'Evening Check-in Cuddle',
    category: categories[3],
    description: 'Five minutes of calm, one thing each that was good today.',
    estimatedDuration: 5,
  },
  {
    title: 'Cartoon Dubbing',
    category: categories[0],
    description: 'Watch a short cartoon segment and repeat a favourite line.',
    estimatedDuration: 15,
  },
  {
    title: 'Family Album Scrapbook',
    category: categories[1],
    description: 'Add one photo and label it in Italian and Czech.',
    estimatedDuration: 20,
    links: [],
  },
];

const sampleThemes = [
  { name: 'Italian Cities', description: 'Rome, Venice, Milan and their landmarks.' },
  { name: 'Italian Foods', description: 'Seasonal foods and their Italian names.' },
  { name: 'Italian Holidays', description: 'Traditional celebrations throughout the year.' },
];

async function createUserIfMissing(email, password, role) {
  const hash = await bcrypt.hash(password, 10);
  const [user] = await User.findOrCreate({ where: { email }, defaults: { email, passwordHash: hash, role, active: true } });
  return user;
}

export async function seedDemo() {
  const admin = await createUserIfMissing('admin@homeschool.app', 'admin123', 'admin');
  const parent = await createUserIfMissing('parent@homeschool.app', 'parent123', 'parent');

  let demo = [admin, parent];
  if (process.env.SEED_DEMO_USER === 'on') {
    demo = [admin];
  }

  const themes = {};
  for (const t of sampleThemes) {
    const [theme] = await Theme.findOrCreate({
      where: { name: t.name, userId: parent.id },
      defaults: { ...t, userId: parent.id, startDate: '2026-09-01', endDate: '2026-09-30' },
    });
    themes[t.name] = theme;
  }

  for (const tmpl of templates) {
    const [activity] = await Activity.findOrCreate({
      where: { title: tmpl.title, userId: parent.id },
      defaults: { ...tmpl, userId: parent.id },
    });
  }

  const weekStart = '2026-08-03';
  const [week, created] = await Week.findOrCreate({ where: { startDate: weekStart, userId: parent.id }, defaults: { startDate: weekStart, userId: parent.id } });

  if (created !== false || true) {
    const allActivities = await Activity.findAll({ where: { userId: parent.id } });
    const byTitle = Object.fromEntries(allActivities.map((a) => [a.title, a]));
    const plan = [
      { day: 0, block: 'Italian Micro-Immersion', title: 'Italian Storytime' },
      { day: 0, block: 'Bonding Ritual', title: 'Evening Check-in Cuddle' },
      { day: 1, block: 'Czech School Alignment', title: 'Number Walk' },
      { day: 2, block: 'Italian Cultural Activity', title: 'Pasta Shapes Charades' },
      { day: 2, block: 'Italian Micro-Immersion', title: 'Colour Hunt' },
      { day: 3, block: 'Bonding Ritual', title: 'Evening Check-in Cuddle' },
      { day: 4, block: 'Italian Micro-Immersion', title: 'Cartoon Dubbing' },
      { day: 5, block: 'Italian Cultural Activity', title: 'Family Album Scrapbook' },
    ];
    for (const p of plan) {
      const activity = byTitle[p.title];
      if (!activity) continue;
      await ActivityInstance.findOrCreate({
        where: { weekId: week.id, dayOfWeek: p.day, blockType: p.block, activityId: activity.id, homeTag: 'Home A' },
        defaults: { weekId: week.id, dayOfWeek: p.day, blockType: p.block, activityId: activity.id, homeTag: 'Home A' },
      });
    }
  }
  return { admin, parent, seededWeekCreated: created !== false };
}

export async function ensureDemoUser() {
  return createUserIfMissing('parent@homeschool.app', 'parent123', 'parent');
}