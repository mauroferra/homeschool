-- 003_create_activities.sql
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  title_en TEXT,
  title_cs TEXT,
  title_it TEXT,
  category TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  description_cs TEXT,
  description_it TEXT,
  estimated_duration INTEGER,
  links TEXT NOT NULL DEFAULT '[]',
  attachments TEXT NOT NULL DEFAULT '[]',
  theme_id INTEGER REFERENCES themes(id) ON DELETE SET NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);