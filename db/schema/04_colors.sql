-- Drop and recreate colors table

DROP TABLE IF EXISTS colors CASCADE;

CREATE TABLE colors (
  id SERIAL PRIMARY KEY NOT NULL,
  color VARCHAR(255) NOT NULL
);
