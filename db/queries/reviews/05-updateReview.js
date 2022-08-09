const updateReview = (db, data) => {
  return db.query(`
  UPDATE reviews
  SET display = $1,
      inactive = $2
  WHERE id = $3
  RETURNING *;`,
  [data.display, data.inactive, data.id])
}
module.exports = { updateReview };
