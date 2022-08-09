const getAvgRating = (db, code) => {
  return db.query(`
  SELECT ROUND(AVG(rating), 1) as avg
  FROM reviews
  WHERE sku LIKE CONCAT($1::text,'%') AND display is true AND inactive is false;`, [code])
}

module.exports = { getAvgRating };
