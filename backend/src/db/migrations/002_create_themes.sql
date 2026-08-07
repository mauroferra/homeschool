-- 002_create_themes.sql
CREATE TABLE IF NOT EXISTS themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_en TEXT,
  name_cs TEXT,
  name_it TEXT,
  description TEXT,
  description_en TEXT,
  description_cs TEXT,
  description_it TEXT,
  start_date DATE,
  end_date DATE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);