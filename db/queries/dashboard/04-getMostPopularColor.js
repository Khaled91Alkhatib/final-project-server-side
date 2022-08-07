const getMostPopularColor = (db) => {
  return db.query(`
  SELECT color, SUM(qty) as qty
  FROM order_lines
  GROUP BY color
  ORDER BY qty
  LIMIT 5;`)
}

module.exports = { getMostPopularColor };
