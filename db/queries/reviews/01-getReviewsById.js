const getReviewsById = (db, code) => {
  return db.query(`
  SELECT id, sku, headline, comments, to_char(create_time,'YYYY-MM-DD') as date, rating
  FROM reviews
  WHERE sku LIKE CONCAT($1::text,'%') AND display is true AND inactive is false
  ORDER BY create_time, id DESC;`, [code])
}

module.exports = { getReviewsById };
