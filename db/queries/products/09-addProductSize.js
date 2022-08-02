const addProductSize = (db, barcode, productId, sizeId) => {
  // console.log(barcode, productId, sizeId);
  return db.query(`
  INSERT INTO product_sizes
    (id, product_id, size_id)
   VALUES ($1, $2, $3)
   RETURNING *;`, [barcode, productId, sizeId])
}
module.exports = { addProductSize };
