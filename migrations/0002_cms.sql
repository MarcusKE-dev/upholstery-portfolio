CREATE TABLE content (
 id TEXT PRIMARY KEY,
 kind TEXT NOT NULL CHECK(kind IN ('project','post','service','category','page','guide','faq','settings')),
 slug TEXT NOT NULL,
 title TEXT NOT NULL,
 published INTEGER NOT NULL DEFAULT 0 CHECK(published IN(0,1)),
 position INTEGER NOT NULL DEFAULT 0,
 document TEXT NOT NULL CHECK(json_valid(document)),
 updated_at TEXT NOT NULL,
 UNIQUE(kind,slug)
);
CREATE INDEX content_public ON content(kind,published,position);
CREATE TABLE media_refs (
 content_id TEXT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
 object_key TEXT NOT NULL REFERENCES media(object_key),
 PRIMARY KEY(content_id,object_key)
);
CREATE INDEX media_refs_key ON media_refs(object_key);
CREATE TABLE redirects (path TEXT PRIMARY KEY,content_id TEXT NOT NULL REFERENCES content(id) ON DELETE CASCADE);
CREATE TABLE uploads (
 id TEXT PRIMARY KEY,object_key TEXT NOT NULL,upload_id TEXT NOT NULL,content_type TEXT NOT NULL,
 size INTEGER NOT NULL,created_at INTEGER NOT NULL
);
CREATE TABLE upload_parts (
 upload_id TEXT NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
 part INTEGER NOT NULL,size INTEGER NOT NULL,etag TEXT NOT NULL,
 PRIMARY KEY(upload_id,part)
);
CREATE TABLE backup_credentials (
 credential_id TEXT PRIMARY KEY,public_key TEXT NOT NULL,counter INTEGER NOT NULL,transports TEXT NOT NULL,created_at INTEGER NOT NULL
);

DROP TABLE challenges;
CREATE TABLE challenges (token_hash TEXT PRIMARY KEY,challenge TEXT NOT NULL,purpose TEXT NOT NULL CHECK(purpose IN ('register','login','backup')),expires_at INTEGER NOT NULL);
