-- New D1 schema, not a claim about the deployed Supabase schema.
PRAGMA foreign_keys=ON;
CREATE TABLE media (
 object_key TEXT PRIMARY KEY,
 content_type TEXT NOT NULL CHECK(content_type IN ('image/jpeg','image/png','image/webp','video/mp4','video/webm')),
 size INTEGER NOT NULL CHECK(size > 0 AND size <= 2147483648),
 sha256 TEXT NOT NULL,
 created_at TEXT NOT NULL,
 original_url TEXT UNIQUE
);
CREATE TABLE projects (
 id TEXT PRIMARY KEY,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 title TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 category TEXT NOT NULL CHECK(category IN ('residential','window','bedroom','automotive')),
 subcategory TEXT NOT NULL DEFAULT '',
 image_url TEXT NOT NULL,
 before_image_url TEXT,
 alt_text TEXT NOT NULL DEFAULT '',
 video_url TEXT,
 published INTEGER NOT NULL DEFAULT 1 CHECK(published IN (0,1))
);
CREATE INDEX projects_public_order ON projects(published,created_at DESC,id DESC);
CREATE INDEX projects_category_order ON projects(category,published,created_at DESC,id DESC);
CREATE TABLE site_settings (key TEXT PRIMARY KEY CHECK(key='artisan_image_url'),value TEXT NOT NULL,updated_at TEXT NOT NULL);
-- Exactly one administrator credential; no user registration or user-editable roles.
CREATE TABLE administrator (singleton INTEGER PRIMARY KEY CHECK(singleton=1),credential_id TEXT UNIQUE NOT NULL,public_key TEXT NOT NULL,counter INTEGER NOT NULL,transports TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE TABLE challenges (token_hash TEXT PRIMARY KEY,challenge TEXT NOT NULL,purpose TEXT NOT NULL CHECK(purpose IN ('register','login')),expires_at INTEGER NOT NULL);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY,hits INTEGER NOT NULL,reset_at INTEGER NOT NULL);
