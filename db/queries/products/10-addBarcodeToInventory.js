const addBarcodeToInventory = (db, barcode) => {

  return db.query(`
  INSERT INTO inventory
    (barcode)
    VALUES ($1)
    RETURNING *;`, [barcode])
}
module.exports = { addBarcodeToInventory };
