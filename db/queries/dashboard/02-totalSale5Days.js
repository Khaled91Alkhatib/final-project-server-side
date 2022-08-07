const totalSale5Days = (db) => {
  return db.query(`
  SELECT to_char(order_time,'YYYY-MM-DD') AS date, SUM(subtotal) AS total
  FROM orders
  GROUP BY order_time
  ORDER BY order_time DESC
  LIMIT 5;`)
}

module.exports = { totalSale5Days };
