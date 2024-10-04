CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)

DELETE FROM users;
DELETE FROM sqlite_sequence WHERE name='users';  -- This resets the auto-increment counter.

SELECT * FROM users;