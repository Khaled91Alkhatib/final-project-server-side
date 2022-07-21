-- Drop and recreate line_items table

DROP TABLE IF EXISTS line_items CASCADE;

CREATE TABLE line_items (
  id SERIAL PRIMARY KEY NOT NULL,

  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_size_id VARCHAR(16) REFERENCES product_sizes(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,

  qty INTEGER NOT NULL,
  price INTEGER  NOT NULL
);
