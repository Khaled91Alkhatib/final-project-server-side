const getBestSellingSize = (db) => {
  return db.query(`
  SELECT size, SUM(qty) as qty
  FROM order_lines
  GROUP BY size
  ORDER BY qty
  LIMIT 5;`)
}

module.exports = { getBestSellingSize };
