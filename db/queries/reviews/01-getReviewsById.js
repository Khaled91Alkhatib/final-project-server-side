const getReviewsById = (db, code) => {
  return db.query(`
  SELECT id, sku, headline, comments, create_time, rating
  FROM reviews
  WHERE sku LIKE CONCAT($1::text,'%') AND display is true
  ORDER BY create_time, id DESC;`, [code])
}

module.exports = { getReviewsById };
