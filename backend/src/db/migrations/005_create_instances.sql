-- 005_create_instances.sql
CREATE TABLE IF NOT EXISTS activity_instances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  block_type TEXT NOT NULL,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  home_tag TEXT NOT NULL DEFAULT 'Home A',
  status TEXT NOT NULL DEFAULT 'Not started',
  reflection_text TEXT,
  ad_hoc_title TEXT,
  ad_hoc_category TEXT,
  ad_hoc_description TEXT,
  ad_hoc_duration INTEGER,
  ad_hoc_links TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);