const reduceInventory = (db, barcode, qty) => {
  return db.query(`
  UPDATE inventory
  SET quantity =
  CASE
    WHEN quantity >= $1 THEN quantity - $1
    ELSE 0
  END
  WHERE barcode = $2
  RETURNING *;`, [qty, barcode])
}
module.exports = { reduceInventory };
