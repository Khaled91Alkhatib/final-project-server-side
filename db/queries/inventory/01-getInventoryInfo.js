const getInventoryInfo = (db) => {
  return db.query(`
  SELECT
    products.id as id, products.sku as sku, products.name as name, image1,
    product_sizes.id as barcode,
    sizes.size as size,
    inventory.quantity as qty
  FROM products
  JOIN product_sizes On product_sizes.product_id = products.id
  JOIN inventory On product_sizes.id = inventory.barcode
  JOIN sizes On product_sizes.size_id = sizes.id
  ORDER BY sku, size;`)
}

module.exports = { getInventoryInfo };
