const findProductSizeByBarcode = (db, barcode) => {
  // console.log(barcode, productId, sizeId);
  return db.query(`
  SELECT * FROM product_sizes
  WHERE id = $1;`, [barcode])
}
module.exports = { findProductSizeByBarcode };
