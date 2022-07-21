-- Drop and recreate product_sizes table

DROP TABLE IF EXISTS product_sizes CASCADE;

CREATE TABLE product_sizes (
  id VARCHAR(16) PRIMARY KEY NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  size_id INTEGER REFERENCES sizes(id) ON DELETE CASCADE
);

