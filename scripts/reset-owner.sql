-- Account-private recovery only. Back up first; content and media are retained.
DELETE FROM sessions;
DELETE FROM challenges;
DELETE FROM administrator;
DELETE FROM backup_credentials;
DELETE FROM rate_limits;
