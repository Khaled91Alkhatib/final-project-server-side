const getOrderDetailsByDateRange = (db, start, end) => {
  return db.query(`
  SELECT order_lines.order_id, name, price, qty, size, color, product_size_id as barcode
  FROM order_lines
  JOIN orders ON orders.id = order_lines.order_id
  WHERE order_time >= $1 AND order_time <= $2
  ORDER BY order_id, product_size_id;`, [start, end])
}

module.exports = { getOrderDetailsByDateRange };
