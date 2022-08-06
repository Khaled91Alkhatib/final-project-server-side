const updateInventory = (db, barcode, qty) => {
  return db.query(`
  UPDATE inventory
  SET quantity = quantity + $1
  WHERE barcode = $2
  RETURNING *;`, [qty, barcode])
}
module.exports = { updateInventory };
