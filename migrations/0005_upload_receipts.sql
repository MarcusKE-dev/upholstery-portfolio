-- Authenticated completion retries can recover a successful upload after a lost response.
CREATE TABLE upload_receipts (
 id TEXT PRIMARY KEY,
 object_key TEXT NOT NULL REFERENCES media(object_key) ON DELETE CASCADE,
 size INTEGER NOT NULL,
 content_type TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX upload_receipts_expiry ON upload_receipts(created_at);
