const getBestSellingProduct = (db) => {
  return db.query(`
    SELECT name as product, SUM(qty) as qty
    FROM order_lines
    GROUP BY name
    ORDER BY qty
    LIMIT 5;`)
}

module.exports = { getBestSellingProduct };
