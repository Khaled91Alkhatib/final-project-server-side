const addNewReview = (db, review) => {
  return db.query(`
  INSERT INTO reviews
  (product_id, sku, nickname, email, headline, comments, rating)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING *;`, [review.id, review.sku, review.nickname, review.email,
    review.headline, review.comments, review.rating])
}
module.exports = { addNewReview };
