-- Database structure.
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)

-- Deleting all rows and reset the auto-increment counter.
DELETE FROM users;
DELETE FROM sqlite_sequence WHERE name='users';

-- Returning all rows.
SELECT * FROM users;