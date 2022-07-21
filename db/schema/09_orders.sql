-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  subtotal INTEGER  NOT NULL,

  order_time DATE NOT NULL DEFAULT NOW()

);
