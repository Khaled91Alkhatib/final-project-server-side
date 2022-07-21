-- Drop and recreate inventory table

DROP TABLE IF EXISTS inventory CASCADE;

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY NOT NULL,
  barcode VARCHAR(16) REFERENCES product_sizes(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0
);

