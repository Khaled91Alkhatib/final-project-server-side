-- Drop and recreate line_items table

DROP TABLE IF EXISTS order_lines CASCADE;

CREATE TABLE order_lines (
  id SERIAL PRIMARY KEY NOT NULL,

  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_size_id VARCHAR(16) REFERENCES product_sizes(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,

  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(255) NOT NULL,
  size SMALLINT NOT NULL
);
