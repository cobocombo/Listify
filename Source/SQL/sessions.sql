-- Table structure.
CREATE TABLE sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    platform  TEXT  NOT NULL
);

-- Inserting a new row into table.
INSERT INTO sessions (token, user_id, created_at, platform) VALUES (?, ?, ?, ?);

-- Deleting all rows.
DELETE FROM sessions;

-- Returning all rows.
SELECT * FROM sessions;

-- Returning session token associated with the user id.
SELECT token FROM sessions WHERE user_id = ?;

-- Deleting row associate with user id and platform.
DELETE FROM sessions WHERE user_id = ? AND platform = ?